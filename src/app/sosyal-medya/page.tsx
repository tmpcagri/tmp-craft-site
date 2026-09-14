import BackButton from "../back-button";
import Footer from "../footer";
import IcerikSliderPanel from "../icerik-slider-panel";
import { getCurrentUser } from "../lib/auth";
import { getSiteContent } from "../lib/content";
import Navbar from "../navbar";

// Gerçek marka görselleri kart içinde alakasız/kırpık durduğu için --
// hepsi renksiz, sade bir kart üstünde direkt isim yazıyor. Henüz gerçek
// linki olmayanlar (comingSoon) diğerleri gibi tıklanabilir değil, dürüst
// bir "Yakında" rozetiyle gösteriliyor -- sahte/çalışmayan link yerine.
const accounts = [
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
        <div className="mx-auto max-w-3xl">
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

          {/* Bilgilendirme amaçlı, yatay geniş-kısa kartlar -- her biri tek
              satırda platform + kullanıcı adı, tıklanınca hesaba gidiyor. */}
          <div className="mt-10 flex flex-col gap-3 sm:grid sm:grid-cols-2">
            {accounts.map(({ label, username, href, gradient, comingSoon }) => {
              const cardClass = `group relative flex h-20 items-center justify-between gap-3 rounded-2xl bg-gradient-to-r px-6 shadow-lg transition ${gradient}`;
              const content = (
                <>
                  <div>
                    <p className="font-sans text-base font-bold text-white">{label}</p>
                    <p className="text-sm text-white/70">{username}</p>
                  </div>
                  {comingSoon ? (
                    <span className="shrink-0 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-black">
                      Yakında
                    </span>
                  ) : (
                    <span className="shrink-0 text-white/60 transition group-hover:translate-x-0.5 group-hover:text-white">
                      →
                    </span>
                  )}
                </>
              );

              if (comingSoon) {
                return (
                  <div key={label} className={cardClass}>
                    {content}
                  </div>
                );
              }

              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${cardClass} hover:-translate-y-0.5 hover:shadow-xl`}
                >
                  {content}
                </a>
              );
            })}
          </div>

          {/* İçerikle ilgili kartlar -- gerçek video/paylaşım vitrinimiz,
              anasayfadakiyle aynı bileşen (uydurma yeni içerik değil),
              kendi başlığını zaten içeriyor. */}
          <div className="mt-12">
            <IcerikSliderPanel className="h-72" />
          </div>
        </div>
      </div>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
