"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ModeratorSession } from "@/app/lib/permissions";
import ModeratorAuthGate from "../moderator-auth-gate";
import Watermark from "../watermark";
import IdentityPanel from "./identity-panel";
import ModChatPanel from "./mod-chat-panel";

export default function AdminPage() {
  const [moderator, setModerator] = useState<ModeratorSession | undefined>(
    undefined,
  );
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => {
        if (!res.ok) throw new Error("session fetch failed");
        return res.json();
      })
      .then((session: ModeratorSession) => setModerator(session))
      .catch(() => setLoadError(true));
  }, []);

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

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f5f5f5] font-sans text-black dark:bg-black dark:text-white">
      <Watermark text={moderator.id} />

      <div className="flex min-h-screen w-full flex-col sm:flex-row">
        <aside className="flex w-full shrink-0 flex-col gap-6 border-b border-black/10 bg-[#fafafa] px-6 py-6 sm:w-64 sm:min-h-screen sm:border-b-0 sm:border-r sm:px-5 dark:border-white/10 dark:bg-white/5">
          <IdentityPanel
            code={moderator.id}
            username={moderator.username}
            avatarUrl={moderator.avatarUrl}
            birthDate={moderator.birthDate}
            roleLabel={moderator.roleLabel}
          />

          <ModChatPanel selfId={moderator.id} />

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="text-xs text-black/60 underline underline-offset-4 hover:text-black dark:text-white/60 dark:hover:text-white"
            >
              ← Siteye dön
            </Link>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 items-center justify-center px-6 py-8 sm:px-10">
          <p className="text-sm text-black/60 dark:text-white/60">
            Yeni panel tasarımı yakında.
          </p>
        </main>
      </div>
    </div>
  );
}
