import EgitimlerSliderPanel from "./egitimler-slider-panel";
import ProjelerSliderPanel from "./projeler-slider-panel";

export default function CommunitySlider() {
  return (
    <section className="relative z-10 flex w-full items-center justify-center pb-16">
      <div className="grid w-[calc(100%-2rem)] grid-cols-1 gap-4 sm:w-[calc(100%-5rem)] sm:grid-cols-2">
        <ProjelerSliderPanel className="h-80" />
        <EgitimlerSliderPanel className="h-80" />
      </div>
    </section>
  );
}
