"use client";

import { useRef, useState } from "react";

// Moderatör panelinde her yerde aynı davranan sürükle-bırak görsel
// yükleme kutusu -- dosyayı doğrudan /api/admin/upload'a gönderip R2'den
// dönen public URL'i `onChange` ile yukarı bildiriyor.
export default function ImageUpload({
  section,
  slug,
  value,
  onChange,
}: {
  section:
    | "mod-paketleri"
    | "sunucular"
    | "ozel-gunler"
    | "projeler"
    | "ana-sayfa"
    | "ana-sayfa-hero";
  slug: string;
  value: string | null;
  onChange: (url: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (!slug) {
      setError("Önce bir isim gir (dosya yolu isme göre oluşuyor)");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("section", section);
      formData.append("slug", slug);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Yükleme başarısız");
      onChange(body.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        className={`relative flex h-32 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border-2 border-dashed text-center transition ${
          dragging
            ? "border-emerald-500 bg-emerald-500/10"
            : "border-black/15 hover:border-black/30 dark:border-white/15 dark:hover:border-white/30"
        }`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- kullanıcı tarafından yüklenen görsel önizlemesi
          <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            <p className="text-xs opacity-60">
              {uploading ? "Yükleniyor..." : "Görseli sürükle-bırak ya da tıkla"}
            </p>
          </>
        )}
        {value && uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white">
            Yükleniyor...
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
