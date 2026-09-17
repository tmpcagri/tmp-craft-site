"use client";

import Link from "next/link";
import { useAutoScroll } from "./lib/use-auto-scroll";

const courses = [
  { title: "Minecraft'a Sıfırdan Başla", excerpt: "Kurulum, temel kontroller, ilk gece." },
  { title: "Redstone 101", excerpt: "Mantık kapıları ve otomasyonun temelleri." },
  { title: "Kendi Modunu Yaz", excerpt: "Java ve Forge ile ilk modunu geliştir." },
  { title: "Sunucu Kurma Rehberi", excerpt: "Kendi sunucunu ayağa kaldır, yönet." },
  { title: "Build Teknikleri", excerpt: "Orantı, doku ve siluet ile daha iyi inşa." },
  { title: "Şeffaf Ekonomi Yönetimi", excerpt: "Sunucunda adil bir ekonomi kur." },
];

const track = [...courses, ...courses];

export default function EgitimlerSliderPanel({
  className = "",
}: {
  className?: string;
}) {
  const { ref: trackRef, handlers } = useAutoScroll<HTMLDivElement>("horizontal");

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-3xl shadow-xl ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-blue-900 to-sky-900" />

      <Link
        href="/egitimler"
        className="relative z-10 flex shrink-0 items-center justify-between px-6 py-4 text-white transition hover:bg-white/5"
      >
        <span className="font-sans text-lg font-bold sm:text-xl">
          Eğitimler
        </span>
        <span className="whitespace-nowrap font-sans text-xs opacity-70 sm:text-sm">
          Yakında →
        </span>
      </Link>

      <div
        ref={trackRef}
        className="relative z-10 flex flex-1 gap-4 overflow-x-auto px-6 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        {...handlers}
      >
        {track.map((course, i) => (
          <Link
            key={`${course.title}-${i}`}
            href="/egitimler"
            aria-hidden={i >= courses.length}
            tabIndex={i >= courses.length ? -1 : undefined}
            className="flex w-56 shrink-0 flex-col justify-end rounded-2xl bg-white/10 p-4 shadow-lg backdrop-blur-sm transition hover:bg-white/15"
          >
            <h4 className="font-sans text-sm font-bold text-white">
              {course.title}
            </h4>
            <p className="mt-1 font-sans text-xs text-white/70">
              {course.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
