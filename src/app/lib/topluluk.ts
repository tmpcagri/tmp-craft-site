import { createClient } from "./supabase/client";

// Client-side Topluluk helpers (see supabase/migrations/0012_topluluk_schema.sql).
// Same pattern as lib/messages.ts: open a browser client per call, rely on
// RLS to scope what the caller can read/write, batch-join public_profiles
// separately since PostgREST embeds only work through declared FKs we
// haven't all declared (auth.users, not public.profiles).

export type TopicStatus = "open" | "packaging" | "pending_objection" | "finalized";

export type TopicSummary = {
  id: string;
  title: string;
  category: string;
  // Null if the topic's original author later deleted their account --
  // the topic (and any article built from it) survives regardless, see
  // 0012_topluluk_schema.sql's "on delete set null".
  authorId: string | null;
  authorUsername: string;
  status: TopicStatus;
  messageCount: number;
  createdAt: string;
};

export type TopicMessage = {
  id: string;
  topicId: string;
  authorId: string | null;
  authorUsername: string;
  authorAvatarUrl: string;
  body: string;
  createdAt: string;
};

export type Contributor = {
  userId: string;
  username: string;
  avatarUrl: string;
  rank: number;
  note: string;
  isFirst: boolean;
};

export type Article = {
  id: string;
  topicId: string;
  content: string;
  createdAt: string;
  objectionDeadline: string;
  finalizedAt: string | null;
  contributors: Contributor[];
};

export type TopicDetail = {
  id: string;
  title: string;
  category: string;
  authorId: string | null;
  authorUsername: string;
  status: TopicStatus;
  createdAt: string;
  messages: TopicMessage[];
  article: Article | null;
};

type ProfileRow = { id: string; username: string; avatar_url: string };

async function fetchProfiles(
  supabase: ReturnType<typeof createClient>,
  ids: (string | null)[],
): Promise<Map<string, { username: string; avatarUrl: string }>> {
  // Filter out null (author account deleted, see 0012's "on delete set
  // null") before querying -- PostgREST's `in` filter doesn't match NULL
  // columns against a null in the list, so passing it through is
  // pointless at best.
  const uniqueIds = [...new Set(ids)].filter((id): id is string => id !== null);
  if (uniqueIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from("public_profiles")
    .select("id, username, avatar_url")
    .in("id", uniqueIds);
  if (error) throw error;

  return new Map(
    (data ?? []).map((p: ProfileRow) => [
      p.id,
      { username: p.username, avatarUrl: p.avatar_url ?? "" },
    ]),
  );
}

// featured-posts.tsx bu listeyi çektikten sonra client-side filtreliyor
// (arama dahil) -- limit eskiden 50'ydi, bu da bir aramanın 50'den eski
// hiçbir konuyu asla bulamayacağı anlamına geliyordu (sessiz bir ölçek
// sınırı). 100'e çıkardık; sitenin şu anki ölçeğinde (diğer yerlerde de,
// ör. admin panelindeki konu listesinde, sayfalama yok) makul bir denge.
export async function listTopics(): Promise<TopicSummary[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("topics")
    .select("id, title, category, author_id, status, created_at, topic_messages(count)")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;

  const rows = data ?? [];
  const profiles = await fetchProfiles(
    supabase,
    rows.map((r) => r.author_id),
  );

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    authorId: r.author_id,
    authorUsername: profiles.get(r.author_id ?? "")?.username ?? "bilinmeyen",
    status: r.status as TopicStatus,
    messageCount: r.topic_messages?.[0]?.count ?? 0,
    createdAt: r.created_at,
  }));
}

