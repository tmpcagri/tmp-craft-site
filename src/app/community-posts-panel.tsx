"use client";

import { useEffect, useRef } from "react";

const posts = [
  { title: "Yeni sezon başladı!", excerpt: "Topluluk etkinlikleri için hazır mısın?" },
  { title: "En çok sevilen 5 mod", excerpt: "Bu ay öne çıkan paketler." },
  { title: "Sunucu güncellendi", excerpt: "Performans iyileştirmeleri yapıldı." },
  { title: "Tasarım yarışması", excerpt: "Kendi paketini paylaş, ödül kazan." },
  { title: "Haftalık canlı yayın", excerpt: "Cuma akşamı buluşuyoruz." },
  { title: "Topluluk kuralları güncellendi", excerpt: "Yeni sürümü incele." },
];

const track = [...posts, ...posts];

export default function CommunityPostsPanel({
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
      className={`relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-800 shadow-xl ${className}`}
    >
      <a
        href="/topluluk"
        className="flex shrink-0 items-center justify-between px-6 py-4 text-white transition hover:bg-white/5"
      >
        <span className="font-sans text-lg font-bold sm:text-xl">
          Topluluk
        </span>
        <span className="whitespace-nowrap font-sans text-xs opacity-70 sm:text-sm">
          Tümünü Gör →
        </span>
      </a>

      <div
        ref={trackRef}
        className="flex flex-1 gap-4 overflow-x-auto px-6 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onMouseEnter={pause}
        onMouseLeave={scheduleResume}
        onTouchStart={pause}
        onTouchEnd={scheduleResume}
        onWheel={() => {
          pause();
          scheduleResume();
        }}
      >
        {track.map((post, i) => (
          <a
            key={`${post.title}-${i}`}
            href="/topluluk"
            className="flex w-56 shrink-0 flex-col justify-end rounded-2xl bg-white/10 p-4 shadow-lg backdrop-blur-sm transition hover:bg-white/15"
          >
            <h4 className="font-sans text-sm font-bold text-white">
              {post.title}
            </h4>
            <p className="mt-1 font-sans text-xs text-white/70">
              {post.excerpt}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
