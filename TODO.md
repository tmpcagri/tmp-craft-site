# TMP Craft — Sıradaki Adımlar

## Ekip yapısı (bilgisayar tekrar açılınca terminal başına `claude` çalıştırılıp rol hatırlatılmalı)
- Koordinatör (bu session, terminalde değil): tasarım/UI, genel kontrol, görev dağıtımı.
- Terminal genel (tmpcagri-65 idi): kurulum, komut çalıştırma, git commit, dev server.
- Supabase/SQL uzmanı (tmpcagri-20 idi): auth, migration, backend entegrasyonlar (Minecraft/Xbox Live zinciri dahil).
- QA/kod kontrol (tmpcagri-35 idi): ölü dosya, eksik/fazla kod, eslint/tsc taraması.
- Yedek/genel amaçlı (tmpcagri-23 idi): README yazdı, boşta bekleyen 5. oturum.

Bilgisayar kapanınca bu oturumların hepsi ölür — yeniden açılınca her terminalde `claude` çalıştırılmalı, ben (koordinatör) her birine rolünü tekrar anlatırım. Sadece "kaldığımız yerden devam edelim" demen yeterli.

## Genel durum
Site (ana sayfa, 404, `/admin` moderatör paneli, `/yonetim` sahip paneli) çalışır durumda. Gerçek Supabase auth kodu tamamen yazıldı (Google + Microsoft/Azure + Minecraft/Xbox profil çekme), ama **provider'lar Supabase'de henüz aktif değil** — o yüzden şu an kimse gerçekten giriş yapamıyor, site "Giriş Yapın" durumunda sorunsuz çalışmaya devam ediyor.

### Tamamlananlar
- Supabase projesi oluşturuldu ("tmp-craft", Frankfurt), `.env.local` dolu.
- `supabase/migrations/0001_profiles_and_permissions.sql` ve `0002_minecraft_profile.sql` — **ikisi de SQL Editor'de başarıyla çalıştırıldı.**
- Auth kod tarafı tamamen hazır: `lib/auth.ts`, `lib/permissions.ts`, `lib/users.ts` gerçek Supabase sorgularına bağlı; `AccountButton` gerçek `signInWithGoogle`/`signInWithAzure`/`signOut`'a bağlı (yeni, geliştirilmiş giriş paneli — Google/Microsoft ikonlu); `/auth/callback` route'u hazır; Minecraft/Xbox Live profil çekme zinciri (`lib/minecraft.ts`) hazır.
- Moderatör panelindeki (`/admin`) "Bilgi Kartları" artık görsel URL + yönlendirme linki alanlarıyla düzenlenebiliyor, ana sayfada gerçekten görünüyor (`info-cards.tsx`).
- QA taraması yapıldı, bulunan küçük hatalar (unused import, `<a>`→`Link`, hydration uyarısı) düzeltildi, ölü dosyalar temizlendi.
- README.md eklendi.

### Yarım kalan: Google/Microsoft OAuth kurulumu
`docs/oauth-setup.md` içinde tam rehber var. Kaldığımız yer: **Çağrı Google Cloud Console'da yeni bir proje oluşturmaya çalışıyordu** ("TMP Craft" adında), henüz tamamlanmadı.

Sıradaki adımlar (rehberin tamamı `docs/oauth-setup.md`'de):
1. Google Cloud Console'da "TMP Craft" projesi oluştur (eski projelere dokunmaya gerek yok, yeni proje yeterli).
2. OAuth consent screen doldur (External, app name TMP Craft).
3. OAuth Client ID oluştur (Web application), redirect URI: `https://gyijgygktnqawniwybcm.supabase.co/auth/v1/callback`
4. Client ID/Secret'ı Supabase Dashboard → Authentication → Providers → Google'a gir.
5. Aynısını Microsoft/Azure için tekrarla (Azure Portal → Entra ID → App registrations) — rehberde detaylı adımlar var, Minecraft/Xbox Live için ekstra bir Azure ayarı gerekmiyor (sadece kod tarafındaki scope yeterli).
6. Google ile bir kere giriş yapılınca, Supabase SQL Editor'de şunu çalıştır (kendini "owner" yapmak için):
   ```sql
   update public.profiles set is_owner = true
   where id = (select id from auth.users where email = 'cagri.games.46@gmail.com');
   ```
   **Güvenlik notu (QA buldu, 0005 migration'ı):** Eskiden bu komut `username = 'cagri'` ile eşleştiriyordu, ama `username` benzersiz değildi ve artık "Profili Düzenle" panelinden (0003) herkes kendi username'ini değiştirebiliyor — biri "cagri" adını alıp owner yetkisini kapabilirdi. Artık gerçek Google hesabının email'ine (`auth.users.email`, OAuth ile doğrulanmış, kullanıcı değiştiremez) göre eşleştiriyoruz. Yukarıdaki email `cagri.games.46@gmail.com` bu session'ın bildiği kullanıcı email'i — **Çağrı'nın siteye Google ile giriş yaptığı hesapla aynı olduğunu çalıştırmadan önce doğrula** (`select email from auth.users;` ile kontrol edilebilir).
7. Microsoft ile de test girişi yap, `profiles` tablosunda `minecraft_username`/`minecraft_uuid` dolduğunu kontrol et (Minecraft hesabı olan bir Microsoft hesabıyla).

## Notlar
- **Kritik güvenlik notu (hâlâ geçerli):** `/admin` ve `/yonetim` gerçek auth kontrolüne kavuştu (moderatör session yoksa "giriş yapmalısın" gösteriyor) ama OAuth henüz aktif olmadığı için kimse giriş yapamıyor — pratikte hâlâ kimse içeri giremiyor, bu normal ve güvenli. OAuth aktif olduktan sonra ilk owner ataması (adım 6) yapılmadan `/yonetim`'e kimse tam erişemez.
- `/api/content` ve `/api/users` POST endpoint'lerinde runtime body validasyonu yok (QA'in bulduğu, TODO'da kalan bir iyileştirme) — deploy öncesi ele alınmalı.
- Dev server: `~/projects/cagri-site` içinde `npm run dev`, bilgisayar kapanınca durur, tekrar açılınca terminal tarafına başlattırılmalı.
