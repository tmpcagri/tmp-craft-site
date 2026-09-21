import type { DownloadItem } from "./lib/downloads";
import ModPaketleriSliderPanel, { type FeaturedModCard } from "./mod-paketleri-slider-panel";
import ProjelerSliderPanel from "./projeler-slider-panel";

// Mod Paketleri ile Eğitimler'in yerleri patronun isteğiyle değiştirildi
// (2026-09-21) -- Mod Paketleri artık burada (üstte, Projeler'in yanında),
// Eğitimler aşağıda AtmosphereSection'daki eski Mod Paketleri yerinde.
export default function CommunitySlider({
  allItems,
  featuredModItems,
}: {
  allItems: DownloadItem[];
  featuredModItems: FeaturedModCard[];
}) {
  return (
    <section className="relative z-10 flex w-full items-center justify-center pb-16">
      <div className="grid w-[calc(100%-2rem)] grid-cols-1 gap-4 sm:w-[calc(100%-5rem)] sm:grid-cols-2">
        <ProjelerSliderPanel className="h-80" />
        <ModPaketleriSliderPanel
          className="h-80"
          allItems={allItems}
          featured={featuredModItems}
        />
      </div>
    </section>
  );
}
