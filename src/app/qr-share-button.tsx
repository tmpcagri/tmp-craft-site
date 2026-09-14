"use client";

import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "./lib/use-outside-click";

// Sayfanın linkini QR koduna çeviren küçük bir paylaşım widget'ı --
// tamamen client-side (qrcode paketi), hiçbir URL dışarıya/bir servise
// gönderilmiyor. Canlı yayında ekrana gösterip "şunu okutun" demek ya
// da telefona hızlıca aktarmak için düşünüldü.
export default function QrShareButton({
  className = "",
  compact = false,
  inline = false,
}: {
  className?: string;
  compact?: boolean;
  // Açılır bir popover'ın arkasına saklamak yerine, QR kodu tıklama
  // beklemeden direkt render eder -- sayfa ilk açıldığında hemen taranabilir
  // olması istenen yerler için (ör. mod paketi detay sayfasının üstü).
  inline?: boolean;
}) {
  const [open, setOpen] = useState(inline);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(containerRef, () => setOpen(false), open && !inline);

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, window.location.href, {
      width: 160,
      margin: 1,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    }).catch(() => {});
  }, [open]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Panoya erişim reddedilmişse sessizce yut -- link zaten QR'da görünüyor.
    }
  };

  if (inline) {
    return (
      <div className={`rounded-2xl border border-black/10 bg-white/40 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-black/40 ${className}`}>
        <p className="mb-3 text-center font-sans text-sm font-bold text-black dark:text-white">
          QR ile Paylaş
        </p>
        <div className="flex justify-center rounded-2xl bg-white p-3">
          <canvas ref={canvasRef} />
        </div>
        <button
          onClick={copyLink}
          className="mt-4 w-full rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          {copied ? "Kopyalandı ✓" : "Linki Kopyala"}
        </button>
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="QR kod ile paylaş"
        aria-expanded={open}
        className={`flex items-center justify-center rounded-full border border-black/10 bg-white/80 text-black shadow-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-black/50 dark:text-white dark:hover:bg-black/70 ${
          compact ? "h-8 w-8" : "h-10 w-10"
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 14h3v3h-3zM14 20.5h2M20.5 14v2M20.5 20.5h.01" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-64 rounded-3xl border border-black/10 bg-white/95 p-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/90">
          <p className="mb-3 text-center font-sans text-sm font-bold text-black dark:text-white">
            QR ile Paylaş
          </p>
          <div className="flex justify-center rounded-2xl bg-white p-3">
            <canvas ref={canvasRef} />
          </div>
          <button
            onClick={copyLink}
            className="mt-4 w-full rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            {copied ? "Kopyalandı ✓" : "Linki Kopyala"}
          </button>
        </div>
      )}
    </div>
  );
}
