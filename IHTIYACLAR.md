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

## R2 bucket düzenleme — TAMAMLANDI ✅ (2026-09-19), beklenenden küçük çıktı

Diğer terminal oturumundan gelen görev: R2 bucket'ındaki (`tmp-craft-media`)
dağınık objeleri `homepage/`, `social-media/`, `mod-packages/<slug>/`,
`server-cards/`, `occasion/*` gibi düzenli klasörlere taşımak.

Kod tarafı: `src/app/lib/r2.ts` içindeki `buildUploadKey()` yeni klasör
convention'ına göre güncellendi. Denetim kurulu (security-auditor +
code-reviewer + qa-tester) bir Yüksek bulgu buldu (`itemSlug` sanitize
edilmeden R2 key'e gömülüyordu) — bu, `sanitizeItemSlug()` eklenerek
düzeltildi ve 20/20 birim testi (qa-tester'ın yazdığı
`src/app/lib/r2.test.ts`) PASS ediyor. Detaylar için git diff'e bakılabilir,
henüz commit edilmedi.

Düzeltilmemiş, düşük öncelikli açık noktalar:
- Kök neden olan panel kodları (`mod-paketleri-panel.tsx:62`,
  `sunucular-panel.tsx:55`) hâlâ kullanıcı isim alanından ham slug
  üretiyor; `sanitizeItemSlug` bunu R2 katmanında zaten temizliyor
  (savunma derinliği yeterli), üretici tarafı da düzeltmek istenirse ayrı
  bir görev.
- `mod-paketleri` için ikon/arka plan/galeri görselleri aynı köke değil,
  kardeş klasörlere yazılıyor (`mod-packages/<slug>/`,
  `mod-packages/<slug>-arkaplan/`, `mod-packages/<slug>-galeri-0/`) —
  kod yorumu bunun aksini iddia ediyor. Şu an zararsız (prefix bazlı
  toplu silme kodu yok), ileride "mod paketini sil → R2'den temizle"
  özelliği eklenirse önce bu netleştirilmeli.
- `occasion/*` alt kategori eşlemesi (`arka-plan-resmi`→flags,
  `arka-plan-yas`/`yas-ikon`→ataturk, `arka-plan-dini`→diğer-dini-günler)
  frontend-builder'ın varsayımı — content-editor/ux-designer onayı
  önerilir, yanlışsa moderatör panelinin (occasion-panel.tsx) Ramazan/
  Kurban Bayramı/FSM temalarını da kapsayacak şekilde genişletilmesi
  gerekebilir.
- Kalıcı bir test script'i (`npm test`) yok; qa-tester'ın testleri geçici
  bir derleme adımıyla çalıştırıldı. Vitest gibi hafif bir framework
  eklemek yeni bir bağımlılık/script kararı — kullanıcı onayı gerekir.

Fiili bucket taşıma/kopyalama: bucket taranınca **taşınacak gerçek içerik
neredeyse hiç çıkmadı** — 13 objenin 11'i 0 byte'lık boş klasör
işaretçisi, sadece 2 gerçek dosya var: bir "özel günler" arka plan görseli
(occasion kapsamında, kasıtlı dokunulmadı) ve bir site yedek zip'i
(`yedekler/cagri-site-2026-09-15.zip`, hedef yapıda karşılığı yok).
Kopyalanan obje sayısı: 0. Silme hiç gerekmedi, "toplu silme izni" sorunu
bu tur için kapandı.

**Yeni açık soru:** Site görselleri (hero, mod paketi ikonları, sunucu
kartı görselleri vb.) şu an R2'de değil — `public/` klasöründe statik
dosyalar olarak duruyor (`public/mod-paketleri-bg.png` vb.) ve
`src/app/lib/*` içindeki `image_url`/`cover_url` gibi alanlar muhtemelen
başka kaynaklardan (harici URL veya henüz kullanılmayan) besleniyor. R2
upload altyapısı (`r2.ts`, admin upload route'u) hazır ama fiilen
kullanılmıyor gibi görünüyor. Kullanıcının kararı: site görselleri R2'ye
taşınacak mı, yoksa `public/`'te mi kalacak? Bu netleşmeden R2 klasör
yapısı "boş ama hazır" durumda kalacak.

## Topluluk "yakında" kilidi — 2026-09-21, GERİ ALINDI (patron kararı değişti)

**Güncelleme (aynı gün, daha sonra):** Patron kararını değiştirdi — Topluluk
kilitli kalmayacak, "her yeri açıyoruz". Aşağıdaki stub kilidi (page.tsx'ler)
git ile HEAD'e restore edilerek geri alındı, `stub-routes.test.ts` silindi,
tsc/lint temiz, curl ile gerçek sayfa içeriğinin (stub değil) döndüğü
doğrulandı. `0034_restrict_topic_inserts_to_moderators.sql` migration'ı
SİLİNMEDİ (koordinatörün açık talimatıyla) ve henüz Supabase'de
çalıştırılmadı.

**Açık çelişki, patronun netleştirmesi gerekiyor:** 0034, `topics`/
`topic_messages` INSERT'lerini yalnızca moderatörlerle sınırlıyor
(`is_moderator(auth.uid())`). "Her yeri açıyoruz" kararıyla gerçek
Topluluk sayfası (konu açma/mesaj yazma arayüzü dahil) geri geldiğine göre,
0034 de çalıştırılırsa: sayfa tamamen açık görünecek ama normal
kullanıcıların her "konu aç"/"mesaj gönder" isteği RLS tarafından
403 ile reddedilecek — arayüz "paylaş" diyor, backend izin vermiyor.
Bu ya bilinçli bir ara adım ("sayfa açık, gerçek yazma moderasyon
altyapısı gelene kadar moderatörle sınırlı") ya da gözden kaçan bir
çelişki. Koordinatör oturuma bildirildi, patrondan netlik bekleniyor —
0034'ü çalıştırmadan önce bu netleşmeli.

Aşağıdaki bölüm (denetim kurulu bulguları) artık **stub'a özgü geçmiş
bilgi** — stub geri alındığı için search-bar/kontrast/navbar-uyarı gibi
stub'a özel bulgular geçersiz. RLS/moderatör-panel bulguları güncel
kalmaya devam ediyor (yukarıdaki çelişkiyle bağlantılı).

<details>
<summary>Eski kayıt (stub aktifken yazıldı, artık geçmiş bilgi)</summary>


Diğer oturumdan gelen görev: `/topluluk`, `/topluluk/[id]`, `/topluluk/etiket/[tag]`
front-end tarafında `ContentPage variant="stub"` ile kilitlendi (egitimler/
sunucular deseniyle aynı), gerçek sorgu/DB çağrısı yapmıyor. tsc/lint temiz,
qa-tester'ın eklediği 7 entegrasyon testi (`src/app/topluluk/stub-routes.test.ts`)
PASS. Denetim kurulu (security-auditor + code-reviewer + qa-tester +
a11y-auditor + ux-psychologist) çalıştı, bulgular:

**KRİTİK — front-end kilidi RLS ile senkron değil, gerçek bypass var.**
`supabase/migrations/0012_topluluk_schema.sql` içindeki `topics`/
`topic_messages` RLS politikaları hâlâ herkese açık (anon SELECT `using (true)`,
authenticated INSERT serbest — haftalık limit dışında engel yok). Giriş yapmış
herhangi bir kullanıcı, sitenin arayüzünü hiç kullanmadan, kendi tarayıcı
konsolundan `NEXT_PUBLIC_SUPABASE_ANON_KEY` + kendi oturum JWT'siyle Supabase
REST endpoint'ine doğrudan POST atıp konu/mesaj oluşturabilir; bu içerik
anon dahil herkes tarafından REST üzerinden okunabilir ve hâlâ aktif olan
`/api/topluluk/paketle` ile kalıcı bir "article"a bile dönüştürülebilir.
Front-end kilidi görünürlüğü kapatıyor ama erişim kontrolünü kapatmıyor —
"moderasyon hazır olmadan riskli" gerekçesini fiilen boşa çıkarıyor.

**Güncelleme (2026-09-21, aynı gün):** Koordinatör oturum onayıyla düzeltme
migration'ı YAZILDI — `supabase/migrations/0034_restrict_topic_inserts_to_moderators.sql`.
`topics_insert_own` ve `topic_messages_insert_own_while_open` INSERT
politikalarına 0012'deki tüm mevcut koşulları (author_id, ban kontrolü,
haftalık limit / status='open') koruyarak `public.is_moderator(auth.uid())`
şartı eklendi — artık yalnızca moderatörler yeni konu/mesaj yazabiliyor.
SELECT politikalarına (`topics_select_all`, `topic_messages_select_all`)
bilinçli olarak dokunulmadı, okuma herkese açık kalıyor. **Bu migration
HENÜZ SUPABASE'DE ÇALIŞTIRILMADI** — sadece dosya olarak repoda duruyor,
talimat gereği hiçbir ajan Supabase'e bağlanıp uygulamadı. Kullanıcının
bunu Supabase Dashboard > SQL Editor'de (veya `supabase db push` ile)
çalıştırması gerekiyor. Geçici bir önlem olarak yorumlanmış — topluluk
gerçek moderasyon altyapısıyla açıldığında bu kısıt gözden geçirilmeli.

**Yan bulgu (Orta):** Moderatör panelindeki Topluluk sekmesi
(`moderator/topluluk-panel.tsx`) `/topluluk/[id]`'ye linkliyor ama o route
artık stub — moderatör olası bir kötüye kullanım içeriğini sitenin kendi
arayüzünden göremiyor/inceleyemiyor (yukarıdaki kritik açığı daha da
riskli kılıyor, tespit yolu yok).

**Kapsam dışı bırakılan diğer bulgular** (Yüksek/Orta, acil değil, ayrı bir
frontend-builder turunda ele alınabilir): `search-bar.tsx`'teki topluluk-içi
arama akışı hâlâ stub'a çarpıp sessizce sonuç vermiyor; açık temada
"Yakında"/"TOPLULUK" rozetleri AA kontrast eşiğinin altında
(`content-page.tsx`, `amber-600`/`cyan-600`); `BackgroundGallery`
`prefers-reduced-motion`'ı yok sayıyor; navbar/footer'daki "Topluluk" linki
hedefin "yakında" olduğunu önceden bildirmiyor; stub metnindeki öneriler
tıklanabilir link değil; yetim component dosyaları (`featured-posts.tsx` vb.)
silinmedi, dead code olarak duruyor.

</details>

## Hâlâ açık: slider/carousel kullanımı kararı

Önceki oturumun UX araştırması (TÜİK + newslabturkey.org), kullanıcıların
%73'ünün sayfalanmış/galeri/carousel içerikten rahatsız olduğunu
gösteriyor. Ana sayfa hâlâ birden fazla slider kullanıyor. Bu tamamen bir
tasarım/ürün tercihi, kullanıcının kararı — tek taraflı değiştirilmedi.
