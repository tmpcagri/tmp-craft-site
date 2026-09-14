import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { getCurrentModerator } from "@/app/lib/permissions";

// Permanent ban sentinel -- far enough in the future to never expire in
// practice, avoids a second boolean column that could drift out of sync
// with banned_until (see 0008 migration).
const PERMANENT = "9999-12-31T00:00:00.000Z";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const moderator = await getCurrentModerator();
  if (!moderator || !moderator.isOwner) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const { id } = await params;
  if (id === moderator.id) {
    return NextResponse.json(
      { error: "Kendi hesabını yasaklayamazsın" },
      { status: 400 },
    );
  }

  const { days, reason } = (await request.json()) as {
    days: number | null;
    reason?: string;
  };

  const bannedUntil =
    days === null
      ? PERMANENT
      : new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ banned_until: bannedUntil, ban_reason: reason ?? null })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, bannedUntil });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const moderator = await getCurrentModerator();
  if (!moderator || !moderator.isOwner) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ banned_until: null, ban_reason: null })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
