-- Topluluk: gerçek konu/mesaj sistemi + AI paketleme (Twitter-tartışma ->
-- Wikipedia-benzeri kalıcı madde akışı).
--
-- Akış: bir konu (topic) açılır, kullanıcılar topic_messages ile tartışır
-- (ham veri). Bir moderatör ("articles" izni) tartışmayı AI'ya paketletir:
-- topic.status 'open' -> 'packaging' -> (AI + package_topic_article()
-- başarılı) 'pending_objection', bir `articles` satırı ve sıralı
-- `article_contributions` satırları oluşur, 7 günlük itiraz penceresi
-- başlar. Pencere kapandıktan sonra moderatör makaleyi 'finalized' yapar.
-- Ham tartışma (topic_messages, article_objections) konudan 3 ay sonra
-- KOŞULSUZ silinir -- paketlenmiş olsun olmasın, depolamayı şişirmemek
-- asıl amaç; kalıcı olan tek şey `articles` + `article_contributions`. Bu
-- davranış herkese açık şekilde Telif Hakkı sayfasında anlatılır.
--
-- Run after 0011 (needs the 'articles' moderator_permission value), same
-- way (Supabase Dashboard > Database > SQL Editor, or `supabase db push`).

-- 0. Konu/mesaj/itiraz insert'lerinde ortak "yasaklı değil" kontrolü -------
-- 0008'deki current_ban(uid) (banned_until) yardımcı fonksiyonunu tekrar
-- kullanıyoruz. Not: bu kontrol yalnızca burada eklenen 3 yeni tabloyu
-- kapsar -- 0004'teki messages tablosu aynı boşluğa zaten sahipti, o ayrı
-- bir konu (mevcut davranış korunuyor, burada genişletilmiyor).
create function public.is_currently_banned(uid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.current_ban(uid) is not null and public.current_ban(uid) > now();
$$;

-- 1. Konular ------------------------------------------------------------
create table public.topics (
  id uuid primary key default gen_random_uuid(),
  -- author_id nullable + "on delete set null" (cascade DEĞİL): konuyu açan
  -- kişinin hesabı silinse bile bu konuya bağlı `articles` +
  -- `article_contributions` (kalıcı olması gereken içerik, başka
  -- kullanıcıların da emeği) cascade ile yok olmasın. Sadece author_id
  -- null'a düşer, konu/madde kalır.
  author_id uuid references auth.users (id) on delete set null,
  title text not null,
  category text not null,
  status text not null default 'open'
    check (status in ('open', 'packaging', 'pending_objection', 'finalized')),
  created_at timestamptz not null default now()
);

comment on table public.topics is
  'Topluluk konu başlıkları. status ham tartışmanın hangi aşamada olduğunu
tutar -- gerçek içerik topic_messages''te, paketlenmiş hali articles''ta.
author_id silinen bir hesap yüzünden null olabilir; konu bundan etkilenmez.';

alter table public.topics enable row level security;

create policy "topics_select_all"
  on public.topics for select
  to anon, authenticated
  using (true);

-- Haftada 1 konu sınırı (composer UI'da zaten "Her kullanıcı haftada
-- sadece 1 konu ekleyebilir" yazıyordu -- burada gerçek kısıt haline
-- getiriyoruz). topics_select_all herkese açık olduğu için bu alt sorgu
-- ek bir RLS döngüsüne girmez (0006'daki profiles recursion'ı farklı bir
-- durumdu: orada policy kendi kendini select ediyordu kısıtlı bir
-- policy üzerinden).
--
-- Bilinen kabul edilmiş sınır: bu count(*) kontrolü TOCTOU race'e açık --
-- aynı kullanıcıdan gerçekten eşzamanlı iki istek ikisi de count=0 görüp
-- geçebilir. Bu yumuşak bir kötüye kullanım freni (güvenlik sınırı değil),
-- tam serileştirme için ek bir per-user lock mekanizması gerekirdi; ölçek
-- ve risk göz önüne alındığında buna değmiyor.
create policy "topics_insert_own"
  on public.topics for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and not public.is_currently_banned(auth.uid())
    and (
      select count(*) from public.topics t
      where t.author_id = auth.uid() and t.created_at > now() - interval '7 days'
    ) = 0
  );

