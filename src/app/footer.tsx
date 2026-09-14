import type { NavLink } from "./lib/content";
import { DOWNLOAD_CATEGORIES } from "./lib/downloads";
import { groupNavLinks } from "./lib/nav-link-groups";
import Logo, { InlineLogo } from "./logo";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
} from "./social-icons";

const socials = [
  { label: "YouTube", href: "https://www.youtube.com/@tmp_cagri", Icon: YouTubeIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@tmp_cagri", Icon: TikTokIcon },
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "Instagram", href: "https://www.instagram.com/tmp_cagri46", Icon: InstagramIcon },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: NavLink[];
}) {
  if (links.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
        {title}
      </h3>
      <nav className="flex flex-col gap-2 text-sm text-black/60 dark:text-white/60">
        {links.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className="transition hover:text-black dark:hover:text-white"
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}

export default function Footer({
  links,
}: {
  logoText: string;
  links: NavLink[];
}) {
  const { platform: platformLinks, legal: legalLinks, kurumsal: kurumsalLinks } =
    groupNavLinks(links);

  return (
    <footer className="relative z-10 w-full border-t border-black/10 bg-white/30 px-6 py-10 backdrop-blur-xl dark:border-white/10 dark:bg-black/30 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 flex flex-col gap-2 text-black dark:text-white sm:col-span-3 lg:col-span-1">
            <Logo compact tagline />
          </div>

          <FooterColumn
            title="Kategoriler"
            links={DOWNLOAD_CATEGORIES.map((category) => ({
              label: category,
              href: `/mod-paketleri?category=${encodeURIComponent(category)}`,
            }))}
          />
          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="Kurumsal" links={kurumsalLinks} />
          <FooterColumn title="Yasal" links={legalLinks} />

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
              Bizi Takip Et
            </h3>
            <div className="flex flex-col gap-2.5">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel={href !== "#" ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-2.5 text-sm text-black/60 transition hover:text-black dark:text-white/60 dark:hover:text-white"
                >
                  <Icon />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-black/60 dark:text-white/60">
          Bu site ÇağrıMedya grup ürünüdür. © {new Date().getFullYear()}{" "}
          <InlineLogo /> Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
