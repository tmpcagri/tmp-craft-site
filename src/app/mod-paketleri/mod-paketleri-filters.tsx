"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CATEGORY_ICONS } from "../category-icons";
import {
  CATEGORY_TR,
  DOWNLOAD_CATEGORIES,
  ENVIRONMENTS,
  LICENSES,
  LOADERS,
  type DownloadCategory,
  type DownloadItem,
  type Environment,
  type License,
  type Loader,
} from "../lib/downloads";
import ModPackageRow from "./mod-package-row";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export default function ModPaketleriFilters({ items: downloadItems }: { items: DownloadItem[] }) {
  const searchParams = useSearchParams();

  const dependableNames = Array.from(
    new Set(downloadItems.flatMap((i) => i.dependsOn)),
  ).sort();
  const gameVersionOptions = Array.from(
    new Set(downloadItems.map((i) => i.gameVersion)),
  ).sort().reverse();
  const initialCategory = DOWNLOAD_CATEGORIES.find(
    (c) => c === searchParams.get("category"),
  );

  const [gameVersions, setGameVersions] = useState<string[]>([]);
  const [loaders, setLoaders] = useState<Loader[]>([]);
  const [categories, setCategories] = useState<DownloadCategory[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [dependsOn, setDependsOn] = useState<string>("");
  const [exclusions, setExclusions] = useState<string>("");

  const activeFilterCount =
    gameVersions.length +
    loaders.length +
    categories.length +
    environments.length +
    licenses.length +
    (dependsOn ? 1 : 0) +
    (exclusions.trim() ? 1 : 0);

  const clearAll = () => {
    setGameVersions([]);
    setLoaders([]);
    setCategories([]);
    setEnvironments([]);
    setLicenses([]);
    setDependsOn("");
    setExclusions("");
  };

  const results = useMemo(() => {
    const excludeTerms = exclusions
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    return downloadItems.filter((item) => {
      if (gameVersions.length && !gameVersions.includes(item.gameVersion))
        return false;
      if (loaders.length && !loaders.includes(item.loader)) return false;
      if (categories.length && !categories.includes(item.category))
        return false;
      if (environments.length && !environments.includes(item.environment))
        return false;
      if (licenses.length && !licenses.includes(item.license)) return false;
      if (dependsOn && !item.dependsOn.includes(dependsOn)) return false;
      if (
        excludeTerms.some(
          (t) =>
            item.name.toLowerCase().includes(t) ||
            item.description.toLowerCase().includes(t),
        )
      )
        return false;
      return true;
    });
  }, [downloadItems, gameVersions, loaders, categories, environments, licenses, dependsOn, exclusions]);

  const groups = DOWNLOAD_CATEGORIES.map((category) => ({
    category,
    items: results.filter((item) => item.category === category),
  })).filter((g) => g.items.length > 0);

  const checkboxGroup = <T extends string>(
    label: string,
    options: readonly T[],
    selected: T[],
    setSelected: (v: T[]) => void,
    translate?: Record<string, string>,
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
            {translate?.[opt] && (
              <span className="text-black/60 dark:text-white/60">
                ({translate[opt]})
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );

  const activeCategory = categories[0];

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={() => setCategories([])}
          className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
            !activeCategory
              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
              : "border border-black/10 bg-white/40 text-black backdrop-blur-sm hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-md dark:border-white/10 dark:bg-black/30 dark:text-white dark:hover:bg-black/50"
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={!activeCategory ? "opacity-90" : "opacity-60"}>
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
          Tümü
        </button>
        {DOWNLOAD_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() =>
              setCategories(activeCategory === category ? [] : [category])
            }
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              activeCategory === category
                ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                : "border border-black/10 bg-white/40 text-black backdrop-blur-sm hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-md dark:border-white/10 dark:bg-black/30 dark:text-white dark:hover:bg-black/50"
            }`}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={activeCategory === category ? "opacity-90" : "opacity-60"}
            >
              {CATEGORY_ICONS[category]}
            </svg>
            {category}{" "}
            <span className="opacity-60">({CATEGORY_TR[category]})</span>
          </button>
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
          {checkboxGroup("Sürüm", gameVersionOptions, gameVersions, setGameVersions)}
          {checkboxGroup("Loader", LOADERS, loaders, setLoaders)}
          {checkboxGroup("Ortam", ENVIRONMENTS, environments, setEnvironments, {
            Client: "İstemci",
            Server: "Sunucu",
            "Client + Server": "İstemci + Sunucu",
          })}
          {checkboxGroup("Lisans", LICENSES, licenses, setLicenses, {
            "All Rights Reserved": "Tüm Hakları Saklı",
          })}

          <div className="flex flex-col gap-2 border-b border-black/10 pb-5 dark:border-white/10">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              Bağımlılık
            </p>
            <select
              value={dependsOn}
              onChange={(e) => setDependsOn(e.target.value)}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-black dark:text-white"
            >
              <option value="">Farketmez</option>
              {dependableNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              Gelişmiş Hariç Tutma
            </p>
            <input
              value={exclusions}
              onChange={(e) => setExclusions(e.target.value)}
              placeholder="virgülle ayrılmış terimler"
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-black dark:text-white"
            />
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
          <div className="flex flex-col gap-8">
            {groups.map(({ category, items }) => (
              <div key={category} className="flex flex-col gap-3">
                <h2 className="font-sans text-base font-bold text-black dark:text-white">
                  {category}{" "}
                  <span className="font-normal text-black/60 dark:text-white/60">
                    ({CATEGORY_TR[category]})
                  </span>
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <ModPackageRow key={item.slug} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
    </div>
  );
}
