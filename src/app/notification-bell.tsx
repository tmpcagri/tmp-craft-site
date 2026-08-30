"use client";

import { useState } from "react";

type Notification = { title: string; body: string };

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications] = useState<Notification[]>([]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Bildirimler"
        aria-expanded={open}
        className="relative flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black shadow-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-3xl border border-black/10 bg-white/95 p-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/90">
          <h3 className="mb-3 font-sans text-sm font-bold text-black dark:text-white">
            Bildirimler
          </h3>
          {notifications.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">
              Bildirim yok
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {notifications.map((n, i) => (
                <div key={i}>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {n.title}
                  </p>
                  <p className="text-xs text-black/60 dark:text-white/60">
                    {n.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
