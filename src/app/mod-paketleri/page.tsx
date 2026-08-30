"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DOWNLOAD_CATEGORIES,
  downloadItems,
  ENVIRONMENTS,
  GAME_VERSIONS,
  LICENSES,
  LOADERS,
  type DownloadCategory,
  type Environment,
  type License,
  type Loader,
} from "../lib/downloads";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

const dependableNames = Array.from(
  new Set(downloadItems.flatMap((i) => i.dependsOn)),
).sort();

export default function ModPaketleriPage() {
  const [gameVersions, setGameVersions] = useState<string[]>([]);
  const [loaders, setLoaders] = useState<Loader[]>([]);
  const [categories, setCategories] = useState<DownloadCategory[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [dependsOn, setDependsOn] = useState<string>("");
  const [exclusions, setExclusions] = useState<string>("");

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
  }, [gameVersions, loaders, categories, environments, licenses, dependsOn, exclusions]);

  const checkboxGroup = <T extends string>(
    label: string,
    options: readonly T[],
    selected: T[],
    setSelected: (v: T[]) => void,
  ) => (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
        {label}
      </p>
      <div className="flex flex-col gap-1.5">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-sm text-black/80 dark:text-white/80"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => setSelected(toggle(selected, opt))}
              className="h-4 w-4 rounded border-black/20 dark:border-white/20"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full bg-white px-6 pb-24 pt-24 dark:bg-black sm:px-10">
      <h1 className="font-sans text-3xl font-bold text-black dark:text-white">
        Mod Paketleri
      </h1>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        Mods, Resource Packs, Data Packs, Shaders, Modpacks, Plugins ve
        Servers — hepsi burada.
      </p>

      <div className="mt-8 flex flex-col gap-8 sm:flex-row">
        <aside className="flex w-full flex-col gap-6 sm:w-64 sm:shrink-0">
          {checkboxGroup("Game Version", GAME_VERSIONS, gameVersions, setGameVersions)}
          {checkboxGroup("Loader", LOADERS, loaders, setLoaders)}
          {checkboxGroup("Category", DOWNLOAD_CATEGORIES, categories, setCategories)}
          {checkboxGroup("Environment", ENVIRONMENTS, environments, setEnvironments)}
          {checkboxGroup("License", LICENSES, licenses, setLicenses)}

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
              Depends On
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
            <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
              Advanced Exclusions
            </p>
            <input
              value={exclusions}
              onChange={(e) => setExclusions(e.target.value)}
              placeholder="virgülle ayrılmış terimler"
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-black dark:text-white"
            />
          </div>
        </aside>

        <main className="flex-1">
          <p className="mb-4 text-sm opacity-60">{results.length} sonuç</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <Link
                key={item.slug}
                href={`/mod-paketleri/${item.slug}`}
                className="flex flex-col overflow-hidden rounded-2xl shadow-lg transition hover:scale-[1.02]"
              >
                <div className={`h-32 bg-gradient-to-br ${item.gradient}`} />
                <div className="flex flex-col gap-1 bg-white p-4 dark:bg-zinc-900">
                  <span className="text-xs font-semibold uppercase tracking-wide opacity-50">
                    {item.category}
                  </span>
                  <h3 className="font-sans text-base font-bold text-black dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-sm text-black/60 dark:text-white/60">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
