import Link from "next/link";

export default function Navbar({ className = "" }: { className?: string }) {
  return (
    <nav
      className={`fixed inset-x-0 top-0 z-20 grid grid-cols-3 items-center px-6 py-6 sm:px-10 ${className}`}
    >
      <Link
        href="/"
        className="justify-self-start font-sans text-2xl font-bold tracking-tight"
      >
        TMP Craft
      </Link>
      <button
        type="button"
        aria-label="Ara"
        className="justify-self-center flex w-64 items-center gap-3 rounded-full border border-current/20 px-4 py-2.5 text-sm transition-all duration-300 hover:bg-current/10 hover:shadow-[0_0_30px_-4px_currentColor]"
      >
        <svg
          width="16"
          height="16"
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
