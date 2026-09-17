import BackButton from "../back-button";
import Footer from "../footer";
import { getCurrentUser } from "../lib/auth";
import { getSiteContent } from "../lib/content";
import { getAllDownloadItems } from "../lib/downloads-server";
import Navbar from "../navbar";
import ModPaketleriFilters from "./mod-paketleri-filters";

export default async function ModPaketleriPage() {
  const content = getSiteContent();
  const user = await getCurrentUser();
  const items = await getAllDownloadItems();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-black">
      <Navbar
        className="text-black dark:text-white"
        logoText={content.navbar.logoText}
        navLinks={content.footerLinks}
        user={user}
      />

      <div className="flex-1 px-6 pb-24 pt-20 sm:px-10">
        <BackButton />
        <h1 className="font-sans text-3xl font-bold text-black dark:text-white">
          Mod Paketleri
        </h1>

        <ModPaketleriFilters items={items} />
      </div>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