export async function getTopic(topicId: string): Promise<TopicDetail | null> {
  const supabase = createClient();

  const { data: topic, error: topicError } = await supabase
    .from("topics")
    .select("id, title, category, author_id, status, created_at")
    .eq("id", topicId)
    .maybeSingle();
  if (topicError) throw topicError;
  if (!topic) return null;

  const { data: messageRows, error: messagesError } = await supabase
    .from("topic_messages")
    .select("id, topic_id, author_id, body, created_at")
    .eq("topic_id", topicId)
    .order("created_at", { ascending: true });
  if (messagesError) throw messagesError;

  const { data: articleRow, error: articleError } = await supabase
    .from("articles")
    .select("id, topic_id, content, created_at, objection_deadline, finalized_at")
    .eq("topic_id", topicId)
    .maybeSingle();
  if (articleError) throw articleError;

  let contributions: {
    user_id: string;
    rank: number;
    note: string;
    is_first: boolean;
  }[] = [];
  if (articleRow) {
    const { data: contribRows, error: contribError } = await supabase
      .from("article_contributions")
      .select("user_id, rank, note, is_first")
      .eq("article_id", articleRow.id)
      .order("rank", { ascending: true });
    if (contribError) throw contribError;
    contributions = contribRows ?? [];
  }

  const profileIds = [
    topic.author_id,
    ...(messageRows ?? []).map((m) => m.author_id),
    ...contributions.map((c) => c.user_id),
  ];
  const profiles = await fetchProfiles(supabase, profileIds);

  const messages: TopicMessage[] = (messageRows ?? []).map((m) => ({
    id: m.id,
    topicId: m.topic_id,
    authorId: m.author_id,
    authorUsername: profiles.get(m.author_id ?? "")?.username ?? "bilinmeyen",
    authorAvatarUrl: profiles.get(m.author_id ?? "")?.avatarUrl ?? "",
    body: m.body,
    createdAt: m.created_at,
  }));

  const article: Article | null = articleRow
    ? {
        id: articleRow.id,
        topicId: articleRow.topic_id,
        content: articleRow.content,
        createdAt: articleRow.created_at,
        objectionDeadline: articleRow.objection_deadline,
        finalizedAt: articleRow.finalized_at,
        contributors: contributions.map((c) => ({
          userId: c.user_id,
          username: profiles.get(c.user_id)?.username ?? "bilinmeyen",
          avatarUrl: profiles.get(c.user_id)?.avatarUrl ?? "",
          rank: c.rank,
          note: c.note,
          isFirst: c.is_first,
        })),
      }
    : null;

  return {
    id: topic.id,
    title: topic.title,
    category: topic.category,
    authorId: topic.author_id,
    authorUsername: profiles.get(topic.author_id ?? "")?.username ?? "bilinmeyen",
    status: topic.status as TopicStatus,
    createdAt: topic.created_at,
    messages,
    article,
  };
}

export async function createTopic(
  title: string,
  category: string,
  body: string,
): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Konu açmak için giriş yapmalısın.");

  const { data: topic, error: topicError } = await supabase
    .from("topics")
    .insert({ title, category, author_id: user.id })
    .select("id")
    .single();
  if (topicError) throw topicError;

  const { error: messageError } = await supabase
    .from("topic_messages")
    .insert({ topic_id: topic.id, author_id: user.id, body });
  if (messageError) {
    // Best-effort cleanup so a failed opening post doesn't leave an empty
    // ghost topic behind.
    await supabase.from("topics").delete().eq("id", topic.id);
    throw messageError;
  }

  return topic.id;
}

export async function postMessage(topicId: string, body: string): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Yanıt yazmak için giriş yapmalısın.");

  const { error } = await supabase
    .from("topic_messages")
    .insert({ topic_id: topicId, author_id: user.id, body });
  if (error) throw error;
}

export async function postObjection(articleId: string, body: string): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("İtiraz etmek için giriş yapmalısın.");

  const { error } = await supabase
    .from("article_objections")
    .insert({ article_id: articleId, user_id: user.id, body });
  if (error) throw error;
}

export type ObjectionRow = {
  id: string;
  username: string;
  body: string;
  createdAt: string;
};

export async function listObjections(articleId: string): Promise<ObjectionRow[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("article_objections")
    .select("id, user_id, body, created_at")
    .eq("article_id", articleId)
    .order("created_at", { ascending: true });
  if (error) throw error;

  const rows = data ?? [];
  const profiles = await fetchProfiles(
    supabase,
    rows.map((r) => r.user_id),
  );

  return rows.map((r) => ({
    id: r.id,
    username: profiles.get(r.user_id)?.username ?? "bilinmeyen",
    body: r.body,
    createdAt: r.created_at,
  }));
}

// Client-side check for whether the signed-in user can curate Topluluk
// articles (trigger packaging / finalize). RLS is the real gate -- this
// is only used to decide whether to show moderator-only controls.
export async function getMyModeratorFlags(): Promise<{
  isOwner: boolean;
  canCurate: boolean;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { isOwner: false, canCurate: false };

  const { data, error } = await supabase
    .from("profiles")
    .select("is_owner, permissions")
    .eq("id", user.id)
    .single();
  if (error) {
    // Gerçek bir DB/ağ hatasını sessizce "moderatör değilsin"e
    // çevirmemek için en azından logluyoruz -- diğer fonksiyonlardaki
    // "hata varsa throw et" kuralına burada uymuyoruz çünkü çağıranlar
    // (.then(setModerator)) bir catch beklemiyor; en güvenli orta yol bu.
    console.error("getMyModeratorFlags:", error);
    return { isOwner: false, canCurate: false };
  }
  if (!data) return { isOwner: false, canCurate: false };

  return {
    isOwner: data.is_owner,
    canCurate: data.is_owner || (data.permissions ?? []).includes("articles"),
  };
}

// Moderator-only ("articles" permission) actions. RLS enforces the real
// permission check server-side -- these just make the calls.

export async function finalizeArticle(
  articleId: string,
  topicId: string,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("finalize_article", {
    p_article_id: articleId,
    p_topic_id: topicId,
  });
  if (error) throw error;
}
