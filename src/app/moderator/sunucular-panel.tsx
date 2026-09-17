"use client";

import { useEffect, useState } from "react";
import {
  createServerCard,
  deleteServerCard,
  listServerCards,
  type ServerCardRow,
  type ServerPlatform,
  type ServerSocialLink,
} from "../lib/server-cards";
import ImageUpload from "./image-upload";

const emptyForm = {
  name: "",
  currentPlayers: "",
  maxPlayers: "",
  displayOrder: "0",
  description: "",
  bodyText: "",
  imageUrl: "",
  videoUrl: "",
  platform: null as ServerPlatform | null,
  ipAddress: "",
  serverPassword: "",
  socialLinks: [] as ServerSocialLink[],
};

const inputClass =
  "rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10";

const PLATFORM_OPTIONS: { value: ServerPlatform; label: string }[] = [
  { value: "java", label: "Java" },
  { value: "bedrock", label: "Bedrock" },
  { value: "both", label: "Her İkisi" },
];

export default function SunucularPanel() {
  const [items, setItems] = useState<ServerCardRow[] | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const refresh = () => {
    listServerCards()
      .then(setItems)
      .catch(() => setItems([]));
  };

  useEffect(refresh, []);

  // Görsel yükleme için sunucunun henüz bir id'si yok (DB'ye ilk kayıtta
  // oluşuyor) -- mod-paketleri-panel'deki aynı desen: isimden türetilen
  // geçici bir slug, boşsa "yeni-sunucu"ya düşer.
  const uploadSlug = form.name.trim().toLowerCase().replace(/\s+/g, "-") || "yeni-sunucu";

  const updateSocialLink = (i: number, patch: Partial<ServerSocialLink>) => {
    const socialLinks = [...form.socialLinks];
    socialLinks[i] = { ...socialLinks[i], ...patch };
    setForm({ ...form, socialLinks });
  };
  const addSocialLink = () =>
    setForm({ ...form, socialLinks: [...form.socialLinks, { label: "", url: "" }] });
  const removeSocialLink = (i: number) =>
    setForm({ ...form, socialLinks: form.socialLinks.filter((_, idx) => idx !== i) });

  const submit = async () => {
    const current = Number(form.currentPlayers);
    const max = Number(form.maxPlayers);
    if (!form.name.trim() || !Number.isFinite(current) || !Number.isFinite(max) || max <= 0) {
      setStatus("İsim ve geçerli oyuncu sayıları gerekli");
      return;
    }
    setSaving(true);
    setStatus("");
    try {
      await createServerCard({
        name: form.name.trim(),
        currentPlayers: current,
        maxPlayers: max,
        displayOrder: Number(form.displayOrder) || 0,
        description: form.description.trim(),
        bodyText: form.bodyText.trim(),
        imageUrl: form.imageUrl,
        videoUrl: form.videoUrl.trim(),
        platform: form.platform,
        ipAddress: form.ipAddress.trim(),
        serverPassword: form.serverPassword.trim(),
        socialLinks: form.socialLinks.filter((l) => l.url.trim()),
      });
      setForm(emptyForm);
      setStatus("Eklendi ✓");
      refresh();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Eklenemedi");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Bu sunucu kartı silinsin mi?")) return;
    await deleteServerCard(id);
    refresh();
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-3 font-sans text-sm font-bold text-black dark:text-white">
          Yeni Sunucu Kartı Ekle
        </h3>
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-black/10 p-4 dark:border-white/10 sm:grid-cols-2">
          <label className="col-span-full flex flex-col gap-1 text-sm">
            Sunucu Adı
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="TMP Event"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Anlık Oyuncu
            <input
              type="number"
              value={form.currentPlayers}
              onChange={(e) => setForm({ ...form, currentPlayers: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Maksimum Kapasite
            <input
              type="number"
              value={form.maxPlayers}
              onChange={(e) => setForm({ ...form, maxPlayers: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Sıra (küçük önce gösterilir)
            <input
              type="number"
              value={form.displayOrder}
              onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Platform
            <div className="flex gap-1.5">
              {PLATFORM_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setForm({ ...form, platform: form.platform === opt.value ? null : opt.value })
                  }
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    form.platform === opt.value
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-black/10 opacity-60 hover:opacity-100 dark:border-white/10"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </label>

          <label className="col-span-full flex flex-col gap-1 text-sm">
            Kısa Açıklama
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className={inputClass}
            />
          </label>

          <label className="col-span-full flex flex-col gap-1 text-sm">
            Uzun/Detaylı Açıklama (opsiyonel)
            <textarea
              value={form.bodyText}
              onChange={(e) => setForm({ ...form, bodyText: e.target.value })}
              rows={4}
              className={inputClass}
            />
          </label>

          <div className="col-span-full">
            <p className="mb-1.5 text-sm">Görsel</p>
            <ImageUpload
              section="sunucular"
              slug={uploadSlug}
              value={form.imageUrl || null}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
            />
          </div>

          <label className="col-span-full flex flex-col gap-1 text-sm">
            Video Linki (opsiyonel, düz &quot;İzle&quot; linki olarak gösterilir)
            <input
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="https://..."
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            IP Adresi
            <input
              value={form.ipAddress}
              onChange={(e) => setForm({ ...form, ipAddress: e.target.value })}
              placeholder="play.tmpcraft.net"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Şifre (opsiyonel)
            <input
              value={form.serverPassword}
              onChange={(e) => setForm({ ...form, serverPassword: e.target.value })}
              className={inputClass}
            />
          </label>

          <div className="col-span-full flex flex-col gap-2">
            <p className="text-sm">Sosyal Medya / Web Sitesi Linkleri (opsiyonel)</p>
            {form.socialLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={link.label}
                  onChange={(e) => updateSocialLink(i, { label: e.target.value })}
                  placeholder="Etiket (ör. Discord)"
                  className={`w-36 shrink-0 ${inputClass}`}
                />
                <input
                  value={link.url}
                  onChange={(e) => updateSocialLink(i, { url: e.target.value })}
                  placeholder="https://..."
                  className={`flex-1 ${inputClass}`}
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(i)}
                  className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
                >
                  Sil
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSocialLink}
              className="self-start text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
            >
              + Link ekle
            </button>
          </div>

          <div className="col-span-full mt-1 flex items-center justify-between">
            {status && <p className="text-xs opacity-70">{status}</p>}
            <button
              onClick={submit}
              disabled={saving}
              className="ml-auto rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
            >
              {saving ? "Ekleniyor..." : "Ekle"}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-sans text-sm font-bold text-black dark:text-white">
          Eklenen Sunucular ({items?.length ?? 0})
        </h3>
        {items === null ? (
          <p className="text-sm opacity-60">Yükleniyor...</p>
        ) : items.length === 0 ? (
          <p className="text-sm opacity-60">Henüz eklenen bir şey yok.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-black/10 p-3 dark:border-white/10"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {item.name}
                    {item.platform && (
                      <span className="ml-2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                        {item.platform === "both" ? "Java + Bedrock" : item.platform}
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs opacity-60">
                    {item.current_players}/{item.max_players} oyuncu · sıra {item.display_order}
                  </p>
                </div>
                <button
                  onClick={() => remove(item.id)}
                  className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
