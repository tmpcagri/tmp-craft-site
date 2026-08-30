"use client";

import { useEffect, useState } from "react";
import EditProfileModal from "./edit-profile-modal";
import { signInWithAzure, signInWithGoogle, signOut } from "./lib/auth-client";
import { createClient } from "./lib/supabase/client";
import { GoogleIcon, MicrosoftIcon } from "./provider-icons";

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
  const isSignedIn = Boolean(name);

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
        .select("username")
        .eq("id", user.id)
        .single();
      if (data?.username) setDisplayName(data.username);
    })();
  }, [isSignedIn]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={isSignedIn ? "Hesap" : "Giriş Yapın"}
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full border border-black/10 bg-white/80 py-2 pl-2 pr-5 text-base font-medium text-black shadow-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
          {isSignedIn && avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- external Google/Microsoft avatar URL
            <img
              src={avatarUrl}
              alt={name ?? "Hesap"}
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
        <span className="whitespace-nowrap">
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
                    // eslint-disable-next-line @next/next/no-img-element -- external Google/Microsoft avatar URL
                    <img
                      src={avatarUrl}
                      alt={name ?? "Hesap"}
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
              <button
                onClick={() => {
                  setEditing(true);
                  setOpen(false);
                }}
                className="rounded-full border border-black/10 py-2.5 text-sm font-medium text-black transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
              >
                Profili Düzenle
              </button>
              <button
                onClick={() => signOut()}
                className="rounded-full border border-black/10 py-2.5 text-sm font-medium text-black transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
              >
                Çıkış Yap
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-5">
              <div>
                <p className="font-sans text-base font-bold text-black dark:text-white">
                  TMP Craft&apos;a hoş geldin
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
                <button
                  onClick={() => signInWithAzure()}
                  className="flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-black shadow-sm transition hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  <MicrosoftIcon />
                  Microsoft ile Giriş Yap
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {editing && (
        <EditProfileModal
          onClose={() => setEditing(false)}
          onSaved={(newUsername) => setDisplayName(newUsername)}
        />
      )}
    </div>
  );
}
