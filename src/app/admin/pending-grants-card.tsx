"use client";

import { useEffect, useState } from "react";
import {
  acceptPermissionGrant,
  getMyPendingGrants,
  type PermissionGrant,
} from "@/app/lib/permission-grants";
import { TAB_LABELS } from "@/app/lib/permission-tabs";

// Owner (ya da ileride Baş Moderatör) bir moderatöre yeni bir tab
// önerdiğinde burada görünür -- kabul etmeden yetki fiilen verilmiş
// olmuyor (bkz. migration 0025). Reddetme yok, sadece pasif olarak hiç
// dokunmamak yeterli; owner isteği istediği an iptal edebiliyor.
export default function PendingGrantsCard({ onAccepted }: { onAccepted?: () => void }) {
  const [grants, setGrants] = useState<PermissionGrant[] | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    getMyPendingGrants()
      .then(setGrants)
      .catch(() => setGrants([]));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const accept = async (grantId: string) => {
    setAcceptingId(grantId);
    setError("");
    try {
      await acceptPermissionGrant(grantId);
      load();
      onAccepted?.();
    } catch {
      setError("Kabul edilemedi, tekrar dene");
    } finally {
      setAcceptingId(null);
    }
  };

  if (!grants || grants.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
        Bekleyen Yetki İstekleri
      </p>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      {grants.map((g) => (
        <div
          key={g.id}
          className="flex items-center justify-between gap-2 rounded-xl bg-white/50 px-3 py-2 dark:bg-black/30"
        >
          <span className="text-sm">{TAB_LABELS[g.tab]}</span>
          <button
            onClick={() => accept(g.id)}
            disabled={acceptingId === g.id}
            className="shrink-0 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white transition disabled:opacity-40 dark:bg-white dark:text-black"
          >
            {acceptingId === g.id ? "..." : "Kabul Et"}
          </button>
        </div>
      ))}
    </div>
  );
}
