"use client";

import { useEffect, useState } from "react";

function useRotator(length: number, intervalMs: number) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [length, intervalMs]);

  return index;
}

type PanelItem = { title: string; body: string; gradient: string };

const panels: {
  className: string;
  intervalMs: number;
  items: PanelItem[];
}[] = [
  {
    className: "col-span-2 row-span-1 sm:col-span-2 sm:row-span-1",
    intervalMs: 5000,
    items: [
      {
        title: "Yaratıcı Yönetim",
        body: "Marka stratejisinden görsel dile.",
        gradient: "from-rose-400 to-red-500",
      },
      {
        title: "İçerik Üretimi",
        body: "Sosyal medya ve video prodüksiyonu.",
        gradient: "from-fuchsia-400 to-pink-500",
      },
    ],
  },
  {
    className: "col-span-2 row-span-1 sm:col-span-2 sm:row-span-2",
    intervalMs: 6000,
    items: [
      {
        title: "Ürün Tasarımı",
        body: "Kullanıcı odaklı arayüz ve deneyim.",
        gradient: "from-sky-400 to-blue-600",
      },
      {
        title: "Mobil Uygulama",
        body: "iOS ve Android için native deneyim.",
        gradient: "from-indigo-400 to-violet-600",
      },
    ],
  },
  {
    className: "col-span-2 row-span-1 sm:col-span-1",
    intervalMs: 4000,
    items: [
      {
        title: "SEO",
        body: "Görünürlüğünüzü artırıyoruz.",
        gradient: "from-lime-400 to-green-500",
      },
      {
        title: "Analitik",
        body: "Veriyle karar verin.",
        gradient: "from-teal-400 to-emerald-500",
      },
    ],
  },
  {
    className: "col-span-2 row-span-1 sm:col-span-1",
    intervalMs: 7000,
    items: [
      {
        title: "Destek",
        body: "7/24 yanınızdayız.",
        gradient: "from-yellow-400 to-amber-500",
      },
      {
        title: "Danışmanlık",
        body: "Dijital yol haritanızı çizelim.",
        gradient: "from-orange-400 to-red-500",
      },
    ],
  },
];

function Panel({
  className,
  intervalMs,
  items,
}: (typeof panels)[number]) {
  const index = useRotator(items.length, intervalMs);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl shadow-xl ${className}`}
    >
      {items.map((item, i) => (
        <div
          key={item.title}
          className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-br p-6 transition-opacity duration-1000 ${item.gradient} ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <h3 className="font-sans text-xl font-bold text-white">
            {item.title}
          </h3>
          <p className="mt-1 font-sans text-sm text-white/80">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export default function SecondarySlider() {
  return (
    <section className="relative z-10 flex w-full items-center justify-center pb-16">
      <div className="grid w-[calc(100%-2rem)] auto-rows-[180px] grid-cols-2 gap-4 sm:w-[calc(100%-5rem)] sm:grid-cols-4">
        {panels.map((panel) => (
          <Panel key={panel.items[0].title} {...panel} />
        ))}
      </div>
    </section>
  );
}
