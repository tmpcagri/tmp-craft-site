"use client";

import Link from "next/link";
import HillsBackground from "./hills-background";
import Logo from "./logo";

// Yönetici/moderatör girişi -- kasıtlı olarak Google butonu YOK. Hesap
// çalınma riskini azaltmak için yetkili girişi sadece e-posta/şifre ile
// yapılabiliyor (owner kuralı); Google hesabı zaten hiçbir moderatör
// yetkisi alamıyor (bkz. permissions.ts + migration 0032), ama bu ekranın
// kendisi de o yola hiç davet etmiyor.
export default function ModeratorAuthGate({
  message,
  redirectTo,
}: {
  message: string;
  redirectTo: string;
}) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden font-sans text-black dark:text-white">
      <HillsBackground />
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <Link href="/" className="transition hover:opacity-70">
          <Logo large />
        </Link>
        <p className="max-w-sm text-black/60 dark:text-white/60">{message}</p>
        <Link
          href={`/giris?next=${encodeURIComponent(redirectTo)}`}
          className="flex items-center gap-3 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          E-posta ile Giriş Yap
        </Link>
      </div>
    </div>
  );
}