-- Sadece moderatör (articles izni) durumu ilerletebilir (paketleme /
-- finalize etme sırasında). Konu sahibi bile kendi konusunun durumunu
-- değiştiremez -- bu, akışın bütünlüğünü (birinin paketlemeyi manipüle
-- etmesini) korumak için. Not: bu policy satırın tamamını (title/category
-- dahil) güncellemeye izin veriyor, sadece status'a değil -- kasıtlı,
-- moderatörler zaten articles/article_contributions'ı tamamen
-- yazabiliyor, ek bir kısıtlama eklemedik.
create policy "topics_update_moderator"
  on public.topics for update
  to authenticated
  using (
    public.is_owner(auth.uid())
    or 'articles' = any(public.current_permissions(auth.uid()))
  );

-- 2. Ham tartışma mesajları -----------------------------------------------
create table public.topic_messages (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics (id) on delete cascade,
  -- Burada cascade KALIYOR (topics.author_id'nin aksine): ham mesajlar
  -- zaten kalıcı değil (3 ay sonra siliniyorlar), bir kullanıcı hesabını
  -- silince kendi ham mesajlarının hemen gitmesi veri minimizasyonu
  -- açısından tutarlı ve istenen bir şey.
  author_id uuid references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

comment on table public.topic_messages is
  'Bir konudaki ham tartışma mesajları. Değiştirilemez/silinemez (messages
tablosundaki desenle aynı) -- yalnızca konudan 3 ay sonra toplu olarak
delete_expired_topic_messages() ile kalıcı olarak silinir.';

create index topic_messages_topic_idx
  on public.topic_messages (topic_id, created_at);

alter table public.topic_messages enable row level security;

create policy "topic_messages_select_all"
  on public.topic_messages for select
  to anon, authenticated
  using (true);

-- Sadece konu hâlâ 'open' iken ve kendi adına mesaj atılabilir. Paketleme
-- başladıktan sonra (packaging/pending_objection/finalized) yeni ham mesaj
-- eklenemez -- paketlenen içerik ile canlı tartışma birbirine karışmasın.
create policy "topic_messages_insert_own_while_open"
  on public.topic_messages for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and not public.is_currently_banned(auth.uid())
    and exists (
      select 1 from public.topics t
      where t.id = topic_id and t.status = 'open'
    )
  );

-- 3. Paketlenmiş makaleler -------------------------------------------------
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null unique references public.topics (id) on delete cascade,
  content text not null,
  -- created_by da nullable + set null (author_id ile aynı gerekçe): hangi
  -- moderatörün paketlediği sadece bir atıf bilgisi, makalenin kalıcılığını
  -- o kişinin hesabına bağlamak istemiyoruz.
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  objection_deadline timestamptz not null,
  finalized_at timestamptz
);

comment on table public.articles is
  'AI tarafından bir konunun ham tartışmasından üretilen kalıcı özet.
topic_messages silinse bile bu satır ve article_contributions kalır.';

alter table public.articles enable row level security;

create policy "articles_select_all"
  on public.articles for select
  to anon, authenticated
  using (true);

create policy "articles_write_moderator"
  on public.articles for all
  to authenticated
  using (
    public.is_owner(auth.uid())
    or 'articles' = any(public.current_permissions(auth.uid()))
  )
  with check (
    public.is_owner(auth.uid())
    or 'articles' = any(public.current_permissions(auth.uid()))
  );

-- 4. Katkı sağlayan sıralaması ---------------------------------------------
create table public.article_contributions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles (id) on delete cascade,
  -- Kasıtlı olarak cascade (set null DEĞİL): bir katkı sağlayan kendi
  -- hesabını silerse kendi satırı kalkar -- bu, articles.author_id'nin
  -- aksine, sadece o kişinin KENDİ verisini etkiler (başkalarının katkı
  -- listesini değil), o yüzden hesap silme/KVKK talebiyle çelişmiyor.
  user_id uuid not null references auth.users (id) on delete cascade,
  rank int not null check (rank > 0),
  note text not null default '' check (char_length(note) <= 300),
  is_first boolean not null default false,
  created_at timestamptz not null default now(),
  unique (article_id, user_id)
);

comment on table public.article_contributions is
  'Puan değil sıralama: en çok katkı sağlayan (rank 1) en üstte. Yalnızca
