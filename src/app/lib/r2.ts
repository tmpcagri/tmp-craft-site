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

// Öge slug'ını (mod paketi/sunucu/ana sayfa öğesi adı gibi) R2 key path'ine
// gömülmeden önce güvenli hale getiriyor -- slugifyFilename ile aynı
// normalize/allowlist mantığı, ama uzantı yok ve makul bir uzunluk sınırı
// var. Çağıran kodlar (mod-paketleri-panel.tsx, sunucular-panel.tsx,
// api/admin/upload/route.ts) itemSlug'ı doğrulama/slugify yapmadan
// iletebiliyor -- burada sanitize etmezsek Türkçe karakter/boşluk/özel
// karakter içeren bir isim geçersiz bir R2 key'ine ve encodeURIComponent
// yapılmadan kullanılan bozuk bir public URL'e dönüşür.
function sanitizeItemSlug(raw: string): string {
  const slug = raw
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80)
    .replace(/(^-|-$)/g, "");
  return slug || "item";
}

// Bucket'ın üst düzey klasör standardı (bkz. proje R2 klasör yapısı):
// homepage/, social-media/, mod-packages/<slug>/, server-cards/,
// occasion/<alt-kategori>/. Moderatör panelindeki "section" değerini bu
// üst klasörlere eşliyoruz -- eşlenmeyen bir section gelirse (ileride
// eklenebilecek bölümler için) eski "icerikler/<section>/..." yoluna
// düşüyor, sessizce yanlış klasöre yazmak yerine.
const SECTION_TOP_FOLDER: Record<string, string> = {
  "ana-sayfa": "homepage",
  "ana-sayfa-hero": "homepage",
  "ana-sayfa-panels": "homepage",
  // "projeler" bölümü moderatör panelinde yalnızca anasayfadaki "Build ve
  // Farm Rehberi" kayan bandının öne çıkan kart görselleri için kullanılıyor
  // (bkz. featured-guides-panel.tsx) -- ayrı bir rehber detay galerisi yok,
  // bu yüzden anasayfa klasörüne giriyor.
  projeler: "homepage",
  sunucular: "server-cards",
};

// Özel Günler panelinde şu an yalnızca resmi/dini/yas temalarının arka
// plan görseli ve yas rozeti var (bkz. occasion-panel.tsx); Ramazan,
// Kurban Bayramı ve FSM için panelde henüz ayrı alan yok. Bilinen slug'ları
// en yakın klasöre eşliyoruz, geri kalanı (ör. ileride eklenecek "dini"
// alt seçimleri) "diger-dini-gunler" altına düşüyor.
const OCCASION_SUBFOLDER: Record<string, string> = {
  "arka-plan-resmi": "flags",
  "arka-plan-yas": "ataturk",
  "yas-ikon": "ataturk",
  "arka-plan-dini": "diger-dini-gunler",
};

// `<üst-klasör>/<oge-slug>-<zaman-damgasi>-<dosya-adi>` şeklinde,
// moderatör panelinden yapılan yüklemeler için ortak yol üretici -- ana
// sayfa/mod paketleri/sunucular/özel günler bölümleri arasında tutarlı.
export function buildUploadKey(
  section: string,
  itemSlug: string,
  filename: string,
): string {
  const safeName = slugifyFilename(filename);
  const stamp = Date.now();

  if (section === "mod-paketleri") {
    // Mod paketi görselleri (ikon/arka plan/galeri) hepsi aynı paketin
    // klasöründe toplanıyor -- itemSlug paket slug'ı veya slug+ek (ör.
    // "<slug>-galeri-0") olabilir, her ihtimalde mod-packages/ altına düşer.
    return `mod-packages/${sanitizeItemSlug(itemSlug)}/${stamp}-${safeName}`;
  }

  if (section === "ozel-gunler") {
    // itemSlug burada yalnızca sabit bir lookup anahtarı (bkz.
    // OCCASION_SUBFOLDER) -- key path'ine yazılmıyor, sanitize gerekmiyor.
    const subfolder = OCCASION_SUBFOLDER[itemSlug] ?? "diger-dini-gunler";
    return `occasion/${subfolder}/${stamp}-${safeName}`;
  }

  const topFolder = SECTION_TOP_FOLDER[section];
  if (topFolder) {
    return `${topFolder}/${sanitizeItemSlug(itemSlug)}-${stamp}-${safeName}`;
  }

  // Bilinmeyen/eşlenmemiş bölüm -- eski davranışa geri dön.
  return `icerikler/${section}/${sanitizeItemSlug(itemSlug)}/gorseller/${stamp}-${safeName}`;
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
