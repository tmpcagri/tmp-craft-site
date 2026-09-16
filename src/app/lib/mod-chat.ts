import { createClient } from "./supabase/client";
import type { ModeratorTab } from "./permissions";

// Moderatör sohbeti -- lib/messages.ts'teki 1:1 DM deseninin aynısı
// (client-side, RLS zaten kimin okuyup/yazabileceğini kısıtlıyor, bkz.
// migration 0024), ama alıcı yok: bir kanaldaki herkes aynı akışı görüyor.
export type ModChatChannel =
  | "genel"
  | "ana-sayfa"
  | "mod-paketleri"
  | "sunucular"
  | "topluluk"
  | "site";

// Eski /admin GROUPS gruplamasıyla birebir aynı (bkz. admin/page.tsx'in
// wipe'tan önceki hali) -- migration 0024'teki can_access_mod_channel()
// SQL fonksiyonuyla senkron tutulmalı, biri değişirse diğeri de değişsin.
export const MOD_CHAT_CHANNELS: {
  id: ModChatChannel;
  label: string;
  tabs: ModeratorTab[];
}[] = [
  { id: "genel", label: "Genel", tabs: [] },
  {
    id: "ana-sayfa",
    label: "Ana Sayfa",
    tabs: ["cards", "occasion", "ticker", "hero", "panels"],
  },
  { id: "mod-paketleri", label: "Mod Paketleri", tabs: ["mods"] },
  { id: "sunucular", label: "Sunucular", tabs: ["servers"] },
  {
    id: "topluluk",
    label: "Topluluk",
    tabs: ["creators", "articles", "topluluk_hero"],
  },
  { id: "site", label: "Site", tabs: ["links"] },
];

// Hangi kanal pill'lerinin gösterileceğine karar vermek için -- gerçek
// erişim kontrolü her zaman RLS'te (can_access_mod_channel), bu sadece
// UI'da alakasız kanalları gizlemek için.
export function getAccessibleModChatChannels(moderator: {
  isOwner: boolean;
  permissions: ModeratorTab[];
}): ModChatChannel[] {
  if (moderator.isOwner) return MOD_CHAT_CHANNELS.map((c) => c.id);
  return MOD_CHAT_CHANNELS.filter((c) =>
    c.id === "genel"
      ? moderator.permissions.length > 0
      : c.tabs.some((t) => moderator.permissions.includes(t)),
  ).map((c) => c.id);
}

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
export async function getModChatMessages(
  channel: ModChatChannel,
): Promise<ModChatMessage[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("mod_chat_messages")
    .select("id, sender_id, content, created_at")
    .eq("channel", channel)
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

export async function sendModChatMessage(
  channel: ModChatChannel,
  content: string,
): Promise<void> {
  const trimmed = content.trim();
  if (!trimmed) return;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Mesaj göndermek için giriş yapmalısın.");

  const { error } = await supabase
    .from("mod_chat_messages")
    .insert({ sender_id: user.id, channel, content: trimmed });
  if (error) throw error;
}
