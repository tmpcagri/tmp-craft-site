-- Adds the "guides" moderator tab (Ana Sayfa -> Build/Farm Kartları: hangi
-- rehberlerin anasayfa bandında öne çıkacağı, + Rehber Detayları: her
-- rehberin video/görsel/yazı/şematik eklerini yönetmek), mirroring
-- ModeratorTab in src/app/lib/permissions.ts.
--
-- Run after 0026 has been committed.

alter type public.moderator_permission add value 'guides';
