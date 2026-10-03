/* TechAlbum — js/products.js | Acceso a datos y utilidades */
window.TechAlbum = window.TechAlbum || {};
(function (TA) {
  "use strict";
  var DB = window.TECHALBUM_DATA || { CATEGORIES: [], PRODUCTS: [], RANGES: [] };
  var PLACEHOLDER = "assets/images/categories/placeholder.svg";

  function products() { return DB.PRODUCTS.slice(); }
  function categories() { return DB.CATEGORIES.slice(); }
  function getById(id) {
    id = Number(id);
    for (var i = 0; i < DB.PRODUCTS.length; i++) {
      if (DB.PRODUCTS[i].id === id) return DB.PRODUCTS[i];
    }
    return null;
  }
  function categoryById(id) {
    for (var i = 0; i < DB.CATEGORIES.length; i++) {
      if (DB.CATEGORIES[i].id === id) return DB.CATEGORIES[i];
    }
    return { id: id, label: id, icon: "📦", group: "", desc: "" };
  }
  function brandsOf(list) {
    var seen = {}, out = [];
    (list || products()).forEach(function (p) {
      if (!seen[p.brand]) { seen[p.brand] = 1; out.push(p.brand); }
    });
    return out.sort();
  }
  function formatPrice(value) {
    var n = Number(value) || 0;
    return "Q " + n.toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function rangeLabel(range) {
    if (range === "baja") return "Gama baja";
    if (range === "media") return "Gama media";
    if (range === "alta") return "Gama alta";
    return "";
  }
  function stars(rating) {
    var r = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    var s = "";
    for (var i = 0; i < 5; i++) s += i < r ? "★" : "☆";
    return s;
  }
  function imgFallback(img) {
    // Cadena de fallback: URL original → SVG de su categoría
    // (data-cat) → placeholder. Funciona desde la raíz y /pages.
    var step = Number(img.getAttribute("data-fb") || "0");
    var src = img.getAttribute("src") || img.src || "";
    var cat = img.getAttribute("data-cat") || "";
    var list = [src];
    if (cat) list.push("assets/images/categories/" + cat + ".svg", "../assets/images/categories/" + cat + ".svg");
    if (src && src.indexOf("assets/") !== 0 && src.indexOf("../assets/") !== 0) list.push("../" + src);
    list.push(PLACEHOLDER, "../" + PLACEHOLDER);
    step++;
    if (step < list.length && list[step] && list[step] !== img.src) {
      img.setAttribute("data-fb", String(step));
      img.onerror = function () { imgFallback(img); };
      img.src = list[step];
    } else {
      img.onerror = null;
    }
  }

  TA.store = {
    products: products, categories: categories, getById: getById,
    categoryById: categoryById, brandsOf: brandsOf, formatPrice: formatPrice,
    rangeLabel: rangeLabel, stars: stars, imgFallback: imgFallback,
    PLACEHOLDER: PLACEHOLDER
  };
})(window.TechAlbum);
