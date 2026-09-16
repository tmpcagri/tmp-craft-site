-- Moderatörün insan-okunur ünvanı (ör. "Mod Ekleyicisi", "Topluluk
-- Yöneticisi") -- izin checkbox'larından bağımsız, sahibin elle yazdığı
-- düz bir metin. Otomatik izin-kombinasyonundan rol türetmek yerine (bu
-- yaklaşım rozet çakışması sorunu çıkarıyordu, bkz. silinen demo
-- admin/moderator-roles.ts), sahip her moderatöre tek bir sabit ünvan
-- atıyor. /admin'deki kimlik bölgesinde yaşın altında gösteriliyor.

alter table public.profiles add column role_label text not null default '';
