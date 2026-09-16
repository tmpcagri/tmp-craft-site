-- Mod paketi detay sayfasına iki ekleme:
--   1. youtube_url -- paketin tanıtım videosu, detay sayfasında gömülü player.
--   2. mod_package_comments -- paket başına yorum bölümü.
--
-- mod_packages 0019'da olduğu gibi, statik tohum listesindeki (downloads.ts)
-- paketler bu tabloda YOK -- bu yüzden mod_package_comments da 0009'daki
-- mod_engagement/mod_download_counts deseniyle aynı: item_slug'a FK DEĞİL,
-- düz text (statik paketlere de yorum yazılabilsin diye).
--
-- Run after 0025.

alter table public.mod_packages
  add column youtube_url text;

create table public.mod_package_comments (
  id uuid primary key default gen_random_uuid(),
  item_slug text not null,
  -- topic_messages'teki gibi cascade: yorumlar kalıcı "içerik" değil,
  -- hesap silinince kendi yorumlarının gitmesi tutarlı ve istenen bir şey.
  author_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

comment on table public.mod_package_comments is
  'Mod paketi detay sayfasındaki yorumlar. item_slug hem mod_packages
tablosundaki hem de downloads.ts''teki statik paketleri kapsar, o yüzden FK
değil -- bkz. mod_engagement/mod_download_counts (0009).';

create index mod_package_comments_slug_idx
  on public.mod_package_comments (item_slug, created_at);

alter table public.mod_package_comments enable row level security;

create policy "mod_package_comments_select_all"
  on public.mod_package_comments for select
  to anon, authenticated
  using (true);

create policy "mod_package_comments_insert_own"
  on public.mod_package_comments for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and not public.is_currently_banned(auth.uid())
  );

-- Kendi yorumunu silebilir, ya da 'mods' iznine sahip moderatör/owner
-- herkesin yorumunu silebilir (uygunsuz içerik moderasyonu için).
create policy "mod_package_comments_delete_own_or_moderator"
  on public.mod_package_comments for delete
  to authenticated
  using (
    author_id = auth.uid()
    or public.is_owner(auth.uid())
    or 'mods' = any(public.current_permissions(auth.uid()))
  );
