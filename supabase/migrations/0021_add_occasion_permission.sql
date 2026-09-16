-- Adds the "occasion" moderator tab (Ana Sayfa -> Özel Günler Teması:
-- resmi/yas/dini tema, otomatik tarih zamanlaması, arka plan görseli +
-- şeffaflık), mirroring ModeratorTab in src/app/lib/permissions.ts.
--
-- Run after 0018/0019/0020 have been committed.

alter type public.moderator_permission add value 'occasion';
