import type { RecommendedCreator } from "../lib/content";
import CreatorMarquee from "./creator-marquee";

export default function OnerilenYayincilarSidebar({
  creators,
}: {
  creators: RecommendedCreator[];
}) {
  const premium = creators.filter((c) => c.tier === "premium");
  const standard = creators.filter((c) => c.tier === "standard");
  const newcomers = creators.filter((c) => c.tier === "newcomer");

  return (
    <aside className="order-first flex w-full shrink-0 flex-col gap-px overflow-hidden rounded-3xl border border-black/10 bg-white/40 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40 lg:sticky lg:top-36 lg:order-none lg:max-h-[calc(100vh-10rem)] lg:w-80 lg:self-start lg:overflow-y-auto lg:rounded-r-none lg:border-r-0">
      {premium.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 bg-amber-400/10 px-5 py-2">
            <span className="text-xs">★</span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
              Premium
            </span>
          </div>
          <CreatorMarquee
            items={premium}
            visibleCount={4}
            showRank
            accent="amber"
          />
        </div>
      )}

      {standard.length > 0 && (
        <div>
          <div className="border-y border-black/10 px-5 py-2 dark:border-white/10">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
              Diğer Yayıncılar
            </span>
          </div>
          <CreatorMarquee items={standard} visibleCount={5} />
        </div>
      )}

      {newcomers.length > 0 && (
        <div>
          <div className="border-t border-black/10 px-5 py-2 dark:border-white/10">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
              Yeni Başlayanlar
            </span>
          </div>
          <CreatorMarquee items={newcomers} visibleCount={3} />
        </div>
      )}
    </aside>
  );
}
