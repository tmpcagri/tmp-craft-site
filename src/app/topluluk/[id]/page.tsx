import Footer from "../../footer";
import HillsBackground from "../../hills-background";
import { getCurrentUser } from "../../lib/auth";
import { getSiteContent } from "../../lib/content";
import Navbar from "../../navbar";
import TopicDetail from "./topic-detail";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const content = getSiteContent();
  const { id } = await params;
  const user = await getCurrentUser();

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <HillsBackground />
      <Navbar
        className="text-black dark:text-white"
        logoText={content.navbar.logoText}
        navLinks={content.footerLinks}
        user={user}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 pb-24 pt-28 sm:px-10 sm:pt-32 lg:pt-40">
        <TopicDetail topicId={id} />
      </main>

      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
