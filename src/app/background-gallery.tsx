"use client";

import { useEffect, useRef, useState } from "react";
import RetryImage from "./retry-image";

// Hero'daki büyük "Hoşgeldin" kartının çoklu-görsel galerisiyle aynı
// mantık (bkz. hero-slider.tsx) -- tek görsel varsa hiç dönmüyor, 2+
// varsa kendi süresiyle (intervalMs) dönen bir slayt gösterisine dönüşüyor.
// Anasayfanın Topluluk ve Sunucular kartlarının arka planında kullanılıyor.
// Geçiş anlık olmasın diye (hero-slider.tsx'teki aynı fade deseni) görsel
// değişmeden önce 200ms'de solup, değiştikten sonra geri beliriyor.
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
  const [visible, setVisible] = useState(true);
  const fadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      setVisible(false);
      fadeTimeout.current = setTimeout(() => {
        setIndex((i) => (i + 1) % images.length);
        setVisible(true);
      }, 200);
    }, Math.max(1500, intervalMs));
    return () => {
      clearInterval(id);
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    };
  }, [images.length, intervalMs]);

  const src = images[index % images.length] ?? images[0];
  if (!src) return null;

  return (
    <RetryImage
      key={src}
      src={src}
      alt=""
      className={`absolute inset-0 h-full w-full object-cover transition duration-200 ease-in-out group-hover:scale-105 ${visible ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
}
