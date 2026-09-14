import Link from "next/link";
import { trends } from "../lib/trends";

export default function GundemSidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-1 rounded-3xl border border-black/10 bg-white/40 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40 lg:sticky lg:top-36 lg:max-h-[calc(100vh-10rem)] lg:w-64 lg:self-start lg:overflow-y-auto lg:rounded-l-none lg:border-l-0">
      <h3 className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
        En Çok Konuşulanlar
      </h3>
      {trends.map((trend) => (
        <Link
          key={trend.topic}
          href={`/topluluk/etiket/${encodeURIComponent(trend.topic)}`}
          className="flex flex-col gap-0.5 rounded-xl px-2 py-2 transition hover:bg-black/5 dark:hover:bg-white/10"
        >
          <span className="text-[11px] font-medium text-black/60 dark:text-white/60">
            {trend.category}
          </span>
          <span className="text-sm font-semibold text-black dark:text-white">
            #{trend.topic}
          </span>
          <span className="text-xs text-black/60 dark:text-white/60">
            {trend.count} gönderi
          </span>
        </Link>
      ))}
    </aside>
  );
}
