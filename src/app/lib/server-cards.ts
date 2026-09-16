import { createClient } from "./supabase/client";

// Moderatörlerin /admin üzerinden eklediği gerçek sunucu kartları --
// src/app/page.tsx'deki sabit SERVER_CARDS dizisinin ÜSTÜNE eklenen bir
// tablo, onun yerine geçmiyor (bkz. 0020_server_cards_table.sql'deki not).
export type ServerCardRow = {
  id: string;
  name: string;
  current_players: number;
  max_players: number;
  display_order: number;
  created_at: string;
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
};

export async function createServerCard(input: ServerCardInput): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase.from("server_cards").insert({
    name: input.name,
    current_players: input.currentPlayers,
    max_players: input.maxPlayers,
    display_order: input.displayOrder,
    created_by: user?.id ?? null,
  });
  if (error) throw error;
}

export async function updateServerCard(
  id: string,
  patch: Partial<ServerCardInput>,
): Promise<void> {
  const supabase = createClient();
  const dbPatch: Record<string, unknown> = {};
  if (patch.name !== undefined) dbPatch.name = patch.name;
  if (patch.currentPlayers !== undefined) dbPatch.current_players = patch.currentPlayers;
  if (patch.maxPlayers !== undefined) dbPatch.max_players = patch.maxPlayers;
  if (patch.displayOrder !== undefined) dbPatch.display_order = patch.displayOrder;

  const { error } = await supabase.from("server_cards").update(dbPatch).eq("id", id);
  if (error) throw error;
}

export async function deleteServerCard(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("server_cards").delete().eq("id", id);
  if (error) throw error;
}
