"use client";

import { useEffect, useRef, useState } from "react";
import {
  getModChatMessages,
  sendModChatMessage,
  type ModChatMessage,
} from "@/app/lib/mod-chat";

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" }) +
        " " +
        date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

// Moderatörler arası tek grup sohbeti -- kimlik bölgesinin hemen altında.
// Şimdilik basit polling (5sn) ile güncelleniyor, realtime'a geçiş ayrı
// bir adım olarak bırakıldı.
export default function ModChatPanel({ selfId }: { selfId: string }) {
  const [messages, setMessages] = useState<ModChatMessage[] | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      getModChatMessages()
        .then((msgs) => {
          if (!cancelled) setMessages(msgs);
        })
        .catch(() => {
          if (!cancelled) setError("Sohbet yüklenemedi");
        });
    };

    load();
    const interval = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const send = async () => {
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    setError("");
    try {
      await sendModChatMessage(content);
      setDraft("");
      const msgs = await getModChatMessages();
      setMessages(msgs);
    } catch {
      setError("Gönderilemedi, tekrar dene");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
        Moderatör Sohbeti
      </p>

      <div
        ref={listRef}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-2xl bg-black/5 p-3 dark:bg-white/5"
      >
        {messages === null ? (
          <p className="text-xs text-black/50 dark:text-white/50">Yükleniyor...</p>
        ) : messages.length === 0 ? (
          <p className="text-xs text-black/50 dark:text-white/50">
            Henüz mesaj yok.
          </p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="flex items-start gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/10 text-[10px] font-semibold dark:bg-white/10">
                {m.senderAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- dış OAuth avatar URL'i
                  <img
                    src={m.senderAvatarUrl}
                    alt={m.senderUsername}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  m.senderUsername.slice(0, 1).toUpperCase()
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-baseline gap-1.5">
                  <span
                    className={`truncate text-xs font-semibold ${
                      m.senderId === selfId ? "text-black dark:text-white" : ""
                    }`}
                  >
                    {m.senderUsername}
                  </span>
                  <span className="shrink-0 text-[10px] text-black/40 dark:text-white/40">
                    {formatTime(m.createdAt)}
                  </span>
                </p>
                <p className="break-words text-sm">{m.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Mesaj yaz..."
          className="min-w-0 flex-1 rounded-full border border-black/10 bg-white/40 px-3 py-1.5 text-sm outline-none dark:border-white/10 dark:bg-black/30"
        />
        <button
          onClick={send}
          disabled={sending || !draft.trim()}
          className="rounded-full bg-black px-3.5 py-1.5 text-sm font-medium text-white transition disabled:opacity-40 dark:bg-white dark:text-black"
        >
          Gönder
        </button>
      </div>
    </div>
  );
}
