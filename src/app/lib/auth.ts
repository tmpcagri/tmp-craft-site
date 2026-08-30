import { createClient } from "./supabase/server";

export type CurrentUser = {
  name: string;
  avatarUrl: string;
} | null;

// Reads the signed-in user from the Supabase session cookie (server-side
// only — uses next/headers). Google/Microsoft OAuth populate user_metadata
// with the provider's profile name + avatar.
export async function getCurrentUser(): Promise<CurrentUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    name:
      user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      user.email?.split("@")[0] ??
      "Kullanıcı",
    avatarUrl: user.user_metadata?.avatar_url ?? "",
  };
}
