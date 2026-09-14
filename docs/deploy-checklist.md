# Deploy öncesi kontrol listesi

TODO.md ve QA taramalarından derlenmiştir. Canlıya (veya OAuth'u
etkinleştirip halka açmadan) önce aşağıdakiler tek tek kontrol edilmeli.

## 1. Veritabanı / migration'lar

- [ ] `supabase/migrations/` altındaki tüm dosyalar sırayla Supabase SQL
      Editor'de (veya `supabase db push` ile) çalıştırıldı:
      `0001_profiles_and_permissions.sql` → `0002_minecraft_profile.sql` →
      `0003_profile_edit_fields.sql` → `0004_messages.sql` →
      `0005_username_unique.sql`.
- [ ] **0005 özellikle önemli**: `profiles.username` üzerinde unique
      constraint ekliyor ve `handle_new_user` trigger'ını çakışma durumunda
      sayısal sonek ekleyecek şekilde günceliyor. Bu, ilk gerçek OAuth
      girişinden **önce** çalıştırılmalı — aksi halde owner bootstrap adımı
      (aşağıda) username çakışmasına karşı korumasız kalır.
- [ ] 0005'i çalıştırmadan önce mevcut satırlarda username çakışması
      olmadığını doğrula (dosyanın başındaki `select ... having count(*) > 1`
      sorgusu).
- [ ] RLS politikaları her tabloda aktif: `profiles` (0001), `messages`
      (0004). `alter table ... enable row level security` satırlarının
      gerçekten çalıştığını Supabase Dashboard → Table Editor → ilgili
      tablo → RLS sekmesinden görsel olarak doğrula.

## 2. OAuth / Auth

- [ ] `docs/oauth-setup.md` içindeki Google ve Microsoft/Azure adımlarının
      hepsi tamamlandı (consent screen, client ID/secret, Supabase
      Providers ayarları).
- [ ] Google ile bir kere gerçek girişi test et, `profiles` tablosunda
      satır oluştuğunu doğrula.
- [ ] **Owner ataması** (TODO.md madde 6): Google ile giriş yaptıktan sonra
      `update public.profiles set is_owner = true where username = 'cagri'`
      çalıştırılmadan önce, o an `username = 'cagri'` olan satırın gerçekten
      Çağrı'nın hesabı olduğunu (id/provider ile) doğrula — 0005 sonrası
      username tekil olduğu için çakışma riski azaldı ama yine de kontrol
      alışkanlığı olarak kalsın.
- [ ] Microsoft ile test girişi yap, `minecraft_username`/`minecraft_uuid`
      alanlarının dolduğunu kontrol et (Minecraft hesabı bağlı bir
      Microsoft hesabıyla).
- [ ] `/admin` ve `/yonetim` sayfalarına yetkisiz (moderatör olmayan / giriş
      yapmamış) bir hesapla erişmeyi dene, doğru şekilde reddedildiğini
      doğrula.

## 3. API route yetkilendirme ve validasyon

- [ ] `/api/content` POST — `getCurrentModerator()` kontrolü var (düzeltildi),
      ama **body şekli hâlâ doğrulanmıyor** (`request.json()` doğrudan
      `SiteContent` olarak cast ediliyor). Deploy öncesi en azından temel
      alan kontrolü (örn. `infoCards`/`footerLinks` dizi mi, string alanlar
      string mi) eklenmesi önerilir.
- [ ] `/api/users` POST — yetkilendirme DB seviyesinde RLS'e (`profiles_
      update_owner_all`) bırakılmış, route'ta ek kontrol yok; bu bilinçli
      bir tasarım ama route'a gelen `body`'nin gerçekten `ManagedUser[]`
      şeklinde olduğu da doğrulanmıyor — malformed istek 500'e düşebilir.
      İsteğe bağlı iyileştirme.

## 4. Ortam değişkenleri

- [ ] `.env.local` prod ortamında da tanımlı: `NEXT_PUBLIC_SUPABASE_URL`,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY` (kod tabanında kullanılan tek iki
      env değişkeni bunlar).
- [ ] `.env.local` `.gitignore`'da olduğundan ve repoya hiç commitlenmediğinden
      emin ol.
- [ ] (Opsiyonel) Repoya bir `.env.example` eklemek — şu an yok, yeni
      katkıda bulunan biri hangi değişkenlerin gerektiğini koddan bulmak
      zorunda kalıyor.

## 5. Temizlik / ölü kod

- [ ] `src/data/users.json` artık kullanılmıyor (kullanıcı yönetimi
      Supabase `profiles` tablosuna taşındı, `lib/users.ts` JSON'a hiç
      dokunmuyor) — silinmesi veya en azından "artık kullanılmıyor" notu
      eklenmesi önerilir.
- [ ] `notification-bell.tsx` sabit boş veriyle çalışıyor, yeni `messages`
      tablosuna bağlı değil — deploy öncesi ya gerçek veriye bağlanmalı ya
      da özellik tamamen gizlenmeli (yarım/placeholder bir UI olarak canlıya
      çıkmasın).
- [ ] `mod-paketleri/[slug]` sayfasındaki "İndir" butonunun bir işlevi yok
      (placeholder) — canlıya çıkmadan önce ya gerçek bir indirme linkine
      bağlanmalı ya da buton kaldırılmalı.

## 6. Genel

- [ ] `npm run build` hatasız tamamlanıyor.
- [ ] `npm run lint` ve `npx tsc --noEmit` temiz.
- [ ] `/mod-paketleri/[slug]` gibi bilinen sabit slug listesi olan sayfalar
      için `generateStaticParams` eklemek performans açısından değerlendirilebilir
      (şu an build'de `ƒ` / dinamik render olarak görünüyor).
