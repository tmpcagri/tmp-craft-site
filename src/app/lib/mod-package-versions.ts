import { createClient } from "./supabase/client";
import type { Loader } from "./downloads";

// Bir mod_packages satırının sürüm+loader başına gerçek indirme linkleri --
// bkz. 0030_mod_package_versions.sql. mod_packages'ın ÜSTÜNE eklenen bir
// tablo, sadece DB paketlerinde olur (statik seed'de hiç satırı yok).
export type ModPackageVersionRow = {
  id: string;
  mod_package_slug: string;
  game_version: string;
  loader: Loader;
  download_url: string;
  created_at: string;
};

export async function listVersionsForPackage(
  slug: string,
): Promise<ModPackageVersionRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("mod_package_versions")
    .select("*")
    .eq("mod_package_slug", slug)
    .order("game_version", { ascending: false });
  if (error) throw error;
  return data as ModPackageVersionRow[];
}

export async function addModPackageVersion(input: {
  modPackageSlug: string;
  gameVersion: string;
  loader: Loader;
  downloadUrl: string;
}): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase.from("mod_package_versions").insert({
    mod_package_slug: input.modPackageSlug,
    game_version: input.gameVersion,
    loader: input.loader,
    download_url: input.downloadUrl,
    created_by: user?.id ?? null,
  });
  if (error) throw error;
}

export async function deleteModPackageVersion(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("mod_package_versions").delete().eq("id", id);
  if (error) throw error;
}
