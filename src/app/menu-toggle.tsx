"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { CATEGORY_ICONS } from "./category-icons";
import type { NavLink } from "./lib/content";
import { DOWNLOAD_CATEGORIES } from "./lib/downloads";
import { useFocusTrap } from "./lib/use-focus-trap";
import { LEGAL_HREFS } from "./lib/nav-link-groups";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";

// Footer'ın "Platform/Kurumsal/Yasal" düz kolonları (lib/nav-link-groups.ts)
// masaüstü mega-footer için yeterli, ama bu çekmecede "Kurumsal" diye tek
// bir çöp kutusu grubu anlamsız duruyordu -- burada bilerek konu bazlı
// (Mod Paketleri/Topluluk/Sunucu) ayrı bir gruplama kullanıyoruz.
const TOPLULUK_HREFS = new Set(["/topluluk", "/projeler", "/egitimler", "/sosyal-medya"]);
const SUNUCU_HREFS = new Set(["/sunucular"]);
const MOD_HREFS = new Set(["/mod-paketleri"]);

function LinkGroup({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: NavLink[];
  onNavigate: () => void;
}) {
  if (links.length === 0) return null;
  return (
    <>
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
        {title}
      </p>
      <nav className="mb-4 flex flex-col gap-0.5 last:mb-0">
        {links.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            onClick={onNavigate}
            className="rounded-lg px-3 py-1.5 font-sans text-xs text-black/60 transition hover:bg-black/5 hover:text-black/80 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white/80"
          >
            {label}
          </a>
        ))}
      </nav>
    </>
  );
}

export default function MenuToggle({
  logoText,
  navLinks,
}: {
  logoText: string;
  navLinks: NavLink[];
}) {
  const [open, setOpen] = useState(false);
  const asideRef = useRef<HTMLElement>(null);

  const toplulukLinks = navLinks.filter((l) => TOPLULUK_HREFS.has(l.href));
  const sunucuLinks = navLinks.filter((l) => SUNUCU_HREFS.has(l.href));
  const modLinks = navLinks.filter((l) => MOD_HREFS.has(l.href));
  const legalLinks = navLinks.filter((l) => LEGAL_HREFS.has(l.href));
  const siteLinks = navLinks.filter(
    (l) =>
      !TOPLULUK_HREFS.has(l.href) &&
      !SUNUCU_HREFS.has(l.href) &&
      !MOD_HREFS.has(l.href) &&
      !LEGAL_HREFS.has(l.href),
  );

  // Tab menü içinde döngü yapsın (arka plandaki gizli sayfa içeriğine
  // kaçmasın), Escape kapatsın, kapanınca odak menü butonuna dönsün --
  // önceden hiçbiri yoktu, klavye kullanıcısı menü açıkken Tab'layınca
  // sessizce arkadaki bulanık sayfaya geçip nerede olduğunu kaybediyordu.
  useFocusTrap(asideRef, open, () => setOpen(false));

  // Menü açıkken arkadaki sayfanın kaymasını engelle — kilitlenmezse
  // kullanıcı menü açıkken aşağı kaydırınca ana sayfa altta hareket
  // ediyor, yukarı kaydırınca da menü sanki yeniden açılmış gibi
  // görünüyordu.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Portal için: document.body sadece client'ta var. useSyncExternalStore
  // ile server snapshot'ı false, client'taki gerçek değeri true veriyoruz --
  // hydration uyumsuzluğuna girmeden (React bunun için özel olarak
  // tasarlanmış), setState'i doğrudan bir effect içinde çağırmadan.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Arka plan katmanı ve panel BİLEREK document.body'ye portallanıyor.
  // Navbar compact haldeyken backdrop-blur-xl (backdrop-filter)
  // uyguluyor -- backdrop-filter, filter/transform gibi, position:fixed
  // torunlar için yeni bir "containing block" oluşturur. Bu öğeler
  // navbar'ın DOM'u içinde kalsaydı, viewport yerine navbar'ın kendi
  // (küçük) kutusuna göre konumlanıp boyutlanıyordu -- gerçek bug buydu:
  // menü tam ekran yerine navbar yüksekliğine sıkışmış "yarım görüntü"
  // olarak açılıyordu. Portal bu DOM ilişkisini tamamen koparıyor.
  const overlay = (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-black/10 backdrop-blur-sm transition-opacity duration-300 dark:bg-black/30 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* translate-x-0/-translate-x-full (CSS translate özelliği, Tailwind
          v4'te transform yerine bunu kullanıyor) bu ortamda --tw-translate-x
          değişkeni doğru çözülse bile computed translate'e yansımıyordu --
          gerçek, tuhaf bir motor/derleme tutarsızlığı (doğrulandı: computed
          --tw-translate-x: 0px ama computed translate: -100% aynı anda).
          Bunun yerine doğrudan `left` ile kaydırıyoruz, aynı görsel etki,
          bu tuhaflığa hiç girmiyor. */}
      <aside
        ref={asideRef}
        tabIndex={-1}
        className={`fixed top-0 bottom-0 z-30 flex w-80 flex-col overflow-y-auto border-r border-black/10 bg-white/90 px-5 pb-6 pt-24 backdrop-blur-xl outline-none transition-[left] duration-300 ease-out dark:border-white/10 dark:bg-black/90 ${
          open ? "left-0" : "-left-80"
        }`}
      >
        <div className="mb-4 text-black dark:text-white">
          <Logo compact />
        </div>

        <ThemeToggle />

        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
          Mod Paketleri
        </p>
        {modLinks.map(({ href }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm font-bold text-black transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
          >
            Tüm Paketler
          </Link>
        ))}
        <nav className="mb-6 flex flex-col gap-1">
          {DOWNLOAD_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/mod-paketleri?category=${encodeURIComponent(category)}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm font-medium text-black transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 opacity-70"
              >
                {CATEGORY_ICONS[category]}
              </svg>
              {category}
            </Link>
          ))}
        </nav>

        <LinkGroup title="Topluluk" links={toplulukLinks} onNavigate={() => setOpen(false)} />
        <LinkGroup title="Sunucu" links={sunucuLinks} onNavigate={() => setOpen(false)} />
        <LinkGroup title="Site" links={siteLinks} onNavigate={() => setOpen(false)} />
        <LinkGroup title="Yasal" links={legalLinks} onNavigate={() => setOpen(false)} />
      </aside>
    </>
  );

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menü"
        aria-expanded={open}
        className="relative z-50 flex h-12 w-12 flex-col items-center justify-center gap-2"
      >
        <span
          className={`h-0.5 w-7 bg-black transition-transform duration-300 dark:bg-white ${
            open ? "translate-y-2.5 rotate-45" : ""
          }`}
        />
        <span
          className={`h-0.5 w-7 bg-black transition-opacity duration-300 dark:bg-white ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`h-0.5 w-7 bg-black transition-transform duration-300 dark:bg-white ${
            open ? "-translate-y-2.5 -rotate-45" : ""
          }`}
        />
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
