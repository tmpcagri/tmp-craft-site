"use client";

import { useEffect, useState } from "react";
import type { ModeratorSession } from "@/app/lib/permissions";
import { MODERATOR_MENU, pruneMenu, resolveMenuLevels } from "@/app/lib/moderator-menu";
import ModeratorAuthGate from "../moderator-auth-gate";
import Watermark from "../watermark";
import CardsPanel from "./cards-panel";
import FeaturedGuidesPanel from "./featured-guides-panel";
import FeaturedModsPanel from "./featured-mods-panel";
import HeroPanel from "./hero-panel";
import IdentityPanel from "./identity-panel";
import ModChatPanel from "./mod-chat-panel";
import ModPaketleriPanel from "./mod-paketleri-panel";
import ModPaketleriSayfaPanel from "./mod-paketleri-sayfa-panel";
import OccasionPanel from "./occasion-panel";
import PendingGrantsCard from "./pending-grants-card";
import SectionSwitcher from "./section-switcher";
import SunucularPanel from "./sunucular-panel";
import TickerPanel from "./ticker-panel";
import ToplulukPanel from "./topluluk-panel";

// Bir yaprağa (leafId) karşılık gelen gerçek ayar ekranı -- henüz
// taşınmamış olanlar (creators/topluluk_hero/links gibi eski
// admin/page.tsx'in inline JSX'iyle yazılmıştı, wipe'ta silindi)
// placeholder'a düşer. mods/servers/articles/occasion/ticker/cards/hero/
// panels/guides zaten bağımsız bileşen olarak var olduğu için doğrudan
// bağlandı.
function LeafContent({ leafId }: { leafId: string | null }) {
  if (leafId === "mod_paketleri_sayfa") return <ModPaketleriSayfaPanel />;
  if (leafId === "mods") return <ModPaketleriPanel />;
  if (leafId === "servers") return <SunucularPanel />;
  if (leafId === "articles") return <ToplulukPanel />;
  if (leafId === "occasion") return <OccasionPanel />;
  if (leafId === "ticker") return <TickerPanel />;
  if (leafId === "cards") return <CardsPanel />;
  if (leafId === "hero") return <HeroPanel />;
  if (leafId === "panels") return <FeaturedModsPanel />;
  if (leafId === "guides") return <FeaturedGuidesPanel />;
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-sm text-black/60 dark:text-white/60">
        Bu bölüm için içerik yakında.
      </p>
    </div>
  );
}

export default function AdminPage() {
  const [moderator, setModerator] = useState<ModeratorSession | undefined>(
    undefined,
  );
  const [loadError, setLoadError] = useState(false);
  const [menuPath, setMenuPath] = useState<string[]>([]);

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
        redirectTo="/moderator"
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

  // Ağacı moderatörün gerçek izinlerine göre budayıp path'e göre her
  // seviyenin seçeneklerini/seçilisini çöz -- bir yaprağa ulaşınca leafId
  // dolar. Path geçersizleşmişse (izin kaldırıldı vs.) her seviye kendi
  // ilk seçeneğine düşer, bunu effect'te setState ile değil doğrudan
  // render'da yapıyoruz (bkz. eski effectiveSection deseni).
  const prunedMenu = pruneMenu(MODERATOR_MENU, moderator);
  const { levels, leafId } = resolveMenuLevels(prunedMenu, menuPath);
  const activeLabel = levels[levels.length - 1]?.options.find(
    (o) => o.id === levels[levels.length - 1].selectedId,
  )?.label;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f5f5f5] p-4 font-sans text-black dark:bg-black dark:text-white sm:p-6 lg:p-8">
      <Watermark text={moderator.id} />

      {/* Üç sütun: sağ köşede kimlik/QR (dar, sabit), ortada asıl panel
          alanı (boş/rezerve, gelecekteki gerçek admin içeriği buraya
          gelecek), sol köşede sohbet (dar, sabit). Kimlik paneli eskiden
          lg:flex-1 ile genişti -- içeriği (QR/buton/metin) dar olduğu için
          geniş kartın ortasında kayboluyor, etrafında dev boşluk
          bırakıyordu. Artık o boşluk kasıtlı: ORTA sütunda, gelecekteki
          içerik için ayrılmış. Sütunların DOM sırası (kimlik, ana panel,
          sohbet) mobil dizilimi (order-last ile ana panel en sona düşüyor)
          bozmadan korunuyor; masaüstünde sadece görsel sırayı (lg:order-*)
          değiştirip sohbeti sola, kimliği sağa alıyoruz. */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className={`flex w-full flex-col gap-4 p-5 lg:order-3 lg:w-72 lg:shrink-0 ${cardClass}`}>
          <IdentityPanel
            code={moderator.id}
            username={moderator.username}
            avatarUrl={moderator.avatarUrl}
            birthDate={moderator.birthDate}
            roleLabel={moderator.roleLabel}
          />

          <SectionSwitcher
            levels={levels}
            onSelect={(depth, id) => setMenuPath((prev) => [...prev.slice(0, depth), id])}
          />

          <PendingGrantsCard onAccepted={loadSession} />
        </div>

        <main className={`order-last flex min-h-48 w-full flex-1 flex-col overflow-hidden p-8 lg:order-2 lg:h-[42rem] ${cardClass}`}>
          <h1 className="shrink-0 text-center text-lg font-bold">{activeLabel}</h1>
          <div className="mt-4 flex flex-1 flex-col overflow-y-auto">
            <LeafContent leafId={leafId} />
          </div>
        </main>

        <div className={`flex h-[32rem] min-w-0 w-full flex-col p-5 lg:order-1 lg:h-[42rem] lg:w-72 lg:shrink-0 ${cardClass}`}>
          <ModChatPanel
            selfId={moderator.id}
            isOwner={moderator.isOwner}
            permissions={moderator.permissions}
          />
        </div>
      </div>
    </div>
  );
}
