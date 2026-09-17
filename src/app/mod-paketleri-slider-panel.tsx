"use client";

import Link from "next/link";
import type { FeaturedModTag } from "./lib/content";
import type { DownloadItem } from "./lib/downloads";
import { useAutoScroll } from "./lib/use-auto-scroll";

const TAG_STYLE: Record<Exclude<FeaturedModTag, "">, string> = {
  Popüler: "bg-amber-400 text-black",
  "En Çok İndirilen": "bg-emerald-400 text-black",
  Yeni: "bg-sky-400 text-black",
};

// Admin'in /admin -> Öne Çıkan Modlar'da seçtiği kart -- ya mevcut bir moda
// slug ile referans verir ("existing"), ya da moderatörün kendi
// girdiği görsel/başlık/açıklama/linkle tamamen bağımsız bir karttır
// ("custom"), bkz. lib/content.ts CuratedCardEntry.
export type FeaturedModCard =
  | { mode: "existing"; item: DownloadItem; tag: FeaturedModTag }
  | {
      mode: "custom";
      title: string;
      description: string;
      imageUrl: string;
      linkUrl: string;
      tag: FeaturedModTag;
    };

export default function ModPaketleriSliderPanel({
  className = "",
  allItems,
  featured,
}: {
  className?: string;
  allItems: DownloadItem[];
  // Admin'in /admin -> Öne Çıkan Modlar'da seçtiği sıra + rozet -- boşsa
  // eski davranışa (ilk 8 mod, rozetsiz) düşülüyor.
  featured: FeaturedModCard[];
}) {
  const items: FeaturedModCard[] =
    featured.length > 0
      ? featured
      : allItems.slice(0, 8).map((item) => ({ mode: "existing", item, tag: "" as FeaturedModTag }));
  const track = [...items, ...items];

  const { ref: trackRef, handlers } = useAutoScroll<HTMLDivElement>("horizontal");

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-3xl shadow-xl ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static brand background asset */}
      <img
        src="/mod-paketleri-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/85 via-blue-900/70 to-sky-900/50" />

      <Link
        href="/mod-paketleri"
        className="relative z-10 flex shrink-0 items-center justify-between px-6 py-4 text-white transition hover:bg-white/5"
      >
        <span className="font-sans text-lg font-bold sm:text-xl">
          Mod Paketleri
        </span>
        <span className="whitespace-nowrap font-sans text-xs opacity-70 sm:text-sm">
          Tümünü Gör →
        </span>
      </Link>

      <div
        ref={trackRef}
        className="relative z-10 flex flex-1 gap-4 overflow-x-auto px-6 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        {...handlers}
      >
        {track.map((card, i) => {
          const key = card.mode === "existing" ? card.item.slug : card.linkUrl || card.title;
          const href = card.mode === "existing" ? `/mod-paketleri/${card.item.slug}` : card.linkUrl || "#";
          const name = card.mode === "existing" ? card.item.name : card.title;
          const description = card.mode === "existing" ? card.item.description : card.description;
          const imageUrl = card.mode === "custom" ? card.imageUrl : undefined;
          return (
            <Link
              key={`${key}-${i}`}
              href={href}
              aria-hidden={i >= items.length}
              tabIndex={i >= items.length ? -1 : undefined}
              className="relative flex w-56 shrink-0 flex-col justify-end overflow-hidden rounded-2xl bg-white/10 p-4 shadow-lg backdrop-blur-sm transition hover:bg-white/15"
            >
              {imageUrl && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded custom card image, arbitrary URL */}
                  <img
                    src={imageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </>
              )}
              {card.tag && (
                <span
                  className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${TAG_STYLE[card.tag]}`}
                >
                  {card.tag}
                </span>
              )}
              <h4 className="relative z-10 font-sans text-sm font-bold text-white">
                {name}
              </h4>
              <p className="relative z-10 mt-1 line-clamp-2 font-sans text-xs text-white/70">
                {description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
