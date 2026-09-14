import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client for privileged operations (deleting a user's auth
// account) that RLS can never allow, since RLS runs as the calling user.
// SUPABASE_SERVICE_ROLE_KEY is server-only -- never NEXT_PUBLIC_-prefixed,
// never imported from a "use client" file. Callers must check
// getCurrentModerator().isOwner themselves before using this; this client
// bypasses RLS entirely.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
