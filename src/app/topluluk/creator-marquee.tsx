"use client";

import type { RecommendedCreator } from "../lib/content";
import { useAutoScroll } from "../lib/use-auto-scroll";

const platformStyles: Record<string, string> = {
  YouTube: "bg-red-500/10 text-red-600 dark:text-red-400",
  Twitch: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  TikTok: "bg-black/10 text-black/70 dark:bg-white/10 dark:text-white/70",
};

// Yayıncı kartları artık kendi gerçek platform profiline gidiyor -- ayrı
// bir "profileUrl" alanı eklemeye gerek yok, `name` zaten o platformdaki
// gerçek kullanıcı adı, linki doğrudan buradan üretiyoruz.
function creatorProfileUrl(creator: RecommendedCreator): string {
  const handle = encodeURIComponent(creator.name);
  switch (creator.platform) {
    case "YouTube":
      return `https://www.youtube.com/@${handle}`;
    case "Twitch":
      return `https://www.twitch.tv/${handle}`;
    case "TikTok":
      return `https://www.tiktok.com/@${handle}`;
  }
}

const ROW_HEIGHT = 68;

function CreatorRow({
  creator,
  rank,
  accent,
}: {
  creator: RecommendedCreator;
  rank?: number;
  accent: "amber" | "black";
}) {
  return (
    <a
      href={creatorProfileUrl(creator)}
      target="_blank"
      rel="noopener noreferrer nofollow"
      style={{ height: ROW_HEIGHT }}
      className="flex shrink-0 items-center gap-3 px-5 transition hover:bg-black/5 dark:hover:bg-white/5"
    >
      {rank !== undefined ? (
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            accent === "amber"
              ? "bg-amber-400/15 text-amber-600 dark:text-amber-400"
              : "bg-black/10 text-black/60 dark:bg-white/10 dark:text-white/60"
          }`}
        >
          {rank}
        </span>
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/10 text-xs font-bold text-black/60 dark:bg-white/10 dark:text-white/60">
          {creator.name.slice(0, 1).toUpperCase()}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-black dark:text-white">
            {creator.name}
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${platformStyles[creator.platform]}`}
          >
            {creator.platform}
          </span>
        </div>
        <p className="truncate text-xs text-black/60 dark:text-white/60">
          {creator.note}
        </p>
      </div>
    </a>
  );
}

export default function CreatorMarquee({
  items,
  visibleCount,
  showRank = false,
  accent = "black",
}: {
  items: RecommendedCreator[];
  visibleCount: number;
  showRank?: boolean;
  accent?: "amber" | "black";
}) {
  // Otomatik kaydırma bilerek kapalı -- kartlar her zaman aynı, sabit
  // sırada duruyor (kullanıcı isterse elle kaydırabilir), kendiliğinden
  // hareket etmiyor.
  const { ref: trackRef, handlers } = useAutoScroll<HTMLDivElement>("vertical", {
    enabled: false,
    speed: 0.25,
  });

  const track = items;

  return (
    <div
      ref={trackRef}
      style={{ height: visibleCount * ROW_HEIGHT }}
      className="flex flex-col divide-y divide-black/5 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] dark:divide-white/5 [&::-webkit-scrollbar]:hidden"
      {...handlers}
    >
      {track.map((creator, i) => (
        <div key={`${creator.name}-${i}`} aria-hidden={i >= items.length}>
          <CreatorRow
            creator={creator}
            rank={showRank ? (i % items.length) + 1 : undefined}
            accent={accent}
          />
        </div>
      ))}
    </div>
  );
}
