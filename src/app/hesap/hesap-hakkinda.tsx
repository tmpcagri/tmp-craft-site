"use client";

import { useEffect, useState } from "react";
import EditProfileModal from "../edit-profile-modal";
import { createClient } from "../lib/supabase/client";

const GENDER_TR: Record<string, string> = {
  male: "Erkek",
  female: "Kadın",
  other: "Diğer",
};

function calcAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const beforeBirthdayThisYear =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (beforeBirthdayThisYear) years--;
  return years;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function HesapHakkinda({
  avatarUrl,
}: {
  avatarUrl?: string | null;
}) {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [editing, setEditing] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setEmail(user.email ?? "");
      setCreatedAt(user.created_at ?? "");

      const { data } = await supabase
        .from("profiles")
        .select("username, birth_date, gender")
        .eq("id", user.id)
        .single();

      if (data) {
        setUsername(data.username ?? "");
        setBirthDate(data.birth_date ?? "");
        setGender(data.gender ?? "");
      }
      setLoading(false);
    })();
  }, [reloadKey]);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) {
        setDeleteError(body.error ?? "Hesap silinemedi");
        setDeleting(false);
        return;
      }
      const supabase = createClient();
      await supabase.auth.signOut();
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- hesap silindikten sonra tüm client state'i (RSC cache, oturum) temizlemek için tam sayfa yenilemesi gerekiyor
      location.href = "/";
    } catch {
      setDeleteError("Bağlantı hatası, tekrar dene");
      setDeleting(false);
    }
  };

  if (loading) {
    return <p className="text-sm opacity-60">Yükleniyor...</p>;
  }

  if (!email) {
    return (
      <p className="text-sm opacity-60">
        Bu sayfayı görmek için giriş yapmalısın.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-black/10 bg-white/40 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
          Hesap Bilgileri
        </p>
        <dl className="mt-3 flex flex-col gap-2.5 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="opacity-60">E-posta</dt>
            <dd className="font-medium text-black dark:text-white">{email}</dd>
          </div>
          {username && (
            <div className="flex items-center justify-between gap-4">
              <dt className="opacity-60">Kullanıcı Adı</dt>
              <dd className="font-medium text-black dark:text-white">{username}</dd>
            </div>
          )}
          {birthDate && (
            <div className="flex items-center justify-between gap-4">
              <dt className="opacity-60">Yaş</dt>
              <dd className="font-medium text-black dark:text-white">{calcAge(birthDate)}</dd>
            </div>
          )}
          {gender && GENDER_TR[gender] && (
            <div className="flex items-center justify-between gap-4">
              <dt className="opacity-60">Cinsiyet</dt>
              <dd className="font-medium text-black dark:text-white">{GENDER_TR[gender]}</dd>
            </div>
          )}
          {createdAt && (
            <div className="flex items-center justify-between gap-4">
              <dt className="opacity-60">Üyelik Tarihi</dt>
              <dd className="font-medium text-black dark:text-white">{formatDate(createdAt)}</dd>
            </div>
          )}
        </dl>

        <button
          onClick={() => setEditing(true)}
          className="mt-5 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          Profili Düzenle
        </button>
      </div>

      {/* Tehlikeli bölge -- hesap silme geri alınamaz, bu yüzden ayrı,
          belirgin şekilde kırmızı bir kutuda ve iki adımlı (buton + yazarak
          onaylama) bir akış arkasında duruyor. Yanlışlıkla tıklamayla asla
          tetiklenemez. */}
      <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
          Tehlikeli Bölge
        </p>
        <p className="mt-2 text-sm text-black/70 dark:text-white/70">
          Hesabını kalıcı olarak silersin -- tüm profil bilgilerin, kaydettiklerin
          ve topluluk katkıların geri alınamaz şekilde silinir.
        </p>

        {!deleteOpen ? (
          <button
            onClick={() => setDeleteOpen(true)}
            className="mt-4 rounded-full border border-red-500/40 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
          >
            Hesabı Sil
          </button>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <label className="flex flex-col gap-1.5 text-sm text-black dark:text-white">
              Onaylamak için <span className="font-bold">SİL</span> yaz:
              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="rounded-xl border border-red-500/30 bg-transparent px-3 py-2 outline-none"
                autoFocus
              />
            </label>
            {deleteError && (
              <p className="text-xs text-red-600 dark:text-red-400">{deleteError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={confirmText !== "SİL" || deleting}
                className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting ? "Siliniyor..." : "Kalıcı Olarak Sil"}
              </button>
              <button
                onClick={() => {
                  setDeleteOpen(false);
                  setConfirmText("");
                  setDeleteError("");
                }}
                className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
              >
                Vazgeç
              </button>
            </div>
          </div>
        )}
      </div>

      {editing && (
        <EditProfileModal
          avatarUrl={avatarUrl}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            setReloadKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}
