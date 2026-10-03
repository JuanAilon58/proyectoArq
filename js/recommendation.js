/* TechAlbum — js/recommendation.js | Evaluación transparente */
window.TechAlbum = window.TechAlbum || {};
(function (TA) {
  "use strict";
  // Pesos públicos y auditables de la recomendación.
  var WEIGHTS = { performance: 0.40, price: 0.35, features: 0.25 };

  function priceScores(items) {
    // Normaliza el precio dentro del conjunto comparado:
    // el más barato obtiene 10 y el más caro 0.
    var prices = items.map(function (p) { return Number(p.price) || 0; });
    var min = Math.min.apply(null, prices);
    var max = Math.max.apply(null, prices);
    return items.map(function (p) {
      if (max === min) return 5;
      return 10 * (max - Number(p.price)) / (max - min);
    });
  }
  function performanceOf(p) { return (Math.max(0, Math.min(5, Number(p.rating) || 0))) * 2; }
  function featuresOf(p) {
    var n = (p.highlights || []).length + Object.keys(p.specifications || {}).length / 2;
    return Math.max(0, Math.min(10, 5 + (n - 4) * 0.6));
  }
  function evaluate(items) {
    var ps = priceScores(items);
    return items.map(function (p, i) {
      var perf = performanceOf(p);
      var feat = featuresOf(p);
      var price = ps[i];
      var total = WEIGHTS.performance * perf + WEIGHTS.price * price + WEIGHTS.features * feat;
      return { product: p, performance: perf, priceScore: price, features: feat, total: total };
    });
  }
  function recommend(items) {
    if (!items || items.length < 2) return null;
    var rows = evaluate(items).sort(function (a, b) { return b.total - a.total; });
    var winner = rows[0];
    var reasons = [];
    var cheapest = items.slice().sort(function (a, b) { return a.price - b.price; })[0];
    if (winner.product.id === cheapest.id) {
      reasons.push("Es el de menor precio del conjunto (" + TA.store.formatPrice(winner.product.price) + ").");
    } else {
      var over = Number(winner.product.price) - Number(cheapest.price);
      reasons.push("Cuesta " + TA.store.formatPrice(over) + " más que la opción más barata, pero lo compensa con mejor puntaje global.");
    }
    if (winner.performance >= 8) reasons.push("Rendimiento alto (calificación " + winner.product.rating + "/5).");
    var top = (winner.product.highlights || []).slice(0, 2);
    top.forEach(function (h) { reasons.push(h + "."); });
    var ratio = (winner.performance + winner.features) / Math.max(1, Number(winner.product.price) / 1000);
    return {
      winner: winner.product, rows: rows, reasons: reasons,
      weights: WEIGHTS, valueRatio: ratio,
      headline: winner.product.brand + " " + winner.product.model + " es la opción recomendada en esta comparación.",
      verdict: "Obtuvo el puntaje global más alto al ponderar rendimiento (40%), precio relativo dentro del conjunto (35%) y características (25%). La recomendación cambia automáticamente según los productos comparados."
    };
  }
  TA.recommendation = { WEIGHTS: WEIGHTS, evaluate: evaluate, recommend: recommend };
})(window.TechAlbum);
