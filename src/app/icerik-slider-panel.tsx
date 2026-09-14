"use client";

import Link from "next/link";
import { useAutoScroll } from "./lib/use-auto-scroll";

// Yayıncı listesi yerine kendi içeriğimiz -- insanların gerçekten izlediği/
// kullandığı şey: YouTube videoları ve sosyal medya paylaşımları.
const videos = [
  { title: "TMP Craft Tanıtım Videosu", platform: "YouTube", stat: "12.400 izlenme" },
  { title: "Haftalık Öne Çıkanlar #7", platform: "YouTube", stat: "8.500 izlenme" },
  { title: "Sunucu Turu: TMP Anaakım", platform: "YouTube", stat: "5.200 izlenme" },
  { title: "Yeni Sezon Fragmanı", platform: "TikTok", stat: "9.100 beğeni" },
  { title: "Build Zaman Aşımı: Kıyı Kasabası", platform: "YouTube", stat: "6.700 izlenme" },
  { title: "Topluluk Anları", platform: "Instagram", stat: "4.300 beğeni" },
];

const track = [...videos, ...videos];

export default function IcerikSliderPanel({
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
        src="/icerik-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/85 via-red-900/70 to-orange-900/50" />

      <Link
        href="/sosyal-medya"
        className="relative z-10 flex shrink-0 items-center justify-between px-6 py-4 text-white transition hover:bg-white/5"
      >
        <span className="font-sans text-lg font-bold sm:text-xl">
          İçeriklerimiz
        </span>
        <span className="whitespace-nowrap font-sans text-xs opacity-70 sm:text-sm">
          Kanala Git →
        </span>
      </Link>

      <div
        ref={trackRef}
        className="relative z-10 flex flex-1 gap-4 overflow-x-auto px-6 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        {...handlers}
      >
        {track.map((video, i) => (
          <a
            key={`${video.title}-${i}`}
            href="#"
            aria-hidden={i >= videos.length}
            tabIndex={i >= videos.length ? -1 : undefined}
            className="flex w-56 shrink-0 flex-col justify-end gap-1 rounded-2xl bg-white/10 p-4 shadow-lg backdrop-blur-sm transition hover:bg-white/15"
          >
            <span className="w-fit rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/80">
              {video.platform}
            </span>
            <h4 className="mt-1.5 font-sans text-sm font-bold text-white">
              {video.title}
            </h4>
            <p className="mt-1 font-sans text-xs text-white/70">
              {video.stat}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
