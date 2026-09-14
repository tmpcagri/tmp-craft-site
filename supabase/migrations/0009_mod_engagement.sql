-- Mod package engagement: likes, saves (bookmarks), and download-click counts.
--
-- Mod packages themselves are still static mock data (src/app/lib/downloads.ts),
-- not a database table, so we key everything off `item_slug` (text) rather
-- than a foreign key.
--
-- Run this once in the Supabase Dashboard (Database > SQL Editor).

-- 1. Likes + saves ----------------------------------------------------------
-- One row per (user, item, kind). Per-user rows are only ever readable /
-- writable by that user (RLS below) — public aggregate counts go through
-- the security-definer function instead, so anonymous visitors never see
-- who liked what, only how many.
create type public.mod_engagement_kind as enum ('like', 'save');

create table public.mod_engagement (
  user_id uuid not null references auth.users (id) on delete cascade,
  item_slug text not null,
  kind public.mod_engagement_kind not null,
  created_at timestamptz not null default now(),
  primary key (user_id, item_slug, kind)
);

alter table public.mod_engagement enable row level security;

create policy "mod_engagement_select_own"
  on public.mod_engagement for select
  to authenticated
  using (user_id = auth.uid());

create policy "mod_engagement_insert_own"
  on public.mod_engagement for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "mod_engagement_delete_own"
  on public.mod_engagement for delete
  to authenticated
  using (user_id = auth.uid());

-- Public aggregate counts (anon + authenticated), without exposing rows.
create function public.mod_engagement_counts(slug text)
returns table (kind public.mod_engagement_kind, count bigint)
language sql
security definer
set search_path = public
stable
as $$
  select kind, count(*)
  from public.mod_engagement
  where item_slug = slug
  group by kind;
$$;

grant execute on function public.mod_engagement_counts(text) to anon, authenticated;

-- 2. Download click counter --------------------------------------------------
-- Download isn't wired to real files yet — this counts intent (button
-- clicks) as an honest, visible trust signal ("X kişi indirdi"). Anyone,
-- including anonymous visitors, can bump it: no per-user identity is
-- needed or stored for a download click, and gating it behind login would
-- undercount most real traffic. No anti-abuse/rate-limiting yet — fine for
-- a small community site at this stage, but worth revisiting if it's ever
-- gamed.
create table public.mod_download_counts (
  item_slug text primary key,
  count bigint not null default 0
);

alter table public.mod_download_counts enable row level security;

create policy "mod_download_counts_select_all"
  on public.mod_download_counts for select
  to anon, authenticated
  using (true);

create function public.increment_download_count(slug text)
returns bigint
language sql
security definer
set search_path = public
as $$
  insert into public.mod_download_counts (item_slug, count)
  values (slug, 1)
  on conflict (item_slug) do update set count = mod_download_counts.count + 1
  returning count;
$$;

grant execute on function public.increment_download_count(text) to anon, authenticated;
