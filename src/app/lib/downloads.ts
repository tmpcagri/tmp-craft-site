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

const raw: Omit<DownloadItem, "slug">[] = [
  { name: "Terra Forge", category: "Mods", description: "Gelişmiş dünya üretimi ve yapı sistemi ekler.", gradient: "from-emerald-500 to-teal-700", gameVersion: "1.21", loader: "Forge", environment: "Client + Server", license: "MIT", dependsOn: [], author: "TMPCraft" },
  { name: "Beast Tamer", category: "Mods", description: "Yeni yaratıklar evcilleştirme mekaniği.", gradient: "from-orange-500 to-red-600", gameVersion: "1.20.4", loader: "Fabric", environment: "Client + Server", license: "CC-BY", dependsOn: ["terra-forge"], author: "modrehberi" },
  { name: "Auto Farm Pro", category: "Mods", description: "Otomatik tarım ve üretim zincirleri.", gradient: "from-lime-500 to-green-700", gameVersion: "1.21", loader: "NeoForge", environment: "Server", license: "GPL-3.0", dependsOn: [], author: "redstonecu42" },

  { name: "Neon Craft", category: "Resource Packs", description: "Parlak, canlı renklerle yeniden tasarlanmış dokular.", gradient: "from-purple-500 to-fuchsia-600", gameVersion: "1.21", loader: "Vanilla", environment: "Client", license: "All Rights Reserved", dependsOn: [], author: "TMPCraft" },
  { name: "Rustic Realms", category: "Resource Packs", description: "Sıcak, doğal ve rustik bir görünüm.", gradient: "from-amber-500 to-orange-700", gameVersion: "1.20", loader: "Vanilla", environment: "Client", license: "CC-BY", dependsOn: [], author: "modrehberi" },
  { name: "Frost Peak", category: "Resource Packs", description: "Buzul temalı, soğuk tonlarda dokular.", gradient: "from-cyan-400 to-blue-600", gameVersion: "1.21", loader: "Vanilla", environment: "Client", license: "CC-BY", dependsOn: [], author: "TMPCraft" },

  { name: "Void Walker", category: "Data Packs", description: "Yeni boyutlar ve gizli geçitler ekler.", gradient: "from-slate-600 to-indigo-800", gameVersion: "1.21", loader: "Vanilla", environment: "Server", license: "MIT", dependsOn: [], author: "redstonecu42" },
  { name: "Loot Master", category: "Data Packs", description: "Özelleştirilmiş ganimet tabloları.", gradient: "from-yellow-600 to-amber-800", gameVersion: "1.20.4", loader: "Vanilla", environment: "Server", license: "MIT", dependsOn: [], author: "modrehberi" },

  { name: "Sunset Vale", category: "Shaders", description: "Sinematik aydınlatma ve gölgeler.", gradient: "from-orange-400 to-pink-600", gameVersion: "1.21", loader: "Fabric", environment: "Client", license: "All Rights Reserved", dependsOn: [], author: "TMPCraft" },
  { name: "Crystal Clear", category: "Shaders", description: "Su ve cam için gerçekçi yansımalar.", gradient: "from-sky-400 to-cyan-600", gameVersion: "1.20", loader: "Fabric", environment: "Client", license: "All Rights Reserved", dependsOn: [], author: "modrehberi" },

  { name: "Emerald Grove", category: "Modpacks", description: "Doğa ve keşif odaklı mod koleksiyonu.", gradient: "from-emerald-500 to-green-700", gameVersion: "1.20.4", loader: "Forge", environment: "Client + Server", license: "CC-BY", dependsOn: ["terra-forge", "beast-tamer"], author: "TMPCraft" },
  { name: "Iron Forge", category: "Modpacks", description: "Endüstriyel üretim ve teknoloji paketi.", gradient: "from-zinc-500 to-neutral-700", gameVersion: "1.21", loader: "NeoForge", environment: "Client + Server", license: "GPL-3.0", dependsOn: ["auto-farm-pro"], author: "redstonecu42" },
  { name: "Coral Reef", category: "Modpacks", description: "Okyanus keşfi temalı mod paketi.", gradient: "from-teal-400 to-cyan-600", gameVersion: "1.20", loader: "Fabric", environment: "Client + Server", license: "CC-BY", dependsOn: [], author: "modrehberi" },

  { name: "EssentialsX", category: "Plugins", description: "Sunucu yönetimi için temel komutlar.", gradient: "from-blue-500 to-indigo-700", gameVersion: "1.21", loader: "Vanilla", environment: "Server", license: "GPL-3.0", dependsOn: [], author: "TMPCraft" },
  { name: "GuardianShield", category: "Plugins", description: "Arazi koruma ve izin sistemi.", gradient: "from-red-500 to-rose-700", gameVersion: "1.20.4", loader: "Vanilla", environment: "Server", license: "MIT", dependsOn: ["essentialsx"], author: "redstonecu42" },

  { name: "TMP Survival", category: "Servers", description: "Klasik hayatta kalma deneyimi, topluluk odaklı.", gradient: "from-green-600 to-emerald-800", gameVersion: "1.21", loader: "Vanilla", environment: "Server", license: "All Rights Reserved", dependsOn: [], author: "TMPCraft" },
  { name: "TMP Creative", category: "Servers", description: "Sınırsız yaratıcılık için inşa sunucusu.", gradient: "from-violet-500 to-purple-700", gameVersion: "1.21", loader: "Vanilla", environment: "Server", license: "All Rights Reserved", dependsOn: [], author: "TMPCraft" },
];

export const downloadItems: DownloadItem[] = raw.map((item) => ({
  ...item,
  slug: item.name.toLowerCase().replace(/\s+/g, "-"),
}));

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
