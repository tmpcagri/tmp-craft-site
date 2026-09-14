// Shared "which section does this footer link belong to" categorization --
// used by both footer.tsx (desktop mega-footer) and menu-toggle.tsx
// (mobile drawer) so the two never drift apart. They did drift once
// already: the mobile drawer used to dump every link under one flat
// "Kurumsal" heading with no "Platform" group at all.
export const PLATFORM_HREFS = new Set([
  "/mod-paketleri",
  "/projeler",
  "/sunucular",
  "/egitimler",
  "/topluluk",
]);

export const LEGAL_HREFS = new Set([
  "/kurallar",
  "/gizlilik-politikasi",
  "/kvkk",
  "/telif-hakki",
]);

export function groupNavLinks<T extends { href: string }>(links: T[]) {
  return {
    platform: links.filter((l) => PLATFORM_HREFS.has(l.href)),
    legal: links.filter((l) => LEGAL_HREFS.has(l.href)),
    kurumsal: links.filter(
      (l) => !PLATFORM_HREFS.has(l.href) && !LEGAL_HREFS.has(l.href),
    ),
  };
}
