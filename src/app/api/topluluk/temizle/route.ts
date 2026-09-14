import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";

// Triggers the 3-month raw-discussion deletion job
// (delete_expired_topic_messages(), see 0012_topluluk_schema.sql). No user
// session calls this -- it's meant to be hit by an external scheduler
// (Vercel Cron, GitHub Actions, etc.) once a day, authenticated with a
// shared secret since there's no logged-in moderator to check permissions
// against. If CRON_SECRET isn't set, refuse rather than leaving this open.
function isValidSecret(authHeader: string | null, secret: string): boolean {
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(authHeader ?? "");
  // timingSafeEqual throws on length mismatch instead of returning false --
  // check that separately first (leaking the expected length isn't a
  // meaningful weakness here).
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET sunucu ortamında tanımlı değil." },
      { status: 500 },
    );
  }

  if (!isValidSecret(request.headers.get("authorization"), secret)) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.rpc("delete_expired_topic_messages");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
