import Link from "next/link";
import { notFound } from "next/navigation";
import { downloadItems } from "../../lib/downloads";
import DownloadButton from "./download-button";

export default async function ModPaketiPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = downloadItems.find((i) => i.slug === slug);
  if (!item) notFound();

  return (
    <div className="relative min-h-screen w-full bg-white px-6 pb-24 pt-24 dark:bg-black sm:px-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/mod-paketleri"
          className="text-sm text-black/60 underline underline-offset-4 dark:text-white/60"
        >
          ← Tüm paketler
        </Link>

        <div
          className={`mt-6 h-48 rounded-3xl bg-gradient-to-br ${item.gradient}`}
        />

        <span className="mt-6 block text-xs font-semibold uppercase tracking-wide opacity-50">
          {item.category}
        </span>
        <h1 className="mt-1 font-sans text-3xl font-bold text-black dark:text-white">
          {item.name}
        </h1>
        <p className="mt-3 text-base text-black/70 dark:text-white/70">
          {item.description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="opacity-50">Sürüm</p>
            <p className="font-medium text-black dark:text-white">
              {item.gameVersion}
            </p>
          </div>
          <div>
            <p className="opacity-50">Loader</p>
            <p className="font-medium text-black dark:text-white">
              {item.loader}
            </p>
          </div>
          <div>
            <p className="opacity-50">Ortam</p>
            <p className="font-medium text-black dark:text-white">
              {item.environment}
            </p>
          </div>
          <div>
            <p className="opacity-50">Lisans</p>
            <p className="font-medium text-black dark:text-white">
              {item.license}
            </p>
          </div>
          {item.dependsOn.length > 0 && (
            <div className="col-span-2">
              <p className="opacity-50">Bağımlılıklar</p>
              <p className="font-medium text-black dark:text-white">
                {item.dependsOn.join(", ")}
              </p>
            </div>
          )}
        </div>

        <DownloadButton />
      </div>
    </div>
  );
}
