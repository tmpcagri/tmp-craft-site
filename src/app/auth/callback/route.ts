import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

// Only a same-origin relative path is a safe redirect target. Rejects
// absolute/protocol-relative URLs ("//evil.com", "/\evil.com") and the
// userinfo-confusion trick ("@evil.com", which browsers resolve as
// `http://localhost:3000@evil.com` -> host "evil.com") by requiring the
// value to start with exactly one "/".
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) {
    return "/";
  }
  return raw;
}

// Google redirects here with a `code` after the user approves sign-in; we
// exchange it for a session (sets the Supabase cookies) then send the
// browser on to wherever it started.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/?auth_error=1`);
}
