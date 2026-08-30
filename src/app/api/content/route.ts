import { NextResponse } from "next/server";
import { getSiteContent, saveSiteContent, type SiteContent } from "@/app/lib/content";
import { getCurrentModerator } from "@/app/lib/permissions";

export async function GET() {
  return NextResponse.json(getSiteContent());
}

export async function POST(request: Request) {
  const moderator = await getCurrentModerator();
  if (!moderator || moderator.permissions.length === 0) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const body = (await request.json()) as SiteContent;
  saveSiteContent(body);
  return NextResponse.json({ ok: true });
}
