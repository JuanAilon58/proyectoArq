const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { data, store } = require("./load-data.cjs")();
const root = path.resolve(__dirname, "..");
const ids = new Set(),
  cats = new Set(),
  groups = new Map();
const fail = (condition, message) => assert.ok(condition, message);
for (const c of data.CATEGORIES) {
  fail(!cats.has(c.id), "Categoría duplicada: " + c.id);
  cats.add(c.id);
}
for (const p of data.PRODUCTS) {
  fail(
    Number.isInteger(p.id) && !ids.has(p.id),
    "ID inválido/duplicado: " + p.id,
  );
  ids.add(p.id);
  fail(cats.has(p.category), "Categoría ausente: " + p.id);
  fail(
    ["baja", "media", "alta"].includes(p.range),
    "Gama no explícita: " + p.id,
  );
  fail(p.comparisonGroup && p.comparisonLabel, "Grupo ausente: " + p.id);
  fail(
    ["verified", "reference"].includes(p.dataStatus),
    "Estado de datos ausente: " + p.id,
  );
  fail(
    ["illustrative", "exact"].includes(p.imageKind),
    "Tipo de imagen ausente: " + p.id,
  );
  if (p.imageKind === "exact")
    fail(
      p.imageCredit &&
        p.imageCredit.author &&
        /^https:\/\//.test(p.imageCredit.licenseUrl),
      "Crédito/licencia ausente: " + p.id,
    );
  fail(
    p.price === null || (Number.isFinite(p.price) && p.price > 0),
    "Precio inválido: " + p.id,
  );
  fail(
    fs.existsSync(path.join(root, p.image)),
    "Imagen local ausente: " + p.id + " " + p.image,
  );
  fail(
    p.releaseYear == null ||
      (Number.isInteger(p.releaseYear) && p.releaseYear <= 2026),
    "Año inválido: " + p.id,
  );
  if (p.dataStatus === "verified") {
    fail(
      /^\d{4}-\d{2}-\d{2}$/.test(p.verifiedAt || ""),
      "Fecha de verificación ausente: " + p.id,
    );
    fail(
      p.sources.length > 0 && p.sources.every((s) => /^https:\/\//.test(s.url)),
      "Fuentes ausentes: " + p.id,
    );
    fail(
      Object.keys(p.specifications).length >= 3,
      "Ficha verificada insuficiente: " + p.id,
    );
    fail(
      p.priceStatus !== "verified" || store.hasVerifiedPrice(p),
      "Precio marcado sin evidencia: " + p.id,
    );
  }
  const key = store.comparisonMeta(p).key;
  groups.set(key, [...(groups.get(key) || []), p]);
}
for (const [key, items] of groups) {
  if (items.some((p) => p.dataStatus === "verified"))
    fail(items.length >= 2, "Grupo verificado sin alternativas: " + key);
}
for (const range of ["baja", "media", "alta"]) {
  const brands = new Set(
    data.PRODUCTS.filter(
      (p) =>
        p.category === "smartphones" &&
        p.range === range &&
        p.dataStatus === "verified",
    ).map((p) => p.brand),
  );
  fail(brands.size >= 2, "Smartphones sin dos marcas verificadas: " + range);
}
for (const dir of ["js", "data"])
  for (const file of fs
    .readdirSync(path.join(root, dir))
    .filter((f) => f.endsWith(".js")))
    new vm.Script(fs.readFileSync(path.join(root, dir, file), "utf8"), {
      filename: file,
    });
const htmlFiles = [
  "index.html",
  ...fs
    .readdirSync(path.join(root, "pages"))
    .filter((f) => f.endsWith(".html"))
    .map((f) => "pages/" + f),
];
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const ref = match[1];
    if (/^(https?:|#|data:|mailto:)/.test(ref)) continue;
    const target = path.resolve(
      path.dirname(path.join(root, file)),
      ref.split(/[?#]/)[0],
    );
    fail(fs.existsSync(target), "Referencia local rota: " + file + " → " + ref);
  }
  for (const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g))
    new vm.Script(script[1]);
  fail(/<html lang="es"/.test(html), "Idioma ausente: " + file);
  fail(/class="skip-link"/.test(html), "Enlace de salto ausente: " + file);
}
console.log(
  `Catálogo válido: ${ids.size} productos, ${cats.size} subcategorías, ${data.PRODUCTS.filter((p) => p.dataStatus === "verified").length} fichas verificadas; ${htmlFiles.length} rutas sin referencias locales rotas.`,
);
