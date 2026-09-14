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
  const current = getSiteContent();

  // A moderator can only ever be granted "cards" and/or "links" and/or
  // "creators" (see ModeratorTab) but the client sends the whole
  // SiteContent object in one request. Only apply the section(s) this
  // moderator actually has permission for -- otherwise a "links"-only
  // moderator could smuggle edited infoCards through the same save request
  // (client bug, tampered request, doesn't matter which) and it would
  // silently go through.
  const next: SiteContent = {
    navbar: current.navbar,
    infoCards: moderator.permissions.includes("cards")
      ? body.infoCards
      : current.infoCards,
    footerLinks: moderator.permissions.includes("links")
      ? body.footerLinks
      : current.footerLinks,
    recommendedCreators: moderator.permissions.includes("creators")
      ? body.recommendedCreators
      : current.recommendedCreators,
    contact: moderator.permissions.includes("links")
      ? body.contact
      : current.contact,
  };

  saveSiteContent(next);
  return NextResponse.json({ ok: true });
}
