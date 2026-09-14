-- URGENT fix (found via Supabase Auth/Postgres logs): every `profiles`
-- query was 500ing with `42P17 infinite recursion detected in policy for
-- relation "profiles"`.
--
-- Cause: three policies from 0001 checked the *acting* user's own
-- is_owner/permissions by subquerying `profiles` from inside a policy
-- defined ON `profiles` (`profiles_select_owner_all`,
-- `profiles_update_owner_all`, and the two subqueries in
-- `profiles_update_own_activity`'s `with check`). Evaluating that
-- subquery re-triggers RLS on `profiles`, including the very policy
-- being evaluated -> infinite recursion. This was latent since 0001 but
-- only started firing once real sign-ins (Google) began hitting
-- `account-button.tsx`'s live profile query.
--
-- Fix: move the self-lookup into SECURITY DEFINER functions. Run from
-- the SQL Editor (owned by `postgres`, a superuser that always bypasses
-- RLS), so calls inside these functions don't re-enter `profiles`'s
-- policies -- no recursion.
--
-- Independent of the Microsoft OAuth issue, but blocking, so run this
-- ASAP regardless of that. Also fixes the same bug found on review in
-- 0004's `messages_update_read_by_receiver` policy (see below). Run
-- after 0001-0005, same way (Supabase Dashboard > Database > SQL
-- Editor, or `supabase db push`).

create function public.is_owner(uid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = uid and is_owner);
$$;

create function public.current_permissions(uid uuid)
returns public.moderator_permission[]
language sql
security definer
stable
set search_path = public
as $$
  select permissions from public.profiles where id = uid;
$$;

drop policy "profiles_select_owner_all" on public.profiles;
create policy "profiles_select_owner_all"
  on public.profiles for select
  to authenticated
  using (public.is_owner(auth.uid()));

drop policy "profiles_update_owner_all" on public.profiles;
create policy "profiles_update_owner_all"
  on public.profiles for update
  to authenticated
  using (public.is_owner(auth.uid()));

-- Same "keep is_owner/permissions locked to their current value" intent
-- as 0001, just via the recursion-safe functions above instead of a
-- raw self-subquery.
drop policy "profiles_update_own_activity" on public.profiles;
create policy "profiles_update_own_activity"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and is_owner = public.is_owner(auth.uid())
    and permissions = public.current_permissions(auth.uid())
  );

-- Same class of bug, found while reviewing this one: 0004's
-- `messages_update_read_by_receiver` has the identical anti-pattern
-- (subquerying `messages` from inside a policy on `messages`, to keep
-- sender_id/receiver_id/content/created_at locked). 0004 already ran,
-- so this is live too -- just not yet hit, since nothing has called
-- markAsRead against real data. Fixing it here before it does.
create function public.message_locked_fields(mid uuid)
returns table (
  sender_id uuid,
  receiver_id uuid,
  content text,
  created_at timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select sender_id, receiver_id, content, created_at
  from public.messages
  where id = mid;
$$;

drop policy "messages_update_read_by_receiver" on public.messages;
create policy "messages_update_read_by_receiver"
  on public.messages for update
  to authenticated
  using (receiver_id = auth.uid())
  with check (
    receiver_id = auth.uid()
    and (sender_id, receiver_id, content, created_at) = (
      select sender_id, receiver_id, content, created_at
      from public.message_locked_fields(messages.id)
    )
  );
