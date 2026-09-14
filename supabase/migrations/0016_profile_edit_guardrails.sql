-- Profile edit guardrails (patron request, 2026-09-14):
--   * username: 3-20 chars, letters/digits/underscore only (no emoji/
--     symbols), and once changed can't be changed again for 3 months.
--   * birth_date: once set, can only be changed once per year.
--   * gender: the FIRST set (from null) is free; after that, exactly ONE
--     correction is allowed for the lifetime of the account, then it
--     locks permanently. (Client surfaces this so the user knows they've
--     used their one change.)
--
-- Enforced here (DB trigger), not just client-side, so it can't be
-- bypassed by calling the Supabase client directly. Client-side checks
-- in edit-profile-modal.tsx exist too, purely for a fast/friendly error
-- message before round-tripping to the DB.
--
-- Run after 0001-0015, same way (Supabase Dashboard > Database > SQL
-- Editor, or `supabase db push`).

alter table public.profiles
  add column username_changed_at timestamptz,
  add column birth_date_changed_at timestamptz,
  add column gender_change_count integer not null default 0;

create or replace function public.enforce_profile_edit_rules()
returns trigger
language plpgsql
as $$
begin
  -- Username: format + 3-month cooldown after any change.
  if new.username is distinct from old.username then
    if char_length(new.username) < 3 or char_length(new.username) > 20 then
      raise exception 'Kullanıcı adı 3-20 karakter arasında olmalı';
    end if;
    if new.username !~ '^[A-Za-z0-9ığüşöçİĞÜŞÖÇ_]+$' then
      raise exception 'Kullanıcı adında sadece harf, rakam ve alt çizgi kullanılabilir';
    end if;
    if old.username_changed_at is not null
       and now() - old.username_changed_at < interval '3 months' then
      raise exception 'Kullanıcı adını 3 ayda bir değiştirebilirsin. Sonraki değişiklik hakkın: %',
        to_char(old.username_changed_at + interval '3 months', 'DD.MM.YYYY');
    end if;
    new.username_changed_at := now();
  end if;

  -- Birth date: once set, only one change per year.
  if new.birth_date is distinct from old.birth_date then
    if old.birth_date is not null
       and old.birth_date_changed_at is not null
       and now() - old.birth_date_changed_at < interval '1 year' then
      raise exception 'Doğum tarihini yılda bir değiştirebilirsin. Sonraki değişiklik hakkın: %',
        to_char(old.birth_date_changed_at + interval '1 year', 'DD.MM.YYYY');
    end if;
    new.birth_date_changed_at := now();
  end if;

  -- Gender: first set (from null) is free, then exactly one correction
  -- ever. old.gender is not null here means this is a correction, not
  -- the initial choice.
  if new.gender is distinct from old.gender then
    if old.gender is not null then
      if old.gender_change_count >= 1 then
        raise exception 'Cinsiyet bilgisini sadece bir kez değiştirebilirsin, bu hakkını kullanmışsın';
      end if;
      new.gender_change_count := old.gender_change_count + 1;
    end if;
  end if;

  return new;
end;
$$;

create trigger profiles_enforce_edit_rules
  before update on public.profiles
  for each row execute function public.enforce_profile_edit_rules();
