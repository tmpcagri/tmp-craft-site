import test from "node:test";
import assert from "node:assert/strict";
import { buildUploadKey } from "./r2";

// R2 (S3 uyumlu) object key kuralları: sadece ASCII, boşluk yok, kontrol
// karakteri yok. Testler bunu da doğruluyor.
function assertValidR2Key(key: string) {
  assert.match(
    key,
    /^[A-Za-z0-9!\-_.*'()/]+$/,
    `"${key}" geçersiz karakter içeriyor (R2/S3 object key için güvenli değil)`,
  );
  assert.doesNotMatch(key, /\s/, `"${key}" boşluk içeriyor`);
  assert.doesNotMatch(key, /\/\//, `"${key}" ardışık "//" içeriyor`);
  assert.ok(!key.startsWith("/"), `"${key}" "/" ile başlıyor`);
}

test("mod-paketleri -> mod-packages/<slug>/... üretir", () => {
  const key = buildUploadKey("mod-paketleri", "demir-modpack", "icon.png");
  assert.match(key, /^mod-packages\/demir-modpack\/\d+-icon\.png$/);
  assertValidR2Key(key);
});

test("sunucular -> server-cards/... üretir", () => {
  const key = buildUploadKey("sunucular", "anarsi-sunucu", "kapak.jpg");
  assert.match(key, /^server-cards\/anarsi-sunucu-\d+-kapak\.jpg$/);
  assertValidR2Key(key);
});

test("ana-sayfa -> homepage/... üretir", () => {
  const key = buildUploadKey("ana-sayfa", "banner", "gorsel.webp");
  assert.match(key, /^homepage\/banner-\d+-gorsel\.webp$/);
  assertValidR2Key(key);
});

test("ana-sayfa-hero -> homepage/... üretir", () => {
  const key = buildUploadKey("ana-sayfa-hero", "hero-1", "gorsel.png");
  assert.match(key, /^homepage\/hero-1-\d+-gorsel\.png$/);
  assertValidR2Key(key);
});

test("ana-sayfa-panels -> homepage/... üretir", () => {
  const key = buildUploadKey("ana-sayfa-panels", "panel-2", "gorsel.png");
  assert.match(key, /^homepage\/panel-2-\d+-gorsel\.png$/);
  assertValidR2Key(key);
});

test("projeler -> homepage/... üretir (öne çıkan rehber kartları anasayfada)", () => {
  const key = buildUploadKey("projeler", "build-farm-rehberi", "kart.png");
  assert.match(key, /^homepage\/build-farm-rehberi-\d+-kart\.png$/);
  assertValidR2Key(key);
});

test("ozel-gunler + arka-plan-resmi -> occasion/flags/... üretir", () => {
  const key = buildUploadKey("ozel-gunler", "arka-plan-resmi", "bayrak.png");
  assert.match(key, /^occasion\/flags\/\d+-bayrak\.png$/);
  assertValidR2Key(key);
});

test("ozel-gunler + arka-plan-yas -> occasion/ataturk/... üretir", () => {
  const key = buildUploadKey("ozel-gunler", "arka-plan-yas", "arka-plan.png");
  assert.match(key, /^occasion\/ataturk\/\d+-arka-plan\.png$/);
  assertValidR2Key(key);
});

test("ozel-gunler + yas-ikon -> occasion/ataturk/... üretir", () => {
  const key = buildUploadKey("ozel-gunler", "yas-ikon", "rozet.svg");
  assert.match(key, /^occasion\/ataturk\/\d+-rozet\.svg$/);
  assertValidR2Key(key);
});

test("ozel-gunler + arka-plan-dini -> occasion/diger-dini-gunler/... üretir", () => {
  const key = buildUploadKey("ozel-gunler", "arka-plan-dini", "hilal.png");
  assert.match(key, /^occasion\/diger-dini-gunler\/\d+-hilal\.png$/);
  assertValidR2Key(key);
});

test("ozel-gunler + bilinmeyen alt-kategori -> occasion/diger-dini-gunler/... üretir (fallback)", () => {
  const key = buildUploadKey("ozel-gunler", "ramazan-arka-plan", "hilal.png");
  assert.match(key, /^occasion\/diger-dini-gunler\/\d+-hilal\.png$/);
  assertValidR2Key(key);
});

test("bilinmeyen section -> icerikler/<section>/... fallback üretir", () => {
  const key = buildUploadKey("yepyeni-bolum", "ogeler", "dosya.png");
  assert.match(
    key,
    /^icerikler\/yepyeni-bolum\/ogeler\/gorseller\/\d+-dosya\.png$/,
  );
  assertValidR2Key(key);
});

test("boş section -> icerikler/ fallback'ına düşer (SECTION_TOP_FOLDER'da eşleşmiyor)", () => {
  const key = buildUploadKey("", "ogeler", "dosya.png");
  assert.match(key, /^icerikler\/\/ogeler\/gorseller\/\d+-dosya\.png$/);
});

test("BUG: itemSlug'da Türkçe karakter/boşluk/özel karakter olduğunda dahi geçerli bir R2 key üretmeli", () => {
  // src/app/api/admin/upload/route.ts, formData'dan gelen "slug" alanını
  // hiçbir doğrulama/slugify yapmadan doğrudan buildUploadKey'e geçiriyor
  // (satır 33, 62). buildUploadKey de yalnızca `filename`'i
  // slugifyFilename'den geçiriyor, `itemSlug`'ı OLDUĞU GİBİ key'e gömüyor.
  // Sonuç: itemSlug boşluk/Türkçe karakter/özel karakter içerdiğinde
  // uploadToR2 (r2.ts satır 108) bunu encodeURIComponent YAPMADAN
  // `${R2_PUBLIC_URL}/${key}` şeklinde bir public URL'e gömüyor -- geçersiz/
  // bozuk bir URL veritabanına yazılır ve <img src> gibi yerlerde kırılır.
  const key = buildUploadKey("sunucular", "Şık Sunucu Adı!", "kapak.jpg");
  assertValidR2Key(key);
});

test("filename'de Türkçe karakter, boşluk ve büyük harf olduğunda slugify edilir", () => {
  const key = buildUploadKey(
    "mod-paketleri",
    "demir-modpack",
    "Öğün Şölen İçerik Ekran Görüntüsü.PNG",
  );
  assert.match(
    key,
    /^mod-packages\/demir-modpack\/\d+-ogun-solen-icerik-ekran-goruntusu\.png$/,
  );
  assertValidR2Key(key);
});

test("filename'de özel karakter (&, %, #, ?, boşluk) olduğunda slugify edilir", () => {
  const key = buildUploadKey(
    "sunucular",
    "test-sunucu",
    "resim #1 (final) % 100 ?.png",
  );
  assertValidR2Key(key);
  assert.match(key, /^server-cards\/test-sunucu-\d+-resim-1-final-100\.png$/);
});

test("filename uzantısız olduğunda 'dosya' adını korur, uzantı eklemez", () => {
  const key = buildUploadKey("sunucular", "test-sunucu", "uzantisiz-dosya");
  assertValidR2Key(key);
  assert.match(key, /^server-cards\/test-sunucu-\d+-uzantisiz-dosya$/);
});

test("filename boş string olduğunda 'dosya' fallback adını kullanır", () => {
  const key = buildUploadKey("sunucular", "test-sunucu", "");
  assertValidR2Key(key);
  assert.match(key, /^server-cards\/test-sunucu-\d+-dosya$/);
});

test("filename yalnızca noktadan oluşuyorsa (ör. '.png') güvenli bir ad üretir", () => {
  const key = buildUploadKey("sunucular", "test-sunucu", ".png");
  assertValidR2Key(key);
});

test("aynı section+slug+filename için ardışık çağrılar farklı zaman damgası üretebilir (çakışmayı önler)", () => {
  const key1 = buildUploadKey("mod-paketleri", "demir-modpack", "icon.png");
  const key2 = buildUploadKey("mod-paketleri", "demir-modpack", "icon.png");
  // Aynı milisaniyede üretilirse zaman damgaları eşit olabilir -- bu durumda
  // test flaky olmasın diye yalnızca format doğrulanıyor, eşitsizlik
  // zorunlu tutulmuyor.
  assert.match(key1, /^mod-packages\/demir-modpack\/\d+-icon\.png$/);
  assert.match(key2, /^mod-packages\/demir-modpack\/\d+-icon\.png$/);
});
