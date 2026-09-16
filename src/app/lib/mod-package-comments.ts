import { createClient } from "./supabase/client";

// Mod paketi detay sayfasındaki yorumlar (bkz.
// 0026_mod_package_comments_and_youtube.sql). topluluk.ts'teki
// topic_messages deseniyle aynı: public_profiles'ı FK embed olmadığı için
// ayrıca batch çekiyoruz.

export type ModPackageComment = {
  id: string;
  authorId: string | null;
  authorUsername: string;
  authorAvatarUrl: string;
  body: string;
  createdAt: string;
};

export async function listModPackageComments(
  slug: string,
): Promise<ModPackageComment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("mod_package_comments")
    .select("id, author_id, body, created_at")
    .eq("item_slug", slug)
    .order("created_at", { ascending: true });
  if (error) throw error;

  const rows = data ?? [];
  const authorIds = [...new Set(rows.map((r) => r.author_id))];

  const profiles = new Map<string, { username: string; avatarUrl: string }>();
  if (authorIds.length > 0) {
    const { data: profileRows, error: profileError } = await supabase
      .from("public_profiles")
      .select("id, username, avatar_url")
      .in("id", authorIds);
    if (profileError) throw profileError;
    for (const p of profileRows ?? []) {
      profiles.set(p.id, { username: p.username, avatarUrl: p.avatar_url ?? "" });
    }
  }

  return rows.map((r) => ({
    id: r.id,
    authorId: r.author_id,
    authorUsername: profiles.get(r.author_id)?.username ?? "bilinmeyen",
    authorAvatarUrl: profiles.get(r.author_id)?.avatarUrl ?? "",
    body: r.body,
    createdAt: r.created_at,
  }));
}

export async function postModPackageComment(
  slug: string,
  body: string,
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Yorum yazmak için giriş yapmalısın.");

  const { error } = await supabase
    .from("mod_package_comments")
    .insert({ item_slug: slug, author_id: user.id, body });
  if (error) throw error;
}

export async function deleteModPackageComment(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("mod_package_comments").delete().eq("id", id);
  if (error) throw error;
}

// Silme butonunu göstermek için: sahibi owner mı yoksa 'mods' izni var mı.
export async function canModerateModPackageComments(): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("profiles")
    .select("is_owner, permissions")
    .eq("id", user.id)
    .single();
  if (error || !data) return false;

  return Boolean(data.is_owner) || (data.permissions ?? []).includes("mods");
}
