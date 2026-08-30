-- Editable profile fields (username already existed): birth date and
-- gender, filled in by the user themselves via the new "Profili Düzenle"
-- panel (client-side Supabase queries against `profiles`).
--
-- No RLS change needed: `profiles_update_own_activity` (0001) only locks
-- is_owner/permissions to their current value in its `with check` clause,
-- every other column — including these new ones — is already updatable
-- by the row's own user.
--
-- Run after 0001 and 0002, same way (Supabase Dashboard > Database > SQL
-- Editor, or `supabase db push`).

alter table public.profiles
  add column birth_date date,
  add column gender text;
