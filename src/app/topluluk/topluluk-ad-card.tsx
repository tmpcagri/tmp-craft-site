// Genel reklam kartı yer tutucusu -- ToplulukHero mozaiğinin yerine geldi.
// mod-paketleri/[slug]'daki AdSlot ile aynı dil/stil ama sabit-pozisyonlu
// dar sidebar değil, sayfa akışında yatay geniş-kısa tek bir kart.
export default function ToplulukAdCard() {
  return (
    <div className="flex h-32 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 text-center dark:border-white/15 sm:h-40">
      <p className="text-[10px] font-semibold uppercase tracking-wide opacity-40">
        Reklam Alanı
      </p>
      <p className="mt-1 px-3 text-xs opacity-50">
        Bu alan yakında reklam ortaklarımıza açılacak.
      </p>
    </div>
  );
}
