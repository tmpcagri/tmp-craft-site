-- Guarantees, at the database layer, that a non-email/password account can
-- never hold owner or moderator privilege -- even from a manual edit in the
-- Supabase SQL editor, a service-role call, or the accept_permission_grant()
-- RPC. Owner's rule: admin accounts must be email/password only (created by
-- us), never Google, to cut account-takeover risk. RLS alone doesn't cover
-- this (RLS is bypassed by service_role, and the SQL editor runs as
-- postgres/service_role too) -- a table CHECK constraint is enforced for
-- every writer, no matter the role or code path.
--
-- IMPORTANT before running this in the Supabase Dashboard: if it fails with
-- a check-constraint violation, a row currently breaks the new rule. Find it
-- first:
--   select id, username, provider, is_owner, permissions
--   from public.profiles
--   where provider <> 'email' and (is_owner or permissions <> '{}');
-- If that's a real moderator/owner account still on Google, decide manually
-- (create/promote an email+password account for that person, then clear
-- is_owner/permissions on the Google row) before re-running this migration --
-- do NOT just re-run it expecting it to silently fix the data, it won't.

alter table public.profiles
  add constraint profiles_privilege_requires_email_provider
  check (
    provider = 'email'
    or (is_owner = false and permissions = '{}'::public.moderator_permission[])
  );

-- Same rule, enforced with a clear message inside the grant-acceptance path
-- specifically (defense in depth alongside the constraint above -- this one
-- just fails earlier with a readable error instead of a raw constraint
-- violation). Re-declares the migration-0025 function; CREATE OR REPLACE is
-- the normal way to evolve a function across migrations without touching
-- the file that first created it.
create or replace function public.accept_permission_grant(p_grant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target uuid;
  v_tab public.moderator_permission;
  v_status text;
  v_provider text;
begin
  select target_user_id, tab, status
    into v_target, v_tab, v_status
    from public.pending_permission_grants
    where id = p_grant_id
    for update;

  if v_target is null then
    raise exception 'istek bulunamadı';
  end if;

  if v_target is distinct from auth.uid() then
    raise exception 'yetkisiz';
  end if;

  if v_status <> 'pending' then
    raise exception 'istek artık bekleyen durumda değil';
  end if;

  select provider into v_provider from public.profiles where id = v_target;

  if v_provider is distinct from 'email' then
    raise exception 'Google hesapları moderatör yetkisi alamaz';
  end if;

  update public.profiles
    set permissions = case
      when v_tab = any(permissions) then permissions
      else permissions || v_tab
    end
    where id = v_target;

  update public.pending_permission_grants
    set status = 'accepted', resolved_at = now()
    where id = p_grant_id;
end;
$$;
