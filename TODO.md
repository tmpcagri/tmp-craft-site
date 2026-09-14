# TMP Craft — Durum ve Sıradaki Adımlar

*Son güncelleme: 2026-09-01. Koordinatör oturumu (bu session) tarafından
yazıldı — geri dönünce "kaldığımız yerden devam edelim" demen yeterli.*

## Bilgisayarı tekrar açınca SENİN açman gerekenler
- Bir terminal aç, `claude` çalıştır (koordinatör oturumu) — geri kalan alt
  görevler için ek terminal açman gerekmez, koordinatör kendi başlatır/yönlendirir.
- Tarayıcıda Supabase Dashboard'u açık tut (aşağıdaki bekleyen SQL migration'ları
  çalıştırman gerekecek).
- Başka hiçbir şeyi elle açman gerekmiyor.

## ⚠️ Bekleyen, SENİN yapman gereken şeyler

### 1. Migrationlar — TAMAMLANDI ✅ (2026-09-13)
0001–0015 arası tüm migration'lar Supabase'de çalıştırıldı ve doğrulandı
(0008/0009/0010 aslında daha önceden uygulanmış çıktı, TODO.md'nin eski
notu yanlıştı; 0011/0012/0013/0014 önceki bir oturumda çalıştırıldı). `/topluluk`
gerçek veritabanına bağlı, konu/mesaj/AI-paketleme sistemi canlı. 0014,
peer incelemesinde bulunan bir gap'i kapatıyor: `finalize_article()` artık
itiraz penceresi kapanmadan (deadline geçmeden) makaleyi yayınlamaya
izin vermiyor -- öncesinde bu sadece UI'da (buton disabled) kontrol
ediliyordu, DB tarafında zorunlu değildi.
**0015 — KRİTİK GÜVENLİK FIX'İ, canlıya uygulandı ve doğrulandı (2026-09-13):**
anonim/girişsiz bir kullanıcının `package_topic_article()` ve
`finalize_article()` fonksiyonlarını çağırıp yetkisiz makale
yayınlayabilmesine/AI paketleme tetikleyebilmesine izin veren bir
NULL-permission-bypass açığı kapatıldı (`coalesce(..., false)` ile
NULL-safe hale getirildi). Anon curl testiyle doğrulandı, canlıda artık
"yetkisiz" hatası dönüyor. Tüm migration geçmişi (0001-0015) aynı
NULL-bypass deseni için tekrar tarandı, başka fonksiyonda tekrarı yok.

### 2. `.env.local`'e kendin ekle (bana yapıştırma)
- **`SUPABASE_SERVICE_ROLE_KEY`** (Supabase Dashboard → Project Settings →
  API → "service_role") — hâlâ eksik, gerçek kullanıcı silme ve Topluluk'un
  3 aylık otomatik temizlik uç noktası (`/api/topluluk/temizle`) bunsuz
  çalışmaz.
- **`ANTHROPIC_API_KEY`** (yeni ihtiyaç) — Topluluk'taki AI paketleme
  özelliği (`/api/topluluk/paketle`) bir konuşmayı kalıcı özete dönüştürürken
  bunu kullanır. Sende zaten var dedin, sadece dosyaya ekle.
