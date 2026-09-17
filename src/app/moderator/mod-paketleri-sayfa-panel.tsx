"use client";

import { useEffect, useState } from "react";
import { CATEGORY_TR, normalizeCategoryOrder, type DownloadCategory } from "../lib/downloads";
import type { SiteContent } from "../lib/content";
import ImageUpload from "./image-upload";

// /mod-paketleri listeleme sayfasının üstündeki ayarlar -- kategori
// TÜRLERİ (DownloadCategory) kod genelinde exhaustive kullanıldığı için
// burada eklenip çıkarılamıyor, sadece hangi sırada gösterilecekleri
// (dolayısıyla filtre çubuğunda hangisinin öne çıkacağı) değişebiliyor.
export default function ModPaketleriSayfaPanel() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => {
        if (!res.ok) throw new Error("content fetch failed");
        return res.json();
      })
      .then((data: SiteContent) =>
        setContent({
          ...data,
          modPaketleriPage: {
            ...data.modPaketleriPage,
            categoryOrder: normalizeCategoryOrder(data.modPaketleriPage.categoryOrder),
          },
        }),
      )
      .catch(() => setStatus("İçerik yüklenemedi"));
  }, []);

  if (!content) {
    return <p className="text-sm opacity-60">Yükleniyor...</p>;
  }

  const order = content.modPaketleriPage.categoryOrder;

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    setContent({
      ...content,
      modPaketleriPage: { ...content.modPaketleriPage, categoryOrder: next },
    });
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">Arka Plan Görseli</p>
        <p className="text-xs opacity-60">
          /mod-paketleri sayfasının üst kısmında, navbar&apos;ın arkasından
          başlayan bir kapak görseli olarak gösterilir. Boş bırakılırsa hiç
          görüntülenmez.
        </p>
        <div className="max-w-sm">
          <ImageUpload
            section="mod-paketleri"
            slug="sayfa-arkaplan"
            value={content.modPaketleriPage.backgroundImageUrl || null}
            onChange={(url) =>
              setContent({
                ...content,
                modPaketleriPage: { ...content.modPaketleriPage, backgroundImageUrl: url },
              })
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">Kategori Sırası</p>
        <p className="text-xs opacity-60">
          Filtre sekmelerinin ve sonuç gruplarının gösterim sırası. Yeni
          kategori türü eklenemiyor, sadece mevcut 7 kategori sıralanabiliyor.
        </p>
        <div className="flex flex-col gap-1.5">
          {order.map((category: DownloadCategory, i: number) => (
            <div
              key={category}
              className="flex items-center justify-between gap-3 rounded-xl border border-black/10 px-3 py-2 text-sm dark:border-white/10"
            >
              <span>
                {category}{" "}
                <span className="opacity-60">({CATEGORY_TR[category]})</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label={`${category} yukarı taşı`}
                  className="rounded-lg border border-black/10 px-2 py-1 text-xs disabled:opacity-30 dark:border-white/10"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === order.length - 1}
                  aria-label={`${category} aşağı taşı`}
                  className="rounded-lg border border-black/10 px-2 py-1 text-xs disabled:opacity-30 dark:border-white/10"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
