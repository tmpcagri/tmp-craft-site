import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/site-content.json");

// Anasayfanın CANLI/Son Dakika şeridinde "Duyuru" etiketiyle görünen
// mesajlar -- eskiden görsel bir kart grid'inde de gösteriliyordu (body/
// imageUrl/span alanları o yüzden vardı), o bileşen kaldırılalı beri
// sadece title+linkUrl gerçekten kullanılıyor.
export type InfoCard = {
  title: string;
  linkUrl: string;
};

export type NavLink = {
  label: string;
  href: string;
};

export type CreatorPlatform = "YouTube" | "Twitch" | "TikTok";
export type CreatorTier = "premium" | "standard" | "newcomer";

export type RecommendedCreator = {
  name: string;
  platform: CreatorPlatform;
  note: string;
  tier: CreatorTier;
};

export type ContactInfo = {
  whatsapp: string;
  email: string;
};

// Resmi/milli günler (bayrak), yas/kötü günler (soluk+kurdele), dini
// bayramlar (hilal) için site geneli tema -- ya elle açılıp kapatılır ya
// da bir tarih aralığında otomatik aktif olur. bkg alanları özel günlerde
// arka plana eklenebilecek, şeffaflığı ayarlanabilecek bir görsel için.
export type OccasionTheme = "none" | "resmi" | "yas" | "dini";

// Yıl boyunca tekrar eden/farklı tarihlerdeki özel günler (30 Ağustos,
// Ramazan/Kurban Bayramı, anma günleri) için birden fazla zamanlanmış
// dönem tutulabiliyor -- tek bir sabit tarih aralığı yetmezdi.
export type ScheduledOccasion = {
  theme: OccasionTheme;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  label: string; // admin panelinde tanımak için, ör. "30 Ağustos Zafer Bayramı"
};

export type SpecialOccasion = {
  manualTheme: OccasionTheme; // "none" değilse otomatik zamanlamanın önüne geçer
  autoScheduleEnabled: boolean;
  schedule: ScheduledOccasion[];
  backgroundImageUrl: string;
  backgroundOpacity: number; // 0-1
};

// CANLI şeridi -- "son dakika" moduna geçebilir (etiket değişir), ya da
// tek bir mesaj döngü olmadan sabit kalabilir (acil bir duyuru için).
// customMessages otomatik üretilen duyuru/gündem/sunucu karışımının
// BAŞINA ekleniyor (bkz. src/app/page.tsx).
export type TickerMode = "canli" | "son-dakika";

export type TickerConfig = {
  mode: TickerMode;
  pinned: boolean;
  pinnedMessage: string;
  pinnedHref: string;
  customMessages: { label: string; href: string; tag: string }[];
};

// Anasayfa hero'sundaki büyük "Hoşgeldin" kartı BİRDEN FAZLA görsel
// alabiliyor (kendi süresiyle dönen mini bir galeri), 3 küçük kart ise
// sabit sayıda -- sadece içerikleri (görsel/yazı/link) düzenlenebiliyor.
export type HeroSlide = {
  title: string;
  body: string;
  image: string;
  href: string;
};

export type HeroContent = {
  featuredSlides: HeroSlide[];
  featuredIntervalMs: number;
  secondary: HeroSlide[];
};

// Anasayfadaki "Mod Paketleri" kayan bandında hangi modların, hangi
// sırada ve hangi rozetle (Popüler/En Çok İndirilen/Yeni) öne
// çıkarılacağı -- boşsa panel eski davranışına (ilk 8 mod) düşüyor.
export type FeaturedModTag = "" | "Popüler" | "En Çok İndirilen" | "Yeni";

export type FeaturedModEntry = {
  slug: string;
  tag: FeaturedModTag;
};

// Topluluk sayfasının statik mozaiğindeki 4 kartın başlık/metni --
// pozisyonları (gradyan/boyut) sabit, sadece yazıları düzenlenebiliyor.
export type ToplulukHeroSlide = {
  title: string;
  body: string;
};

export type SiteContent = {
  navbar: {
    logoText: string;
  };
  infoCards: InfoCard[];
  footerLinks: NavLink[];
  recommendedCreators: RecommendedCreator[];
  contact: ContactInfo;
  specialOccasion: SpecialOccasion;
  ticker: TickerConfig;
  hero: HeroContent;
  featuredMods: FeaturedModEntry[];
  toplulukHero: ToplulukHeroSlide[];
};

export function getSiteContent(): SiteContent {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export function saveSiteContent(content: SiteContent): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(content, null, 2) + "\n", "utf-8");
}
