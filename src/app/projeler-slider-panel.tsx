"use client";

import Link from "next/link";
import { guides as allGuides } from "./lib/guides";
import { useAutoScroll } from "./lib/use-auto-scroll";

const guides = [...allGuides]
  .sort((a, b) => b.views - a.views)
  .slice(0, 8);

const track = [...guides, ...guides];

export default function ProjelerSliderPanel({
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
        src="/projeler-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/85 via-orange-900/70 to-red-900/50" />

      <Link
        href="/projeler"
        className="relative z-10 flex shrink-0 items-center justify-between px-6 py-4 text-white transition hover:bg-white/5"
      >
        <span className="font-sans text-lg font-bold sm:text-xl">
          Build ve Farm Rehberi
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
        {track.map((guide, i) => (
          <Link
            key={`${guide.slug}-${i}`}
            href={`/projeler/${guide.slug}`}
            aria-hidden={i >= guides.length}
            tabIndex={i >= guides.length ? -1 : undefined}
            className="flex w-56 shrink-0 flex-col justify-end gap-1 rounded-2xl bg-white/10 p-4 shadow-lg backdrop-blur-sm transition hover:bg-white/15"
          >
            <span className="w-fit rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/80">
              {guide.kind === "Build" ? "Build" : "Farm"} · {guide.category}
            </span>
            <h4 className="mt-1.5 font-sans text-sm font-bold text-white">
              {guide.title}
            </h4>
            <p className="mt-1 line-clamp-2 font-sans text-xs text-white/70">
              {guide.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
