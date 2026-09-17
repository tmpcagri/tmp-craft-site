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
    // Navbar'ın hemen altında, normal doküman akışında (diğer sayfalardaki
    // <h1> gibi) duran sade bir pill-button satırı -- artık kayan/fixed bir
    // şerit değil, bu yüzden ayrı bir arka plan/kenarlık kartına ihtiyacı yok.
    // Sekmeler henüz gerçek filtreleme yapmadığından role="tablist"/"tab"
    // yerine daha dürüst bir model kullanılıyor: düz buton grubu +
    // aria-pressed. Fonksiyonel hale gelince gerçek ARIA Tabs pattern'ine
    // (roving tabindex, ok tuşu navigasyonu) geçilebilir.
    <div
      aria-label="Topluluk akışı sekmeleri"
      className="flex w-full items-stretch gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
  );
}
