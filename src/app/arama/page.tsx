import AramaSearchInput from "./arama-search-input";
import BackButton from "../back-button";
import Footer from "../footer";
import { getCurrentUser } from "../lib/auth";
import { getSiteContent } from "../lib/content";
import { searchDownloads } from "../lib/downloads";
import ModPackageRow from "../mod-paketleri/mod-package-row";
import Navbar from "../navbar";

export default async function AramaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = searchDownloads(query);

  const content = getSiteContent();
  const user = await getCurrentUser();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-black">
      <Navbar
        className="text-black dark:text-white"
        logoText={content.navbar.logoText}
        navLinks={content.footerLinks}
        user={user}
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-24 pt-32 sm:px-10">
        <BackButton />
        <p className="font-mono text-sm tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
          ARAMA
        </p>
        <h1 className="mt-4 font-sans text-3xl font-bold text-black dark:text-white sm:text-4xl">
          {query ? (
            <>
              &quot;{query}&quot; için {results.length} sonuç
            </>
          ) : (
            "Ne aramıştın?"
          )}
        </h1>

        <AramaSearchInput initialQuery={query} />

        {query && results.length === 0 && (
          <div className="mt-10 flex flex-col items-center gap-2 rounded-3xl border border-dashed border-black/15 py-16 text-center dark:border-white/15">
            <p className="font-sans text-base font-semibold text-black dark:text-white">
              Bu aramayla eşleşen bir mod paketi bulunamadı
            </p>
            <p className="text-sm text-black/60 dark:text-white/60">
              Farklı bir kelime dene ya da Mod Paketleri sayfasında gözat.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {results.map((item) => (
              <ModPackageRow key={item.slug} item={item} />
            ))}
          </div>
        )}
      </main>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
