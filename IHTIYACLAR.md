# İhtiyaçlar

Yapay zekanın çözemeyeceği / kullanıcı onayı/kararı gereken açık maddeler.

## Görsel varlıklar (SEO <head> için) — TAMAMLANDI ✅ (2026-09-01)

`public/og-image.png`, `logo.png`, `favicon.ico`, `favicon-32x32.png`,
`favicon-16x16.png`, `apple-touch-icon.png` üretildi (PIL ile, marka
renklerine ve T-M-P kutu motifine uygun, `og-image.png` ayrıca "Craft™" ve
tagline içeriyor). Hepsi `layout.tsx`'in referans verdiği yol/boyutlarla
birebir eşleşiyor, 200 dönüyor. Gerçek bir tasarımcı elinden çıkma bir
versiyonla değiştirilmek istenirse aynı dosya adlarını/oranları koru.

## Kod temizliği kararları — hepsi çözüldü

- `src/data/users.json` — silindi.
- `mod-packs-panel.tsx`/`community-posts-panel.tsx` ortak bileşen — bu
  önceki bir oturumun notuydu, `mod-packs-panel.tsx` artık repoda hiç yok
  (muhtemelen bir ana sayfa yeniden tasarımında kalkmış), birleştirilecek
  bir şey kalmadı.
- `notification-bell.tsx`/`topluluk-notifications.tsx` — ortak
  `lib/use-outside-click.ts` hook'una çıkarıldı.
- Yetim `minecraft_*` DB kolonları — 0013 migration ile kaldırıldı.

## Hâlâ açık: slider/carousel kullanımı kararı

Önceki oturumun UX araştırması (TÜİK + newslabturkey.org), kullanıcıların
%73'ünün sayfalanmış/galeri/carousel içerikten rahatsız olduğunu
gösteriyor. Ana sayfa hâlâ birden fazla slider kullanıyor. Bu tamamen bir
tasarım/ürün tercihi, kullanıcının kararı — tek taraflı değiştirilmedi.
