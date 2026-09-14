"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import BackgroundTexture from "../background-texture";
import HillsBackground from "../hills-background";
import { signInWithGoogle, signUpWithPassword } from "../lib/auth-client";
import { InlineLogo } from "../logo";
import { GoogleIcon } from "../provider-icons";

export default function KayitPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setStatus("Şifre en az 6 karakter olmalı");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("Şifreler eşleşmiyor");
      return;
    }
    setLoading(true);
    setStatus("");
    const { error } = await signUpWithPassword(email, password);
    if (error) {
      setStatus(
        error.message === "User already registered"
          ? "Bu e-posta zaten kayıtlı"
          : error.message,
      );
      setLoading(false);
      return;
    }
    setDone(true);
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-16">
      <HillsBackground />
      <BackgroundTexture />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/55"
      />

      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/15 bg-black/50 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col items-center gap-1 text-center">
          <Link href="/" className="text-white">
            <InlineLogo />
          </Link>
          <h1 className="mt-3 font-sans text-2xl font-bold text-white">
            Aramıza Katıl
          </h1>
          <p className="text-sm text-white/60">
            Hesap oluşturup topluluğa katıl
          </p>
        </div>

        {done ? (
          <div className="mt-6 flex flex-col items-center gap-2 text-center">
            <p className="font-sans text-sm font-semibold text-white">
              Kayıt e-postası gönderildi ✓
            </p>
            <p className="text-sm text-white/60">
              Hesabını doğrulamak için {email} adresine gelen bağlantıya tıkla.
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm text-white">
                E-posta
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@eposta.com"
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none placeholder:text-white/30 focus:border-white/30"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-white">
                Şifre
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none placeholder:text-white/30 focus:border-white/30"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-white">
                Şifre (Tekrar)
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none placeholder:text-white/30 focus:border-white/30"
                />
              </label>

              {status && <p className="text-xs text-red-400">{status}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
              >
                {loading ? "Kaydediliyor..." : "Kayıt Ol"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-white/40">
              <span className="h-px flex-1 bg-white/15" />
              veya
              <span className="h-px flex-1 bg-white/15" />
            </div>

            <button
              onClick={() => signInWithGoogle()}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <GoogleIcon />
              Google ile Devam Et
            </button>
          </>
        )}

        <p className="mt-6 text-center text-sm text-white/60">
          Zaten hesabın var mı?{" "}
          <Link
            href="/giris"
            className="font-semibold text-emerald-400 hover:underline"
          >
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
