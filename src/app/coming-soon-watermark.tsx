// Henüz erişilemeyen ("yakında") kartların üzerine, damga gibi çapraz
// duran büyük bir uyarı -- kullanıcı kartın tıklanabilir/dolu olduğunu
// sanmasın, daha kart'a bakar bakmaz erişilemeyeceğini anlasın diye.
// pointer-events-none: tıklamayı/hover'ı engellemiyor, sadece görsel.
export default function ComingSoonWatermark() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
      <span className="-rotate-6 select-none whitespace-nowrap rounded-xl border-2 border-amber-300/60 bg-black/20 px-4 py-1.5 font-sans text-xl font-black uppercase tracking-widest text-amber-300/90 shadow-lg backdrop-blur-[1px] sm:px-6 sm:py-2 sm:text-3xl">
        Çok Yakında
      </span>
    </div>
  );
}
