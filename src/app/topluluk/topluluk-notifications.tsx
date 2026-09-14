"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createTopic } from "../lib/topluluk";
import { useOutsideClick } from "../lib/use-outside-click";

const topicCategories = [
  "Genel Sohbet",
  "Mod Paylaşımı",
  "Build Rehberleri",
  "Etkinlikler",
  "Yardım",
];

type Mode = "notifications" | "newTopic";
type Notification = { title: string; body: string };

export default function ToplulukNotifications() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("notifications");
  const [notifications] = useState<Notification[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(topicCategories[0]);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = title.trim().length > 0 && body.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const topicId = await createTopic(title.trim(), category, body.trim());
      setOpen(false);
      setTitle("");
      setBody("");
      router.push(`/topluluk/${topicId}`);
    } catch {
      setError(
        "Konu açılamadı — giriş yapmış olman ve bu hafta içinde başka konu açmamış olman gerekiyor.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // submitting sırasında dışarı tıklanırsa popover kapanıp gönderim
  // devam ederken hata (ya da başarı) kullanıcıya hiç gösterilemiyordu --
  // sonucu görene kadar kapanmasını engelliyoruz.
  useOutsideClick(containerRef, () => setOpen(false), open && !submitting);

  const openNewTopic = () => {
    setMode("newTopic");
    setOpen(true);
  };

  const toggleNotifications = () => {
    setMode("notifications");
    setOpen((v) => (mode === "notifications" ? !v : true));
  };

  return (
    <div className="relative flex items-center gap-3" ref={containerRef}>
      <button
        type="button"
        onClick={openNewTopic}
        aria-label="Yeni Konu"
        className="flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2.5 text-sm font-medium text-black shadow-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span className="hidden sm:inline">Yeni Konu</span>
      </button>

      <button
        type="button"
        onClick={toggleNotifications}
        aria-label="Bildirimler"
        aria-expanded={open && mode === "notifications"}
        className="relative flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black shadow-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {open && mode === "notifications" && (
        <div className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-3xl border border-black/10 bg-white/95 p-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/90">
          <h3 className="mb-3 font-sans text-sm font-bold text-black dark:text-white">
            Bildirimler
          </h3>
          {notifications.length === 0 ? (
            <p className="text-sm text-black/60 dark:text-white/60">
              Bildirim yok
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {notifications.map((n, i) => (
                <div key={i}>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {n.title}
                  </p>
                  <p className="text-xs text-black/60 dark:text-white/60">
                    {n.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {open && mode === "newTopic" && (
        <div className="absolute right-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-3xl border border-black/10 bg-white/95 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/90">
          <div className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-sm font-bold text-black dark:text-white">
                Yeni Konu Aç
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={submitting}
                aria-label="Kapat"
                className="text-black/60 transition hover:text-black disabled:cursor-not-allowed disabled:opacity-40 dark:text-white/60 dark:hover:text-white"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <p className="rounded-xl bg-black/5 px-3 py-2 text-xs text-black/60 dark:bg-white/10 dark:text-white/60">
              Her kullanıcı haftada sadece 1 konu ekleyebilir.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-black/60 dark:text-white/60">
                Başlık
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Konunun başlığı"
                className="rounded-xl border border-black/10 bg-white/50 px-3 py-2 text-sm text-black outline-none backdrop-blur-sm transition focus:border-black/30 dark:border-white/10 dark:bg-black/30 dark:text-white dark:focus:border-white/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-black/60 dark:text-white/60">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-black/10 bg-white/50 px-3 py-2 text-sm text-black outline-none backdrop-blur-sm transition focus:border-black/30 dark:border-white/10 dark:bg-black/30 dark:text-white dark:focus:border-white/30"
              >
                {topicCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-black/60 dark:text-white/60">
                İçerik
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                placeholder="Ne anlatmak istiyorsun?"
                className="resize-none rounded-xl border border-black/10 bg-white/50 px-3 py-2 text-sm text-black outline-none backdrop-blur-sm transition focus:border-black/30 dark:border-white/10 dark:bg-black/30 dark:text-white dark:focus:border-white/30"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/40 disabled:text-white/70 dark:bg-white dark:text-black dark:hover:bg-white/80 dark:disabled:bg-white/20 dark:disabled:text-black/60"
            >
              {submitting ? "Paylaşılıyor…" : "Paylaş"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
