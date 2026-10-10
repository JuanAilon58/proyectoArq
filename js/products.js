/* TechAlbum — js/products.js | Acceso a datos y utilidades */
window.TechAlbum = window.TechAlbum || {};
(function (TA) {
  "use strict";
  var DB = window.TECHALBUM_DATA || {
    CATEGORIES: [],
    PRODUCTS: [],
    RANGES: [],
  };
  var PLACEHOLDER = "assets/images/categories/placeholder.svg";

  function products() {
    return DB.PRODUCTS.slice();
  }
  function categories() {
    return DB.CATEGORIES.slice();
  }
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
    var seen = {},
      out = [];
    (list || products()).forEach(function (p) {
      if (!seen[p.brand]) {
        seen[p.brand] = 1;
        out.push(p.brand);
      }
    });
    return out.sort();
  }
  function formatPrice(value) {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      typeof value === "boolean"
    )
      return "Por verificar";
    var n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return "Por verificar";
    return (
      "Q " +
      n.toLocaleString("es-GT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
  function hasVerifiedPrice(p) {
    if (
      !p ||
      p.priceStatus !== "verified" ||
      p.currency !== "GTQ" ||
      !Number.isFinite(p.price) ||
      p.price <= 0
    )
      return false;
    var source =
      typeof p.priceSource === "string"
        ? p.priceSource
        : p.priceSource && p.priceSource.url;
    return (
      /^https?:\/\//.test(source || "") &&
      /^\d{4}-\d{2}-\d{2}$/.test(p.priceVerifiedAt || "")
    );
  }
  function rangeLabel(range) {
    if (range === "baja") return "Gama baja";
    if (range === "media") return "Gama media";
    if (range === "alta") return "Gama alta";
    return "";
  }
  function rangeOf(p) {
    return p && ["baja", "media", "alta"].indexOf(p.range) !== -1
      ? p.range
      : "";
  }
  function comparisonMeta(p) {
    p = p || {};
    var cat = categoryById(p.category);
    var range = rangeOf(p);
    var group = p.comparisonGroup || "";
    return {
      category: cat.group || "Tecnología",
      subcategory: cat.label || p.category,
      type: p.comparisonLabel || group,
      comparisonGroup: group,
      range: range,
      key: p.category
        ? [p.category, p.category === "smartphones" ? range : "all"].join("|")
        : null,
    };
  }
  function compatibleWith(first, candidate) {
    if (!first || !candidate) return false;
    var key = comparisonMeta(first).key;
    return !!key && key === comparisonMeta(candidate).key;
  }
  function hasAlternatives(p) {
    return (
      !!p &&
      DB.PRODUCTS.some(function (other) {
        return other.id !== p.id && compatibleWith(p, other);
      })
    );
  }
  function alternatives(p, candidates) {
    return (candidates || products())
      .filter(function (other) {
        return p && other.id !== p.id && compatibleWith(p, other);
      })
      .sort(function (a, b) {
        return (
          (b.comparisonGroup === p.comparisonGroup) -
            (a.comparisonGroup === p.comparisonGroup) ||
          (b.range === p.range) - (a.range === p.range) ||
          (b.brand !== p.brand) - (a.brand !== p.brand) ||
          (b.dataStatus === "verified") - (a.dataStatus === "verified") ||
          a.id - b.id
        );
      });
  }
  function comparisonIds(p) {
    var other = alternatives(p)[0];
    return p ? [p.id].concat(other ? [other.id] : []) : [];
  }
  function comparisonPairs(items, candidates) {
    var seen = {},
      result = [];
    items.forEach(function (p) {
      var other = alternatives(p, candidates)[0];
      if (!other) return;
      var key = [p.id, other.id]
        .sort(function (a, b) {
          return a - b;
        })
        .join(",");
      if (seen[key]) return;
      seen[key] = true;
      result.push([p, other]);
    });
    return result;
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
      smartphones:
        "usuarios que buscan un teléfono según su presupuesto y uso diario",
      camaras: "fotografía y creación de contenido",
      "camaras-video": "grabación de video y proyectos audiovisuales",
      drones: "fotografía aérea y proyectos creativos",
      impresoras: "tareas, documentos y trabajo desde casa",
      redes: "mejorar la cobertura y conectividad del hogar u oficina",
      audifonos: "clases, música, llamadas y gaming",
      bocinas: "música, películas y escritorio",
    };
    return (
      useCases[p.category] ||
      "usuarios que desean comparar especificaciones antes de elegir"
    );
  }
  function imgFallback(img) {
    // Cadena de fallback: URL original → SVG de su categoría
    // (data-cat) → placeholder. Funciona desde la raíz y /pages.
    var step = Number(img.getAttribute("data-fb") || "0");
    var src = img.getAttribute("src") || img.src || "";
    var cat = img.getAttribute("data-cat") || "";
    var list = [src];
    if (cat)
      list.push(
        "assets/images/categories/" + cat + ".svg",
        "../assets/images/categories/" + cat + ".svg",
      );
    if (src && src.indexOf("assets/") !== 0 && src.indexOf("../assets/") !== 0)
      list.push("../" + src);
    list.push(PLACEHOLDER, "../" + PLACEHOLDER);
    step++;
    if (step < list.length && list[step] && list[step] !== img.src) {
      img.setAttribute("data-fb", String(step));
      img.onerror = function () {
        imgFallback(img);
      };
      img.src = list[step];
    } else {
      img.onerror = null;
    }
  }

  TA.store = {
    products: products,
    categories: categories,
    getById: getById,
    categoryById: categoryById,
    brandsOf: brandsOf,
    formatPrice: formatPrice,
    hasVerifiedPrice: hasVerifiedPrice,
    rangeLabel: rangeLabel,
    rangeOf: rangeOf,
    comparisonMeta: comparisonMeta,
    compatibleWith: compatibleWith,
    stars: stars,
    hasAlternatives: hasAlternatives,
    alternatives: alternatives,
    comparisonIds: comparisonIds,
    comparisonPairs: comparisonPairs,
    recommendedFor: recommendedFor,
    imgFallback: imgFallback,
    PLACEHOLDER: PLACEHOLDER,
  };
})(window.TechAlbum);
