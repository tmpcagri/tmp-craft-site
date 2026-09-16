import BackButton from "../back-button";
import Footer from "../footer";
import { getCurrentUser } from "../lib/auth";
import { getSiteContent } from "../lib/content";
import Navbar from "../navbar";

// Şu an sitede kredi/mağaza sistemine bağlı gerçek bir sayfa yoktu --
// demo olarak eklendi. Ödeme altyapısı henüz yok, bu yüzden "Satın Al"
// butonları bilerek gerçek bir işlem yapmıyor, dürüst bir "Yakında"
// rozetiyle işaretli (bkz. sitedeki diğer "honest placeholder" örnekleri:
// Facebook/X/Telegram/WhatsApp sosyal medya kartları, Eğitimler bölümü).
const PACKAGES = [
  { credits: 100, price: "19,99 ₺", badge: null },
  { credits: 500, price: "79,99 ₺", badge: "En Avantajlı" },
  { credits: 1200, price: "149,99 ₺", badge: "En Popüler" },
  { credits: 2500, price: "279,99 ₺", badge: null },
] as const;

export default async function KrediPage() {
  const content = getSiteContent();
  const user = await getCurrentUser();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-black">
      <Navbar
        className="text-black dark:text-white"
        logoText={content.navbar.logoText}
        navLinks={content.footerLinks}
        user={user}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-24 pt-32 sm:px-10">
        <BackButton />
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-[0.2em] text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
          KREDİ PAKETLERİ
        </span>
        <h1 className="mt-4 font-sans text-3xl font-bold text-black dark:text-white sm:text-4xl">
          Sunucularımızı Destekle
        </h1>
        <p className="mt-2 max-w-xl text-sm text-black/60 dark:text-white/60 sm:text-base">
          Kredi paketleriyle sunucularımızda VIP rütbe ve kozmetik
          eşyalar edinirken topluluğun büyümesine katkıda bulunursun.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.credits}
              className={`relative flex flex-col gap-4 rounded-3xl border p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                pkg.badge
                  ? "border-emerald-500/40 bg-emerald-500/5 dark:border-emerald-400/40 dark:bg-emerald-400/5"
                  : "border-black/10 bg-white/40 dark:border-white/10 dark:bg-black/40"
              }`}
            >
              {pkg.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                  {pkg.badge}
                </span>
              )}

              <div className="flex flex-col items-center gap-1 pt-2 text-center">
                <span className="font-sans text-3xl font-bold text-black dark:text-white">
                  {pkg.credits.toLocaleString("tr-TR")}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
                  Kredi
                </span>
              </div>

              <p className="text-center font-sans text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {pkg.price}
              </p>

              <button
                disabled
                className="mt-auto flex items-center justify-center gap-2 rounded-full bg-black/5 px-5 py-2.5 text-sm font-semibold text-black/40 dark:bg-white/10 dark:text-white/40"
              >
                Yakında
              </button>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-black/40 dark:text-white/40">
          Ödeme altyapımız henüz aktif değil — bu sayfa yakında gerçek
          satın alma ile açılacak.
        </p>
      </main>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
