"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import EditProfileModal from "./edit-profile-modal";
import { signInWithGoogle, signOut } from "./lib/auth-client";
import { createClient } from "./lib/supabase/client";
import { useOutsideClick } from "./lib/use-outside-click";
import { InlineLogo } from "./logo";
import OnboardingModal from "./onboarding-modal";
import { GoogleIcon } from "./provider-icons";

export default function AccountButton({
  avatarUrl,
  name,
}: {
  avatarUrl?: string | null;
  name?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(name ?? null);
  // Yönetici/moderatör linki sadece bu profiles satırından gelen yetkiye
  // sahip hesaplarda gösteriliyor -- sıradan bir kullanıcı bu seçeneği
  // hiç görmüyor.
  const [staffLink, setStaffLink] = useState<{ href: string; label: string } | null>(null);
  // Özel mesajlaşma artık moderatör-moderatör (bkz. lib/messages.ts,
  // migration 0032) -- normal kullanıcıya boşa çıkan bir link gösterme.
  const [isModerator, setIsModerator] = useState(false);
  // İlk Google girişinden sonra doğum tarihi hâlâ boşsa onboarding
  // modalını göster -- profil satırı gelene kadar (null) hiçbir şey
  // gösterme, yanlışlıkla anlık bir flaş yaratmasın.
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const isSignedIn = Boolean(name);
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(containerRef, () => setOpen(false), open);

  // Test paneli buradan bağımsız olarak bu popup'ı açabilsin diye --
  // sadece dev/QA amaçlı, gerçek kullanıcı akışını etkilemiyor.
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("testpanel:open-account", handler);
    return () => window.removeEventListener("testpanel:open-account", handler);
  }, []);

  useEffect(() => {
    if (!isSignedIn) return;
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("username, is_owner, permissions, birth_date")
        .eq("id", user.id)
        .single();
      if (data?.username) setDisplayName(data.username);
      if (data?.is_owner) {
        setStaffLink({ href: "/yonetim", label: "Yönetim Paneli" });
        setIsModerator(true);
      } else if ((data?.permissions ?? []).length > 0) {
        setStaffLink({ href: "/moderator", label: "Moderatör Paneli" });
        setIsModerator(true);
      }
      if (data && !data.birth_date) setNeedsOnboarding(true);
    })();
  }, [isSignedIn]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={isSignedIn ? "Hesap" : "Giriş Yapın"}
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full border border-black/10 bg-white/80 py-2 pl-2 pr-2 text-base font-medium text-black shadow-sm backdrop-blur transition hover:bg-white md:pr-5 dark:border-white/10 dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
          {isSignedIn && avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- external Google avatar URL
            <img
              src={avatarUrl}
              alt={displayName ?? "Hesap"}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </span>
        <span className="hidden whitespace-nowrap md:inline">
          {isSignedIn ? displayName : "Giriş Yapın"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-3xl border border-black/10 bg-white/95 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/90">
          {isSignedIn ? (
            <div className="flex flex-col gap-3 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- external Google avatar URL
                    <img
                      src={avatarUrl}
                      alt={displayName ?? "Hesap"}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </span>
                <div>
                  <p className="font-sans text-sm font-semibold text-black dark:text-white">
                    {displayName}
                  </p>
                  <p className="text-xs opacity-50">Oturum açık</p>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <Link
                  href="/hesabim"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-black transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
                    <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  Kaydettiklerim
                </Link>
                {isModerator && (
                  <Link
                    href="/mesajlar"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-black transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Mesajlar
                  </Link>
                )}
                <Link
                  href="/hesap"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-black transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  Hesap Hakkında
                </Link>
                <button
                  onClick={() => {
                    setEditing(true);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-black transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
                  </svg>
                  Profili Düzenle
                </button>

                {staffLink && (
                  <Link
                    href={staffLink.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-emerald-600 transition hover:bg-emerald-500/10 dark:text-emerald-400"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    {staffLink.label}
                  </Link>
                )}
              </div>

              <div className="border-t border-black/10 dark:border-white/10" />

              <button
                onClick={() => signOut()}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5M21 12H9" />
                </svg>
                Çıkış Yap
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-5">
              <div>
                <p className="font-sans text-base font-bold text-black dark:text-white">
                  <InlineLogo />
                  &apos;a hoş geldin
                </p>
                <p className="mt-0.5 text-xs opacity-60">
                  Devam etmek için bir hesapla giriş yap
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => signInWithGoogle()}
                  className="flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-black shadow-sm transition hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  <GoogleIcon />
                  Google ile Giriş Yap
                </button>
                <Link
                  href="/giris"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-black/10 px-4 py-2.5 text-center text-sm font-medium text-black transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                >
                  E-posta ile Giriş Yap
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {editing && (
        <EditProfileModal
          avatarUrl={avatarUrl}
          onClose={() => setEditing(false)}
          onSaved={(newUsername) => setDisplayName(newUsername)}
        />
      )}

      {needsOnboarding && (
        <OnboardingModal onDone={() => setNeedsOnboarding(false)} />
      )}
    </div>
  );
}
