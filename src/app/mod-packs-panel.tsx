"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const modPacks = [
  { name: "Neon Craft", gradient: "from-purple-500 to-fuchsia-600" },
  { name: "Rustic Realms", gradient: "from-amber-500 to-orange-700" },
  { name: "Frost Peak", gradient: "from-cyan-400 to-blue-600" },
  { name: "Void Walker", gradient: "from-slate-600 to-indigo-800" },
  { name: "Sunset Vale", gradient: "from-orange-400 to-pink-600" },
  { name: "Emerald Grove", gradient: "from-emerald-500 to-green-700" },
  { name: "Iron Forge", gradient: "from-zinc-500 to-neutral-700" },
  { name: "Coral Reef", gradient: "from-teal-400 to-cyan-600" },
];

const track = [...modPacks, ...modPacks];

export default function ModPacksPanel({
  className = "",
}: {
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pause = () => {
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    pausedRef.current = true;
  };

  const scheduleResume = () => {
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      pausedRef.current = false;
    }, 3000);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let frameId: number;

    const step = () => {
      if (!pausedRef.current) {
        el.scrollLeft += 0.5;
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-950 shadow-xl ${className}`}
    >
      <Link
        href="/mod-paketleri"
        className="flex aspect-[4/1] shrink-0 items-center justify-between px-5 text-white transition hover:bg-white/5"
      >
        <span className="font-sans text-base font-bold sm:text-lg">
          Sevdiğiniz Modları Deneyin
        </span>
        <span className="whitespace-nowrap font-sans text-xs opacity-70 sm:text-sm">
          Tümünü Gör →
        </span>
      </Link>

      <div
        ref={trackRef}
        className="flex flex-1 gap-3 overflow-x-auto px-5 pb-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onMouseEnter={pause}
        onMouseLeave={scheduleResume}
        onTouchStart={pause}
        onTouchEnd={scheduleResume}
        onWheel={() => {
          pause();
          scheduleResume();
        }}
      >
        {track.map((pack, i) => (
          <Link
            key={`${pack.name}-${i}`}
            href={`/mod-paketleri/${pack.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="flex w-28 shrink-0 flex-col overflow-hidden rounded-xl shadow-lg transition hover:scale-[1.03]"
          >
            <div
              className={`aspect-[4/3] bg-gradient-to-br ${pack.gradient}`}
            />
            <div className="flex aspect-[4/1] items-center justify-center bg-black/40 px-2">
              <span className="truncate font-sans text-xs font-medium text-white">
                {pack.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
