import CommunityPostsPanel from "./community-posts-panel";

export default function CommunitySlider() {
  return (
    <section className="relative z-10 flex w-full items-center justify-center pb-16">
      <div className="grid w-[calc(100%-2rem)] grid-cols-1 gap-4 sm:w-[calc(100%-5rem)] sm:grid-cols-2">
        <div className="flex h-48 flex-col justify-center rounded-3xl bg-gradient-to-br from-slate-700 to-slate-900 p-8 shadow-xl">
          <h3 className="font-sans text-2xl font-bold text-white sm:text-3xl">
            Duyurular
          </h3>
          <p className="mt-2 max-w-md font-sans text-sm text-white/70">
            TMP Craft&apos;taki güncellemeleri, yol haritasını ve önemli
            duyuruları burada bulacaksın.
          </p>
        </div>

        <CommunityPostsPanel className="h-80" />
      </div>
    </section>
  );
}
