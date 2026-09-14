import BackButton from "../../../back-button";
import Footer from "../../../footer";
import { getCurrentUser } from "../../../lib/auth";
import { getSiteContent } from "../../../lib/content";
import Navbar from "../../../navbar";
import HashtagFeed from "./hashtag-feed";

export default async function HashtagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
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
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-[0.2em] text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
          ETİKET
        </span>
        <h1 className="mt-4 font-sans text-3xl font-bold text-black dark:text-white sm:text-4xl">
          #{tag}
        </h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60 sm:text-base">
          Bu etiketle ilgili tüm konular ve son yorumlar.
        </p>

        <div className="mt-8">
          <HashtagFeed tag={tag} />
        </div>
      </main>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
