# TMP Craft

TMP Craft topluluk sitesi. Next.js (App Router) + TypeScript + Tailwind CSS + Supabase ile geliştiriliyor.

## Dizin Yapısı

```
src/app/            Sayfalar ve bileşenler (App Router)
  admin/             Moderatör Paneli (/admin)
  yonetim/           Yönetim Paneli (/yonetim)
  mod-paketleri/     Mod/paket kataloğu (/mod-paketleri, filtrelenebilir liste + detay sayfası)
  auth/callback/     Supabase OAuth callback route'u
  api/               Route handler'lar (content, session, users)
  lib/               Supabase istemcileri, auth/permissions/users/minecraft/downloads yardımcıları
src/data/           Statik veri (site-content.json; users.json artık kullanılmıyor — bkz. TODO.md)
supabase/migrations/ SQL migration dosyaları
docs/               Ek dokümantasyon (ör. oauth-setup.md)
middleware.ts       Next.js middleware (Supabase session yenileme)
```

## Geliştirme

```bash
npm run dev     # geliştirme sunucusu (http://localhost:3000)
npm run build   # prod build
npm run start   # prod sunucusu
npm run lint    # eslint
```

Supabase bağlantı bilgileri `.env.local` içinde tutulur (repoya eklenmez).

## Önemli Route'lar

- `/` — Ana sayfa (hero/secondary/community slider'lar, navbar, footer, arama çubuğu)
- `/mod-paketleri` — Mod/paket kataloğu (filtrelenebilir liste)
- `/mod-paketleri/[slug]` — Tekil mod/paket detay sayfası
- `/admin` — Moderatör Paneli
- `/yonetim` — Yönetim Paneli
- `/auth/callback` — Supabase OAuth callback

## Notlar

- Detaylı durum, bekleyen işler ve bilinen güvenlik eksikleri için [TODO.md](./TODO.md) dosyasına bakın.
- OAuth kurulumu için [docs/oauth-setup.md](./docs/oauth-setup.md) dosyasına bakın.
- Deploy öncesi kontrol listesi için [docs/deploy-checklist.md](./docs/deploy-checklist.md) dosyasına bakın.
- `supabase/migrations/0004_messages.sql` ile mesajlaşma şeması (`messages` tablosu, `public_profiles` view) veritabanında hazır ama henüz hiçbir sayfa/bileşen bunu kullanmıyor — DM arayüzü ileride yapılacak. `notification-bell.tsx` de şu an sabit boş veriyle çalışan bir placeholder, `messages` tablosuna bağlı değil.
