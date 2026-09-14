"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signInWithGoogle } from "../../lib/auth-client";
import {
  getDownloadCount,
  getEngagementCounts,
  getMyEngagement,
  recordDownloadClick,
  setEngagement,
} from "../../lib/mod-engagement";
import { createClient } from "../../lib/supabase/client";

export default function ModPaketiActions({
  slug,
  hasDependencies,
}: {
  slug: string;
  hasDependencies: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);
  const [downloadCount, setDownloadCount] = useState(0);
  const [downloadMessage, setDownloadMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsSignedIn(Boolean(user));
    });

    getEngagementCounts(slug).then(({ like, save }) => {
      setLikeCount(like);
      setSaveCount(save);
    });
    getDownloadCount(slug).then(setDownloadCount);
    getMyEngagement(slug).then(({ liked, saved }) => {
      setLiked(liked);
      setSaved(saved);
    });
  }, [slug]);

  const requireSignIn = () => {
    signInWithGoogle(pathname);
  };

  // Hızlı art arda tıklamalarda (ör. 5 kez üst üste Beğen) her tık kendi
  // setEngagement() isteğini ateşliyordu -- bu istekler ağdan sırasız
  // dönebiliyor (klasik race condition), sonuçta buton gerçek DB
  // durumuyla eşleşmeyen bir yerde takılı kalabiliyordu. Artık aynı anda
  // tek istek uçuyor; tıklama isteği zaten uçan bir isteğin üzerine
  // gelirse sadece "en son istenen değeri" not ediyoruz, o istek biter
  // bitmez (varsa) en güncel değeri gönderiyoruz -- N tık, en fazla 2 ağ
  // isteğine sıkışıyor, sıra hep korunuyor.
  const likeRequestRef = useRef<{ inFlight: boolean; pending: boolean | null }>({
    inFlight: false,
    pending: null,
  });
  const saveRequestRef = useRef<{ inFlight: boolean; pending: boolean | null }>({
    inFlight: false,
    pending: null,
  });

  const syncEngagement = async (
    kind: "like" | "save",
    desired: boolean,
    requestRef: typeof likeRequestRef,
  ) => {
    const state = requestRef.current;
    if (state.inFlight) {
      state.pending = desired;
      return;
    }
    state.inFlight = true;
    try {
      await setEngagement(slug, kind, desired);
    } catch (error) {
      console.error(`${kind === "like" ? "Beğeni" : "Kaydetme"} güncellenemedi:`, error);
      // Kaçırılan ara adımlar yüzünden hangi boolean'a "geri almam" gerektiğini
      // güvenle bilemeyiz -- UI'ı tahminle düzeltmek yerine gerçek durumu
      // sunucudan tekrar okuyup senkronize ediyoruz.
      const [fresh, counts] = await Promise.all([
        getMyEngagement(slug).catch(() => null),
        getEngagementCounts(slug).catch(() => null),
      ]);
      if (fresh) {
        if (kind === "like") setLiked(fresh.liked);
        else setSaved(fresh.saved);
      }
      if (counts) {
        setLikeCount(counts.like);
        setSaveCount(counts.save);
      }
    } finally {
      state.inFlight = false;
      const pending = state.pending;
      state.pending = null;
      if (pending !== null && pending !== desired) {
        syncEngagement(kind, pending, requestRef);
      }
    }
  };

  const toggleLike = () => {
    if (!isSignedIn) return requireSignIn();
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    syncEngagement("like", next, likeRequestRef);
  };

  const toggleSave = () => {
    if (!isSignedIn) return requireSignIn();
    const next = !saved;
    setSaved(next);
    setSaveCount((c) => c + (next ? 1 : -1));
    syncEngagement("save", next, saveRequestRef);
  };

  const handleDownloadClick = async () => {
    setDownloadMessage("Bu paket için indirme henüz hazır değil.");
    const count = await recordDownloadClick(slug);
    setDownloadCount(count);
  };

  const handleReport = () => {
    if (!isSignedIn) {
      signInWithGoogle("/iletisim");
      return;
    }
    router.push("/iletisim");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {hasDependencies && (
          <button
            type="button"
            onClick={handleDownloadClick}
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            Bağımlılıklarla Birlikte İndir
          </button>
        )}
        <button
          type="button"
          onClick={handleDownloadClick}
          className={
            hasDependencies
              ? "rounded-full border border-black/15 px-5 py-3 text-sm font-semibold text-black transition hover:bg-black/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
              : "rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
          }
        >
          {hasDependencies ? "Sadece Bu Paketi İndir" : "İndir"}
        </button>
        <div className="flex items-center justify-between text-xs text-black/60 dark:text-white/60">
          <span>{downloadCount} indirme</span>
          {downloadMessage && <span>{downloadMessage}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-black/10 pt-4 dark:border-white/10">
        <button
          type="button"
          onClick={toggleLike}
          aria-pressed={liked}
          className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
            liked
              ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
              : "border-black/10 text-black/60 hover:bg-black/5 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/10"
          }`}
        >
          {liked ? "♥" : "♡"} Beğen
          {likeCount > 0 && <span className="opacity-70">{likeCount}</span>}
        </button>
        <button
          type="button"
          onClick={toggleSave}
          aria-pressed={saved}
          className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
            saved
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-black/10 text-black/60 hover:bg-black/5 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/10"
          }`}
        >
          {saved ? "✓" : "+"} Kaydet
          {saveCount > 0 && <span className="opacity-70">{saveCount}</span>}
        </button>
        <button
          type="button"
          onClick={handleReport}
          className="ml-auto text-xs font-medium text-black/60 underline underline-offset-4 hover:text-black/70 dark:text-white/60 dark:hover:text-white/70"
        >
          Bildir
        </button>
      </div>

      {saved && (
        <Link
          href="/hesabim"
          className="text-xs font-medium text-black/60 underline underline-offset-4 hover:text-black/80 dark:text-white/60 dark:hover:text-white/80"
        >
          Kaydettiklerimi gör →
        </Link>
      )}
    </div>
  );
}
