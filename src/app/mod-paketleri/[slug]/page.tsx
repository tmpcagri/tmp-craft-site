import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../footer";
import { getCurrentUser } from "../../lib/auth";
import { getSiteContent } from "../../lib/content";
import { LICENSE_URLS } from "../../lib/downloads";
import { getAllDownloadItems } from "../../lib/downloads-server";
import { InlineLogo } from "../../logo";
import Navbar from "../../navbar";
import QrShareButton from "../../qr-share-button";
import ModPaketiActions from "./mod-paketi-actions";

function AdSlot({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`fixed top-36 hidden h-[560px] w-48 flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 text-center 2xl:flex dark:border-white/15 ${
        side === "left" ? "left-6" : "right-6"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide opacity-40">
        Reklam Alanı
      </p>
      <p className="mt-1 px-3 text-xs opacity-50">
        Bu alan yakında reklam ortaklarımıza açılacak.
      </p>
    </div>
  );
}

export default async function ModPaketiPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const downloadItems = await getAllDownloadItems();
  const item = downloadItems.find((i) => i.slug === slug);
  if (!item) notFound();

  const content = getSiteContent();
  const user = await getCurrentUser();
  const licenseUrl = LICENSE_URLS[item.license];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-black">
      <Navbar
        className="text-black dark:text-white"
        logoText={content.navbar.logoText}
        navLinks={content.footerLinks}
        user={user}
      />
      <AdSlot side="left" />
      <AdSlot side="right" />

      <div className="flex-1 px-6 pb-24 pt-32 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/mod-paketleri"
            className="text-sm text-black/60 underline underline-offset-4 dark:text-white/60"
          >
            ← Tüm paketler
          </Link>

          <div className="mt-6 grid grid-cols-1 items-start gap-8 [grid-template-areas:'middle'_'right'_'left'] lg:grid-cols-[200px_1fr_300px] lg:[grid-template-areas:'left_middle_right']">
            {/* Sol: yapımcı, lisans, bağımlılıklar */}
            <div style={{ gridArea: "left" }} className="flex flex-col gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                  Yapımcı
                </p>
                <p className="mt-1 font-semibold text-black dark:text-white">
                  {item.author}
                </p>
                {item.authorLink ? (
                  <a
                    href={item.authorLink}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="mt-1 inline-block text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    Sitesi / sosyal medyası →
                  </a>
                ) : (
                  <p className="mt-1 text-xs text-black/60 dark:text-white/60">
                    Henüz <InlineLogo /> üyesi değil
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                  Lisans
                </p>
                {licenseUrl ? (
                  <a
                    href={licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    {item.license} →
                  </a>
                ) : (
                  <p className="mt-1 font-medium text-black dark:text-white">
                    {item.license}
                  </p>
                )}
              </div>

              {item.dependsOn.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                    Bağımlılıklar
                  </p>
                  <div className="mt-2 flex flex-col gap-1.5">
                    {item.dependsOn.map((depName) => {
                      const depItem = downloadItems.find(
                        (i) => i.name === depName,
                      );
                      return depItem ? (
                        <Link
                          key={depName}
                          href={`/mod-paketleri/${depItem.slug}`}
                          className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          {depName} →
                        </Link>
                      ) : (
                        <span
                          key={depName}
                          className="text-sm text-black/60 dark:text-white/60"
                        >
                          {depName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Orta: kutucuk görsel + açıklama — geniş, rahat okunur */}
            <div style={{ gridArea: "middle" }} className="flex flex-col gap-5">
              <div
                className={`relative aspect-square w-full max-w-[240px] overflow-hidden rounded-3xl shadow-xl ${
                  item.iconImage ? "" : `bg-gradient-to-br ${item.gradient}`
                }`}
              >
                {item.iconImage ? (
                  // eslint-disable-next-line @next/next/no-img-element -- kullanıcı tarafından yüklenen mod görseli
                  <img
                    src={item.iconImage}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col justify-end p-4">
                    <span className="w-fit rounded-full bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>
                )}
              </div>

              <h1 className="font-sans text-3xl font-bold text-black dark:text-white sm:text-4xl">
                {item.name}
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-black/70 dark:text-white/70">
                {item.description}
              </p>
            </div>

            {/* Sağ: bilgi paneli + indirme + etkileşim — sayfa kaydırılsa da üstte kalır */}
            <div
              style={{ gridArea: "right" }}
              className="flex flex-col gap-5 lg:sticky lg:top-36 lg:self-start"
            >
              <QrShareButton inline />

              <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
                <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                  Bilgi Paneli
                </p>
                <dl className="mt-3 flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="opacity-50">Sürüm</dt>
                    <dd className="font-medium text-black dark:text-white">
                      {item.gameVersion}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="opacity-50">Loader</dt>
                    <dd className="font-medium text-black dark:text-white">
                      {item.loader}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="opacity-50">Ortam</dt>
                    <dd className="font-medium text-black dark:text-white">
                      {item.environment}
                    </dd>
                  </div>
                </dl>
              </div>

              <ModPaketiActions
                slug={item.slug}
                hasDependencies={item.dependsOn.length > 0}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
