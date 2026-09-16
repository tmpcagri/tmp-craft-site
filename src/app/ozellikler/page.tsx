import BackButton from "../back-button";
import Footer from "../footer";
import { getCurrentUser } from "../lib/auth";
import { getSiteContent } from "../lib/content";
import Navbar from "../navbar";
import FeatureRow from "./feature-row";

// Her önizleme, ilgili gerçek sayfanın kendi görsel diliyle (kart
// biçimi, renk paleti) sadeleştirilmiş bir maketi -- gerçek ekran
// görüntüsü değil, o özelliğin "hissini" veren küçük bir kompozisyon.
function ModPaketleriPreview() {
  return (
    <div className="absolute inset-0 flex flex-col gap-2 p-5">
      <div className="h-6 w-2/3 rounded-full bg-white/25" />
      <div className="mt-2 grid flex-1 grid-cols-3 gap-2">
        {["from-emerald-400 to-teal-600", "from-purple-400 to-fuchsia-600", "from-orange-400 to-red-600"].map(
          (g, i) => (
            <div key={i} className={`rounded-xl bg-gradient-to-br ${g} opacity-90`} />
          ),
        )}
      </div>
      <div className="h-3 w-1/2 rounded-full bg-white/20" />
    </div>
  );
}

function ProjelerPreview() {
  return (
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 p-5">
      <div className="col-span-2 row-span-2 rounded-xl bg-white/25" />
      <div className="rounded-xl bg-white/15" />
      <div className="rounded-xl bg-white/15" />
    </div>
  );
}