minimum katkı barını geçenler listeye girer -- barı geçemeyenler için
hiç satır oluşturulmaz. is_first = konudaki ilk kalıcı fikri/gönderiyi
veren kişi (bonus sinyal, AI tarafından işaretlenir).';

alter table public.article_contributions enable row level security;

create policy "article_contributions_select_all"
  on public.article_contributions for select
  to anon, authenticated
  using (true);

create policy "article_contributions_write_moderator"
  on public.article_contributions for all
  to authenticated
  using (
    public.is_owner(auth.uid())
    or 'articles' = any(public.current_permissions(auth.uid()))
  )
  with check (
    public.is_owner(auth.uid())
    or 'articles' = any(public.current_permissions(auth.uid()))
  );

-- 5. İtiraz penceresi -------------------------------------------------------
create table public.article_objections (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

comment on table public.article_objections is
  'Bir makale pending_objection durumundayken, itiraz penceresi
(articles.objection_deadline) kapanmadan önce bırakılan itirazlar. Diğer
kullanıcılara açık değildir (yalnızca yazan + moderatör görür) -- linç
etkisi yaratmasın.';

alter table public.article_objections enable row level security;

create policy "article_objections_select_own_or_moderator"
  on public.article_objections for select
  to authenticated
  using (
    user_id = auth.uid()
    or public.is_owner(auth.uid())
    or 'articles' = any(public.current_permissions(auth.uid()))
  );

create policy "article_objections_insert_own_within_window"
  on public.article_objections for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and not public.is_currently_banned(auth.uid())
    and exists (
      select 1 from public.articles a
      where a.id = article_id
        and a.finalized_at is null
        and now() < a.objection_deadline
    )
  );

-- 6. Paketleme: tek atomik işlem --------------------------------------------
-- paketle API route'u önce ayrı bir UPDATE ile topics.status'u
-- 'open' -> 'packaging' atomik olarak "claim" eder (WHERE status='open'
-- kontrolüyle -- iki eşzamanlı paketleme isteğinden sadece biri satırı
-- gerçekten günceller, diğeri 0 satır döner ve hemen 409 ile çıkar; AI
-- çağrısı hiç yapılmaz). AI'dan sonuç geldiğinde bu fonksiyon çağrılır:
-- makale + katkı satırlarını yazar ve durumu 'pending_objection'a taşır.
-- Herhangi bir adım (ör. geçersiz contributor verisi) hata verirse,
-- exception bloğu durumu açıkça 'open'a geri döndürüp hatayı yeniden
-- fırlatır -- konu asla kalıcı olarak 'packaging'de askıda kalmaz.
--
-- security definer olduğu için RLS'yi bypass eder -- bu yüzden yetki
-- kontrolünü burada AYRICA yapıyoruz (route zaten getCurrentModerator()
-- ile kontrol ediyor, ama defense-in-depth için burada da tekrarlıyoruz).
create function public.package_topic_article(
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
  if not (
    public.is_owner(auth.uid())
    or 'articles' = any(public.current_permissions(auth.uid()))
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

grant execute on function public.package_topic_article(uuid, text, jsonb, uuid, int)
  to authenticated;

-- 7. 3 aylık ham veri temizliği ---------------------------------------------
-- Paketlenmiş olsun olmasın, bir konunun ham tartışması açılışından 3 ay
-- sonra koşulsuz silinir (depolamayı şişirmemek + kullanıcı verisini süresiz
-- tutmamak). Çalıştırma yöntemleri:
--  a) Supabase projesinde pg_cron eklentisi açıksa:
--       select cron.schedule('delete-expired-topic-messages', '0 3 * * *',
--         $$select public.delete_expired_topic_messages();$$);
--  b) Değilse: bir dış zamanlayıcı (Vercel Cron, GitHub Actions vb.)
--     /api/topluluk/temizle uç noktasını CRON_SECRET ile günlük çağırsın.
--  c) İkisi de yoksa: bu fonksiyonu ara sıra elle SQL Editor'den çalıştır.
create function public.delete_expired_topic_messages()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.article_objections
  where article_id in (
    select a.id from public.articles a
    join public.topics t on t.id = a.topic_id
    where t.created_at < now() - interval '3 months'
  );

  delete from public.topic_messages
  where topic_id in (
    select id from public.topics where created_at < now() - interval '3 months'
  );
end;
$$;

grant execute on function public.delete_expired_topic_messages() to service_role;
