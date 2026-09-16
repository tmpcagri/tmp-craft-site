import HillsBackground from "../hills-background";
import { getSiteContent } from "../lib/content";
import { createClient } from "../lib/supabase/server";

const PREFILLED_SUBJECT = "TMP Craft — Hesap Askıya Alma İtirazı";
const PREFILLED_MESSAGE =
  "Merhaba, hesabımın askıya alınmasının bir hata olduğunu düşünüyorum. ";

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (date.getUTCFullYear() >= 9999) return "süresiz";
  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function YasakliPage() {
  const { email } = getSiteContent().contact;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let bannedUntil: string | null = null;
  let banReason: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("banned_until, ban_reason")
      .eq("id", user.id)
      .single();
    bannedUntil = profile?.banned_until ?? null;
    banReason = profile?.ban_reason ?? null;
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden font-sans text-black dark:text-white">
      <HillsBackground />
      <div className="relative z-10 max-w-md px-6 text-center">
        <p className="font-mono text-sm tracking-[0.3em] text-red-500">
          HESAP ASKIYA ALINDI
        </p>
        <h1 className="mt-4 text-3xl font-bold">Erişimin kısıtlandı</h1>
        {bannedUntil && (
          <p className="mt-4 text-black/70 dark:text-white/70">
            <span className="font-semibold">Bitiş:</span>{" "}
            {formatDate(bannedUntil)}
          </p>
        )}
        {banReason && (
          <p className="mt-2 text-black/70 dark:text-white/70">
            <span className="font-semibold">Sebep:</span> {banReason}
          </p>
        )}
        <p className="mt-6 text-sm text-black/60 dark:text-white/60">
          Bunun bir hata olduğunu düşünüyorsan{" "}
          {email ? (
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(PREFILLED_SUBJECT)}&body=${encodeURIComponent(PREFILLED_MESSAGE)}`}
              className="font-semibold text-emerald-600 underline underline-offset-4 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              bize e-posta atabilirsin
            </a>
          ) : (
            "bize İletişim sayfasından ulaşabilirsin"
          )}
          .
        </p>
      </div>
    </div>
  );
}
