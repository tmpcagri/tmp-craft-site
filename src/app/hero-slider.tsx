"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HeroContent } from "./lib/content";
import Logo from "./logo";
import RetryImage from "./retry-image";

// Önceden burada otomatik dönen tek-mesajlı bir carousel vardı (4 slayt,
// 4.5sn'de bir geçiş). Carousel'lar üzerine yapılan bağımsız araştırma
// (Nielsen Norman Group, Erik Runyon'ın etkileşim verileri) net: kullanıcıların
// ~%99'u hiçbir slaytla etkileşime girmiyor, tıklayanların da ~%89'u SADECE
// ilk slayta tıklıyor -- yani "aynı anda tek mesaj" tasarımı pratikte
// "genelde sadece ilk mesaj görülüyor" anlamına geliyor. F-pattern göz
// tarama araştırması da en "sıcak" bölgenin sol-üst olduğunu, sağa/aşağı
// gittikçe soğuduğunu gösteriyor. Bu yüzden 3 küçük kart hep AYNI ANDA,
// statik bir mozaikte gösteriliyor. Büyük "Hoşgeldin" kartı BUNUN
// istisnası -- admin'den birden fazla görsel eklenebiliyor, o zaman
// kendi süresiyle (featuredIntervalMs) dönen küçük bir galeriye dönüşüyor
// (tek görsel varsa hiç dönmüyor, eski statik davranış).
export default function HeroSlider({ content }: { content: HeroContent }) {
  const { featuredSlides, featuredIntervalMs, secondary } = content;
  const [index, setIndex] = useState(0);
  // Yumuşak geçiş için: önce mevcut slaytı 400ms'de fade-out yapıyoruz,
  // sonra görseli/yazıyı değiştirip fade-in ediyoruz -- iki görseli aynı
  // anda üst üste bindirmek yerine (daha karmaşık) tek katmanlı basit bir
  // "solup yeniden beliren" geçiş.
  const [visible, setVisible] = useState(true);
  const fadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (featuredSlides.length < 2) return;
    const id = setInterval(() => {
      setVisible(false);
      fadeTimeout.current = setTimeout(() => {
        setIndex((i) => (i + 1) % featuredSlides.length);
        setVisible(true);
      }, 250);
    }, Math.max(1500, featuredIntervalMs));
    return () => {
      clearInterval(id);
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    };
  }, [featuredSlides.length, featuredIntervalMs]);

  const featured = featuredSlides[index % featuredSlides.length] ?? featuredSlides[0];
  if (!featured) return null;

  return (
    <div className="grid h-auto w-[calc(100%-2rem)] grid-cols-1 gap-3 sm:h-[52vh] sm:w-[calc(100%-5rem)] sm:grid-cols-[1.6fr_1fr]">
      <Link
        href={featured.href}
        className="group relative flex h-56 flex-col items-start justify-end gap-2 overflow-hidden rounded-3xl p-6 shadow-2xl sm:h-full sm:p-10"
      >
        <RetryImage
          key={featured.image}
          src={featured.image}
          alt=""
          priority
          className={`absolute inset-0 h-full w-full object-cover transition duration-200 ease-in-out group-hover:scale-105 ${visible ? "opacity-100" : "opacity-0"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <h1
          className={`relative font-sans text-3xl font-bold text-white transition-opacity duration-200 ease-in-out sm:text-5xl ${visible ? "opacity-100" : "opacity-0"}`}
        >
          {featured.title}
        </h1>
        <p
          className={`relative max-w-md font-sans text-sm text-white/80 transition-opacity duration-200 ease-in-out sm:text-lg ${visible ? "opacity-100" : "opacity-0"}`}
        >
          {featured.body}
        </p>

        {featuredSlides.length > 1 && (
          <div className="relative z-10 mt-1 flex gap-1.5">
            {featuredSlides.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === index % featuredSlides.length ? "w-5 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-4 right-4 hidden flex-col items-end whitespace-nowrap text-white sm:flex">
          <Logo compact />
          <span className="mt-1 font-sans text-xs text-white/70">
            Minecraft mod, sunucu ve topluluk merkezi
          </span>
        </div>
      </Link>

      <div className="grid grid-cols-1 gap-3 sm:h-full sm:grid-rows-3">
        {secondary.map((slide, i) => (
          <Link
            key={i}
            href={slide.href}
            className="group relative flex h-28 flex-col items-start justify-end gap-1 overflow-hidden rounded-2xl p-4 shadow-lg sm:h-full"
          >
            {slide.image ? (
              <>
                <RetryImage
                  src={slide.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />
            )}
            <h2 className="relative font-sans text-base font-bold text-white sm:text-lg">
              {slide.title}
            </h2>
            <p className="relative font-sans text-xs text-white/75 sm:text-sm">
              {slide.body}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
