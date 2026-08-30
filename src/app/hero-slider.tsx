"use client";

import { useEffect, useState } from "react";
import ModPacksPanel from "./mod-packs-panel";

const featuredSlides = [
  {
    title: "Fikirden Ürüne",
    body: "Markanızı zanaatla hayata geçiriyoruz.",
    gradient: "from-orange-400 via-pink-500 to-purple-600",
  },
  {
    title: "Web Tasarımı",
    body: "Modern, hızlı ve etkileyici dijital deneyimler.",
    gradient: "from-blue-400 via-indigo-500 to-purple-600",
  },
  {
    title: "Marka Kimliği",
    body: "Unutulmaz bir marka kimliği inşa ediyoruz.",
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
  },
];

const sideCard = {
  title: "Son Projeler",
  body: "Yakında burada.",
  gradient: "from-cyan-400 to-blue-500",
};

const sideCardClassName =
  "relative col-span-3 h-40 overflow-hidden rounded-3xl shadow-xl sm:col-span-1 sm:h-auto";

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % featuredSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid w-[calc(100%-2rem)] grid-cols-3 gap-4 sm:h-[75vh] sm:w-[calc(100%-5rem)] sm:grid-rows-2">
      <div className="relative col-span-3 h-[60vh] overflow-hidden rounded-3xl shadow-2xl sm:col-span-2 sm:row-span-2 sm:h-auto">
        {featuredSlides.map((slide, i) => (
          <div
            key={slide.title}
            className={`absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br ${slide.gradient} px-6 text-center transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <h2 className="font-sans text-3xl font-bold text-white sm:text-5xl">
              {slide.title}
            </h2>
            <p className="max-w-md font-sans text-white/80">{slide.body}</p>
          </div>
        ))}

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {featuredSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slayt ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-6 left-[55%] hidden flex-col items-start whitespace-nowrap sm:flex">
          <span className="font-sans text-lg font-bold text-white">
            TMP Craft
          </span>
          <span className="font-sans text-xs text-white/70">
            Fikirden ürüne, zanaatla inşa eden dijital yapım stüdyosu
          </span>
        </div>
      </div>

      <ModPacksPanel className={sideCardClassName} />

      <div
        className={`flex flex-col justify-end bg-gradient-to-br p-6 ${sideCardClassName} ${sideCard.gradient}`}
      >
        <h3 className="font-sans text-xl font-bold text-white">
          {sideCard.title}
        </h3>
        <p className="mt-1 font-sans text-sm text-white/80">
          {sideCard.body}
        </p>
      </div>
    </div>
  );
}
