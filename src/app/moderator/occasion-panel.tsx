"use client";

import { useEffect, useState } from "react";
import type {
  OccasionMessageAnimation,
  OccasionMessageStyle,
  OccasionTheme,
  OccasionThemeSettings,
  ScheduledOccasion,
  SiteContent,
} from "../lib/content";
import ImageUpload from "./image-upload";

type NonNoneTheme = Exclude<OccasionTheme, "none">;

const scheduleThemeOptions: { label: string; value: OccasionTheme }[] = [
  { label: "Resmi Gün", value: "resmi" },
  { label: "Yas/Anma Günü", value: "yas" },
  { label: "Dini Bayram", value: "dini" },
];

const animationOptions: { label: string; value: OccasionMessageAnimation }[] = [
  { label: "Yazılıp silinen", value: "typing" },
  { label: "Sabit kalan", value: "static" },
  { label: "Yanıp sönen", value: "blink" },
];

const styleOptions: { label: string; value: OccasionMessageStyle }[] = [
  { label: "Neon", value: "neon" },
  { label: "Kalın", value: "bold" },
  { label: "Normal", value: "normal" },
];

function FlagIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.67} viewBox="0 0 30 20" className="shrink-0">
      <rect width="30" height="20" fill="#e30a17" />
      <circle cx="12" cy="10" r="5" fill="#fff" />
      <circle cx="13.5" cy="10" r="4" fill="currentColor" className="text-[#e30a17]" />
      <path
        fill="#fff"
        d="M17.5 6.5l1.2 2.4 2.6.4-1.9 1.9.4 2.6-2.3-1.3-2.3 1.3.4-2.6-1.9-1.9 2.6-.4z"
      />
    </svg>
  );
}

function CrescentIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="shrink-0 text-emerald-600 dark:text-emerald-400"
    >
      <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a7 7 0 0 0 9.5 9.5z" fill="currentColor" opacity="0.15" />
      <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a7 7 0 0 0 9.5 9.5z" />
    </svg>
  );
}

function RibbonPlaceholder({ size = 40 }: { size?: number }) {
  return (
    <svg width={size * 0.7} height={size} viewBox="0 0 16 24" className="shrink-0">
      <path fill="#111" className="dark:fill-white" d="M8 0C5 5 0 7 0 12a8 8 0 0 0 8 8 8 8 0 0 0 8-8C16 7 11 5 8 0z" />
      <path fill="#111" className="dark:fill-white" d="M5 17l3 7 3-7-3 2z" />
    </svg>
  );
}

function ToggleTile({
  active,
  icon,
  label,
  onClick,
  big,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  big?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 text-center transition ${
        big ? "py-6" : ""
      } ${
        active
          ? "border-emerald-500 bg-emerald-500/10"
          : "border-black/10 opacity-60 hover:opacity-100 dark:border-white/10"
      }`}
    >
      {icon}
      <span className="text-sm font-semibold">{label}</span>
      <span
        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
          active
            ? "bg-emerald-500 text-white"
            : "bg-black/10 text-black/50 dark:bg-white/10 dark:text-white/50"
        }`}
      >
        {active ? "Aktif" : "Pasif"}
      </span>
    </button>
  );
}

