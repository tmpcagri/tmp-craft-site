import BackButton from "../back-button";
import Footer from "../footer";
import { getCurrentUser } from "../lib/auth";
import { getSiteContent } from "../lib/content";
import { getAllDownloadItems } from "../lib/downloads-server";
import { normalizeCategoryOrder } from "../lib/downloads";
import Navbar from "../navbar";
import ModPaketleriFilters from "./mod-paketleri-filters";

export default async function ModPaketleriPage() {
  const content = getSiteContent();
  const user = await getCurrentUser();
  const items = await getAllDownloadItems();
  const backgroundImageUrl = content.modPaketleriPage.backgroundImageUrl;
  const categoryOrder = normalizeCategoryOrder(content.modPaketleriPage.categoryOrder);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-black">
      <Navbar
        className="text-black dark:text-white"
        logoText={content.navbar.logoText}
        navLinks={content.footerLinks}
        user={user}
      />

      {/* Navbar sabit/yarı saydam olduğu için görsel onun ARKASINDAN
          başlayıp altta sayfa arka planına yumuşak geçiş yapıyor --
          patron ayarlamadıysa (varsayılan boş) hiçbir şey render edilmiyor,
          düzen bugünkü haliyle birebir aynı kalıyor. */}
      {backgroundImageUrl && (
        <div className="relative h-56 w-full overflow-hidden sm:h-72">
          {/* eslint-disable-next-line @next/next/no-img-element -- moderatörün yüklediği görsel, R2'den geliyor */}
          <img
            src={backgroundImageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent dark:from-black dark:via-black/10" />
        </div>
      )}

      <div className="flex-1 px-6 pb-24 pt-16 sm:px-10">
        <BackButton />
        <h1 className="text-center font-sans text-3xl font-bold text-black dark:text-white">
          Mod Paketleri
        </h1>

        <ModPaketleriFilters items={items} categoryOrder={categoryOrder} />
      </div>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
