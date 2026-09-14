"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { createClient } from "./lib/supabase/client";
import { useFocusTrap } from "./lib/use-focus-trap";

const USERNAME_PATTERN = /^[A-Za-z0-9ığüşöçİĞÜŞÖÇ_]{3,20}$/;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR");
}

// Erkekse mavi->sarı, kadınsa pembe->sarı, "diğer" seçilirse mor->fuşya
// gradyan çerçeve; hiç belirtilmemişse nötr gri. Sadece dekoratif --
// kimliği ele vermez, profil kartına küçük bir kişisellik katar.
function ringClass(gender: string): string {
  if (gender === "male") return "from-blue-500 to-yellow-400";
  if (gender === "female") return "from-rose-500 to-yellow-400";
  if (gender === "other") return "from-violet-500 to-fuchsia-400";
  return "from-black/15 to-black/15 dark:from-white/20 dark:to-white/20";
}

function GenderBadge({ gender }: { gender: string }) {
  if (gender === "male") {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white shadow">
        ♂
      </span>
    );
  }
  if (gender === "female") {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-sm font-bold text-white shadow">
        ♀
      </span>
    );
  }
  return null;
}

export default function EditProfileModal({
  avatarUrl,
  onClose,
  onSaved,
}: {
  avatarUrl?: string | null;
  onClose: () => void;
  onSaved?: (username: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [usernameChangedAt, setUsernameChangedAt] = useState<string | null>(null);
  const [birthDateChangedAt, setBirthDateChangedAt] = useState<string | null>(null);
  const [genderChangeCount, setGenderChangeCount] = useState(0);
  const [status, setStatus] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(dialogRef, true, onClose);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select(
          "username, birth_date, gender, username_changed_at, birth_date_changed_at, gender_change_count",
        )
        .eq("id", user.id)
        .single();

      if (data) {
        setUsername(data.username ?? "");
        setBirthDate(data.birth_date ?? "");
        setGender(data.gender ?? "");
        setUsernameChangedAt(data.username_changed_at ?? null);
        setBirthDateChangedAt(data.birth_date_changed_at ?? null);
        setGenderChangeCount(data.gender_change_count ?? 0);
      }
      setLoading(false);
    })();
  }, []);

  // Kilit durumları -- kullanıcı adı 3 ayda, doğum tarihi yılda bir
  // değişebilir; cinsiyet ilk seçimden sonra sadece bir kez düzeltilebilir.
  // Sunucudaki trigger (0016 migration) aynı kuralları asıl güvenlik
  // katmanı olarak zaten uyguluyor -- burası sadece hızlı/dostane uyarı.
  const usernameLock = useMemo(() => {
    if (!usernameChangedAt) return null;
    const unlockAt = new Date(usernameChangedAt);
    unlockAt.setMonth(unlockAt.getMonth() + 3);
    return unlockAt > new Date() ? unlockAt : null;
  }, [usernameChangedAt]);

  const birthDateLock = useMemo(() => {
    if (!birthDate || !birthDateChangedAt) return null;
    const unlockAt = new Date(birthDateChangedAt);
    unlockAt.setFullYear(unlockAt.getFullYear() + 1);
    return unlockAt > new Date() ? unlockAt : null;
  }, [birthDate, birthDateChangedAt]);

  const genderLocked = gender !== "" && genderChangeCount >= 1;

  const age = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const beforeBirthdayThisYear =
      now.getMonth() < birth.getMonth() ||
      (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
    if (beforeBirthdayThisYear) years--;
    return years;
  }, [birthDate]);

  const save = async () => {
    const trimmed = username.trim();
    if (!USERNAME_PATTERN.test(trimmed)) {
      setStatus(
        "Kullanıcı adı 3-20 karakter olmalı, sadece harf/rakam/alt çizgi içerebilir",
      );
      return;
    }

    setStatus("Kaydediliyor...");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        username: trimmed,
        birth_date: birthDate || null,
        gender: gender || null,
      })
      .eq("id", user.id);

    if (error) {
      setStatus(error.code === "23505" ? "Bu kullanıcı adı zaten alınmış" : error.message);
    } else {
      setStatus("Kaydedildi ✓");
      onSaved?.(trimmed);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-black/10 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-black"
      >
        <button
          onClick={onClose}
          aria-label="Kapat"
          className="float-right text-black/60 transition hover:text-black dark:text-white/60 dark:hover:text-white"
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-2 pt-1">
          <div className={`rounded-full bg-gradient-to-br p-1 ${ringClass(gender)}`}>
            <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- external Google avatar URL
                <img
                  src={avatarUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </span>
          </div>
          <GenderBadge gender={gender} />
          <h3
            id="edit-profile-title"
            className="mt-1 font-sans text-lg font-bold text-black dark:text-white"
          >
            Profili Düzenle
          </h3>
          {age !== null && (
            <p className="text-xs font-medium opacity-60">{age} yaşında</p>
          )}
        </div>

        {loading ? (
          <p className="mt-4 text-sm opacity-60">Yükleniyor...</p>
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm text-black dark:text-white">
              Kullanıcı Adı
              <input
                value={username}
                maxLength={20}
                disabled={Boolean(usernameLock)}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/[^A-Za-z0-9ığüşöçİĞÜŞÖÇ_]/g, ""))
                }
                className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none disabled:opacity-50 dark:border-white/10"
              />
              <span className="text-xs opacity-50">
                {usernameLock
                  ? `Sonraki değişiklik hakkın: ${formatDate(usernameLock.toISOString())}`
                  : "3-20 karakter, sadece harf/rakam/alt çizgi. Değiştirdikten sonra 3 ay kilitlenir."}
              </span>
            </label>
            <label className="flex flex-col gap-1 text-sm text-black dark:text-white">
              Doğum Tarihi
              <input
                type="date"
                value={birthDate}
                disabled={Boolean(birthDateLock)}
                onChange={(e) => setBirthDate(e.target.value)}
                className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none disabled:opacity-50 dark:border-white/10"
              />
              <span className="text-xs opacity-50">
                {birthDateLock
                  ? `Sonraki değişiklik hakkın: ${formatDate(birthDateLock.toISOString())}`
                  : "Yılda bir değiştirebilirsin."}
              </span>
            </label>
            <label className="flex flex-col gap-1 text-sm text-black dark:text-white">
              Cinsiyet
              <select
                value={gender}
                disabled={genderLocked}
                onChange={(e) => setGender(e.target.value)}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 outline-none disabled:opacity-50 dark:border-white/10 dark:bg-black"
              >
                <option value="">Belirtmek istemiyorum</option>
                <option value="female">Kadın</option>
                <option value="male">Erkek</option>
                <option value="other">Diğer</option>
              </select>
              <span className="text-xs opacity-50">
                {genderLocked
                  ? "Cinsiyet bilgisini sadece bir kez değiştirebilirsin, bu hakkını kullanmışsın."
                  : "İlk seçimden sonra sadece bir kez düzeltebilirsin."}
              </span>
            </label>

            <div className="mt-2 flex items-center justify-between">
              {status && <p className="text-xs opacity-60">{status}</p>}
              <button
                onClick={save}
                className="ml-auto rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                Kaydet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
