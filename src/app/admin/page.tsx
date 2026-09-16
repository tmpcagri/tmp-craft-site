"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type {
  CreatorPlatform,
  CreatorTier,
  InfoCard,
  NavLink,
  OccasionTheme,
  ScheduledOccasion,
  SiteContent,
} from "@/app/lib/content";
import type { ModeratorSession, ModeratorTab } from "@/app/lib/permissions";
import ImageUpload from "./image-upload";
import Logo from "../logo";
import ModeratorAuthGate from "../moderator-auth-gate";
import Watermark from "../watermark";
import ModPaketleriPanel from "./mod-paketleri-panel";
import SunucularPanel from "./sunucular-panel";
import ToplulukPanel from "./topluluk-panel";

const occasionThemeOptions: { label: string; value: OccasionTheme }[] = [
  { label: "Yok", value: "none" },
  { label: "Resmi Gün (Türk bayrağı)", value: "resmi" },
  { label: "Yas/Anma Günü (soluk + kurdele)", value: "yas" },
  { label: "Dini Bayram (hilal)", value: "dini" },
];

// Sitenin gerçek sayfa hiyerarşisine göre gruplanmış -- önceden düz, tek
// bir sekme listesiydi (Bilgi Kartları/Footer-Menü/Yayıncılar/Topluluk),
// hangi ayarın hangi sayfayla ilgili olduğu belli değildi. Grup başlıkları
// sadece görsel, izin kontrolü hâlâ tek tek tab id'si üzerinden.
const GROUPS: { label: string; tabs: { id: ModeratorTab; label: string }[] }[] = [
  {
    label: "Ana Sayfa",
    tabs: [
      { id: "cards", label: "Duyuru Kartları" },
      { id: "occasion", label: "Özel Günler Teması" },
      { id: "ticker", label: "CANLI Şeridi" },
      { id: "hero", label: "Hero Kartları" },
      { id: "panels", label: "Öne Çıkan Modlar" },
    ],
  },
  { label: "Mod Paketleri", tabs: [{ id: "mods", label: "Mod / Shader Yükle" }] },
  { label: "Sunucular", tabs: [{ id: "servers", label: "Sunucu Kartları" }] },
  {
    label: "Topluluk",
    tabs: [
      { id: "creators", label: "Yayıncılar" },
      { id: "articles", label: "Makaleler" },
      { id: "topluluk_hero", label: "Alt Yazılar" },
    ],
  },
  { label: "Site", tabs: [{ id: "links", label: "Footer / Menü Linkleri" }] },
];

const allTabs: { id: ModeratorTab; label: string }[] = GROUPS.flatMap(
  (g) => g.tabs,
);

