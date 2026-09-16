import { createClient } from "./supabase/server";
import { toServerCardPreview, type ServerCardPreview, type ServerCardRow } from "./server-cards";

// Sunucu (server component) tarafında -- moderatörlerin /admin'den
// eklediği sunucuları okuyor. Hata durumunda (ör. tablo henüz
// migration'lanmadıysa) boş dizi döner, çağıran taraf sabit listeyle
// birleştirmeye devam eder.
export async function getDbServerCards(): Promise<ServerCardPreview[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("server_cards")
      .select("*")
      .order("display_order", { ascending: true });
    if (error || !data) return [];
    return (data as ServerCardRow[]).map(toServerCardPreview);
  } catch {
    return [];
  }
}
