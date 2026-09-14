import { NextResponse } from "next/server";
import { getCurrentModerator } from "@/app/lib/permissions";
import { getUsers, saveUsers, type ManagedUser } from "@/app/lib/users";

export async function GET() {
  const moderator = await getCurrentModerator();
  if (!moderator || !moderator.isOwner) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  return NextResponse.json(await getUsers());
}

export async function POST(request: Request) {
  const moderator = await getCurrentModerator();
  if (!moderator || !moderator.isOwner) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const body = (await request.json()) as ManagedUser[];
  await saveUsers(body);
  return NextResponse.json({ ok: true });
}
