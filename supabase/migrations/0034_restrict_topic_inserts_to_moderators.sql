-- Acil kapatma: /topluluk sayfaları front-end'de "yakında" stub'ına
-- kilitlendi (konu/mesaj oluşturma arayüzü hiçbir yerde kullanıcıya
-- gösterilmiyor), ama bu migration'dan önce 0012'deki `topics_insert_own`
-- ve `topic_messages_insert_own_while_open` INSERT politikaları hâlâ
-- TÜM giriş yapmış kullanıcılara açıktı -- yani herhangi biri arayüzü hiç
-- kullanmadan Supabase REST/JS client'ına doğrudan istek atıp konu/mesaj
-- yazabiliyordu. Front-end kilidi hiçbir zaman bir güvenlik sınırı değildir;
-- asıl sınır burada, RLS'de olmalıydı.
--
-- Bu migration, iki INSERT politikasını 0012'deki TÜM mevcut koşullarını
-- (author_id=auth.uid(), is_currently_banned kontrolü, haftalık limit /
-- topic.status='open' şartı) AYNEN koruyarak yeniden tanımlıyor, tek fark:
-- artık yazan kişinin ayrıca 0032'de tanımlanmış `public.is_moderator(uid)`
-- olması gerekiyor (is_owner OR en az bir moderator_permission). SELECT
-- politikaları (`topics_select_all`, `topic_messages_select_all`) BİLİNÇLİ
-- olarak değiştirilmiyor -- okuma herkese açık kalmaya devam ediyor, asıl
-- risk yeni içerik yazılabilmesiydi.
--
-- Bu GEÇİCİ bir önlemdir: topluluk özelliği gerçek moderasyon altyapısıyla
-- (rate limiting, raporlama, vb.) birlikte tekrar açıldığında, "sadece
-- moderatör yazabilir" kısıtı muhtemelen normal kullanıcılara genişletilerek
-- gözden geçirilmeli -- o zaman bu migration'ın mantığı kaldırılacak/
-- değiştirilecek, silinmeyecek.

drop policy "topics_insert_own" on public.topics;
create policy "topics_insert_own"
  on public.topics for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and public.is_moderator(auth.uid())
    and not public.is_currently_banned(auth.uid())
    and (
      select count(*) from public.topics t
      where t.author_id = auth.uid() and t.created_at > now() - interval '7 days'
    ) = 0
  );

drop policy "topic_messages_insert_own_while_open" on public.topic_messages;
create policy "topic_messages_insert_own_while_open"
  on public.topic_messages for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and public.is_moderator(auth.uid())
    and not public.is_currently_banned(auth.uid())
    and exists (
      select 1 from public.topics t
      where t.id = topic_id and t.status = 'open'
    )
  );
