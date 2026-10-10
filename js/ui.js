window.TechAlbum = window.TechAlbum || {};
(function (TA) {
  "use strict";
  var paths = {
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    compare: '<path d="M8 4v16M16 4v16M4 8h8m0 8h8"/>',
    book: '<path d="M12 6c-3-2-7-2-9-1v14c2-1 6-1 9 1 3-2 7-2 9-1V5c-2-1-6-1-9 1Zm0 0v14"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    save: '<path d="M6 4h12v16l-6-4-6 4Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
    moon: '<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
    external: '<path d="M13 5h6v6m0-6-9 9M10 5H5v14h14v-9"/>',
    trophy:
      '<path d="M8 3h8v6a4 4 0 0 1-8 0V3Zm0 2H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4m-4 2v5m-5 3h10m-9-3h8"/>',
    table:
      '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>',
    swap: '<path d="M4 8h16m-4-4 4 4-4 4M20 16H4m4-4-4 4 4 4"/>',
  };
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function icon(key) {
    return (
      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' +
      (paths[key] || paths.book) +
      "</svg>"
    );
  }
  function base() {
    return location.pathname.indexOf("/pages/") !== -1 ? "../" : "";
  }
  function asset(src) {
    return src && src.indexOf("assets/") === 0 ? base() + src : src;
  }
  function page(name) {
    return base() + "pages/" + name + ".html";
  }
  function date(value) {
    if (!value) return "Pendiente de revisión";
    var parts = value.split("-");
    return parts[2] + "/" + parts[1] + "/" + parts[0];
  }
  function status(p) {
    return p.dataStatus === "verified"
      ? '<span class="badge badge-verified"><span class="status-dot"></span>Fuente verificada</span>'
      : '<span class="badge">Ficha académica</span>';
  }
  function priceCaption(p) {
    return p.price == null
      ? "Precio local pendiente"
      : TA.store.hasVerifiedPrice(p)
        ? "GTQ · " + date(p.priceVerifiedAt)
        : "GTQ · referencia académica";
  }
  var memoryFavorites = [],
    storageFailed = false;
  function favorites() {
    if (storageFailed) return memoryFavorites.slice();
    try {
      var raw = JSON.parse(localStorage.getItem("techalbum_saved_v1") || "[]");
      return Array.isArray(raw)
        ? raw.filter(function (id) {
            return !!TA.store.getById(id);
          })
        : [];
    } catch (e) {
      return memoryFavorites;
    }
  }
  function isSaved(id) {
    return favorites().indexOf(Number(id)) !== -1;
  }
  function toggleSaved(id) {
    id = Number(id);
    var ids = favorites();
    var at = ids.indexOf(id);
    if (at === -1) ids.push(id);
    else ids.splice(at, 1);
    memoryFavorites = ids;
    try {
      localStorage.setItem("techalbum_saved_v1", JSON.stringify(ids));
    } catch (e) {
      storageFailed = true;
    }
    refreshSaved();
    window.dispatchEvent(new CustomEvent("techalbum:saved-change"));
    toast(
      at === -1
        ? "Ficha guardada en este dispositivo."
        : "Ficha eliminada de tus guardados.",
    );
  }
  function refreshSaved() {
    document.querySelectorAll("[data-save]").forEach(function (button) {
      var p = TA.store.getById(button.dataset.save),
        active = isSaved(button.dataset.save);
      button.setAttribute("aria-pressed", String(active));
      button.setAttribute(
        "aria-label",
        (active ? "Quitar de guardados: " : "Guardar ficha: ") +
          (p ? p.brand + " " + p.model : "producto"),
      );
    });
  }
  var toastTimer;
  function toast(message) {
    var el = document.getElementById("toast");
    if (!el) return;
    clearTimeout(toastTimer);
    el.textContent = message;
    el.hidden = false;
    toastTimer = setTimeout(function () {
      el.hidden = true;
    }, 5500);
  }
  function animate(el) {
    if (
      el &&
      el.animate &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      el.animate(
        [
          { opacity: 0.65, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 200, easing: "cubic-bezier(.16,1,.3,1)" },
      );
  }
  function empty(title, description, action) {
    return (
      '<div class="empty"><h2>' +
      esc(title) +
      "</h2><p>" +
      esc(description) +
      "</p>" +
      (action || "") +
      "</div>"
    );
  }
  TA.ui = {
    esc: esc,
    icon: icon,
    base: base,
    asset: asset,
    page: page,
    date: date,
    status: status,
    priceCaption: priceCaption,
    favorites: favorites,
    isSaved: isSaved,
    toggleSaved: toggleSaved,
    refreshSaved: refreshSaved,
    toast: toast,
    animate: animate,
    empty: empty,
  };
})(window.TechAlbum);
