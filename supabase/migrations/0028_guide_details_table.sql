-- Real, moderator-manageable enrichment for /projeler/[slug] (Build/Farm
-- rehberleri) -- the guides themselves stay static (src/app/lib/guides.ts,
-- there's no "create a new guide" flow), but a moderator can now attach a
-- YouTube video, an image + longer write-up, and Java/Bedrock schematic
-- download links to any existing guide by its slug. One row per guide,
-- upserted by slug -- same "additive overlay on a static seed" idea as
-- 0019_mod_packages_table/0020_server_cards_table, except here it enriches
-- an EXISTING static item instead of adding a brand new one.
--
-- v1 ships schematic links as plain URLs (not uploaded files) -- the
-- existing /api/admin/upload only accepts image/* at an 8MB cap, and
-- widening that to arbitrary schematic file types is a separate
-- security/scope decision left for later if it's ever needed.
--
-- Run after 0027 has been committed (needs the 'guides' moderator_permission
-- value from 0027 to already exist).

create table public.guide_details (
  slug text primary key,
  youtube_url text,
  image_url text,
  body_text text,
  schematic_java_url text,
  schematic_bedrock_url text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.guide_details enable row level security;

create policy "guide_details_select_all"
  on public.guide_details for select
  to anon, authenticated
  using (true);

create policy "guide_details_write_moderator"
  on public.guide_details for all
  to authenticated
  using (
    public.is_owner(auth.uid())
    or 'guides' = any(public.current_permissions(auth.uid()))
  )
  with check (
    public.is_owner(auth.uid())
    or 'guides' = any(public.current_permissions(auth.uid()))
  );
