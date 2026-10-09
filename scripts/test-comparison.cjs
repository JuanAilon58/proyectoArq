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
assert.equal(C.add(64).reason, "no-alternative", "Los grupos sin alternativas son solo consulta");
const pair = (ids) => ids.map(S.getById);
assert.equal(S.formatPrice(null), "Por verificar");
assert.equal(S.formatPrice(0), "Por verificar");
assert.equal(S.formatPrice(NaN), "Por verificar");
assert.ok(S.formatPrice(1200).startsWith("Q "));
assert.equal(S.compatibleWith(S.getById(203), S.getById(205)), true);
assert.equal(S.compatibleWith(S.getById(201), S.getById(203)), false);
assert.equal(S.compatibleWith(S.getById(13), S.getById(165)), false);
assert.equal(S.compatibleWith(S.getById(64), S.getById(67)), false);
const before = S.rangeOf(S.getById(203));
S.getById(203).price = 1;
assert.equal(
  S.rangeOf(S.getById(203)),
  before,
  "Cambiar precio no cambia gama",
);
C.add(203);
C.add(204);
C.add(205);
assert.equal(C.list().length, 3);
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
  "Comparador: compatibilidad, límite, persistencia, precios ausentes, evidencia insuficiente, empates y recomendaciones condicionales verificados.",
);
