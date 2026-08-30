# TMP Craft

TMP Craft topluluk sitesi. Next.js (App Router) + TypeScript + Tailwind CSS + Supabase ile geliştiriliyor.

## Dizin Yapısı

```
src/app/            Sayfalar ve bileşenler (App Router)
  admin/             Moderatör Paneli (/admin)
  yonetim/           Yönetim Paneli (/yonetim)
  auth/callback/     Supabase OAuth callback route'u
  api/               Route handler'lar (content, session, users)
  lib/               Supabase istemcileri, auth/permissions/users/minecraft yardımcıları
src/data/           Statik veri
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

- `/` — Ana sayfa (hero/secondary/community slider'lar, navbar, footer)
- `/admin` — Moderatör Paneli
- `/yonetim` — Yönetim Paneli
- `/auth/callback` — Supabase OAuth callback

## Notlar

- Detaylı durum, bekleyen işler ve bilinen güvenlik eksikleri için [TODO.md](./TODO.md) dosyasına bakın.
- OAuth kurulumu için [docs/oauth-setup.md](./docs/oauth-setup.md) dosyasına bakın.
