import Link from "next/link";

const quickTopics = [
  "Yeni Sezon",
  "En Çok Sevilen Modlar",
  "Sunucu Güncellemesi",
  "Tasarım Yarışması",
  "Build Rehberleri",
];

export default function QuickTopicLinks() {
  return (
    <div className="fixed inset-x-0 top-20 z-20 flex justify-center px-6">
      <div className="flex max-w-full items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {quickTopics.map((topic) => (
          <Link
            key={topic}
            href="/topluluk"
            className="shrink-0 whitespace-nowrap rounded-full border border-black/10 bg-white/60 px-5 py-2.5 text-sm font-medium text-black/70 backdrop-blur-xl transition hover:bg-white dark:border-white/10 dark:bg-black/50 dark:text-white/70 dark:hover:bg-black/80"
          >
            {topic}
          </Link>
        ))}
      </div>
    </div>
  );
}
