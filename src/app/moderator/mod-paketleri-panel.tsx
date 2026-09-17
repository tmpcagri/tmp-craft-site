"use client";

import { useEffect, useState } from "react";
import {
  DOWNLOAD_CATEGORIES,
  ENVIRONMENTS,
  LICENSES,
  LOADERS,
  type DownloadCategory,
  type Environment,
  type License,
  type Loader,
} from "../lib/downloads";
import {
  createModPackage,
  deleteModPackage,
  listModPackages,
  updateModPackage,
  type ModPackageRow,
} from "../lib/mod-packages";
import ImageUpload from "./image-upload";

const GRADIENTS = [
  "from-emerald-500 to-teal-700",
  "from-orange-500 to-red-600",
  "from-purple-500 to-fuchsia-600",
  "from-cyan-400 to-blue-600",
  "from-amber-500 to-orange-700",
  "from-red-500 to-rose-700",
];

const emptyForm = {
  name: "",
  category: "Mods" as DownloadCategory,
  description: "",
  gameVersion: "1.21",
  loader: "Forge" as Loader,
  environment: "Client + Server" as Environment,
  license: "MIT" as License,
  author: "",
  authorLink: "",
  youtubeUrl: "",
  dependsOn: "",
  bodyText: "",
  schematicJavaUrl: "",
  schematicBedrockUrl: "",
};

