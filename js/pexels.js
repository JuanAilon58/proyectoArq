/* ============================================================
   TechAlbum — js/pexels.js | Integración con Pexels API
   ------------------------------------------------------------
   - Cada producto ya trae una foto curada del CDN de Pexels
     (campo `image` en data/products.js). El sitio funciona
     SIN key: las fotos cargan directo, sin fetch.
   - Si pegas una API key gratuita (https://www.pexels.com/api/
     → "Get Started" → copia tu key), enhance() consulta la
     API (1 foto por categoría), actualiza las tarjetas en vivo
     y guarda el resultado 30 días en localStorage para no
     gastar tu cuota (200 req/hora, 20 000/mes en plan gratis).
   - Crédito sugerido por Pexels: "Fotos de Pexels".
     Licencia: uso gratuito, incluso comercial. No se exige
     atribución, pero el footer del sitio la incluye.
   ============================================================ */
window.TechAlbum = window.TechAlbum || {};
(function (TA) {
  "use strict";

  /* Pega aquí tu key gratuita de Pexels. Sin key, enhance() no
     hace nada y se usan las fotos curadas de data/products.js. */
  var API_KEY = "";

  var API_URL = "https://api.pexels.com/v1/search";
  var CACHE_KEY = "techalbum_pexels_v1";
  var CACHE_TTL = 30 * 24 * 60 * 60 * 1000; /* 30 días */

  /* Búsqueda por defecto para cada categoría del álbum. */
  var CATEGORY_QUERIES = {
    procesadores: "cpu processor computer hardware",
    graficas: "graphics card gpu computer",
    ram: "ram memory computer hardware",
    almacenamiento: "ssd hard drive storage",
    motherboards: "computer motherboard repair",
    fuentes: "gaming pc interior hardware",
    refrigeracion: "cpu cooler fan rgb",
    gabinetes: "gaming pc case rgb",
    monitores: "computer monitor desk setup",
    teclados: "mechanical keyboard rgb",
    mouse: "gaming mouse computer",
    webcams: "video call laptop webcam",
    microfonos: "microphone podcast studio",
    bocinas: "bluetooth speaker portable",
    audifonos: "headphones headset",
    cables: "usb cable charger",
    smartphones: "smartphone in hand",
    tecnologia: "smartwatch tablet gadgets",
    mezcladores: "audio mixer studio",
    sonido: "audio equipment studio",
    radios: "retro radio",
    adaptadores: "usb hub adapter",
    redes: "wifi router network",
    camaras: "mirrorless camera",
    "camaras-deportivas": "action camera gopro",
    "camaras-video": "video camera filming",
    estabilizadores: "gimbal stabilizer",
    "aros-luz": "ring light",
    selfie: "selfie stick smartphone",
    drones: "drone flying",
    impresoras: "printer office",
    scanners: "scanning documents",
    luces: "led lights room",
    televisores: "smart tv living room",
    proyectores: "home cinema projector",
    baterias: "rechargeable batteries",
    "pasta-termica": "cpu processor motherboard",
    servidores: "server rack data center",
    usb: "usb flash drive",
    memorias: "sd memory card",
    smartwatch: "smartwatch wrist",
    anillos: "gold ring macro",
    lentes: "sunglasses",
    vr: "vr headset",
    "lentes-proteccion": "eyeglasses",
    consolas: "game controller console",
    robots: "robot toy",
    "discos-opticos": "cd dvd discs"
  };

  function queryFor(p) {
    if (!p) return "technology";
    if (p.category === "smartphones") return (p.brand || "") + " smartphone";
    if (p.category === "tecnologia") return (p.brand || "") + " " + (p.model || "");
    return ((p.brand || "") + " " + (p.model || "")).trim() || CATEGORY_QUERIES[p.category] || "technology";
  }

  function categoryQuery(catId) {
    return CATEGORY_QUERIES[catId] || "technology";
  }

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function writeCache(cache) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) { /* cuota llena: seguir sin caché */ }
  }

  function cachedUrl(query) {
    var cache = readCache();
    var hit = cache[query];
    if (hit && hit.url && (Date.now() - hit.ts) < CACHE_TTL) return hit;
    return null;
  }

  function remember(query, photo) {
    if (!photo || !photo.src) return;
    var cache = readCache();
    cache[query] = {
      url: photo.src.large || photo.src.medium,
      photographer: photo.photographer || "",
      photographerUrl: photo.photographer_url || photo.url || "",
      ts: Date.now()
    };
    writeCache(cache);
  }

  /* Una búsqueda a la API de Pexels. Requiere key. */
  function search(query, perPage) {
    if (!API_KEY) return Promise.reject(new Error("Pexels: configura API_KEY en js/pexels.js"));
    var url = API_URL + "?query=" + encodeURIComponent(query) +
      "&per_page=" + (perPage || 1) + "&orientation=landscape&size=medium";
    return fetch(url, { headers: { Authorization: API_KEY } }).then(function (res) {
      if (!res.ok) throw new Error("Pexels API: HTTP " + res.status);
      return res.json();
    });
  }

  function swapInDom(brand, model, url) {
    var alt = brand + " " + model;
    var imgs = document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].getAttribute("alt") === alt && imgs[i].getAttribute("src") !== url) {
        imgs[i].removeAttribute("data-fb"); /* reinicia la cadena de fallback */
        imgs[i].src = url;
      }
    }
  }

  /* Mejora las fotos usando la API (1 request por categoría).
     Sin key → no hace nada (resuelve { skipped: true }). */
  function enhance() {
    if (!API_KEY) return Promise.resolve({ skipped: true, updated: 0 });
    if (typeof fetch === "undefined") return Promise.resolve({ skipped: true, updated: 0 });
    var products = TA.store ? TA.store.products() : [];
    var queries = [];
    var seen = {};
    products.forEach(function (p) {
      var q = categoryQuery(p.category);
      if (!seen[q]) { seen[q] = 1; queries.push(q); }
    });

    var updated = 0;
    var chain = Promise.resolve();
    queries.forEach(function (q) {
      chain = chain.then(function () {
        var hit = cachedUrl(q);
        if (hit) { applyUrl(q, hit.url); return null; }
        return search(q, 1).then(function (json) {
          var photo = json && json.photos && json.photos[0];
          if (!photo) return null;
          remember(q, photo);
          applyUrl(q, photo.src.large || photo.src.medium);
        }).catch(function () { /* sin red o cuota: conserva la foto curada */ return null; });
      });
    });

    function applyUrl(q, url) {
      if (!url) return;
      products.forEach(function (p) {
        if (categoryQuery(p.category) === q && p.image !== url) {
          p.image = url;
          updated++;
          swapInDom(p.brand, p.model, url);
        }
      });
    }

    return chain.then(function () { return { skipped: false, updated: updated }; });
  }

  function configure(key) { API_KEY = String(key || "").trim(); }

  TA.pexels = {
    configure: configure,
    queryFor: queryFor,
    categoryQuery: categoryQuery,
    search: search,
    enhance: enhance,
    CREDIT: "Pexels"
  };
})(window.TechAlbum);
