import Link from "next/link";
import type { Guide } from "../lib/guides";

export type TileSize = "lg" | "wide" | "tall" | "sm";

// Bento grid'deki hücre boyutu -- "lg" en büyük/önemli kareyi, "wide"/
// "tall" ara boyutları, "sm" standart kareyi temsil eder.
//
// ÖNEMLİ: küçük karolarda metin alanına sadece başlık + tek satır özet
// sığdırılıyor (kategori/zorluk rozetleri, açıklama gibi her şeyi
// göstermeye çalışmak taşma/kırpılmaya yol açıyordu -- küçük bir kutuya
// 4-5 satır bilgi sığmaz). Sadece "lg" boyut, gerçekten yer olduğu için
// tam bilgi panelini gösteriyor. Görsel alanı `flex-1 min-h-0` ile
// kalan tüm alanı otomatik dolduruyor, yüzdesel min-height gibi kırılgan
// hesaplara gerek yok.
export default function GuideCard({
  guide,
  size = "sm",
  className = "",
}: {
  guide: Guide;
  size?: TileSize;
  className?: string;
}) {
  const isLarge = size === "lg";

  const compactMeta =
    guide.kind === "Farm"
      ? guide.yieldPerHour ?? `${guide.minVersion ?? ""}–${guide.maxVersion ?? ""}`
      : guide.buildTimeMinutes
        ? `~${Math.max(1, Math.round(guide.buildTimeMinutes / 60))} sa`
        : guide.difficulty;

  return (
    <Link
      href={`/projeler/${guide.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-neutral-900 ${className}`}
    >
      <div className={`relative min-h-0 flex-1 bg-gradient-to-br ${guide.gradient}`}>
        <span className="absolute left-2.5 top-2.5 rounded-full bg-black/40 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
          {guide.kind === "Build" ? "Build" : "Farm"}
        </span>
        {guide.afkable && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-emerald-500/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            AFK
          </span>
        )}
        {isLarge && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-black">
            En Popüler
          </span>
        )}
      </div>

      {isLarge ? (
        <div className="flex shrink-0 flex-col gap-2.5 p-5 sm:p-6">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium text-black/60 dark:bg-white/10 dark:text-white/60">
              {guide.category}
            </span>
            <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium text-black/60 dark:bg-white/10 dark:text-white/60">
              {guide.difficulty}
            </span>
          </div>
          <h3 className="font-sans text-xl font-bold text-black transition group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 sm:text-2xl">
            {guide.title}
          </h3>
          <p className="text-base text-black/60 dark:text-white/60 sm:line-clamp-3">
            {guide.description}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-black/50 dark:text-white/50">
            {guide.kind === "Farm" && guide.minVersion && guide.maxVersion && (
              <span>{guide.minVersion} – {guide.maxVersion}</span>
            )}
            {guide.kind === "Farm" && guide.yieldPerHour && (
              <span>{guide.yieldPerHour}/sa</span>
            )}
            {guide.kind === "Build" && guide.buildTimeMinutes && (
              <span>~{Math.max(1, Math.round(guide.buildTimeMinutes / 60))} sa yapım</span>
            )}
            {guide.hasSchematic && <span>Şematik</span>}
          </div>
        </div>
      ) : (
        <div className="flex shrink-0 flex-col gap-0.5 p-3">
          <h3 className="truncate font-sans text-sm font-bold text-black transition group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
            {guide.title}
          </h3>
          <p className="truncate text-xs text-black/50 dark:text-white/50">
            {guide.category} · {compactMeta}
          </p>
        </div>
      )}
    </Link>
  );
}
