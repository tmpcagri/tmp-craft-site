import { NextResponse } from "next/server";
import { getUsers, saveUsers, type ManagedUser } from "@/app/lib/users";

export async function GET() {
  return NextResponse.json(await getUsers());
}

export async function POST(request: Request) {
  const body = (await request.json()) as ManagedUser[];
  await saveUsers(body);
  return NextResponse.json({ ok: true });
}
