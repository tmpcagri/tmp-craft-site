import Link from "next/link";
import type { InfoCard } from "./lib/content";
import ScrollReveal from "./scroll-reveal";

function isSafeLink(url: string): boolean {
  return url.startsWith("/") || /^https?:\/\//.test(url);
}

export default function InfoCards({ cards }: { cards: InfoCard[] }) {
  if (cards.length === 0) return null;

  return (
    <section className="relative z-10 w-full px-6 py-16 sm:px-10">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:auto-rows-[minmax(0,1fr)] sm:grid-cols-3">
        {cards.map((card, i) => (
          <ScrollReveal
            key={card.title}
            style={{ transitionDelay: `${i * 80}ms` }}
            className={`group relative flex flex-col justify-end overflow-hidden rounded-3xl border border-black/10 bg-white/40 p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40 ${card.span}`}
          >
            {card.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- moderator-provided card image URL
              <img
                src={card.imageUrl}
                alt=""
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40 transition-opacity group-hover:opacity-55 dark:opacity-30"
              />
            )}
            <h3 className="font-sans text-xl font-bold text-black dark:text-white">
              {card.title}
            </h3>
            <p className="mt-3 font-sans text-sm text-black/60 dark:text-white/60">
              {card.body}
            </p>
            {card.linkUrl && isSafeLink(card.linkUrl) && (
              <Link
                href={card.linkUrl}
                className="mt-4 inline-flex w-fit items-center gap-1 font-sans text-sm font-semibold text-black underline underline-offset-4 dark:text-white"
              >
                Daha fazla →
              </Link>
            )}
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
