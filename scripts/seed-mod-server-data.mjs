// Bir kerelik seed script'i: src/app/lib/downloads.ts'teki 17 sabit mod
// kaydını `mod_packages` tablosuna, src/app/page.tsx'teki 9 sabit
// SERVER_CARDS kaydını `server_cards` tablosuna, service role anahtarıyla
// (RLS'i atlayarak) yazar. Statik dizilere DOKUNMAZ -- onlar ayrı bir
// adımda, ayrı onayla kaldırılacak. Veriler aşağıda LİTERAL olarak
// kopyalanmıştır (script Next.js derlemesinin dışında, TS içe aktaramıyor)
// -- kaynak dosyalar değişirse burası da elle güncellenmeli.
//
// Kullanım:
//   node --env-file=.env.local scripts/seed-mod-server-data.mjs --limit=2   (test: ilk 2+2 kayıt)
//   node --env-file=.env.local scripts/seed-mod-server-data.mjs            (kalan tüm kayıtlar)
//
// mod_packages.slug PK olduğu için upsert idempotent. server_cards'ta
// doğal bir unique key olmadığından (id = random uuid), isme göre var
// olanı atlayarak elle idempotent hale getiriyoruz -- iki fazlı çalıştırma
// (önce --limit=2, sonra tam liste) kayıt çoğaltmaz.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Eksik env: NEXT_PUBLIC_SUPABASE_URL ve/veya SUPABASE_SERVICE_ROLE_KEY yok. " +
      "`node --env-file=.env.local scripts/seed-mod-server-data.mjs` ile çalıştırdığından emin ol.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// -- src/app/lib/downloads.ts'teki `raw` dizisinin birebir kopyası --
const MOD_SEED_RAW = [
  { name: "Terra Forge", category: "Mods", description: "Gelişmiş dünya üretimi ve yapı sistemi ekler.", gradient: "from-emerald-500 to-teal-700", gameVersion: "1.21", loader: "Forge", environment: "Client + Server", license: "MIT", dependsOn: [], author: "TMPCraft" },
  { name: "Beast Tamer", category: "Mods", description: "Yeni yaratıklar evcilleştirme mekaniği.", gradient: "from-orange-500 to-red-600", gameVersion: "1.20.4", loader: "Fabric", environment: "Client + Server", license: "CC-BY", dependsOn: ["Terra Forge"], author: "modrehberi" },
  { name: "Auto Farm Pro", category: "Mods", description: "Otomatik tarım ve üretim zincirleri.", gradient: "from-lime-500 to-green-700", gameVersion: "1.21", loader: "NeoForge", environment: "Server", license: "GPL-3.0", dependsOn: [], author: "redstonecu42" },
  { name: "Neon Craft", category: "Resource Packs", description: "Parlak, canlı renklerle yeniden tasarlanmış dokular.", gradient: "from-purple-500 to-fuchsia-600", gameVersion: "1.21", loader: "Vanilla", environment: "Client", license: "All Rights Reserved", dependsOn: [], author: "TMPCraft" },
  { name: "Rustic Realms", category: "Resource Packs", description: "Sıcak, doğal ve rustik bir görünüm.", gradient: "from-amber-500 to-orange-700", gameVersion: "1.20", loader: "Vanilla", environment: "Client", license: "CC-BY", dependsOn: [], author: "modrehberi" },
  { name: "Frost Peak", category: "Resource Packs", description: "Buzul temalı, soğuk tonlarda dokular.", gradient: "from-cyan-400 to-blue-600", gameVersion: "1.21", loader: "Vanilla", environment: "Client", license: "CC-BY", dependsOn: [], author: "TMPCraft" },
  { name: "Void Walker", category: "Data Packs", description: "Yeni boyutlar ve gizli geçitler ekler.", gradient: "from-slate-600 to-indigo-800", gameVersion: "1.21", loader: "Vanilla", environment: "Server", license: "MIT", dependsOn: [], author: "redstonecu42" },
  { name: "Loot Master", category: "Data Packs", description: "Özelleştirilmiş ganimet tabloları.", gradient: "from-yellow-600 to-amber-800", gameVersion: "1.20.4", loader: "Vanilla", environment: "Server", license: "MIT", dependsOn: [], author: "modrehberi" },
  { name: "Sunset Vale", category: "Shaders", description: "Sinematik aydınlatma ve gölgeler.", gradient: "from-orange-400 to-pink-600", gameVersion: "1.21", loader: "Fabric", environment: "Client", license: "All Rights Reserved", dependsOn: [], author: "TMPCraft" },
  { name: "Crystal Clear", category: "Shaders", description: "Su ve cam için gerçekçi yansımalar.", gradient: "from-sky-400 to-cyan-600", gameVersion: "1.20", loader: "Fabric", environment: "Client", license: "All Rights Reserved", dependsOn: [], author: "modrehberi" },
  { name: "Emerald Grove", category: "Modpacks", description: "Doğa ve keşif odaklı mod koleksiyonu.", gradient: "from-emerald-500 to-green-700", gameVersion: "1.20.4", loader: "Forge", environment: "Client + Server", license: "CC-BY", dependsOn: ["Terra Forge", "Beast Tamer"], author: "TMPCraft" },
  { name: "Iron Forge", category: "Modpacks", description: "Endüstriyel üretim ve teknoloji paketi.", gradient: "from-zinc-500 to-neutral-700", gameVersion: "1.21", loader: "NeoForge", environment: "Client + Server", license: "GPL-3.0", dependsOn: ["Auto Farm Pro"], author: "redstonecu42" },
  { name: "Coral Reef", category: "Modpacks", description: "Okyanus keşfi temalı mod paketi.", gradient: "from-teal-400 to-cyan-600", gameVersion: "1.20", loader: "Fabric", environment: "Client + Server", license: "CC-BY", dependsOn: [], author: "modrehberi" },
  { name: "EssentialsX", category: "Plugins", description: "Sunucu yönetimi için temel komutlar.", gradient: "from-blue-500 to-indigo-700", gameVersion: "1.21", loader: "Vanilla", environment: "Server", license: "GPL-3.0", dependsOn: [], author: "TMPCraft" },
  { name: "GuardianShield", category: "Plugins", description: "Arazi koruma ve izin sistemi.", gradient: "from-red-500 to-rose-700", gameVersion: "1.20.4", loader: "Vanilla", environment: "Server", license: "MIT", dependsOn: ["EssentialsX"], author: "redstonecu42" },
  { name: "TMP Survival", category: "Servers", description: "Klasik hayatta kalma deneyimi, topluluk odaklı.", gradient: "from-green-600 to-emerald-800", gameVersion: "1.21", loader: "Vanilla", environment: "Server", license: "All Rights Reserved", dependsOn: [], author: "TMPCraft" },
  { name: "TMP Creative", category: "Servers", description: "Sınırsız yaratıcılık için inşa sunucusu.", gradient: "from-violet-500 to-purple-700", gameVersion: "1.21", loader: "Vanilla", environment: "Server", license: "All Rights Reserved", dependsOn: [], author: "TMPCraft" },
];

