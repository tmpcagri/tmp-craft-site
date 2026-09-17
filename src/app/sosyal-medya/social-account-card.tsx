"use client";

import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export type SocialAccount = {
  label: string;
  username: string;
  href: string;
  gradient: string;
  comingSoon?: boolean;
};

// Gerçek marka logoları kartta iyi durmadığı için (bkz. sayfadaki not)
// kart sade tutuluyor: marka renginde yavaşça kayan gradyan + yazı, sağda QR.
export default function SocialAccountCard({ account }: { account: SocialAccount }) {
  const { label, username, href, gradient, comingSoon } = account;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (comingSoon || !canvasRef.current) return;
    // QR aynı href'e gidiyor -- kartın linkiyle aynı, sadece telefonla
    // hızlıca okutabilmek için.
    QRCode.toCanvas(canvasRef.current, href, {
      width: 52,
      margin: 0,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    }).catch(() => {});
  }, [href, comingSoon]);

  const cardClass = `group relative flex h-20 items-center justify-between gap-3 overflow-hidden rounded-2xl bg-gradient-to-r px-6 shadow-lg transition animate-gradient-flow ${gradient}`;

  const inner = (
    <>
      {/* hover'da kartın üzerinden geçen ışık huzmesi */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />

      <div className="relative z-10">
        <p className="font-sans text-base font-bold text-white">{label}</p>
        <p className="text-sm text-white/70">{username}</p>
      </div>

      {comingSoon ? (
        <span className="relative z-10 shrink-0 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-black">
          Yakında
        </span>
      ) : (
        <div className="relative z-10 shrink-0 rounded-lg bg-white p-1 shadow-md">
          <canvas ref={canvasRef} />
        </div>
      )}
    </>
  );

  if (comingSoon) {
    return (
      <div className={cardClass} aria-label={`${label} -- yakında`}>
        {inner}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cardClass} hover:-translate-y-0.5 hover:shadow-xl`}
    >
      {inner}
    </a>
  );
}
