"use client";

import QRCode from "qrcode";
import { useEffect, useRef } from "react";

// Görselin yanında duran, olabildiğince küçük paylaşım QR'ı -- sayfanın
// kendi linkine gidiyor (qr-share-button.tsx'teki window.location.href
// deseniyle aynı), sadece o bileşenin başlık/kopyala butonu olmadan,
// tek başına minik bir kare.
export default function ModPaketiQr({ size = 56 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, window.location.href, {
      width: size,
      margin: 0,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    }).catch(() => {});
  }, [size]);

  return (
    <div className="shrink-0 self-start rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
      <canvas ref={canvasRef} />
    </div>
  );
}
