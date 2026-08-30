import { createClient } from "./supabase/server";
import type { ModeratorTab } from "./permissions";

export type ManagedUser = {
  id: string;
  username: string;
  avatarUrl: string;
  provider: string;
  device: string;
  joinedAt: string;
  lastActivity: { at: string; change: string };
  permissions: ModeratorTab[];
};

// Backed by the `profiles` table (see supabase/migrations). Row Level
// Security enforces that only the site owner can select every row / update
// someone else's permissions — this file just issues the query under the
// caller's session, it doesn't need to re-check ownership itself.
export async function getUsers(): Promise<ManagedUser[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, username, avatar_url, provider, device, joined_at, last_activity_at, last_activity_change, permissions",
    )
    .order("joined_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    username: row.username,
    avatarUrl: row.avatar_url ?? "",
    provider: row.provider,
    device: row.device ?? "",
    joinedAt: row.joined_at,
    lastActivity: {
      at: row.last_activity_at ?? row.joined_at,
      change: row.last_activity_change ?? "",
    },
    permissions: (row.permissions ?? []) as ModeratorTab[],
  }));
}

export async function saveUsers(users: ManagedUser[]): Promise<void> {
  const supabase = await createClient();
  await Promise.all(
    users.map((u) =>
      supabase.from("profiles").update({ permissions: u.permissions }).eq(
        "id",
        u.id,
      ),
    ),
  );
}
