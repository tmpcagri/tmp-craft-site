import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import CookieConsent from "./cookie-consent";
import { getSiteContent } from "./lib/content";
import { resolveActiveTheme } from "./lib/occasion";
import OccasionBackground from "./occasion-background";
import { OccasionProvider } from "./occasion-context";
import TestPanel from "./test-panel";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const siteUrl = "https://cagrimedya.com";
const siteName = "TMP Craft";
const siteDescription =
  "TMP Craft'ta Minecraft mod, modpack, resource pack ve sunucu içeriklerini ücretsiz indirin. Türkçe rehberler, güncel sürüm desteği ve aktif topluluk ile Minecraft deneyimini geliştirin.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Minecraft Mod, Modpack ve Resource Pack İndir`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} | Minecraft Mod, Modpack ve Resource Pack İndir`,
    description:
      "Minecraft mod, modpack, resource pack ve sunucu içeriklerini keşfedin ve indirin.",
    url: siteUrl,
    locale: "tr_TR",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Minecraft Mod, Modpack ve Resource Pack İndir`,
    description:
      "Minecraft mod, modpack, resource pack ve sunucu içeriklerini keşfedin ve indirin.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: "Minecraft mod, modpack ve resource pack indirme platformu",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "tr-TR",
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const { specialOccasion } = getSiteContent();
  const activeTheme = resolveActiveTheme(specialOccasion);

  return (
    <html
      lang="tr"
      className={`${dmSans.variable} ${dmMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=s==='dark'?true:s==='light'?false:window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`min-h-full flex flex-col relative ${activeTheme === "yas" ? "occasion-yas" : ""}`}
      >
        <OccasionProvider theme={activeTheme}>
          {activeTheme !== "none" && (
            <OccasionBackground
              imageUrl={specialOccasion.backgroundImageUrl}
              opacity={specialOccasion.backgroundOpacity}
            />
          )}
          {children}
          <CookieConsent />
          <TestPanel />
        </OccasionProvider>
      </body>
    </html>
  );
}
