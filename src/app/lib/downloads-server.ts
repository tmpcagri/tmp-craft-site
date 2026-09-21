import { downloadItems, type DownloadItem } from "./downloads";
import { createClient } from "./supabase/server";
import { toDownloadItem, type ModPackageRow } from "./mod-packages";

// Sunucu (server component) tarafında -- sabit tohum listesiyle
// moderatörlerin yüklediği gerçek mod paketlerini birleştiriyor. Hata
// durumunda (ör. tablo henüz migration'lanmadıysa) sessizce sadece sabit
// listeye düşüyor, sayfa hiçbir zaman bu yüzden kırılmasın diye.
export async function getAllDownloadItems(): Promise<DownloadItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("mod_packages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return downloadItems;
    const dbItems = (data as ModPackageRow[]).map(toDownloadItem);
    // Aynı slug hem statik seed'de hem DB'de varsa (moderatör mevcut bir
    // modla aynı isimde paket eklerse) DB kaydı kazanır -- iki tarafta da
    // aynı slug'ın yaşamasına izin verilirse listelerde/route'larda
    // belirsiz davranış olur.
    const bySlug = new Map<string, DownloadItem>();
    for (const item of dbItems) bySlug.set(item.slug, item);
    for (const item of downloadItems) if (!bySlug.has(item.slug)) bySlug.set(item.slug, item);
    return Array.from(bySlug.values());
  } catch {
    return downloadItems;
  }
}
