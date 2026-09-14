"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type {
  CreatorPlatform,
  CreatorTier,
  InfoCard,
  NavLink,
  SiteContent,
} from "@/app/lib/content";
import type { ModeratorSession, ModeratorTab } from "@/app/lib/permissions";
import Logo from "../logo";
import ModeratorAuthGate from "../moderator-auth-gate";
import Watermark from "../watermark";
import ToplulukPanel from "./topluluk-panel";

const allTabs: { id: ModeratorTab; label: string }[] = [
  { id: "cards", label: "Bilgi Kartları" },
  { id: "links", label: "Footer / Menü Linkleri" },
  { id: "creators", label: "Yayıncılar" },
  { id: "articles", label: "Topluluk" },
];

const cardSizeOptions: { label: string; value: string }[] = [
  { label: "Küçük", value: "" },
  { label: "Orta (geniş)", value: "sm:col-span-2" },
  { label: "Büyük (geniş + uzun)", value: "sm:col-span-2 sm:row-span-2" },
];

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

  const tabs = allTabs.filter((tab) => moderator.permissions.includes(tab.id));

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
        {
          title: "Yeni Kart",
          body: "Açıklama metni.",
          span: "",
          imageUrl: "",
          linkUrl: "#",
        },
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

          <nav className="flex flex-row gap-1 overflow-x-auto sm:mt-8 sm:flex-col sm:overflow-visible">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-[18px] px-4 py-2.5 text-left text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-[#0a0a0a] text-[#fafafa]"
                    : "text-[#0a0a0a]/70 hover:bg-black/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
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
              <h2 className="text-xl font-bold">Bilgi Kartları</h2>
              <button
                onClick={addCard}
                className="text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
              >
                + Kart ekle
              </button>
            </div>
            {content.infoCards.map((card, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white/30 p-4 dark:border-white/10 dark:bg-black/20"
              >
                <input
                  value={card.title}
                  onChange={(e) => updateCard(i, { title: e.target.value })}
                  placeholder="Başlık"
                  className={`${inputClass} font-semibold`}
                />
                <textarea
                  value={card.body}
                  onChange={(e) => updateCard(i, { body: e.target.value })}
                  placeholder="Metin"
                  rows={2}
                  className={`${inputClass} text-sm`}
                />
                <input
                  value={card.imageUrl}
                  onChange={(e) =>
                    updateCard(i, { imageUrl: e.target.value })
                  }
                  placeholder="Görsel URL (opsiyonel)"
                  className={`${inputClass} text-sm`}
                />
                <input
                  value={card.linkUrl}
                  onChange={(e) => updateCard(i, { linkUrl: e.target.value })}
                  placeholder="Yönlendirme linki (örn. /hakkimizda)"
                  className={`${inputClass} text-sm`}
                />
                <div className="flex items-center gap-2">
                  <select
                    value={card.span}
                    onChange={(e) => updateCard(i, { span: e.target.value })}
                    className={`${inputClass} flex-1 text-xs`}
                  >
                    {cardSizeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeCard(i)}
                    className="text-sm text-[#e7000b] hover:opacity-70"
                  >
                    Sil
                  </button>
                </div>
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
        </main>
      </div>
    </div>
  );
}
