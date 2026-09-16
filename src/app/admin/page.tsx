"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ModeratorSession } from "@/app/lib/permissions";
import ModeratorAuthGate from "../moderator-auth-gate";
import Watermark from "../watermark";
import IdentityPanel from "./identity-panel";
import ModChatPanel from "./mod-chat-panel";
import PendingGrantsCard from "./pending-grants-card";

export default function AdminPage() {
  const [moderator, setModerator] = useState<ModeratorSession | undefined>(
    undefined,
  );
  const [loadError, setLoadError] = useState(false);

  const loadSession = () => {
    fetch("/api/session")
      .then((res) => {
        if (!res.ok) throw new Error("session fetch failed");
        return res.json();
      })
      .then((session: ModeratorSession) => setModerator(session))
      .catch(() => setLoadError(true));
  };

  useEffect(loadSession, []);

  if (loadError) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f5f5f5] font-sans text-black dark:bg-black dark:text-white">
        <div className="flex flex-col items-center gap-3 text-center">
          <p>Sayfa yüklenemedi, bağlantı sorunu olabilir.</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-[18px] border border-black/10 bg-white px-5 py-2 text-sm font-medium transition hover:bg-[#f5f5f5] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (moderator === undefined) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f5f5f5] font-sans text-black dark:bg-black dark:text-white">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (!moderator) {
    return (
      <ModeratorAuthGate
        message="Bu sayfayı görüntülemek için giriş yapmalısın."
        redirectTo="/admin"
      />
    );
  }

  if (moderator.permissions.length === 0) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f5f5f5] font-sans dark:bg-black">
        <p className="text-2xl font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
          Yetkiniz Bulunmamaktadır
        </p>
      </div>
    );
  }

  const cardClass =
    "rounded-3xl border border-black/10 bg-[#fafafa] dark:border-white/10 dark:bg-white/5";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f5f5f5] p-4 font-sans text-black dark:bg-black dark:text-white sm:p-6 lg:p-8">
      <Watermark text={moderator.id} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Sol: kimlik kartı (foto/ad/yaş/rol/QR/kod) + bekleyen yetkiler --
            masaüstünde geniş, kalan alanı dolduruyor. */}
        <div className={`flex w-full flex-col gap-4 p-5 lg:flex-1 ${cardClass}`}>
          <IdentityPanel
            code={moderator.id}
            username={moderator.username}
            avatarUrl={moderator.avatarUrl}
            birthDate={moderator.birthDate}
            roleLabel={moderator.roleLabel}
          />

          <PendingGrantsCard onAccepted={loadSession} />

          <Link
            href="/"
            className="text-xs text-black/60 underline underline-offset-4 hover:text-black dark:text-white/60 dark:hover:text-white"
          >
            ← Siteye dön
          </Link>
        </div>

        {/* Sağ: moderatör sohbeti -- masaüstünde dar ve uzun (dikey şerit),
            mobilde tam genişlik + alt alta düşüyor. */}
        <div className={`flex h-[32rem] min-w-0 w-full flex-col p-5 lg:h-[42rem] lg:w-72 lg:shrink-0 ${cardClass}`}>
          <ModChatPanel
            selfId={moderator.id}
            isOwner={moderator.isOwner}
            permissions={moderator.permissions}
          />
        </div>
      </div>

      <main className={`mt-4 flex min-h-48 w-full items-center justify-center p-8 ${cardClass}`}>
        <p className="text-sm text-black/60 dark:text-white/60">
          Yeni panel tasarımı yakında.
        </p>
      </main>
    </div>
  );
}
