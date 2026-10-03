/* TechAlbum — js/catalog.js | Render de tarjetas, categorías y destacados */
window.TechAlbum = window.TechAlbum || {};
(function (TA) {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function imgSrc(src) {
    // Las páginas dentro de /pages necesitan prefijo ../ para llegar a assets/.
    if (typeof location !== "undefined" && location.pathname.indexOf("/pages/") !== -1 &&
        src && src.indexOf("assets/") === 0) {
      return "../" + src;
    }
    return src;
  }

  function cardHTML(p, opts) {
    opts = opts || {};
    var cat = TA.store.categoryById(p.category);
    var productRange = TA.store.rangeOf(p);
    var range = productRange
      ? '<span class="badge badge-range-' + esc(productRange) + '">' + esc(TA.store.rangeLabel(productRange)) + "</span>"
      : "";
    var detailHref = (opts.base || "") + "pages/producto.html?id=" + p.id;
    return (
      '<article class="product-card" data-product-card data-id="' + p.id + '">' +
        '<div class="product-media"><img src="' + esc(imgSrc(p.image)) + '" data-cat="' + esc(p.category) + '" alt="' + esc(p.brand + " " + p.model) + '" loading="lazy" onerror="TechAlbum.store.imgFallback(this)"></div>' +
        '<div class="product-body">' +
          '<span class="product-brand">' + esc(p.brand) + "</span>" +
          '<h3 class="product-model">' + esc(p.model) + "</h3>" +
          '<div class="product-meta"><span class="badge">' + esc(cat.label) + "</span>" + range +
          '<span class="stars" aria-label="Calificación ' + p.rating + ' de 5">' + TA.store.stars(p.rating) + "</span></div>" +
          '<div class="product-price">' + esc(TA.store.formatPrice(p.price)) + "</div>" +
          '<p class="product-highlight">' + esc((p.highlights && p.highlights[0]) || "") + "</p>" +
          '<div class="product-actions">' +
            '<a class="btn btn-small btn-primary" href="' + detailHref + '">Ver ficha</a>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function renderInto(el, items, opts) {
    if (!el) return;
    if (!items.length) {
      el.innerHTML = '<div class="empty"><span class="big">🔍</span><p>No se encontraron productos con esos criterios.<br>Prueba a limpiar la búsqueda o los filtros.</p></div>';
    } else {
      el.innerHTML = items.map(function (p) { return cardHTML(p, opts); }).join("");
    }
    bindCompareButtons(el);
    if(TA.comparator) TA.comparator.refreshButtons();
  }

  function bindCompareButtons(root) {
    (root || document).querySelectorAll("[data-compare-btn]").forEach(function (btn) {
      if (btn.dataset.bound) return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", function () {
        var id = Number(btn.getAttribute("data-compare-btn"));
        if(TA.comparator) TA.comparator.toggle(id, btn);
      });
    });
  }

  function categoryCards(el, opts) {
    if (!el) return;
    var counts = {};
    TA.store.products().forEach(function (p) { counts[p.category] = (counts[p.category] || 0) + 1; });
    el.innerHTML = TA.store.categories().map(function (c) {
      var href = (opts && opts.base ? opts.base : "") + "pages/catalogo.html?cat=" + encodeURIComponent(c.id);
      var sample = TA.store.products().filter(function (p) { return p.category === c.id; })[0];
      if (opts && opts.rail) {
        return (
          '<a class="cat-orbit" href="' + href + '">' +
            '<span class="cat-orbit-media"><img src="' + esc(imgSrc(sample ? sample.image : TA.store.PLACEHOLDER)) + '" data-cat="' + esc(c.id) + '" alt="" loading="lazy" onerror="TechAlbum.store.imgFallback(this)"></span>' +
            '<strong>' + esc(c.label) + '</strong><small>' + (counts[c.id] || 0) + ' opciones</small>' +
          '</a>'
        );
      }
      return (
        '<a class="cat-card" href="' + href + '">' +
          '<span class="cat-icon" aria-hidden="true">' + c.icon + "</span>" +
          "<span><strong>" + esc(c.label) + "</strong><small>" + (counts[c.id] || 0) + " productos</small></span>" +
        "</a>"
      );
    }).join("");
  }

  TA.catalog = { cardHTML: cardHTML, renderInto: renderInto, bindCompareButtons: bindCompareButtons, categoryCards: categoryCards, esc: esc };
})(window.TechAlbum);
