"use client";

import { useState } from "react";

// X (Twitter) benzeri sekme çubuğu -- şimdilik hepsi aynı akışı gösteriyor
// (fonksiyonel filtreleme sonraki bir iş), burada öncelik sekmeler arası
// geçişte aktif/pasif görsel durumun net olması. Alttaki vurgu çubuğu
// X'teki "aktif sekmenin altı çizili" hissini veriyor.
const tabs = [
  "Keşfet",
  "Gündemdekiler",
  "Takip Ettiklerim",
  "Güncellemeler",
  "Popüler",
  "En Yeni",
] as const;

export default function ToplulukTabs() {
  const [active, setActive] = useState<(typeof tabs)[number]>(tabs[0]);

  return (
    // Navbar'daki arama kutusunun tam altında, sabit (fixed) konumda --
    // sayfa kaydırılsa bile hep aynı yerde duruyor. Kayan içeriğin üzerinde
    // yüzdüğü için okunaklı kalması adına arka planlı/kenarlıklı bir kart
    // içinde. Sekmeler henüz gerçek filtreleme yapmadığından role="tablist"/
    // "tab" yerine daha dürüst bir model kullanılıyor: düz buton grubu +
    // aria-pressed. Fonksiyonel hale gelince gerçek ARIA Tabs pattern'ine
    // (roving tabindex, ok tuşu navigasyonu) geçilebilir.
    <div className="fixed inset-x-0 top-20 z-20 flex justify-center px-6 sm:px-10 lg:px-10">
      <div
        aria-label="Topluluk akışı sekmeleri"
        className="flex w-full max-w-3xl items-stretch gap-1 overflow-x-auto rounded-2xl border border-black/10 bg-white/80 shadow-lg backdrop-blur-xl [-ms-overflow-style:none] [scrollbar-width:none] dark:border-white/10 dark:bg-black/70 [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(tab)}
              className={`relative shrink-0 whitespace-nowrap px-4 py-3.5 text-sm font-semibold transition-colors sm:px-5 ${
                isActive
                  ? "text-black dark:text-white"
                  : "text-black/60 hover:bg-black/5 hover:text-black/80 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white/80"
              }`}
            >
              {tab}
              <span
                aria-hidden="true"
                className={`absolute inset-x-3 bottom-0 h-1 rounded-full transition-colors ${
                  isActive ? "bg-emerald-500" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
