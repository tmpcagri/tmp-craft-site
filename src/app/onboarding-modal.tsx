"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { createClient } from "./lib/supabase/client";
import { useFocusTrap } from "./lib/use-focus-trap";

// İlk Google girişinden sonra, profilde doğum tarihi hâlâ boşsa gösterilir
// -- yaş kısıtlı alanlar ve yaşa göre içerik için kaydı en baştan alıyoruz.
// Kapatma (✕) sadece bu oturum için erteler; doğum tarihi boş kaldığı
// sürece bir sonraki girişte tekrar sorulur.
export default function OnboardingModal({ onDone }: { onDone: () => void }) {
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(dialogRef, true, onDone);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const save = async () => {
    if (!birthDate) {
      setStatus("Doğum tarihi gerekli");
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
      .update({ birth_date: birthDate, gender: gender || null })
      .eq("id", user.id);

    if (error) {
      setStatus(error.message);
      return;
    }
    onDone();
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        tabIndex={-1}
        className="w-full max-w-sm rounded-3xl border border-black/10 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-black"
      >
        <button
          onClick={onDone}
          aria-label="Şimdilik geç"
          className="float-right text-black/40 transition hover:text-black dark:text-white/40 dark:hover:text-white"
        >
          ✕
        </button>
        <h3 id="onboarding-title" className="font-sans text-lg font-bold text-black dark:text-white">
          Hesabını Tamamla
        </h3>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Yaşa uygun içerik gösterebilmemiz için doğum tarihini almamız gerekiyor.
        </p>

        <div className="mt-4 flex flex-col gap-3">
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
            Cinsiyet <span className="opacity-50">(istersen boş bırak)</span>
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
              Kaydet ve Devam Et
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
