"use client";

import type { CuratedCardEntry, FeaturedModTag } from "../lib/content";
import ImageUpload from "./image-upload";

const TAGS: FeaturedModTag[] = ["", "Popüler", "En Çok İndirilen", "Yeni"];

const inputClass =
  "rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10";

// Anasayfa kayan bantlarında (Mod Paketleri / Build ve Farm Rehberi) hangi
// kartların öne çıkacağını seçen ORTAK editör -- iki panel de (bkz.
// featured-mods-panel.tsx/featured-guides-panel.tsx) aynı iki-modlu deseni
// kullanıyor: "existing" gerçek bir öğeye (mod/rehber) slug ile referans
// verir, "custom" moderatörün hiçbir gerçek öğeye bağlı olmadan girdiği
// serbest bir karttır (görsel/başlık/açıklama/link kendi elleriyle).
export default function CuratedCardListEditor({
  entries,
  onChange,
  existingOptions,
  existingOptionsLoading,
  imageUploadSection,
  imageUploadSlugPrefix,
}: {
  entries: CuratedCardEntry[];
  onChange: (entries: CuratedCardEntry[]) => void;
  existingOptions: { slug: string; label: string }[];
  existingOptionsLoading: boolean;
  imageUploadSection: "ana-sayfa-panels" | "projeler";
  imageUploadSlugPrefix: string;
}) {
  const update = (i: number, patch: Partial<CuratedCardEntry>) => {
    onChange(
      entries.map((e, idx) => (idx === i ? ({ ...e, ...patch } as CuratedCardEntry) : e)),
    );
  };

  const remove = (i: number) => onChange(entries.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= entries.length) return;
    const next = [...entries];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const addExisting = () =>
    onChange([
      ...entries,
      { mode: "existing", slug: existingOptions[0]?.slug ?? "", tag: "" },
    ]);

  const addCustom = () =>
    onChange([
      ...entries,
      { mode: "custom", title: "", description: "", imageUrl: "", linkUrl: "", tag: "" },
    ]);

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-xl border border-black/10 p-3 dark:border-white/10">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide opacity-50">
              {entry.mode === "existing" ? "Mevcuttan Seç" : "Özel Kart"}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded-full px-2 py-1 text-xs transition hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/10"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === entries.length - 1}
                className="rounded-full px-2 py-1 text-xs transition hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/10"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded-full px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
              >
                Sil
              </button>
            </div>
          </div>

          {entry.mode === "existing" ? (
            <select
              value={entry.slug}
              onChange={(e) => update(i, { slug: e.target.value })}
              disabled={existingOptionsLoading}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-black"
            >
              {existingOptionsLoading && <option>Yükleniyor...</option>}
              {existingOptions.map((o) => (
                <option key={o.slug} value={o.slug}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                value={entry.title}
                onChange={(e) => update(i, { title: e.target.value })}
                placeholder="Başlık"
                className={inputClass}
              />
              <input
                value={entry.linkUrl}
                onChange={(e) => update(i, { linkUrl: e.target.value })}
                placeholder="Link (https://... ya da /iç-yol)"
                className={inputClass}
              />
              <textarea
                value={entry.description}
                onChange={(e) => update(i, { description: e.target.value })}
                placeholder="Kısa açıklama"
                rows={2}
                className={`col-span-full ${inputClass}`}
              />
              <div className="col-span-full">
                <ImageUpload
                  section={imageUploadSection}
                  slug={`${imageUploadSlugPrefix}-${i}`}
                  value={entry.imageUrl || null}
                  onChange={(url) => update(i, { imageUrl: url })}
                />
              </div>
            </div>
          )}

          <label className="flex flex-col gap-1 text-sm">
            Rozet (opsiyonel)
            <select
              value={entry.tag}
              onChange={(e) => update(i, { tag: e.target.value as FeaturedModTag })}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-black"
            >
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t || "Yok"}
                </option>
              ))}
            </select>
          </label>
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={addExisting}
          disabled={existingOptionsLoading || existingOptions.length === 0}
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold transition hover:bg-black/5 disabled:opacity-40 dark:border-white/10 dark:hover:bg-white/10"
        >
          + Mevcuttan Seç
        </button>
        <button
          type="button"
          onClick={addCustom}
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
        >
          + Özel Kart Ekle
        </button>
      </div>
    </div>
  );
}
