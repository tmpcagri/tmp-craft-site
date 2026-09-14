import { NextResponse } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { getCurrentModerator } from "@/app/lib/permissions";

// Permanently deletes a user's auth account (and cascades to their
// profiles row, messages, etc. via `on delete cascade`). Irreversible --
// unlike a ban, there is no undo. Requires SUPABASE_SERVICE_ROLE_KEY to be
// set; RLS alone can never allow deleting an auth.users row since that
// requires the Admin API, not a table-level policy.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const moderator = await getCurrentModerator();
  if (!moderator || !moderator.isOwner) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const { id } = await params;
  if (id === moderator.id) {
    return NextResponse.json(
      { error: "Kendi hesabını silemezsin" },
      { status: 400 },
    );
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      {
        error:
          "SUPABASE_SERVICE_ROLE_KEY tanımlı değil — .env.local'e eklenmeden kullanıcı silinemez.",
      },
      { status: 500 },
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
