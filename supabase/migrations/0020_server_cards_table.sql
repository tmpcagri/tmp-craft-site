-- Real, moderator-manageable server cards for the homepage Sunucular
-- spotlight -- same "additive merge" approach as 0019_mod_packages_table:
-- the static SERVER_CARDS array in src/app/page.tsx stays as a fallback
-- seed, this table is for new servers moderators add going forward.
--
-- Run after 0018 has been committed (needs the 'servers'
-- moderator_permission value from 0018 to already exist).

create table public.server_cards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  current_players int not null default 0,
  max_players int not null default 0,
  display_order int not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.server_cards enable row level security;

create policy "server_cards_select_all"
  on public.server_cards for select
  to anon, authenticated
  using (true);

create policy "server_cards_write_moderator"
  on public.server_cards for all
  to authenticated
  using (
    public.is_owner(auth.uid())
    or 'servers' = any(public.current_permissions(auth.uid()))
  )
  with check (
    public.is_owner(auth.uid())
    or 'servers' = any(public.current_permissions(auth.uid()))
  );
