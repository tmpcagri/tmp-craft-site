import type { ReactNode } from "react";

// Mod Paketleri ve Projeler sayfalarındaki üst filtre düğmeleri aynı
// bileşeni paylaşıyor -- iki sayfa farklı veri modellerine sahip olsa da
// filtrelerin "hissi" (gradient/glow aktif durum, backdrop-blur pasif
// durum) böylece otomatik tutarlı kalıyor.
export default function FilterPill({
  active,
  onClick,
  icon,
  size = "md",
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon?: ReactNode;
  size?: "md" | "sm";
  children: ReactNode;
}) {
  const sizeClasses =
    size === "sm" ? "px-3.5 py-1.5 text-xs" : "px-4 py-2.5 text-sm";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full font-semibold transition-all duration-200 ${sizeClasses} ${
        active
          ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 ring-1 ring-inset ring-white/25"
          : "border border-black/10 bg-white/40 text-black/70 backdrop-blur-sm hover:-translate-y-0.5 hover:border-emerald-500/30 hover:bg-white/70 hover:text-black hover:shadow-md dark:border-white/10 dark:bg-black/30 dark:text-white/70 dark:hover:bg-black/50 dark:hover:text-white"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
