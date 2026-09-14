"use client";

import Link from "next/link";
import HillsBackground from "./hills-background";
import { signInWithGoogle } from "./lib/auth-client";
import Logo from "./logo";
import { GoogleIcon } from "./provider-icons";

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
        <button
          onClick={() => signInWithGoogle(redirectTo)}
          className="flex items-center gap-3 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-black shadow-sm transition hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          <GoogleIcon />
          Google ile Giriş Yap
        </button>
      </div>
    </div>
  );
}
