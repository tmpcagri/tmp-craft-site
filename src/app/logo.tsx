import { Archivo_Black } from "next/font/google";

const blockFont = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
});

const letters = ["T", "M", "P"];

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
              className={`flex shrink-0 items-center justify-center rounded-lg bg-emerald-900 text-white dark:bg-emerald-800 ${blockFont.className} ${tileSize}`}
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
            className="flex shrink-0 items-center justify-center rounded-[0.2em] bg-emerald-900 text-white dark:bg-emerald-800"
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
          className="flex shrink-0 items-center justify-center rounded-[0.2em] bg-emerald-900 text-white dark:bg-emerald-800"
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
