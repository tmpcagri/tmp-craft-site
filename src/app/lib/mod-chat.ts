import { createClient } from "./supabase/client";

// Moderatör grup sohbeti -- lib/messages.ts'teki 1:1 DM deseninin aynısı
// (client-side, RLS zaten kimin okuyup/yazabileceğini kısıtlıyor, bkz.
// migration 0024), ama alıcı yok: tek oda, herkes aynı akışı görüyor.
export type ModChatMessage = {
  id: string;
  senderId: string | null;
  senderUsername: string;
  senderAvatarUrl: string;
  content: string;
  createdAt: string;
};

type ModChatRow = {
  id: string;
  sender_id: string | null;
  content: string;
  created_at: string;
};

// Son 200 mesaj, en eskiden en yeniye -- şimdilik geçmişe bir zaman sınırı
// yok, sadece sayıyla sınırlıyoruz.
export async function getModChatMessages(): Promise<ModChatMessage[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("mod_chat_messages")
    .select("id, sender_id, content, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;

  const rows = (data ?? []) as ModChatRow[];
  const senderIds = [...new Set(rows.map((r) => r.sender_id).filter((id): id is string => !!id))];

  const profileById = new Map<string, { username: string; avatarUrl: string }>();
  if (senderIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("public_profiles")
      .select("id, username, avatar_url")
      .in("id", senderIds);
    if (profilesError) throw profilesError;
    for (const p of profiles ?? []) {
      profileById.set(p.id, { username: p.username, avatarUrl: p.avatar_url ?? "" });
    }
  }

  return rows
    .map((row) => {
      const profile = row.sender_id ? profileById.get(row.sender_id) : undefined;
      return {
        id: row.id,
        senderId: row.sender_id,
        senderUsername: profile?.username ?? "Silinmiş hesap",
        senderAvatarUrl: profile?.avatarUrl ?? "",
        content: row.content,
        createdAt: row.created_at,
      };
    })
    .reverse();
}

export async function sendModChatMessage(content: string): Promise<void> {
  const trimmed = content.trim();
  if (!trimmed) return;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Mesaj göndermek için giriş yapmalısın.");

  const { error } = await supabase
    .from("mod_chat_messages")
    .insert({ sender_id: user.id, content: trimmed });
  if (error) throw error;
}
