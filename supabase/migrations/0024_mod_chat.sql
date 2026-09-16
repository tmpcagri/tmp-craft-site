-- Moderatörler arası TEK grup sohbeti -- kullanıcı-kullanıcı DM (bkz.
-- 0004_messages.sql, sender/receiver çifti) ile karıştırılmasın, bu ayrı
-- ve basit bir tablo: herkes aynı tek odayı okuyor/yazıyor, alıcı yok.
-- Erişim: owner veya en az bir moderator_permission'ı olan herkes
-- (belirli bir tab'a bağlı değil -- bu "hangi sayfayı yönetebiliyorsun"
-- değil, "moderatör ekibinin bir parçası mısın" sorusu).
create table public.mod_chat_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.profiles (id) on delete set null,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

comment on table public.mod_chat_messages is
  'Moderatör ekibinin paylaştığı tek grup sohbeti (/admin kimlik bölgesinin
altında). sender_id, hesabı silinen bir moderatörün eski mesajlarını
kaybetmemek için ON DELETE SET NULL -- topics.author_id ile aynı desen.';

create index mod_chat_messages_created_idx
  on public.mod_chat_messages (created_at);

alter table public.mod_chat_messages enable row level security;

create policy "mod_chat_select_moderators"
  on public.mod_chat_messages for select
  to authenticated
  using (
    public.is_owner(auth.uid())
    or array_length(public.current_permissions(auth.uid()), 1) > 0
  );

create policy "mod_chat_insert_own_if_moderator"
  on public.mod_chat_messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and (
      public.is_owner(auth.uid())
      or array_length(public.current_permissions(auth.uid()), 1) > 0
    )
  );
