import BackButton from "../back-button";
import Footer from "../footer";
import { getCurrentUser } from "../lib/auth";
import { getSiteContent } from "../lib/content";
import { guides } from "../lib/guides";
import Navbar from "../navbar";
import ProjelerFilters from "./projeler-filters";
import ProjelerInfoToggle from "./projeler-info-toggle";

export default async function ProjelerPage() {
  const content = getSiteContent();
  const user = await getCurrentUser();

  const buildCount = guides.filter((g) => g.kind === "Build").length;
  const farmCount = guides.filter((g) => g.kind === "Farm").length;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white dark:bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element -- sabit sayfa arka planı, R2'de barındırılıyor */}
      <img
        src="https://pub-5946b15c1992464485b90a8b76df9ab1.r2.dev/homepage/bg-projeler.jpg"
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
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-10 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-40 h-72 w-72 rounded-full bg-orange-400/15 blur-3xl"
        />

        <BackButton />

        <div className="relative text-center">
          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-[0.2em] text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
            PROJELER
          </span>
          <h1 className="mt-4 font-sans text-3xl font-bold text-black dark:text-white sm:text-4xl">
            Build ve Farm Rehberi
          </h1>

          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-black/50 dark:text-white/50">
            <span className="rounded-full bg-black/5 px-3 py-1 dark:bg-white/10">
              {guides.length} rehber
            </span>
            <span className="rounded-full bg-black/5 px-3 py-1 dark:bg-white/10">
              {buildCount} Build
            </span>
            <span className="rounded-full bg-black/5 px-3 py-1 dark:bg-white/10">
              {farmCount} Farm
            </span>
          </div>

          <ProjelerInfoToggle />
        </div>

        <ProjelerFilters />
      </div>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
