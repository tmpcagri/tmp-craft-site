import Link from "next/link";
import type { NavLink } from "./lib/content";
import MenuToggle from "./menu-toggle";
import SearchBar from "./search-bar";

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
      <SearchBar />
      <div />
    </nav>
  );
}
