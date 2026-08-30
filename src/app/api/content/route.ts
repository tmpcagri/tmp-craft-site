import { NextResponse } from "next/server";
import { getSiteContent, saveSiteContent, type SiteContent } from "@/app/lib/content";

export async function GET() {
  return NextResponse.json(getSiteContent());
}

export async function POST(request: Request) {
  const body = (await request.json()) as SiteContent;
  saveSiteContent(body);
  return NextResponse.json({ ok: true });
}
