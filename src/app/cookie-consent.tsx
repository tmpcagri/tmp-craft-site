"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-consent-ack";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // localStorage can only be read after mount, not during SSR.
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage erişilemezse şerit sadece bu oturumda kapanır.
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4">
      <div className="flex w-full max-w-xl flex-col items-start gap-3 rounded-3xl border border-black/10 bg-white/90 p-5 text-sm text-black shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-black/90 dark:text-white">
        <p className="text-black/70 dark:text-white/70">
          Oturumunuzu ve tema tercihinizi hatırlamak için gerekli minimum
          çerezleri kullanıyoruz.{" "}
          <Link
            href="/gizlilik-politikasi"
            className="font-medium underline underline-offset-2"
          >
            Gizlilik Politikası
          </Link>
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          Anladım
        </button>
      </div>
    </div>
  );
}