export default function ModPaketleriPanel() {
  const [items, setItems] = useState<ModPackageRow[] | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [iconImage, setIconImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const uploadSlug = editingSlug ?? (form.name.trim().toLowerCase().replace(/\s+/g, "-") || "yeni");

  const addGalleryImage = () => setGalleryImages((g) => [...g, ""]);
  const updateGalleryImage = (i: number, url: string) =>
    setGalleryImages((g) => g.map((v, idx) => (idx === i ? url : v)));
  const removeGalleryImage = (i: number) =>
    setGalleryImages((g) => g.filter((_, idx) => idx !== i));

  const refresh = () => {
    listModPackages()
      .then(setItems)
      .catch(() => setItems([]));
  };

  useEffect(refresh, []);

  const submit = async () => {
    if (!form.name.trim() || !form.description.trim() || !form.author.trim()) {
      setStatus("İsim, açıklama ve yapımcı zorunlu");
      return;
    }
    setSaving(true);
    setStatus("");
    try {
      const dependsOn = form.dependsOn
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const authorLink = form.authorLink.trim() || null;
      const youtubeUrl = form.youtubeUrl.trim() || null;
      const bodyText = form.bodyText.trim() || null;
      const schematicJavaUrl = form.schematicJavaUrl.trim() || null;
      const schematicBedrockUrl = form.schematicBedrockUrl.trim() || null;
      const galleryImagesClean = galleryImages.map((g) => g.trim()).filter(Boolean);

      if (editingSlug) {
        await updateModPackage(editingSlug, {
          name: form.name.trim(),
          category: form.category,
          description: form.description.trim(),
          gameVersion: form.gameVersion.trim(),
          loader: form.loader,
          environment: form.environment,
          license: form.license,
          dependsOn,
          author: form.author.trim(),
          iconImage,
          authorLink,
          youtubeUrl,
          backgroundImage,
          galleryImages: galleryImagesClean,
          bodyText,
          schematicJavaUrl,
          schematicBedrockUrl,
        });
        setStatus("Güncellendi ✓");
      } else {
        await createModPackage({
          name: form.name.trim(),
          category: form.category,
          description: form.description.trim(),
          gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
          gameVersion: form.gameVersion.trim(),
          loader: form.loader,
          environment: form.environment,
          license: form.license,
          dependsOn,
          author: form.author.trim(),
          iconImage,
          authorLink,
          youtubeUrl,
          backgroundImage,
          galleryImages: galleryImagesClean,
          bodyText,
          schematicJavaUrl,
          schematicBedrockUrl,
        });
        setStatus("Eklendi ✓");
      }
      setForm(emptyForm);
      setIconImage(null);
      setBackgroundImage(null);
      setGalleryImages([]);
      setEditingSlug(null);
      refresh();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item: ModPackageRow) => {
    setEditingSlug(item.slug);
    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      gameVersion: item.game_version,
      loader: item.loader,
      environment: item.environment,
      license: item.license,
      author: item.author,
      authorLink: item.author_link ?? "",
      youtubeUrl: item.youtube_url ?? "",
      dependsOn: item.depends_on.join(", "),
      bodyText: item.body_text ?? "",
      schematicJavaUrl: item.schematic_java_url ?? "",
      schematicBedrockUrl: item.schematic_bedrock_url ?? "",
    });
    setIconImage(item.icon_image);
    setBackgroundImage(item.background_image);
    setGalleryImages(item.gallery_images ?? []);
    setStatus("");
  };

  const cancelEdit = () => {
    setEditingSlug(null);
    setForm(emptyForm);
    setIconImage(null);
    setBackgroundImage(null);
    setGalleryImages([]);
    setStatus("");
  };

  const remove = async (slug: string) => {
    if (!confirm(`"${slug}" kalıcı olarak silinsin mi?`)) return;
    await deleteModPackage(slug);
    if (editingSlug === slug) cancelEdit();
    refresh();
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-3 font-sans text-sm font-bold text-black dark:text-white">
          {editingSlug ? `Paketi Düzenle: ${editingSlug}` : "Yeni Mod / Shader / Paket Yükle"}
        </h3>
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-black/10 p-4 dark:border-white/10 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            İsim
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Kategori
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as DownloadCategory })}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 outline-none dark:border-white/10 dark:bg-black"
            >
              {DOWNLOAD_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="col-span-full flex flex-col gap-1 text-sm">
            Açıklama
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Sürüm
            <input
              value={form.gameVersion}
              onChange={(e) => setForm({ ...form, gameVersion: e.target.value })}
              className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Loader
            <select
              value={form.loader}
              onChange={(e) => setForm({ ...form, loader: e.target.value as Loader })}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 outline-none dark:border-white/10 dark:bg-black"
            >
              {LOADERS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Ortam
            <select
              value={form.environment}
              onChange={(e) => setForm({ ...form, environment: e.target.value as Environment })}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 outline-none dark:border-white/10 dark:bg-black"
            >
              {ENVIRONMENTS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Lisans
            <select
              value={form.license}
              onChange={(e) => setForm({ ...form, license: e.target.value as License })}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 outline-none dark:border-white/10 dark:bg-black"
            >
              {LICENSES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Yapımcı
            <input
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Yapımcı Linki (opsiyonel)
            <input
              value={form.authorLink}
              onChange={(e) => setForm({ ...form, authorLink: e.target.value })}
              className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10"
            />
          </label>
          <label className="col-span-full flex flex-col gap-1 text-sm">
            YouTube Video Linki (opsiyonel)
            <input
              value={form.youtubeUrl}
              onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10"
            />
          </label>
          <label className="col-span-full flex flex-col gap-1 text-sm">
            Bağımlılıklar (virgülle ayrılmış isim listesi, opsiyonel)
            <input
              value={form.dependsOn}
              onChange={(e) => setForm({ ...form, dependsOn: e.target.value })}
              placeholder="Terra Forge, Beast Tamer"
              className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10"
            />
          </label>
          <label className="col-span-full flex flex-col gap-1 text-sm">
            Detay Metni (opsiyonel, açıklamanın ötesinde uzun anlatım)
            <textarea
              value={form.bodyText}
              onChange={(e) => setForm({ ...form, bodyText: e.target.value })}
              rows={4}
              className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Şematik İndir Linki — Java (opsiyonel)
            <input
              value={form.schematicJavaUrl}
              onChange={(e) => setForm({ ...form, schematicJavaUrl: e.target.value })}
              placeholder="https://..."
              className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Şematik İndir Linki — Bedrock (opsiyonel)
            <input
              value={form.schematicBedrockUrl}
              onChange={(e) => setForm({ ...form, schematicBedrockUrl: e.target.value })}
              placeholder="https://..."
              className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10"
            />
          </label>
          <div className="col-span-full">
            <p className="mb-1.5 text-sm">Görsel</p>
            <ImageUpload
              section="mod-paketleri"
              slug={uploadSlug}
              value={iconImage}
              onChange={setIconImage}
            />
          </div>
          <div className="col-span-full">
            <p className="mb-1.5 text-sm">Arka Plan Görseli (opsiyonel, detay sayfası hero bandı)</p>
            <ImageUpload
              section="mod-paketleri"
              slug={`${uploadSlug}-arkaplan`}
              value={backgroundImage}
              onChange={setBackgroundImage}
            />
          </div>
          <div className="col-span-full flex flex-col gap-2">
            <p className="text-sm">Galeri Görselleri (opsiyonel)</p>
            {galleryImages.map((url, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1">
                  <ImageUpload
                    section="mod-paketleri"
                    slug={`${uploadSlug}-galeri-${i}`}
                    value={url || null}
                    onChange={(v) => updateGalleryImage(i, v)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeGalleryImage(i)}
                  className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
                >
                  Sil
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addGalleryImage}
              className="w-fit rounded-full border border-black/10 px-4 py-2 text-sm font-semibold transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
            >
              + Galeri Görseli Ekle
            </button>
          </div>

          <div className="col-span-full mt-1 flex items-center justify-between">
            {status && <p className="text-xs opacity-70">{status}</p>}
            <div className="ml-auto flex items-center gap-2">
              {editingSlug && (
                <button
                  onClick={cancelEdit}
                  className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black transition hover:bg-black/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
                >
                  İptal
                </button>
              )}
              <button
                onClick={submit}
                disabled={saving}
                className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                {saving ? "Kaydediliyor..." : editingSlug ? "Güncelle" : "Ekle"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-sans text-sm font-bold text-black dark:text-white">
          Yüklenen Paketler ({items?.length ?? 0})
        </h3>
        {items === null ? (
          <p className="text-sm opacity-60">Yükleniyor...</p>
        ) : items.length === 0 ? (
          <p className="text-sm opacity-60">Henüz eklenen bir şey yok.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div
                key={item.slug}
                className="flex items-center gap-3 rounded-xl border border-black/10 p-3 dark:border-white/10"
              >
                <div
                  className={`h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${item.gradient}`}
                >
                  {item.icon_image && (
                    // eslint-disable-next-line @next/next/no-img-element -- kullanıcı tarafından yüklenen mod görseli
                    <img src={item.icon_image} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{item.name}</p>
                  <p className="truncate text-xs opacity-60">
                    {item.category} · {item.author}
                  </p>
                </div>
                <button
                  onClick={() => startEdit(item)}
                  className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-black/70 transition hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => remove(item.slug)}
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
