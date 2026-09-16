"use client";

import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

// Moderatörün kimliğini gösteren blok -- /admin'de eskiden site logosunun
// olduğu üst bölgenin yerine geçti. Patronun (owner) amacı: bu QR/kodu
// okutarak/kopyalayarak o kişinin profiline hızlıca gidip yetkisini
// ayarlayabilmek, VE bir ekran görüntüsü izinsiz paylaşılırsa üzerindeki
// kodun kimin hesabından geldiğini tespit edebilmek -- bu yüzden kod
// döner/zaman bazlı değil, kullanıcıyı SABİT olarak belirleyen
// profile id'nin kendisi (bkz. Watermark'a da aynı kod veriliyor).
function calcAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const beforeBirthdayThisYear =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (beforeBirthdayThisYear) years--;
  return years;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function IdentityPanel({
  code,
  username,
  avatarUrl,
  birthDate,
  roleLabel,
}: {
  code: string;
  username: string;
  avatarUrl: string;
  birthDate: string | null;
  roleLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, code, {
      width: 140,
      margin: 1,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    }).catch(() => {});
  }, [code]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Panoya erişim reddedilmişse sessizce yut -- kod zaten metin olarak görünüyor.
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 border-b border-black/10 pb-6 dark:border-white/10">
      {/* QR kutusu her iki temada da bilerek beyaz -- QR kodun kendi
          modül renkleri (#0a0a0a/#ffffff) sabit, taranabilirlik için
          etrafındaki kutu koyu temada da yüksek kontrast kalmalı. */}
      <div className="rounded-2xl bg-white p-2.5 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
        <canvas ref={canvasRef} />
      </div>

      <button
        onClick={copyCode}
        className="w-full rounded-[18px] bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
      >
        {copied ? "Kopyalandı ✓" : "Kodu Kopyala"}
      </button>

      <p className="w-full truncate rounded-xl bg-black/5 px-3 py-1.5 text-center font-mono text-xs text-black/60 dark:bg-white/10 dark:text-white/60">
        {code}
      </p>

      <div className="w-full text-center">
        <span className="mx-auto mb-2 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-black/5 text-lg font-semibold text-black dark:bg-white/10 dark:text-white">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- dış Google avatar URL'i
            <img
              src={avatarUrl}
              alt={username}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : (
            username.slice(0, 1).toUpperCase()
          )}
        </span>
        <p className="text-sm font-semibold">{username}</p>
        {birthDate && (
          <p className="text-xs text-black/60 dark:text-white/60">
            {calcAge(birthDate)} yaşında · {formatDate(birthDate)}
          </p>
        )}
        {roleLabel && (
          <p className="mt-1 inline-block rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-medium text-black dark:bg-white/10 dark:text-white">
            {roleLabel}
          </p>
        )}
      </div>
    </div>
  );
}
