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

export default function FeaturedPosts({ query }: { query?: string }) {
  const [topics, setTopics] = useState<TopicSummary[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const trimmed = query?.trim();

  // Mount'ta bir kez, geniş bir üst sınırla ("arama" anlamlı olsun diye
  // eskiden 50'ydi, artık listTopics()'in kendi varsayılanı) çekip
  // filtrelemeyi render sırasında (kullanıcı adı dahil) yapıyoruz --
  // query'e bağlı bir effect + senkron setState reset yerine bu, hem
  // daha basit hem "effect içinde doğrudan setState" lint kuralına takılmıyor.
  useEffect(() => {
    listTopics()
      .then(setTopics)
      .catch(() => setLoadError(true));
  }, []);

  const filtered =
    topics && trimmed
      ? topics.filter((t) =>
          [t.title, t.category, t.authorUsername]
            .join(" ")
            .toLowerCase()
            .includes(trimmed.toLowerCase()),
        )
      : topics;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-sans text-lg font-bold text-black dark:text-white">
        {trimmed ? (
          <>
            <span className="text-emerald-600 dark:text-emerald-400">
              #{trimmed}
            </span>{" "}
            ile ilgili gönderiler
          </>
        ) : (
          "Öne Çıkan Gönderiler"
        )}
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
      ) : filtered === null ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-3xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-black/15 py-16 text-center dark:border-white/15">
          <p className="font-sans text-base font-semibold text-black dark:text-white">
            {trimmed ? "Bu etiketle ilgili gönderi bulunamadı" : "Henüz konu yok"}
          </p>
          <p className="text-sm text-black/60 dark:text-white/60">
            {trimmed
              ? "Yakında bu konuda daha fazla içerik olacak."
              : "İlk konuyu açan sen ol."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((topic) => (
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
                <span className="opacity-50 text-black dark:text-white">
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
  );
}
