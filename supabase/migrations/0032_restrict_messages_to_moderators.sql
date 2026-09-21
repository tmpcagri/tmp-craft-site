-- Patron kuralı: normal kullanıcılar birbiriyle özel mesajlaşamaz,
-- yalnızca moderatörler mesajlaşabilir. Konu/sayfa bazlı kanal
-- ihtiyacı zaten `mod_chat_messages` (0024) ile karşılanıyor -- bu
-- migration sadece 1:1 DM'i (0004_messages.sql) moderatör-moderatör ile
-- sınırlıyor, aynı `is_owner`/`current_permissions` (0006) fonksiyonlarını
-- kullanarak 0024'teki `can_access_mod_channel` ile aynı "moderatör mi"
-- tanımını tekrar ediyor.
--
-- Mevcut mesajlar (normal kullanıcıların geçmiş DM'leri) silinmiyor --
-- sadece bundan sonra yeni insert'ler kısıtlanıyor. select policy'si
-- (messages_select_participant) değişmiyor, geçmiş konuşmalar okunabilir
-- kalıyor.

create function public.is_moderator(uid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.is_owner(uid)
    or coalesce(array_length(public.current_permissions(uid), 1), 0) > 0;
$$;

comment on function public.is_moderator(uuid) is
  'True if uid is the owner or has at least one moderator permission.
Shared "is this a moderator" definition -- also mirrors the logic
inlined in 0024''s can_access_mod_channel().';

drop policy "messages_insert_as_sender" on public.messages;
create policy "messages_insert_as_sender"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and public.is_moderator(sender_id)
    and public.is_moderator(receiver_id)
  );

-- `public_profiles` (0004) kullanıcı arama sonuçlarını besliyor -- DM artık
-- moderatör-moderatör olduğundan, arama sonucunun moderatör olup
-- olmadığını client'ın süzebilmesi için tek bir boolean ekliyoruz.
-- Hangi izinlere sahip olduğunu DEĞİL, sadece "moderatör mü" bilgisini
-- açığa çıkarıyor -- 0004'teki "hassas sütun ekleme" uyarısıyla tutarlı.
create or replace view public.public_profiles as
select id, username, avatar_url, public.is_moderator(id) as is_moderator
from public.profiles;
