import Footer from "../footer";
import HillsBackground from "../hills-background";
import { getCurrentUser } from "../lib/auth";
import { getSiteContent } from "../lib/content";
import Navbar from "../navbar";
import FeaturedPosts from "./featured-posts";
import OnerilenYayincilarSidebar from "./onerilen-yayincilar-sidebar";
import ToplulukAdCard from "./topluluk-ad-card";
import ToplulukNotifications from "./topluluk-notifications";
import ToplulukTabs from "./topluluk-tabs";

export default async function ToplulukPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const content = getSiteContent();
  const user = await getCurrentUser();
  const { q } = await searchParams;

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <HillsBackground />
      <Navbar
        className="text-black dark:text-white"
        logoText={content.navbar.logoText}
        navLinks={content.footerLinks}
        user={user}
        notifications={<ToplulukNotifications />}
      />

      <ToplulukTabs />

      {/* Sabit (fixed) Navbar + ToplulukTabs'ın altından temiz başlaması
          için üst boşluk BURADA, dış konteynerde. */}
      <div className="relative z-10 flex flex-1 flex-col gap-6 px-6 pb-16 pt-28 sm:px-10 sm:pt-32 lg:px-10 lg:pt-40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6">
          <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6">
            <ToplulukAdCard />
          </main>

          <OnerilenYayincilarSidebar creators={content.recommendedCreators} />
        </div>
      </div>

      {/* Öne çıkan gönderiler bilerek sayfanın en altında -- yayıncı
          kartları (yukarıda, her zaman en üstte/sabit) ile karışmasın. */}
      <div className="relative z-10 px-6 pb-24 sm:px-10 lg:px-10">
        <FeaturedPosts query={q} />
      </div>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
