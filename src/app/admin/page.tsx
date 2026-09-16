"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ModeratorSession } from "@/app/lib/permissions";
import Logo from "../logo";
import ModeratorAuthGate from "../moderator-auth-gate";
import Watermark from "../watermark";

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
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f5f5f5] font-sans text-[#0a0a0a]">
        <div className="flex flex-col items-center gap-3 text-center">
          <p>Sayfa yüklenemedi, bağlantı sorunu olabilir.</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-[18px] border border-[#e5e5e5] bg-white px-5 py-2 text-sm font-medium transition hover:bg-[#f5f5f5]"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (moderator === undefined) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f5f5f5] font-sans text-[#0a0a0a]">
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
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f5f5f5] font-sans text-[#0a0a0a]">
        <p className="text-2xl font-bold uppercase tracking-wide text-[#e7000b]">
          Yetkiniz Bulunmamaktadır
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f5f5f5] font-sans text-[#0a0a0a]">
      <Watermark text={`${moderator.username} · ${moderator.id}`} />

      <div className="flex min-h-screen w-full flex-col sm:flex-row">
        <aside className="flex w-full shrink-0 flex-col gap-6 border-b border-[#e5e5e5] bg-[#fafafa] px-6 py-6 sm:w-64 sm:min-h-screen sm:border-b-0 sm:border-r sm:px-5">
          <Link href="/" className="flex items-center gap-3">
            <Logo compact />
          </Link>
          <p className="-mt-4 hidden text-xs font-normal text-[#737373] sm:block">
            Moderatör Paneli
          </p>

          <div className="flex flex-col gap-3 border-t border-[#e5e5e5] pt-5 sm:mt-auto">
            <p className="truncate text-xs text-[#737373]">
              {moderator.username} · {moderator.id}
            </p>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 items-center justify-center px-6 py-8 sm:px-10">
          <p className="text-sm text-[#737373]">
            Yeni panel tasarımı yakında.
          </p>
        </main>
      </div>
    </div>
  );
}
