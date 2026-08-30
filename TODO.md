# TMP Craft — Sıradaki Adımlar

Son durum: Ana sayfa (hills arka plan, doku efekti, navbar, hamburger menü, hero/secondary/community slider'lar, footer), 404 sayfası, Moderatör Paneli (`/admin`) ve Yönetim Paneli (`/yonetim`) çalışır durumda.

## Bilinçli olarak ertelenen
- Moderatör panelindeki her karta içerik yükleme / önizleme / büyük-küçük başlık / yönlendirme linki alanları — kullanıcı "önce ana sayfaya bir şeyler ekleyelim, sonra admin panelinde kontrolleri ekleriz" dedi, bu iş sırada bekliyor.
- Gerçek kullanıcı bazlı auth ve OAuth (Google/Microsoft) — Supabase ile kullanıcı bağlanınca `lib/auth.ts`, `lib/permissions.ts`, `lib/users.ts` içindeki placeholder fonksiyonlar gerçek veriyle değiştirilecek.

## Notlar
- **Kritik güvenlik notu:** Hem `/admin` (Moderatör Paneli) hem `/yonetim` (Yönetim Paneli) şu an şifresiz/auth'suz — kullanıcı bilinçli olarak "şimdilik açık kalsın" dedi ama **deploy öncesi ikisine de mutlaka auth eklenmeli**, yoksa herkes içerik değiştirebilir veya kullanıcı yetkilerini düzenleyebilir.
- Dev server: `~/projects/cagri-site` içinde `npm run dev`, terminal tarafında arka planda çalışıyor olabilir, kontrol edip gerekirse tekrar başlat.
- Çalışma modeli: bu Claude Code oturumu (orkestratör) dosya/kod işlerini yapıyor, terminaldeki Claude Code kurulum/komut/git işlerini yürütüyor.
