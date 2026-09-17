-- İkinci (büyük) parça: mod paketi indirmeleri artık TEK bir sürüm/loader'a
-- bağlı kalmıyor -- her mod_packages satırı, kendi sürüm+loader
-- kombinasyonu başına ayrı bir gerçek indirme linkine sahip birden fazla
-- satıra sahip olabilir (CurseForge/Modrinth'teki "hangi sürüm/loader"
-- seçim matriksi gibi). 0019'daki "ek katman, statik seed'e dokunmuyor"
-- deseninin devamı: bu tablo sadece mod_packages'a (DB paketlerine) ait,
-- downloads.ts'teki statik modlar hiç versiyon satırına sahip olmaz --
-- detay sayfası onlar için eski tek-sürüm (game_version/loader) alanına
-- düşmeye devam eder (bkz. mod-paketi-actions.tsx, versions.length === 0
-- kontrolü).
--
-- Aynı paket+sürüm+loader kombinasyonunun iki kez eklenmesini engelleyen
-- unique kısıt yok -- moderatör bilerek aynı kombinasyona güncellenmiş bir
-- link eklemek isteyebilir (ör. linki değiştirip eskisini silmeden yenisini
-- eklemek), UI tarafında "en son eklenen" kullanılabilir. Basit tutuldu.
--
-- Run after 0029.

create table public.mod_package_versions (
  id uuid primary key default gen_random_uuid(),
  mod_package_slug text not null references public.mod_packages(slug) on delete cascade,
  game_version text not null,
  loader text not null,
  download_url text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index mod_package_versions_slug_idx
  on public.mod_package_versions (mod_package_slug);

alter table public.mod_package_versions enable row level security;

create policy "mod_package_versions_select_all"
  on public.mod_package_versions for select
  to anon, authenticated
  using (true);

create policy "mod_package_versions_write_moderator"
  on public.mod_package_versions for all
  to authenticated
  using (
    public.is_owner(auth.uid())
    or 'mods' = any(public.current_permissions(auth.uid()))
  )
  with check (
    public.is_owner(auth.uid())
    or 'mods' = any(public.current_permissions(auth.uid()))
  );