- **`CRON_SECRET`** (opsiyonel, ama önerilir) — kendi seçtiğin rastgele bir
  metin. `/api/topluluk/temizle` uç noktasını bu secret'la (Authorization:
  Bearer ...) korur; bir dış zamanlayıcı (Vercel Cron, GitHub Actions, ya da
  Supabase'de pg_cron açıksa doğrudan `select
  public.delete_expired_topic_messages();`) günlük tetiklesin diye. Şimdilik
  eklemesen de site çalışır, sadece 3 aylık ham veri temizliği otomatik
  tetiklenmez (elle SQL Editor'den de çalıştırılabilir).

### 3. Topluluk moderatör izni ver (opsiyonel)
Sen (owner) zaten her izne otomatik sahipsin. Başka birine Topluluk
makalelerini paketleme/yayınlama yetkisi vermek istersen `/yonetim` → ilgili
kullanıcı → "Topluluk Makaleleri" iznini aç.

## Genel mimari durumu
- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind v4 + Supabase.
- Alan adı: **cagrimedya.com** (`layout.tsx` metadata).
- **Auth: sadece Google.** Microsoft/Azure kalıcı olarak kaldırıldı, tekrar
  eklemeye çalışılmamalı.
- Site sahibi (`cagri.games.46@gmail.com`) owner yetkisine sahip, `/admin` ve
  `/yonetim` panellerine tam erişimi var.

## Bu oturumda tamamlananlar (özet)
- **Marka**: özel "TMP Craft" logosu (koyu yeşil kutular + Archivo Black +
  ™) tasarlandı ve site genelinde HER metin/cümle içi geçen "TMP Craft"
  yazısının yerine geçti (`logo.tsx`, `InlineLogo`).
- **Navbar scroll-shrink bug'ı düzeltildi**: menü butonuna aşağı scroll
  yaptıktan hemen sonra ilk tıklama bazen etkisizdi (padding geçiş
  animasyonu yüzünden kayan bir hedef vardı) — padding artık anlık
  değişiyor, sadece renk/gölge animasyonlu.
- **Footer mega-footer olarak yeniden tasarlandı** (Kategoriler/Platform/
  Kurumsal/Yasal/Bizi Takip Et sütunları), iki round overflow bug'ı
  düzeltildi.
- **Mod paketi detay sayfası** 3 kolonlu düzene kavuştu, **3 katmanlı
  ("premium/standard/newcomer") yayıncı sistemi** admin panelinden
  yönetilebilir hale geldi.
- **Topluluk baştan gerçek bir sisteme dönüştürüldü** (bu oturumun en büyük
  işi): önceden her şey mock/statik veriydi, "Yeni Konu" butonu bile devre
  dışıydı. Şimdi:
  - Gerçek konu açma / yanıtlama Supabase'e yazıyor (`topics`,
    `topic_messages` tabloları, 0012 migration, haftada 1 konu limiti RLS
    seviyesinde).
  - Her konunun kendi sayfası var: `/topluluk/[id]`.
  - Moderatör ("Topluluk" izni) bir konuyu Claude API'ye (Anthropic)
    paketletebiliyor (`/api/topluluk/paketle`) — kalıcı, tarafsız bir özet +
    puansız ama sıralı katkı listesi (ilk kalıcı fikri getirene "★ İlk
    Fikir" rozeti) üretiliyor.
  - 7 günlük itiraz penceresi: pencere açıkken herkes itiraz bırakabilir
    (moderatöre görünür), pencere kapanınca moderatör makaleyi
    "Yayınla"yabiliyor.
  - Ham tartışma mesajları, paketlenmiş olsun olmasın, konunun açılışından
    **3 ay sonra** kalıcı olarak siliniyor (`delete_expired_topic_messages()`
    fonksiyonu + korumalı `/api/topluluk/temizle` uç noktası) — paketlenmiş
    özet ve katkı listesi kalıcı kalıyor.
  - Bu sürecin tamamı Telif Hakkı ve KVKK sayfalarında açıkça anlatıldı
    (onay dili, saklama süresi, itiraz hakkı).
  - `/admin`'e yeni bir "Topluluk" sekmesi eklendi (konu listesi + durum
    rozetleri, işlemler her konunun kendi sayfasında yapılıyor).
- **Erişilebilirlik + kontrast geçişi** (peer terminal): site genelinde
  WCAG AA'yı geçemeyen `text-*/40` ve `text-*/50` ikincil metin renkleri
  `/60`'a çekildi (71 satır, 17 dosya); modal/dialog için odak yönetimi,
  Escape ile kapama, eksik aria-label'lar eklendi.
- **Güvenlik düzeltmeleri** (peer terminal): `auth/callback/route.ts`'te
  gerçek bir açık redirect (userinfo-confusion, `next=@evil.com` gibi)
  kapatıldı; `mesajlar/page.tsx`'te 2 race condition (konuşma değiştirirken
  eski isteğin üzerine yazması, optimistic mesajın poll tarafından
  silinmesi) generation-counter ile çözüldü; beğen/kaydet'te sessizce
  yutulan hatalar artık rollback + log yapıyor.
- **Ölü kod temizliği**: `src/data/users.json` silindi (gerçekten kullanılmıyordu).
- **Kod tekrarı temizliği**: auto-scroll/marquee mantığı (`community-posts-panel.tsx`
  + `topluluk/creator-marquee.tsx`) ortak `lib/use-auto-scroll.ts` hook'una,
  "dışarı tıklayınca kapat" mantığı (`account-button.tsx` + `notification-bell.tsx`
  + `topluluk-notifications.tsx`, üç yerde birebir aynıydı) ortak
  `lib/use-outside-click.ts` hook'una çıkarıldı.
- **Topluluk ikinci-tur peer incelemesi**: kritik bir gap kapatıldı --
  `finalize_article()` artık itiraz penceresi kapanmadan (deadline
  geçmeden) yayınlamaya izin vermiyor (0014 migration, DB seviyesinde
  zorunlu, öncesinde sadece UI'da buton disabled'dı). Ayrıca: refresh()
  race condition'ı generation-counter ile çözüldü, "Yayınla" butonu artık
  30sn'de bir otomatik kontrol ediyor (sayfa açık kalırsa manuel yenileme
  gerekmiyor), konu açma formu gönderim sürerken kapatılamıyor, gerçek
  yükleme hatası "konu yok" durumundan ayrıştırıldı, arama artık son 100
  konuyu tarıyor (50 değil).
- **SEO görsel varlıkları üretildi**: `og-image.png`, `logo.png`,
  `favicon.ico`, `favicon-32x32.png`, `favicon-16x16.png`,
  `apple-touch-icon.png` — hepsi eksikti (404 veriyorlardı), artık marka
  renklerine uygun (PIL ile üretildi) ve `layout.tsx`'in beklediği tüm
  yol/boyutlarla eşleşiyor. Detay `IHTIYACLAR.md`'de.

## Düşük öncelikli, hâlâ açık
- Slider/carousel kullanımı kararı hâlâ açık (önceki oturumun UX
  araştırmasına bakabilirsin, Artifact linki bu dosyanın git geçmişinde).

## Ekip yapısı (bilgisayar tekrar açılınca)
Peer terminal oturumları bilgisayar kapanınca ölür. Yeniden açılınca yeni
terminal(ler) açıp `claude` çalıştırman yeterli — koordinatör (ben) her
birine görev/bağlam tekrar verir.
