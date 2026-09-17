import { createClient } from "./supabase/client";

// Moderatörlerin /admin üzerinden eklediği gerçek sunucu kartları --
// src/app/page.tsx'deki sabit SERVER_CARDS dizisinin ÜSTÜNE eklenen bir
// tablo, onun yerine geçmiyor (bkz. 0020_server_cards_table.sql'deki not).
export type ServerPlatform = "java" | "bedrock" | "both";

export type ServerSocialLink = {
  label: string;
  url: string;
};

// 0030_server_cards_detail_fields.sql'deki yeni alanlar -- hepsi nullable
// (mevcut satırlarda boş olabilir, moderatör düzenleyince dolar).
export type ServerCardRow = {
  id: string;
  name: string;
  current_players: number;
  max_players: number;
  display_order: number;
  created_at: string;
  description: string | null;
  body_text: string | null;
  image_url: string | null;
  video_url: string | null;
  platform: ServerPlatform | null;
  ip_address: string | null;
  server_password: string | null;
  social_links: ServerSocialLink[];
};

export type ServerCardPreview = {
  name: string;
  players: string;
  fill: number;
};

export function toServerCardPreview(row: ServerCardRow): ServerCardPreview {
  const fill =
    row.max_players > 0
      ? Math.round((row.current_players / row.max_players) * 100)
      : 0;
  return {
    name: row.name,
    players: `${row.current_players}/${row.max_players}`,
    fill,
  };
}

export async function listServerCards(): Promise<ServerCardRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("server_cards")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data as ServerCardRow[];
}

export type ServerCardInput = {
  name: string;
  currentPlayers: number;
  maxPlayers: number;
  displayOrder: number;
  description: string;
  bodyText: string;
  imageUrl: string;
  videoUrl: string;
  platform: ServerPlatform | null;
  ipAddress: string;
  serverPassword: string;
  socialLinks: ServerSocialLink[];
};

function toDbPatch(patch: Partial<ServerCardInput>): Record<string, unknown> {
  const dbPatch: Record<string, unknown> = {};
  if (patch.name !== undefined) dbPatch.name = patch.name;
  if (patch.currentPlayers !== undefined) dbPatch.current_players = patch.currentPlayers;
  if (patch.maxPlayers !== undefined) dbPatch.max_players = patch.maxPlayers;
  if (patch.displayOrder !== undefined) dbPatch.display_order = patch.displayOrder;
  if (patch.description !== undefined) dbPatch.description = patch.description || null;
  if (patch.bodyText !== undefined) dbPatch.body_text = patch.bodyText || null;
  if (patch.imageUrl !== undefined) dbPatch.image_url = patch.imageUrl || null;
  if (patch.videoUrl !== undefined) dbPatch.video_url = patch.videoUrl || null;
  if (patch.platform !== undefined) dbPatch.platform = patch.platform;
  if (patch.ipAddress !== undefined) dbPatch.ip_address = patch.ipAddress || null;
  if (patch.serverPassword !== undefined) dbPatch.server_password = patch.serverPassword || null;
  if (patch.socialLinks !== undefined) dbPatch.social_links = patch.socialLinks;
  return dbPatch;
}

export async function createServerCard(input: ServerCardInput): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase.from("server_cards").insert({
    ...toDbPatch(input),
    created_by: user?.id ?? null,
  });
  if (error) throw error;
}

export async function updateServerCard(
  id: string,
  patch: Partial<ServerCardInput>,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("server_cards").update(toDbPatch(patch)).eq("id", id);
  if (error) throw error;
}

export async function deleteServerCard(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("server_cards").delete().eq("id", id);
  if (error) throw error;
}
