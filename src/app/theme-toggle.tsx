"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium text-black shadow-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
    >
      {dark ? "☀️ Açık Mod" : "🌙 Karanlık Mod"}
    </button>
  );
}
