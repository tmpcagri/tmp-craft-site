"use client";

import { useState } from "react";
import type { NavLink } from "./lib/content";
import ThemeToggle from "./theme-toggle";

export default function MenuToggle({
  logoText,
  navLinks,
}: {
  logoText: string;
  navLinks: NavLink[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menü"
        aria-expanded={open}
        className="relative z-50 flex h-12 w-12 flex-col items-center justify-center gap-2"
      >
        <span
          className={`h-0.5 w-7 bg-black transition-transform duration-300 dark:bg-white ${
            open ? "translate-y-2.5 rotate-45" : ""
          }`}
        />
        <span
          className={`h-0.5 w-7 bg-black transition-opacity duration-300 dark:bg-white ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`h-0.5 w-7 bg-black transition-transform duration-300 dark:bg-white ${
            open ? "-translate-y-2.5 -rotate-45" : ""
          }`}
        />
      </button>

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-black/10 backdrop-blur-sm transition-opacity duration-300 dark:bg-black/30 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col gap-1 border-r border-black/10 bg-white/90 px-5 pb-6 pt-24 backdrop-blur-xl transition-transform duration-300 ease-out dark:border-white/10 dark:bg-black/90 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <p className="mb-3 font-sans text-xl font-bold tracking-tight text-black dark:text-white">
          {logoText}
        </p>

        <nav className="flex flex-1 flex-col gap-1">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm text-black/80 transition hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50" />
              {label}
            </a>
          ))}
        </nav>

        <div className="pt-4">
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
