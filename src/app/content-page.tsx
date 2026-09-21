import Link from "next/link";
import type { ReactNode } from "react";
import BackButton from "./back-button";
import Footer from "./footer";
import { getCurrentUser } from "./lib/auth";
import { getSiteContent } from "./lib/content";
import Navbar from "./navbar";

type Accent = "emerald" | "cyan" | "amber" | "fuchsia" | "rose";

const accentStyles: Record<
  Accent,
  { badge: string; blobA: string; blobB: string }
> = {
  emerald: {
    badge:
      "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
    blobA: "bg-emerald-400/25",
    blobB: "bg-teal-400/20",
  },
  cyan: {
    badge:
      "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-400",
    blobA: "bg-cyan-400/25",
    blobB: "bg-blue-400/20",
  },
  amber: {
    badge:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400",
    blobA: "bg-amber-400/25",
    blobB: "bg-orange-400/20",
  },
  fuchsia: {
    badge:
      "bg-fuchsia-500/10 text-fuchsia-600 dark:bg-fuchsia-400/10 dark:text-fuchsia-400",
    blobA: "bg-fuchsia-400/25",
    blobB: "bg-purple-400/20",
  },
  rose: {
    badge:
      "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400",
    blobA: "bg-rose-400/25",
    blobB: "bg-pink-400/20",
  },
};

// Kurumsal sayfaların (Hakkımızda, Destek, SSS, vb.) ortak atmosferik arka
// planı -- egitimler-slider-panel.tsx / projeler-slider-panel.tsx ile aynı
// desen (sabit R2 görseli + hafif overlay). Sunucular ve Eğitimler gibi
// "stub" sayfalar kendi görsellerini backgroundImageUrl prop'uyla override
// edebiliyor.
const DEFAULT_BACKGROUND_IMAGE_URL =
  "https://pub-5946b15c1992464485b90a8b76df9ab1.r2.dev/homepage/bg-kurumsal.jpg";

const kurumsalLinks = [
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Sosyal Medya", href: "/sosyal-medya" },
  { label: "İletişim", href: "/iletisim" },
  { label: "Destek ve Yardım", href: "/destek" },
  { label: "SSS", href: "/sss" },
  { label: "Topluluk Kuralları", href: "/kurallar" },
  { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
  { label: "KVKK", href: "/kvkk" },
  { label: "Telif Hakkı", href: "/telif-hakki" },
];

export default async function ContentPage({
  eyebrow,
  title,
  intro,
  accent = "emerald",
  variant,
  activePath,
  backgroundImageUrl = DEFAULT_BACKGROUND_IMAGE_URL,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  accent?: Accent;
  variant?: "kurumsal" | "stub";
  activePath?: string;
  backgroundImageUrl?: string;
  children: ReactNode;
}) {
  const content = getSiteContent();
  const user = await getCurrentUser();
  const styles = accentStyles[accent];

  const activeIndex = kurumsalLinks.findIndex((l) => l.href === activePath);
  const prevLink = activeIndex > 0 ? kurumsalLinks[activeIndex - 1] : null;
  const nextLink =
    activeIndex >= 0 && activeIndex < kurumsalLinks.length - 1
      ? kurumsalLinks[activeIndex + 1]
      : null;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white dark:bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element -- sabit sayfa arka planı, R2'de barındırılıyor */}
      <img
        src={backgroundImageUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-white/85 dark:bg-black/85" />

      <div
        aria-hidden
        className={`pointer-events-none absolute -left-32 -top-20 h-96 w-96 rounded-full blur-3xl ${styles.blobA}`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-24 top-72 h-80 w-80 rounded-full blur-3xl ${styles.blobB}`}
      />

      <Navbar
        className="relative text-black dark:text-white"
        logoText={content.navbar.logoText}
        navLinks={content.footerLinks}
        user={user}
      />

      <main className="relative mx-auto w-full max-w-2xl flex-1 px-6 pb-24 pt-32 sm:px-10">
        <BackButton />

        {variant === "kurumsal" && (
          <nav className="mb-8 flex flex-wrap gap-2">
            {kurumsalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  link.href === activePath
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "border border-black/10 text-black/60 hover:bg-black/5 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-xs font-semibold tracking-[0.2em] ${styles.badge}`}
          >
            {eyebrow}
          </span>
          {variant === "stub" && (
            <span className="inline-flex items-center rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:bg-amber-400/15 dark:text-amber-300">
              Yakında
            </span>
          )}
        </div>

        <h1 className="mt-4 font-sans text-4xl font-bold text-black dark:text-white sm:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 font-sans text-lg text-black/70 dark:text-white/70">
            {intro}
          </p>
        )}

        <div className="mt-10 flex flex-col gap-6 font-sans text-sm leading-relaxed text-black/80 dark:text-white/80 sm:text-base">
          {children}
        </div>

        {variant === "kurumsal" && (prevLink || nextLink) && (
          <div className="mt-12 flex items-center justify-between border-t border-black/10 pt-6 text-sm dark:border-white/10">
            {prevLink ? (
              <Link
                href={prevLink.href}
                className="text-black/60 transition hover:text-black dark:text-white/60 dark:hover:text-white"
              >
                ← {prevLink.label}
              </Link>
            ) : (
              <span />
            )}
            {nextLink && (
              <Link
                href={nextLink.href}
                className="text-black/60 transition hover:text-black dark:text-white/60 dark:hover:text-white"
              >
                {nextLink.label} →
              </Link>
            )}
          </div>
        )}
      </main>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
