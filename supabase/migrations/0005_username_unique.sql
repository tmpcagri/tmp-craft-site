-- Security fix (found by QA): `username` had no unique constraint, and
-- the owner-bootstrap step in TODO.md matched on username. Anyone could
-- sign up and rename themselves to "cagri" via the new "Profili Düzenle"
-- panel (0003) and race for/collide with the real owner's row --
-- username-squatting -> privilege escalation.
--
-- Before running this: check for existing duplicates first, same
-- caution as the owner-bootstrap note in 0001 --
--   select username, count(*) from public.profiles group by username having count(*) > 1;
-- -- resolve any collisions manually (there shouldn't be any yet, sign-in
-- has barely been live) before the alter table below, or it will fail.
--
-- Run after 0001-0004, same way (Supabase Dashboard > Database > SQL
-- Editor, or `supabase db push`).

alter table public.profiles
  add constraint profiles_username_unique unique (username);

-- handle_new_user (0001) picked the initial username straight from the
-- OAuth full_name/email with no collision check. With the constraint
-- above, two people who happen to share a default name (or one signing
-- in twice with different providers) would now fail sign-up outright --
-- so redefine it to fall back to a numeric suffix when the first choice
-- is taken.
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
    split_part(new.email, '@', 1)
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
