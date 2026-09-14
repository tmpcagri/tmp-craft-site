"use client";

import Link from "next/link";
import { downloadItems } from "./lib/downloads";
import { useAutoScroll } from "./lib/use-auto-scroll";

const items = downloadItems.slice(0, 8);
const track = [...items, ...items];

export default function ModPaketleriSliderPanel({
  className = "",
}: {
  className?: string;
}) {
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
        {track.map((item, i) => (
          <Link
            key={`${item.slug}-${i}`}
            href={`/mod-paketleri/${item.slug}`}
            aria-hidden={i >= items.length}
            tabIndex={i >= items.length ? -1 : undefined}
            className="flex w-56 shrink-0 flex-col justify-end rounded-2xl bg-white/10 p-4 shadow-lg backdrop-blur-sm transition hover:bg-white/15"
          >
            <h4 className="font-sans text-sm font-bold text-white">
              {item.name}
            </h4>
            <p className="mt-1 line-clamp-2 font-sans text-xs text-white/70">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
