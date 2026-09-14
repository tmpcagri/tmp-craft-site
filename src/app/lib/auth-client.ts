import { createClient } from "./supabase/client";

// Client-side sign-in/out helpers, meant to be wired to the AccountButton
// onClick. Redirects back through /auth/callback, which exchanges the
// OAuth code for a session before sending the browser on to `nextPath`.
export async function signInWithGoogle(nextPath: string = "/") {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  location.reload();
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithPassword(email: string, password: string) {
  const supabase = createClient();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${location.origin}/auth/callback`,
    },
  });
}
