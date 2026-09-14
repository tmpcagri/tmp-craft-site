-- Root-cause fix for "Database error saving new user" on Microsoft sign-in.
--
-- 0005's handle_new_user() computed:
--   base_username := coalesce(full_name, name, split_part(email, '@', 1))
-- Some personal Microsoft accounts return no `full_name`/`name` AND no
-- `email` claim at all (new.email is NULL). split_part(NULL, '@', 1) is
-- also NULL, so base_username ends up NULL -> candidate is NULL -> the
-- collision-check while loop's `username = candidate` is never true for a
-- NULL candidate (NULL = NULL is NULL, not true in SQL) -> the loop never
-- runs -> the insert is attempted with username = NULL -> violates
-- `profiles.username text not null` -> the trigger raises, and Supabase
-- surfaces it to the client as the generic "Database error saving new
-- user". This is independent of, and was hidden behind, the earlier
-- `XboxLive.signin` scope issue.
--
-- Fix: give base_username a final non-null fallback before the collision
-- loop runs, so it always has something to compare against.
--
-- Run after 0001-0006, same way (Supabase Dashboard > Database > SQL
-- Editor, or `supabase db push`).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  candidate text;
  suffix int := 0;
begin
  base_username := coalesce(
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'name', ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'kullanici'
  );
  candidate := base_username;

  while exists (select 1 from public.profiles where username = candidate) loop
    suffix := suffix + 1;
    candidate := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, username, avatar_url, provider, joined_at)
  values (
    new.id,
    candidate,
    coalesce(new.raw_user_meta_data ->> 'avatar_url', ''),
    coalesce(new.raw_app_meta_data ->> 'provider', 'unknown'),
    new.created_at
  );
  return new;
end;
$$;
