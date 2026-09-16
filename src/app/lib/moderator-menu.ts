import type { ModeratorTab } from "./permissions";

// Kimlik panelinin altındaki "hangi alanı yöneteceksin" menüsünün veri
// modeli -- bir GRUP başka gruplar veya YAPRAK'lar (gerçek, izin
// kontrollü bir ayar ekranı) içerebilir, iç içe geçme derinliği sabit
// değil (bkz. patronun "kategori sayısı çoğalabilecek" isteği). Bugün
// sadece 2 seviye (grup -> yaprak) kullanılıyor, ama resolveMenuLevels
// herhangi bir derinlikte çalışır -- ileride bir yaprağın yerine yeni bir
// alt-grup konursa kod değişmeden yeni seviye otomatik açılır.
export type ModeratorMenuLeaf = {
  type: "leaf";
  id: string;
  label: string;
  tab: ModeratorTab;
};

export type ModeratorMenuGroup = {
  type: "group";
  id: string;
  label: string;
  children: ModeratorMenuNode[];
};

export type ModeratorMenuNode = ModeratorMenuGroup | ModeratorMenuLeaf;

// Eski /admin GROUPS gruplamasıyla birebir aynı (bkz. MOD_CHAT_CHANNELS,
// lib/mod-chat.ts) -- aynı 5 alan, ama burada her alanın kendi gerçek
// alt-ayarları (yaprak) da var.
export const MODERATOR_MENU: ModeratorMenuGroup[] = [
  {
    type: "group",
    id: "ana-sayfa",
    label: "Ana Sayfa",
    children: [
      { type: "leaf", id: "cards", label: "Duyuru Kartları", tab: "cards" },
      { type: "leaf", id: "occasion", label: "Özel Günler Teması", tab: "occasion" },
      { type: "leaf", id: "ticker", label: "CANLI Şeridi", tab: "ticker" },
      { type: "leaf", id: "hero", label: "Hero Kartları", tab: "hero" },
      { type: "leaf", id: "panels", label: "Öne Çıkan Modlar", tab: "panels" },
    ],
  },
  {
    type: "group",
    id: "mod-paketleri",
    label: "Mod Paketleri",
    children: [{ type: "leaf", id: "mods", label: "Mod / Shader Yükle", tab: "mods" }],
  },
  {
    type: "group",
    id: "sunucular",
    label: "Sunucular",
    children: [{ type: "leaf", id: "servers", label: "Sunucu Kartları", tab: "servers" }],
  },
  {
    type: "group",
    id: "topluluk",
    label: "Topluluk",
    children: [
      { type: "leaf", id: "creators", label: "Yayıncılar", tab: "creators" },
      { type: "leaf", id: "articles", label: "Makaleler", tab: "articles" },
      { type: "leaf", id: "topluluk_hero", label: "Alt Yazılar", tab: "topluluk_hero" },
    ],
  },
  {
    type: "group",
    id: "site",
    label: "Site",
    children: [{ type: "leaf", id: "links", label: "Footer / Menü Linkleri", tab: "links" }],
  },
];

// Moderatörün gerçekten erişemediği yaprakları budar, hiç erişilebilir
// çocuğu kalmayan gruplar da tamamen kaldırılır.
export function pruneMenu(
  nodes: ModeratorMenuNode[],
  moderator: { isOwner: boolean; permissions: ModeratorTab[] },
): ModeratorMenuNode[] {
  return nodes.flatMap((node): ModeratorMenuNode[] => {
    if (node.type === "leaf") {
      const allowed = moderator.isOwner || moderator.permissions.includes(node.tab);
      return allowed ? [node] : [];
    }
    const children = pruneMenu(node.children, moderator);
    return children.length > 0 ? [{ ...node, children }] : [];
  });
}

export type ResolvedMenuLevel = {
  options: { id: string; label: string }[];
  selectedId: string;
};

// `path`teki seçimleri sırayla takip ederek her seviyenin seçeneklerini +
// o seviyede gerçekten seçili olanı üretir. `path` geçersiz/eksikse (ilk
// yükleme, ya da izin değişip önceki seçim artık erişilemez olduysa) her
// seviyede ilk seçeneğe düşer. Bir YAPRAĞA ulaşınca durur ve leafId'yi
// döndürür -- daha derin path parçaları yoksayılır.
export function resolveMenuLevels(
  tree: ModeratorMenuNode[],
  path: string[],
): { levels: ResolvedMenuLevel[]; leafId: string | null } {
  const levels: ResolvedMenuLevel[] = [];
  let children = tree;
  let depth = 0;

  while (children.length > 0) {
    const options = children.map((c) => ({ id: c.id, label: c.label }));
    const requested = path[depth];
    const selectedId = children.some((c) => c.id === requested) ? requested : children[0].id;
    levels.push({ options, selectedId });

    const node = children.find((c) => c.id === selectedId)!;
    if (node.type === "leaf") return { levels, leafId: node.id };

    children = node.children;
    depth++;
  }

  return { levels, leafId: null };
}
