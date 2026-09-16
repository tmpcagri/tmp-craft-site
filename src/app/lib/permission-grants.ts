import { createClient } from "./supabase/client";
import type { ModeratorTab } from "./permissions";

// Yetki devri onay akışı -- lib/messages.ts / lib/mod-chat.ts'teki gibi
// doğrudan client + RLS, ayrı bir API route yok (kabul etme bile bir
// security definer RPC çağrısı, sunucu tarafında ekstra bir şeye gerek
// yok). Owner tarafı (/yonetim) ve hedef kullanıcı tarafı (/admin) aynı
// dosyayı kullanıyor.
export type GrantStatus = "pending" | "accepted" | "cancelled";

export type PermissionGrant = {
  id: string;
  targetUserId: string;
  tab: ModeratorTab;
  grantedBy: string | null;
  status: GrantStatus;
  createdAt: string;
};

type GrantRow = {
  id: string;
  target_user_id: string;
  tab: ModeratorTab;
  granted_by: string | null;
  status: GrantStatus;
  created_at: string;
};

const GRANT_COLUMNS = "id, target_user_id, tab, granted_by, status, created_at";

function mapGrant(row: GrantRow): PermissionGrant {
  return {
    id: row.id,
    targetUserId: row.target_user_id,
    tab: row.tab,
    grantedBy: row.granted_by,
    status: row.status,
    createdAt: row.created_at,
  };
}

// Hedef kullanıcının kendi bekleyen istekleri -- /admin'de "Kabul Et" kartı için.
export async function getMyPendingGrants(): Promise<PermissionGrant[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("pending_permission_grants")
    .select(GRANT_COLUMNS)
    .eq("target_user_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapGrant);
}

// Hedef kullanıcı kendi isteğini kabul ediyor -- accept_permission_grant()
// hem grant'i hem profiles.permissions'ı tek transaction'da güncelliyor.
export async function acceptPermissionGrant(grantId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("accept_permission_grant", {
    p_grant_id: grantId,
  });
  if (error) throw error;
}

// Owner tarafı: tüm bekleyen istekler (/yonetim'de her kullanıcı kartında
// gösterip iptal edebilmek için).
export async function getAllPendingGrants(): Promise<PermissionGrant[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pending_permission_grants")
    .select(GRANT_COLUMNS)
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapGrant);
}

// Owner yeni bir tab önerir -- doğrudan permissions'a yazmak yerine
// burada bir istek açılıyor. Aynı kullanıcı+tab için zaten bekleyen bir
// istek varsa migration'daki partial unique index bunu reddeder.
export async function createPermissionGrant(
  targetUserId: string,
  tab: ModeratorTab,
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Giriş yapmalısın.");

  const { error } = await supabase
    .from("pending_permission_grants")
    .insert({ target_user_id: targetUserId, tab, granted_by: user.id });
  if (error) throw error;
}

export async function cancelPermissionGrant(grantId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("pending_permission_grants")
    .update({ status: "cancelled", resolved_at: new Date().toISOString() })
    .eq("id", grantId);
  if (error) throw error;
}
