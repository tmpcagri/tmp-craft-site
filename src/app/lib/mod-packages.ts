import { createClient } from "./supabase/client";
import type {
  DownloadCategory,
  DownloadItem,
  Environment,
  License,
  Loader,
} from "./downloads";

// Moderatörlerin /admin üzerinden yüklediği gerçek mod paketleri --
// src/app/lib/downloads.ts'deki sabit dizinin ÜSTÜNE eklenen bir tablo,
// onun yerine geçmiyor (bkz. 0019_mod_packages_table.sql'deki not).
export type ModPackageRow = {
  slug: string;
  name: string;
  category: DownloadCategory;
  description: string;
  gradient: string;
  game_version: string;
  loader: Loader;
  environment: Environment;
  license: License;
  depends_on: string[];
  author: string;
  icon_image: string | null;
  author_link: string | null;
  youtube_url: string | null;
  background_image: string | null;
  gallery_images: string[];
  body_text: string | null;
  schematic_java_url: string | null;
  schematic_bedrock_url: string | null;
  created_at: string;
};

export function toDownloadItem(row: ModPackageRow): DownloadItem {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    gradient: row.gradient,
    gameVersion: row.game_version,
    loader: row.loader,
    environment: row.environment,
    license: row.license,
    dependsOn: row.depends_on ?? [],
    author: row.author,
    iconImage: row.icon_image ?? undefined,
    authorLink: row.author_link ?? undefined,
    youtubeUrl: row.youtube_url ?? undefined,
    backgroundImage: row.background_image ?? undefined,
    galleryImages: row.gallery_images ?? [],
    bodyText: row.body_text ?? undefined,
    schematicJavaUrl: row.schematic_java_url ?? undefined,
    schematicBedrockUrl: row.schematic_bedrock_url ?? undefined,
  };
}

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function listModPackages(): Promise<ModPackageRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("mod_packages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ModPackageRow[];
}

export type ModPackageInput = {
  name: string;
  category: DownloadCategory;
  description: string;
  gradient: string;
  gameVersion: string;
  loader: Loader;
  environment: Environment;
  license: License;
  dependsOn: string[];
  author: string;
  iconImage: string | null;
  authorLink: string | null;
  youtubeUrl: string | null;
  backgroundImage: string | null;
  galleryImages: string[];
  bodyText: string | null;
  schematicJavaUrl: string | null;
  schematicBedrockUrl: string | null;
};

export async function createModPackage(input: ModPackageInput): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const slug = slugify(input.name);
  const { error } = await supabase.from("mod_packages").insert({
    slug,
    name: input.name,
    category: input.category,
    description: input.description,
    gradient: input.gradient,
    game_version: input.gameVersion,
    loader: input.loader,
    environment: input.environment,
    license: input.license,
    depends_on: input.dependsOn,
    author: input.author,
    icon_image: input.iconImage,
    author_link: input.authorLink,
    youtube_url: input.youtubeUrl,
    background_image: input.backgroundImage,
    gallery_images: input.galleryImages,
    body_text: input.bodyText,
    schematic_java_url: input.schematicJavaUrl,
    schematic_bedrock_url: input.schematicBedrockUrl,
    created_by: user?.id ?? null,
  });
  if (error) throw error;
  return slug;
}

export async function updateModPackage(
  slug: string,
  patch: Partial<ModPackageInput>,
): Promise<void> {
  const supabase = createClient();
  const dbPatch: Record<string, unknown> = {};
  if (patch.name !== undefined) dbPatch.name = patch.name;
  if (patch.category !== undefined) dbPatch.category = patch.category;
  if (patch.description !== undefined) dbPatch.description = patch.description;
  if (patch.gradient !== undefined) dbPatch.gradient = patch.gradient;
  if (patch.gameVersion !== undefined) dbPatch.game_version = patch.gameVersion;
  if (patch.loader !== undefined) dbPatch.loader = patch.loader;
  if (patch.environment !== undefined) dbPatch.environment = patch.environment;
  if (patch.license !== undefined) dbPatch.license = patch.license;
  if (patch.dependsOn !== undefined) dbPatch.depends_on = patch.dependsOn;
  if (patch.author !== undefined) dbPatch.author = patch.author;
  if (patch.iconImage !== undefined) dbPatch.icon_image = patch.iconImage;
  if (patch.authorLink !== undefined) dbPatch.author_link = patch.authorLink;
  if (patch.youtubeUrl !== undefined) dbPatch.youtube_url = patch.youtubeUrl;
  if (patch.backgroundImage !== undefined) dbPatch.background_image = patch.backgroundImage;
  if (patch.galleryImages !== undefined) dbPatch.gallery_images = patch.galleryImages;
  if (patch.bodyText !== undefined) dbPatch.body_text = patch.bodyText;
  if (patch.schematicJavaUrl !== undefined) dbPatch.schematic_java_url = patch.schematicJavaUrl;
  if (patch.schematicBedrockUrl !== undefined)
    dbPatch.schematic_bedrock_url = patch.schematicBedrockUrl;

  const { error } = await supabase
    .from("mod_packages")
    .update(dbPatch)
    .eq("slug", slug);
  if (error) throw error;
}

export async function deleteModPackage(slug: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("mod_packages").delete().eq("slug", slug);
  if (error) throw error;
}
