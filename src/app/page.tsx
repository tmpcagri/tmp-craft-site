import Link from "next/link";
import { AtmosphereBackground, AtmosphereSection } from "./atmosphere";
import BackgroundGallery from "./background-gallery";
import BackgroundTexture from "./background-texture";
import ComingSoonWatermark from "./coming-soon-watermark";
import CommunitySlider from "./community-slider";
import Footer from "./footer";
import HeroSlider from "./hero-slider";
import HillsBackground from "./hills-background";
import { getCurrentUser } from "./lib/auth";
import { getSiteContent } from "./lib/content";
import { getAllDownloadItems } from "./lib/downloads-server";
import { guides } from "./lib/guides";
import { getDbServerCards } from "./lib/server-cards-server";
import { trends } from "./lib/trends";
import EgitimlerSliderPanel from "./egitimler-slider-panel";
import { type FeaturedModCard } from "./mod-paketleri-slider-panel";
import Navbar from "./navbar";
import NewsTicker, { type TickerItem } from "./news-ticker";
import ProjelerSliderPanel, { type FeaturedGuideCard } from "./projeler-slider-panel";
import ServerSpotlight from "./server-spotlight";

const FALLBACK_ANNOUNCEMENTS: TickerItem[] = [
  { label: "TMP Craft'a hoş geldin — indir, keşfet, paylaş.", href: "/", tag: "Duyuru" },
];

