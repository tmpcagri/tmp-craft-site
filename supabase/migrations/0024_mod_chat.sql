-- Moderatörler arası sohbet -- kullanıcı-kullanıcı DM'den (bkz.
-- 0004_messages.sql, sender/receiver çifti) tamamen ayrı: burada alıcı
-- yok, bir "channel" içindeki herkes aynı akışı okuyor/yazıyor.
--
-- Üç katman:
--  1. 'genel' -- tüm moderatör ekibi (owner veya en az bir izni olan
--     herkes), site geneli sohbet.
--  2. Grup kanalları ('ana-sayfa', 'mod-paketleri', 'sunucular',
--     'topluluk', 'site') -- eski /admin GROUPS gruplamasıyla birebir
--     aynı (bkz. admin/page.tsx'in wipe'tan önceki hali): o gruptaki
--     tab'lardan EN AZ BİRİNE sahip olan moderatörler görebiliyor. Tab
--     başına ayrı kanal açmadık (11 tab çok parçalı/boş kalırdı).
--  3. Birebir (1:1) -- ayrı bir sistem YOK, mevcut /mesajlar (lib/
--     messages.ts) kullanılıyor, moderatörler de birer kullanıcı zaten.
create table public.mod_chat_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.profiles (id) on delete set null,
  channel text not null default 'genel' check (
    channel in ('genel', 'ana-sayfa', 'mod-paketleri', 'sunucular', 'topluluk', 'site')
  ),
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

comment on table public.mod_chat_messages is
  'Moderatör ekibinin paylaştığı sohbet kanalları (/admin kimlik
bölgesinin altında) -- "genel" + admin GROUPS gruplamasına denk gelen
kanallar. sender_id, hesabı silinen bir moderatörün eski mesajlarını
kaybetmemek için ON DELETE SET NULL -- topics.author_id ile aynı desen.';

create index mod_chat_messages_channel_created_idx
  on public.mod_chat_messages (channel, created_at);

-- Bir kullanıcının bir mod-chat kanalını görebilip/yazabilip
-- yazamayacağını tek yerden karara bağlıyor -- RLS policy'lerinin
-- ikisi de (select/insert) bunu çağırıyor, ileride yeni bir kanal
-- eklenirse tek yer değişir. Grup-tab eşlemesi admin/page.tsx'teki
-- (gelecekte yeniden kurulacak) GROUPS sabitiyle senkron tutulmalı.
create function public.can_access_mod_channel(uid uuid, channel text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select case channel
    when 'genel' then
      public.is_owner(uid)
      or coalesce(array_length(public.current_permissions(uid), 1), 0) > 0
    when 'ana-sayfa' then
      public.is_owner(uid)
      or public.current_permissions(uid) && array['cards','occasion','ticker','hero','panels']::public.moderator_permission[]
    when 'mod-paketleri' then
      public.is_owner(uid)
      or public.current_permissions(uid) && array['mods']::public.moderator_permission[]
    when 'sunucular' then
      public.is_owner(uid)
      or public.current_permissions(uid) && array['servers']::public.moderator_permission[]
    when 'topluluk' then
      public.is_owner(uid)
      or public.current_permissions(uid) && array['creators','articles','topluluk_hero']::public.moderator_permission[]
    when 'site' then
      public.is_owner(uid)
      or public.current_permissions(uid) && array['links']::public.moderator_permission[]
    else false
  end;
$$;

alter table public.mod_chat_messages enable row level security;

create policy "mod_chat_select_by_channel_access"
  on public.mod_chat_messages for select
  to authenticated
  using (public.can_access_mod_channel(auth.uid(), channel));

create policy "mod_chat_insert_own_by_channel_access"
  on public.mod_chat_messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and public.can_access_mod_channel(auth.uid(), channel)
  );
