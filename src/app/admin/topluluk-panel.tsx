"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listTopics, type TopicSummary } from "../lib/topluluk";

const STATUS_LABEL: Record<TopicSummary["status"], string> = {
  open: "Tartışılıyor",
  packaging: "Paketleniyor",
  pending_objection: "İtiraz Penceresi",
  finalized: "Kalıcı Madde",
};

const STATUS_ORDER: TopicSummary["status"][] = [
  "pending_objection",
  "open",
  "packaging",
  "finalized",
];

export default function ToplulukPanel() {
  const [topics, setTopics] = useState<TopicSummary[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    listTopics()
      .then(setTopics)
      .catch(() => setError(true));
  }, []);

  const sorted = topics
    ? [...topics].sort(
        (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
      )
    : [];

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-white/40 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
      <div>
        <h2 className="text-xl font-bold">Topluluk Konuları</h2>
        <p className="mt-1 text-xs opacity-60">
          Paketleme, itiraz inceleme ve yayınlama işlemleri her konunun kendi
          sayfasında yapılır — buradan konuya git.
        </p>
      </div>

      {error ? (
        <p className="text-sm text-rose-600 dark:text-rose-400">
          Konular yüklenemedi (veritabanı bağlantısı veya migration eksik
          olabilir).
        </p>
      ) : topics === null ? (
        <p className="text-sm opacity-60">Yükleniyor…</p>
      ) : sorted.length === 0 ? (
        <p className="text-sm opacity-60">Henüz konu yok.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map((topic) => (
            <Link
              key={topic.id}
              href={`/topluluk/${topic.id}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/30 px-4 py-3 text-sm transition hover:bg-white/60 dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/40"
            >
              <div className="flex flex-col">
                <span className="font-semibold">{topic.title}</span>
                <span className="text-xs opacity-60">
                  {topic.authorUsername} · {topic.messageCount} mesaj
                </span>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  topic.status === "pending_objection"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    : "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60"
                }`}
              >
                {STATUS_LABEL[topic.status]}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
