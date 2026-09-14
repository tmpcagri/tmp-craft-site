"use client";

import { useEffect, useRef, useState } from "react";

export type AtmosphereTheme = "topluluk" | "sunucular";

const THEME_GRADIENTS: Record<AtmosphereTheme | "default", string> = {
  default: "transparent",
  topluluk:
    "radial-gradient(circle at 20% 20%, rgba(168,85,247,0.16), transparent 55%), radial-gradient(circle at 80% 70%, rgba(217,70,239,0.12), transparent 55%)",
  sunucular:
    "radial-gradient(circle at 20% 20%, rgba(220,38,38,0.18), transparent 55%), radial-gradient(circle at 80% 70%, rgba(127,29,29,0.12), transparent 55%)",
};

const EVENT_NAME = "tmp-atmosphere-change";

// Sayfa scroll ederken hangi "vitrin" bölümünün görünür olduğuna göre
// arkaplanın rengi/havası yumuşakça değişiyor -- her bölüm kendi temasını
// bir custom event ile yayınlıyor, bu bileşen dinleyip sabit, tam ekran bir
// gradient katmanı olarak crossfade ediyor. Bölümler aynı sayfada olduğu
// için (route değişmeden) React context yerine basit bir window event
// yeterli ve daha az yeniden render'a sebep oluyor.
export function AtmosphereBackground() {
  const [theme, setTheme] = useState<AtmosphereTheme | "default">("default");

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<AtmosphereTheme | "default">).detail;
      setTheme(detail);
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-[background] duration-1000 ease-out"
      style={{ background: THEME_GRADIENTS[theme] }}
    />
  );
}

export function AtmosphereSection({
  theme,
  className = "",
  children,
}: {
  theme: AtmosphereTheme;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            window.dispatchEvent(
              new CustomEvent(EVENT_NAME, { detail: theme }),
            );
          }
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [theme]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
