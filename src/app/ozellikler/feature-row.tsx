import type { ReactNode } from "react";

export default function FeatureRow({
  eyebrow,
  title,
  description,
  bullets,
  gradient,
  reverse = false,
  preview,
}: {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  gradient: string;
  reverse?: boolean;
  preview: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-10 lg:flex-row ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      <div className="flex-1">
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-[0.2em] text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
          {eyebrow}
        </span>
        <h2 className="mt-4 font-sans text-2xl font-bold text-black dark:text-white sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70 sm:text-base">
          {description}
        </p>
        <ul className="mt-5 flex flex-col gap-2">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 text-sm text-black/70 dark:text-white/70"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1">
        <div
          className={`relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gradient-to-br shadow-xl ${gradient}`}
        >
          {preview}
        </div>
      </div>
    </div>
  );
}
