"use client";

import { useEffect, useState } from "react";

// Hero'daki büyük "Hoşgeldin" kartının çoklu-görsel galerisiyle aynı
// mantık (bkz. hero-slider.tsx) -- tek görsel varsa hiç dönmüyor, 2+
// varsa kendi süresiyle (intervalMs) dönen bir slayt gösterisine dönüşüyor.
// Anasayfanın Topluluk ve Sunucular kartlarının arka planında kullanılıyor.
export default function BackgroundGallery({
  images,
  intervalMs,
  className = "",
}: {
  images: string[];
  intervalMs: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      Math.max(1500, intervalMs),
    );
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  const src = images[index % images.length] ?? images[0];
  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- moderatör tarafından yönetilen arka plan galerisi
    <img
      src={src}
      alt=""
      className={`absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105 ${className}`}
    />
  );
}
