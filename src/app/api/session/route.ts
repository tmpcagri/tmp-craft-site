import { NextResponse } from "next/server";
import { getCurrentModerator } from "@/app/lib/permissions";

export async function GET() {
  return NextResponse.json(await getCurrentModerator());
}
