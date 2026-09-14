import BackButton from "../back-button";
import Footer from "../footer";
import { getCurrentUser } from "../lib/auth";
import { getSiteContent } from "../lib/content";
import Navbar from "../navbar";
import ModPaketleriFilters from "./mod-paketleri-filters";

export default async function ModPaketleriPage() {
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
        <BackButton />
        <h1 className="font-sans text-3xl font-bold text-black dark:text-white">
          Mod Paketleri
        </h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Dünyanı bir üst seviyeye taşıyacak yüzlerce mod, doku paketi ve
          modpack seni bekliyor — Mods, Resource Packs, Data Packs, Shaders,
          Modpacks, Plugins ve Servers, hepsi tek çatı altında. Beğendiğini
          bul, hemen indir, oynamaya başla.
        </p>

        <ModPaketleriFilters />
      </div>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
