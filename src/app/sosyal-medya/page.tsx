import BackButton from "../back-button";
import Footer from "../footer";
import { getCurrentUser } from "../lib/auth";
import { getSiteContent } from "../lib/content";
import Navbar from "../navbar";
import SocialAccountCard, { type SocialAccount } from "./social-account-card";

// Gerçek marka görselleri kart içinde alakasız/kırpık durduğu için --
// logo yerine her platformun marka renginden bir gradyan + üstünde isim
// yazıyor. Henüz gerçek linki olmayanlar (comingSoon) diğerleri gibi
// tıklanabilir değil, dürüst bir "Yakında" rozetiyle gösteriliyor --
// sahte/çalışmayan link yerine.
const accounts: SocialAccount[] = [
  {
    label: "TikTok",
    username: "@tmp_cagri",
    href: "https://www.tiktok.com/@tmp_cagri",
    gradient: "from-black via-[#25F4EE]/30 to-[#FE2C55]/40",
  },
  {
    label: "YouTube",
    username: "@tmp_cagri",
    href: "https://www.youtube.com/@tmp_cagri",
    gradient: "from-red-500 via-red-600 to-red-900",
  },
  {
    label: "Instagram",
    username: "@tmp_cagri46",
    href: "https://www.instagram.com/tmp_cagri46",
    gradient: "from-purple-600 via-pink-500 to-orange-400",
  },
  {
    label: "X (Twitter)",
    username: "@tmp_cagri",
    href: "#",
    gradient: "from-neutral-900 via-black to-neutral-800",
    comingSoon: true,
  },
  {
    label: "Telegram",
    username: "@tmp_cagri",
    href: "#",
    gradient: "from-sky-500 via-sky-600 to-blue-600",
    comingSoon: true,
  },
  {
    label: "WhatsApp",
    username: "@tmp_cagri",
    href: "#",
    gradient: "from-green-500 via-emerald-500 to-emerald-600",
    comingSoon: true,
  },
  {
    label: "Facebook",
    username: "Çok yakında burada",
    href: "#",
    gradient: "from-blue-500 via-blue-600 to-blue-800",
    comingSoon: true,
  },
];

export default async function SosyalMedyaPage() {
  const content = getSiteContent();
  const user = await getCurrentUser();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white dark:bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element -- sabit sayfa arka planı, R2'de barındırılıyor */}
      <img
        src="https://pub-5946b15c1992464485b90a8b76df9ab1.r2.dev/homepage/bg-sosyal-medya.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-white/85 dark:bg-black/85" />

      <Navbar
        className="text-black dark:text-white"
        logoText={content.navbar.logoText}
        navLinks={content.footerLinks}
        user={user}
      />

      <div className="relative flex-1 px-6 pb-24 pt-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <BackButton />

          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-[0.2em] text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
              SOSYAL MEDYA
            </span>
            <h1 className="mt-4 font-sans text-3xl font-bold text-black dark:text-white sm:text-4xl">
              Bizi Sosyal Medyada Takip Et
            </h1>
          </div>

          {/* İçerikler paneli sosyal-medya sayfasından patronun isteğiyle
              kaldırıldı (2026-09-21) -- bileşen (icerik-slider-panel.tsx)
              silinmedi, ileride geri eklenecek. Panel gidince sosyal medya
              düğmeleri tek sütuna indirildi, ortalanmış bir alana taşındı. */}
          <div className="mx-auto mt-10 flex w-full max-w-xl flex-col gap-3">
            {accounts.map((account) => (
              <SocialAccountCard key={account.label} account={account} />
            ))}
          </div>
        </div>
      </div>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
