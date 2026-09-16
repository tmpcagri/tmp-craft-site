"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORY_ICONS } from "./category-icons";
import { CATEGORY_TR, DOWNLOAD_CATEGORIES } from "./lib/downloads";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Mods: "Oyuna yeni mekanik ve içerik ekleyen eklentiler",
  "Resource Packs": "Dokuları ve görselleri yeniden tasarla",
  "Data Packs": "Vanilla kurallarını komut tabanlı özelleştir",
  Shaders: "Işık, gölge ve yansımalarla gerçekçi görünüm",
  Modpacks: "Birbirine uyumlu modların hazır koleksiyonu",
  Plugins: "Sunucu yönetimi ve oynanış eklentileri",
  Servers: "Hazır sunucu yazılımları ve kurulum dosyaları",
};

// Demo amaçlı: navbar'da "Mod Paketleri" üzerine gelince (masaüstünde)
// tam genişlikte açılan bir mega menu -- kategoriler + ikon + kısa
// açıklama. Mobil/tablette navbar zaten sıkışık olduğu için sadece
// lg ve üzerinde görünüyor (bkz. navbar.tsx'teki "hidden lg:flex").
export default function MegaMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative hidden lg:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/mod-paketleri"
        className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-black/80 transition hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10"
      >
        Mod Paketleri
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </Link>

      {open && (
        <div className="fixed inset-x-0 top-[4.5rem] z-30 flex justify-center px-6">
          <div className="w-full max-w-5xl rounded-3xl border border-black/10 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/95">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {DOWNLOAD_CATEGORIES.map((category) => (
                <Link
                  key={category}
                  href={`/mod-paketleri?category=${encodeURIComponent(category)}`}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 rounded-2xl p-3 transition hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {CATEGORY_ICONS[category]}
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-sans text-sm font-bold text-black dark:text-white">
                      {CATEGORY_TR[category]}
                    </span>
                    <span className="block text-xs text-black/60 dark:text-white/60">
                      {CATEGORY_DESCRIPTIONS[category]}
                    </span>
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/10">
              <p className="text-xs text-black/50 dark:text-white/50">
                Sürüm, loader ve lisansa göre gelişmiş filtreleme mevcut.
              </p>
              <Link
                href="/mod-paketleri"
                onClick={() => setOpen(false)}
                className="shrink-0 text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Tümünü Gör →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
