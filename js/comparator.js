/* Comparativa A contra B dentro de una subcategoría. */
window.TechAlbum = window.TechAlbum || {};
(function (TA) {
  "use strict";
  var KEY = "techalbum_compare_v2",
    MAX = 2,
    memory = [],
    storageFailed = false;
  function normalize(raw) {
    if (!Array.isArray(raw)) return [];
    var ids = [];
    raw.forEach(function (value) {
      var id = Number(value),
        p = TA.store.getById(id);
      if (
        !p ||
        !TA.store.hasAlternatives(p) ||
        !TA.store.comparisonMeta(p).key ||
        ids.indexOf(id) !== -1 ||
        ids.length >= MAX
      )
        return;
      if (!ids.length || TA.store.compatibleWith(TA.store.getById(ids[0]), p))
        ids.push(id);
    });
    return ids;
  }
  function load() {
    if (storageFailed) return memory.slice();
    try {
      return normalize(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch (e) {
      return memory.slice();
    }
  }
  function list() {
    return load().map(TA.store.getById);
  }
  function contains(id) {
    return load().indexOf(Number(id)) !== -1;
  }
  function save(ids) {
    memory = normalize(ids);
    try {
      localStorage.setItem(KEY, JSON.stringify(memory));
    } catch (e) {
      storageFailed = true;
    }
    if (typeof document !== "undefined") {
      updatePill();
      refreshButtons();
    }
    if (typeof window.dispatchEvent === "function")
      window.dispatchEvent(
        new CustomEvent("techalbum:compare-change", {
          detail: { ids: memory.slice() },
        }),
      );
  }
  function add(id) {
    id = Number(id);
    var p = TA.store.getById(id),
      ids = load();
    if (!p) return { ok: false, reason: "not-found" };
    if (!TA.store.hasAlternatives(p))
      return { ok: false, reason: "no-alternative" };
    if (contains(id)) return { ok: true, existed: true, ids: ids };
    if (ids.length >= MAX) return { ok: false, reason: "max" };
    if (
      !TA.store.comparisonMeta(p).key ||
      (ids.length && !TA.store.compatibleWith(TA.store.getById(ids[0]), p))
    )
      return { ok: false, reason: "incompatible" };
    ids.push(id);
    save(ids);
    return { ok: true, ids: ids };
  }
  function remove(id) {
    save(
      load().filter(function (value) {
        return value !== Number(id);
      }),
    );
  }
  function clear() {
    save([]);
  }
  function replace(ids) {
    var clean = normalize(ids);
    save(clean);
    return { ok: clean.length === ids.length, ids: clean };
  }
  function toggle(id) {
    if (contains(id)) {
      remove(id);
      return { ok: true, added: false };
    }
    var result = add(id);
    if (!result.ok)
      window.dispatchEvent(
        new CustomEvent("techalbum:compare-error", { detail: result }),
      );
    else result.added = true;
    return result;
  }
  function updatePill() {
    document.querySelectorAll("[data-compare-count]").forEach(function (el) {
      el.textContent = load().length;
    });
    if (TA.ui)
      document.querySelectorAll(".compare-link").forEach(function (el) {
        el.href = TA.ui.page("comparar") + "?ids=" + load().join(",");
      });
  }
  function refreshButtons() {
    document.querySelectorAll("[data-compare-btn]").forEach(function (btn) {
      var active = contains(btn.dataset.compareBtn);
      btn.setAttribute("aria-pressed", String(active));
      var label = btn.querySelector("[data-compare-label]");
      if (label)
        label.textContent = active
          ? "Seleccionado"
          : TA.store.hasAlternatives(TA.store.getById(btn.dataset.compareBtn))
            ? "Comparar"
            : "Solo consulta";
    });
  }
  function importFromUrl(search) {
    var params = new URLSearchParams(search),
      raw = params.get("ids"),
      one = params.get("producto");
    if (raw != null) return replace(raw.split(",").filter(Boolean));
    if (one) return replace(TA.store.comparisonIds(TA.store.getById(one)));
    return { ok: true, ids: load() };
  }
  function shareUrl() {
    var base = TA.ui ? TA.ui.page("comparar") : "comparar.html";
    return new URL(base + "?ids=" + load().join(","), location.href).href;
  }
  TA.comparator = {
    MAX: MAX,
    list: list,
    contains: contains,
    add: add,
    remove: remove,
    clear: clear,
    replace: replace,
    toggle: toggle,
    updatePill: updatePill,
    refreshButtons: refreshButtons,
    importFromUrl: importFromUrl,
    shareUrl: shareUrl,
  };
})(window.TechAlbum);
