"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { signInWithGoogle } from "../../lib/auth-client";
import {
  canModerateModPackageComments,
  deleteModPackageComment,
  listModPackageComments,
  postModPackageComment,
  type ModPackageComment,
} from "../../lib/mod-package-comments";
import { createClient } from "../../lib/supabase/client";

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

export default function ModPaketiComments({ slug }: { slug: string }) {
  const pathname = usePathname();
  const [comments, setComments] = useState<ModPackageComment[] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [canModerate, setCanModerate] = useState(false);

  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // getTopic()'teki refreshGenRef ile aynı desen -- art arda tetiklenen
  // refresh()'ler ağdan sırasız dönerse eski yanıt yeni state'in üzerine
  // yazmasın diye.
  const refreshGenRef = useRef(0);

  const refresh = useCallback(() => {
    const gen = ++refreshGenRef.current;
    listModPackageComments(slug)
      .then((data) => {
        if (gen === refreshGenRef.current) setComments(data);
      })
      .catch(() => {
        if (gen === refreshGenRef.current) setComments([]);
      });
  }, [slug]);

  useEffect(() => {
    refresh();
    canModerateModPackageComments().then(setCanModerate);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUserId(user?.id ?? null));
  }, [refresh]);

  const handleSubmit = async () => {
    if (!body.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await postModPackageComment(slug, body.trim());
      setBody("");
      refresh();
    } catch {
      setError("Yorum gönderilemedi. Giriş yapmış olduğundan emin ol.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yorum kalıcı olarak silinsin mi?")) return;
    await deleteModPackageComment(id);
    refresh();
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-sans text-lg font-bold text-black dark:text-white">
        Yorumlar {comments && comments.length > 0 ? `(${comments.length})` : ""}
      </h2>

      {comments === null ? (
        <div className="h-24 animate-pulse rounded-2xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
      ) : comments.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">
          Henüz yorum yok. İlk yorumu sen yaz.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar name={c.authorUsername} />
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-black dark:text-white">
                    {c.authorUsername}
                  </span>
                  <span className="text-xs text-black/40 dark:text-white/40">
                    {formatDate(c.createdAt)}
                  </span>
                  {(canModerate || c.authorId === userId) && (
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="ml-auto text-xs font-medium text-black/40 hover:text-red-600 dark:text-white/40 dark:hover:text-red-400"
                    >
                      Sil
                    </button>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-sm text-black/80 dark:text-white/80">
                  {c.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {userId ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Bir şeyler yaz…"
            className="resize-none rounded-xl border border-black/10 bg-white/50 px-3 py-2 text-sm text-black outline-none backdrop-blur-sm transition focus:border-black/30 dark:border-white/10 dark:bg-black/30 dark:text-white dark:focus:border-white/30"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!body.trim() || submitting}
            className="self-start rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            {submitting ? "Gönderiliyor…" : "Yorum Yap"}
          </button>
          {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => signInWithGoogle(pathname ?? "/")}
          className="self-start rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-black/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
        >
          Yorum yapmak için giriş yap
        </button>
      )}
    </section>
  );
}
