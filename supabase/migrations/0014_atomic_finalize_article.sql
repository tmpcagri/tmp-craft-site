-- finalizeArticle() (src/app/lib/topluluk.ts) did two separate UPDATEs:
-- articles.finalized_at then topics.status. If the second one failed for
-- any reason, an article could end up finalized while its topic stayed
-- 'pending_objection' -- the UI would still show the objection form (it
-- only checks topic.status), but article_objections_insert_own_within_window
-- (0012) already blocks new objections once finalized_at is set, so the
-- user would hit a confusing silent RLS rejection. Same fix pattern as
-- package_topic_article() in 0012: one atomic function, explicit
-- permission check (security definer bypasses RLS), no partial state.
--
-- Second-pass review caught a real gap in the first version of this
-- function: it checked WHO could finalize but not WHEN. The 7-day
-- objection window (articles.objection_deadline) was only enforced
-- client-side (the "Yayınla" button's `disabled`) -- a moderator calling
-- this RPC directly (devtools, a stale/buggy UI state) could finalize
-- before the window closed. Added an explicit deadline + not-already-
-- finalized check, mirroring article_objections_insert_own_within_window's
-- own `now() < a.objection_deadline` guard in 0012.
--
-- Run after 0001-0013, same way (Supabase Dashboard > Database > SQL
-- Editor, or `supabase db push`).

create function public.finalize_article(p_article_id uuid, p_topic_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deadline timestamptz;
  v_finalized_at timestamptz;
begin
  if not (
    public.is_owner(auth.uid())
    or 'articles' = any(public.current_permissions(auth.uid()))
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

grant execute on function public.finalize_article(uuid, uuid) to authenticated;
