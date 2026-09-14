import BackButton from "../back-button";
import Footer from "../footer";
import { getCurrentUser } from "../lib/auth";
import { getSiteContent } from "../lib/content";
import Navbar from "../navbar";
import HesabimKaydedilenler from "./hesabim-kaydedilenler";

export default async function HesabimPage() {
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

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-24 pt-32 sm:px-10">
        <BackButton />
        <p className="font-mono text-sm tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
          HESABIM
        </p>
        <h1 className="mt-4 font-sans text-4xl font-bold text-black dark:text-white sm:text-5xl">
          Kaydettiklerim
        </h1>
        <p className="mt-4 font-sans text-lg text-black/70 dark:text-white/70">
          Beğendiğin ve kaydettiğin mod paketlerine buradan ulaş.
        </p>

        <div className="mt-10">
          <HesabimKaydedilenler />
        </div>
      </main>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
