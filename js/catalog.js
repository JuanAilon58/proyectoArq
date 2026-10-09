/* Fichas compartidas: fotos editoriales identificadas y selección persistente. */
window.TechAlbum = window.TechAlbum || {};
(function (TA) {
  "use strict";
  var U = TA.ui,
    esc = U.esc;
  function cardHTML(p) {
    var cat = TA.store.categoryById(p.category),
      href = U.page("producto") + "?id=" + p.id;
    var keys = Object.keys(p.specifications || {}).slice(0, 3);
    return (
      '<article class="product-card" data-product-card data-id="' +
      p.id +
      '">' +
      '<div class="product-media" data-kind="' +
      p.imageKind +
      '"><a href="' +
      href +
      '" tabindex="-1" aria-hidden="true"><img src="' +
      esc(U.asset(p.image)) +
      '" alt="" data-cat="' +
      esc(p.category) +
      '" width="800" height="533" loading="lazy" onerror="TechAlbum.store.imgFallback(this)"></a>' +
      '<span class="image-label">' +
      (p.imageKind === "exact"
        ? "Fotografía del modelo"
        : "Fotografía ilustrativa") +
      "</span>" +
      '<button class="save-button" type="button" data-save="' +
      p.id +
      '" aria-pressed="' +
      U.isSaved(p.id) +
      '" aria-label="Guardar ficha: ' +
      esc(p.brand + " " + p.model) +
      '">' +
      U.icon("save") +
      "</button></div>" +
      '<div class="product-body"><div class="product-topline"><span class="product-brand">' +
      esc(p.brand) +
      "</span>" +
      U.status(p) +
      "</div>" +
      '<h3 class="product-model"><a href="' +
      href +
      '">' +
      esc(p.model) +
      '</a></h3><div class="product-meta"><span class="badge">' +
      esc(TA.store.rangeLabel(p.range)) +
      "</span>" +
      (p.releaseYear
        ? '<span class="badge' +
          (p.releaseYear === 2026 ? " badge-new" : "") +
          '">' +
          p.releaseYear +
          "</span>"
        : "") +
      "</div>" +
      '<ul class="card-specs">' +
      keys
        .map(function (key) {
          return (
            "<li><b>" +
            esc(key) +
            "</b> " +
            esc(p.specifications[key]) +
            "</li>"
          );
        })
        .join("") +
      "</ul>" +
      '<div class="product-bottom"><p class="product-price">' +
      esc(TA.store.formatPrice(p.price)) +
      '<span class="price-caption">' +
      esc(U.priceCaption(p)) +
      "</span></p>" +
      (TA.store.hasAlternatives(p)
        ? '<button type="button" class="compare-button" data-compare-btn="' +
          p.id +
          '" aria-label="Comparar ' +
          esc(p.brand + " " + p.model) +
          '" aria-pressed="false">' +
          U.icon("compare") +
          "<span data-compare-label>Comparar</span></button>"
        : '<span class="badge" title="Aún no hay otra ficha del mismo tipo y gama">Solo consulta</span>') +
      "</div></div></article>"
    );
  }
  function bindCompareButtons(root) {
    (root || document)
      .querySelectorAll("[data-compare-btn]")
      .forEach(function (button) {
        if (button.dataset.bound) return;
        button.dataset.bound = "1";
        button.addEventListener("click", function () {
          TA.comparator.toggle(Number(button.dataset.compareBtn), button);
        });
      });
    (root || document)
      .querySelectorAll("[data-save]")
      .forEach(function (button) {
        if (button.dataset.bound) return;
        button.dataset.bound = "1";
        button.addEventListener("click", function () {
          U.toggleSaved(button.dataset.save);
        });
      });
    U.refreshSaved();
    if (TA.comparator) TA.comparator.refreshButtons();
  }
  function renderInto(el, items) {
    if (!el) return;
    el.innerHTML = items.length
      ? items.map(cardHTML).join("")
      : U.empty(
          "No encontramos esas fichas",
          "Prueba otra búsqueda o restablece los filtros.",
        );
    bindCompareButtons(el);
  }
  function categoryCards(el) {
    if (!el) return;
    el.innerHTML = TA.store
      .categories()
      .map(function (c) {
        return (
          '<a class="chapter-link" href="' +
          U.page("catalogo") +
          "?cat=" +
          encodeURIComponent(c.id) +
          '"><span><strong>' +
          esc(c.label) +
          "</strong><small>" +
          esc(c.group) +
          "</small></span>" +
          U.icon("arrow") +
          "</a>"
        );
      })
      .join("");
  }
  TA.catalog = {
    cardHTML: cardHTML,
    renderInto: renderInto,
    bindCompareButtons: bindCompareButtons,
    categoryCards: categoryCards,
    esc: esc,
  };
})(window.TechAlbum);
