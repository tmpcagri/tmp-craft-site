const slides = [
  {
    title: "Yeni sezon başladı!",
    body: "Sezon boyunca sürecek görevler ve ödüller için etkinlik başlığına göz at.",
    gradient: "from-orange-400 via-pink-500 to-purple-600",
  },
  {
    title: "Tasarım yarışması sürüyor",
    body: "Kendi resource pack'ini paylaş, topluluk oylasın.",
    gradient: "from-blue-400 via-indigo-500 to-purple-600",
  },
  {
    title: "Haftalık canlı yayın",
    body: "Cuma akşamı topluluk sunucusunda buluşuyoruz.",
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
  },
  {
    title: "Yeni başlayanlar rehberi",
    body: "İlk gününde ne yapman gerektiğini öğren, topluluğa hızlı katıl.",
    gradient: "from-rose-400 via-red-500 to-orange-500",
  },
];

// Önceden 5 saniyede bir otomatik değişen tek slaytlı bir carousel'dı --
// Hero mozaiğinde uyguladığımız aynı araştırma burada da geçerli: insanlar
// carousel'larla neredeyse hiç etkileşime girmiyor, çoğu zaman sadece ilk
// mesaj görülüyor. Artık hepsi aynı anda, statik bir mozaik olarak
// gösteriliyor -- hiçbir duyuru kaybolmuyor.
export default function ToplulukHero() {
  return (
    <div className="grid h-auto grid-cols-1 gap-3 sm:h-[32vh] sm:grid-cols-[1.4fr_1fr_1fr]">
      <div
        className={`flex h-40 flex-col items-start justify-end gap-2 rounded-3xl bg-gradient-to-br p-6 shadow-xl sm:h-full ${slides[0].gradient}`}
      >
        <h2 className="font-sans text-2xl font-bold text-white sm:text-3xl">
          {slides[0].title}
        </h2>
        <p className="max-w-md font-sans text-sm text-white/80">
          {slides[0].body}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:h-full sm:grid-rows-2">
        {slides.slice(1, 3).map((slide) => (
          <div
            key={slide.title}
            className={`flex h-28 flex-col items-start justify-end gap-1 rounded-2xl bg-gradient-to-br p-4 shadow-lg sm:h-full ${slide.gradient}`}
          >
            <h3 className="font-sans text-base font-bold text-white">
              {slide.title}
            </h3>
            <p className="font-sans text-xs text-white/80">{slide.body}</p>
          </div>
        ))}
      </div>

      <div
        className={`flex h-28 flex-col items-start justify-end gap-1 rounded-2xl bg-gradient-to-br p-4 shadow-lg sm:h-full ${slides[3].gradient}`}
      >
        <h3 className="font-sans text-base font-bold text-white">
          {slides[3].title}
        </h3>
        <p className="font-sans text-xs text-white/80">{slides[3].body}</p>
      </div>
    </div>
  );
}
