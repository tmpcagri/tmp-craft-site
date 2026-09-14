import { createClient } from "./supabase/server";

export type ModeratorTab = "cards" | "links" | "creators" | "articles";

export type ModeratorSession = {
  username: string;
  id: string;
  permissions: ModeratorTab[];
  isOwner: boolean;
} | null;

const ALL_TABS: ModeratorTab[] = ["cards", "links", "creators", "articles"];

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
    .select("username, is_owner, permissions")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    username: profile.username,
    id: user.id,
    permissions: profile.is_owner
      ? ALL_TABS
      : ((profile.permissions ?? []) as ModeratorTab[]),
    isOwner: profile.is_owner,
  };
}