function GundemPreview() {
  return (
    <div className="absolute inset-0 flex flex-col gap-2.5 p-5">
      {[80, 60, 90].map((w, i) => (
        <div
          key={i}
          className="flex items-center gap-2 rounded-xl bg-white/15 p-2.5"
        >
          <span className="h-6 w-6 shrink-0 rounded-full bg-white/40" />
          <span className="h-2.5 rounded-full bg-white/30" style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  );
}

function SunucularPreview() {
  return (
    <div className="absolute inset-0 flex flex-col justify-end gap-2 p-5">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-300" />
        <span className="h-2.5 w-24 rounded-full bg-white/30" />
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
        <div className="h-full w-3/5 rounded-full bg-emerald-300" />
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-amber-300" />
        <span className="h-2.5 w-16 rounded-full bg-white/30" />
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
        <div className="h-full w-2/5 rounded-full bg-amber-300" />
      </div>
    </div>
  );
}

function HesapPreview() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5">
      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-yellow-300 p-1">
        <div className="h-full w-full rounded-full bg-white/20" />
      </div>
      <div className="h-2.5 w-24 rounded-full bg-white/30" />
      <div className="h-2 w-32 rounded-full bg-white/15" />
    </div>
  );
}

function MesajlarPreview() {
  return (
    <div className="absolute inset-0 flex flex-col justify-end gap-2 p-5">
      <div className="ml-auto w-2/3 rounded-2xl rounded-br-sm bg-white/25 p-2.5">
        <div className="h-2 w-full rounded-full bg-white/40" />
      </div>
      <div className="w-3/4 rounded-2xl rounded-bl-sm bg-white/15 p-2.5">
        <div className="h-2 w-full rounded-full bg-white/30" />
        <div className="mt-1.5 h-2 w-2/3 rounded-full bg-white/30" />
      </div>
    </div>
  );
}

const features = [
  {
    eyebrow: "MOD PAKETLERİ",
    title: "Tek çatı altında binlerce içerik",
    description:
      "Mod, resource pack, data pack, shader, modpack, eklenti ve sunucu dosyalarını tek bir kütüphanede topluyoruz — sürüm, loader, ortam ve lisansa göre filtreleyip saniyeler içinde bul.",
    bullets: [
      "Sürüm ve loader'a göre gelişmiş filtreleme",
      "Bağımlılıklar otomatik gösterilir",
      "Üretici üyeyse kendi görseli ve profili görünür",
    ],
    gradient: "from-emerald-500 to-teal-700",
    preview: <ModPaketleriPreview />,
    href: "/mod-paketleri",
    cta: "Mod Paketlerini Keşfet",
  },
  {
    eyebrow: "BUILD VE FARM REHBERİ",
    title: "Coğrafya mühendisliği, verim hesabıyla",
    description:
      "Build'ler ve farm'lar ayrı ayrı ya da karışık görüntülenebilir. Her farm için uyumlu sürüm aralığı, saatlik verim ve AFK bilgisi; her build için zorluk ve tahmini yapım süresi net.",
    bullets: [
      "En popüler rehberler öne çıkan büyük kartlarda",
      "Sürüm uyumluluğuna göre filtreleme",
      "Malzeme listesi ve kullanılan modlara doğrudan bağlantı",
    ],
    gradient: "from-amber-500 to-orange-700",
    preview: <ProjelerPreview />,
    href: "/projeler",
    cta: "Rehberlere Göz At",
  },
  {
    eyebrow: "TOPLULUK",
    title: "Gündemi kaçırma, tartışmaya katıl",
    description:
      "Hashtag'li konular, öne çıkan yayıncılar ve canlı akan gündem şeridiyle topluluğun nabzını tut. Bir konu her zaman ana sayfadan bir tık uzakta.",
    bullets: [
      "Gündeme göre sıralanan hashtag'ler",
      "Arama sonucu doğrudan ilgili konuya götürür",
      "Premium/standart/yeni yayıncı katmanları",
    ],
    gradient: "from-fuchsia-500 to-purple-700",
    preview: <GundemPreview />,
    href: "/topluluk",
    cta: "Topluluğa Katıl",
  },
  {
    eyebrow: "SUNUCULAR",
    title: "Şeffaf puanlama, dürüst liste",
    description:
      "Sunucular tek bir genel puanla değil, ayrı eksenlerde (performans, harita, personel ilgisi) değerlendirilir. Sponsorlu görünürlük asla organik sıralamaya karışmaz.",
    bullets: [
      "Anlık oyuncu sayısı ve doluluk oranı",
      "Kötü yorumlar asla silinmez",
      "Ödeme sadece görünürlük satın alır, itibar değil",
    ],
    gradient: "from-red-600 to-rose-900",
    preview: <SunucularPreview />,
    href: "/sunucular",
    cta: "Sunucuları İncele",
  },
  {
    eyebrow: "HESAP VE GÜVENLİK",
    title: "Kimliğin senin kontrolünde",
    description:
      "Google ile ya da e-posta/şifreyle giriş yap. Kullanıcı adı, doğum tarihi ve cinsiyet değişiklikleri kötüye kullanımı önlemek için akıllı kilitlerle korunuyor.",
    bullets: [
      "Kullanıcı adı değişikliği 3 ayda bir",
      "Cinsiyet bilgisi sadece bir kez düzeltilebilir",
      "İlk girişte yaşa uygun içerik için kısa bir kayıt",
    ],
    gradient: "from-blue-500 to-indigo-700",
    preview: <HesapPreview />,
    href: "/hesap",
    cta: "Hesabını Yönet",
  },
  {
    eyebrow: "BİLDİRİMLER VE MESAJLAR",
    title: "Hiçbir şeyi kaçırma",
    description:
      "Topluluktaki etkileşimlerden anlık haberdar ol, üyelerle doğrudan mesajlaş. Her şey aynı temiz, dikkat dağıtmayan arayüzde.",
    bullets: [
      "Navbar'daki zil ile anlık bildirimler",
      "Kişiye özel mesajlaşma",
      "Sayfa değiştirdiğinde de bağlam korunur",
    ],
    gradient: "from-cyan-500 to-blue-800",
    preview: <MesajlarPreview />,
    href: "/mesajlar",
    cta: "Mesajlarını Aç",
  },
];

export default async function OzelliklerPage() {
  const content = getSiteContent();
  const user = await getCurrentUser();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-black">
      <Navbar
        className="text-black dark:text-white"
        logoText={content.navbar.logoText}
        navLinks={content.footerLinks}
        user={user}
      />

      <div className="relative flex-1 px-6 pb-24 pt-32 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <BackButton />

          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-[0.2em] text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
              ÖZELLİKLER
            </span>
            <h1 className="mt-4 font-sans text-3xl font-bold text-black dark:text-white sm:text-4xl">
              TMP Craft&apos;ta neler var?
            </h1>
            <p className="mt-3 text-sm text-black/60 dark:text-white/60 sm:text-base">
              Mod aramaktan sunucu seçmeye, build rehberi bulmaktan
              topluluğa katılmaya — tek bir yerde.
            </p>
          </div>

          <div className="mt-16 flex flex-col gap-20">
            {features.map((feature, i) => (
              <FeatureRow key={feature.eyebrow} {...feature} reverse={i % 2 === 1} />
            ))}
          </div>
        </div>
      </div>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
