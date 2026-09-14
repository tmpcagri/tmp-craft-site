"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

function applyTheme(mode: ThemeMode) {
  const dark =
    mode === "dark" ||
    (mode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

const OPTIONS: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
  {
    mode: "light",
    label: "Açık",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    ),
  },
  {
    mode: "dark",
    label: "Koyu",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    mode: "system",
    label: "Otomatik",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
];

// Menü çekmecesinin en üstünde duran açık/koyu/otomatik seçici -- önceden
// navbar'da tek bir açık/koyu ikon düğmesiydi, "otomatik" (sistem temasını
// takip et) diye üçüncü bir seçenek yoktu. "system" seçiliyken sekme açık
// kalırken işletim sistemi teması değişirse de anlık güncelleniyor.
export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(stored === "dark" || stored === "light" ? stored : "system");
  }, []);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const choose = (next: ThemeMode) => {
    setMode(next);
    if (next === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", next);
    }
    applyTheme(next);
  };

  return (
    <div
      suppressHydrationWarning
      className="mb-6 flex rounded-2xl border border-black/10 bg-black/5 p-1 dark:border-white/10 dark:bg-white/5"
    >
      {OPTIONS.map(({ mode: m, label, icon }) => (
        <button
          key={m}
          type="button"
          onClick={() => choose(m)}
          suppressHydrationWarning
          className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium transition ${
            mode === m
              ? "bg-white text-black shadow-sm dark:bg-black dark:text-white"
              : "text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}
