"use client";

import { useEffect, useRef, useState } from "react";
import type { ResolvedMenuLevel } from "@/app/lib/moderator-menu";

// Tek bir seviyenin açılır listesi -- search-bar.tsx/notification-bell.tsx
// ile aynı popover deseni (kimlik panelindeki eski native <select>'in
// yerine geçen özel dropdown'la birebir aynı görsel dil).
function LevelDropdown({
  options,
  selectedId,
  onSelect,
}: {
  options: { id: string; label: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selectedLabel = options.find((o) => o.id === selectedId)?.label ?? "";

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-[18px] border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 opacity-60 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-1.5 flex flex-col gap-0.5 rounded-2xl border border-black/10 bg-white/95 p-1.5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/90"
        >
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              role="option"
              aria-selected={o.id === selectedId}
              onClick={() => {
                onSelect(o.id);
                setOpen(false);
              }}
              className={`rounded-xl px-3.5 py-2 text-left text-sm font-medium transition ${
                o.id === selectedId
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Moderatörün "neyi yöneteceğini" grup grup, YAPRAĞA (gerçek bir ayar
// ekranına) inene kadar seçtiği kaskad menü. `levels` zaten çözülmüş
// halde geliyor (bkz. resolveMenuLevels, page.tsx'te çağrılıyor) -- bu
// bileşen sadece görsel, path state'i tutmuyor. Bir üst seviye
// değiştiğinde altındaki tüm seviyeler otomatik sıfırlanır (page.tsx'teki
// onSelect bunu path'i o derinlikte kesip yeniden kurarak yapıyor).
export default function SectionSwitcher({
  levels,
  onSelect,
}: {
  levels: ResolvedMenuLevel[];
  onSelect: (depth: number, id: string) => void;
}) {
  if (levels.length === 0) return null;

  return (
    <div className="mt-3 flex w-full flex-col gap-2">
      {levels.map((level, depth) => (
        // Tek seçenekli bir seviyeyi (ör. "Mod Paketleri" grubunun tek
        // yaprağı "Mod / Shader Yükle") menü olarak göstermenin bir
        // anlamı yok -- seçilebilir tek bir şey varsa direkt etiket
        // olarak göster, tıklanabilir dropdown açma.
        <div key={depth}>
          {level.options.length > 1 ? (
            <LevelDropdown
              options={level.options}
              selectedId={level.selectedId}
              onSelect={(id) => onSelect(depth, id)}
            />
          ) : (
            <p className="w-full rounded-[18px] border border-transparent px-4 py-2 text-center text-sm font-medium text-black/50 dark:text-white/50">
              {level.options[0]?.label}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
