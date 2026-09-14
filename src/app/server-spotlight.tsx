"use client";

import { useEffect, useState } from "react";

export type ServerCard = {
  name: string;
  players: string;
  fill: number;
};

// Sunucuları tek tek, reklam panosu gibi gösteren döngü -- her sunucu
// birkaç saniye sabit kalır, sonra sağdan sola akan bir bant geçişiyle
// bir sonraki sunucu gelir. Kesintisiz döngü için dizinin sonuna ilk
// öğenin bir kopyası eklenir; o kopyaya ulaşılınca geçişsiz şekilde başa
// sarılır (görünmez sıçrama, aynı "Şu an" tarzı sonsuz döngü mantığı).
export default function ServerSpotlight({
  items,
  intervalMs = 5500,
  className = "",
}: {
  items: ServerCard[];
  intervalMs?: number;
  className?: string;
}) {
  const [{ index, animated }, setState] = useState({ index: 0, animated: true });
  const track = [...items, items[0]];

  useEffect(() => {
    const id = setInterval(() => {
      setState((s) => ({ index: s.index + 1, animated: true }));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  useEffect(() => {
    if (index !== items.length) return;
    const timeout = setTimeout(() => {
      setState({ index: 0, animated: false });
    }, 600);
    return () => clearTimeout(timeout);
  }, [index, items.length]);

  return (
    <div className={`overflow-hidden rounded-2xl ${className}`}>
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: animated ? "transform 0.6s ease" : "none",
        }}
      >
        {track.map((server, i) => (
          <div
            key={i}
            className="flex h-full w-full shrink-0 flex-col justify-center gap-2 bg-white/10 p-5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
              <span className="font-sans text-xl font-bold text-white sm:text-2xl">
                {server.name}
              </span>
            </div>
            <span className="font-sans text-sm text-white/75 sm:text-base">
              {server.players} oyuncu
            </span>
            <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${server.fill}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
