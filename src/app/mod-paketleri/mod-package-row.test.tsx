import { test } from "node:test";
import assert from "node:assert/strict";
import Module from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import type { DownloadItem } from "../lib/downloads";

// ModPackageRow, `next/link`'in Link bileşenini kullanıyor. Bu dosya App
// Router context'i olmadan (sadece react-dom/server ile) çalıştığı için
// `next/link`'i basit bir <a> etiketine indirgeyen bir sahte (mock) modülle
// değiştiriyoruz. Bu patch, derlenen CommonJS çıktısında aşağıdaki
// `import ModPackageRow from "./mod-package-row"` satırının ürettiği
// require() çağrısından ÖNCE çalışmalı -- bu yüzden bilerek import
// bildirimleri arasına, sırayla çalışacak şekilde yerleştirildi (tsc'nin
// CommonJS çıktısı import'ları karşılaştığı sırada require'e çevirir,
// gerçek ESM gibi tepeye taşımaz).
type ModuleLoadFn = (...args: unknown[]) => unknown;
const originalLoad = (Module as unknown as { _load: ModuleLoadFn })._load;
(Module as unknown as { _load: ModuleLoadFn })._load = function (this: unknown, ...args: unknown[]) {
  const request = args[0];
  if (request === "next/link") {
    return {
      __esModule: true,
      default: function Link({
        href,
        children,
        ...rest2
      }: { href: string; children?: React.ReactNode } & Record<string, unknown>) {
        return React.createElement("a", { href, ...rest2 }, children);
      },
    };
  }
  return originalLoad.apply(this, args);
};

import ModPackageRow from "./mod-package-row";

function render(item: DownloadItem): string {
  return renderToStaticMarkup(ModPackageRow({ item }));
}

const baseItem: DownloadItem = {
  slug: "terra-forge",
  name: "Terra Forge",
  category: "Mods",
  description: "Gelişmiş dünya üretimi ve yapı sistemi ekler.",
  gradient: "from-emerald-500 to-teal-700",
  gameVersion: "1.21",
  loader: "Forge",
  environment: "Client + Server",
  license: "MIT",
  dependsOn: [],
  author: "TMPCraft",
};

test("temel alanları (isim, yazar, açıklama, sürüm, loader) render eder ve doğru slug'a linkler", () => {
  const html = render(baseItem);
  assert.match(html, /href="\/mod-paketleri\/terra-forge"/);
  assert.match(html, /Terra Forge/);
  assert.match(html, /TMPCraft/);
  assert.match(html, /Gelişmiş dünya üretimi/);
  assert.match(html, />1\.21</);
  assert.match(html, />Forge</);
});

test("author boş string olduğunda çökmez, diğer alanlar yine render olur", () => {
  const html = render({ ...baseItem, author: "" });
  assert.match(html, /Terra Forge/);
  // Yazar paragrafı boş içerikle de DOM'da yer almalı (satır atlanmamalı).
  assert.match(html, /<p class="truncate text-xs text-black\/50 dark:text-white\/50"><\/p>/);
});

test("iconImage boş string olduğunda da (DB'den '' gelirse) gradient placeholder'a düşer, <img> render edilmez", () => {
  const html = render({ ...baseItem, iconImage: "" });
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /bg-gradient-to-br from-emerald-500 to-teal-700/);
});

test("iconImage yoksa <img> render edilmez, kategori renkli gradient placeholder gösterilir", () => {
  const html = render({ ...baseItem, iconImage: undefined });
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /bg-gradient-to-br from-emerald-500 to-teal-700/);
});

test("iconImage varsa <img> doğru src ile render edilir ve gradient class eklenmez", () => {
  const html = render({ ...baseItem, iconImage: "https://cdn.example.com/icon.png" });
  assert.match(html, /<img[^>]*src="https:\/\/cdn\.example\.com\/icon\.png"/);
  assert.doesNotMatch(html, /bg-gradient-to-br/);
});

test("uzun isim/açıklama JS tarafında kesilmez (kesme yalnızca CSS truncate/line-clamp ile), tam metin DOM'da bulunur", () => {
  const longName =
    "Bu Çok Ama Çok Uzun Bir Mod Paketi İsmi Olabilir Ve Satırı Taşırabilir Test Amaçlı";
  const longDescription =
    "Bu açıklama bilerek çok uzun tutuldu, iki satırdan fazla metin içeriyor ve satır ".repeat(4);
  const html = render({ ...baseItem, name: longName, description: longDescription });
  assert.ok(html.includes(longName), "tam isim DOM'da bulunmalı");
  assert.ok(html.includes(longDescription.trim()) || html.includes(longDescription), "tam açıklama DOM'da bulunmalı");
  // Taşmayı önleyen CSS sınıfları hâlâ mevcut olmalı.
  assert.match(html, /class="truncate font-sans/);
  assert.match(html, /line-clamp-2/);
});

test("isim/yazar/açıklamadaki özel karakterler HTML olarak enjekte edilmez (XSS güvenliği)", () => {
  const html = render({
    ...baseItem,
    name: "<script>alert(1)</script>",
    author: "Yazar & Ortağı <b>",
  });
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /Yazar &amp; Ortağı &lt;b&gt;/);
});

test("farklı loader/gameVersion değerleri doğru rozetlerde görünür", () => {
  const html = render({ ...baseItem, gameVersion: "1.20.4", loader: "Fabric" });
  assert.match(html, />1\.20\.4</);
  assert.match(html, />Fabric</);
  assert.doesNotMatch(html, />Forge</);
});
