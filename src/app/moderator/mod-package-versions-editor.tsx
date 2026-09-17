"use client";

import { useEffect, useState } from "react";
import { LOADERS, type Loader } from "../lib/downloads";
import {
  addModPackageVersion,
  deleteModPackageVersion,
  listVersionsForPackage,
  type ModPackageVersionRow,
} from "../lib/mod-package-versions";

const emptyRowForm = {
  gameVersion: "1.21",
  loader: "Forge" as Loader,
  downloadUrl: "",
};

// Paket kaydedildikten SONRA (slug gerçek bir satıra FK verebilsin diye)
// gösterilen sürüm+loader+link satır editörü -- her satır kendi indirme
// linkine sahip, detay sayfasında kullanıcı sürüm/loader seçtiğinde bu
// satırlardan eşleşen kullanılıyor (bkz. mod-paketi-actions.tsx).
export default function ModPackageVersionsEditor({ slug }: { slug: string }) {
  const [versions, setVersions] = useState<ModPackageVersionRow[] | null>(null);
  const [rowForm, setRowForm] = useState(emptyRowForm);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const refresh = () => {
    listVersionsForPackage(slug)
      .then(setVersions)
      .catch(() => setVersions([]));
  };

  useEffect(refresh, [slug]);

  const addRow = async () => {
    if (!rowForm.downloadUrl.trim() || !rowForm.gameVersion.trim()) {
      setStatus("Sürüm ve link zorunlu");
      return;
    }
    setSaving(true);
    setStatus("");
    try {
      await addModPackageVersion({
        modPackageSlug: slug,
        gameVersion: rowForm.gameVersion.trim(),
        loader: rowForm.loader,
        downloadUrl: rowForm.downloadUrl.trim(),
      });
      setRowForm(emptyRowForm);
      refresh();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Eklenemedi");
    } finally {
      setSaving(false);
    }
  };

  const removeRow = async (id: string) => {
    await deleteModPackageVersion(id);
    refresh();
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/10 p-4 dark:border-white/10">
      <p className="text-xs text-black/60 dark:text-white/60">
        Her satır kendi indirme linkine sahip bir sürüm+loader kombinasyonu --
        detay sayfasında kullanıcı burada girilenler arasından seçim yapar.
        Hiç satır yoksa sayfa eski tek-sürüm (yukarıdaki Sürüm/Loader alanı)
        davranışına düşer.
      </p>

      {versions === null ? (
        <p className="text-sm opacity-60">Yükleniyor...</p>
      ) : versions.length === 0 ? (
        <p className="text-sm opacity-60">Henüz sürüm eklenmedi.</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {versions.map((v) => (
            <div
              key={v.id}
              className="flex items-center gap-3 rounded-xl border border-black/10 p-2.5 text-sm dark:border-white/10"
            >
              <span className="font-semibold">{v.game_version}</span>
              <span className="opacity-60">{v.loader}</span>
              <a
                href={v.download_url}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 flex-1 truncate text-emerald-600 hover:underline dark:text-emerald-400"
              >
                {v.download_url}
              </a>
              <button
                type="button"
                onClick={() => removeRow(v.id)}
                className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_2fr_auto]">
        <input
          value={rowForm.gameVersion}
          onChange={(e) => setRowForm({ ...rowForm, gameVersion: e.target.value })}
          placeholder="Sürüm (ör. 1.21)"
          className="rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
        />
        <select
          value={rowForm.loader}
          onChange={(e) => setRowForm({ ...rowForm, loader: e.target.value as Loader })}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-black"
        >
          {LOADERS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <input
          value={rowForm.downloadUrl}
          onChange={(e) => setRowForm({ ...rowForm, downloadUrl: e.target.value })}
          placeholder="İndirme linki (https://...)"
          className="rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
        />
        <button
          type="button"
          onClick={addRow}
          disabled={saving}
          className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          {saving ? "..." : "+ Ekle"}
        </button>
      </div>
      {status && <p className="text-xs text-red-600 dark:text-red-400">{status}</p>}
    </div>
  );
}