// -- src/app/page.tsx'teki SERVER_CARDS dizisinin birebir kopyası --
const SERVER_SEED = [
  { name: "TMP Anaakım", players: "42/100" },
  { name: "TMP SkyBlock", players: "76/150" },
  { name: "TMP Faction", players: "33/80" },
  { name: "TMP Modlu", players: "21/50" },
  { name: "TMP Creative", players: "18/60" },
  { name: "TMP Event", players: "54/64" },
  { name: "TMP KitPvP", players: "29/40" },
  { name: "TMP Prison", players: "37/70" },
  { name: "TMP OneBlock", players: "45/80" },
];

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function toModPackageRow(item) {
  return {
    slug: slugify(item.name),
    name: item.name,
    category: item.category,
    description: item.description,
    gradient: item.gradient,
    game_version: item.gameVersion,
    loader: item.loader,
    environment: item.environment,
    license: item.license,
    depends_on: item.dependsOn,
    author: item.author,
    icon_image: null,
    author_link: null,
    created_by: null,
  };
}

function toServerCardRow(item, index) {
  const [current, max] = item.players.split("/").map((n) => parseInt(n, 10));
  return {
    name: item.name,
    current_players: current,
    max_players: max,
    display_order: index,
    created_by: null,
  };
}

const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : null;

async function seedMods() {
  const rows = MOD_SEED_RAW.map(toModPackageRow);
  const batch = limit ? rows.slice(0, limit) : rows;
  console.log(`\nmod_packages: ${batch.length}/${rows.length} kayıt upsert ediliyor...`);
  const { data, error } = await supabase
    .from("mod_packages")
    .upsert(batch, { onConflict: "slug" })
    .select("slug, name");
  if (error) {
    console.error("mod_packages upsert hatası:", error);
    process.exit(1);
  }
  console.log(`mod_packages: OK -- ${data.length} satır yazıldı:`, data.map((r) => r.slug).join(", "));
}

async function seedServers() {
  const rows = SERVER_SEED.map(toServerCardRow);
  const batch = limit ? rows.slice(0, limit) : rows;

  const { data: existing, error: selErr } = await supabase
    .from("server_cards")
    .select("name");
  if (selErr) {
    console.error("server_cards okuma hatası:", selErr);
    process.exit(1);
  }
  const existingNames = new Set((existing ?? []).map((r) => r.name));
  const toInsert = batch.filter((r) => !existingNames.has(r.name));
  const skipped = batch.length - toInsert.length;

  console.log(
    `\nserver_cards: ${batch.length}/${rows.length} kayıt işleniyor (${skipped} zaten var, atlandı)...`,
  );
  if (toInsert.length === 0) {
    console.log("server_cards: eklenecek yeni kayıt yok.");
    return;
  }
  const { data, error } = await supabase.from("server_cards").insert(toInsert).select("id, name");
  if (error) {
    console.error("server_cards insert hatası:", error);
    process.exit(1);
  }
  console.log(`server_cards: OK -- ${data.length} satır yazıldı:`, data.map((r) => r.name).join(", "));
}

await seedMods();
await seedServers();
console.log("\nBitti.");
