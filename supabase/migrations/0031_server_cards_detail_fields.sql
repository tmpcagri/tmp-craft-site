-- Sunucu kartı detay alanları -- moderatörün genişletilmiş sunucu ekleme
-- formu için (mod_packages'in 0029'daki detail-fields deseninin aynısı,
-- isimlendirme tutarlılığı için description/body_text buradan alındı).
--
--   description/body_text -- kısa + uzun açıklama, mod_packages/
--                             guide_details'teki aynı çift.
--   image_url             -- tek görsel (galeri değil), var olan
--                             "sunucular" upload section'ı (8MB sınır,
--                             "servers" izni) yeniden kullanılacak, yeni
--                             bir section eklemeye gerek yok.
--   video_url              -- düz "İzle" linki, mod_packages.youtube_url'in
--                             aksine embed player YOK -- herhangi bir
--                             platformdan bir video linki olabilir.
--   platform                -- 'java' | 'bedrock' | 'both'. 3'lü: gerçek
--                             sunucular Geyser/cross-play ile aynı anda
--                             iki platformu da destekleyebiliyor, ikili
--                             (java/bedrock) bu durumu ifade edemezdi.
--                             Mevcut satırlar (statik + DB) için hangi
--                             platform olduğu bilinmediğinden NULL
--                             bırakılıyor -- moderatör düzenleyince dolar.
--   ip_address/server_password -- ikisi de opsiyonel (bazı Bedrock
--                             sunucuları şifre istemiyor). server_password
--                             BİLEREK herkese açık okunabilir kalıyor
--                             (server_cards_select_all -- to anon,
--                             authenticated) -- bu bir güvenlik açığı değil,
--                             amaç zaten oyuncunun IP+şifreyi görüp
--                             bağlanabilmesi.
--   social_links            -- {label, url} çiftlerinin JSON dizisi (ör.
--                             Discord/Website/Twitter) -- text[] değil
--                             jsonb, çünkü her girdinin 2 alanı var
--                             (gallery_images'teki düz text[]'ten farkı bu).
--
-- Run after 0029.

alter table public.server_cards
  add column description text,
  add column body_text text,
  add column image_url text,
  add column video_url text,
  add column platform text check (platform in ('java', 'bedrock', 'both')),
  add column ip_address text,
  add column server_password text,
  add column social_links jsonb not null default '[]';
