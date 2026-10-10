const assert = require("node:assert/strict");
const load = require("./load-data.cjs");
const { store: S, comparator: C, recommendation: R, context } = load();
assert.equal(
  context.window.TechAlbum.search.matches(S.getById(205), "tensor G4"),
  true,
  "La búsqueda incluye especificaciones",
);
assert.equal(
  context.window.TechAlbum.search.matches(S.getById(205), "telefonos"),
  true,
  "La búsqueda tolera acentos",
);
assert.ok(
  S.hasAlternatives(S.getById(64)),
  "Todos los cables pueden abrir una comparativa",
);
const pair = (ids) => ids.map(S.getById);
assert.equal(S.formatPrice(null), "Por verificar");
assert.equal(S.formatPrice(0), "Por verificar");
assert.equal(S.formatPrice(NaN), "Por verificar");
assert.ok(S.formatPrice(1200).startsWith("Q "));
assert.equal(S.compatibleWith(S.getById(203), S.getById(205)), true);
assert.equal(S.compatibleWith(S.getById(201), S.getById(203)), false);
assert.equal(S.compatibleWith(S.getById(13), S.getById(165)), true);
assert.equal(S.compatibleWith(S.getById(64), S.getById(67)), true);
const before = S.rangeOf(S.getById(203));
S.getById(203).price = 1;
assert.equal(
  S.rangeOf(S.getById(203)),
  before,
  "Cambiar precio no cambia gama",
);
C.add(203);
C.add(204);
assert.equal(C.list().length, 2);
assert.equal(C.add(206).reason, "max");
C.remove(204);
assert.equal(C.add(213).reason, "incompatible");
assert.equal(C.add(203).existed, true);
C.clear();
C.importFromUrl("?ids=203,205,203,213,99999");
assert.deepEqual(
  Array.from(C.list(), (p) => p.id),
  [203, 205],
);
assert.equal(
  R.recommend(pair([210, 211])).winner,
  null,
  "Sin benchmarks no hay ganador de CPU",
);
assert.equal(
  R.recommend(pair([58, 59]), "refreshHz").winner,
  null,
  "Datos demostrativos no producen ventajas verificadas",
);
assert.equal(
  R.recommend(pair([201, 202]), "refreshHz").winner.id,
  202,
  "Prioridad concreta genera recomendación condicional",
);
assert.equal(
  R.recommend(pair([203, 205]), "storageGB").winner,
  null,
  "Empate no declara ganador",
);
assert.equal(
  R.recommend(pair([203, 206]), "refreshHz").winner,
  null,
  "Dato ausente no favorece al que tiene ficha más completa",
);
assert.equal(
  R.recommend(pair([215, 216])).winner,
  null,
  "Más VRAM no gana por rendimiento",
);
assert.equal(R.recommend(pair([215, 216]), "vramGB").winner.id, 216);
assert.equal(R.recommend(pair([201, 213])).status, "incompatible");
const M = context.window.TechAlbum.duelModel;
for (const p of S.products()) {
  const ids = S.comparisonIds(p);
  assert.equal(ids.length, 2, "Comparativa disponible para " + p.id);
  assert.equal(ids[0], p.id, "La ficha consultada es siempre el producto A");
  assert.notEqual(ids[0], ids[1]);
  const items = pair(ids),
    rows = M.rows(items);
  assert.ok(S.compatibleWith(...items));
  assert.ok(M.contexts[p.category], "Veredicto específico para " + p.category);
  assert.ok(rows.length >= 4);
  const summary = M.summary(items, rows);
  assert.equal(
    summary.counts[0] + summary.counts[1],
    rows.filter((r) => r.best !== null).length,
    "Conteos derivados de las filas",
  );
}
assert.equal(S.comparisonIds(S.getById(69))[1], 231, "SATA sugiere otro SATA");
for (const category of S.categories()) {
  const items = S.products().filter((p) => p.category === category.id);
  const pairs = S.comparisonPairs(items, items);
  const represented = new Set(pairs.flat().map((p) => p.id));
  assert.ok(
    items.every((p) => represented.has(p.id)),
    "Todas las fichas aparecen en las parejas de " + category.id,
  );
  assert.ok(
    pairs.every((items) => S.compatibleWith(...items)),
    "Parejas compatibles por subcategoría y gama",
  );
  assert.equal(
    new Set(
      pairs.map((items) =>
        items
          .map((p) => p.id)
          .sort((a, b) => a - b)
          .join(","),
      ),
    ).size,
    pairs.length,
    "Sin parejas A/B duplicadas",
  );
}
const verifiedCPU = S.products().filter(
  (p) => p.category === "procesadores" && p.dataStatus === "verified",
);
assert.ok(S.comparisonPairs(verifiedCPU, verifiedCPU).length > 0);
assert.ok(
  S.comparisonPairs(verifiedCPU, verifiedCPU)
    .flat()
    .every((p) => p.dataStatus === "verified"),
  "Filtro de fuentes se aplica a ambos lados",
);
assert.deepEqual(
  Array.from(S.comparisonPairs(pair([69]), pair([69, 231]))[0], (p) => p.id),
  [69, 231],
  "Buscar un producto muestra también su alternativa",
);
assert.equal(
  S.comparisonPairs(pair([69]), pair([69])).length,
  0,
  "Un filtro sin rival no fabrica una comparativa",
);
const sataRows = M.rows(pair([69, 231]));
assert.equal(sataRows.find((r) => r.label === "Seguro metálico").best, 0);
assert.equal(sataRows.find((r) => r.label === "Velocidad").state, "equal");
assert.equal(
  sataRows.find((r) => r.label === "Longitud").best,
  null,
  "Mayor longitud no significa mejor cable",
);
assert.equal(
  sataRows.find((r) => r.label === "Precio de referencia").best,
  null,
);
assert.deepEqual(
  Array.from(M.summary(pair([69, 231]), sataRows).counts),
  [1, 0],
);
assert.equal(M.summary(pair([69, 231]), sataRows, "Longitud").winner, null);
const mixedRows = M.rows(pair([64, 69]));
assert.equal(
  M.summary(pair([64, 69]), mixedRows).winner,
  null,
  "Funciones distintas no generan un ganador",
);
const priced = (p, price) => ({
  ...p,
  price,
  priceStatus: "verified",
  currency: "GTQ",
  priceSource: "https://example.com/local-price-fixture",
  priceVerifiedAt: "2026-10-09",
});
const pricedMixed = [priced(S.getById(64), 20), priced(S.getById(69), 60)];
assert.ok(pricedMixed.every(S.hasVerifiedPrice));
const pricedMixedRows = M.rows(pricedMixed);
assert.equal(
  pricedMixedRows.find((r) => r.key === "price").best,
  null,
  "Precios verificados de funciones distintas no generan ventaja",
);
assert.equal(
  M.summary(pricedMixed, pricedMixedRows, "price").winner,
  null,
  "Priorizar precio no atribuye un ganador entre funciones distintas",
);
assert.equal(
  M.summary(pricedMixed, [{ key: "price", best: 0 }], "price").winner,
  null,
  "El veredicto protege funciones distintas incluso con filas externas",
);
const pricedSata = [priced(S.getById(69), 60), priced(S.getById(231), 40)];
const pricedSataRows = M.rows(pricedSata);
assert.equal(pricedSataRows.find((r) => r.key === "price").best, 1);
assert.equal(M.summary(pricedSata, pricedSataRows, "price").winner, 1);
assert.equal(
  M.rows(pair([210, 211])).some((r) => r.best !== null),
  false,
  "GHz y núcleos no atribuyen rendimiento",
);
C.importFromUrl("?producto=69");
assert.deepEqual(
  Array.from(C.list(), (p) => p.id),
  [69, 231],
);
assert.equal(
  S.hasVerifiedPrice(S.getById(58)),
  false,
  "Un precio de demostración no cuenta como verificado",
);
const denied = load({
  localStorage: {
    getItem() {
      return null;
    },
    setItem() {
      throw new Error("Quota exceeded");
    },
  },
});
denied.comparator.add(203);
denied.comparator.add(205);
assert.equal(
  denied.comparator.list().length,
  2,
  "Memoria conserva selección si falla escritura",
);
const corrupt = load({
  localStorage: {
    getItem() {
      return "{}";
    },
    setItem() {},
  },
});
assert.equal(corrupt.comparator.list().length, 0);
console.log(
  "Comparador A/B: cobertura de todo el catálogo, alternativas, conteos por fila, funciones distintas, datos ausentes, límites y persistencia verificados.",
);
