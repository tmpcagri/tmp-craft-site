import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/site-content.json");

export type InfoCard = {
  title: string;
  body: string;
  span: string;
  imageUrl: string;
  linkUrl: string;
};

export type NavLink = {
  label: string;
  href: string;
};

export type CreatorPlatform = "YouTube" | "Twitch" | "TikTok";
export type CreatorTier = "premium" | "standard" | "newcomer";

export type RecommendedCreator = {
  name: string;
  platform: CreatorPlatform;
  note: string;
  tier: CreatorTier;
};

export type ContactInfo = {
  whatsapp: string;
  email: string;
};

export type SiteContent = {
  navbar: {
    logoText: string;
  };
  infoCards: InfoCard[];
  footerLinks: NavLink[];
  recommendedCreators: RecommendedCreator[];
  contact: ContactInfo;
};

export function getSiteContent(): SiteContent {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export function saveSiteContent(content: SiteContent): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(content, null, 2) + "\n", "utf-8");
}
