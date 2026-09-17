import { createClient } from "./supabase/server";
import type { GuideDetails, GuideDetailsRow } from "./guide-details";

// Sunucu (server component) tarafında -- /projeler/[slug] bu satırı
// statik guide'ın üstüne bindirir. Hata durumunda (ör. migration henüz
// Supabase'e uygulanmadıysa) null döner, sayfa eskisi gibi sadece statik
// guide alanlarını gösterir.
export async function getGuideDetailsForSlug(slug: string): Promise<GuideDetails | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("guide_details")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return null;
    const row = data as GuideDetailsRow;
    return {
      slug: row.slug,
      youtubeUrl: row.youtube_url,
      imageUrl: row.image_url,
      bodyText: row.body_text,
      schematicJavaUrl: row.schematic_java_url,
      schematicBedrockUrl: row.schematic_bedrock_url,
    };
  } catch {
    return null;
  }
}