export default async function Home() {
  const content = getSiteContent();
  const user = await getCurrentUser();
  // Sunucu listesi sadece moderatörün gerçekten eklediği kayıtlardan
  // geliyor -- eskiden burada dolgu amaçlı 9 tane sahte statik sunucu
  // (uydurma isim/oyuncu sayısı) vardı, "sahte içerik" temizliğinde
  // kaldırıldı. Gerçek sunucu yoksa kart/şerit boş kalır, uydurma veri
  // göstermez.
  const allServerCards = await getDbServerCards();
  const allDownloadItems = await getAllDownloadItems();

  // Admin'in "Öne Çıkan Modlar" panelinde sırasını/rozetini seçtiği modlar
  // -- boşsa panel eski davranışına (ilk 8 mod) düşer, bkz.
  // mod-paketleri-slider-panel.tsx.
  const featuredModItems = content.featuredMods
    .map((entry): FeaturedModCard | null => {
      if (entry.mode === "existing") {
        const item = allDownloadItems.find((i) => i.slug === entry.slug);
        return item ? { mode: "existing", item, tag: entry.tag } : null;
      }
      return entry;
    })
    .filter((v): v is FeaturedModCard => v !== null);

  // Admin'in "Öne Çıkan Build/Farm Rehberleri" panelinde sırasını/rozetini
  // seçtiği rehberler -- boşsa panel eski davranışına (en çok görüntülenen
  // 8 rehber) düşer, bkz. projeler-slider-panel.tsx. guides.ts tamamen
  // statik olduğu için (mod paketlerinin aksine) DB'den arama yok.
  const featuredGuideItems = content.featuredGuides
    .map((entry): FeaturedGuideCard | null => {
      if (entry.mode === "existing") {
        const item = guides.find((g) => g.slug === entry.slug);
        return item ? { mode: "existing", item, tag: entry.tag } : null;
      }
      return entry;
    })
    .filter((v): v is FeaturedGuideCard => v !== null);

  // Sunucu adı + anlık oyuncu sayısı -- üstteki karma şeritte ve "Şu an
  // gündemde" bandında kullanılıyor. allServerCards'tan üretiliyor ki
  // moderatörün /admin'den eklediği sunucular da şeritte görünsün.
  const SERVER_HIGHLIGHTS: TickerItem[] = allServerCards
    .slice(0, 4)
    .map((s) => ({
      label: `${s.name} — ${s.players} oyuncu`,
      href: "/sunucular",
      tag: "Sunucu",
    }));

  const announcements: TickerItem[] =
    content.infoCards.length > 0
      ? content.infoCards.map((card) => ({
          label: card.title,
          href: card.linkUrl || "/",
          tag: "Duyuru",
        }))
      : FALLBACK_ANNOUNCEMENTS;

  // Admin'in eklediği özel mesajlar otomatik karışımın BAŞINA ekleniyor --
  // bkz. src/app/lib/content.ts TickerConfig.
  const customTickerItems: TickerItem[] = content.ticker.customMessages.map(
    (m) => ({ label: m.label, href: m.href || "/", tag: "Duyuru", bold: m.bold }),
  );

  const trendItems: TickerItem[] = trends.slice(0, 6).map((trend) => ({
    label: `#${trend.topic}`,
    href: `/topluluk/etiket/${encodeURIComponent(trend.topic)}`,
    tag: trend.category,
  }));

  // Sitenin en üstü, en sürekli görünen bölgesi -- sadece duyuru değil,
  // gündem ve sunucu bilgisiyle karışık, hep hareket eden tek bir şerit.
  const topTickerItems: TickerItem[] = [
    ...customTickerItems,
    announcements[0],
    trendItems[0],
    SERVER_HIGHLIGHTS[0],
    ...announcements.slice(1),
    trendItems[1],
    SERVER_HIGHLIGHTS[1],
  ].filter(Boolean);

  const tickerLabel = content.ticker.badgeLabel.trim() || "CANLI";
  const isTickerPinned = content.ticker.pinned && content.ticker.pinnedMessage.trim().length > 0;

  // İkinci katman şeridi -- gündem ve sunucu bilgisi tek bir akışta
  // karışık, üstteki "Canlı" şeridiyle aynı ince/az göze batan dille.
  const secondLayerItems: TickerItem[] = trendItems.flatMap((trend, i) =>
    SERVER_HIGHLIGHTS[i] ? [trend, SERVER_HIGHLIGHTS[i]] : [trend],
  );

  return (
    <div className="relative w-full">
      <AtmosphereBackground />
      <HillsBackground />
      <BackgroundTexture />
      <Navbar
        className="text-black dark:text-white"
        logoText={content.navbar.logoText}
        navLinks={content.footerLinks}
        user={user}
      />

      {/* CNN tarzı "son dakika" şeridi: koyu/kırmızı, göz alıcı rozet +
          yanıp sönen nokta, arkası hafif blur. Sadece duyuru değil --
          sitenin en sürekli görünen yeri olduğu için gündem/sunucu
          bilgisiyle karışık, hep hareket eden tek bir akış. */}
      <div className="relative z-10 w-full border-b border-black/10 bg-white/80 py-2 pt-20 text-black backdrop-blur-xl dark:border-red-900/40 dark:bg-black/70 dark:text-white">
        <div className="mx-auto flex w-[calc(100%-2rem)] items-center gap-3 sm:w-[calc(100%-5rem)]">
          <span className="ml-2 flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide sm:ml-16">
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-white" />
            {tickerLabel}
          </span>
          {isTickerPinned ? (
            <Link
              href={content.ticker.pinnedHref || "/"}
              className={`flex-1 truncate text-sm hover:underline ${content.ticker.pinnedBold ? "font-bold" : "font-medium"}`}
            >
              {content.ticker.pinnedMessage}
            </Link>
          ) : (
            <NewsTicker items={topTickerItems} className="flex-1" />
          )}
        </div>
      </div>

      <section className="relative z-10 flex w-full items-center justify-center pb-10 pt-4">
        <HeroSlider content={content.hero} />
      </section>

      <CommunitySlider allItems={allDownloadItems} featuredModItems={featuredModItems} />

      {/* İkinci katmanın açılış şeridi -- üstteki "Canlı" şeridiyle aynı
          ince/az göze batan dille, gündem + sunucu tek bir akışta birleşik.
          Kutu/kart gibi ayrı bir yer hissi vermiyor, sadece akıp geçen bir
          bilgi katmanı. Üst/alttaki bölümlerle sıkışık durmaması için
          etrafında biraz boşluk var. */}
      <div className="relative z-10 my-6 w-full border-y border-black/10 bg-black/5 py-4 dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto flex w-[calc(100%-2rem)] items-center gap-3 text-black sm:w-[calc(100%-5rem)] dark:text-white">
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
            Şu an
          </span>
          <NewsTicker items={secondLayerItems} className="flex-1" />
        </div>
      </div>

      {/* Hero'daki büyük+küçük mozaik mantığının aynısı, burada Topluluk
          (büyük) ve Sunucular (tek, birleşik kart) için tekrarlanıyor.
          Altında da aynı flagship kart stili (Build-Farm/Eğitimler ile
          birebir) Mod Paketleri ve Yayıncılar için. */}
      <AtmosphereSection
        theme="topluluk"
        className="relative z-10 flex w-full items-center justify-center pb-16 pt-6"
      >
        <div className="flex w-[calc(100%-2rem)] flex-col gap-3 sm:w-[calc(100%-5rem)]">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.6fr_1fr]">
            <Link
              href={content.homeCards.topluluk.href}
              className="group relative flex h-80 flex-col items-start justify-end gap-2 overflow-hidden rounded-3xl p-6 shadow-2xl sm:h-[32rem] sm:p-8"
            >
              <BackgroundGallery
                images={content.homeCards.topluluk.images}
                intervalMs={content.homeCards.topluluk.intervalMs}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/25" />
              <span className="relative z-10 w-fit rounded-full bg-fuchsia-500/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-fuchsia-300">
                Topluluk
              </span>
              <h2 className="relative z-10 font-sans text-2xl font-bold text-white sm:text-4xl">
                {content.homeCards.topluluk.title}
              </h2>
              <p className="relative z-10 max-w-md font-sans text-sm text-white/80 sm:text-base">
                {content.homeCards.topluluk.body}
              </p>
            </Link>

            <Link
              href={content.homeCards.sunucular.href}
              className="group relative flex h-80 flex-col overflow-hidden rounded-2xl p-5 shadow-lg sm:h-[32rem]"
            >
              <BackgroundGallery
                images={content.homeCards.sunucular.images}
                intervalMs={content.homeCards.sunucular.intervalMs}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-950/85 via-red-900/55 to-red-800/25" />

              <ServerSpotlight
                items={allServerCards}
                className="relative z-10 min-h-0 flex-1"
              />

              <div className="relative z-10 mt-3 flex shrink-0 items-baseline gap-2">
                <h3 className="font-sans text-lg font-bold text-white sm:text-xl">
                  {content.homeCards.sunucular.title}
                </h3>
                <span className="font-sans text-xs text-white/70 sm:text-sm">
                  {allServerCards.length} sunucu
                </span>
              </div>
              {content.homeCards.sunucular.body && (
                <p className="relative z-10 mt-1 font-sans text-xs text-white/70 sm:text-sm">
                  {content.homeCards.sunucular.body}
                </p>
              )}
            </Link>
          </div>

          {/* İçeriklerimiz kayan bandı patronun isteğiyle şimdilik
              kaldırıldı (2026-09-17) -- bileşen (icerik-slider-panel.tsx)
              silinmedi, ileride geri eklenecek. */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <EgitimlerSliderPanel className="h-72" />
            <ProjelerSliderPanel className="h-72" featured={featuredGuideItems} />
          </div>
        </div>
      </AtmosphereSection>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
