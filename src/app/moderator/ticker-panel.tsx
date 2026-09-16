"use client";

import { useEffect, useState } from "react";
import type { SiteContent, TickerConfig } from "../lib/content";

const TICKER_BADGE_MAX_LENGTH = 25;

const inputClass =
  "rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10";

export default function TickerPanel() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [ticker, setTicker] = useState<TickerConfig | null>(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data: SiteContent) => {
        setContent(data);
        setTicker(data.ticker);
      })
      .catch(() => setStatus("Yüklenemedi"));
  }, []);

  const save = async () => {
    if (!content || !ticker) return;
    setSaving(true);
    setStatus("");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...content, ticker }),
      });
      if (!res.ok) throw new Error("Kaydedilemedi");
      setContent({ ...content, ticker });
      setStatus("Kaydedildi ✓");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const updateMessage = (
    i: number,
    patch: Partial<TickerConfig["customMessages"][number]>,
  ) => {
    if (!ticker) return;
    setTicker({
      ...ticker,
      customMessages: ticker.customMessages.map((m, idx) =>
        idx === i ? { ...m, ...patch } : m,
      ),
    });
  };

  const addMessage = () => {
    if (!ticker) return;
    setTicker({
      ...ticker,
      customMessages: [
        ...ticker.customMessages,
        { label: "", href: "", tag: "", bold: false },
      ],
    });
  };

  const removeMessage = (i: number) => {
    if (!ticker) return;
    setTicker({
      ...ticker,
      customMessages: ticker.customMessages.filter((_, idx) => idx !== i),
    });
  };

  if (!ticker) {
    return <p className="text-sm opacity-60">{status || "Yükleniyor..."}</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-3 font-sans text-sm font-bold text-black dark:text-white">
          Rozet
        </h3>
        <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
          <label className="flex flex-col gap-1 text-sm">
            Rozet metni (kırmızı pill&apos;de gösterilir)
            <input
              value={ticker.badgeLabel}
              maxLength={TICKER_BADGE_MAX_LENGTH}
              onChange={(e) => setTicker({ ...ticker, badgeLabel: e.target.value })}
              placeholder="CANLI"
              className={inputClass}
            />
          </label>
          <p className="mt-1 text-xs opacity-50">
            {ticker.badgeLabel.length}/{TICKER_BADGE_MAX_LENGTH}
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-sans text-sm font-bold text-black dark:text-white">
          Sabit Mesaj
        </h3>
        <div className="flex flex-col gap-3 rounded-2xl border border-black/10 p-4 dark:border-white/10">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={ticker.pinned}
              onChange={(e) => setTicker({ ...ticker, pinned: e.target.checked })}
            />
            Sabit mesaj göster (dönen şerit yerine)
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Mesaj
            <textarea
              value={ticker.pinnedMessage}
              onChange={(e) => setTicker({ ...ticker, pinnedMessage: e.target.value })}
              rows={2}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Link (opsiyonel)
            <input
              value={ticker.pinnedHref}
              onChange={(e) => setTicker({ ...ticker, pinnedHref: e.target.value })}
              placeholder="/"
              className={inputClass}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={ticker.pinnedBold}
              onChange={(e) => setTicker({ ...ticker, pinnedBold: e.target.checked })}
            />
            Kalın yazı
          </label>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-sans text-sm font-bold text-black dark:text-white">
          Özel Mesajlar ({ticker.customMessages.length})
        </h3>
        <div className="flex flex-col gap-3">
          {ticker.customMessages.map((m, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-2 rounded-xl border border-black/10 p-3 dark:border-white/10 sm:grid-cols-[1.4fr_1.4fr_0.7fr_auto_auto]"
            >
              <input
                value={m.label}
                onChange={(e) => updateMessage(i, { label: e.target.value })}
                placeholder="Metin"
                className={inputClass}
              />
              <input
                value={m.href}
                onChange={(e) => updateMessage(i, { href: e.target.value })}
                placeholder="Link"
                className={inputClass}
              />
              <input
                value={m.tag}
                onChange={(e) => updateMessage(i, { tag: e.target.value })}
                placeholder="Etiket"
                className={inputClass}
              />
              <label className="flex items-center gap-1.5 whitespace-nowrap text-xs">
                <input
                  type="checkbox"
                  checked={m.bold}
                  onChange={(e) => updateMessage(i, { bold: e.target.checked })}
                />
                Kalın
              </label>
              <button
                onClick={() => removeMessage(i)}
                className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addMessage}
          className="mt-3 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
        >
          + Mesaj Ekle
        </button>
      </div>

      <div className="flex items-center justify-between">
        {status && <p className="text-xs opacity-70">{status}</p>}
        <button
          onClick={save}
          disabled={saving}
          className="ml-auto rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
}
