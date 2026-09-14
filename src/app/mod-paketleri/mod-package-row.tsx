import Link from "next/link";
import type { DownloadItem } from "../lib/downloads";

export default function ModPackageRow({ item }: { item: DownloadItem }) {
  return (
    <Link
      href={`/mod-paketleri/${item.slug}`}
      className="group flex items-center gap-4 rounded-2xl border border-black/10 bg-white/40 p-3 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-white/70 hover:shadow-[0_0_28px_-4px_rgba(16,185,129,0.5)] dark:border-white/10 dark:bg-black/40 dark:hover:border-emerald-400/40 dark:hover:bg-black/70 dark:hover:shadow-[0_0_32px_-4px_rgba(52,211,153,0.45)]"
    >
      <div
        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ${
          item.iconImage ? "" : `bg-gradient-to-br ${item.gradient}`
        }`}
      >
        {item.iconImage && (
          // eslint-disable-next-line @next/next/no-img-element -- kullanıcı tarafından yüklenen mod görseli
          <img
            src={item.iconImage}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-sans text-sm font-bold text-black transition group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
          {item.name}
        </h3>
        <p className="mt-0.5 truncate text-xs text-black/60 dark:text-white/60">
          {item.description}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium text-black/60 dark:bg-white/10 dark:text-white/60">
            {item.gameVersion}
          </span>
          <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium text-black/60 dark:bg-white/10 dark:text-white/60">
            {item.loader}
          </span>
        </div>
      </div>
    </Link>
  );
}
