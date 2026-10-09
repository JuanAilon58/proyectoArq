/* TechAlbum — js/filters.js | Filtrado por categoría, marca y gama */
window.TechAlbum = window.TechAlbum || {};
(function (TA) {
  "use strict";

  function readParams() {
    var q = {};
    try {
      var sp = new URLSearchParams(window.location.search);
      ["q", "cat", "range"].forEach(function (k) {
        if (sp.get(k)) q[k] = sp.get(k);
      });
    } catch (e) {
      /* sin URLSearchParams */
    }
    return q;
  }

  function applyFilters(items, f) {
    f = f || {};
    var q = (f.q || "").trim().toLowerCase();
    return items.filter(function (p) {
      if (f.cat && p.category !== f.cat) return false;
      if (f.range && p.range !== f.range) return false;
      if (f.brands && f.brands.length && f.brands.indexOf(p.brand) === -1)
        return false;
      if (q) {
        var hay = (
          p.brand +
          " " +
          p.model +
          " " +
          TA.store.categoryById(p.category).label +
          " " +
          p.category
        ).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function brandChecklist(el, brands, selected) {
    if (!el) return;
    selected = selected || [];
    el.innerHTML =
      brands
        .map(function (b, i) {
          var id = "brand-" + i;
          var checked = selected.indexOf(b) !== -1 ? " checked" : "";
          return (
            '<label for="' +
            id +
            '"><input type="checkbox" id="' +
            id +
            '" value="' +
            b.replace(/"/g, "&quot;") +
            '"' +
            checked +
            "> " +
            b.replace(/</g, "&lt;") +
            "</label>"
          );
        })
        .join("") ||
      '<p style="color:var(--muted);font-size:.82rem">Sin marcas.</p>';
  }

  function selectedBrands(el) {
    var out = [];
    el.querySelectorAll('input[type="checkbox"]:checked').forEach(function (c) {
      out.push(c.value);
    });
    return out;
  }

  TA.filters = {
    readParams: readParams,
    applyFilters: applyFilters,
    brandChecklist: brandChecklist,
    selectedBrands: selectedBrands,
  };
})(window.TechAlbum);
