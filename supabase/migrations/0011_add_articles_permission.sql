-- Adds the "articles" moderator tab (trigger AI packaging of a Topluluk
-- konusu into a permanent article, review objections, finalize), mirroring
-- ModeratorTab in src/app/lib/permissions.ts.
--
-- Run this alone, in its own statement, before 0012 (Postgres does not
-- allow a new enum value to be used in the same transaction it was added
-- in) -- Supabase Dashboard (Database > SQL Editor), or `supabase db push`.

alter type public.moderator_permission add value 'articles';
