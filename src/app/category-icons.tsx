import type { DownloadCategory } from "./lib/downloads";

// Kategori başına tek bir ikon seti -- hem menü hem de Mod Paketleri
// filtre sekmelerinde kullanılıyor, tek bir yerden yönetilsin diye
// paylaşılan bir dosyaya taşındı.
export const CATEGORY_ICONS: Record<DownloadCategory, React.ReactNode> = {
  Mods: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  "Resource Packs": (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </>
  ),
  "Data Packs": (
    <>
      <path d="M21 8c0 1.66-4 3-9 3s-9-1.34-9-3 4-3 9-3 9 1.34 9 3z" />
      <path d="M3 8v8c0 1.66 4 3 9 3s9-1.34 9-3V8" />
    </>
  ),
  Shaders: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  Modpacks: (
    <>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
    </>
  ),
  Plugins: (
    <>
      <path d="M4 14a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <path d="M14 6h6M6 4v4M18 8V4M2 10h6M14 10h2a2 2 0 0 1 2 2v2" />
    </>
  ),
  Servers: (
    <>
      <rect x="2" y="3" width="20" height="6" rx="1" />
      <rect x="2" y="15" width="20" height="6" rx="1" />
      <path d="M6 6h.01M6 18h.01" />
    </>
  ),
};
