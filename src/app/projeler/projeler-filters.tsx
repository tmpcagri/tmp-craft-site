"use client";

import { useMemo, useState } from "react";
import FilterPill from "../filter-pill";
import {
  ALL_GAME_VERSIONS,
  BUILD_CATEGORIES,
  DIFFICULTIES,
  FARM_CATEGORIES,
  GUIDE_SETTINGS,
  TERRAIN_TAGS,
  guides,
  versionInRange,
  type Difficulty,
  type Guide,
  type GuideCategory,
  type GuideKind,
  type GuideSetting,
  type TerrainTag,
} from "../lib/guides";
import GuideCard, { type TileSize } from "./guide-card";

type KindFilter = "Tümü" | GuideKind;
type SortMode = "views" | "difficulty";

// Build/Farm/Tümü sekmeleri Mod Paketleri'ndeki kategori ikonlarıyla aynı
// çizim diline (stroke=2, yuvarlak uç) sahip -- Build bir yapı/ev, Farm bir
// filiz/tomurcuk simgesiyle temsil ediliyor.
const KIND_ICONS: Record<KindFilter, React.ReactNode> = {
  Tümü: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  Build: (
    <>
      <path d="M5 21V8l7-5 7 5v13" />
      <path d="M9 21v-6h6v6" />
      <path d="M3 21h18" />
    </>
  ),
  Farm: (
    <>
      <path d="M12 21v-8" />
      <path d="M8 9a4 4 0 0 1 8 0c0 2.5-4 4-4 4s-4-1.5-4-4z" />
    </>
  ),
};

// Asimetrik bento düzeni -- sıradaki öğe listedeki konumuna göre bir
// boyut alıyor (views'e göre sıralı olduğunda en önemli/popüler öğeler
// doğal olarak en büyük karolara denk geliyor). grid-flow-dense ile
// büyük karoların bıraktığı boşluklar sonraki karolarla dolduruluyor.
//
// ÖNEMLİ: görseller büyük kullanılacağı için "sm" (en küçük kare) bilerek
// bu döngüde YOK -- sayfaya sığmıyorsa alta taşması sorun değil ama hiçbir
// kart minik/küçük görünmemeli.
const BENTO_PATTERN: TileSize[] = [
  "lg",
  "wide",
  "tall",
  "wide",
  "tall",
  "lg",
  "wide",
  "tall",
  "wide",
  "lg",
  "tall",
  "wide",
];

