import ScrollReveal from "./scroll-reveal";

const cards = [
  {
    title: "Hakkımızda",
    body: "TMP Craft, fikirden ürüne zanaatla inşa eden bir dijital yapım stüdyosudur.",
    span: "sm:col-span-2 sm:row-span-2",
  },
  {
    title: "Hizmetlerimiz",
    body: "Web tasarımı, marka kimliği ve dijital ürün geliştirme.",
    span: "",
  },
  {
    title: "İletişim",
    body: "Bir projeniz mi var? Bize ulaşın, birlikte konuşalım.",
    span: "",
  },
  {
    title: "Öne Çıkan Proje",
    body: "Yakında burada — ilk vaka çalışmamızı hazırlıyoruz.",
    span: "sm:col-span-2",
  },
  {
    title: "Topluluk",
    body: "Sosyal medyada bizi takip edin, gelişmeleri kaçırmayın.",
    span: "",
  },
];

export default function InfoCards() {
  return (
    <section className="relative z-10 w-full px-6 py-24 sm:px-10">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:auto-rows-[minmax(0,1fr)] sm:grid-cols-3">
        {cards.map((card, i) => (
          <ScrollReveal
            key={card.title}
            style={{ transitionDelay: `${i * 80}ms` }}
            className={`rounded-3xl border border-black/10 bg-white/40 p-8 backdrop-blur-xl dark:border-white/10 dark:bg-black/40 ${card.span}`}
          >
            <h3 className="font-sans text-xl font-bold text-black dark:text-white">
              {card.title}
            </h3>
            <p className="mt-3 font-sans text-sm text-black/60 dark:text-white/60">
              {card.body}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
