/* Genera las rutas estáticas y mantiene el encabezado común en un solo lugar.
 * Se ejecuta solo al editar las plantillas; el sitio publicado no necesita Node. */
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
function icon(key) {
  const paths = {
    book: '<path d="M12 6c-3-2-7-2-9-1v14c2-1 6-1 9 1 3-2 7-2 9-1V5c-2-1-6-1-9 1Zm0 0v14"/>',
    compare: '<path d="M8 4v16M16 4v16M4 8h8m0 8h8"/>',
    moon: '<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  };
  return (
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' +
    paths[key] +
    "</svg>"
  );
}
function render(name, title, description, content) {
  const base = name === "home" ? "" : "../",
    pageBase = base + "pages/";
  const routes = [
    ["home", base + "index.html", "Inicio"],
    ["catalog", pageBase + "catalogo.html", "El álbum"],
    ["phones", pageBase + "smartphones.html", "Smartphones"],
    ["guide", pageBase + "guia.html", "Cómo elegir"],
  ];
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${description}"><meta name="theme-color" content="#173e35"><title>${title} — Álbum Tecnológico</title>
<link rel="icon" href="${base}assets/images/album-mark.svg" type="image/svg+xml"><link rel="preload" href="${base}assets/fonts/manrope-latin-variable.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="${base}assets/fonts/newsreader-latin-variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${base}css/style.css"><link rel="stylesheet" href="${base}css/components.css"><link rel="stylesheet" href="${base}css/responsive.css">${name === "compare" ? '<link rel="stylesheet" href="../css/comparison.css">' : ""}</head>
<body data-page="${name}"><script>try{document.body.dataset.theme=localStorage.getItem('album-tecnologico-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){document.body.dataset.theme='light'}</script>
<a class="skip-link" href="#contenido">Saltar al contenido</a>
<header class="site-header"><div class="container header-inner"><a class="brand" href="${base}index.html" aria-label="Álbum Tecnológico, inicio"><span class="brand-mark">${icon("book")}</span><span class="brand-name">Álbum Tecnológico<small>EXPLORA · ENTIENDE · COMPARA</small></span></a>
<nav class="main-nav" id="mainNav" aria-label="Navegación principal">${routes.map(([key, url, label]) => `<a href="${url}"${name === key ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
<div class="header-actions"><a class="compare-link" href="${pageBase}comparar.html"${name === "compare" ? ' aria-current="page"' : ""} aria-label="Abrir comparador">${icon("compare")}<span>Comparador</span><span class="compare-count" data-compare-count aria-label="Productos seleccionados">0</span></a><button class="icon-button" type="button" data-theme-toggle aria-label="Activar modo oscuro" aria-pressed="false">${icon("moon")}</button><button class="icon-button menu-toggle" type="button" id="menuToggle" aria-controls="mainNav" aria-expanded="false" aria-label="Abrir navegación">${icon("menu")}</button></div></div></header>
<main class="container" id="contenido">${content}<noscript><p class="notice">Activa JavaScript para explorar las fichas y usar el comparador. La guía de lectura permanece disponible.</p></noscript></main>
<footer class="site-footer"><div class="container footer-inner"><div><a class="footer-brand" href="${base}index.html">Álbum Tecnológico</a><p>Una colección para comprender la tecnología y elegir con contexto.</p><div class="footer-links"><a href="${pageBase}catalogo.html?saved=1">Mis guardados</a><a href="${pageBase}guia.html#fuentes">Fuentes y metodología</a><a href="${pageBase}guia.html#glosario">Glosario</a><a href="${pageBase}guia.html#imagenes">Créditos visuales</a></div></div><div><div class="academic"><img src="${base}assets/images/umg-logo.svg" alt="Emblema de la Universidad Mariano Gálvez de Guatemala" width="38" height="38"><span>Proyecto académico<br><strong>Universidad Mariano Gálvez de Guatemala</strong></span></div><p>Edición 2026 · Precios de referencia en quetzales.<br>Consulta la fuente y la fecha en cada ficha.</p></div></div></footer>
<aside id="compareDock" class="compare-dock" aria-label="Tu selección para comparar" hidden></aside><div id="toast" class="toast" role="status" aria-live="polite" hidden></div>
${["data/products.js", "data/catalog-2026.js", "js/products.js", "js/ui.js", "js/recommendation.js", "js/comparison-model.js", "js/comparator.js", "js/catalog.js", "js/search.js", "js/duel.js", "js/app.js", "js/pages.js"].map((src) => `<script src="${base}${src}"></script>`).join("\n")}
</body></html>`;
}
const templates = {
  home: [
    "Inicio",
    "Explora un álbum de tecnología por categoría, tipo y gama. Compara fichas con fuentes oficiales y conoce las novedades verificadas en 2026.",
    `
    <div class="masthead"><span>Una colección en constante aprendizaje</span><span>Guatemala · Edición 2026</span></div>
    <section class="hero" aria-labelledby="heroTitle"><div class="hero-copy"><h1 id="heroTitle">La tecnología,<br><em>página a página.</em></h1><p>Un álbum para descubrir qué hay detrás de cada dispositivo. Explora sus características y compara opciones que tienen sentido juntas.</p><div class="hero-actions"><a class="btn btn-primary" href="pages/catalogo.html">Abrir el álbum ${icon("arrow")}</a><a class="text-link" href="pages/comparar.html">Comparar productos</a></div></div><figure class="hero-figure"><div class="hero-photo"><img src="assets/images/products/2105927.jpg" width="800" height="533" alt="Detalle de los contactos de un procesador" fetchpriority="high"><figcaption class="hero-photo-caption"><strong>Pequeños componentes.<br>Grandes diferencias.</strong><span>Fotografía editorial</span></figcaption></div><div class="hero-inset"><strong>Empieza por entender.</strong><p>Una especificación cuenta más cuando sabes qué significa.</p><a class="text-link" href="pages/guia.html">Leer la guía ${icon("arrow")}</a></div></figure></section>
    <div class="catalog-strip"><p><strong>Comparaciones con contexto.</strong> Dos productos de una subcategoría. Fotos, diferencias y veredicto.</p><a class="text-link" href="pages/guia.html#comparaciones">Conoce el método ${icon("arrow")}</a></div>
    <section class="section" aria-labelledby="chaptersTitle"><div class="section-heading"><div><h2 id="chaptersTitle">El índice de tu álbum.</h2><p>Del interior de una computadora a los dispositivos que te acompañan.</p></div><a class="text-link" href="pages/catalogo.html">Todas las subcategorías ${icon("arrow")}</a></div><div id="homeChapters" class="chapter-index"></div></section>
    <section class="section" aria-labelledby="currentTitle"><div class="section-heading"><div><h2 id="currentTitle">Una mirada a la edición 2026.</h2><p>Una selección de fichas contrastadas con documentación oficial. Cada una conserva sus fuentes.</p></div><a class="text-link" href="pages/catalogo.html?status=verified">Explorar fichas verificadas ${icon("arrow")}</a></div><div id="featuredProducts" class="grid-products"></div></section>
    <section class="section feature-spread" aria-labelledby="phonesTitle"><div><img class="feature-image" src="assets/images/products/3766218.jpg" width="800" height="533" loading="lazy" alt="Una persona consulta su smartphone"><p class="reading-note">Fotografía editorial · no representa un modelo específico.</p></div><div class="feature-copy"><h2 id="phonesTitle">Tu próximo teléfono empieza con una buena pregunta.</h2><p>¿Más espacio, una pantalla más fluida o varios años de soporte? Recorre las gamas y encuentra las diferencias que importan para tu día a día.</p><a class="btn" href="pages/smartphones.html">Explorar smartphones ${icon("arrow")}</a></div></section>
    <section class="section" aria-labelledby="methodTitle"><div class="section-heading"><h2 id="methodTitle">De la curiosidad a una decisión.</h2><a class="text-link" href="pages/guia.html">Cómo usar este álbum ${icon("arrow")}</a></div><div class="method-list"><div><h3>Encuentra tu sección.</h3><p>El índice organiza categorías, subcategorías y tipos de producto. Empieza por lo que necesitas conocer.</p></div><div><h3>Lee entre las cifras.</h3><p>Una ficha reúne características, contexto y fuentes. Las fotografías ilustrativas se identifican siempre.</p></div><div><h3>Compara con criterio.</h3><p>Selecciona opciones equivalentes y revisa ventajas concretas. Una cifra aislada no decide por ti.</p></div></div></section>`,
  ],
  catalog: [
    "El álbum",
    "Catálogo de tecnología organizado por categoría, subcategoría, tipo y gama, con búsqueda y fichas guardadas.",
    `
    <section class="page-intro"><h1 id="catalogTitle">Abre una nueva sección.</h1><p id="catalogDescription">Explora por categoría, afina por tipo y gama, y guarda las fichas que quieres volver a consultar.</p></section>
    <div class="catalog-layout"><aside class="catalog-sidebar" aria-label="Índice del álbum"><h2>Índice de categorías</h2><div id="catalogDirectory"></div><div class="field mobile-directory"><label for="mobileCategory">Ir a una subcategoría</label><select id="mobileCategory"></select></div></aside><div class="catalog-main"><form id="catalogForm" class="catalog-topbar" role="search"><div class="toolbar"><div class="field search-field"><label for="catalogQ">Buscar en esta sección</label><input type="search" id="catalogQ" placeholder="Marca, modelo o característica" autocomplete="off"></div><div class="field"><label for="typeFilter">Tipo de producto</label><select id="typeFilter"><option value="">Todos los tipos</option></select></div><div class="field"><label for="rangeFilter">Gama</label><select id="rangeFilter"><option value="">Todas las gamas</option><option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option></select></div><div class="field"><label for="brandFilter">Marca</label><select id="brandFilter"></select></div></div><div class="catalog-options"><p id="catalogCount" role="status" aria-live="polite"></p><label class="check-label"><input type="checkbox" id="verifiedOnly">Solo fuentes verificadas</label><label class="check-label"><input type="checkbox" id="savedOnly">Mis guardados</label><button class="text-button" type="button" id="resetFilters">Restablecer</button></div></form><div id="filterChips" class="filter-chips"></div><div id="catalogProducts" class="grid-products"></div><div class="load-more"><button class="btn" type="button" id="loadMore" hidden>Mostrar más fichas</button></div></div></div><p class="notice">Las gamas se asignan por el uso y segmento de cada producto. Las fichas académicas y los precios de referencia aún requieren validación; consulta las fuentes dentro de cada ficha.</p>`,
  ],
  phones: [
    "Smartphones",
    "Smartphones por gama con fichas oficiales verificadas y comparaciones equivalentes.",
    `
    <section class="page-intro"><h1>Un teléfono para tu forma de usarlo.</h1><p>Explora las gamas, lee las diferencias y compara dos modelos del mismo segmento. Las especificaciones de cada variante están en su ficha.</p></section><div class="range-controls" role="group" aria-label="Elegir gama"><button class="range-control" type="button" data-range="" aria-pressed="true">Todas las gamas</button><button class="range-control" type="button" data-range="baja" aria-pressed="false">Gama baja</button><button class="range-control" type="button" data-range="media" aria-pressed="false">Gama media</button><button class="range-control" type="button" data-range="alta" aria-pressed="false">Gama alta</button></div><div class="toolbar"><div class="field search-field"><label for="phoneQ">Buscar teléfonos</label><input type="search" id="phoneQ" placeholder="Marca, modelo o característica"></div><label class="check-label"><input type="checkbox" id="phoneArchive">Incluir fichas académicas anteriores</label></div><p id="phoneCount" class="notice" role="status" aria-live="polite"></p><div id="rangeSections"></div>`,
  ],
  detail: [
    "Ficha de producto",
    "Especificaciones, fuentes, contexto y alternativas comparables del producto.",
    `<div class="page-intro"><nav class="breadcrumb" id="detailBreadcrumb" aria-label="Ruta de la ficha"><a href="catalogo.html">El álbum</a></nav><a class="text-link" id="backToAlbum" href="catalogo.html">Volver a tu sección</a></div><div id="detail"><p class="loading-note">Cargando ficha…</p></div><section class="section" id="relatedSection"><div class="section-heading"><div><h2>Otras páginas de la misma sección.</h2><p>Productos de la misma subcategoría para continuar la comparación.</p></div></div><div class="grid-products" id="related"></div></section>`,
  ],
  compare: [
    "Comparador",
    "Comparativa A contra B para todos los productos del álbum: fotos, especificaciones, ventajas y veredicto.",
    fs.readFileSync(path.join(__dirname, "comparison-template.html"), "utf8"),
  ],
  guide: [
    "Cómo elegir",
    "Guía para leer especificaciones, entender el comparador y consultar fuentes del álbum tecnológico.",
    `
    <section class="page-intro"><h1>Entender también es elegir.</h1><p>Una guía breve para leer las fichas, hacer comparaciones útiles y reconocer los límites de la información.</p></section><div class="guide-layout"><nav class="guide-index" aria-label="En esta guía"><a href="#comparaciones">Comparar con contexto</a><a href="#gamas">Qué significa una gama</a><a href="#fuentes">Fuentes y revisión</a><a href="#glosario">Glosario de tecnología</a></nav><div class="guide-content"><section id="comparaciones"><h2>Compara cosas que hacen el mismo trabajo.</h2><p>Cada producto abre una comparativa A contra B dentro de su subcategoría. Se sugiere primero una alternativa del mismo tipo y gama. Puedes cambiar ambos productos; si tienen funciones o plataformas diferentes, la tabla lo explica y no declara un ganador. Los smartphones se comparan dentro de su gama.</p><h3>Una recomendación que puedas revisar</h3><p>La tabla reúne especificaciones y resalta ventajas, empates y datos ausentes. Los conteos de A y B se calculan a partir de esas mismas filas. Capacidad, frecuencia de pantalla y funciones incluidas se evalúan con criterios explícitos; longitud y color no se califican como mejores. El veredicto explica para qué uso destaca cada producto, y las comparaciones académicas se identifican como pendientes de verificación.</p><p>Sin pruebas equivalentes no declaramos una CPU o GPU más rápida. Más memoria de video no equivale a más FPS, más GHz no garantiza más rendimiento y más megapíxeles no asegura una mejor cámara.</p><h3>Guarda, comparte y vuelve</h3><p>El marcador guarda fichas en este dispositivo. Cada tarjeta y ficha tiene acceso directo a Ver comparativa. Cambia A y B desde los selectores o busca cualquier producto en el índice completo. Puedes copiar el enlace e imprimir la comparación.</p></section><section id="gamas"><h2>La gama es una orientación.</h2><p>Es una clasificación editorial según el segmento y el uso previsto, independiente del orden de los precios. En teléfonos, la gama baja reúne opciones para uso esencial; la media, funciones avanzadas para uso diario; y la alta, propuestas de segmento premium. En otros productos, las gamas se interpretan dentro de su propio tipo.</p><p>Compartir gama no significa tener idéntico rendimiento, compatibilidad o tamaño. Antes de elegir revisa las diferencias, la variante exacta y lo que necesitas hacer.</p></section><section id="fuentes"><h2>Conoce de dónde viene cada dato.</h2><p><strong>Fuente verificada</strong> identifica fichas cuyas especificaciones seleccionadas se contrastaron con documentación oficial. La fecha indica cuándo se revisaron; no promete disponibilidad en Guatemala.</p><p><strong>Ficha académica</strong> identifica los datos demostrativos del catálogo original, conservados para consulta. Su precio y sus especificaciones necesitan validación antes de orientar una compra.</p><p>El año de lanzamiento aparece cuando está confirmado. Un modelo de años anteriores puede seguir siendo útil en 2026; el álbum distingue ese año de la fecha de revisión. Los precios locales pendientes se muestran como «Por verificar». Los precios de referencia no intervienen en la recomendación.</p><p>Las fotografías locales son ilustrativas salvo indicación expresa de fotografía del modelo. Revisa el enlace oficial de la ficha para conocer su apariencia exacta y sus variantes.</p><p>El catálogo funciona localmente; fuentes y especificaciones no se actualizan de forma automática. La revisión actual corresponde al 9 de octubre de 2026.</p></section><section id="imagenes"><h2>Las imágenes del álbum.</h2><p>Estas imágenes tienen una fuente y licencia registradas. Las fotografías de modelos de Wikimedia Commons se muestran sin retoque. La pareja SATA utiliza imágenes de Sabrent y StarTech con autor y fuente identificados; los derechos pertenecen a sus fabricantes. La fotografía de laptop de Pexels es ilustrativa; el resto conserva las referencias del proyecto original.</p><ul id="imageCredits"></ul></section><section id="glosario"><h2>Las palabras detrás de las cifras.</h2><div class="glossary" id="glossary"></div></section></div></div>`,
  ],
};
const filenames = {
  home: "index.html",
  catalog: "pages/catalogo.html",
  phones: "pages/smartphones.html",
  detail: "pages/producto.html",
  compare: "pages/comparar.html",
  guide: "pages/guia.html",
};
for (const [name, [title, description, content]] of Object.entries(templates))
  fs.writeFileSync(
    path.join(root, filenames[name]),
    render(name, title, description, content),
  );
console.log("6 páginas estáticas generadas.");
