"use client";

import { Archivo_Black } from "next/font/google";
import { useOccasion } from "./occasion-context";

const blockFont = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
});

const letters = ["T", "M", "P"];

// Özel gün rozetleri -- aktif temaya göre wordmark'ın yanında görünür.
// bkz. src/app/lib/occasion.ts (hangi temanın aktif olduğuna karar veren
// mantık) ve occasion-context.tsx (bunu prop'suz her yerden okunabilir
// yapan context).
function OccasionBadge({ size = 20 }: { size?: number }) {
  const theme = useOccasion();
  if (theme === "resmi") {
    return (
      <svg
        width={size}
        height={size * 0.67}
        viewBox="0 0 30 20"
        className="animate-flag-wave shrink-0"
        aria-label="Resmi gün"
      >
        <rect width="30" height="20" fill="#e30a17" />
        <circle cx="12" cy="10" r="5" fill="#fff" />
        <circle cx="13.5" cy="10" r="4" fill="#e30a17" />
        <path
          fill="#fff"
          d="M17.5 6.5l1.2 2.4 2.6.4-1.9 1.9.4 2.6-2.3-1.3-2.3 1.3.4-2.6-1.9-1.9 2.6-.4z"
        />
      </svg>
    );
  }
  if (theme === "yas") {
    return (
      <svg
        width={size * 0.7}
        height={size}
        viewBox="0 0 16 24"
        className="shrink-0"
        aria-label="Anma günü"
      >
        <path
          fill="#111"
          d="M8 0C5 5 0 7 0 12a8 8 0 0 0 8 8 8 8 0 0 0 8-8C16 7 11 5 8 0z"
        />
        <path fill="#111" d="M5 17l3 7 3-7-3 2z" />
      </svg>
    );
  }
  if (theme === "dini") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="shrink-0 text-emerald-600 dark:text-emerald-400"
        aria-label="Dini bayram"
      >
        <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a7 7 0 0 0 9.5 9.5z" fill="currentColor" opacity="0.15" />
        <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a7 7 0 0 0 9.5 9.5z" />
      </svg>
    );
  }
  return null;
}

export default function Logo({
  compact = false,
  large = false,
  tagline = false,
  hideWordmarkOnMobile = false,
}: {
  compact?: boolean;
  large?: boolean;
  tagline?: boolean;
  // Dar ekranlarda (navbar'da) "Craft" yazısını + ayırıcıyı gizler, sadece
  // T-M-P karelerini gösterir -- navbar'da menü/arama/hesap kümesiyle
  // birlikte sığmıyordu. sm ve üzerinde tam logo geri döner.
  hideWordmarkOnMobile?: boolean;
}) {
  const tileSize = compact
    ? "h-7 w-7 text-sm"
    : large
      ? "h-16 w-16 text-3xl"
      : "h-10 w-10 text-lg";
  const dividerHeight = compact ? "h-5" : large ? "h-12" : "h-7";

  return (
    <span className="inline-flex flex-col gap-1.5">
      <span className="inline-flex items-center gap-3">
        <span className="flex gap-1">
          {letters.map((letter) => (
            <span
              key={letter}
              className={`tmp-logo-tile flex shrink-0 items-center justify-center rounded-lg bg-emerald-900 text-white dark:bg-emerald-800 ${blockFont.className} ${tileSize}`}
            >
              {letter}
            </span>
          ))}
        </span>
        <span
          aria-hidden
          className={`shrink-0 bg-current opacity-25 ${dividerHeight} ${
            hideWordmarkOnMobile ? "hidden w-px sm:block" : "w-px"
          }`}
        />
        <span
          className={`uppercase tracking-wide transition-all duration-300 ${blockFont.className} ${
            hideWordmarkOnMobile ? "hidden sm:inline" : ""
          } ${compact ? "text-base" : large ? "text-4xl" : "text-xl"}`}
        >
          Craft
          <sup className="ml-0.5 text-[0.4em] font-sans font-normal not-italic opacity-70">
            ™
          </sup>
        </span>
        <OccasionBadge size={compact ? 16 : large ? 26 : 20} />
      </span>
      {tagline && (
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/60 dark:text-white/60">
          Topluluk • Yaratıcılık • Paylaşım
        </span>
      )}
    </span>
  );
}

// Cümle/metin içine gömülebilen küçük versiyon — boyutları çevresindeki
// yazı boyutuna göre (em) ölçeklenir, sabit piksel değil.
export function InlineLogo() {
  return (
    <span
      className={`inline-flex items-center gap-[0.15em] align-middle ${blockFont.className}`}
    >
      <span className="flex gap-[0.06em]">
        {letters.map((letter) => (
          <span
            key={letter}
            style={{ width: "1.3em", height: "1.3em", fontSize: "0.6em" }}
            className="tmp-logo-tile flex shrink-0 items-center justify-center rounded-[0.2em] bg-emerald-900 text-white dark:bg-emerald-800"
          >
            {letter}
          </span>
        ))}
      </span>
      <span
        aria-hidden
        style={{ height: "1em" }}
        className="w-px shrink-0 bg-current opacity-25"
      />
      <span style={{ fontSize: "0.85em" }} className="uppercase tracking-wide">
        Craft
      </span>
    </span>
  );
}

// Sadece T-M-P kutucukları -- örn. bir metin akışında ayırıcı/rozet olarak
// kullanmak için (InlineLogo'nun "Craft" yazısı olmayan hali). Çevresindeki
// yazı boyutuna göre (em) ölçeklenir.
export function TmpMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 gap-[0.06em] align-middle ${blockFont.className} ${className}`}
    >
      {letters.map((letter) => (
        <span
          key={letter}
          style={{ width: "1.3em", height: "1.3em", fontSize: "0.6em" }}
          className="tmp-logo-tile flex shrink-0 items-center justify-center rounded-[0.2em] bg-emerald-900 text-white dark:bg-emerald-800"
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
