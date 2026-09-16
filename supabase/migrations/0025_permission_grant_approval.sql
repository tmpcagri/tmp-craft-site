-- Yetki devri onay akışı: owner bir moderatöre yeni bir tab (yetki)
-- vermek istediğinde artık DOĞRUDAN profiles.permissions'a yazmıyor --
-- burada bir istek açıyor, hedef kullanıcı "Kabul Et" demeden yetki
-- fiilen verilmiyor. Reddetme YOK (aktif bir "çarpı" butonu yok, pasif
-- olarak hiç dokunmamak = yetki verilmez); owner bekleyen bir isteği
-- istediği an iptal edebiliyor. "Baş Moderatör" gibi owner-dışı bir
-- rolün de istek açabilmesi şimdilik kapsam dışı (gerçek bir Baş
-- Moderatör rolü henüz yok, sadece silinen demo'da vardı).
create table public.pending_permission_grants (
  id uuid primary key default gen_random_uuid(),
  target_user_id uuid not null references public.profiles (id) on delete cascade,
  tab public.moderator_permission not null,
  granted_by uuid references public.profiles (id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'cancelled')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

comment on table public.pending_permission_grants is
  'Bekleyen/kabul edilmiş/iptal edilmiş yetki devri istekleri. Kabul,
RLS''ten DEĞİL accept_permission_grant() security definer fonksiyonundan
geçiyor -- hedef kullanıcı kendi profiles.permissions''ını RLS''te zaten
değiştiremiyor (bkz. migration 0001, self-promotion''ı engellemek için).';

create unique index pending_permission_grants_unique_pending
  on public.pending_permission_grants (target_user_id, tab)
  where status = 'pending';

create index pending_permission_grants_target_idx
  on public.pending_permission_grants (target_user_id, status);

alter table public.pending_permission_grants enable row level security;

create policy "grants_select_own_or_owner"
  on public.pending_permission_grants for select
  to authenticated
  using (
    target_user_id = auth.uid()
    or public.is_owner(auth.uid())
  );

create policy "grants_insert_owner_only"
  on public.pending_permission_grants for insert
  to authenticated
  with check (
    public.is_owner(auth.uid())
    and granted_by = auth.uid()
  );

-- Owner bekleyen bir isteği iptal edebilir (pending -> cancelled). Kabul
-- etme burada YOK, aşağıdaki fonksiyon üzerinden yapılıyor.
create policy "grants_update_owner_cancel_only"
  on public.pending_permission_grants for update
  to authenticated
  using (
    public.is_owner(auth.uid())
    and status = 'pending'
  )
  with check (status = 'cancelled');

-- Hedef kullanıcı kendi bekleyen isteğini kabul ediyor -- hem grant'i
-- hem profiles.permissions'ı tek transaction'da güncelliyor. `is distinct
-- from` kullanıyoruz (`<>` değil): auth.uid() anonim bir çağıran için
-- NULL döner, `v_target <> NULL` de NULL olur ve plpgsql'de `if NULL`
-- sessizce false sayılıp exception hiç fırlamaz -- tam olarak migration
-- 0015'te bulunan NULL-bypass deseni. `is distinct from` NULL'ı düzgün
-- karşılaştırıp güvenli tarafta kalıyor.
create function public.accept_permission_grant(p_grant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target uuid;
  v_tab public.moderator_permission;
  v_status text;
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
