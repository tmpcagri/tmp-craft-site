import Link from "next/link";
import type { DownloadItem } from "../lib/downloads";

export default function ModPackageRow({ item }: { item: DownloadItem }) {
  return (
    <Link
      href={`/mod-paketleri/${item.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-black/10 bg-white/40 p-3 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-white/70 hover:shadow-[0_0_28px_-4px_rgba(16,185,129,0.5)] sm:flex-row sm:items-center sm:gap-4 dark:border-white/10 dark:bg-black/40 dark:hover:border-emerald-400/40 dark:hover:bg-black/70 dark:hover:shadow-[0_0_32px_-4px_rgba(52,211,153,0.45)]"
    >
      {/* Sol: ikon + isim/yazar/açıklama -- her zaman aynı satırda başlar,
          dar ekranda meta rozetleri altına düşer (bkz. aşağıdaki blok). */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div
          className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl sm:h-16 sm:w-16 ${
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
          <p className="truncate text-xs text-black/50 dark:text-white/50">
            {item.author}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs text-black/60 sm:line-clamp-1 dark:text-white/60">
            {item.description}
          </p>
        </div>
      </div>

      {/* Sağ: sürüm/loader meta rozetleri -- dar ekranda satır altına
          taşar, geniş ekranda sağa yaslanır. */}
      <div className="flex flex-wrap items-center gap-1.5 pl-[68px] sm:shrink-0 sm:justify-end sm:pl-2">
        <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium text-black/60 dark:bg-white/10 dark:text-white/60">
          {item.gameVersion}
        </span>
        <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium text-black/60 dark:bg-white/10 dark:text-white/60">
          {item.loader}
        </span>
      </div>
    </Link>
  );
}