const platformOptions: CreatorPlatform[] = ["YouTube", "Twitch", "TikTok"];
const tierOptions: { label: string; value: CreatorTier }[] = [
  { label: "Premium (ödemeli öne çıkarma)", value: "premium" },
  { label: "Diğer Yayıncılar", value: "standard" },
  { label: "Yeni Başlayanlar", value: "newcomer" },
];

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function AdminPage() {
  const [moderator, setModerator] = useState<ModeratorSession | undefined>(
    undefined,
  );
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState<ModeratorTab | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => {
        if (!res.ok) throw new Error("content fetch failed");
        return res.json();
      })
      .then(setContent)
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => {
        if (!res.ok) throw new Error("session fetch failed");
        return res.json();
      })
      .then((session: ModeratorSession) => {
        setModerator(session);
        setActiveTab(
          allTabs.find((tab) => session?.permissions.includes(tab.id))?.id ??
            null,
        );
      })
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

  if (!content || moderator === undefined) {
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

  const save = async () => {
    setStatus("Kaydediliyor...");
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setStatus(res.ok ? "Kaydedildi ✓" : "Hata oluştu");
  };

  const updateCard = (index: number, patch: Partial<InfoCard>) => {
    const infoCards = [...content.infoCards];
    infoCards[index] = { ...infoCards[index], ...patch };
    setContent({ ...content, infoCards });
  };

  const removeCard = (index: number) => {
    setContent({
      ...content,
      infoCards: content.infoCards.filter((_, i) => i !== index),
    });
  };

  const addCard = () => {
    setContent({
      ...content,
      infoCards: [
        ...content.infoCards,
        { title: "Yeni Duyuru", linkUrl: "#" },
      ],
    });
  };

  const updateLink = (index: number, patch: Partial<NavLink>) => {
    const footerLinks = [...content.footerLinks];
    footerLinks[index] = { ...footerLinks[index], ...patch };
    setContent({ ...content, footerLinks });
  };

  const removeLink = (index: number) => {
    setContent({
      ...content,
      footerLinks: content.footerLinks.filter((_, i) => i !== index),
    });
  };

  const addLink = () => {
    setContent({
      ...content,
      footerLinks: [...content.footerLinks, { label: "Yeni Link", href: "#" }],
    });
  };

  const updateCreator = (
    index: number,
    patch: Partial<SiteContent["recommendedCreators"][number]>,
  ) => {
    const recommendedCreators = [...content.recommendedCreators];
    recommendedCreators[index] = { ...recommendedCreators[index], ...patch };
    setContent({ ...content, recommendedCreators });
  };

  const removeCreator = (index: number) => {
    setContent({
      ...content,
      recommendedCreators: content.recommendedCreators.filter(
        (_, i) => i !== index,
      ),
    });
  };

  const moveCreator = (index: number, direction: -1 | 1) => {
    setContent({
      ...content,
      recommendedCreators: moveItem(
        content.recommendedCreators,
        index,
        index + direction,
      ),
    });
  };

  const addCreator = () => {
    setContent({
      ...content,
      recommendedCreators: [
        ...content.recommendedCreators,
        {
          name: "Yeni Yayıncı",
          platform: "YouTube",
          note: "Kısa açıklama",
          tier: "standard",
        },
      ],
    });
  };

  const updateOccasion = (patch: Partial<SiteContent["specialOccasion"]>) => {
    setContent({
      ...content,
      specialOccasion: { ...content.specialOccasion, ...patch },
    });
  };

  const updateSchedulePeriod = (index: number, patch: Partial<ScheduledOccasion>) => {
    const schedule = [...content.specialOccasion.schedule];
    schedule[index] = { ...schedule[index], ...patch };
    updateOccasion({ schedule });
  };

  const removeSchedulePeriod = (index: number) => {
    updateOccasion({
      schedule: content.specialOccasion.schedule.filter((_, i) => i !== index),
    });
  };

  const addSchedulePeriod = () => {
    updateOccasion({
      schedule: [
        ...content.specialOccasion.schedule,
        { theme: "resmi", startDate: "", endDate: "", label: "Yeni dönem" },
      ],
    });
  };

  const updateTicker = (patch: Partial<SiteContent["ticker"]>) => {
    setContent({ ...content, ticker: { ...content.ticker, ...patch } });
  };

  const updateTickerMessage = (
    index: number,
    patch: Partial<SiteContent["ticker"]["customMessages"][number]>,
  ) => {
    const customMessages = [...content.ticker.customMessages];
    customMessages[index] = { ...customMessages[index], ...patch };
    updateTicker({ customMessages });
  };

  const removeTickerMessage = (index: number) => {
    updateTicker({
      customMessages: content.ticker.customMessages.filter((_, i) => i !== index),
    });
  };

  const addTickerMessage = () => {
    updateTicker({
      customMessages: [
        ...content.ticker.customMessages,
        { label: "Yeni mesaj", href: "/", tag: "Duyuru" },
      ],
    });
  };

  const updateHero = (patch: Partial<SiteContent["hero"]>) => {
    setContent({ ...content, hero: { ...content.hero, ...patch } });
  };

  const updateFeaturedSlide = (index: number, patch: Partial<SiteContent["hero"]["featuredSlides"][number]>) => {
    const featuredSlides = [...content.hero.featuredSlides];
    featuredSlides[index] = { ...featuredSlides[index], ...patch };
    updateHero({ featuredSlides });
  };

  const removeFeaturedSlide = (index: number) => {
    if (content.hero.featuredSlides.length <= 1) return;
    updateHero({
      featuredSlides: content.hero.featuredSlides.filter((_, i) => i !== index),
    });
  };

  const addFeaturedSlide = () => {
    const last = content.hero.featuredSlides[content.hero.featuredSlides.length - 1];
    updateHero({
      featuredSlides: [
        ...content.hero.featuredSlides,
        { ...last, title: "Yeni görsel" },
      ],
    });
  };

  const updateSecondarySlide = (index: number, patch: Partial<SiteContent["hero"]["secondary"][number]>) => {
    const secondary = [...content.hero.secondary];
    secondary[index] = { ...secondary[index], ...patch };
    updateHero({ secondary });
  };

  const updateFeaturedModEntry = (index: number, patch: Partial<SiteContent["featuredMods"][number]>) => {
    const featuredMods = [...content.featuredMods];
    featuredMods[index] = { ...featuredMods[index], ...patch };
    setContent({ ...content, featuredMods });
  };

  const removeFeaturedModEntry = (index: number) => {
    setContent({
      ...content,
      featuredMods: content.featuredMods.filter((_, i) => i !== index),
    });
  };

  const addFeaturedModEntry = () => {
    setContent({
      ...content,
      featuredMods: [...content.featuredMods, { slug: "", tag: "" }],
    });
  };

  const moveFeaturedModEntry = (index: number, direction: -1 | 1) => {
    setContent({
      ...content,
      featuredMods: moveItem(content.featuredMods, index, index + direction),
    });
  };

  const updateToplulukHeroSlide = (index: number, patch: Partial<SiteContent["toplulukHero"][number]>) => {
    const toplulukHero = [...content.toplulukHero];
    toplulukHero[index] = { ...toplulukHero[index], ...patch };
    setContent({ ...content, toplulukHero });
  };

  // shadcn/ui referans stili -- "clinical blueprint on frosted paper":
  // monokrom (canvas #f5f5f5 / paper #fff / ink #0a0a0a), 18px pill
  // radius interaktif öğelerde, 24px konteynerlerde, tek renkli vurgu
  // (#e7000b) sadece yıkıcı aksiyonlarda (Sil). Deneme amaçlı sadece bu
  // panelde -- sitenin geri kalanı kendi renkli/koyu-açık temasında
  // kalıyor, bu yüzden dark: varyantı yok, tema kasıtlı olarak sabit.
  const inputClass =
    "rounded-[18px] border-none bg-[#f5f5f5] px-3 py-2 text-[#0a0a0a] outline-none transition focus:ring-1 focus:ring-[#e5e5e5]";

  const cardClass =
    "flex flex-col gap-4 rounded-[24px] border border-[#e5e5e5] bg-white p-5 shadow-[0_0_0_1px_rgba(23,23,23,0.05),0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f5f5f5] font-sans text-[#0a0a0a]">
      <Watermark text={`${moderator.username} · ${moderator.id}`} />

      {/* Sol sidebar -- logo üstte, sekmeler dikey liste, hesap/kaydet
          alanı en altta. */}
      <div className="flex min-h-screen w-full flex-col sm:flex-row">
        <aside className="flex w-full shrink-0 flex-col gap-6 border-b border-[#e5e5e5] bg-[#fafafa] px-6 py-6 sm:w-64 sm:min-h-screen sm:gap-0 sm:border-b-0 sm:border-r sm:px-5">
          <Link href="/" className="flex items-center gap-3">
            <Logo compact />
          </Link>
          <p className="-mt-4 hidden text-xs font-normal text-[#737373] sm:block">
            Moderatör Paneli
          </p>

          {/* Windows XP'deki iç içe açılan klasör menüsü gibi -- sol tarafta
              sadece sayfa isimleri (Ana Sayfa/Topluluk/...), üstüne
              gelince (ya da dokununca) o sayfanın alt sekmeleri sağa
              doğru bir "flyout" olarak açılıyor. Önceden her grubun tüm
              alt sekmeleri sürekli açık/dikey listeliydi -- Ana Sayfa'nın
              5 alt sekmesi olunca dağınık görünüyordu. */}
          <nav className="relative flex flex-row gap-1 overflow-x-auto sm:mt-8 sm:flex-col sm:overflow-visible">
            {GROUPS.map((group) => {
              const groupTabs = group.tabs.filter((tab) =>
                moderator.permissions.includes(tab.id),
              );
              if (groupTabs.length === 0) return null;
              const isOpen = openGroup === group.label;
              const hasActiveTab = groupTabs.some((tab) => tab.id === activeTab);
              return (
                <div
                  key={group.label}
                  className="relative shrink-0"
                  onMouseEnter={() => setOpenGroup(group.label)}
                  onMouseLeave={() => setOpenGroup((g) => (g === group.label ? null : g))}
                >
                  <button
                    onClick={() => setOpenGroup(isOpen ? null : group.label)}
                    className={`flex w-full shrink-0 items-center justify-between gap-2 rounded-[18px] px-4 py-2.5 text-left text-sm font-medium transition ${
                      isOpen || hasActiveTab
                        ? "bg-[#0a0a0a] text-[#fafafa]"
                        : "text-[#0a0a0a]/70 hover:bg-black/5"
                    }`}
                  >
                    {group.label}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hidden shrink-0 opacity-60 sm:block">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="z-30 flex flex-col gap-1 rounded-[18px] border border-[#e5e5e5] bg-white p-1.5 shadow-lg sm:absolute sm:left-full sm:top-0 sm:ml-1.5 sm:w-56">
                      {groupTabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setOpenGroup(null);
                          }}
                          className={`shrink-0 rounded-xl px-3.5 py-2 text-left text-sm font-medium transition ${
                            activeTab === tab.id
                              ? "bg-[#0a0a0a] text-[#fafafa]"
                              : "text-[#0a0a0a]/70 hover:bg-black/5"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex flex-col gap-3 border-t border-[#e5e5e5] pt-5 sm:mt-auto">
            <p className="truncate text-xs text-[#737373]">
              {moderator.username} · {moderator.id}
            </p>
            {status && <p className="text-xs text-[#737373]">{status}</p>}
            <button
              onClick={save}
              className="rounded-[18px] bg-[#0a0a0a] px-5 py-2.5 text-sm font-medium text-[#fafafa] transition hover:bg-[#171717]"
            >
              Kaydet
            </button>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-6 px-6 py-8 pb-24 sm:px-10">
        {activeTab === "cards" && (
          <section className={cardClass}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Duyuru Kartları</h2>
              <button
                onClick={addCard}
                className="text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
              >
                + Duyuru ekle
              </button>
            </div>
            <p className="-mt-2 text-xs opacity-60">
              Anasayfanın en üstündeki CANLI/Son Dakika şeridinde &quot;Duyuru&quot;
              etiketiyle görünen mesajlar. Boş bırakılırsa 3 sabit yedek
              mesaj gösterilir.
            </p>
            {content.infoCards.map((card, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={card.title}
                  onChange={(e) => updateCard(i, { title: e.target.value })}
                  placeholder="Duyuru metni"
                  className={`${inputClass} flex-1 text-sm`}
                />
                <input
                  value={card.linkUrl}
                  onChange={(e) => updateCard(i, { linkUrl: e.target.value })}
                  placeholder="Yönlendirme linki (örn. /hakkimizda)"
                  className={`${inputClass} flex-1 text-sm`}
                />
                <button
                  onClick={() => removeCard(i)}
                  className="text-sm text-[#e7000b] hover:opacity-70"
                >
                  Sil
                </button>
              </div>
            ))}
          </section>
        )}

        {activeTab === "occasion" && (
          <section className={cardClass}>
            <h2 className="text-xl font-bold">Özel Günler Teması</h2>
            <p className="-mt-2 text-xs opacity-60">
              Elle seçilen tema her zaman otomatik zamanlamanın önüne geçer.
              &quot;Yok&quot; seçiliyken, otomatik zamanlama açıksa ve bugün
              aşağıdaki dönemlerden birine denk geliyorsa o dönemin teması
              otomatik aktif olur.
            </p>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
                Elle Seçili Tema
              </label>
              <select
                value={content.specialOccasion.manualTheme}
                onChange={(e) => updateOccasion({ manualTheme: e.target.value as OccasionTheme })}
                className={`${inputClass} text-sm`}
              >
                {occasionThemeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={content.specialOccasion.autoScheduleEnabled}
                onChange={(e) => updateOccasion({ autoScheduleEnabled: e.target.checked })}
                className="h-4 w-4"
              />
              Otomatik zamanlama aktif
            </label>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Zamanlanmış Dönemler</p>
                <button
                  onClick={addSchedulePeriod}
                  className="text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
                >
                  + Dönem ekle
                </button>
              </div>
              {content.specialOccasion.schedule.map((period, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white/30 p-4"
                >
                  <input
                    value={period.label}
                    onChange={(e) => updateSchedulePeriod(i, { label: e.target.value })}
                    placeholder="Etiket (ör. 30 Ağustos Zafer Bayramı)"
                    className={`${inputClass} text-sm`}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={period.theme}
                      onChange={(e) =>
                        updateSchedulePeriod(i, { theme: e.target.value as OccasionTheme })
                      }
                      className={`${inputClass} text-sm`}
                    >
                      {occasionThemeOptions
                        .filter((o) => o.value !== "none")
                        .map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                    </select>
                    <input
                      type="date"
                      value={period.startDate}
                      onChange={(e) => updateSchedulePeriod(i, { startDate: e.target.value })}
                      className={`${inputClass} text-sm`}
                    />
                    <span className="text-xs opacity-50">—</span>
                    <input
                      type="date"
                      value={period.endDate}
                      onChange={(e) => updateSchedulePeriod(i, { endDate: e.target.value })}
                      className={`${inputClass} text-sm`}
                    />
                    <button
                      onClick={() => removeSchedulePeriod(i)}
                      className="ml-auto text-sm text-[#e7000b] hover:opacity-70"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
                Arka Plan Görseli (opsiyonel)
              </label>
              <ImageUpload
                section="ozel-gunler"
                slug="arka-plan"
                value={content.specialOccasion.backgroundImageUrl || null}
                onChange={(url) => updateOccasion({ backgroundImageUrl: url })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
                Arka Plan Şeffaflığı ({Math.round(content.specialOccasion.backgroundOpacity * 100)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={content.specialOccasion.backgroundOpacity}
                onChange={(e) => updateOccasion({ backgroundOpacity: Number(e.target.value) })}
              />
            </div>
          </section>
        )}

        {activeTab === "ticker" && (
          <section className={cardClass}>
            <h2 className="text-xl font-bold">CANLI Şeridi</h2>
            <p className="-mt-2 text-xs opacity-60">
              Anasayfanın en üstündeki, hep hareket eden şerit. Sabitleme
              açıksa şerit dönmeyi bırakır, sadece aşağıdaki tek mesajı
              gösterir.
            </p>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
                Etiket
              </label>
              <select
                value={content.ticker.mode}
                onChange={(e) =>
                  updateTicker({ mode: e.target.value as SiteContent["ticker"]["mode"] })
                }
                className={`${inputClass} text-sm`}
              >
                <option value="canli">Canlı</option>
                <option value="son-dakika">Son Dakika</option>
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={content.ticker.pinned}
                onChange={(e) => updateTicker({ pinned: e.target.checked })}
                className="h-4 w-4"
              />
              Sabit yazı modu (dönmeyi durdur, tek mesaj göster)
            </label>

            {content.ticker.pinned && (
              <div className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white/30 p-4">
                <input
                  value={content.ticker.pinnedMessage}
                  onChange={(e) => updateTicker({ pinnedMessage: e.target.value })}
                  placeholder="Sabit mesaj"
                  className={`${inputClass} text-sm`}
                />
                <input
                  value={content.ticker.pinnedHref}
                  onChange={(e) => updateTicker({ pinnedHref: e.target.value })}
                  placeholder="Yönlendirme linki"
                  className={`${inputClass} text-sm`}
                />
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Özel Mesajlar</p>
                <button
                  onClick={addTickerMessage}
                  className="text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
                >
                  + Mesaj ekle
                </button>
              </div>
              <p className="-mt-2 text-xs opacity-60">
                Otomatik duyuru/gündem/sunucu karışımının BAŞINA eklenir
                (sabit yazı modu kapalıyken).
              </p>
              {content.ticker.customMessages.map((msg, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={msg.label}
                    onChange={(e) => updateTickerMessage(i, { label: e.target.value })}
                    placeholder="Mesaj"
                    className={`${inputClass} flex-1 text-sm`}
                  />
                  <input
                    value={msg.href}
                    onChange={(e) => updateTickerMessage(i, { href: e.target.value })}
                    placeholder="Link"
                    className={`${inputClass} flex-1 text-sm`}
                  />
                  <button
                    onClick={() => removeTickerMessage(i)}
                    className="text-sm text-[#e7000b] hover:opacity-70"
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "hero" && (
          <section className={cardClass}>
            <h2 className="text-xl font-bold">Hero Kartları</h2>
            <p className="-mt-2 text-xs opacity-60">
              Anasayfanın en üstündeki büyük &quot;Hoşgeldin&quot; kartı ve
              yanındaki 3 küçük kart. Kartların YERLERİ sabit, sadece
              içerikleri (görsel/yazı/link) düzenlenebiliyor.
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">
                  Büyük Kart Görselleri ({content.hero.featuredSlides.length})
                </p>
                <button
                  onClick={addFeaturedSlide}
                  className="text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
                >
                  + Görsel ekle
                </button>
              </div>
              <p className="-mt-2 text-xs opacity-60">
                Birden fazla görsel eklersen kart, aşağıdaki süreyle
                otomatik dönen bir galeriye dönüşür.
              </p>
              <label className="flex flex-col gap-1 text-sm">
                Geçiş Süresi (ms)
                <input
                  type="number"
                  value={content.hero.featuredIntervalMs}
                  onChange={(e) => updateHero({ featuredIntervalMs: Number(e.target.value) || 5000 })}
                  className={`${inputClass} w-40 text-sm`}
                />
              </label>
              {content.hero.featuredSlides.map((slide, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white/30 p-4"
                >
                  <ImageUpload
                    section="mod-paketleri"
                    slug={`hero-featured-${i}`}
                    value={slide.image || null}
                    onChange={(url) => updateFeaturedSlide(i, { image: url })}
                  />
                  <input
                    value={slide.title}
                    onChange={(e) => updateFeaturedSlide(i, { title: e.target.value })}
                    placeholder="Başlık"
                    className={`${inputClass} text-sm`}
                  />
                  <input
                    value={slide.body}
                    onChange={(e) => updateFeaturedSlide(i, { body: e.target.value })}
                    placeholder="Alt metin"
                    className={`${inputClass} text-sm`}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      value={slide.href}
                      onChange={(e) => updateFeaturedSlide(i, { href: e.target.value })}
                      placeholder="Yönlendirme linki"
                      className={`${inputClass} flex-1 text-sm`}
                    />
                    {content.hero.featuredSlides.length > 1 && (
                      <button
                        onClick={() => removeFeaturedSlide(i)}
                        className="text-sm text-[#e7000b] hover:opacity-70"
                      >
                        Sil
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold">Küçük Kartlar (3 sabit)</p>
              {content.hero.secondary.map((slide, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white/30 p-4"
                >
                  <ImageUpload
                    section="mod-paketleri"
                    slug={`hero-secondary-${i}`}
                    value={slide.image || null}
                    onChange={(url) => updateSecondarySlide(i, { image: url })}
                  />
                  <input
                    value={slide.title}
                    onChange={(e) => updateSecondarySlide(i, { title: e.target.value })}
                    placeholder="Başlık"
                    className={`${inputClass} text-sm`}
                  />
                  <input
                    value={slide.body}
                    onChange={(e) => updateSecondarySlide(i, { body: e.target.value })}
                    placeholder="Alt metin"
                    className={`${inputClass} text-sm`}
                  />
                  <input
                    value={slide.href}
                    onChange={(e) => updateSecondarySlide(i, { href: e.target.value })}
                    placeholder="Yönlendirme linki"
                    className={`${inputClass} text-sm`}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "panels" && (
          <section className={cardClass}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Öne Çıkan Modlar</h2>
              <button
                onClick={addFeaturedModEntry}
                className="text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
              >
                + Mod ekle
              </button>
            </div>
            <p className="-mt-2 text-xs opacity-60">
              Anasayfadaki &quot;Mod Paketleri&quot; kayan bandında hangi
              modların, hangi sırada ve hangi rozetle gösterileceği. Boş
              bırakılırsa panel ilk 8 modu rozetsiz gösterir. Slug, mod
              paketleri sayfasındaki URL&apos;in son parçası (ör.
              &quot;terra-forge&quot;).
            </p>
            {content.featuredMods.map((entry, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={entry.slug}
                  onChange={(e) => updateFeaturedModEntry(i, { slug: e.target.value })}
                  placeholder="mod-slug"
                  className={`${inputClass} flex-1 text-sm`}
                />
                <select
                  value={entry.tag}
                  onChange={(e) =>
                    updateFeaturedModEntry(i, {
                      tag: e.target.value as SiteContent["featuredMods"][number]["tag"],
                    })
                  }
                  className={`${inputClass} text-sm`}
                >
                  <option value="">Rozet yok</option>
                  <option value="Popüler">Popüler</option>
                  <option value="En Çok İndirilen">En Çok İndirilen</option>
                  <option value="Yeni">Yeni</option>
                </select>
                <button
                  onClick={() => moveFeaturedModEntry(i, -1)}
                  disabled={i === 0}
                  className="text-sm opacity-70 hover:opacity-100 disabled:opacity-20"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveFeaturedModEntry(i, 1)}
                  disabled={i === content.featuredMods.length - 1}
                  className="text-sm opacity-70 hover:opacity-100 disabled:opacity-20"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeFeaturedModEntry(i)}
                  className="text-sm text-[#e7000b] hover:opacity-70"
                >
                  Sil
                </button>
              </div>
            ))}
          </section>
        )}

        {activeTab === "links" && (
          <section className={cardClass}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Footer / Menü Linkleri</h2>
              <button
                onClick={addLink}
                className="text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
              >
                + Link ekle
              </button>
            </div>
            {content.footerLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={link.label}
                  onChange={(e) => updateLink(i, { label: e.target.value })}
                  placeholder="Etiket"
                  className={`${inputClass} flex-1 text-sm`}
                />
                <input
                  value={link.href}
                  onChange={(e) => updateLink(i, { href: e.target.value })}
                  placeholder="URL"
                  className={`${inputClass} flex-1 text-sm`}
                />
                <button
                  onClick={() => removeLink(i)}
                  className="text-sm text-[#e7000b] hover:opacity-70"
                >
                  Sil
                </button>
              </div>
            ))}
          </section>
        )}

        {activeTab === "links" && (
          <section className={cardClass}>
            <h2 className="text-xl font-bold">İletişim Bilgileri</h2>
            <p className="-mt-2 text-xs opacity-60">
              İletişim sayfasındaki WhatsApp ve e-posta düğmelerinde
              kullanılır. Boş bırakılırsa o düğme gösterilmez.
            </p>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
                WhatsApp Numarası (ülke koduyla, örn. 905551234567)
              </label>
              <input
                value={content.contact.whatsapp}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, whatsapp: e.target.value },
                  })
                }
                placeholder="905551234567"
                className={`${inputClass} text-sm`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
                E-posta Adresi
              </label>
              <input
                value={content.contact.email}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, email: e.target.value },
                  })
                }
                placeholder="destek@cagrimedya.com"
                className={`${inputClass} text-sm`}
              />
            </div>
          </section>
        )}

        {activeTab === "creators" && (
          <section className={cardClass}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Sevebileceğin Yayıncılar (Topluluk sayfası)
              </h2>
              <button
                onClick={addCreator}
                className="text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
              >
                + Yayıncı ekle
              </button>
            </div>
            <p className="-mt-2 text-xs opacity-60">
              Sıra önemli: her katmanın (Premium / Diğer / Yeni Başlayanlar)
              kendi içindeki sıralaması bu listedeki sıraya göre belirlenir.
            </p>
            {content.recommendedCreators.map((creator, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white/30 p-4 dark:border-white/10 dark:bg-black/20"
              >
                <div className="flex items-center gap-2">
                  <input
                    value={creator.name}
                    onChange={(e) =>
                      updateCreator(i, { name: e.target.value })
                    }
                    placeholder="Kullanıcı adı"
                    className={`${inputClass} flex-1 font-semibold`}
                  />
                  <select
                    value={creator.platform}
                    onChange={(e) =>
                      updateCreator(i, {
                        platform: e.target.value as CreatorPlatform,
                      })
                    }
                    className={`${inputClass} text-sm`}
                  >
                    {platformOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  value={creator.note}
                  onChange={(e) => updateCreator(i, { note: e.target.value })}
                  placeholder="Kısa açıklama"
                  className={`${inputClass} text-sm`}
                />
                <div className="flex items-center justify-between">
                  <select
                    value={creator.tier}
                    onChange={(e) =>
                      updateCreator(i, {
                        tier: e.target.value as CreatorTier,
                      })
                    }
                    className={`${inputClass} text-sm`}
                  >
                    {tierOptions.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => moveCreator(i, -1)}
                      disabled={i === 0}
                      className="text-sm opacity-70 hover:opacity-100 disabled:opacity-20"
                    >
                      ↑ Yukarı
                    </button>
                    <button
                      onClick={() => moveCreator(i, 1)}
                      disabled={i === content.recommendedCreators.length - 1}
                      className="text-sm opacity-70 hover:opacity-100 disabled:opacity-20"
                    >
                      ↓ Aşağı
                    </button>
                    <button
                      onClick={() => removeCreator(i)}
                      className="text-sm text-[#e7000b] hover:opacity-70"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {activeTab === "articles" && <ToplulukPanel />}

        {activeTab === "topluluk_hero" && (
          <section className={cardClass}>
            <h2 className="text-xl font-bold">Topluluk Alt Yazıları</h2>
            <p className="-mt-2 text-xs opacity-60">
              Topluluk sayfasının en üstündeki 4 kartlık mozaiğin
              başlık/metinleri. Kartların pozisyonu/rengi sabit, sadece
              yazıları düzenlenebiliyor.
            </p>
            {content.toplulukHero.map((slide, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white/30 p-4"
              >
                <input
                  value={slide.title}
                  onChange={(e) => updateToplulukHeroSlide(i, { title: e.target.value })}
                  placeholder="Başlık"
                  className={`${inputClass} text-sm font-semibold`}
                />
                <input
                  value={slide.body}
                  onChange={(e) => updateToplulukHeroSlide(i, { body: e.target.value })}
                  placeholder="Alt metin"
                  className={`${inputClass} text-sm`}
                />
              </div>
            ))}
          </section>
        )}

        {activeTab === "mods" && (
          <section className={cardClass}>
            <h2 className="text-xl font-bold">Mod / Shader Yükle</h2>
            <ModPaketleriPanel />
          </section>
        )}

        {activeTab === "servers" && (
          <section className={cardClass}>
            <h2 className="text-xl font-bold">Sunucu Kartları</h2>
            <SunucularPanel />
          </section>
        )}
        </main>
      </div>
    </div>
  );
}
