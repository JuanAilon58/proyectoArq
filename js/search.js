/* TechAlbum — js/search.js | Búsqueda dinámica (marca, modelo, categoría) */
window.TechAlbum = window.TechAlbum || {};
(function (TA) {
  "use strict";

  function matches(p, term) {
    term = (term || "").trim().toLowerCase();
    if (!term) return true;
    var hay = [
      p.brand, p.model, p.category,
      TA.store.categoryById(p.category).label,
      (p.highlights || []).join(" ")
    ].join(" ").toLowerCase();
    return term.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function bindLive(inputEl, onSearch) {
    if (!inputEl) return;
    var t = null;
    inputEl.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { onSearch(inputEl.value); }, 120);
    });
  }

  TA.search = { matches: matches, bindLive: bindLive };
})(window.TechAlbum);
