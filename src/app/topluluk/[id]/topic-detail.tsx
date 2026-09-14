"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { signInWithGoogle } from "../../lib/auth-client";
import { createClient } from "../../lib/supabase/client";
import {
  finalizeArticle,
  getMyModeratorFlags,
  getTopic,
  listObjections,
  postMessage,
  postObjection,
  type ObjectionRow,
  type TopicDetail as TopicDetailData,
} from "../../lib/topluluk";

const STATUS_LABEL: Record<TopicDetailData["status"], string> = {
  open: "Tartışılıyor",
  packaging: "Paketleniyor",
  pending_objection: "İtiraz Penceresi Açık",
  finalized: "Kalıcı Madde",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/10 text-xs font-bold text-black/60 dark:bg-white/10 dark:text-white/60">
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export default function TopicDetail({ topicId }: { topicId: string }) {
  const pathname = usePathname();
  const [topic, setTopic] = useState<TopicDetailData | null | undefined>(undefined);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [moderator, setModerator] = useState({ isOwner: false, canCurate: false });

  const [reply, setReply] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replyError, setReplyError] = useState("");

  const [objection, setObjection] = useState("");
  const [objectionSubmitting, setObjectionSubmitting] = useState(false);
  const [objectionSent, setObjectionSent] = useState(false);
  const [objectionError, setObjectionError] = useState("");

  const [finalizeError, setFinalizeError] = useState("");

  const [objections, setObjections] = useState<ObjectionRow[] | null>(null);
  const [packaging, setPackaging] = useState(false);
  const [packagingError, setPackagingError] = useState("");
  const [finalizing, setFinalizing] = useState(false);

  // getTopic() çağrıları network sırasına göre out-of-order dönebilir
  // (ör. art arda iki refresh() tetiklenirse) -- eski bir yanıt yeni
  // state'in üzerine yazmasın diye bir "generation" sayacı tutuyoruz
  // (mesajlar/page.tsx'teki threadGenRef ile aynı desen).
  const refreshGenRef = useRef(0);

  const refresh = useCallback(() => {
    const gen = ++refreshGenRef.current;
    getTopic(topicId)
      .then((data) => {
        if (gen === refreshGenRef.current) setTopic(data);
      })
      .catch(() => {
        if (gen === refreshGenRef.current) setTopic(null);
      });
  }, [topicId]);

  useEffect(() => {
    refresh();
    getMyModeratorFlags().then(setModerator);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setIsSignedIn(Boolean(user)));
  }, [refresh]);

  // deadlinePassed sadece render anında hesaplanıyordu -- sayfa açık
  // kalıp itiraz penceresi kapanınca, herhangi bir refresh olmadan
  // "Yayınla" butonu otomatik aktifleşmiyordu. Periyodik bir tick ile
  // yeniden render'ı zorluyoruz.
  const [, setDeadlineTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setDeadlineTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  if (topic === undefined) {
    return (
      <div className="h-64 animate-pulse rounded-3xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
    );
  }

  if (topic === null) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-black/15 py-16 text-center dark:border-white/15">
        <p className="font-sans text-base font-semibold text-black dark:text-white">
          Konu bulunamadı
        </p>
      </div>
    );
  }

  const deadlinePassed =
    topic.article != null && new Date(topic.article.objectionDeadline) < new Date();

  const handleReply = async () => {
    if (!reply.trim()) return;
    setReplySubmitting(true);
    setReplyError("");
    try {
      await postMessage(topicId, reply.trim());
      setReply("");
      refresh();
    } catch {
      setReplyError("Yanıt gönderilemedi. Giriş yapmış olduğundan emin ol.");
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleObjection = async () => {
    if (!objection.trim() || !topic.article) return;
    setObjectionSubmitting(true);
    setObjectionError("");
    try {
      await postObjection(topic.article.id, objection.trim());
      setObjection("");
      setObjectionSent(true);
    } catch {
      setObjectionError("İtiraz gönderilemedi.");
    } finally {
      setObjectionSubmitting(false);
    }
  };

  const handlePackage = async () => {
    setPackaging(true);
    setPackagingError("");
    try {
      const res = await fetch("/api/topluluk/paketle", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topicId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Paketleme başarısız.");
      refresh();
    } catch (err) {
      setPackagingError(err instanceof Error ? err.message : "Paketleme başarısız.");
    } finally {
      setPackaging(false);
    }
  };

  const handleFinalize = async () => {
    if (!topic.article) return;
    setFinalizing(true);
    setFinalizeError("");
    try {
      await finalizeArticle(topic.article.id, topicId);
      refresh();
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Yayınlanamadı.";
      setFinalizeError(message);
    } finally {
      setFinalizing(false);
    }
  };

  const loadObjections = () => {
    if (!topic.article) return;
    listObjections(topic.article.id).then(setObjections);
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-black/5 px-2.5 py-1 font-semibold text-black/60 dark:bg-white/10 dark:text-white/60">
            {topic.category}
          </span>
          <span className="opacity-40">·</span>
          <span className="text-emerald-600 dark:text-emerald-400">
            {STATUS_LABEL[topic.status]}
          </span>
        </div>
        <h1 className="font-sans text-2xl font-bold text-black dark:text-white sm:text-3xl">
          {topic.title}
        </h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          {topic.authorUsername} · {formatDate(topic.createdAt)}
        </p>
      </header>

      {topic.article && (
        <section className="flex flex-col gap-4 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <h2 className="font-sans text-lg font-bold text-black dark:text-white">
            Kalıcı Özet
          </h2>
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-black/80 dark:text-white/80">
            {topic.article.content.split("\n").filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {topic.article.contributors.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-emerald-500/20 pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-black/40 dark:text-white/40">
                Katkı Sağlayanlar
              </h3>
              <ol className="flex flex-col gap-1.5">
                {topic.article.contributors.map((c) => (
                  <li key={c.userId} className="flex items-center gap-2 text-sm">
                    <span className="w-5 shrink-0 text-right font-mono text-xs text-black/40 dark:text-white/40">
                      {c.rank}
                    </span>
                    <Avatar name={c.username} />
                    <span className="font-semibold text-black dark:text-white">
                      {c.username}
                    </span>
                    {c.isFirst && (
                      <span
                        title="Kalıcı ilk fikri getirdi"
                        className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400"
                      >
                        ★ İlk Fikir
                      </span>
                    )}
                    <span className="text-black/50 dark:text-white/50">{c.note}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {topic.status === "pending_objection" && !deadlinePassed && (
            <div className="flex flex-col gap-2 border-t border-emerald-500/20 pt-4">
              <p className="text-xs text-black/50 dark:text-white/50">
                İtiraz penceresi {formatDate(topic.article.objectionDeadline)} tarihine
                kadar açık.
              </p>
              {isSignedIn ? (
                objectionSent ? (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    İtirazın alındı.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={objection}
                      onChange={(e) => setObjection(e.target.value)}
                      rows={2}
                      placeholder="Bu özette düzeltilmesi gereken bir şey mi var?"
                      className="resize-none rounded-xl border border-black/10 bg-white/50 px-3 py-2 text-sm text-black outline-none backdrop-blur-sm transition focus:border-black/30 dark:border-white/10 dark:bg-black/30 dark:text-white dark:focus:border-white/30"
                    />
                    <button
                      type="button"
                      onClick={handleObjection}
                      disabled={!objection.trim() || objectionSubmitting}
                      className="self-start rounded-full border border-black/15 px-4 py-2 text-xs font-semibold text-black transition hover:bg-black/5 disabled:opacity-50 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
                    >
                      İtiraz Gönder
                    </button>
                    {objectionError && (
                      <p className="text-xs text-rose-600 dark:text-rose-400">
                        {objectionError}
                      </p>
                    )}
                  </div>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => signInWithGoogle(pathname ?? "/")}
                  className="self-start text-xs font-medium underline underline-offset-4"
                >
                  İtiraz etmek için giriş yap
                </button>
              )}
            </div>
          )}

          {moderator.canCurate && topic.status === "pending_objection" && (
            <div className="flex flex-wrap items-center gap-3 border-t border-emerald-500/20 pt-4">
              <button
                type="button"
                onClick={loadObjections}
                className="text-xs font-medium underline underline-offset-4"
              >
                İtirazları Gör
              </button>
              <button
                type="button"
                onClick={handleFinalize}
                disabled={!deadlinePassed || finalizing}
                title={
                  deadlinePassed ? "" : "İtiraz penceresi kapanmadan yayınlanamaz."
                }
                className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                {finalizing ? "Yayınlanıyor…" : "Yayınla (Kalıcı Yap)"}
              </button>
              {finalizeError && (
                <p className="text-xs text-rose-600 dark:text-rose-400">
                  {finalizeError}
                </p>
              )}
            </div>
          )}

          {objections && (
            <div className="flex flex-col gap-2 border-t border-emerald-500/20 pt-4">
              {objections.length === 0 ? (
                <p className="text-xs text-black/50 dark:text-white/50">
                  Henüz itiraz yok.
                </p>
              ) : (
                objections.map((o) => (
                  <div key={o.id} className="text-xs">
                    <span className="font-semibold text-black dark:text-white">
                      {o.username}
                    </span>{" "}
                    <span className="text-black/60 dark:text-white/60">{o.body}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      )}

      {moderator.canCurate && topic.status === "open" && (
        <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-black/15 p-4 dark:border-white/15">
          <p className="text-xs text-black/60 dark:text-white/60">
            Moderatör: bu tartışmayı yapay zekaya paketletip kalıcı bir özet
            oluşturabilirsin.
          </p>
          <button
            type="button"
            onClick={handlePackage}
            disabled={packaging}
            className="self-start rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            {packaging ? "Paketleniyor…" : "AI ile Paketle"}
          </button>
          {packagingError && (
            <p className="text-xs text-rose-600 dark:text-rose-400">{packagingError}</p>
          )}
        </div>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-lg font-bold text-black dark:text-white">
          Ham Tartışma
        </h2>
        <div className="flex flex-col gap-4">
          {topic.messages.map((m) => (
            <div key={m.id} className="flex gap-3">
              <Avatar name={m.authorUsername} />
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-black dark:text-white">
                    {m.authorUsername}
                  </span>
                  <span className="text-xs text-black/40 dark:text-white/40">
                    {formatDate(m.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-black/80 dark:text-white/80">{m.body}</p>
              </div>
            </div>
          ))}
        </div>

        {topic.status === "open" &&
          (isSignedIn ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
                placeholder="Bir şeyler yaz…"
                className="resize-none rounded-xl border border-black/10 bg-white/50 px-3 py-2 text-sm text-black outline-none backdrop-blur-sm transition focus:border-black/30 dark:border-white/10 dark:bg-black/30 dark:text-white dark:focus:border-white/30"
              />
              <button
                type="button"
                onClick={handleReply}
                disabled={!reply.trim() || replySubmitting}
                className="self-start rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                {replySubmitting ? "Gönderiliyor…" : "Yanıtla"}
              </button>
              {replyError && (
                <p className="text-xs text-rose-600 dark:text-rose-400">{replyError}</p>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => signInWithGoogle(pathname ?? "/")}
              className="self-start rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-black/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
            >
              Yanıtlamak için giriş yap
            </button>
          ))}

        {topic.status !== "open" && (
          <p className="text-xs text-black/40 dark:text-white/40">
            Bu konu paketlendiği için ham tartışmaya yeni mesaj eklenemiyor.
          </p>
        )}
      </section>
    </div>
  );
}
