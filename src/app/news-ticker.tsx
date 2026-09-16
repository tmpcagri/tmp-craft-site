"use client";

import Link from "next/link";
import { useAutoScroll } from "./lib/use-auto-scroll";
import { TmpMark } from "./logo";

export type TickerItem = {
  label: string;
  href: string;
  tag?: string;
  bold?: boolean;
};

export default function NewsTicker({
  items,
  className = "",
  linked = true,
}: {
  items: TickerItem[];
  className?: string;
  // Bu ticker zaten tıklanabilir bir üst eleman (ör. bir kart Link'i)
  // içinde gömülüyse, iç içe <a> etiketi oluşmasın diye false verilir --
  // öğeler o zaman düz span olarak render edilir.
  linked?: boolean;
}) {
  const { ref: trackRef, handlers } = useAutoScroll<HTMLDivElement>("horizontal", {
    speed: 0.35,
  });

  if (items.length === 0) return null;

  const track = [...items, ...items];

  return (
    <div
      ref={trackRef}
      className={`flex items-center gap-6 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      {...handlers}
    >
      {track.map((item, i) => {
        const content = (
          <>
            {item.tag && (
              <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide opacity-70 dark:bg-white/15">
                {item.tag}
              </span>
            )}
            {item.label}
          </>
        );
        return (
          <span key={`${item.label}-${i}`} className="flex shrink-0 items-center gap-6">
            {linked ? (
              <Link
                href={item.href}
                aria-hidden={i >= items.length}
                tabIndex={i >= items.length ? -1 : undefined}
                className={`flex shrink-0 items-center gap-2 font-sans text-sm transition hover:opacity-70 ${item.bold ? "font-bold" : "font-medium"}`}
              >
                {content}
              </Link>
            ) : (
              <span
                aria-hidden={i >= items.length}
                className={`flex shrink-0 items-center gap-2 font-sans text-sm ${item.bold ? "font-bold" : "font-medium"}`}
              >
                {content}
              </span>
            )}
            <TmpMark className="opacity-60" />
          </span>
        );
      })}
    </div>
  );
}
