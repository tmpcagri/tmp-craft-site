"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      aria-label="Geri git"
      className="group mb-6 flex w-fit items-center gap-2.5 text-sm font-medium text-black/70 transition hover:text-black dark:text-white/70 dark:hover:text-white"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white/80 shadow-sm backdrop-blur transition group-hover:-translate-x-0.5 group-hover:bg-white dark:border-white/15 dark:bg-black/50 dark:group-hover:bg-black/70">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </span>
      Geri
    </button>
  );
}
