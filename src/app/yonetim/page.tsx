"use client";

import { useEffect, useState } from "react";
import type { ManagedUser } from "@/app/lib/users";
import type { ModeratorSession, ModeratorTab } from "@/app/lib/permissions";
import HillsBackground from "../hills-background";
import Watermark from "../watermark";

const permissionTabs: { id: ModeratorTab; label: string }[] = [
  { id: "cards", label: "Bilgi Kartları" },
  { id: "links", label: "Footer / Menü Linkleri" },
];

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

function formatProvider(provider: string): string {
  if (provider === "google") return "Google";
  if (provider === "azure") return "Microsoft";
  return provider;
}

export default function YonetimPage() {
  const [owner, setOwner] = useState<ModeratorSession | undefined>(undefined);
  const [users, setUsers] = useState<ManagedUser[] | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then(setOwner);
  }, []);

  if (!users || owner === undefined) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden font-sans text-black dark:text-white">
        <HillsBackground />
        <p className="relative z-10">Yükleniyor...</p>
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden font-sans text-black dark:text-white">
        <HillsBackground />
        <p className="relative z-10">
          Bu sayfayı görüntülemek için giriş yapmalısın.
        </p>
      </div>
    );
  }

  const save = async () => {
    setStatus("Kaydediliyor...");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(users),
    });
    setStatus(res.ok ? "Kaydedildi ✓" : "Hata oluştu");
  };

  const togglePermission = (userId: string, tab: ModeratorTab) => {
    setUsers(
      users.map((u) => {
        if (u.id !== userId) return u;
        const has = u.permissions.includes(tab);
        return {
          ...u,
          permissions: has
            ? u.permissions.filter((p) => p !== tab)
            : [...u.permissions, tab],
        };
      }),
    );
  };

  const cardClass =
    "flex flex-col gap-4 rounded-3xl border border-black/10 bg-white/40 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40";

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-sans text-black dark:text-white">
      <HillsBackground />
      <Watermark text={`${owner.username} · ${owner.id}`} />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            TMP Craft <span className="font-normal opacity-50">Yönetim</span>
          </h1>
          <p className="mt-1 text-xs opacity-40">
            {owner.username} · {owner.id}
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

      <main className="relative z-10 mx-auto flex max-w-4xl flex-col gap-4 px-6 pb-24 sm:px-10">
        {users.map((user) => (
          <div key={user.id} className={cardClass}>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/10 font-bold dark:bg-white/10">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- external OAuth avatar URL
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{initials(user.username)}</span>
                )}
              </div>

              <div className="flex-1">
                <p className="font-bold">{user.username}</p>
                <p className="text-xs opacity-50">{user.id}</p>
              </div>

              <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium dark:border-white/10">
                {formatProvider(user.provider)} ile giriş
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <p>
                <span className="opacity-50">Cihaz: </span>
                {user.device}
              </p>
              <p>
                <span className="opacity-50">Katıldı: </span>
                {formatDateTime(user.joinedAt)}
              </p>
              <p className="sm:col-span-2">
                <span className="opacity-50">Son değişiklik: </span>
                {formatDateTime(user.lastActivity.at)} —{" "}
                {user.lastActivity.change}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                Yetkiler
              </p>
              <div className="flex flex-wrap gap-2">
                {permissionTabs.map((tab) => {
                  const active = user.permissions.includes(tab.id);
                  return (
                    <button
                      key={tab.id}
                      onClick={() => togglePermission(user.id, tab.id)}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : "border border-black/10 bg-white/40 dark:border-white/10 dark:bg-black/30"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
