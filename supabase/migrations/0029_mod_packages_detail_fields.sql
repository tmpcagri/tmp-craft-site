-- Mod paketi detay sayfasını zenginleştiren alanlar -- moderatörün "genişlet
-- mod paketleri" isteğinin ilk (küçük-orta) parçası. İkinci parça (versiyon/
-- loader matrisi, mod_package_versions tablosu) ayrı bir migration'da.
--
--   background_image  -- detay sayfası için icon_image'dan ayrı, geniş arka
--                         plan görseli (bkz. mod-paketi/[slug] hero bandı).
--   gallery_images     -- ek içerik görselleri, sıralı bir dizi (guide_details
--                         tek image_url'in aksine burada birden fazla olabilir).
--   body_text          -- description'ın ötesinde uzun detay metni, aynı
--                         guide_details.body_text deseni.
--   schematic_java_url/schematic_bedrock_url -- projeler/[slug]'daki
--                         SchematicDownloadButton'ın aynısı burada da
--                         kullanılacak (v1 yine plain URL, dosya yükleme değil).
--
-- Run after 0028.

alter table public.mod_packages
  add column background_image text,
  add column gallery_images text[] not null default '{}',
  add column body_text text,
  add column schematic_java_url text,
  add column schematic_bedrock_url text;
