"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTopic, listTopics, type TopicDetail, type TopicSummary } from "../../../lib/topluluk";

const STATUS_LABEL: Record<TopicSummary["status"], string> = {
  open: "Tartışılıyor",
  packaging: "Paketleniyor",
  pending_objection: "İtiraz Penceresi",
  finalized: "Kalıcı Madde",
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "az önce";
  if (minutes < 60) return `${minutes} dakika önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün önce`;
  const weeks = Math.floor(days / 7);
  return `${weeks} hafta önce`;
}

// Bir hashtag'e/gündem konusuna özel sayfa -- önceden hashtag'e tıklamak
// sadece /topluluk?q= ile aynı sayfada filtreliyordu, kendine ait bir yeri
// yoktu. Burada hem eşleşen tüm konular hem de en çok eşleşen konudaki son
// yorumlar (mesajlar) önizlemesi gösteriliyor.
export default function HashtagFeed({ tag }: { tag: string }) {
  const [topics, setTopics] = useState<TopicSummary[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [topDetail, setTopDetail] = useState<TopicDetail | null>(null);

  useEffect(() => {
    listTopics()
      .then(setTopics)
      .catch(() => setLoadError(true));
  }, []);

  const matches = topics?.filter((t) =>
    [t.title, t.category, t.authorUsername]
      .join(" ")
      .toLowerCase()
      .includes(tag.toLowerCase()),
  );

  useEffect(() => {
    if (!matches || matches.length === 0) return;
    getTopic(matches[0].id)
      .then(setTopDetail)
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches?.[0]?.id]);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-lg font-bold text-black dark:text-white">
          Eşleşen Konular {matches ? `(${matches.length})` : ""}
        </h2>

        {loadError ? (
          <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-rose-500/30 py-16 text-center">
            <p className="font-sans text-base font-semibold text-rose-600 dark:text-rose-400">
              Gönderiler yüklenemedi
            </p>
            <p className="text-sm text-black/60 dark:text-white/60">
              Bağlantı sorunu olabilir, sayfayı yenilemeyi dene.
            </p>
          </div>
        ) : matches === null || matches === undefined ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-3xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5"
              />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-black/15 py-16 text-center dark:border-white/15">
            <p className="font-sans text-base font-semibold text-black dark:text-white">
              Bu etiketle ilgili gönderi bulunamadı
            </p>
            <p className="text-sm text-black/60 dark:text-white/60">
              Yakında bu konuda daha fazla içerik olacak.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {matches.map((topic) => (
              <Link
                key={topic.id}
                href={`/topluluk/${topic.id}`}
                className="flex flex-col gap-2 rounded-3xl border border-black/10 bg-white/40 p-5 shadow-sm backdrop-blur-xl transition hover:bg-white/60 dark:border-white/10 dark:bg-black/40 dark:hover:bg-black/60"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-black/5 px-2.5 py-1 font-semibold text-black/60 dark:bg-white/10 dark:text-white/60">
                    {topic.category}
                  </span>
                  <span className="opacity-40">·</span>
                  <span className="text-black opacity-50 dark:text-white">
                    {timeAgo(topic.createdAt)}
                  </span>
                  {topic.status !== "open" && (
                    <>
                      <span className="opacity-40">·</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {STATUS_LABEL[topic.status]}
                      </span>
                    </>
                  )}
                </div>
                <h3 className="font-sans text-base font-bold text-black dark:text-white">
                  {topic.title}
                </h3>
                <p className="text-sm text-black/70 dark:text-white/70">
                  {topic.messageCount} mesaj
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[10px] font-bold text-black/60 dark:bg-white/10 dark:text-white/60">
                    {topic.authorUsername.slice(0, 1).toUpperCase()}
                  </span>
                  {topic.authorUsername}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {topDetail && topDetail.messages.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-lg font-bold text-black dark:text-white">
              &ldquo;{topDetail.title}&rdquo; konusundaki son yorumlar
            </h2>
            <Link
              href={`/topluluk/${topDetail.id}`}
              className="text-xs font-medium text-emerald-600 underline underline-offset-4 dark:text-emerald-400"
            >
              Tüm konuya git →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {topDetail.messages.slice(-5).reverse().map((msg) => (
              <div
                key={msg.id}
                className="flex gap-3 rounded-2xl border border-black/10 bg-white/40 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-black/40"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/10 text-xs font-bold text-black/60 dark:bg-white/10 dark:text-white/60">
                  {msg.authorAvatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- external Google avatar URL
                    <img src={msg.authorAvatarUrl} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                  ) : (
                    msg.authorUsername.slice(0, 1).toUpperCase()
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-black dark:text-white">{msg.authorUsername}</span>
                    <span className="opacity-50">{timeAgo(msg.createdAt)}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-black/80 dark:text-white/80">{msg.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
