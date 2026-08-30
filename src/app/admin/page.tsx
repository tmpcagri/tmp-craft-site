"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { InfoCard, NavLink, SiteContent } from "@/app/lib/content";
import type { ModeratorSession, ModeratorTab } from "@/app/lib/permissions";
import HillsBackground from "../hills-background";
import Watermark from "../watermark";

const allTabs: { id: ModeratorTab; label: string }[] = [
  { id: "cards", label: "Bilgi Kartları" },
  { id: "links", label: "Footer / Menü Linkleri" },
];

export default function AdminPage() {
  const [moderator, setModerator] = useState<ModeratorSession | undefined>(
    undefined,
  );
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState<ModeratorTab | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then(setContent);
  }, []);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((session: ModeratorSession) => {
        setModerator(session);
        setActiveTab(
          allTabs.find((tab) => session?.permissions.includes(tab.id))?.id ??
            null,
        );
      });
  }, []);

  if (!content || moderator === undefined) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden font-sans text-black dark:text-white">
        <HillsBackground />
        <p className="relative z-10">Yükleniyor...</p>
      </div>
    );
  }

  if (!moderator) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden font-sans text-black dark:text-white">
        <HillsBackground />
        <p className="relative z-10">
          Bu sayfayı görüntülemek için giriş yapmalısın.
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

  const inputClass =
    "rounded-xl border border-black/10 bg-white/50 px-3 py-2 text-black outline-none backdrop-blur-sm transition focus:border-black/30 dark:border-white/10 dark:bg-black/30 dark:text-white dark:focus:border-white/30";

  const cardClass =
    "flex flex-col gap-4 rounded-3xl border border-black/10 bg-white/40 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40";

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-sans text-black dark:text-white">
      <HillsBackground />
      <Watermark text={`${moderator.username} · ${moderator.id}`} />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <div>
          <Link href="/" className="text-2xl font-bold tracking-tight">
            {content.navbar.logoText}{" "}
            <span className="font-normal opacity-50">Moderatör Paneli</span>
          </Link>
          <p className="mt-1 text-xs opacity-40">
            {moderator.username} · {moderator.id}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {status && <p className="text-sm opacity-70">{status}</p>}
          <button
            onClick={save}
            className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            Kaydet
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-24 sm:px-10">
        {tabs.length === 0 && (
          <p className="text-sm opacity-70">
            Hesabınıza henüz hiçbir bölüm için düzenleme yetkisi verilmemiş.
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "border border-black/10 bg-white/40 text-black backdrop-blur-sm hover:bg-white/70 dark:border-white/10 dark:bg-black/30 dark:text-white dark:hover:bg-black/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

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
                  <input
                    value={card.span}
                    onChange={(e) => updateCard(i, { span: e.target.value })}
                    placeholder="Grid genişliği (örn. sm:col-span-2)"
                    className={`${inputClass} flex-1 text-xs`}
                  />
                  <button
                    onClick={() => removeCard(i)}
                    className="text-sm text-red-500 hover:opacity-70"
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
                  className="text-sm text-red-500 hover:opacity-70"
                >
                  Sil
                </button>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
