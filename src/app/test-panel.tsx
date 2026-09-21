"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useOutsideClick } from "./lib/use-outside-click";

// Sadece test/QA amaçlı: her sayfaya tek tıkla gitme + navbar'daki popup'ları
// (bildirim/arama/menü/hesap) sayfanın neresinde olursan ol tetikleme.
// Diğer bileşenler `testpanel:*` custom event'lerini dinliyor -- gerçek
// state'lerini kendileri yönetiyor, burası sadece "tıklanmış gibi" bir
// sinyal gönderiyor.
const PAGES: { label: string; href: string }[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Mod Paketleri", href: "/mod-paketleri" },
  { label: "Projeler (Build/Farm)", href: "/projeler" },
  { label: "Sunucular", href: "/sunucular" },
  { label: "Eğitimler", href: "/egitimler" },
  { label: "Topluluk", href: "/topluluk" },
  { label: "Sosyal Medya", href: "/sosyal-medya" },
  { label: "Arama", href: "/arama" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
  { label: "Destek", href: "/destek" },
  { label: "SSS", href: "/sss" },
  { label: "Topluluk Kuralları", href: "/kurallar" },
  { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
  { label: "KVKK", href: "/kvkk" },
  { label: "Telif Hakkı", href: "/telif-hakki" },
  { label: "Giriş", href: "/giris" },
  { label: "Hesabım (Kaydedilenler)", href: "/hesabim" },
  { label: "Hesap Hakkında", href: "/hesap" },
  { label: "Mesajlar", href: "/mesajlar" },
  { label: "Yasaklı", href: "/yasakli" },
  { label: "Moderatör Paneli", href: "/moderator" },
  { label: "Yönetim Paneli", href: "/yonetim" },
];

const INTERACTIONS: { label: string; event: string }[] = [
  { label: "Bildirimleri Aç", event: "testpanel:open-notifications" },
  { label: "Aramayı Aktifleştir", event: "testpanel:focus-search" },
  { label: "Menüyü Aç", event: "testpanel:open-menu" },
  { label: "Hesap Menüsünü Aç", event: "testpanel:open-account" },
];

export default function TestPanel() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false), open);

  const fire = (event: string) => {
    window.dispatchEvent(new CustomEvent(event));
  };

  return (
    <div ref={ref} className="fixed bottom-5 right-5 z-[100]">
      {open && (
        <div className="mb-3 flex max-h-[70vh] w-72 flex-col overflow-hidden rounded-3xl border border-amber-500/30 bg-white/95 shadow-2xl backdrop-blur-xl dark:bg-neutral-900/95">
          <div className="shrink-0 bg-amber-500/10 px-4 py-2.5">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
              Test Paneli
            </p>
          </div>

          <div className="overflow-y-auto p-3">
            <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wide text-black/40 dark:text-white/40">
              Etkileşimler
            </p>
            <div className="mb-3 flex flex-col gap-0.5">
              {INTERACTIONS.map(({ label, event }) => (
                <button
                  key={event}
                  onClick={() => {
                    fire(event);
                    setOpen(false);
                  }}
                  className="rounded-lg px-2.5 py-2 text-left text-sm font-medium text-black transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                >
                  {label}
                </button>
              ))}
            </div>

            <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wide text-black/40 dark:text-white/40">
              Sayfalar
            </p>
            <div className="flex flex-col gap-0.5">
              {PAGES.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2.5 py-2 text-sm text-black/80 transition hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Test paneli"
        aria-expanded={open}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white shadow-xl transition hover:bg-amber-600"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      </button>
    </div>
  );
}
