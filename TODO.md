# TMP Craft — Sıradaki Adımlar

Son durum: Ana sayfa (hills arka plan, navbar, hamburger menü, info kartları, footer) ve 404 sayfası çalışır durumda. Admin panel için dizinler oluşturuldu ama içi henüz boş — yarım kalan iş burada.

## Şimdi yapılacak: Admin Panel

Kapsam (kararlaştırıldı): kartlar + footer linkleri + navbar yönetimi, şimdilik şifresiz.

1. `src/data/site-content.json` — navbar.logoText, infoCards (title/body/span), footerLinks (label/href) alanlarıyla başlangıç verisi oluştur.
2. `src/app/lib/content.ts` — `getSiteContent()` (fs ile JSON oku) ve `saveSiteContent(data)` (fs ile JSON yaz) fonksiyonları.
3. `src/app/api/content/route.ts` — GET (içeriği döndür) ve POST (içeriği kaydet) route handler'ları.
4. Mevcut bileşenleri JSON'dan veri alacak şekilde güncelle:
   - `navbar.tsx` — `logoText` prop'u ekle (artık hardcoded "TMP Craft" değil)
   - `footer.tsx` — `links` ve `logoText` prop'u ekle, `nav-links.ts`'e olan bağımlılığı kaldır
   - `info-cards.tsx` — `cards` prop'u ekle
   - `menu-toggle.tsx` (client component, fs kullanamaz) — `navLinks` prop olarak dışarıdan alsın
   - `top-controls.tsx` — `navLinks` prop'unu `MenuToggle`'a ilet
   - `page.tsx` ve `not-found.tsx` — `getSiteContent()` çağırıp prop olarak dağıt
5. `nav-links.ts` dosyasını sil (JSON tarafından supersede edildi).
6. `src/app/admin/page.tsx` — client component form: navbar logo metni, footer link listesi (ekle/sil), info kart listesi (başlık/metin/span, ekle/sil). Kaydet butonu `/api/content`'e POST atsın.

## Notlar
- Şifre koruması bilinçli olarak eklenmedi (kullanıcı "şimdilik açık kalsın" dedi) — **deploy öncesi mutlaka eklenmeli**, unutulmamalı.
- Dev server: `~/projects/cagri-site` içinde `npm run dev`, terminal tarafında (tmpcagri-3c) arka planda çalışıyor olabilir, kontrol edip gerekirse tekrar başlat.
- Çalışma modeli: bu Claude Code oturumu (orkestratör) dosya/kod işlerini yapıyor, terminaldeki Claude Code (tmpcagri-3c) kurulum/komut/git işlerini yürütüyor.
