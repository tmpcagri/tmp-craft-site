import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Cloudflare R2, S3 uyumlu API sunuyor -- @aws-sdk/client-s3 buradan
// doğrudan kullanılabiliyor, sadece endpoint'i R2'ye gösteriyoruz.
// SUNUCU TARAFI bir client bu -- SUPABASE_SERVICE_ROLE_KEY gibi, asla
// "use client" dosyasından import edilmemeli.
function client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

// Dosya adını URL'de güvenli, tahmin edilebilir hale getiriyor -- Türkçe
// karakterleri normalize ediyor, boşlukları tire yapıyor.
function slugifyFilename(name: string): string {
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
  const base = name.slice(0, name.length - ext.length);
  const slug = base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${slug || "dosya"}${ext.toLowerCase()}`;
}

// `icerikler/<bolum>/<oge-slug>/gorseller/<zaman-damgasi>-<dosya-adi>`
// şeklinde, moderatör panelinden yapılan yüklemeler için ortak yol üretici
// -- ana sayfa/mod paketleri/sunucular gibi bölümler arasında tutarlı.
export function buildUploadKey(
  section: string,
  itemSlug: string,
  filename: string,
): string {
  return `icerikler/${section}/${itemSlug}/gorseller/${Date.now()}-${slugifyFilename(filename)}`;
}

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
  await client().send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
