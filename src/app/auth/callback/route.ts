import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { resolveMinecraftProfile } from "@/app/lib/minecraft";

// Google/Microsoft redirect here with a `code` after the user approves
// sign-in; we exchange it for a session (sets the Supabase cookies) then
// send the browser on to wherever it started.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Microsoft sign-ins request the XboxLive.signin scope (see
      // auth-client.ts) so we can resolve + store the user's Minecraft
      // profile. provider_token is the raw Microsoft access token, only
      // available on this response — never persisted or sent to the client.
      const providerToken = data.session?.provider_token;
      if (data.user?.app_metadata?.provider === "azure" && providerToken) {
        const profile = await resolveMinecraftProfile(providerToken);
        if (profile) {
          await supabase
            .from("profiles")
            .update({
              minecraft_username: profile.username,
              minecraft_uuid: profile.uuid,
              minecraft_linked_at: new Date().toISOString(),
            })
            .eq("id", data.user.id);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/?auth_error=1`);
}
