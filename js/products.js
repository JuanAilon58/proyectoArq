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
  function rangeOf(p) {
    if (!p) return "";
    if (p.range) return p.range;
    var inCategory = products().filter(function (item) { return item.category === p.category; })
      .sort(function (a, b) { return a.price - b.price || a.id - b.id; });
    var index = inCategory.map(function (item) { return item.id; }).indexOf(p.id);
    var total = inCategory.length;
    if (total <= 3) return "media";
    if (index < 2) return "baja";
    if (total >= 6 && index >= 4) return "alta";
    if (total === 4 && index >= 2) return "alta";
    return "media";
  }
  function comparisonMeta(p) {
    var cat = categoryById(p.category);
    return {
      category: cat.group || "Tecnología",
      subcategory: cat.label || p.category,
      range: rangeOf(p),
      key: [p.category, rangeOf(p)].join("|")
    };
  }
  function compatibleWith(first, candidate) {
    if (!first || !candidate) return true;
    return comparisonMeta(first).key === comparisonMeta(candidate).key;
  }
  function stars(rating) {
    var r = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    var s = "";
    for (var i = 0; i < 5; i++) s += i < r ? "★" : "☆";
    return s;
  }
  function recommendedFor(p) {
    var useCases = {
      procesadores: "estudiantes, gaming y equipos de productividad",
      graficas: "gaming, creación visual y edición multimedia",
      ram: "multitarea, estudio y equipos que necesitan mayor fluidez",
      almacenamiento: "agilizar el sistema y guardar proyectos o archivos",
      motherboards: "armar una PC compatible y ampliable",
      fuentes: "ensambles estables que requieren energía confiable",
      refrigeracion: "equipos que necesitan controlar temperatura y ruido",
      monitores: "estudio, trabajo visual y entretenimiento",
      teclados: "escritura, clases y sesiones de juego",
      mouse: "oficina, estudio y control preciso en juegos",
      webcams: "videollamadas, clases y transmisiones",
      microfonos: "clases, podcast y creación de contenido",
      smartphones: "usuarios que buscan un teléfono según su presupuesto y uso diario",
      camaras: "fotografía y creación de contenido",
      "camaras-video": "grabación de video y proyectos audiovisuales",
      drones: "fotografía aérea y proyectos creativos",
      impresoras: "tareas, documentos y trabajo desde casa",
      redes: "mejorar la cobertura y conectividad del hogar u oficina",
      audifonos: "clases, música, llamadas y gaming",
      bocinas: "música, películas y escritorio"
    };
    return useCases[p.category] || "usuarios que desean comparar especificaciones antes de elegir";
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
    rangeLabel: rangeLabel, rangeOf: rangeOf, comparisonMeta: comparisonMeta, compatibleWith: compatibleWith,
    stars: stars, recommendedFor: recommendedFor, imgFallback: imgFallback,
    PLACEHOLDER: PLACEHOLDER
  };
})(window.TechAlbum);
