"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Dark mode can only be read from the DOM after mount — the inline
    // script in layout.tsx sets the class before hydration to avoid a
    // flash, but React doesn't know about it until this runs once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      className="rounded-full border border-black/10 bg-white/80 px-5 py-2.5 text-base font-medium text-black shadow-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
    >
      <span suppressHydrationWarning>
        {dark ? "☀️ Açık Mod" : "🌙 Karanlık Mod"}
      </span>
    </button>
  );
}
