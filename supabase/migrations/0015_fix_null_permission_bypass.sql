-- CRITICAL SECURITY FIX. Found during a live security-testing pass
-- (anonymous curl against the REST API): package_topic_article() and
-- finalize_article() (0012, 0014) both guard access with:
--
--   if not (
--     public.is_owner(auth.uid())
--     or 'articles' = any(public.current_permissions(auth.uid()))
--   ) then
--     raise exception 'yetkisiz';
--   end if;
--
-- For an ANONYMOUS caller (no session, just the public anon key -- which
-- is exactly what every visitor's browser has), auth.uid() is NULL.
-- current_permissions(NULL) returns NULL (no matching profiles row), so
-- 'articles' = any(NULL) evaluates to NULL, not false. is_owner(NULL) is
-- false. `false or NULL` is NULL, and `not NULL` is NULL. Critically,
-- PL/pgSQL's `if <null-expression> then ... end if` treats NULL the same
-- as false and DOES NOT enter the branch -- so `raise exception` never
-- fires, and an anonymous, completely unauthenticated request sails
-- straight past the permission check. Verified live: an anon curl call
-- to finalize_article() got all the way to "makale bulunamadı" (the
-- NEXT check, for a nonexistent article) instead of "yetkisiz" -- proof
-- the permission gate was skipped entirely, not just returning a
-- generic-looking error. With a real, existing article/topic id this
-- would have let anyone finalize an article early or trigger AI
-- packaging, no login required.
--
-- Note RLS policies using the identical `is_owner(...) or 'x' = any(...)`
-- expression directly in `using (...)` are NOT affected by this bug --
-- Postgres row-security treats a NULL USING/WITH CHECK result as "deny",
-- the opposite polarity from an `if not (...) then raise` block. Only
-- these two PL/pgSQL functions have the fail-open bug.
--
-- Fix: wrap the whole permission expression in coalesce(..., false) so a
-- NULL can never be mistaken for "not present, so allow".
--
-- Run this immediately, same way as the others (Supabase Dashboard >
-- Database > SQL Editor, or `supabase db push`).

create or replace function public.package_topic_article(
  p_topic_id uuid,
  p_content text,
  p_contributors jsonb,
  p_created_by uuid,
  p_objection_days int default 7
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_article_id uuid;
  v_deadline timestamptz := now() + (p_objection_days || ' days')::interval;
begin
  if not coalesce(
    public.is_owner(auth.uid())
    or 'articles' = any(public.current_permissions(auth.uid())),
    false
  ) then
    raise exception 'yetkisiz';
  end if;

  insert into public.articles (topic_id, content, created_by, objection_deadline)
  values (p_topic_id, p_content, p_created_by, v_deadline)
  returning id into v_article_id;

  insert into public.article_contributions (article_id, user_id, rank, note, is_first)
  select
    v_article_id,
    (c ->> 'user_id')::uuid,
    (c ->> 'rank')::int,
    coalesce(c ->> 'note', ''),
    coalesce((c ->> 'is_first')::boolean, false)
  from jsonb_array_elements(p_contributors) as c;

  update public.topics set status = 'pending_objection' where id = p_topic_id;

  return v_article_id;
exception
  when others then
    update public.topics set status = 'open' where id = p_topic_id;
    raise;
end;
$$;

create or replace function public.finalize_article(p_article_id uuid, p_topic_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deadline timestamptz;
  v_finalized_at timestamptz;
begin
  if not coalesce(
    public.is_owner(auth.uid())
    or 'articles' = any(public.current_permissions(auth.uid())),
    false
  ) then
    raise exception 'yetkisiz';
  end if;

  select objection_deadline, finalized_at into v_deadline, v_finalized_at
  from public.articles
  where id = p_article_id and topic_id = p_topic_id;

  if v_deadline is null then
    raise exception 'makale bulunamadı';
  end if;

  if v_finalized_at is not null then
    raise exception 'zaten yayınlanmış';
  end if;

  if now() < v_deadline then
    raise exception 'itiraz penceresi henüz kapanmadı';
  end if;

  update public.articles set finalized_at = now() where id = p_article_id;
  update public.topics set status = 'finalized' where id = p_topic_id;
end;
$$;
