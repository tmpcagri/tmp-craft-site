"use client";

import { useEffect, useState } from "react";
import type { HomeGalleryCard, SiteContent } from "../lib/content";
import ImageUpload from "./image-upload";

// Anasayfadaki büyük+küçük mozaik kartlarının HEPSİ burada tek listede
// gösteriliyor (patronun "6 seçenekli kart listesi" isteği), ama ilk 4'ü
// (Hero'nun büyük slider'ı + 3 sabit-pozisyonlu küçük kartı) zaten "Kayan
// Kart" sekmesinde (content.hero) tam olarak yönetiliyor -- burada
// TEKRAR yazmak yerine oraya yönlendiriyoruz. Sadece Topluluk ve Sunucu
// kartları (content.homeCards) gerçekten burada, inline düzenleniyor.
function GalleryCardForm({
  card,
  onChange,
  slugPrefix,
}: {
  card: HomeGalleryCard;
  onChange: (patch: Partial<HomeGalleryCard>) => void;
  slugPrefix: string;
}) {
  const addImage = () => onChange({ images: [...card.images, ""] });
  const updateImage = (i: number, url: string) => {
    const images = [...card.images];
    images[i] = url;
    onChange({ images });
  };
  const removeImage = (i: number) => {
    onChange({ images: card.images.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-black/10 p-4 dark:border-white/10">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
          Başlık
        </label>
        <input
          value={card.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
          Alt Metin (boş bırakılabilir)
        </label>
        <textarea
          value={card.body}
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
          value={card.href}
          onChange={(e) => onChange({ href: e.target.value })}
          placeholder="/topluluk"
          className="rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
            Arka Plan Görselleri
            {card.images.length > 1 && ` (${card.images.length} görsel, galeri modu)`}
          </label>
          <button
            onClick={addImage}
            className="text-xs underline underline-offset-4 opacity-70 hover:opacity-100"
          >
            + Görsel ekle
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {card.images.map((img, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <ImageUpload
                section="ana-sayfa"
                slug={`${slugPrefix}-${i + 1}`}
                value={img || null}
                onChange={(url) => updateImage(i, url)}
              />
              {card.images.length > 1 && (
                <button
                  onClick={() => removeImage(i)}
                  className="text-xs text-red-600 hover:opacity-70 dark:text-red-400"
                >
                  Sil
                </button>
              )}
            </div>
          ))}
        </div>
        {card.images.length === 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            En az 1 görsel eklenmezse kart görselsiz görünür.
          </p>
        )}
      </div>

      {card.images.length > 1 && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
            Geçiş Süresi ({(card.intervalMs / 1000).toFixed(1)} sn)
          </label>
          <input
            type="range"
            min="1500"
            max="15000"
            step="500"
            value={card.intervalMs}
            onChange={(e) => onChange({ intervalMs: Number(e.target.value) })}
          />
        </div>
      )}
    </div>
  );
}

const HERO_OPTIONS = [
  "1. Büyük Üst Slider",
  "2. Uzun 1. Kart",
  "3. Uzun 2. Kart",
  "4. Uzun 3. Kart",
];

export default function CardsPanel({ onNavigateToHero }: { onNavigateToHero: () => void }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [openId, setOpenId] = useState<"topluluk" | "sunucular" | null>(null);

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

  const updateCard = (key: "topluluk" | "sunucular", patch: Partial<HomeGalleryCard>) => {
    setContent({
      ...content,
      homeCards: { ...content.homeCards, [key]: { ...content.homeCards[key], ...patch } },
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
    <div className="flex flex-col gap-4">
      <p className="text-xs opacity-60">
        Anasayfadaki 6 duyuru kartı: ilk 4&apos;ü (büyük slider + 3 uzun kart)
        zaten &quot;Kayan Kart&quot; sekmesinden yönetiliyor, tıklayınca oraya
        götürür. Topluluk ve Sunucu kartlarının başlık/alt metin/link/arka
        plan görselleri ise doğrudan burada düzenlenir.
      </p>

      <div className="flex flex-col gap-2">
        {HERO_OPTIONS.map((label) => (
          <button
            key={label}
            onClick={onNavigateToHero}
            className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 text-left text-sm font-medium transition hover:bg-black/[0.03] dark:border-white/10 dark:hover:bg-white/[0.03]"
          >
            {label}
            <span className="text-xs opacity-50">Kayan Kart&apos;a git →</span>
          </button>
        ))}

        <button
          onClick={() => setOpenId(openId === "topluluk" ? null : "topluluk")}
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
            openId === "topluluk"
              ? "border-emerald-500 bg-emerald-500/5"
              : "border-black/10 hover:bg-black/[0.03] dark:border-white/10 dark:hover:bg-white/[0.03]"
          }`}
        >
          5. Topluluk Kartı
          <span className="text-xs opacity-50">{openId === "topluluk" ? "Kapat" : "Düzenle"}</span>
        </button>
        {openId === "topluluk" && (
          <GalleryCardForm
            card={content.homeCards.topluluk}
            onChange={(patch) => updateCard("topluluk", patch)}
            slugPrefix="topluluk-kart"
          />
        )}

        <button
          onClick={() => setOpenId(openId === "sunucular" ? null : "sunucular")}
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
            openId === "sunucular"
              ? "border-emerald-500 bg-emerald-500/5"
              : "border-black/10 hover:bg-black/[0.03] dark:border-white/10 dark:hover:bg-white/[0.03]"
          }`}
        >
          6. Sunucu Kartı
          <span className="text-xs opacity-50">
            {openId === "sunucular" ? "Kapat" : "Düzenle"}
          </span>
        </button>
        {openId === "sunucular" && (
          <GalleryCardForm
            card={content.homeCards.sunucular}
            onChange={(patch) => updateCard("sunucular", patch)}
            slugPrefix="sunucu-kart"
          />
        )}
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
