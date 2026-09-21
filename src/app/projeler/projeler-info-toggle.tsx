"use client";

import { useState } from "react";

// /egitimler'deki "Ücretsiz Kurslar ve Premium Eğitim" bilgi bloğunun
// Build/Farm karşılığı -- ama /egitimler'in aksine bu sayfa gerçek
// (filtrelenebilir) bir liste gösterdiği için bilgi metni sabit değil,
// düğmeyle açılıp kapanan bir panel.
export default function ProjelerInfoToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto mt-4 flex max-w-2xl flex-col items-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-600 transition hover:bg-amber-500/20 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400 dark:hover:bg-amber-400/20"
      >
        Ücretsiz ve Premium Destek Hakkında
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-4 rounded-3xl border border-black/10 bg-black/[0.02] p-6 text-left font-sans text-sm leading-relaxed text-black/80 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/80">
          <p>
            <strong>Ücretsiz rehberler</strong> herkese açık: adım adım
            build/farm talimatları, malzeme listesi ve şematik dosyalarıyla
            birlikte. Kilit yok, kayıt gerekmez.
          </p>
          <p>
            <strong>Premium destek</strong> ise takımlara/sunuculara özel
            kişiye özel build/farm tasarımı — uygulama içi ödeme yok, sadece
            bir talep formu dolduruyorsun, sonrasında doğrudan iletişime
            geçip IBAN üzerinden anlaşıyoruz.
          </p>
        </div>
      )}
    </div>
  );
}
