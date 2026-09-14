-- Owner moderation: temporary/permanent bans. Deleting a user is handled
-- via the Supabase Admin API (service_role, server-only) in the app code,
-- not here -- deleting the auth.users row cascades to profiles on its own
-- (see 0001's `on delete cascade`).
--
-- banned_until = NULL means not banned. A timestamp far in the future
-- (year 9999) represents a permanent ban -- avoids a second boolean column
-- that could drift out of sync with banned_until.
--
-- No RLS change needed: profiles_update_owner_all (0006) already lets the
-- owner update any column on any row. A banned user's own
-- profiles_update_own_activity policy still blocks them from touching
-- banned_until/ban_reason themselves (not listed as allowed to change).
--
-- Run after 0001-0007, same way (Supabase Dashboard > Database > SQL
-- Editor, or `supabase db push`).

alter table public.profiles
  add column banned_until timestamptz,
  add column ban_reason text;

-- Same recursion-safe pattern as is_owner()/current_permissions() in 0006:
-- a raw subquery on profiles from inside a policy ON profiles would
-- re-trigger this table's own RLS and recurse (42P17). Route the
-- self-lookup through a SECURITY DEFINER function instead.
create function public.current_ban(uid uuid)
returns timestamptz
language sql
security definer
stable
set search_path = public
as $$
  select banned_until from public.profiles where id = uid;
$$;

-- profiles_update_own_activity's `with check` only re-affirms is_owner and
-- permissions stay unchanged -- it doesn't currently constrain
-- banned_until/ban_reason, which means a non-owner could technically
-- unban themselves via the same "update my own activity" path used for
-- device/last_activity fields. Close that gap explicitly.
drop policy "profiles_update_own_activity" on public.profiles;
create policy "profiles_update_own_activity"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and is_owner = public.is_owner(auth.uid())
    and permissions = public.current_permissions(auth.uid())
    and banned_until is not distinct from public.current_ban(auth.uid())
  );
