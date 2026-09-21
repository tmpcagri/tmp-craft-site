export type DownloadCategory =
  | "Mods"
  | "Resource Packs"
  | "Data Packs"
  | "Shaders"
  | "Modpacks"
  | "Plugins"
  | "Servers";

export const DOWNLOAD_CATEGORIES: DownloadCategory[] = [
  "Mods",
  "Resource Packs",
  "Data Packs",
  "Shaders",
  "Modpacks",
  "Plugins",
  "Servers",
];

// Moderatörün kaydettiği sıralama (content.modPaketleriPage.categoryOrder)
// bilinmeyen/eksik değerler içerebilir -- yeni bir DOWNLOAD_CATEGORIES
// üyesi eklendi ama sıraya henüz girmedi, ya da JSON elle bozuldu. Bilinen
// kategorileri verilen sırayla önce koy, eksik kalanları sabit sıradaki
// haliyle sona ekle, tanınmayanları at.
export function normalizeCategoryOrder(order: string[]): DownloadCategory[] {
  const known = order.filter((c): c is DownloadCategory =>
    DOWNLOAD_CATEGORIES.includes(c as DownloadCategory),
  );
  const missing = DOWNLOAD_CATEGORIES.filter((c) => !known.includes(c));
  return [...known, ...missing];
}

export const CATEGORY_TR: Record<DownloadCategory, string> = {
  Mods: "Modlar",
  "Resource Packs": "Doku Paketleri",
  "Data Packs": "Veri Paketleri",
  Shaders: "Gölgelendiriciler",
  Modpacks: "Mod Paketleri",
  Plugins: "Eklentiler",
  Servers: "Sunucular",
};

export type Loader = "Forge" | "Fabric" | "Quilt" | "NeoForge" | "Vanilla";
export type Environment = "Client" | "Server" | "Client + Server";
export type License = "MIT" | "CC-BY" | "GPL-3.0" | "All Rights Reserved";

export const LICENSE_URLS: Record<License, string | null> = {
  MIT: "https://opensource.org/license/mit",
  "CC-BY": "https://creativecommons.org/licenses/by/4.0/",
  "GPL-3.0": "https://www.gnu.org/licenses/gpl-3.0.html",
  "All Rights Reserved": null,
};

export type DownloadItem = {
  slug: string;
  name: string;
  category: DownloadCategory;
  description: string;
  gradient: string;
  gameVersion: string;
  loader: Loader;
  environment: Environment;
  license: License;
  /** Bağımlı olunan diğer öğelerin slug'ı (isim DEĞİL -- biri adını değiştirse link kopmasın diye). */
  dependsOn: string[];
  author: string;
  /** Yalnızca yapımcı TMP Craft'a üye olup içeriği kendisi paylaştığında dolu olur. Boşsa kutucukta kategori renkli placeholder gösterilir. */
  iconImage?: string;
  /** Yapımcının resmi sitesi/sosyal medyası — yalnızca üye olup kendisi eklediğinde dolu olur. */
  authorLink?: string;
  /** Tanıtım/inceleme videosu -- doluysa detay sayfasında gömülü YouTube player gösterilir. */
  youtubeUrl?: string;
  /** Detay sayfası hero bandının arka planı -- yalnızca DB paketlerinde (mod_packages) olur, statik seed'de yok. */
  backgroundImage?: string;
  /** Ek içerik/galeri görselleri, sıralı. */
  galleryImages?: string[];
  /** description'ın ötesinde uzun detay metni. */
  bodyText?: string;
  /** Şematik/Litematica indirme linkleri -- bkz. projeler/schematic-download-button.tsx. */
  schematicJavaUrl?: string;
  schematicBedrockUrl?: string;
};

// Mod/modpack/kaynak paketi/sunucu kataloğu henüz gerçek (moderatör
// tarafından girilen) bir özellik değil -- eski sahte/demo veriler
// (Terra Forge, Beast Tamer vb.) kaldırıldı, gerçek içerik gelene kadar
// bilerek boş. Tip/kategori/yardımcı fonksiyon export'ları diğer
// dosyaların (filtreler, arama, moderatör paneli, detay sayfası)
// kırılmaması için aynen duruyor.
export const downloadItems: DownloadItem[] = [];

export const GAME_VERSIONS = Array.from(
  new Set(downloadItems.map((i) => i.gameVersion)),
).sort().reverse();
export const LOADERS: Loader[] = ["Forge", "Fabric", "Quilt", "NeoForge", "Vanilla"];
export const ENVIRONMENTS: Environment[] = ["Client", "Server", "Client + Server"];
export const LICENSES: License[] = ["MIT", "CC-BY", "GPL-3.0", "All Rights Reserved"];

export function searchDownloads(query: string): DownloadItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return downloadItems.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q),
  );
}
