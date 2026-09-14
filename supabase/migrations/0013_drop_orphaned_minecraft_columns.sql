-- Drops the minecraft_username/minecraft_uuid/minecraft_linked_at columns
-- added by 0002_minecraft_profile.sql. They were populated server-side
-- right after a Microsoft/Xbox sign-in -- that whole flow (lib/minecraft.ts,
-- mc-test/, the Xbox Live token exchange in /auth/callback) was removed
-- when Microsoft auth was permanently dropped in favor of Google-only, and
-- nothing in the codebase reads or writes these three columns anymore
-- (verified by a full-text search of src/ and the other migrations).
--
-- Not the same thing as Minecraft skin rendering (TODO.md mentions a
-- lib/minecraft-skin.ts using the public Mojang session-server API) --
-- that feature doesn't currently exist in the codebase either, and even
-- when it did it never depended on these columns; it worked from a
-- UUID the user typed in directly, independent of Microsoft auth.
--
-- Run after 0001-0012, same way (Supabase Dashboard > Database > SQL
-- Editor, or `supabase db push`).

alter table public.profiles
  drop column minecraft_username,
  drop column minecraft_uuid,
  drop column minecraft_linked_at;
