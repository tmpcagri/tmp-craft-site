import Link from "next/link";
import Logo, { InlineLogo } from "./logo";

// Önceden burada otomatik dönen tek-mesajlı bir carousel vardı (4 slayt,
// 4.5sn'de bir geçiş). Carousel'lar üzerine yapılan bağımsız araştırma
// (Nielsen Norman Group, Erik Runyon'ın etkileşim verileri) net: kullanıcıların
// ~%99'u hiçbir slaytla etkileşime girmiyor, tıklayanların da ~%89'u SADECE
// ilk slayta tıklıyor -- yani "aynı anda tek mesaj" tasarımı pratikte
// "genelde sadece ilk mesaj görülüyor" anlamına geliyor. F-pattern göz
// tarama araştırması da en "sıcak" bölgenin sol-üst olduğunu, sağa/aşağı
// gittikçe soğuduğunu gösteriyor. Bu yüzden 4 mesajın hepsi artık AYNI ANDA,
// statik bir mozaikte gösteriliyor -- en önemlisi (marka girişi) sol üstte
// büyük, diğer üçü sağda daha küçük ve gerçek sayfalara tıklanabilir.
const featured = {
  id: "hosgeldin",
  title: (
    <>
      <InlineLogo />
      &apos;a Hoş Geldin
    </>
  ),
  body: "Mod, modpack, sunucu ve topluluk — Minecraft dünyanın tek adresi.",
  image: "https://pub-5946b15c1992464485b90a8b76df9ab1.r2.dev/logo.16.png",
  href: "/sosyal-medya",
};

const secondary = [
  {
    id: "modlarini-bul",
    title: "Modlarını Bul",
    body: "Yüzlerce mod, sürüm ve loader'a göre filtrelenmiş.",
    image: "/modlarini-bul-bg.png",
    href: "/mod-paketleri",
  },
  {
    id: "toplulukla-bulus",
    title: "Toplulukla Buluş",
    body: "Sorularını sor, projelerini paylaş.",
    image: "/toplulukla-bulus-bg.png",
    href: "/topluluk",
  },
  {
    id: "kendi-dunyani-kur",
    title: "Kendi Dünyanı Kur",
    body: "Build rehberleri ve ilham verici projeler.",
    image: "/kendi-dunyani-kur-bg.png",
    href: "/projeler",
  },
];

export default function HeroSlider() {
  return (
    <div className="grid h-auto w-[calc(100%-2rem)] grid-cols-1 gap-3 sm:h-[52vh] sm:w-[calc(100%-5rem)] sm:grid-cols-[1.6fr_1fr]">
      <Link
        href={featured.href}
        className="group relative flex h-56 flex-col items-start justify-end gap-2 overflow-hidden rounded-3xl p-6 shadow-2xl sm:h-full sm:p-10"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Cloudflare R2-hosted brand image */}
        <img
          src={featured.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <h1 className="relative font-sans text-3xl font-bold text-white sm:text-5xl">
          {featured.title}
        </h1>
        <p className="relative max-w-md font-sans text-sm text-white/80 sm:text-lg">
          {featured.body}
        </p>

        <div className="absolute bottom-4 right-4 hidden flex-col items-end whitespace-nowrap text-white sm:flex">
          <Logo compact />
          <span className="mt-1 font-sans text-xs text-white/70">
            Minecraft mod, sunucu ve topluluk merkezi
          </span>
        </div>
      </Link>

      <div className="grid grid-cols-1 gap-3 sm:h-full sm:grid-rows-3">
        {secondary.map((slide) => (
          <Link
            key={slide.id}
            href={slide.href}
            className="group relative flex h-28 flex-col items-start justify-end gap-1 overflow-hidden rounded-2xl p-4 shadow-lg sm:h-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- Cloudflare R2-hosted brand image */}
            <img
              src={slide.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
            <h2 className="relative font-sans text-base font-bold text-white sm:text-lg">
              {slide.title}
            </h2>
            <p className="relative font-sans text-xs text-white/75 sm:text-sm">
              {slide.body}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
