/* TechAlbum — js/search.js | Búsqueda dinámica (marca, modelo, categoría) */
window.TechAlbum = window.TechAlbum || {};
(function (TA) {
  "use strict";

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }
  function matches(p, term) {
    term = normalize(term).trim();
    if (!term) return true;
    var hay = [
      p.brand,
      p.model,
      p.category,
      TA.store.categoryById(p.category).label,
      TA.store.categoryById(p.category).group,
      p.comparisonLabel,
      Object.keys(p.specifications || {})
        .map(function (key) {
          return key + " " + p.specifications[key];
        })
        .join(" "),
      (p.highlights || []).join(" "),
    ].join(" ");
    hay = normalize(hay);
    return term.split(/\s+/).every(function (w) {
      return hay.indexOf(w) !== -1;
    });
  }

  function bindLive(inputEl, onSearch) {
    if (!inputEl) return;
    var t = null;
    inputEl.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        onSearch(inputEl.value);
      }, 120);
    });
  }

  TA.search = { matches: matches, bindLive: bindLive };
})(window.TechAlbum);
