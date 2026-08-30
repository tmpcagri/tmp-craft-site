-- Profiles + moderator permissions
--
-- Replaces the src/data/users.json mock with a real table driven by
-- Supabase Auth (Google / Microsoft OAuth). One row per auth.users row,
-- created automatically on first sign-in via the handle_new_user trigger.
--
-- Run this once in the Supabase Dashboard (Database > SQL Editor) on the
-- "tmp-craft" project, or via `supabase db push` once the project is linked.

-- 1. Permission tabs -----------------------------------------------------
-- Mirrors ModeratorTab in src/app/lib/permissions.ts. Add new tabs here
-- (ALTER TYPE ... ADD VALUE) and in permissions.ts together.
create type public.moderator_permission as enum ('cards', 'links');

-- 2. Profiles table -------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  avatar_url text not null default '',
  provider text not null,
  device text not null default '',
  is_owner boolean not null default false,
  permissions public.moderator_permission[] not null default '{}',
  joined_at timestamptz not null default now(),
  last_activity_at timestamptz,
  last_activity_change text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'One row per authenticated user. is_owner = site owner (full access,
can edit everyone''s permissions). permissions = which /yonetim tabs
a moderator can act on in the moderator panel (/admin).';

-- 3. Auto-create a profile row on first sign-in ---------------------------
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url, provider, joined_at)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', ''),
    coalesce(new.raw_app_meta_data ->> 'provider', 'unknown'),
    new.created_at
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. updated_at bookkeeping ------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 5. Row Level Security -----------------------------------------------------
alter table public.profiles enable row level security;

-- Every signed-in user can read their own row.
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- The owner can read every row (needed for the /yonetim user list).
create policy "profiles_select_owner_all"
  on public.profiles for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles me
      where me.id = auth.uid() and me.is_owner
    )
  );

-- A user may update their own non-privileged activity fields, but NOT
-- their own permissions or is_owner flag (prevents self-promotion).
create policy "profiles_update_own_activity"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and is_owner = (select p.is_owner from public.profiles p where p.id = auth.uid())
    and permissions = (select p.permissions from public.profiles p where p.id = auth.uid())
  );

-- Only the owner can edit anyone's permissions / is_owner flag.
create policy "profiles_update_owner_all"
  on public.profiles for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles me
      where me.id = auth.uid() and me.is_owner
    )
  );

-- No client-side insert/delete policies: rows are created only by the
-- handle_new_user trigger (security definer) and deleted via the
-- on delete cascade from auth.users.

-- 6. First owner ------------------------------------------------------------
-- After Çağrı signs in once via Google OAuth on the live site, run:
--   update public.profiles set is_owner = true where username = 'cagri';
-- (or match on id / provider — check `select * from public.profiles;` first)
