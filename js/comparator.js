/* TechAlbum — js/comparator.js | Bandeja de comparación (máx. 4) */
window.TechAlbum = window.TechAlbum || {};
(function (TA) {
  "use strict";
  var KEY = "techalbum_compare_v1";
  var MAX = 4;

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return arr.map(Number).filter(function (id) { return TA.store.getById(id); }).slice(0, MAX);
    } catch (e) { return []; }
  }
  function save(ids) {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch (e) { /* almacenamiento no disponible */ }
    if (typeof document !== "undefined") updatePill();
  }
  function list() { return load().map(function (id) { return TA.store.getById(id); }).filter(Boolean); }
  function contains(id) { return load().indexOf(Number(id)) !== -1; }
  function add(id) {
    id = Number(id);
    var ids = load();
    if (ids.indexOf(id) !== -1) return { ok: true, ids: ids, existed: true };
    if (ids.length >= MAX) return { ok: false, reason: "max", ids: ids };
    if (!TA.store.getById(id)) return { ok: false, reason: "not-found", ids: ids };
    ids.push(id);
    save(ids);
    return { ok: true, ids: ids };
  }
  function remove(id) {
    id = Number(id);
    save(load().filter(function (x) { return x !== id; }));
  }
  function clear() { save([]); }
  function updatePill() {
    var els = document.querySelectorAll("[data-compare-count]");
    var n = load().length;
    els.forEach(function (el) { el.textContent = String(n); });
  }
  function toggle(id, btn) {
    var res;
    if (contains(id)) { remove(id); res = { added: false }; }
    else {
      res = add(id);
      if (!res.ok && res.reason === "max") {
        alert("Puedes comparar hasta " + MAX + " productos. Quita uno para agregar otro.");
        return res;
      }
      res.added = true;
    }
    updatePill();
    refreshButtons();
    return res;
  }
  function refreshButtons() {
    document.querySelectorAll("[data-compare-btn]").forEach(function (btn) {
      var id = Number(btn.getAttribute("data-compare-btn"));
      var active = contains(id);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      var label = btn.querySelector("[data-compare-label]");
      if (label) label.textContent = active ? "En comparador ✓" : "Comparar";
      btn.classList.toggle("btn-primary", active);
    });
  }
  TA.comparator = {
    MAX: MAX, list: list, add: add, remove: remove,
    clear: clear, contains: contains, toggle: toggle,
    updatePill: updatePill, refreshButtons: refreshButtons
  };
})(window.TechAlbum);
