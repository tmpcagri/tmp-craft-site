-- Adds the "creators" moderator tab (manage /topluluk "Sevebileceğin
-- Yayıncılar" list from /admin), mirroring ModeratorTab in
-- src/app/lib/permissions.ts.
--
-- Run this once in the Supabase Dashboard (Database > SQL Editor).

alter type public.moderator_permission add value 'creators';
