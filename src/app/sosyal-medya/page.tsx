import BackButton from "../back-button";
import Footer from "../footer";
import IcerikSliderPanel from "../icerik-slider-panel";
import { getCurrentUser } from "../lib/auth";
import { getSiteContent } from "../lib/content";
import Navbar from "../navbar";
import SocialAccountCard, { type SocialAccount } from "./social-account-card";

// Gerçek marka görselleri kart içinde alakasız/kırpık durduğu için --
// hepsi renksiz, sade bir kart üstünde direkt isim yazıyor. Henüz gerçek
// linki olmayanlar (comingSoon) diğerleri gibi tıklanabilir değil, dürüst
// bir "Yakında" rozetiyle gösteriliyor -- sahte/çalışmayan link yerine.
const accounts: SocialAccount[] = [
  {
    label: "TikTok",
    username: "@tmp_cagri",
    href: "https://www.tiktok.com/@tmp_cagri",
    gradient: "from-neutral-800 to-neutral-950",
  },
  {
    label: "YouTube",
    username: "@tmp_cagri",
    href: "https://www.youtube.com/@tmp_cagri",
    gradient: "from-neutral-800 to-neutral-950",
  },
  {
    label: "Instagram",
    username: "@tmp_cagri46",
    href: "https://www.instagram.com/tmp_cagri46",
    gradient: "from-neutral-800 to-neutral-950",
  },
  {
    label: "X (Twitter)",
    username: "@tmp_cagri",
    href: "#",
    gradient: "from-neutral-800 to-neutral-950",
    comingSoon: true,
  },
  {
    label: "Telegram",
    username: "@tmp_cagri",
    href: "#",
    gradient: "from-neutral-800 to-neutral-950",
    comingSoon: true,
  },
  {
    label: "WhatsApp",
    username: "@tmp_cagri",
    href: "#",
    gradient: "from-neutral-800 to-neutral-950",
    comingSoon: true,
  },
  {
    label: "Facebook",
    username: "Çok yakında burada",
    href: "#",
    gradient: "from-neutral-800 to-neutral-950",
    comingSoon: true,
  },
];

export default async function SosyalMedyaPage() {
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

      <div className="flex-1 px-6 pb-24 pt-32 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <BackButton />

          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-[0.2em] text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
            SOSYAL MEDYA
          </span>
          <h1 className="mt-4 font-sans text-3xl font-bold text-black dark:text-white sm:text-4xl">
            Bizi Sosyal Medyada Takip Et
          </h1>
          <p className="mt-2 max-w-xl text-sm text-black/60 dark:text-white/60 sm:text-base">
            Kulis, canlı yayın anları ve yeni içerik duyuruları için
            hesaplarımıza göz at.
          </p>

          {/* Sosyal medya düğmeleri sayfanın solunda sabit, dar bir
              sütunda duruyor -- masaüstünde içerik vitrini sağda,
              mobilde tam genişlikte üstte. */}
          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="flex w-full flex-col gap-3 lg:w-[340px] lg:shrink-0">
              {accounts.map((account) => (
                <SocialAccountCard key={account.label} account={account} />
              ))}
            </div>

            <div className="w-full min-w-0 lg:flex-1">
              <IcerikSliderPanel className="h-72 lg:h-full lg:min-h-[440px]" />
            </div>
          </div>
        </div>
      </div>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
