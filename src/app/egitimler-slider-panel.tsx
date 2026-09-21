"use client";

import Link from "next/link";
import ComingSoonWatermark from "./coming-soon-watermark";

export default function EgitimlerSliderPanel({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-3xl shadow-xl ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- sabit panel arka planı, R2'de barındırılıyor */}
      <img
        src="https://pub-5946b15c1992464485b90a8b76df9ab1.r2.dev/homepage/egitimler-panel.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-blue-900/60 to-sky-900/70" />

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

      <div className="relative z-10 flex flex-1 items-center justify-center px-6 pb-6 text-center">
        <ComingSoonWatermark />
        <p className="font-sans text-sm text-white/70">
          Yakında hizmete sunulacaktır.
        </p>
      </div>
    </div>
  );
}
