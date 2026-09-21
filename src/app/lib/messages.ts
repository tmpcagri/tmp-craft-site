import { createClient } from "./supabase/client";

// Client-side direct-message helpers (see supabase/migrations/0004_messages.sql).
// Each function opens its own browser client (same pattern as auth-client.ts)
// and runs under the caller's own session -- `messages` RLS limits reads/
// writes to rows the caller is sender or receiver of, and `public_profiles`
// only ever exposes id/username/avatar_url, so nothing here needs to
// re-check ownership itself.

export type Conversation = {
  userId: string;
  username: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};

export type ThreadMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  readAt: string | null;
};

export type SearchedUser = {
  id: string;
  username: string;
  avatarUrl: string;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type MessageRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
};

function mapThreadMessage(row: MessageRow): ThreadMessage {
  return {
    id: row.id,
    senderId: row.sender_id,
    receiverId: row.receiver_id,
    content: row.content,
    createdAt: row.created_at,
    readAt: row.read_at,
  };
}

function mapSearchedUser(row: {
  id: string;
  username: string;
  avatar_url: string;
}): SearchedUser {
  return { id: row.id, username: row.username, avatarUrl: row.avatar_url ?? "" };
}

const MESSAGE_COLUMNS = "id, sender_id, receiver_id, content, created_at, read_at";

// Özel mesajlaşma (bu dosya) artık yalnızca moderatörler arasında --
// bkz. supabase/migrations/0032_restrict_messages_to_moderators.sql.
// Konu/sayfa bazlı kanallar için mod-chat.ts (moderatör ekibi) ve
// topluluk.ts (herkese açık konu tartışmaları) kullanılıyor.
// Aynı "moderatör mi" tanımı account-button.tsx'te de tekrarlanıyor.
export async function isCurrentUserModerator(): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("profiles")
    .select("is_owner, permissions")
    .eq("id", user.id)
    .single();
  if (!data) return false;

  return data.is_owner || (data.permissions ?? []).length > 0;
}

// Every conversation the signed-in user is part of, newest last-message
// first, with the other participant's public profile and unread count.
export async function listConversations(): Promise<Conversation[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("messages")
    .select(MESSAGE_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const latestByOther = new Map<string, ThreadMessage>();
  const unreadByOther = new Map<string, number>();

  for (const row of data ?? []) {
    const msg = mapThreadMessage(row);
    const otherId = msg.senderId === user.id ? msg.receiverId : msg.senderId;

    if (!latestByOther.has(otherId)) latestByOther.set(otherId, msg);
    if (msg.receiverId === user.id && msg.readAt === null) {
      unreadByOther.set(otherId, (unreadByOther.get(otherId) ?? 0) + 1);
    }
  }

  const otherIds = [...latestByOther.keys()];
  if (otherIds.length === 0) return [];

  const { data: profiles, error: profilesError } = await supabase
    .from("public_profiles")
    .select("id, username, avatar_url")
    .in("id", otherIds);
  if (profilesError) throw profilesError;

  const profileById = new Map(
    (profiles ?? []).map((p) => [p.id, mapSearchedUser(p)]),
  );

  return otherIds
    .map((id) => {
      const profile = profileById.get(id);
      const last = latestByOther.get(id)!;
      if (!profile) return null;
      return {
        userId: profile.id,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
        lastMessage: last.content,
        lastMessageAt: last.createdAt,
        unreadCount: unreadByOther.get(id) ?? 0,
      };
    })
    .filter((c): c is Conversation => c !== null)
    .sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
    );
}

// Full thread with one other user, oldest first.
export async function getThread(otherUserId: string): Promise<ThreadMessage[]> {
  if (!UUID_RE.test(otherUserId)) return [];

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("messages")
    .select(MESSAGE_COLUMNS)
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`,
    )
    .order("created_at", { ascending: true });
  if (error) throw error;

  return (data ?? []).map(mapThreadMessage);
}

export async function sendMessage(
  receiverId: string,
  content: string,
): Promise<ThreadMessage> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Mesaj göndermek için giriş yapmalısın.");

  const { data, error } = await supabase
    .from("messages")
    .insert({ sender_id: user.id, receiver_id: receiverId, content })
    .select(MESSAGE_COLUMNS)
    .single();
  if (error) throw error;

  return mapThreadMessage(data);
}

// Marks every unread message FROM otherUserId TO the signed-in user as
// read (call when a thread is opened). `messages_update_read_by_receiver`
// (0004) only lets the receiver flip their own `read_at`, so this can
// only ever touch messages addressed to the caller.
export async function markAsRead(otherUserId: string): Promise<void> {
  if (!UUID_RE.test(otherUserId)) return;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("sender_id", otherUserId)
    .eq("receiver_id", user.id)
    .is("read_at", null);
  if (error) throw error;
}

// Tek bir kullanıcının public profilini id'den çekiyor -- /mesajlar'ın
// ?to=<userId> deep-link'i (ör. /admin'deki mod sohbetinden bir isme
// tıklamak) için, o kullanıcı henüz conversations listesinde yoksa
// (hiç mesajlaşılmamışsa) username/avatar'ını gösterebilmek amacıyla.
export async function getPublicProfile(
  userId: string,
): Promise<SearchedUser | null> {
  if (!UUID_RE.test(userId)) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("public_profiles")
    .select("id, username, avatar_url")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;

  return data ? mapSearchedUser(data) : null;
}

// Username search against public_profiles, for picking who to message.
// Excludes the caller's own row. DM artık moderatör-moderatör olduğundan
// (bkz. isCurrentUserModerator ve migration 0032), sonuçlar her zaman
// moderatörlerle sınırlı -- normal kullanıcı zaten hiç mesaj gönderemez,
// moderatör de yalnızca başka bir moderatörle konuşabilir.
export async function searchUsers(query: string): Promise<SearchedUser[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let request = supabase
    .from("public_profiles")
    .select("id, username, avatar_url")
    .eq("is_moderator", true)
    .ilike("username", `%${trimmed}%`)
    .limit(20);
  if (user) request = request.neq("id", user.id);

  const { data, error } = await request;
  if (error) throw error;

  return (data ?? []).map(mapSearchedUser);
}
