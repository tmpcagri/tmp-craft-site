-- Direct messaging between users, plus a safe public view of `profiles`
-- so users can find who to message (the existing `profiles` RLS only
-- lets a user read their own row / the owner read everyone's).
--
-- Run after 0001-0003, same way (Supabase Dashboard > Database > SQL
-- Editor, or `supabase db push`).

-- 1. Public profile view ---------------------------------------------------
-- Exposes only non-sensitive identity columns, for every user, regardless
-- of caller. Deliberately created WITHOUT `security_invoker = true`, so
-- it runs with the view owner's (postgres, bypasses RLS) privileges and
-- is NOT limited by `profiles_select_own` -- the column list itself is
-- what keeps this safe: is_owner, permissions, device, birth_date,
-- gender, minecraft_* etc. are never selected here, so they can never
-- leak through this view no matter who queries it. Do not add columns to
-- this view without checking they're OK to expose to any signed-in user.
create view public.public_profiles as
select id, username, avatar_url
from public.profiles;

revoke all on public.public_profiles from public, anon;
grant select on public.public_profiles to authenticated;

comment on view public.public_profiles is
  'Safe, non-sensitive subset of profiles (id, username, avatar_url) that
every authenticated user can read, for user search / DMs. Do NOT add
columns here without checking they are OK to expose to anyone.';

-- 2. Messages table ---------------------------------------------------------
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users (id) on delete cascade,
  receiver_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  constraint messages_no_self_send check (sender_id <> receiver_id)
);

comment on table public.messages is
  'Direct messages between two users. Send + mark-as-read only for now,
no editing/deleting/group chat.';

-- Conversation lookups (both directions between a pair, ordered by time).
create index messages_conversation_idx
  on public.messages (
    least(sender_id, receiver_id),
    greatest(sender_id, receiver_id),
    created_at
  );

-- Unread-count / badge queries.
create index messages_receiver_unread_idx
  on public.messages (receiver_id)
  where read_at is null;

alter table public.messages enable row level security;

-- A user can see messages they sent or received.
create policy "messages_select_participant"
  on public.messages for select
  to authenticated
  using (sender_id = auth.uid() or receiver_id = auth.uid());

-- A user can only send as themselves.
create policy "messages_insert_as_sender"
  on public.messages for insert
  to authenticated
  with check (sender_id = auth.uid());

-- The receiver can mark a message read, and only that: sender_id,
-- receiver_id, content and created_at must stay exactly what they were
-- (same subquery-against-self pattern as profiles_update_own_activity
-- in 0001, since RLS `with check` can't restrict individual columns
-- directly).
create policy "messages_update_read_by_receiver"
  on public.messages for update
  to authenticated
  using (receiver_id = auth.uid())
  with check (
    receiver_id = auth.uid()
    and sender_id = (select m.sender_id from public.messages m where m.id = messages.id)
    and receiver_id = (select m.receiver_id from public.messages m where m.id = messages.id)
    and content = (select m.content from public.messages m where m.id = messages.id)
    and created_at = (select m.created_at from public.messages m where m.id = messages.id)
  );

-- No delete policy: messages aren't deletable for now. No update policy
-- for the sender: messages can't be edited after sending.
