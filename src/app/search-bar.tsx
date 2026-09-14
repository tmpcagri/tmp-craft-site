"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { downloadItems, searchDownloads } from "./lib/downloads";
import { trends } from "./lib/trends";

export default function SearchBar({
  compact = false,
}: {
  compact?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const inTopluluk = pathname?.startsWith("/topluluk") ?? false;

  const placeholderWords = inTopluluk
    ? trends.map((t) => t.topic)
    : downloadItems.map((item) => item.name);

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState("Ara...");

  const modResults = inTopluluk ? [] : searchDownloads(query);
  const trendMatches = query.trim()
    ? trends.filter((t) =>
        t.topic.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : [];
  const showDropdown = focused && query.trim().length > 0;
  const hasResults = modResults.length > 0 || trendMatches.length > 0;

  const goToResults = () => {
    if (!query.trim()) return;
    if (inTopluluk) {
      router.push(`/topluluk?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/arama?q=${encodeURIComponent(query.trim())}`);
    }
  };

  useEffect(() => {
    if (query) return;

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = placeholderWords[wordIndex % placeholderWords.length];
      let delay = deleting ? 40 : 90;

      if (!deleting) {
        charIndex++;
        setPlaceholder(word.slice(0, charIndex));
        if (charIndex === word.length) {
          deleting = true;
          delay = 1200;
        }
      } else {
        charIndex--;
        setPlaceholder(word.slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          wordIndex++;
          delay = 300;
        }
      }

      timeoutId = setTimeout(tick, delay);
    };

    timeoutId = setTimeout(tick, 90);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, inTopluluk]);

  return (
    <div
      className={`relative mx-auto w-full transition-all duration-300 ${compact ? "max-w-56" : "max-w-72"}`}
    >
      {/* Mobilde (sm altı) tam arama kutusu navbar'daki diğer elemanlarla
          (logo, hesap/bildirim) yan yana sığmıyordu -- yerine küçük bir
          ikon düğmesi, /arama sayfasına yönlendiriyor. */}
      <Link
        href="/arama"
        aria-label="Ara"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-current/20 transition hover:bg-current/10 sm:hidden"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-70"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </Link>

      <div
        className={`hidden items-center gap-3 rounded-full border border-current/20 transition-all duration-300 hover:bg-current/10 hover:shadow-[0_0_30px_-4px_currentColor] sm:flex ${
          compact ? "px-4 py-2 text-sm" : "px-5 py-3 text-base"
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 opacity-70"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter") goToResults();
          }}
          placeholder={inTopluluk ? `#${placeholder}` : placeholder}
          className="w-full bg-transparent outline-none placeholder:opacity-60"
        />
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/90">
          {!hasResults ? (
            <p className="p-4 text-sm text-black/60 dark:text-white/60">
              Sonuç bulunamadı
            </p>
          ) : (
            <>
              {modResults.slice(0, 5).map((item) => (
                <Link
                  key={item.slug}
                  href={`/mod-paketleri/${item.slug}`}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-black transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                >
                  <span
                    className={`h-6 w-6 shrink-0 rounded-full bg-gradient-to-br ${item.gradient}`}
                  />
                  <span>
                    <span className="font-semibold">{item.name}</span>{" "}
                    <span className="opacity-50">· {item.category}</span>
                  </span>
                </Link>
              ))}

              {trendMatches.slice(0, 4).map((trend) => (
                <Link
                  key={trend.topic}
                  href={`/topluluk/etiket/${encodeURIComponent(trend.topic)}`}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-black transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-xs text-rose-600 dark:text-rose-400">
                    #
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {!inTopluluk && (
                      <span className="text-xs font-medium text-black/60 dark:text-white/60">
                        Topluluk ·{" "}
                      </span>
                    )}
                    <span className="font-semibold">#{trend.topic}</span>
                  </span>
                </Link>
              ))}

              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  goToResults();
                }}
                className="flex w-full items-center justify-center border-t border-black/10 px-4 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-black/5 dark:border-white/10 dark:text-emerald-400 dark:hover:bg-white/10"
              >
                {inTopluluk
                  ? "Topluluk'ta tüm sonuçları gör"
                  : `Tüm sonuçları gör (${modResults.length + trendMatches.length})`}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
