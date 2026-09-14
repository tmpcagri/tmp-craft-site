import { createClient } from "./supabase/client";

export type EngagementCounts = { like: number; save: number };
export type MyEngagement = { liked: boolean; saved: boolean };

export async function getEngagementCounts(
  slug: string,
): Promise<EngagementCounts> {
  const supabase = createClient();
  const { data } = await supabase.rpc("mod_engagement_counts", { slug });
  const counts: EngagementCounts = { like: 0, save: 0 };
  for (const row of data ?? []) {
    if (row.kind === "like") counts.like = Number(row.count);
    if (row.kind === "save") counts.save = Number(row.count);
  }
  return counts;
}

export async function getMyEngagement(slug: string): Promise<MyEngagement> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { liked: false, saved: false };

  const { data } = await supabase
    .from("mod_engagement")
    .select("kind")
    .eq("item_slug", slug)
    .eq("user_id", user.id);

  const kinds = new Set((data ?? []).map((r) => r.kind));
  return { liked: kinds.has("like"), saved: kinds.has("save") };
}

export async function setEngagement(
  slug: string,
  kind: "like" | "save",
  active: boolean,
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not signed in");

  const { error } = active
    ? await supabase
        .from("mod_engagement")
        .upsert({ user_id: user.id, item_slug: slug, kind })
    : await supabase
        .from("mod_engagement")
        .delete()
        .eq("user_id", user.id)
        .eq("item_slug", slug)
        .eq("kind", kind);

  if (error) throw error;
}

export async function recordDownloadClick(slug: string): Promise<number> {
  const supabase = createClient();
  const { data } = await supabase.rpc("increment_download_count", { slug });
  return typeof data === "number" ? data : 0;
}

export async function getDownloadCount(slug: string): Promise<number> {
  const supabase = createClient();
  const { data } = await supabase
    .from("mod_download_counts")
    .select("count")
    .eq("item_slug", slug)
    .maybeSingle();
  return data?.count ?? 0;
}

export type SavedItem = { itemSlug: string; createdAt: string };

export async function getMySavedSlugs(): Promise<SavedItem[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("mod_engagement")
    .select("item_slug, created_at")
    .eq("user_id", user.id)
    .eq("kind", "save")
    .order("created_at", { ascending: false });

  return (data ?? []).map((r) => ({
    itemSlug: r.item_slug,
    createdAt: r.created_at,
  }));
}
