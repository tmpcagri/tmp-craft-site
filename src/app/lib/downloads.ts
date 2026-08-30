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

export type Loader = "Forge" | "Fabric" | "Quilt" | "NeoForge" | "Vanilla";
export type Environment = "Client" | "Server" | "Client + Server";
export type License = "MIT" | "CC-BY" | "GPL-3.0" | "All Rights Reserved";

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
  dependsOn: string[];
};

const raw: Omit<DownloadItem, "slug">[] = [
  { name: "Terra Forge", category: "Mods", description: "Gelişmiş dünya üretimi ve yapı sistemi ekler.", gradient: "from-emerald-500 to-teal-700", gameVersion: "1.21", loader: "Forge", environment: "Client + Server", license: "MIT", dependsOn: [] },
  { name: "Beast Tamer", category: "Mods", description: "Yeni yaratıklar evcilleştirme mekaniği.", gradient: "from-orange-500 to-red-600", gameVersion: "1.20.4", loader: "Fabric", environment: "Client + Server", license: "CC-BY", dependsOn: ["Terra Forge"] },
  { name: "Auto Farm Pro", category: "Mods", description: "Otomatik tarım ve üretim zincirleri.", gradient: "from-lime-500 to-green-700", gameVersion: "1.21", loader: "NeoForge", environment: "Server", license: "GPL-3.0", dependsOn: [] },

  { name: "Neon Craft", category: "Resource Packs", description: "Parlak, canlı renklerle yeniden tasarlanmış dokular.", gradient: "from-purple-500 to-fuchsia-600", gameVersion: "1.21", loader: "Vanilla", environment: "Client", license: "All Rights Reserved", dependsOn: [] },
  { name: "Rustic Realms", category: "Resource Packs", description: "Sıcak, doğal ve rustik bir görünüm.", gradient: "from-amber-500 to-orange-700", gameVersion: "1.20", loader: "Vanilla", environment: "Client", license: "CC-BY", dependsOn: [] },
  { name: "Frost Peak", category: "Resource Packs", description: "Buzul temalı, soğuk tonlarda dokular.", gradient: "from-cyan-400 to-blue-600", gameVersion: "1.21", loader: "Vanilla", environment: "Client", license: "CC-BY", dependsOn: [] },

  { name: "Void Walker", category: "Data Packs", description: "Yeni boyutlar ve gizli geçitler ekler.", gradient: "from-slate-600 to-indigo-800", gameVersion: "1.21", loader: "Vanilla", environment: "Server", license: "MIT", dependsOn: [] },
  { name: "Loot Master", category: "Data Packs", description: "Özelleştirilmiş ganimet tabloları.", gradient: "from-yellow-600 to-amber-800", gameVersion: "1.20.4", loader: "Vanilla", environment: "Server", license: "MIT", dependsOn: [] },

  { name: "Sunset Vale", category: "Shaders", description: "Sinematik aydınlatma ve gölgeler.", gradient: "from-orange-400 to-pink-600", gameVersion: "1.21", loader: "Fabric", environment: "Client", license: "All Rights Reserved", dependsOn: [] },
  { name: "Crystal Clear", category: "Shaders", description: "Su ve cam için gerçekçi yansımalar.", gradient: "from-sky-400 to-cyan-600", gameVersion: "1.20", loader: "Fabric", environment: "Client", license: "All Rights Reserved", dependsOn: [] },

  { name: "Emerald Grove", category: "Modpacks", description: "Doğa ve keşif odaklı mod koleksiyonu.", gradient: "from-emerald-500 to-green-700", gameVersion: "1.20.4", loader: "Forge", environment: "Client + Server", license: "CC-BY", dependsOn: ["Terra Forge", "Beast Tamer"] },
  { name: "Iron Forge", category: "Modpacks", description: "Endüstriyel üretim ve teknoloji paketi.", gradient: "from-zinc-500 to-neutral-700", gameVersion: "1.21", loader: "NeoForge", environment: "Client + Server", license: "GPL-3.0", dependsOn: ["Auto Farm Pro"] },
  { name: "Coral Reef", category: "Modpacks", description: "Okyanus keşfi temalı mod paketi.", gradient: "from-teal-400 to-cyan-600", gameVersion: "1.20", loader: "Fabric", environment: "Client + Server", license: "CC-BY", dependsOn: [] },

  { name: "EssentialsX", category: "Plugins", description: "Sunucu yönetimi için temel komutlar.", gradient: "from-blue-500 to-indigo-700", gameVersion: "1.21", loader: "Vanilla", environment: "Server", license: "GPL-3.0", dependsOn: [] },
  { name: "GuardianShield", category: "Plugins", description: "Arazi koruma ve izin sistemi.", gradient: "from-red-500 to-rose-700", gameVersion: "1.20.4", loader: "Vanilla", environment: "Server", license: "MIT", dependsOn: ["EssentialsX"] },

  { name: "TMP Survival", category: "Servers", description: "Klasik hayatta kalma deneyimi, topluluk odaklı.", gradient: "from-green-600 to-emerald-800", gameVersion: "1.21", loader: "Vanilla", environment: "Server", license: "All Rights Reserved", dependsOn: [] },
  { name: "TMP Creative", category: "Servers", description: "Sınırsız yaratıcılık için inşa sunucusu.", gradient: "from-violet-500 to-purple-700", gameVersion: "1.21", loader: "Vanilla", environment: "Server", license: "All Rights Reserved", dependsOn: [] },
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
