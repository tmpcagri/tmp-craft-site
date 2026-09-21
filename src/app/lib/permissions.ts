import { createClient } from "./supabase/server";

export type ModeratorTab =
  | "cards"
  | "links"
  | "creators"
  | "articles"
  | "mods"
  | "mod_paketleri_sayfa"
  | "servers"
  | "occasion"
  | "ticker"
  | "hero"
  | "panels"
  | "topluluk_hero"
  | "guides";

export type ModeratorSession = {
  username: string;
  id: string;
  avatarUrl: string;
  birthDate: string | null;
  roleLabel: string;
  permissions: ModeratorTab[];
  isOwner: boolean;
} | null;

const ALL_TABS: ModeratorTab[] = [
  "cards",
  "links",
  "creators",
  "articles",
  "mods",
  "mod_paketleri_sayfa",
  "servers",
  "occasion",
  "ticker",
  "hero",
  "panels",
  "topluluk_hero",
  "guides",
];

// Reads the logged-in user's moderator session from their `profiles` row.
// Returns null when signed out, or when signed in but no profile row
// exists yet (shouldn't happen once the handle_new_user trigger runs).
// The site owner (is_owner) always gets every tab regardless of what's in
// their permissions array.
export async function getCurrentModerator(): Promise<ModeratorSession> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "username, is_owner, permissions, birth_date, avatar_url, role_label, provider",
    )
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  // NOT: "Google hesabına yetki verilemez" kuralı burada (runtime'da
  // is_owner/permissions'ı sıfırlayarak) UYGULANMIYOR -- mevcut owner
  // hesabı hâlâ Google ile kayıtlı (bkz. IHTIYACLAR.md, 2026-09-19), test
  // aşamasında bu yüzden owner'ı kilitlemeyelim diye patron onayıyla
  // gevşetildi. Kural şimdilik sadece YENİ yetki verilirken (/yonetim
  // UI'daki disabled buton) işletiliyor. Deploy öncesi owner e-posta/şifre
  // hesabına taşınmalı ve bu kontrol geri eklenmeli (migration 0033 da
  // o zamana kadar Supabase'de ÇALIŞTIRILMAMALI, aksi halde bu satır
  // CHECK constraint'e takılır).
  return {
    username: profile.username,
    id: user.id,
    avatarUrl: profile.avatar_url ?? "",
    birthDate: profile.birth_date ?? null,
    roleLabel: profile.role_label ?? "",
    permissions: profile.is_owner
      ? ALL_TABS
      : ((profile.permissions ?? []) as ModeratorTab[]),
    isOwner: profile.is_owner,
  };
}
