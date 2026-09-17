import { createClient } from "./supabase/server";
import type { ModPackageVersionRow } from "./mod-package-versions";

// Sunucu (server component) tarafında -- /mod-paketleri/[slug] bir paketin
// kendi versiyon satırlarını VE her bağımlılığının versiyon satırlarını tek
// seferde çeker (bkz. "Bağımlılıklarla Birlikte İndir" -- aynı sürüm/loader
// kombinasyonunda bağımlılığın da linki var mı diye bakılacak). Migration
// henüz uygulanmadıysa (tablo yok) ya da sorgu hata verirse boş obje
// döner -- sayfa eski tek-sürüm davranışına düşer, çökmez.
export async function getVersionsForSlugs(
  slugs: string[],
): Promise<Record<string, ModPackageVersionRow[]>> {
  if (slugs.length === 0) return {};
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("mod_package_versions")
      .select("*")
      .in("mod_package_slug", slugs);
    if (error || !data) return {};
    const bySlug: Record<string, ModPackageVersionRow[]> = {};
    for (const row of data as ModPackageVersionRow[]) {
      (bySlug[row.mod_package_slug] ??= []).push(row);
    }
    return bySlug;
  } catch {
    return {};
  }
}
