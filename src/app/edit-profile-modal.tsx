"use client";

import { useEffect, useState } from "react";
import { createClient } from "./lib/supabase/client";

export default function EditProfileModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved?: (username: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

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
  }, []);

  const save = async () => {
    const trimmed = username.trim();
    if (!trimmed) {
      setStatus("Kullanıcı adı boş olamaz");
      return;
    }
    if (trimmed.length > 20) {
      setStatus("Kullanıcı adı en fazla 20 karakter olabilir");
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
      setStatus(
        error.code === "23505"
          ? "Bu kullanıcı adı zaten alınmış"
          : "Hata oluştu",
      );
    } else {
      setStatus("Kaydedildi ✓");
      onSaved?.(trimmed);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-black/10 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-black"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-sans text-lg font-bold text-black dark:text-white">
            Profili Düzenle
          </h3>
          <button
            onClick={onClose}
            className="text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p className="mt-4 text-sm opacity-60">Yükleniyor...</p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm text-black dark:text-white">
              Kullanıcı Adı
              <input
                value={username}
                maxLength={20}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/[.\s]/g, ""))
                }
                className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10"
              />
              <span className="text-xs opacity-50">
                Boşluk ve nokta kullanılamaz
              </span>
            </label>
            <label className="flex flex-col gap-1 text-sm text-black dark:text-white">
              Doğum Tarihi
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-black dark:text-white">
              Cinsiyet
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 outline-none dark:border-white/10 dark:bg-black"
              >
                <option value="">Belirtmek istemiyorum</option>
                <option value="female">Kadın</option>
                <option value="male">Erkek</option>
                <option value="other">Diğer</option>
              </select>
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
    </div>
  );
}
