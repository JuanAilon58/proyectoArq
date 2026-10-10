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
      '<a class="compare-button" href="' +
      U.page("comparar") +
      "?producto=" +
      p.id +
      '" aria-label="Ver comparativa de ' +
      esc(p.brand + " " + p.model) +
      '">' +
      U.icon("compare") +
      "<span>Ver comparativa</span></a>" +
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
  function comparisonHTML(items) {
    var S = TA.store,
      M = TA.duelModel;
    var rows = M.rows(items),
      summary = M.summary(items, rows);
    var href =
      U.page("comparar") +
      "?ids=" +
      items
        .map(function (p) {
          return p.id;
        })
        .join(",");
    var label = items
      .map(function (p) {
        return p.brand + " " + p.model;
      })
      .join(" frente a ");
    var specs = rows
      .filter(function (r) {
        return !r.price;
      })
      .slice(0, 3);
    return (
      '<article class="category-duel" aria-label="' +
      esc(label) +
      '">' +
      '<div class="category-duel-products">' +
      items
        .map(function (p, side) {
          return (
            (side
              ? '<span class="category-duel-vs" aria-label="frente a">VS</span>'
              : "") +
            '<div class="category-duel-product category-duel-side-' +
            side +
            '">' +
            '<a class="category-duel-photo" href="' +
            href +
            '" aria-label="Ver comparativa de ' +
            esc(label) +
            '">' +
            '<img src="' +
            esc(U.asset(p.image)) +
            '" alt="' +
            esc(
              p.imageKind === "exact"
                ? p.brand + " " + p.model
                : "Imagen ilustrativa de " + S.categoryById(p.category).label,
            ) +
            '" width="800" height="533" loading="lazy" data-cat="' +
            esc(p.category) +
            '" onerror="TechAlbum.store.imgFallback(this)">' +
            '<span class="category-duel-tag">PRODUCTO ' +
            (side ? "B" : "A") +
            "</span>" +
            '<span class="category-duel-image-kind">' +
            (p.imageKind === "exact"
              ? "Foto del modelo"
              : "Imagen ilustrativa") +
            "</span></a>" +
            '<div class="category-duel-product-copy"><span class="category-duel-brand">' +
            esc(p.brand) +
            "</span>" +
            '<h3><a href="' +
            U.page("producto") +
            "?id=" +
            p.id +
            '">' +
            esc(p.model) +
            "</a></h3>" +
            '<p class="category-duel-price">' +
            esc(S.formatPrice(p.price)) +
            "</p>" +
            '<span class="category-duel-status">' +
            esc(
              p.dataStatus === "verified"
                ? "Fuente verificada"
                : "Ficha académica",
            ) +
            "</span></div></div>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="category-duel-data"><table><caption class="visually-hidden">Especificaciones de ' +
      esc(label) +
      '</caption><thead><tr><th scope="col">Característica</th><th scope="col">Producto A</th><th scope="col">Producto B</th></tr></thead><tbody>' +
      specs
        .map(function (r) {
          return (
            '<tr><th scope="row">' +
            esc(r.label) +
            "</th>" +
            r.values
              .map(function (value, side) {
                return (
                  "<td" +
                  (r.best === side ? ' class="category-duel-best"' : "") +
                  ">" +
                  esc(value) +
                  (r.best === side
                    ? "<small>Ventaja " + (side ? "B" : "A") + "</small>"
                    : "") +
                  "</td>"
                );
              })
              .join("") +
            "</tr>"
          );
        })
        .join("") +
      "</tbody></table>" +
      '<p class="category-duel-counts">Ventajas en la ficha completa: <span>A · ' +
      summary.counts[0] +
      "</span><span>B · " +
      summary.counts[1] +
      "</span></p>" +
      '<p class="category-duel-result">' +
      esc(summary.headline) +
      "</p>" +
      (!summary.verified
        ? '<p class="category-duel-caveat">Datos académicos pendientes de verificación.</p>'
        : "") +
      '<a class="category-duel-open" href="' +
      href +
      '">Ver comparativa completa ' +
      U.icon("arrow") +
      "</a></div></article>"
    );
  }
  function renderComparisons(el, pairs) {
    if (!el) return;
    el.innerHTML = pairs.map(comparisonHTML).join("");
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
    renderComparisons: renderComparisons,
    bindCompareButtons: bindCompareButtons,
    categoryCards: categoryCards,
    esc: esc,
  };
})(window.TechAlbum);
