"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "../lib/content";
import { downloadItems } from "../lib/downloads";
import { listModPackages, toDownloadItem } from "../lib/mod-packages";
import CuratedCardListEditor from "./curated-card-list-editor";

// "Öne Çıkan Modlar" (panels izni) -- anasayfadaki Mod Paketleri kayan
// bandında (bkz. mod-paketleri-slider-panel.tsx) hangi kartların
// gösterileceğini seçiyor. existingOptions, getAllDownloadItems'ın
// (sunucu tarafı) client eşdeğeri: sabit tohum listesi + DB'deki mod
// paketleri -- bu ikisi ayrı kaynaklardan geldiği için burada ayrıca
// birleştiriliyor.
export default function FeaturedModsPanel() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [existingOptions, setExistingOptions] = useState<{ slug: string; label: string }[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => {
        if (!res.ok) throw new Error("content fetch failed");
        return res.json();
      })
      .then(setContent)
      .catch(() => setStatus("İçerik yüklenemedi"));
  }, []);

  useEffect(() => {
    listModPackages()
      .then((rows) => {
        const dbItems = rows.map(toDownloadItem);
        setExistingOptions(
          [...dbItems, ...downloadItems].map((item) => ({
            slug: item.slug,
            label: item.name,
          })),
        );
      })
      .catch(() => setExistingOptions(downloadItems.map((item) => ({ slug: item.slug, label: item.name }))))
      .finally(() => setOptionsLoading(false));
  }, []);

  if (!content) {
    return <p className="text-sm opacity-60">Yükleniyor...</p>;
  }

  const save = async () => {
    setSaving(true);
    setStatus("Kaydediliyor...");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error("Kaydedilemedi");
      setStatus("Kaydedildi ✓");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-bold">Öne Çıkan Modlar</h3>
        <p className="text-xs opacity-60">
          Anasayfadaki Mod Paketleri bandında hangi kartların, hangi sırada
          ve hangi rozetle gösterileceğini belirler. Boş bırakılırsa panel
          eski davranışına (ilk 8 mod, rozetsiz) döner.
        </p>
      </div>

      <CuratedCardListEditor
        entries={content.featuredMods}
        onChange={(featuredMods) => setContent({ ...content, featuredMods })}
        existingOptions={existingOptions}
        existingOptionsLoading={optionsLoading}
        imageUploadSection="ana-sayfa-panels"
        imageUploadSlugPrefix="featured-mod"
      />

      <div className="flex items-center justify-end gap-3">
        {status && <p className="text-xs opacity-70">{status}</p>}
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
}