const SPAN_CLASSES: Record<TileSize, string> = {
  lg: "sm:col-span-2 sm:row-span-2",
  wide: "sm:col-span-2 sm:row-span-1",
  tall: "sm:col-span-1 sm:row-span-2",
  sm: "sm:col-span-1 sm:row-span-1",
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function ProjelerFilters() {
  const [kind, setKind] = useState<KindFilter>("Tümü");
  const [categories, setCategories] = useState<GuideCategory[]>([]);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [versions, setVersions] = useState<string[]>([]);
  const [afkOnly, setAfkOnly] = useState(false);
  const [settings, setSettings] = useState<GuideSetting[]>([]);
  const [terrains, setTerrains] = useState<TerrainTag[]>([]);
  const [sort, setSort] = useState<SortMode>("views");

  const availableCategories: GuideCategory[] =
    kind === "Build" ? BUILD_CATEGORIES : kind === "Farm" ? FARM_CATEGORIES : [...BUILD_CATEGORIES, ...FARM_CATEGORIES];

  const setKindAndReset = (next: KindFilter) => {
    setKind(next);
    setCategories([]);
  };

  const activeFilterCount =
    categories.length +
    difficulties.length +
    versions.length +
    settings.length +
    terrains.length +
    (afkOnly ? 1 : 0);

  const clearAll = () => {
    setCategories([]);
    setDifficulties([]);
    setVersions([]);
    setSettings([]);
    setTerrains([]);
    setAfkOnly(false);
  };

  const results = useMemo(() => {
    const filtered = guides.filter((g) => {
      if (kind !== "Tümü" && g.kind !== kind) return false;
      if (categories.length && !categories.includes(g.category)) return false;
      if (difficulties.length && !difficulties.includes(g.difficulty)) return false;
      if (afkOnly && !g.afkable) return false;
      if (settings.length && !settings.includes(g.setting)) return false;
      if (terrains.length && !terrains.some((t) => g.terrain?.includes(t))) return false;
      if (versions.length && g.kind === "Farm") {
        const overlaps = versions.some((v) => versionInRange(v, g.minVersion, g.maxVersion));
        if (!overlaps) return false;
      }
      return true;
    });

    const sorted = [...filtered].sort((a: Guide, b: Guide) =>
      sort === "views"
        ? b.views - a.views
        : DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty),
    );
    return sorted;
  }, [kind, categories, difficulties, versions, afkOnly, settings, terrains, sort]);

  const checkboxGroup = <T extends string>(
    label: string,
    options: readonly T[],
    selected: T[],
    setSelected: (v: T[]) => void,
  ) => (
    <div className="flex flex-col gap-2.5 border-b border-black/10 pb-5 last:border-0 last:pb-0 dark:border-white/10">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
        {label}
      </p>
      <div className="flex flex-col gap-1.5">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => setSelected(toggle(selected, opt))}
              className="h-4 w-4 rounded border-black/20 accent-emerald-600 dark:border-white/20"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mt-6 flex flex-col gap-6">
      {/* Build/Farm/Tümü -- ikisini karışık görebilir ya da ayırabilir. */}
      <div className="flex flex-wrap gap-2.5">
        {(["Tümü", "Build", "Farm"] as KindFilter[]).map((k) => (
          <FilterPill
            key={k}
            active={kind === k}
            onClick={() => setKindAndReset(k)}
            icon={
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={kind === k ? "opacity-90" : "opacity-60"}
              >
                {KIND_ICONS[k]}
              </svg>
            }
          >
            {k}
          </FilterPill>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {availableCategories.map((category) => (
          <FilterPill
            key={category}
            active={categories.includes(category)}
            onClick={() => setCategories(toggle(categories, category))}
            size="sm"
          >
            {category}
          </FilterPill>
        ))}
      </div>

      <div className="flex flex-col gap-8 sm:flex-row">
        <aside className="flex w-full flex-col gap-5 sm:w-64 sm:shrink-0">
          <div className="flex items-center justify-between sm:sticky sm:top-32">
            <h2 className="font-sans text-sm font-bold text-black dark:text-white">
              Filtreler
            </h2>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                className="text-xs font-medium text-emerald-600 underline underline-offset-4 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Temizle ({activeFilterCount})
              </button>
            )}
          </div>

          <div className="flex flex-col gap-5 rounded-3xl border border-black/10 bg-white/40 p-5 shadow-sm backdrop-blur-xl sm:sticky sm:top-44 dark:border-white/10 dark:bg-black/40">
            {checkboxGroup("Zorluk", DIFFICULTIES, difficulties, setDifficulties)}
            {checkboxGroup("Ortam", GUIDE_SETTINGS, settings, setSettings)}
            {checkboxGroup("Arazi", TERRAIN_TAGS, terrains, setTerrains)}

            {kind !== "Build" && (
              <>
                {checkboxGroup("Uyumlu Sürüm", ALL_GAME_VERSIONS, versions, setVersions)}
                <label className="flex cursor-pointer items-center gap-2 text-sm text-black/80 dark:text-white/80">
                  <input
                    type="checkbox"
                    checked={afkOnly}
                    onChange={(e) => setAfkOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-black/20 accent-emerald-600 dark:border-white/20"
                  />
                  Sadece AFK&apos;lanabilir farm&apos;lar
                </label>
              </>
            )}

            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                Sırala
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortMode)}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-black dark:text-white"
              >
                <option value="views">En Popüler</option>
                <option value="difficulty">Zorluk: Kolaydan Zora</option>
              </select>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <p className="mb-4 text-sm text-black/60 dark:text-white/60">
            {results.length} sonuç
          </p>

          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-black/15 py-16 text-center dark:border-white/15">
              <p className="font-sans text-base font-semibold text-black dark:text-white">
                Bu filtrelerle eşleşen içerik yok
              </p>
              <p className="text-sm text-black/60 dark:text-white/60">
                Bazı filtreleri kaldırmayı dene.
              </p>
              <button
                onClick={clearAll}
                className="mt-2 rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="grid auto-rows-[260px] grid-cols-2 gap-4 sm:grid-flow-row-dense sm:auto-rows-[300px] sm:grid-cols-3">
              {results.map((guide, i) => {
                const size = BENTO_PATTERN[i % BENTO_PATTERN.length];
                return (
                  <GuideCard
                    key={guide.slug}
                    guide={guide}
                    size={size}
                    className={SPAN_CLASSES[size]}
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
