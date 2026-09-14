"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import HillsBackground from "../hills-background";
import Logo from "../logo";
import {
  getThread,
  listConversations,
  markAsRead,
  searchUsers,
  sendMessage,
  type Conversation,
  type SearchedUser,
  type ThreadMessage,
} from "../lib/messages";
import { createClient } from "../lib/supabase/client";

function Avatar({ url, name }: { url: string; name: string }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/5 text-sm font-semibold text-black dark:bg-white/10 dark:text-white">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- external Google avatar URL
        <img
          src={url}
          alt={name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />
      ) : (
        name.slice(0, 1).toUpperCase()
      )}
    </span>
  );
}

function formatTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
}

type PartialConversation = {
  userId: string;
  username: string;
  avatarUrl: string;
};

export default function MesajlarPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | PartialConversation | null>(
    null,
  );
  const [thread, setThread] = useState<ThreadMessage[]>([]);
  const [showThreadOnMobile, setShowThreadOnMobile] = useState(false);

  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);

  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const threadEndRef = useRef<HTMLDivElement>(null);

  // Bumped whenever a thread-affecting action starts (opening a different
  // conversation, sending a message) so an in-flight getThread() response
  // from *before* that action can recognize it's stale and skip its
  // setThread -- otherwise a slow poll response can either (a) paint the
  // previously-selected thread's messages after switching conversations,
  // or (b) wipe out a just-sent message that the poll's snapshot predates.
  const threadGenRef = useRef(0);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id ?? null);
      setLoadingUser(false);
    });
  }, []);

  const refreshConversations = useCallback(() => {
    listConversations().then(setConversations);
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
    refreshConversations();
    const interval = setInterval(refreshConversations, 10000);
    return () => clearInterval(interval);
  }, [currentUserId, refreshConversations]);

  const openThreadFor = useCallback(
    async (partial: PartialConversation) => {
      threadGenRef.current += 1;
      const gen = threadGenRef.current;

      const existing = conversations.find((c) => c.userId === partial.userId);
      setSelected(existing ?? partial);
      setShowThreadOnMobile(true);
      setSearch("");
      setSearchResults([]);
      setSendError("");

      const msgs = await getThread(partial.userId);
      if (threadGenRef.current !== gen) return;
      setThread(msgs);

      if (existing && existing.unreadCount > 0) {
        await markAsRead(partial.userId);
        if (threadGenRef.current !== gen) return;
        setConversations((prev) =>
          prev.map((c) =>
            c.userId === partial.userId ? { ...c, unreadCount: 0 } : c,
          ),
        );
      }
    },
    [conversations],
  );

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: "end" });
  }, [thread]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (value.trim()) {
      setSearching(true);
    } else {
      setSearching(false);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const trimmed = search.trim();
    if (!trimmed) return;
    const handle = setTimeout(() => {
      searchUsers(trimmed)
        .then(setSearchResults)
        .finally(() => setSearching(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [search]);

  useEffect(() => {
    if (!selected) return;
    const interval = setInterval(async () => {
      const gen = threadGenRef.current;
      const msgs = await getThread(selected.userId);
      if (threadGenRef.current !== gen) return;
      setThread(msgs);
      const hasUnread = msgs.some(
        (m) => m.receiverId === currentUserId && !m.readAt,
      );
      if (hasUnread) {
        await markAsRead(selected.userId);
        refreshConversations();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [selected, currentUserId, refreshConversations]);

  const handleSend = async () => {
    if (!selected || !messageInput.trim() || sending) return;
    setSending(true);
    setSendError("");
    const content = messageInput.trim();
    try {
      const msg = await sendMessage(selected.userId, content);
      threadGenRef.current += 1;
      setThread((prev) => [...prev, msg]);
      setMessageInput("");
      refreshConversations();
    } catch {
      setSendError("Mesaj gönderilemedi, tekrar dene.");
    } finally {
      setSending(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden font-sans text-black dark:text-white">
        <HillsBackground />
        <p className="relative z-10">Yükleniyor...</p>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden font-sans text-black dark:text-white">
        <HillsBackground />
        <p className="relative z-10">
          Bu sayfayı görüntülemek için giriş yapmalısın.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden font-sans text-black dark:text-white">
      <HillsBackground />

      <header className="relative z-10 flex shrink-0 items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Logo compact />
          <span className="font-sans text-sm font-normal opacity-50">
            Mesajlar
          </span>
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 gap-4 overflow-hidden px-6 pb-6 sm:px-10">
        <aside
          className={`w-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white/40 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40 sm:flex sm:w-80 sm:shrink-0 ${
            showThreadOnMobile ? "hidden" : "flex"
          }`}
        >
          <div className="shrink-0 border-b border-black/10 p-4 dark:border-white/10">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Kullanıcı ara..."
                className="w-full rounded-xl border border-black/10 bg-white/50 px-3 py-2 text-sm text-black outline-none backdrop-blur-sm transition focus:border-black/30 dark:border-white/10 dark:bg-black/30 dark:text-white dark:focus:border-white/30"
              />
              {search.trim() && (
                <div className="absolute left-0 right-0 z-20 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-black/10 bg-white/95 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/90">
                  {searching ? (
                    <p className="p-3 text-sm opacity-60">Aranıyor...</p>
                  ) : searchResults.length === 0 ? (
                    <p className="p-3 text-sm opacity-60">
                      Kullanıcı bulunamadı
                    </p>
                  ) : (
                    searchResults.map((u) => (
                      <button
                        key={u.id}
                        onClick={() =>
                          openThreadFor({
                            userId: u.id,
                            username: u.username,
                            avatarUrl: u.avatarUrl,
                          })
                        }
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        <Avatar url={u.avatarUrl} name={u.username} />
                        <span className="text-sm font-medium">
                          {u.username}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="p-4 text-sm opacity-60">
                Henüz bir konuşma yok. Yukarıdan bir kullanıcı ara.
              </p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.userId}
                  onClick={() =>
                    openThreadFor({
                      userId: c.userId,
                      username: c.username,
                      avatarUrl: c.avatarUrl,
                    })
                  }
                  className={`flex w-full items-center gap-3 border-b border-black/5 px-4 py-3 text-left transition hover:bg-black/5 dark:border-white/5 dark:hover:bg-white/10 ${
                    selected?.userId === c.userId
                      ? "bg-black/5 dark:bg-white/10"
                      : ""
                  }`}
                >
                  <Avatar url={c.avatarUrl} name={c.username} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">
                        {c.username}
                      </p>
                      <span className="shrink-0 text-[11px] opacity-50">
                        {formatTime(c.lastMessageAt)}
                      </span>
                    </div>
                    <p className="truncate text-xs opacity-60">
                      {c.lastMessage}
                    </p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-black px-1.5 text-[11px] font-semibold text-white dark:bg-white dark:text-black">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </aside>

        <section
          className={`min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-black/10 bg-white/40 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40 sm:flex ${
            showThreadOnMobile ? "flex" : "hidden"
          }`}
        >
          {!selected ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm opacity-60">
                Bir konuşma seç ya da yeni biri ara
              </p>
            </div>
          ) : (
            <>
              <div className="flex shrink-0 items-center gap-3 border-b border-black/10 p-4 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowThreadOnMobile(false)}
                  aria-label="Geri"
                  className="shrink-0 text-black sm:hidden dark:text-white"
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
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <Avatar url={selected.avatarUrl} name={selected.username} />
                <p className="text-sm font-semibold">{selected.username}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-2">
                  {thread.map((m) => {
                    const mine = m.senderId === currentUserId;
                    return (
                      <div
                        key={m.id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                            mine
                              ? "bg-black text-white dark:bg-white dark:text-black"
                              : "bg-black/5 text-black dark:bg-white/10 dark:text-white"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">
                            {m.content}
                          </p>
                          <p className="mt-1 text-[10px] opacity-60">
                            {formatTime(m.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={threadEndRef} />
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex shrink-0 flex-col gap-2 border-t border-black/10 p-4 dark:border-white/10"
              >
                {sendError && (
                  <p className="text-xs text-red-500">{sendError}</p>
                )}
                <div className="flex items-center gap-2">
                  <input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Mesaj yaz..."
                    className="flex-1 rounded-full border border-black/10 bg-white/50 px-4 py-2.5 text-sm text-black outline-none backdrop-blur-sm transition focus:border-black/30 dark:border-white/10 dark:bg-black/30 dark:text-white dark:focus:border-white/30"
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim() || sending}
                    className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black/80 disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-white/80"
                  >
                    Gönder
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
