import { createClient } from "./supabase/client";

// Client-side sign-in/out helpers, meant to be wired to the AccountButton
// onClick. Both providers redirect back through /auth/callback, which
// exchanges the OAuth code for a session before sending the browser on to
// `nextPath`.
export async function signInWithGoogle(nextPath: string = "/") {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });
}

export async function signInWithAzure(nextPath: string = "/") {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: "azure",
    options: {
      // XboxLive.signin + offline_access let the /auth/callback route walk
      // the Xbox Live -> XSTS -> Minecraft services chain (see
      // src/app/lib/minecraft.ts) to resolve the user's Minecraft profile.
      scopes: "XboxLive.signin offline_access",
      redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  location.reload();
}
