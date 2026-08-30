import Navbar from "./navbar";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full items-center overflow-hidden bg-black px-8 sm:px-20">
      <Navbar className="text-white" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-16 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rotate-12">
          <div className="absolute right-24 top-8 h-56 w-40 rounded-2xl bg-gradient-to-b from-emerald-400/60 to-emerald-800/60 shadow-[0_0_80px_rgba(16,185,129,0.25)]">
            <span className="cursor-blink absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-3xl text-emerald-950">
              |
            </span>
          </div>
          <div className="absolute right-8 top-64 grid h-32 w-56 grid-cols-5 gap-1.5 rounded-xl bg-emerald-950/60 p-3">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="rounded-sm bg-emerald-400/30" />
            ))}
          </div>
          <div className="absolute right-72 top-20 h-10 w-10 rounded-full border-2 border-emerald-400/30" />
          <div className="absolute right-64 top-4 h-px w-10 rotate-45 border-t-2 border-dashed border-emerald-400/30" />
        </div>
      </div>

      <div className="relative z-10 max-w-lg">
        <p className="font-mono text-sm tracking-[0.3em] text-emerald-400/80">
          404
        </p>
        <h1 className="mt-4 font-sans text-4xl font-bold text-white sm:text-5xl">
          Sayfa Bulunamadı
        </h1>
        <p className="mt-4 font-sans text-lg text-white/70">
          Aradığın sayfa kaldırılmış ya da hiç var olmamış olabilir. Merak
          etme, TMP Craft&apos;ın geri kalanı yerinde duruyor.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 font-sans text-sm font-semibold text-black transition hover:bg-emerald-300"
        >
          Ana sayfaya dön
        </a>
      </div>
    </div>
  );
}
