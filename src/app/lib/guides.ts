import { rawGuides } from "./guides-data";

export type GuideKind = "Build" | "Farm";

export type BuildCategory =
  | "Ev"
  | "Kale"
  | "Kule"
  | "Köprü"
  | "Redstone Yapı"
  | "Yüzen Ada"
  | "Yeraltı Üs"
  | "Köy"
  | "Piksel Sanat"
  | "Bahçe";

export type FarmCategory =
  | "Demir"
  | "Altın"
  | "Deneyim"
  | "Mob"
  | "Ekin"
  | "Şeker Kamışı"
  | "Balık"
  | "Ender İnci"
  | "Odun"
  | "Arı/Bal"
  | "Taş Üretici"
  | "Ametist"
  | "Kabak/Karpuz"
  | "İksir Malzemesi"
  | "Zümrüt";

export type GuideCategory = BuildCategory | FarmCategory;

export const BUILD_CATEGORIES: BuildCategory[] = [
  "Ev",
  "Kale",
  "Kule",
  "Köprü",
  "Redstone Yapı",
  "Yüzen Ada",
  "Yeraltı Üs",
  "Köy",
  "Piksel Sanat",
  "Bahçe",
];

export const FARM_CATEGORIES: FarmCategory[] = [
  "Demir",
  "Altın",
  "Deneyim",
  "Mob",
  "Ekin",
  "Şeker Kamışı",
  "Balık",
  "Ender İnci",
  "Odun",
  "Arı/Bal",
  "Taş Üretici",
  "Ametist",
  "Kabak/Karpuz",
  "İksir Malzemesi",
  "Zümrüt",
];

export type Difficulty = "Kolay" | "Orta" | "Zor";

export const DIFFICULTIES: Difficulty[] = ["Kolay", "Orta", "Zor"];

export type GuideSetting = "Doğal" | "Şehir";

export const GUIDE_SETTINGS: GuideSetting[] = ["Doğal", "Şehir"];

export type TerrainTag =
  | "Nehir"
  | "Göl"
  | "Dağ"
  | "Orman"
  | "Mağara"
  | "Köy"
  | "Kıyı";

export const TERRAIN_TAGS: TerrainTag[] = [
  "Nehir",
  "Göl",
  "Dağ",
  "Orman",
  "Mağara",
  "Köy",
  "Kıyı",
];

export type Guide = {
  slug: string;
  kind: GuideKind;
  title: string;
  category: GuideCategory;
  description: string;
  gradient: string;
  difficulty: Difficulty;
  materials: string[];
  usesMods: string[];
  hasSchematic: boolean;
  videoUrl?: string;
  author: string;
  views: number;
  setting: GuideSetting;
  terrain?: TerrainTag[];
  // Build'e özel
  buildTimeMinutes?: number;
  // Farm'a özel
  minVersion?: string;
  maxVersion?: string;
  yieldPerHour?: string;
  afkable?: boolean;
  requiresRedstone?: boolean;
};

export const guides: Guide[] = rawGuides.map((g) => ({
  ...g,
  slug: g.title
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
}));

export const ALL_GAME_VERSIONS = Array.from(
  new Set(
    guides.flatMap((g) => [g.minVersion, g.maxVersion].filter(Boolean) as string[]),
  ),
).sort();

export function searchGuides(query: string): Guide[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return guides.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q),
  );
}

// Bir farm'ın verilen sürümde çalışıp çalışmadığını -- min/maxVersion
// aralığındaki tüm sürümlerin string sıralamasına göre basit bir
// karşılaştırma (ör. "1.16" <= "1.18" <= "1.21").
export function versionInRange(version: string, min?: string, max?: string): boolean {
  if (!min || !max) return true;
  const toNum = (v: string) => v.split(".").map(Number);
  const cmp = (a: number[], b: number[]) => {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const diff = (a[i] ?? 0) - (b[i] ?? 0);
      if (diff !== 0) return diff;
    }
    return 0;
  };
  const v = toNum(version);
  return cmp(v, toNum(min)) >= 0 && cmp(v, toNum(max)) <= 0;
}
