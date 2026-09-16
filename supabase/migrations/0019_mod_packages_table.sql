-- Real, moderator-uploadable mod packages -- these are ADDED ON TOP OF the
-- static seed list in src/app/lib/downloads.ts (that list stays as-is, the
-- two are merged at read time by getAllDownloadItems()). We're not
-- migrating the seed data into this table right now to avoid a large,
-- risky refactor of every page that still imports the static array
-- directly -- this table is purely for new content going forward.
--
-- Run after 0018 has been committed (needs the 'mods' moderator_permission
-- value from 0017 to already exist).

create table public.mod_packages (
  slug text primary key,
  name text not null,
  category text not null,
  description text not null,
  gradient text not null default 'from-emerald-500 to-teal-700',
  game_version text not null,
  loader text not null,
  environment text not null,
  license text not null,
  depends_on text[] not null default '{}',
  author text not null,
  icon_image text,
  author_link text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.mod_packages enable row level security;

create policy "mod_packages_select_all"
  on public.mod_packages for select
  to anon, authenticated
  using (true);

create policy "mod_packages_write_moderator"
  on public.mod_packages for all
  to authenticated
  using (
    public.is_owner(auth.uid())
    or 'mods' = any(public.current_permissions(auth.uid()))
  )
  with check (
    public.is_owner(auth.uid())
    or 'mods' = any(public.current_permissions(auth.uid()))
  );
