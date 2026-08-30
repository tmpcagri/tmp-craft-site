"use client";

import { useState } from "react";

export default function DownloadButton() {
  const [message, setMessage] = useState("");

  return (
    <div className="mt-8 flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={() => setMessage("Bu paket için indirme henüz hazır değil.")}
        className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
      >
        İndir
      </button>
      {message && <p className="text-sm opacity-60">{message}</p>}
    </div>
  );
}
