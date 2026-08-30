"use client";

import Link from "next/link";
import { useState } from "react";
import { searchDownloads } from "./lib/downloads";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = searchDownloads(query).slice(0, 6);
  const showDropdown = focused && query.trim().length > 0;

  return (
    <div className="relative justify-self-center w-72">
      <div className="flex items-center gap-3 rounded-full border border-current/20 px-5 py-3 text-base transition-all duration-300 hover:bg-current/10 hover:shadow-[0_0_30px_-4px_currentColor]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 opacity-70"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Ara..."
          className="w-full bg-transparent outline-none placeholder:opacity-60"
        />
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/90">
          {results.length === 0 ? (
            <p className="p-4 text-sm text-black/50 dark:text-white/50">
              Sonuç bulunamadı
            </p>
          ) : (
            results.map((item) => (
              <Link
                key={item.slug}
                href={`/mod-paketleri/${item.slug}`}
                className="flex items-center gap-3 px-4 py-3 text-sm text-black transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
              >
                <span
                  className={`h-6 w-6 shrink-0 rounded-full bg-gradient-to-br ${item.gradient}`}
                />
                <span>
                  <span className="font-semibold">{item.name}</span>{" "}
                  <span className="opacity-50">· {item.category}</span>
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
