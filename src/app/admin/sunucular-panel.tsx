"use client";

import { useEffect, useState } from "react";
import {
  createServerCard,
  deleteServerCard,
  listServerCards,
  type ServerCardRow,
} from "../lib/server-cards";

const emptyForm = { name: "", currentPlayers: "", maxPlayers: "", displayOrder: "0" };

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
              className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Anlık Oyuncu
            <input
              type="number"
              value={form.currentPlayers}
              onChange={(e) => setForm({ ...form, currentPlayers: e.target.value })}
              className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Maksimum Kapasite
            <input
              type="number"
              value={form.maxPlayers}
              onChange={(e) => setForm({ ...form, maxPlayers: e.target.value })}
              className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Sıra (küçük önce gösterilir)
            <input
              type="number"
              value={form.displayOrder}
              onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
              className="rounded-xl border border-black/10 bg-transparent px-3 py-2 outline-none dark:border-white/10"
            />
          </label>

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
                  <p className="truncate text-sm font-semibold">{item.name}</p>
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
