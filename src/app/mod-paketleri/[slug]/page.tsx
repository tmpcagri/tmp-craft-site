import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../footer";
import { getCurrentUser } from "../../lib/auth";
import { getSiteContent } from "../../lib/content";
import { LICENSE_URLS } from "../../lib/downloads";
import { getAllDownloadItems } from "../../lib/downloads-server";
import { getYouTubeEmbedUrl } from "../../lib/youtube";
import { InlineLogo } from "../../logo";
import Navbar from "../../navbar";
import SchematicDownloadButton from "../../projeler/schematic-download-button";
import ModPaketiActions from "./mod-paketi-actions";
import ModPaketiComments from "./mod-paketi-comments";
import ModPaketiQr from "./mod-paketi-qr";

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
  const youtubeEmbedUrl = item.youtubeUrl ? getYouTubeEmbedUrl(item.youtubeUrl) : null;
  const hasSchematicDownload = Boolean(item.schematicJavaUrl || item.schematicBedrockUrl);

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

          {item.backgroundImage && (
            <div className="relative mt-6 h-48 w-full overflow-hidden rounded-3xl shadow-xl sm:h-64">
              {/* eslint-disable-next-line @next/next/no-img-element -- moderatör tarafından R2'ye yüklenen arka plan görseli */}
              <img
                src={item.backgroundImage}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 items-start gap-8 [grid-template-areas:'main'_'sidebar'] lg:grid-cols-[300px_1fr] lg:[grid-template-areas:'sidebar_main']">
            {/* Sidebar: küçük görsel + paylaşım QR'ı, yapımcı/lisans/
                bağımlılıklar bilgisi, bilgi paneli ve indirme/etkileşim --
                hepsi tek blokta, sayfa kaydırılsa da üstte kalır. Görsel ve
                QR bilerek küçük; asıl odak sağdaki içerik. */}
            <div
              style={{ gridArea: "sidebar" }}
              className="flex flex-col gap-5 lg:sticky lg:top-36 lg:self-start"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`aspect-square w-20 shrink-0 overflow-hidden rounded-2xl shadow-md ${
                    item.iconImage ? "" : `bg-gradient-to-br ${item.gradient}`
                  }`}
                >
                  {item.iconImage && (
                    // eslint-disable-next-line @next/next/no-img-element -- kullanıcı tarafından yüklenen mod görseli
                    <img
                      src={item.iconImage}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <ModPaketiQr />
              </div>

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

              {hasSchematicDownload && (
                <div className="flex flex-col gap-2 rounded-2xl border border-black/10 p-4 text-center dark:border-white/10">
                  <p className="font-sans text-sm font-semibold text-black dark:text-white">
                    Şematik Dosyası
                  </p>
                  <SchematicDownloadButton
                    javaUrl={item.schematicJavaUrl ?? null}
                    bedrockUrl={item.schematicBedrockUrl ?? null}
                  />
                </div>
              )}
            </div>

            {/* Main: başlık + açıklama + (varsa) tanıtım videosu — geniş,
                rahat okunur. */}
            <div style={{ gridArea: "main" }} className="flex flex-col gap-5">
              <span className="w-fit rounded-full bg-black/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black/60 dark:bg-white/10 dark:text-white/60">
                {item.category}
              </span>

              <h1 className="font-sans text-3xl font-bold text-black dark:text-white sm:text-4xl">
                {item.name}
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-black/70 dark:text-white/70">
                {item.description}
              </p>

              {youtubeEmbedUrl && (
                <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-2xl shadow-lg">
                  <iframe
                    src={youtubeEmbedUrl}
                    title={`${item.name} tanıtım videosu`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              )}

              {item.bodyText && (
                <p className="max-w-2xl whitespace-pre-wrap text-base leading-relaxed text-black/70 dark:text-white/70">
                  {item.bodyText}
                </p>
              )}

              {item.galleryImages && item.galleryImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {item.galleryImages.map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element -- moderatör tarafından R2'ye yüklenen galeri görseli
                    <img
                      key={`${url}-${i}`}
                      src={url}
                      alt=""
                      className="aspect-video w-full rounded-2xl border border-black/10 object-cover dark:border-white/10"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 border-t border-black/10 pt-10 dark:border-white/10">
            <ModPaketiComments slug={item.slug} />
          </div>
        </div>
      </div>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
