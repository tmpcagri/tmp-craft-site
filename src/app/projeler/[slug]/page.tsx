import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../footer";
import { downloadItems } from "../../lib/downloads";
import { getCurrentUser } from "../../lib/auth";
import { getSiteContent } from "../../lib/content";
import { guides } from "../../lib/guides";
import Navbar from "../../navbar";
import QrShareButton from "../../qr-share-button";
import GuideCard from "../guide-card";

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) notFound();

  const content = getSiteContent();
  const user = await getCurrentUser();

  const related = guides
    .filter((g) => g.slug !== guide.slug && g.category === guide.category)
    .slice(0, 3);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-black">
      <Navbar
        className="text-black dark:text-white"
        logoText={content.navbar.logoText}
        navLinks={content.footerLinks}
        user={user}
      />

      <div className="flex-1 px-6 pb-24 pt-32 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/projeler"
            className="text-sm text-black/60 underline underline-offset-4 dark:text-white/60"
          >
            ← Tüm rehberler
          </Link>

          <div className={`relative mt-6 flex h-48 flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br p-6 shadow-xl ${guide.gradient}`}>
            <div className="flex flex-wrap gap-2">
              <span className="w-fit rounded-full bg-black/40 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                {guide.kind === "Build" ? "Build" : "Farm"}
              </span>
              <span className="w-fit rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {guide.category}
              </span>
              {guide.afkable && (
                <span className="w-fit rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  AFK
                </span>
              )}
            </div>
            <h1 className="mt-3 font-sans text-2xl font-bold text-white sm:text-3xl">
              {guide.title}
            </h1>
          </div>

          <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_300px]">
            <div className="flex flex-col gap-6">
              <p className="text-base leading-relaxed text-black/70 dark:text-white/70">
                {guide.description}
              </p>

              {guide.videoUrl && (
                <div className="aspect-video w-full overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
                  <iframe
                    src={guide.videoUrl}
                    title={guide.title}
                    className="h-full w-full"
                    allowFullScreen
                  />
                </div>
              )}

              <div>
                <h2 className="font-sans text-base font-bold text-black dark:text-white">
                  Malzemeler
                </h2>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {guide.materials.map((m) => (
                    <li key={m} className="text-sm text-black/70 dark:text-white/70">
                      • {m}
                    </li>
                  ))}
                </ul>
              </div>

              {guide.usesMods.length > 0 && (
                <div>
                  <h2 className="font-sans text-base font-bold text-black dark:text-white">
                    Kullanılan Modlar
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {guide.usesMods.map((modName) => {
                      const mod = downloadItems.find(
                        (i) => i.name.toLowerCase() === modName.toLowerCase(),
                      );
                      return mod ? (
                        <Link
                          key={modName}
                          href={`/mod-paketleri/${mod.slug}`}
                          className="rounded-full bg-emerald-600/10 px-3 py-1.5 text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          {modName} →
                        </Link>
                      ) : (
                        <span
                          key={modName}
                          className="rounded-full bg-black/5 px-3 py-1.5 text-sm text-black/70 dark:bg-white/10 dark:text-white/70"
                        >
                          {modName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-dashed border-black/15 p-4 text-sm text-black/60 dark:border-white/15 dark:text-white/60">
                Topluluk yakında bu rehberin geliştirilmiş bir versiyonunu
                &quot;varyant&quot; olarak yükleyebilecek — orijinal eser
                sahibinin emeği her zaman görünür kalacak. Bu özellik henüz
                yapım aşamasında.
              </div>
            </div>

            <div className="flex flex-col gap-5 lg:sticky lg:top-36 lg:self-start">
              <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                    Bilgi Paneli
                  </p>
                  <QrShareButton compact />
                </div>
                <dl className="mt-3 flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="opacity-50">Zorluk</dt>
                    <dd className="font-medium text-black dark:text-white">
                      {guide.difficulty}
                    </dd>
                  </div>
                  {guide.kind === "Farm" ? (
                    <>
                      <div className="flex items-center justify-between">
                        <dt className="opacity-50">Uyumlu Sürüm</dt>
                        <dd className="font-medium text-black dark:text-white">
                          {guide.minVersion} – {guide.maxVersion}
                        </dd>
                      </div>
                      {guide.yieldPerHour && (
                        <div className="flex items-center justify-between">
                          <dt className="opacity-50">Verim</dt>
                          <dd className="font-medium text-black dark:text-white">
                            {guide.yieldPerHour}/sa
                          </dd>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <dt className="opacity-50">AFK&apos;lanabilir</dt>
                        <dd className="font-medium text-black dark:text-white">
                          {guide.afkable ? "Evet" : "Hayır"}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="opacity-50">Redstone Gerekir</dt>
                        <dd className="font-medium text-black dark:text-white">
                          {guide.requiresRedstone ? "Evet" : "Hayır"}
                        </dd>
                      </div>
                    </>
                  ) : (
                    guide.buildTimeMinutes && (
                      <div className="flex items-center justify-between">
                        <dt className="opacity-50">Tahmini Süre</dt>
                        <dd className="font-medium text-black dark:text-white">
                          ~{Math.max(1, Math.round(guide.buildTimeMinutes / 60))} saat
                        </dd>
                      </div>
                    )
                  )}
                  <div className="flex items-center justify-between">
                    <dt className="opacity-50">Yapımcı</dt>
                    <dd className="font-medium text-black dark:text-white">
                      {guide.author}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="opacity-50">Görüntülenme</dt>
                    <dd className="font-medium text-black dark:text-white">
                      {guide.views.toLocaleString("tr-TR")}
                    </dd>
                  </div>
                </dl>
              </div>

              {guide.hasSchematic && (
                <div className="flex flex-col gap-1.5 rounded-2xl border border-black/10 p-4 text-center dark:border-white/10">
                  <p className="font-sans text-sm font-semibold text-black dark:text-white">
                    Şematik Dosyası
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/50">
                    İndirme yakında aktif olacak
                  </p>
                </div>
              )}
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="font-sans text-lg font-bold text-black dark:text-white">
                Benzer Rehberler
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {related.map((g) => (
                  <GuideCard key={g.slug} guide={g} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
