"use client";

import { useRef, useState } from "react";
import { useOutsideClick } from "../lib/use-outside-click";

// İkisi de doluysa tıklayınca "Java mı Bedrock mu?" seçtiriyor, sadece
// biri doluysa direkt o formatın adıyla tek buton gösteriyor. İkisi de
// boşsa bu bileşen hiç render edilmemeli (bkz. çağıran taraf).
export default function SchematicDownloadButton({
  javaUrl,
  bedrockUrl,
}: {
  javaUrl: string | null;
  bedrockUrl: string | null;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(containerRef, () => setOpen(false), open);

  if (javaUrl && !bedrockUrl) {
    return (
      <a
        href={javaUrl}
        target="_blank"
        rel="noreferrer"
        className="block w-full rounded-full bg-black px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
      >
        Java&apos;yı İndir
      </a>
    );
  }

  if (bedrockUrl && !javaUrl) {
    return (
      <a
        href={bedrockUrl}
        target="_blank"
        rel="noreferrer"
        className="block w-full rounded-full bg-black px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
      >
        Bedrock&apos;u İndir
      </a>
    );
  }

  if (!javaUrl && !bedrockUrl) return null;

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="block w-full rounded-full bg-black px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
      >
        Şematiği İndir
      </button>

      {open && (
        <div className="absolute inset-x-0 bottom-full z-20 mb-1.5 flex flex-col gap-0.5 rounded-2xl border border-black/10 bg-white/95 p-1.5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/90">
          <a
            href={javaUrl!}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="rounded-xl px-3.5 py-2 text-center text-sm font-medium text-black/70 transition hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
          >
            Java
          </a>
          <a
            href={bedrockUrl!}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="rounded-xl px-3.5 py-2 text-center text-sm font-medium text-black/70 transition hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
          >
            Bedrock
          </a>
        </div>
      )}
    </div>
  );
}
