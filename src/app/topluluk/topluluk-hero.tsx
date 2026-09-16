import type { ToplulukHeroSlide } from "../lib/content";

// Pozisyonlar (gradyan/boyut) sabit, sadece admin'den gelen başlık/metin
// değişiyor -- bkz. src/app/lib/content.ts ToplulukHeroSlide.
const GRADIENTS = [
  "from-orange-400 via-pink-500 to-purple-600",
  "from-blue-400 via-indigo-500 to-purple-600",
  "from-emerald-400 via-teal-500 to-cyan-600",
  "from-rose-400 via-red-500 to-orange-500",
];

// Önceden 5 saniyede bir otomatik değişen tek slaytlı bir carousel'dı --
// Hero mozaiğinde uyguladığımız aynı araştırma burada da geçerli: insanlar
// carousel'larla neredeyse hiç etkileşime girmiyor, çoğu zaman sadece ilk
// mesaj görülüyor. Artık hepsi aynı anda, statik bir mozaik olarak
// gösteriliyor -- hiçbir duyuru kaybolmuyor.
export default function ToplulukHero({ slides }: { slides: ToplulukHeroSlide[] }) {
  const s = [0, 1, 2, 3].map((i) => slides[i] ?? { title: "", body: "" });

  return (
    <div className="grid h-auto grid-cols-1 gap-3 sm:h-[32vh] sm:grid-cols-[1.4fr_1fr_1fr]">
      <div
        className={`flex h-40 flex-col items-start justify-end gap-2 rounded-3xl bg-gradient-to-br p-6 shadow-xl sm:h-full ${GRADIENTS[0]}`}
      >
        <h2 className="font-sans text-2xl font-bold text-white sm:text-3xl">
          {s[0].title}
        </h2>
        <p className="max-w-md font-sans text-sm text-white/80">{s[0].body}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:h-full sm:grid-rows-2">
        {s.slice(1, 3).map((slide, i) => (
          <div
            key={i}
            className={`flex h-28 flex-col items-start justify-end gap-1 rounded-2xl bg-gradient-to-br p-4 shadow-lg sm:h-full ${GRADIENTS[i + 1]}`}
          >
            <h3 className="font-sans text-base font-bold text-white">
              {slide.title}
            </h3>
            <p className="font-sans text-xs text-white/80">{slide.body}</p>
          </div>
        ))}
      </div>

      <div
        className={`flex h-28 flex-col items-start justify-end gap-1 rounded-2xl bg-gradient-to-br p-4 shadow-lg sm:h-full ${GRADIENTS[3]}`}
      >
        <h3 className="font-sans text-base font-bold text-white">{s[3].title}</h3>
        <p className="font-sans text-xs text-white/80">{s[3].body}</p>
      </div>
    </div>
  );
}
