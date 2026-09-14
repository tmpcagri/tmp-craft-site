import { useEffect, useRef } from "react";

// Shared "infinite marquee" behavior: auto-scrolls a container along one
// axis, pausing on hover/focus/touch/wheel and resuming after a short
// delay, wrapping back to the start once it passes the halfway point (the
// caller is expected to render its items list twice back-to-back so the
// wrap is seamless). Respects prefers-reduced-motion.
export function useAutoScroll<T extends HTMLElement>(
  axis: "horizontal" | "vertical",
  {
    enabled = true,
    speed = 0.5,
    direction = 1,
  }: { enabled?: boolean; speed?: number; direction?: 1 | -1 } = {},
) {
  const ref = useRef<T>(null);
  const pausedRef = useRef(false);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pause = () => {
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    pausedRef.current = true;
  };

  const scheduleResume = () => {
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      pausedRef.current = false;
    }, 3000);
  };

  // Konumu DOM'dan geri okumak yerine (tarayıcılar scrollLeft/scrollTop'u
  // en yakın tam sayıya yuvarlıyor) kendi ref'imizde tam hassasiyetle
  // biriktiriyoruz. speed < 0.5 olduğunda (ör. 0.35), her karede DOM'dan
  // okunan yuvarlanmış değere eklenip tekrar yuvarlanınca kesir hiç
  // birikmiyor ve konum sonsuza dek 0'da kilitli kalıyordu.
  const positionRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    // direction: -1 tersten (sola->sağa görsel akış) başlaması için
    // başlangıç konumu track'in ortasına ayarlanıyor, aksi halde 0'dan
    // aşağı inip hemen negatife düşerdi.
    const initialTotal = axis === "horizontal" ? el.scrollWidth : el.scrollHeight;
    positionRef.current =
      direction === -1
        ? initialTotal / 2
        : axis === "horizontal"
          ? el.scrollLeft
          : el.scrollTop;
    if (axis === "horizontal") el.scrollLeft = positionRef.current;
    else el.scrollTop = positionRef.current;

    let frameId: number;
    const step = () => {
      if (!pausedRef.current) {
        const total =
          axis === "horizontal" ? el.scrollWidth : el.scrollHeight;
        const half = total / 2;
        positionRef.current += speed * direction;
        if (direction === 1 && positionRef.current >= half) {
          positionRef.current -= half;
        } else if (direction === -1 && positionRef.current <= 0) {
          positionRef.current += half;
        }
        if (axis === "horizontal") el.scrollLeft = positionRef.current;
        else el.scrollTop = positionRef.current;
      }
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [axis, enabled, speed, direction]);

  return {
    ref,
    handlers: {
      onMouseEnter: pause,
      onMouseLeave: scheduleResume,
      onFocus: pause,
      onBlur: scheduleResume,
      onTouchStart: pause,
      onTouchEnd: scheduleResume,
      onWheel: () => {
        pause();
        scheduleResume();
      },
    },
  };
}
