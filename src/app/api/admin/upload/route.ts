import { NextResponse } from "next/server";
import { getCurrentModerator } from "@/app/lib/permissions";
import { buildUploadKey, uploadToR2 } from "@/app/lib/r2";

const SECTION_PERMISSION: Record<
  string,
  "mods" | "servers" | "occasion" | "guides" | "cards" | "hero" | "panels"
> = {
  "mod-paketleri": "mods",
  sunucular: "servers",
  "ozel-gunler": "occasion",
  projeler: "guides",
  "ana-sayfa": "cards",
  "ana-sayfa-hero": "hero",
  "ana-sayfa-panels": "panels",
};

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

// Moderatör panelindeki sürükle-bırak görsel yükleme için tek, ortak
// endpoint -- hangi bölüme (section) yüklendiğine göre gereken izni
// kontrol ediyor, sonra R2'ye "icerikler/<section>/<slug>/gorseller/..."
// yoluna yazıyor.
export async function POST(request: Request) {
  const moderator = await getCurrentModerator();
  if (!moderator) {
    return NextResponse.json({ error: "Oturum açık değil" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const section = formData.get("section");
  const slug = formData.get("slug");

  if (!(file instanceof File) || typeof section !== "string" || typeof slug !== "string") {
    return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
  }

  const requiredPermission = SECTION_PERMISSION[section];
  if (!requiredPermission) {
    return NextResponse.json({ error: "Geçersiz bölüm" }, { status: 400 });
  }
  if (!moderator.isOwner && !moderator.permissions.includes(requiredPermission)) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Sadece görsel dosyaları kabul edilir" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Dosya en fazla 8MB olabilir" }, { status: 400 });
  }

  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID) {
    return NextResponse.json(
      { error: "R2 kimlik bilgileri tanımlı değil — .env.local eksik" },
      { status: 500 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = buildUploadKey(section, slug, file.name);
  const url = await uploadToR2(key, buffer, file.type);

  return NextResponse.json({ url });
}
