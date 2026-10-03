/* TechAlbum — js/app.js | Inicialización general (nav, contadores) */
(function () {
  "use strict";
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    // Mejora de fotos con Pexels API (solo si hay key en js/pexels.js;
    // sin key no hace nada y se usan las fotos curadas).
    try {
      if (window.TechAlbum && TechAlbum.pexels) TechAlbum.pexels.enhance();
    } catch (e) { /* fotos curadas como respaldo */ }
    if (window.TechAlbum && TechAlbum.comparator) {
      TechAlbum.comparator.updatePill();
      TechAlbum.comparator.refreshButtons();
      TechAlbum.catalog.bindCompareButtons(document);
    }
    // Marca la página activa en la navegación.
    try {
      var page = (location.pathname.split("/").pop() || "index.html").split("?")[0];
      document.querySelectorAll(".main-nav a").forEach(function (a) {
        var href = (a.getAttribute("href") || "").split("?")[0].split("/").pop();
        if (href === page || (page === "" && href === "index.html")) a.setAttribute("aria-current", "page");
      });
    } catch (e) { /* navegación estática */ }
  });
})();