// Bir temanın (resmi/yas/dini) arka plan görseli+şeffaflığı VE rozetin
// yanındaki mesaj+animasyon+stil ayarları -- her üç temanın kendi ayrı
// kopyası var (SpecialOccasion.themes), hangi toggle aktifse o temanın
// bloğu gösteriliyor.
function ThemeSettingsControls({
  themeKey,
  settings,
  onChange,
}: {
  themeKey: NonNoneTheme;
  settings: OccasionThemeSettings;
  onChange: (patch: Partial<OccasionThemeSettings>) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-black/10 p-4 dark:border-white/10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
            Arka Plan Görseli
          </label>
          <ImageUpload
            section="ozel-gunler"
            slug={`arka-plan-${themeKey}`}
            value={settings.backgroundImageUrl || null}
            onChange={(url) => onChange({ backgroundImageUrl: url })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
            Şeffaflık ({Math.round(settings.backgroundOpacity * 100)}%)
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.backgroundOpacity}
            onChange={(e) => onChange({ backgroundOpacity: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
          Rozetin Yanındaki Mesaj (boşsa gösterilmez)
        </label>
        <input
          value={settings.message}
          onChange={(e) => onChange({ message: e.target.value })}
          placeholder="ör. Zafer Bayramımız Kutlu Olsun!"
          className="rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
            Animasyon
          </label>
          <select
            value={settings.messageAnimation}
            onChange={(e) =>
              onChange({ messageAnimation: e.target.value as OccasionMessageAnimation })
            }
            className="rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
          >
            {animationOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
            Yazı Stili
          </label>
          <select
            value={settings.messageStyle}
            onChange={(e) => onChange({ messageStyle: e.target.value as OccasionMessageStyle })}
            className="rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
          >
            {styleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function OccasionPanel() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => {
        if (!res.ok) throw new Error("content fetch failed");
        return res.json();
      })
      .then(setContent)
      .catch(() => setStatus("İçerik yüklenemedi"));
  }, []);

  if (!content) {
    return <p className="text-sm opacity-60">Yükleniyor...</p>;
  }

  const occasion = content.specialOccasion;

  const updateOccasion = (patch: Partial<SiteContent["specialOccasion"]>) => {
    setContent({ ...content, specialOccasion: { ...content.specialOccasion, ...patch } });
  };

  const toggleTheme = (theme: OccasionTheme) => {
    updateOccasion({ manualTheme: occasion.manualTheme === theme ? "none" : theme });
  };

  const updateThemeSettings = (theme: NonNoneTheme, patch: Partial<OccasionThemeSettings>) => {
    updateOccasion({
      themes: { ...occasion.themes, [theme]: { ...occasion.themes[theme], ...patch } },
    });
  };

  const updateSchedulePeriod = (index: number, patch: Partial<ScheduledOccasion>) => {
    const schedule = [...occasion.schedule];
    schedule[index] = { ...schedule[index], ...patch };
    updateOccasion({ schedule });
  };

  const removeSchedulePeriod = (index: number) => {
    updateOccasion({ schedule: occasion.schedule.filter((_, i) => i !== index) });
  };

  const addSchedulePeriod = () => {
    updateOccasion({
      schedule: [
        ...occasion.schedule,
        { theme: "resmi", startDate: "", endDate: "", label: "Yeni dönem" },
      ],
    });
  };

  const save = async () => {
    setSaving(true);
    setStatus("Kaydediliyor...");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error("Kaydedilemedi");
      setStatus("Kaydedildi ✓");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const isMourning = occasion.manualTheme === "yas";

  return (
    <div className="flex flex-col gap-8">
      <p className="text-xs opacity-60">
        Elle seçilen tema her zaman otomatik zamanlamanın önüne geçer. Aynı anda
        yalnızca bir tema aktif olabilir -- yeni bir tema açtığında öncekini
        otomatik kapatır.
      </p>

      {/* Kutlama */}
      <section className="flex flex-col gap-4 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5">
        <div>
          <h3 className="text-base font-bold">🎉 Kutlama</h3>
          <p className="text-xs opacity-60">Resmi/milli günler ve dini bayramlar.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <ToggleTile
            active={occasion.manualTheme === "resmi"}
            icon={<FlagIcon size={72} />}
            label="Resmi Gün (Türk Bayrağı)"
            onClick={() => toggleTheme("resmi")}
            big
          />
          <ToggleTile
            active={occasion.manualTheme === "dini"}
            icon={<CrescentIcon size={44} />}
            label="Dini Bayram (Hilal)"
            onClick={() => toggleTheme("dini")}
          />
        </div>

        {occasion.manualTheme === "resmi" && (
          <ThemeSettingsControls
            themeKey="resmi"
            settings={occasion.themes.resmi}
            onChange={(patch) => updateThemeSettings("resmi", patch)}
          />
        )}
        {occasion.manualTheme === "dini" && (
          <ThemeSettingsControls
            themeKey="dini"
            settings={occasion.themes.dini}
            onChange={(patch) => updateThemeSettings("dini", patch)}
          />
        )}
      </section>

      {/* Yas Modu */}
      <section className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/[0.02]">
        <div>
          <h3 className="text-base font-bold">🖤 Yas Modu</h3>
          <p className="text-xs opacity-60">Anma/yas günleri için soluk tema + kurdele.</p>
        </div>

        <ToggleTile
          active={isMourning}
          icon={
            occasion.themes.yas.iconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- yüklenen kurdele ikonu önizlemesi
              <img src={occasion.themes.yas.iconUrl} alt="" className="h-10 w-auto" />
            ) : (
              <RibbonPlaceholder size={44} />
            )
          }
          label="Anma/Yas Günü"
          onClick={() => toggleTheme("yas")}
          big
        />

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide opacity-50">
            Kurdele İkonu (opsiyonel, yüklenmezse yer tutucu görünür)
          </label>
          <ImageUpload
            section="ozel-gunler"
            slug="yas-ikon"
            value={occasion.themes.yas.iconUrl || null}
            onChange={(url) => updateThemeSettings("yas", { iconUrl: url })}
          />
        </div>

        {isMourning && (
          <ThemeSettingsControls
            themeKey="yas"
            settings={occasion.themes.yas}
            onChange={(patch) => updateThemeSettings("yas", patch)}
          />
        )}
      </section>

      {/* Otomatik zamanlama */}
      <section className="flex flex-col gap-3 rounded-3xl border border-black/10 p-5 dark:border-white/10">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={occasion.autoScheduleEnabled}
            onChange={(e) => updateOccasion({ autoScheduleEnabled: e.target.checked })}
            className="h-4 w-4"
          />
          Otomatik zamanlama aktif
        </label>
        <p className="-mt-2 text-xs opacity-60">
          Yukarıdaki elle seçim &quot;Pasif&quot; iken, bugünün tarihi aşağıdaki
          dönemlerden birine denk gelirse o dönemin teması otomatik açılır.
        </p>

        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Zamanlanmış Dönemler</p>
          <button
            onClick={addSchedulePeriod}
            className="text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
          >
            + Dönem ekle
          </button>
        </div>

        {occasion.schedule.map((period, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-2xl border border-black/10 p-4 dark:border-white/10"
          >
            <input
              value={period.label}
              onChange={(e) => updateSchedulePeriod(i, { label: e.target.value })}
              placeholder="Etiket (ör. 30 Ağustos Zafer Bayramı)"
              className="rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
            />
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={period.theme}
                onChange={(e) => updateSchedulePeriod(i, { theme: e.target.value as OccasionTheme })}
                className="rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
              >
                {scheduleThemeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={period.startDate}
                onChange={(e) => updateSchedulePeriod(i, { startDate: e.target.value })}
                className="rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
              />
              <span className="text-xs opacity-50">—</span>
              <input
                type="date"
                value={period.endDate}
                onChange={(e) => updateSchedulePeriod(i, { endDate: e.target.value })}
                className="rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
              />
              <button
                onClick={() => removeSchedulePeriod(i)}
                className="ml-auto text-sm text-red-600 hover:opacity-70 dark:text-red-400"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </section>

      <div className="flex items-center justify-end gap-3">
        {status && <p className="text-xs opacity-70">{status}</p>}
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
}
