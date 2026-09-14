"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// /arama'nın kendi arama kutusu -- navbar'daki arama kutusu mobilde
// (sm altı) sadece bir ikona küçülüp doğrudan /arama'ya link veriyor,
// yazacak bir yer sunmuyor. Bu sayfanın kendi input'u olmadan mobil
// kullanıcı buraya geldiğinde hiçbir şekilde arama yapamıyordu -- gerçek
// bir çıkmaz sokaktı.
export default function AramaSearchInput({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  const submit = () => {
    const trimmed = value.trim();
    router.push(trimmed ? `/arama?q=${encodeURIComponent(trimmed)}` : "/arama");
  };

  return (
    <div className="mt-6 flex items-center gap-3 rounded-full border border-black/10 bg-white/50 px-5 py-3 backdrop-blur-sm dark:border-white/10 dark:bg-black/30">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 opacity-60"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder="Mod, resource pack, shader ara…"
        className="w-full bg-transparent text-base text-black outline-none placeholder:text-black/40 dark:text-white dark:placeholder:text-white/40"
      />
      <button
        type="button"
        onClick={submit}
        className="shrink-0 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
      >
        Ara
      </button>
    </div>
  );
}
