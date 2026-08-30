import Link from "next/link";
import type { NavLink } from "./lib/content";
import MenuToggle from "./menu-toggle";

export default function Navbar({
  className = "",
  logoText,
  navLinks,
}: {
  className?: string;
  logoText: string;
  navLinks: NavLink[];
}) {
  return (
    <nav
      className={`fixed inset-x-0 top-0 z-20 grid grid-cols-3 items-center px-6 py-6 sm:px-10 ${className}`}
    >
      <div className="flex items-center gap-4 justify-self-start">
        <MenuToggle logoText={logoText} navLinks={navLinks} />
        <Link
          href="/"
          className="font-sans text-2xl font-bold tracking-tight"
        >
          {logoText}
        </Link>
      </div>
      <button
        type="button"
        aria-label="Ara"
        className="justify-self-center flex w-72 items-center gap-3 rounded-full border border-current/20 px-5 py-3 text-base transition-all duration-300 hover:bg-current/10 hover:shadow-[0_0_30px_-4px_currentColor]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 opacity-70"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="opacity-60">Ara...</span>
      </button>
      <div />
    </nav>
  );
}
