import { NextResponse } from "next/server";
import { getCurrentModerator } from "@/app/lib/permissions";
import { createClient } from "@/app/lib/supabase/server";

// Triggers AI packaging of a Topluluk konusu: reads the full raw
// discussion, asks Claude to distill it into a permanent Turkish article
// plus a ranked, scoreless contributor list, then stores the result and
// opens a 7-day objection window. Moderator-only ("articles" permission
// or site owner) -- see supabase/migrations/0012_topluluk_schema.sql.
//
// The actual writes (article + contributions + final status flip) happen
// inside the package_topic_article() Postgres function, not here -- that
// function rolls the topic back to 'open' itself if anything inside it
// fails, so a bad AI response or insert error can never leave a topic
// stuck in 'packaging' forever.
//
// ANTHROPIC_API_KEY must be set in the server environment (never exposed
// to the client, never committed).

const OBJECTION_WINDOW_DAYS = 7;

type AiContributor = {
  username: string;
  rank: number;
  note: string;
  isFirst?: boolean;
};

type AiResult = {
  content: string;
  contributors: AiContributor[];
};

const SYSTEM_PROMPT = `Sen TMP Craft topluluk sitesinin arşiv editörüsün. Sana bir tartışma konusunun tüm ham mesajları verilecek. Görevin bu tartışmayı KALICI, tarafsız bir Türkçe özet maddeye dönüştürmek -- bir nevi küçük bir Wikipedia maddesi.

Kurallar:
- Sadece geçerli tek bir JSON nesnesiyle cevap ver. Düz metin, açıklama veya \`\`\` kod bloğu EKLEME.
- "content" alanı: 120-400 kelime, üçüncü şahıs, tarafsız üslupla yazılmış Türkçe özet. Tartışmada gerçek bir fikir ayrılığı/çözülmemiş anlaşmazlık varsa bunu dürüstçe belirt -- yapay bir uzlaşı uydurma.
- "contributors" alanı: tartışmaya GERÇEK katkı sağlayan kullanıcıların sıralı listesi (rank 1 = en çok katkı sağlayan, ardışık pozitif tam sayılar). Sadece verilen mesajlarda geçen kullanıcı adlarını kullan. Tek kelimelik onay mesajları ("katılıyorum", "+1" gibi) veya konuyla ilgisiz mesajlar YAZAN kişileri listeye ekleme -- minimum anlamlı katkı barını geçemeyenler listede yer almaz.
- Her contributor için "note": o kişinin katkısını özetleyen 3-8 kelimelik kısa Türkçe not (en fazla 300 karakter).
- Tam olarak bir contributor'a "isFirst": true ver -- konuya kalıcı ilk fikri/temel bilgiyi getiren kişi (mutlaka konuyu açan kişi olmak zorunda değil). Diğerlerinde bu alanı hiç yazma ya da false bırak.
- Kimse bar'ı geçemiyorsa "contributors" boş dizi olabilir.`;

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return (fenced ? fenced[1] : text).trim();
}

export async function POST(request: Request) {
  const moderator = await getCurrentModerator();
  if (!moderator || (!moderator.isOwner && !moderator.permissions.includes("articles"))) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY sunucu ortamında tanımlı değil." },
      { status: 500 },
    );
  }

  const { topicId } = (await request.json()) as { topicId?: string };
  if (!topicId) {
    return NextResponse.json({ error: "topicId eksik." }, { status: 400 });
  }

  const supabase = await createClient();

  // Atomic claim: only succeeds if the topic is still 'open'. If two
  // packaging requests race (double click, two moderators), only one of
  // these UPDATEs actually matches a row -- the loser gets 0 rows back
  // and bails immediately, before ever calling the AI.
  const { data: claimed, error: claimError } = await supabase
    .from("topics")
    .update({ status: "packaging" })
    .eq("id", topicId)
    .eq("status", "open")
    .select("id, title")
    .maybeSingle();
  if (claimError) {
    return NextResponse.json({ error: claimError.message }, { status: 500 });
  }
  if (!claimed) {
    return NextResponse.json(
      { error: "Konu bulunamadı, ya da zaten paketlenmiş/paketleniyor." },
      { status: 409 },
    );
  }

  const revertToOpen = () =>
    supabase.from("topics").update({ status: "open" }).eq("id", topicId);

  const { data: messageRows, error: messagesError } = await supabase
    .from("topic_messages")
    .select("author_id, body, created_at")
    .eq("topic_id", topicId)
    .order("created_at", { ascending: true });
  if (messagesError) {
    await revertToOpen();
    return NextResponse.json({ error: messagesError.message }, { status: 500 });
  }
  if (!messageRows || messageRows.length === 0) {
    await revertToOpen();
    return NextResponse.json({ error: "Konuda mesaj yok." }, { status: 400 });
  }

  const authorIds = [...new Set(messageRows.map((m) => m.author_id))];
  const { data: profileRows, error: profilesError } = await supabase
    .from("public_profiles")
    .select("id, username")
    .in("id", authorIds);
  if (profilesError) {
    await revertToOpen();
    return NextResponse.json({ error: profilesError.message }, { status: 500 });
  }

  const usernameById = new Map((profileRows ?? []).map((p) => [p.id, p.username]));
  const idByUsername = new Map((profileRows ?? []).map((p) => [p.username, p.id]));

  const transcript = messageRows
    .map((m) => `[${usernameById.get(m.author_id) ?? "bilinmeyen"}]: ${m.body}`)
    .join("\n");

  const userPrompt = `Konu başlığı: ${claimed.title}\n\nHam tartışma (kronolojik sırayla):\n${transcript}`;

  let aiResult: AiResult;
  try {
    const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Anthropic API hatası (${response.status}): ${errText}`);
    }

    const payload = await response.json();
    const text: string = payload?.content?.[0]?.text ?? "";
    aiResult = JSON.parse(extractJson(text)) as AiResult;

    if (typeof aiResult.content !== "string" || !Array.isArray(aiResult.contributors)) {
      throw new Error("AI çıktısı beklenen formatta değil.");
    }
  } catch (err) {
    await revertToOpen();
    const message = err instanceof Error ? err.message : "Paketleme başarısız oldu.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // Validate + sanitize the AI's contributor list before it ever reaches
  // the DB: resolve usernames to real user ids (silently dropping any
  // that don't match, e.g. a hallucinated name), require a positive
  // integer rank, and cap note length. package_topic_article() also has
  // a `rank > 0` / note-length check constraint as a second layer, but
  // failing that constraint would abort the whole function -- better to
  // never send garbage in the first place.
  const contributors = aiResult.contributors
    .map((c) => ({
      user_id: idByUsername.get(c.username),
      rank: Math.trunc(Number(c.rank)),
      note: String(c.note ?? "").slice(0, 300),
      is_first: Boolean(c.isFirst),
    }))
    .filter(
      (c): c is { user_id: string; rank: number; note: string; is_first: boolean } =>
        Boolean(c.user_id) && Number.isInteger(c.rank) && c.rank > 0,
    );

  const { data: articleId, error: packageError } = await supabase.rpc(
    "package_topic_article",
    {
      p_topic_id: topicId,
      p_content: aiResult.content,
      p_contributors: contributors,
      p_created_by: moderator.id,
      p_objection_days: OBJECTION_WINDOW_DAYS,
    },
  );
  if (packageError) {
    // package_topic_article() already reverted the topic to 'open' itself
    // (its own exception handler) -- no revertToOpen() call needed here.
    return NextResponse.json({ error: packageError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, articleId });
}
