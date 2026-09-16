-- Adds the "ticker", "hero", "panels" and "topluluk_hero" moderator tabs
-- (Ana Sayfa -> CANLI şeridi / Hero Kartları / Öne Çıkan Modlar / Topluluk
-- alt yazıları), mirroring ModeratorTab in src/app/lib/permissions.ts.
--
-- Run after 0021 has been committed. Each ADD VALUE needs its own
-- statement/commit before the value can be referenced elsewhere, so these
-- are intentionally separate ALTER TYPE calls in sequence (Supabase's SQL
-- editor runs the whole script as one go, which is fine as long as none of
-- these new values are USED later in this same script).
alter type public.moderator_permission add value 'ticker';
alter type public.moderator_permission add value 'hero';
alter type public.moderator_permission add value 'panels';
alter type public.moderator_permission add value 'topluluk_hero';
