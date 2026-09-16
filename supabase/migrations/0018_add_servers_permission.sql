-- Adds the "servers" moderator tab (manage the homepage Sunucular cards
-- from /admin), mirroring ModeratorTab in src/app/lib/permissions.ts.
--
-- Run this once in the Supabase Dashboard (Database > SQL Editor), AFTER
-- 0017 has been run and committed (each new enum value needs its own
-- transaction before it can be used elsewhere).

alter type public.moderator_permission add value 'servers';
