// Özel günlerde arka plana eklenen, şeffaflığı ayarlanabilen görsel --
// sabit (fixed), tüm sayfaların arkasında, tıklamaları engellemiyor.
// Sunucu bileşeni olarak kalabiliyor (state/hook yok), layout.tsx'te
// hesaplanan aktif temaya göre koşullu render ediliyor.
export default function OccasionBackground({
  imageUrl,
  opacity,
}: {
  imageUrl: string;
  opacity: number;
}) {
  if (!imageUrl) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${imageUrl})`, opacity }}
    />
  );
}
