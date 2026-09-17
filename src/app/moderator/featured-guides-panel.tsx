"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "../lib/content";
import { guides } from "../lib/guides";
import CuratedCardListEditor from "./curated-card-list-editor";

const existingOptions = guides.map((g) => ({ slug: g.slug, label: `${g.title} (${g.kind})` }));

// "Öne Çıkan Build/Farm Rehberleri" (guides izni) -- anasayfadaki Build ve
// Farm Rehberi bandında (bkz. projeler-slider-panel.tsx) hangi kartların
// gösterileceğini seçiyor. Rehberler (guides.ts) tamamen statik/sabit
// -- mod paketlerinin aksine DB'den beslenmiyor, o yüzden burada async
// yükleme yok.
export default function FeaturedGuidesPanel() {
  const [content, setContent] = useState<SiteContent | null>(null);
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
        <h3 className="text-base font-bold">Öne Çıkan Build/Farm Rehberleri</h3>
        <p className="text-xs opacity-60">
          Anasayfadaki Build ve Farm Rehberi bandında hangi kartların, hangi
          sırada ve hangi rozetle gösterileceğini belirler. Boş bırakılırsa
          panel eski davranışına (en çok görüntülenen 8 rehber, rozetsiz)
          döner.
        </p>
      </div>

      <CuratedCardListEditor
        entries={content.featuredGuides}
        onChange={(featuredGuides) => setContent({ ...content, featuredGuides })}
        existingOptions={existingOptions}
        existingOptionsLoading={false}
        imageUploadSection="projeler"
        imageUploadSlugPrefix="featured-guide"
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
