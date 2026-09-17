import { createClient } from "./supabase/client";

// Moderatörün mevcut (statik) bir rehbere eklediği gerçek içerik --
// lib/guides.ts'teki rehberin KENDİSİ değişmiyor, bu sadece slug'a bağlı bir
// ek katman (bkz. 0028_guide_details_table.sql). Tüm alanlar opsiyonel --
// bir rehberin hiç satırı olmayabilir, o zaman detay sayfası eskisi gibi
// sadece statik guide.description/videoUrl'i gösterir.
export type GuideDetailsRow = {
  slug: string;
  youtube_url: string | null;
  image_url: string | null;
  body_text: string | null;
  schematic_java_url: string | null;
  schematic_bedrock_url: string | null;
  updated_at: string;
};

export type GuideDetails = {
  slug: string;
  youtubeUrl: string | null;
  imageUrl: string | null;
  bodyText: string | null;
  schematicJavaUrl: string | null;
  schematicBedrockUrl: string | null;
};

function toGuideDetails(row: GuideDetailsRow): GuideDetails {
  return {
    slug: row.slug,
    youtubeUrl: row.youtube_url,
    imageUrl: row.image_url,
    bodyText: row.body_text,
    schematicJavaUrl: row.schematic_java_url,
    schematicBedrockUrl: row.schematic_bedrock_url,
  };
}

export async function getGuideDetails(slug: string): Promise<GuideDetails | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("guide_details")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? toGuideDetails(data as GuideDetailsRow) : null;
}

export async function listAllGuideDetails(): Promise<Record<string, GuideDetails>> {
  const supabase = createClient();
  const { data, error } = await supabase.from("guide_details").select("*");
  if (error) throw error;
  const bySlug: Record<string, GuideDetails> = {};
  for (const row of (data ?? []) as GuideDetailsRow[]) {
    bySlug[row.slug] = toGuideDetails(row);
  }
  return bySlug;
}

export type GuideDetailsInput = {
  youtubeUrl: string | null;
  imageUrl: string | null;
  bodyText: string | null;
  schematicJavaUrl: string | null;
  schematicBedrockUrl: string | null;
};

// Tek satırlık bir "upsert" -- moderatör panelinde tek bir kaydet butonu
// yeterli, ayrı create/update akışına gerek yok (slug tekil ve önceden
// biliniyor, guides.ts'ten geliyor).
export async function saveGuideDetails(
  slug: string,
  input: GuideDetailsInput,
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase.from("guide_details").upsert({
    slug,
    youtube_url: input.youtubeUrl,
    image_url: input.imageUrl,
    body_text: input.bodyText,
    schematic_java_url: input.schematicJavaUrl,
    schematic_bedrock_url: input.schematicBedrockUrl,
    updated_by: user?.id ?? null,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}
