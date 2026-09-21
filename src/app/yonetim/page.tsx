"use client";

import { useEffect, useState } from "react";
import type { ManagedUser } from "@/app/lib/users";
import type { ModeratorSession, ModeratorTab } from "@/app/lib/permissions";
import {
  cancelPermissionGrant,
  createPermissionGrant,
  getAllPendingGrants,
  type PermissionGrant,
} from "@/app/lib/permission-grants";
import { ALL_MODERATOR_TABS, TAB_LABELS } from "@/app/lib/permission-tabs";
import HillsBackground from "../hills-background";
import Logo from "../logo";
import ModeratorAuthGate from "../moderator-auth-gate";
import Watermark from "../watermark";

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
  return provider;
}

const banDurationOptions: { value: string; label: string }[] = [
  { value: "1", label: "1 gün" },
  { value: "7", label: "7 gün" },
  { value: "30", label: "30 gün" },
  { value: "permanent", label: "Süresiz" },
];

function isBanned(user: ManagedUser): boolean {
  return !!user.bannedUntil && new Date(user.bannedUntil) > new Date();
}

export default function YonetimPage() {
  const [owner, setOwner] = useState<ModeratorSession | undefined>(undefined);
  const [users, setUsers] = useState<ManagedUser[] | null>(null);
  const [pendingGrants, setPendingGrants] = useState<PermissionGrant[]>([]);
  const [status, setStatus] = useState("");
  const [banDurations, setBanDurations] = useState<Record<string, string>>({});
  const [banReasons, setBanReasons] = useState<Record<string, string>>({});
  const [actionStatus, setActionStatus] = useState<Record<string, string>>({});

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

  const loadPendingGrants = () => {
    getAllPendingGrants()
      .then(setPendingGrants)
      .catch(() => {});
  };

  useEffect(loadPendingGrants, []);

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
      <ModeratorAuthGate
        message="Bu sayfayı görüntülemek için giriş yapmalısın."
        redirectTo="/yonetim"
      />
    );
  }

  if (!owner.isOwner) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden font-sans text-black dark:text-white">
        <HillsBackground />
        <p className="relative z-10 text-2xl font-bold uppercase tracking-wide text-red-500">
          Yetkiniz Bulunmamaktadır
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

  const updateRoleLabel = (userId: string, roleLabel: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, roleLabel } : u)));
  };

  // Yetki ALMA artık doğrudan olmuyor -- yeni bir tab için istek açılır,
  // hedef kullanıcı /admin'den "Kabul Et" demeden fiilen verilmez (bkz.
  // migration 0025). Yetki GERİ ALMA (zaten sahip olduğu bir tab'ı
  // kaldırmak) onay gerektirmiyor, eskisi gibi anında yerel state'te
  // değişip "Kaydet" ile kalıcılaşıyor.
  const revokePermission = (userId: string, tab: ModeratorTab) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, permissions: u.permissions.filter((p) => p !== tab) }
          : u,
      ),
    );
  };

  const requestGrant = async (userId: string, tab: ModeratorTab) => {
    try {
      await createPermissionGrant(userId, tab);
      loadPendingGrants();
    } catch {
      setActionStatus({ ...actionStatus, [userId]: "İstek gönderilemedi" });
    }
  };

  const cancelGrant = async (grantId: string, userId: string) => {
    try {
      await cancelPermissionGrant(grantId);
      loadPendingGrants();
    } catch {
      setActionStatus({ ...actionStatus, [userId]: "İptal edilemedi" });
    }
  };

  const ban = async (userId: string) => {
    const duration = banDurations[userId] ?? "7";
    const days = duration === "permanent" ? null : Number(duration);
    const reason = banReasons[userId]?.trim() || undefined;

    setActionStatus({ ...actionStatus, [userId]: "İşleniyor..." });
    const res = await fetch(`/api/users/${userId}/ban`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days, reason }),
    });

    if (res.ok) {
      const data = (await res.json()) as { bannedUntil: string };
      setUsers(
        users.map((u) =>
          u.id === userId
            ? { ...u, bannedUntil: data.bannedUntil, banReason: reason ?? null }
            : u,
        ),
      );
      setActionStatus({ ...actionStatus, [userId]: "Yasaklandı ✓" });
    } else {
      setActionStatus({ ...actionStatus, [userId]: "Hata oluştu" });
    }
  };

  const unban = async (userId: string) => {
    setActionStatus({ ...actionStatus, [userId]: "İşleniyor..." });
    const res = await fetch(`/api/users/${userId}/ban`, { method: "DELETE" });

    if (res.ok) {
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, bannedUntil: null, banReason: null } : u,
        ),
      );
      setActionStatus({ ...actionStatus, [userId]: "Yasak kaldırıldı ✓" });
    } else {
      setActionStatus({ ...actionStatus, [userId]: "Hata oluştu" });
    }
  };

  const deleteUser = async (userId: string, username: string) => {
    if (
      !window.confirm(
        `${username} kalıcı olarak silinsin mi? Bu işlem geri alınamaz.`,
      )
    ) {
      return;
    }

    setActionStatus({ ...actionStatus, [userId]: "Siliniyor..." });
    const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });

    if (res.ok) {
      setUsers(users.filter((u) => u.id !== userId));
    } else {
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setActionStatus({
        ...actionStatus,
        [userId]: data?.error ?? "Hata oluştu",
      });
    }
  };

  const cardClass =
    "flex flex-col gap-4 rounded-3xl border border-black/10 bg-white/40 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40";

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-sans text-black dark:text-white">
      <HillsBackground />
      <Watermark text={`${owner.username} · ${owner.id}`} />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <div>
          <div className="flex items-center gap-3">
            <Logo compact />
            <span className="font-sans text-sm opacity-50">Yönetim</span>
          </div>
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
                    referrerPolicy="no-referrer"
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

            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs font-semibold uppercase tracking-wide opacity-50">
                Rol (opsiyonel, /admin&apos;de gösterilir)
              </span>
              <input
                value={user.roleLabel}
                onChange={(e) => updateRoleLabel(user.id, e.target.value)}
                placeholder="ör. Mod Ekleyicisi, Topluluk Yöneticisi"
                className="rounded-full border border-black/10 bg-white/40 px-3 py-1.5 text-sm dark:border-white/10 dark:bg-black/30"
              />
            </label>

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
              <p className="-mt-1 text-xs opacity-50">
                Sahip olduğu bir yetkiye tıklamak anında kaldırır (Kaydet ile
                kalıcılaşır). Sahip olmadığı bir yetkiye tıklamak, kabul etmesi
                gereken bir istek açar (aşağıda &quot;bekliyor&quot;) --
                fiilen hemen verilmez.
              </p>
              {user.provider !== "email" && (
                <p className="-mt-1 text-xs font-medium text-red-500">
                  Google hesabı — moderatör yetkisi verilemez (hesap çalınma
                  riski). Yetki vermek için bu kişiye e-posta/şifre hesabı
                  açman gerekiyor.
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {ALL_MODERATOR_TABS.map((tab) => {
                  const active = user.permissions.includes(tab);
                  const pendingGrant = pendingGrants.find(
                    (g) => g.targetUserId === user.id && g.tab === tab,
                  );
                  if (active) {
                    return (
                      <button
                        key={tab}
                        onClick={() => revokePermission(user.id, tab)}
                        className="rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white transition dark:bg-white dark:text-black"
                      >
                        {TAB_LABELS[tab]}
                      </button>
                    );
                  }
                  if (pendingGrant) {
                    return (
                      <button
                        key={tab}
                        onClick={() => cancelGrant(pendingGrant.id, user.id)}
                        title="İsteği iptal et"
                        className="rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-700 transition dark:text-amber-400"
                      >
                        {TAB_LABELS[tab]} (bekliyor)
                      </button>
                    );
                  }
                  if (user.provider !== "email") {
                    return (
                      <button
                        key={tab}
                        disabled
                        title="Google hesabına yetki verilemez"
                        className="cursor-not-allowed rounded-full border border-black/10 bg-white/20 px-4 py-1.5 text-xs font-semibold opacity-40 dark:border-white/10 dark:bg-black/20"
                      >
                        {TAB_LABELS[tab]}
                      </button>
                    );
                  }
                  return (
                    <button
                      key={tab}
                      onClick={() => requestGrant(user.id, tab)}
                      className="rounded-full border border-black/10 bg-white/40 px-4 py-1.5 text-xs font-semibold transition hover:bg-black/5 dark:border-white/10 dark:bg-black/30 dark:hover:bg-white/10"
                    >
                      {TAB_LABELS[tab]}
                    </button>
                  );
                })}
              </div>
            </div>

            {user.id !== owner.id && (
              <div className="flex flex-col gap-2 border-t border-black/10 pt-4 dark:border-white/10">
                <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                  Moderasyon
                </p>

                {isBanned(user) ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500">
                      Yasaklı — bitiş:{" "}
                      {new Date(user.bannedUntil!).getUTCFullYear() >= 9999
                        ? "süresiz"
                        : formatDateTime(user.bannedUntil!)}
                      {user.banReason ? ` — ${user.banReason}` : ""}
                    </span>
                    <button
                      onClick={() => unban(user.id)}
                      className="rounded-full border border-black/10 px-4 py-1.5 text-xs font-semibold transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                    >
                      Yasağı Kaldır
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={banDurations[user.id] ?? "7"}
                      onChange={(e) =>
                        setBanDurations({
                          ...banDurations,
                          [user.id]: e.target.value,
                        })
                      }
                      className="rounded-full border border-black/10 bg-white/40 px-3 py-1.5 text-xs dark:border-white/10 dark:bg-black/30"
                    >
                      {banDurationOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <input
                      value={banReasons[user.id] ?? ""}
                      onChange={(e) =>
                        setBanReasons({
                          ...banReasons,
                          [user.id]: e.target.value,
                        })
                      }
                      placeholder="Sebep (opsiyonel)"
                      className="min-w-0 flex-1 rounded-full border border-black/10 bg-white/40 px-3 py-1.5 text-xs dark:border-white/10 dark:bg-black/30"
                    />
                    <button
                      onClick={() => ban(user.id)}
                      className="rounded-full bg-red-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600"
                    >
                      Yasakla
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => deleteUser(user.id, user.username)}
                    className="text-xs font-semibold text-red-500 underline underline-offset-4 hover:opacity-70"
                  >
                    Kullanıcıyı kalıcı olarak sil
                  </button>
                  {actionStatus[user.id] && (
                    <span className="text-xs opacity-60">
                      {actionStatus[user.id]}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
