-- Optional Minecraft/Xbox profile info, resolved server-side right after a
-- Microsoft sign-in (see src/app/lib/minecraft.ts + the
-- /auth/callback route). Stays null for accounts that: signed in with
-- Google, have no Xbox profile on their Microsoft account, or own no
-- Minecraft license.
--
-- Run after 0001_profiles_and_permissions.sql, same way (Supabase
-- Dashboard > Database > SQL Editor, or `supabase db push`).

alter table public.profiles
  add column minecraft_username text,
  add column minecraft_uuid text,
  add column minecraft_linked_at timestamptz;
