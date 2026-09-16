"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { signInWithGoogle, signInWithPassword } from "../lib/auth-client";
import { createClient } from "../lib/supabase/client";
import Logo from "../logo";
import { GoogleIcon } from "../provider-icons";

// Bilerek kart/container yok -- logo, başlık, form, buton tek kolonda alt
// alta, sitenin geri kalanıyla aynı düz bg-white/dark:bg-black zemin
// üzerinde. Önceki tasarım (HillsBackground + karartma + cam efektli kart)
// sitenin geri kalanından kopuk, hep-koyu bir "ada" gibiydi.
export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    const { error } = await signInWithPassword(email, password);
    if (error) {
      setStatus(
        error.message === "Invalid login credentials"
          ? "E-posta veya şifre hatalı"
          : error.message,
      );
      setLoading(false);
      return;
    }
    // Google callback'teki aynı "ilk giriş" mantığı -- doğum tarihi boşsa
    // profiline gönder, OnboardingModal zaten üstünde açılacak.
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: profile } = user
      ? await supabase.from("profiles").select("birth_date").eq("id", user.id).single()
      : { data: null };

    router.push(profile && !profile.birth_date ? "/hesap" : "/");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 py-16 dark:bg-black">
      <div className="flex w-full max-w-sm flex-col items-center gap-1 text-center">
        <Link href="/" className="text-black dark:text-white">
          <Logo />
        </Link>
        <h1 className="mt-5 font-sans text-2xl font-bold text-black dark:text-white">
          Tekrar Hoş Geldin
        </h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Devam etmek için giriş yap
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 flex w-full max-w-sm flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm text-black dark:text-white">
          E-posta
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@eposta.com"
            className="rounded-xl border border-black/10 bg-transparent px-3 py-2.5 outline-none placeholder:opacity-40 dark:border-white/10"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-black dark:text-white">
          Şifre
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="rounded-xl border border-black/10 bg-transparent px-3 py-2.5 outline-none placeholder:opacity-40 dark:border-white/10"
          />
        </label>

        {status && <p className="text-xs text-red-600 dark:text-red-400">{status}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <div className="my-5 flex w-full max-w-sm items-center gap-3 text-xs text-black/40 dark:text-white/40">
        <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        veya
        <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
      </div>

      <button
        onClick={() => signInWithGoogle()}
        className="flex w-full max-w-sm items-center justify-center gap-3 rounded-full border border-black/10 px-4 py-2.5 text-sm font-medium text-black transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
      >
        <GoogleIcon />
        Google ile Giriş Yap
      </button>
    </div>
  );
}
