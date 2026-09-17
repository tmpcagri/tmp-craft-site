"use client";

import { useEffect, useState } from "react";
import type { HeroSlide, SiteContent } from "../lib/content";
import ImageUpload from "./image-upload";

// Bir HeroSlide'ın 4 alanı (başlık/alt metin/link/tek görsel) -- hem büyük
// slider'ın her slaytında hem de 3 sabit küçük kartın her birinde aynı
// şekil tekrarlıyor, tek fark büyük slider'da BİRDEN FAZLA slayt olabilip
// dönmesi (bkz. HeroPanel), küçük kartlarda sayı sabit (3) ve dönmüyor --
// o yüzden burada tek bir slayt-alanları bileşeni, dışarıda liste mi tekli
// mi olduğuna panel karar veriyor. homeCards'taki "tek kart + çoklu arka
// plan görseli" galerisinden (bkz. cards-panel.tsx) kasıtlı olarak farklı
// bir şekil -- burada her slaytın KENDİ başlığı/linki var, homeCards'ta
// tek başlık/link sabit kalıp sadece arka plan görseli dönüyor.
function SlideFields({
  slide,
  onChange,
  slugPrefix,
}: {
  slide: HeroSlide;
  onChange: (patch: Partial<HeroSlide>) => void;
  slugPrefix: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
          Başlık
        </label>
        <input
          value={slide.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
          Alt Metin
        </label>
        <textarea
          value={slide.body}
          onChange={(e) => onChange({ body: e.target.value })}
          rows={2}
          className="rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
          Yönlendirme Linki
        </label>
        <input
          value={slide.href}
          onChange={(e) => onChange({ href: e.target.value })}
          placeholder="/mod-paketleri"
          className="rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
          Görsel
        </label>
        <ImageUpload
          section="ana-sayfa-hero"
          slug={slugPrefix}
          value={slide.image || null}
          onChange={(url) => onChange({ image: url })}
        />
      </div>
    </div>
  );
}

const EMPTY_SLIDE: HeroSlide = { title: "", body: "", image: "", href: "/" };

export default function HeroPanel() {
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

  const hero = content.hero;

  const updateHero = (patch: Partial<SiteContent["hero"]>) => {
    setContent({ ...content, hero: { ...hero, ...patch } });
  };

  const updateFeatured = (i: number, patch: Partial<HeroSlide>) => {
    const featuredSlides = [...hero.featuredSlides];
    featuredSlides[i] = { ...featuredSlides[i], ...patch };
    updateHero({ featuredSlides });
  };
  const addFeatured = () =>
    updateHero({ featuredSlides: [...hero.featuredSlides, { ...EMPTY_SLIDE }] });
  const removeFeatured = (i: number) =>
    updateHero({ featuredSlides: hero.featuredSlides.filter((_, idx) => idx !== i) });

  const updateSecondary = (i: number, patch: Partial<HeroSlide>) => {
    const secondary = [...hero.secondary];
    secondary[i] = { ...secondary[i], ...patch };
    updateHero({ secondary });
  };

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
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-bold">Büyük Üst Slider</h3>
          <p className="text-xs opacity-60">
            Tek slayt varsa sabit durur. 2+ slayt eklersen kendi süresiyle
            dönen bir galeriye döner -- her slaytın kendi başlık/alt
            metin/link/görseli var.
          </p>
        </div>

        {hero.featuredSlides.length > 1 && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
              Geçiş Süresi ({(hero.featuredIntervalMs / 1000).toFixed(1)} sn)
            </label>
            <input
              type="range"
              min="1500"
              max="15000"
              step="500"
              value={hero.featuredIntervalMs}
              onChange={(e) => updateHero({ featuredIntervalMs: Number(e.target.value) })}
            />
          </div>
        )}

        {hero.featuredSlides.map((slide, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-2xl border border-black/10 p-4 dark:border-white/10"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Slayt {i + 1}</p>
              {hero.featuredSlides.length > 1 && (
                <button
                  onClick={() => removeFeatured(i)}
                  className="text-xs text-red-600 hover:opacity-70 dark:text-red-400"
                >
                  Sil
                </button>
              )}
            </div>
            <SlideFields
              slide={slide}
              onChange={(patch) => updateFeatured(i, patch)}
              slugPrefix={`featured-${i + 1}`}
            />
          </div>
        ))}

        <button
          onClick={addFeatured}
          className="self-start text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
        >
          + Slayt ekle
        </button>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-bold">3 Küçük Kart</h3>
          <p className="text-xs opacity-60">
            Sayısı sabit (3), hepsi aynı anda gösteriliyor -- sadece
            içerikleri düzenlenebilir.
          </p>
        </div>

        {hero.secondary.map((slide, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-2xl border border-black/10 p-4 dark:border-white/10"
          >
            <p className="text-sm font-semibold">Kart {i + 1}</p>
            <SlideFields
              slide={slide}
              onChange={(patch) => updateSecondary(i, patch)}
              slugPrefix={`secondary-${i + 1}`}
            />
          </div>
        ))}
      </section>

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
