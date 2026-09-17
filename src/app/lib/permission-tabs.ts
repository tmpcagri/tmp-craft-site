import type { ModeratorTab } from "./permissions";

// İnsan-okunur tab etiketleri -- /yonetim (yetki verme/alma) ve
// /admin'deki bekleyen yetki kartı ikisi de bunu kullanıyor, tek yerden
// güncellensin diye. permissions.ts server-only bir dosya (supabase/
// server import ediyor), o yüzden bu saf veri ayrı, client-safe bir
// dosyada duruyor.
export const TAB_LABELS: Record<ModeratorTab, string> = {
  cards: "Ana Sayfa — Duyuru Kartları",
  occasion: "Ana Sayfa — Özel Günler Teması",
  ticker: "Ana Sayfa — CANLI Şeridi",
  hero: "Ana Sayfa — Kayan Kart",
  panels: "Ana Sayfa — Öne Çıkan Modlar",
  guides: "Ana Sayfa — Build/Farm Kartları",
  mods: "Mod Paketleri — Mod/Shader Yükle",
  servers: "Sunucular — Sunucu Kartları",
  creators: "Topluluk — Önerilen Yayıncılar",
  articles: "Topluluk — Makaleler",
  topluluk_hero: "Topluluk — Alt Yazılar",
  links: "Site — Footer / Menü Linkleri",
};

export const ALL_MODERATOR_TABS = Object.keys(TAB_LABELS) as ModeratorTab[];
