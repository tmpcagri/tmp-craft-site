"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signInWithGoogle } from "../lib/auth-client";
import { downloadItems } from "../lib/downloads";
import { getMySavedSlugs } from "../lib/mod-engagement";
import { createClient } from "../lib/supabase/client";

export default function HesabimKaydedilenler() {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setIsSignedIn(Boolean(user));
      if (user) {
        const saved = await getMySavedSlugs();
        setSavedSlugs(saved.map((s) => s.itemSlug));
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="text-sm opacity-60">Yükleniyor...</p>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-3xl border border-black/10 p-6 dark:border-white/10">
        <p className="text-sm text-black/70 dark:text-white/70">
          Kaydettiklerini görmek için giriş yapmalısın.
        </p>
        <button
          onClick={() => signInWithGoogle("/hesabim")}
          className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          Google ile Giriş Yap
        </button>
      </div>
    );
  }

  const savedItems = downloadItems.filter((i) => savedSlugs.includes(i.slug));

  if (savedItems.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-black/15 p-8 text-center dark:border-white/15">
        <p className="text-sm text-black/60 dark:text-white/60">
          Henüz hiçbir mod paketi kaydetmedin.
        </p>
        <Link
          href="/mod-paketleri"
          className="mt-3 inline-block text-sm font-medium text-emerald-600 underline underline-offset-4 dark:text-emerald-400"
        >
          Mod Paketleri&apos;ne göz at →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {savedItems.map((item) => (
        <Link
          key={item.slug}
          href={`/mod-paketleri/${item.slug}`}
          className="flex flex-col overflow-hidden rounded-3xl border border-black/10 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10"
        >
          <div className={`h-24 bg-gradient-to-br ${item.gradient}`} />
          <div className="flex flex-col gap-1 bg-white/40 p-4 backdrop-blur-xl dark:bg-black/40">
            <span className="text-xs font-semibold uppercase tracking-wide opacity-50">
              {item.category}
            </span>
            <h3 className="font-sans text-base font-bold text-black dark:text-white">
              {item.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
