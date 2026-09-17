import Footer from "../footer";
import HillsBackground from "../hills-background";
import { getCurrentUser } from "../lib/auth";
import { getSiteContent } from "../lib/content";
import Navbar from "../navbar";
import FeaturedPosts from "./featured-posts";
import GundemSidebar from "./gundem-sidebar";
import OnerilenYayincilarSidebar from "./onerilen-yayincilar-sidebar";
import QuickTopicLinks from "./quick-topic-links";
import ToplulukAdCard from "./topluluk-ad-card";
import ToplulukNotifications from "./topluluk-notifications";

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
      <QuickTopicLinks />

      {/* Sabit (fixed) Navbar + QuickTopicLinks'in altından temiz başlaması
          için üst boşluk BURADA, dış konteynerde -- eskiden sadece
          <main>'in kendisindeydi, bu yüzden mobilde sıralama değişip
          (order-first) bir sidebar en başa geçtiğinde o sidebar hiç üst
          boşluk almadan direkt sabit şeritlerin altına giriyor, kaydırınca
          da üstlerinden geçip görsel olarak üst üste biniyordu. */}
      <div className="relative z-10 flex flex-1 flex-col gap-4 pt-28 sm:pt-32 lg:flex-row lg:items-start lg:gap-0 lg:pt-40">
        <GundemSidebar />

        <main className="flex w-full flex-1 flex-col gap-6 px-6 pb-16 sm:px-10 lg:px-10">
          <ToplulukAdCard />
        </main>

        <OnerilenYayincilarSidebar creators={content.recommendedCreators} />
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
