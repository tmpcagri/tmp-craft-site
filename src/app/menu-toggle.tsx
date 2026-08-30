"use client";

import { useState } from "react";
import { navLinks } from "./nav-links";
import ThemeToggle from "./theme-toggle";

export default function MenuToggle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menü"
        aria-expanded={open}
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`h-0.5 w-6 bg-black transition-transform duration-300 dark:bg-white ${
            open ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-black transition-opacity duration-300 dark:bg-white ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-black transition-transform duration-300 dark:bg-white ${
            open ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {open && (
        <div className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-10 bg-white/40 backdrop-blur-2xl dark:bg-black/50">
          <a
            href="/"
            onClick={() => setOpen(false)}
            className="absolute left-6 top-8 font-sans text-2xl font-bold tracking-tight text-black dark:text-white sm:left-10"
          >
            TMP Craft
          </a>
          <nav className="flex flex-col items-center gap-6 font-sans text-2xl text-black dark:text-white">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="transition hover:opacity-60"
              >
                {label}
              </a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      )}
    </>
  );
}
