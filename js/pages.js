window.TechAlbum = window.TechAlbum || {};
(function (TA) {
  "use strict";
  var U = TA.ui,
    esc = U.esc,
    S = TA.store;
  var glossary = {
    RAM: "Memoria de trabajo temporal. Más capacidad permite mantener más tareas abiertas; no reemplaza un procesador adecuado.",
    VRAM: "Memoria de la tarjeta gráfica. Su capacidad ayuda con ciertos proyectos y texturas, pero no determina los FPS por sí sola.",
    NVMe: "Protocolo para almacenamiento conectado mediante PCIe. Comprueba formato, generación y compatibilidad de la placa.",
    SSD: "Almacenamiento sin partes mecánicas. Capacidad, velocidad, durabilidad y garantía son criterios distintos.",
    OLED: "Panel con píxeles que emiten su propia luz. Contraste, brillo, durabilidad y uso previsto también deben evaluarse.",
    Hz: "Frecuencia de actualización: cuántas veces puede actualizarse la imagen cada segundo. Las aplicaciones y el equipo deben aprovecharla.",
    mAh: "Capacidad eléctrica de una batería. No es una medida directa de autonomía entre equipos diferentes.",
    TDP: "Valor térmico de diseño declarado para un componente. No es una medición universal de consumo ni se compara directamente con potencia base de otro fabricante.",
    Socket:
      "Conexión física y eléctrica del procesador con la placa. El chipset y la versión del BIOS también deben ser compatibles.",
    ANC: "Cancelación activa de ruido mediante micrófonos y procesamiento. Su eficacia necesita pruebas, no solo una etiqueta.",
    "USB-C":
      "Forma del conector. No garantiza por sí sola una velocidad, potencia de carga o salida de video específica.",
    ARM: "Arquitectura de procesador. La compatibilidad de las aplicaciones depende del sistema, versiones nativas y emulación disponible.",
  };
  function params() {
    return new URLSearchParams(location.search);
  }
  function name(p) {
    return p.brand + " " + p.model;
  }
  function ranked(items) {
    return items.slice().sort(function (a, b) {
      return (
        (b.dataStatus === "verified") - (a.dataStatus === "verified") ||
        (b.releaseYear || 0) - (a.releaseYear || 0) ||
        a.id - b.id
      );
    });
  }
  function option(value, label) {
    return '<option value="' + esc(value) + '">' + esc(label) + "</option>";
  }
  function updateUrl(values) {
    var query = new URLSearchParams();
    Object.keys(values).forEach(function (key) {
      if (values[key]) query.set(key, values[key]);
    });
    try {
      history.replaceState(
        null,
        "",
        location.pathname + (query.toString() ? "?" + query.toString() : ""),
      );
    } catch (e) {
      /* navegación file:// disponible sin historial */
    }
  }
  function home() {
    var chapters = [
      [
        "Componentes internos",
        "Dentro de tu PC",
        "Procesadores, gráficas y memoria",
      ],
      ["Teléfonos", "Smartphones", "Gamas y ecosistemas"],
      ["Computación portátil", "En movimiento", "Laptops y tablets"],
      ["Audio", "Escucha las diferencias", "Audífonos, bocinas y micrófonos"],
      ["Conectividad", "Todo conectado", "Cables, adaptadores y redes"],
      ["Periféricos", "Tu espacio de trabajo", "Teclados, mouse y accesorios"],
    ];
    document.getElementById("homeChapters").innerHTML = chapters
      .map(function (item) {
        return (
          '<a class="chapter-link" href="' +
          U.page("catalogo") +
          "?group=" +
          encodeURIComponent(item[0]) +
          '"><span><strong>' +
          item[1] +
          "</strong><small>" +
          item[2] +
          "</small></span>" +
          U.icon("arrow") +
          "</a>"
        );
      })
      .join("");
    TA.catalog.renderInto(
      document.getElementById("featuredProducts"),
      [204, 213, 222].map(S.getById).filter(Boolean),
    );
  }
  function catalog() {
    var initial = params(),
      state = {
        cat: initial.get("cat") || "",
        group: initial.get("group") || "",
        q: initial.get("q") || "",
        type: initial.get("type") || "",
        range: initial.get("range") || "",
        brand: initial.get("brand") || "",
        status: initial.get("status") === "verified" ? "verified" : "",
        saved: initial.get("saved") === "1" ? "1" : "",
      };
    var limit = 24,
      host = document.getElementById("catalogProducts"),
      form = document.getElementById("catalogForm");
    var q = document.getElementById("catalogQ"),
      type = document.getElementById("typeFilter"),
      range = document.getElementById("rangeFilter"),
      brand = document.getElementById("brandFilter"),
      verified = document.getElementById("verifiedOnly"),
      saved = document.getElementById("savedOnly"),
      mobile = document.getElementById("mobileCategory");
    var groups = {};
    S.categories().forEach(function (c) {
      (groups[c.group] || (groups[c.group] = [])).push(c);
    });
    if (
      !S.categories().some(function (c) {
        return c.id === state.cat;
      })
    )
      state.cat = "";
    if (!groups[state.group]) state.group = "";
    function scope() {
      return S.products().filter(function (p) {
        return (
          (!state.cat || p.category === state.cat) &&
          (!state.group || S.categoryById(p.category).group === state.group)
        );
      });
    }
    function directory() {
      var html =
        '<a class="text-link directory-all" href="catalogo.html">Todo el álbum</a><div class="category-directory">' +
        Object.keys(groups)
          .map(function (g) {
            return (
              "<details" +
              (state.group === g ||
              (state.cat && S.categoryById(state.cat).group === g)
                ? " open"
                : "") +
              "><summary>" +
              esc(g) +
              "</summary>" +
              groups[g]
                .map(function (c) {
                  var count = S.products().filter(function (p) {
                    return p.category === c.id;
                  }).length;
                  return (
                    '<a href="?cat=' +
                    encodeURIComponent(c.id) +
                    '" data-category="' +
                    esc(c.id) +
                    '"' +
                    (state.cat === c.id ? ' aria-current="true"' : "") +
                    "><span>" +
                    esc(c.label) +
                    "</span><span>" +
                    count +
                    "</span></a>"
                  );
                })
                .join("") +
              "</details>"
            );
          })
          .join("") +
        "</div>";
      document.getElementById("catalogDirectory").innerHTML = html;
      document.querySelectorAll("[data-category]").forEach(function (a) {
        a.addEventListener("click", function (e) {
          if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          state.cat = a.dataset.category;
          state.group = "";
          state.type = "";
          state.brand = "";
          limit = 24;
          setup();
          render();
          document
            .getElementById("catalogTitle")
            .scrollIntoView({ block: "start" });
        });
      });
      mobile.innerHTML =
        option("", "Todas las subcategorías") +
        Object.keys(groups)
          .map(function (g) {
            return (
              '<optgroup label="' +
              esc(g) +
              '">' +
              groups[g]
                .map(function (c) {
                  return option(c.id, c.label);
                })
                .join("") +
              "</optgroup>"
            );
          })
          .join("");
      mobile.value = state.cat;
    }
    function setup() {
      directory();
      var items = scope(),
        types = {};
      items.forEach(function (p) {
        types[p.comparisonGroup] = p.comparisonLabel;
      });
      type.innerHTML =
        option("", "Todos los tipos") +
        Object.keys(types)
          .map(function (key) {
            return option(key, types[key]);
          })
          .join("");
      if (!types[state.type]) state.type = "";
      type.value = state.type;
      brand.innerHTML =
        option("", "Todas las marcas") +
        S.brandsOf(items)
          .map(function (b) {
            return option(b, b);
          })
          .join("");
      if (S.brandsOf(items).indexOf(state.brand) === -1) state.brand = "";
      brand.value = state.brand;
      q.value = state.q;
      range.value = state.range;
      verified.checked = state.status === "verified";
      saved.checked = !!state.saved;
      var c = state.cat ? S.categoryById(state.cat) : null;
      document.getElementById("catalogTitle").textContent = c
        ? "Comparativas de " + c.label.toLowerCase()
        : state.group
          ? "Comparativas · " + state.group
          : "Abre una nueva sección.";
      document.getElementById("catalogDescription").textContent = c
        ? c.desc +
          " Explora las parejas A/B y abre la tabla completa para ver todas sus diferencias."
        : "Explora por categoría, afina por tipo y gama, y guarda las fichas que quieres volver a consultar.";
      document.title =
        (c ? c.label : state.group || "El álbum") + " — Álbum Tecnológico";
    }
    function render() {
      var comparisonView = !!(state.cat || state.group);
      var candidates = scope().filter(function (p) {
        return (
          (!state.type || p.comparisonGroup === state.type) &&
          (!state.range || p.range === state.range) &&
          (!state.status || p.dataStatus === "verified")
        );
      });
      var items = ranked(
        candidates.filter(function (p) {
          return (
            (!state.brand || p.brand === state.brand) &&
            (!state.saved || U.isSaved(p.id)) &&
            TA.search.matches(p, state.q)
          );
        }),
      );
      var pairs = comparisonView ? S.comparisonPairs(items, candidates) : [];
      document.getElementById("catalogCount").textContent =
        (comparisonView
          ? pairs.length +
            (pairs.length === 1 ? " comparativa · " : " comparativas · ")
          : "") +
        items.length +
        (items.length === 1
          ? " ficha encontrada · "
          : " fichas encontradas · ") +
        items.filter(function (p) {
          return p.dataStatus === "verified";
        }).length +
        " con fuentes verificadas";
      host.classList.toggle("category-comparisons", comparisonView);
      document.body.dataset.catalogView = comparisonView ? "comparisons" : "products";
      if (comparisonView)
        TA.catalog.renderComparisons(host, pairs.slice(0, limit));
      else TA.catalog.renderInto(host, items.slice(0, limit));
      document.getElementById("comparisonFilterHint").hidden = !comparisonView;
      if (!items.length || (comparisonView && !pairs.length))
        host.innerHTML = U.empty(
          comparisonView && items.length
            ? "No hay una pareja con estos filtros"
            : state.saved
              ? "Aún no hay fichas guardadas aquí"
              : "No encontramos esas fichas",
          comparisonView && items.length
            ? "Amplía el tipo, la gama o el estado de la fuente para encontrar otra alternativa."
            : state.saved
              ? "Guarda una ficha con el marcador o amplía los filtros."
              : "Prueba otra búsqueda o restablece los filtros.",
          '<button class="btn" type="button" id="emptyReset">Restablecer filtros</button>',
        );
      var emptyReset = document.getElementById("emptyReset");
      if (emptyReset) emptyReset.addEventListener("click", reset);
      document.getElementById("loadMore").hidden =
        (comparisonView ? pairs.length : items.length) <= limit;
      document.getElementById("loadMore").textContent = comparisonView
        ? "Mostrar más comparativas"
        : "Mostrar más fichas";
      var labels = {
        q: "Búsqueda: " + state.q,
        type: type.selectedOptions[0].textContent,
        range: S.rangeLabel(state.range),
        brand: state.brand,
        status: "Fuentes verificadas",
        saved: "Mis guardados",
      };
      document.getElementById("filterChips").innerHTML = Object.keys(labels)
        .filter(function (key) {
          return !!state[key];
        })
        .map(function (key) {
          return (
            '<button class="filter-chip" type="button" data-clear-filter="' +
            key +
            '" aria-label="Quitar filtro: ' +
            esc(labels[key]) +
            '">' +
            esc(labels[key]) +
            U.icon("close") +
            "</button>"
          );
        })
        .join("");
      document.querySelectorAll("[data-clear-filter]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state[btn.dataset.clearFilter] = "";
          limit = 24;
          setup();
          render();
        });
      });
      updateUrl(state);
      try {
        sessionStorage.setItem("techalbum_catalog_query", location.search);
      } catch (e) {}
    }
    function read() {
      state.q = q.value;
      state.type = type.value;
      state.range = range.value;
      state.brand = brand.value;
      state.status = verified.checked ? "verified" : "";
      state.saved = saved.checked ? "1" : "";
      limit = 24;
      render();
      U.animate(host);
    }
    function reset() {
      ["q", "type", "range", "brand", "status", "saved"].forEach(
        function (key) {
          state[key] = "";
        },
      );
      limit = 24;
      setup();
      render();
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      read();
    });
    TA.search.bindLive(q, read);
    [type, range, brand, verified, saved].forEach(function (el) {
      el.addEventListener("change", read);
    });
    mobile.addEventListener("change", function () {
      state.cat = mobile.value;
      state.group = "";
      state.type = "";
      state.brand = "";
      limit = 24;
      setup();
      render();
    });
    document.getElementById("resetFilters").addEventListener("click", reset);
    document.getElementById("loadMore").addEventListener("click", function () {
      limit += 24;
      render();
    });
    window.addEventListener("techalbum:saved-change", function () {
      if (state.saved) render();
    });
    setup();
    render();
  }
  function phones() {
    var query = params(),
      active =
        ["baja", "media", "alta"].indexOf(query.get("range")) !== -1
          ? query.get("range")
          : "",
      q = document.getElementById("phoneQ"),
      archive = document.getElementById("phoneArchive");
    q.value = query.get("q") || "";
    archive.checked = query.get("archive") === "1";
    var ranges = [
      [
        "baja",
        "Lo esencial, bien resuelto.",
        "Opciones para comunicación, estudio y uso cotidiano.",
      ],
      [
        "media",
        "Más posibilidades para cada día.",
        "Pantalla, almacenamiento y funciones avanzadas en el segmento medio.",
      ],
      [
        "alta",
        "Para quienes buscan algo más.",
        "Propuestas premium con ecosistemas y características diferentes.",
      ],
    ];
    function render() {
      var list = ranked(
        S.products().filter(function (p) {
          return (
            p.category === "smartphones" &&
            (archive.checked || p.dataStatus === "verified") &&
            (!active || p.range === active) &&
            TA.search.matches(p, q.value)
          );
        }),
      );
      var host = document.getElementById("rangeSections");
      document.getElementById("phoneCount").textContent =
        list.length +
        " teléfonos en esta selección. Cada ficha identifica su imagen.";
      host.innerHTML = list.length
        ? ranges
            .filter(function (r) {
              return !active || r[0] === active;
            })
            .map(function (r) {
              var items = list.filter(function (p) {
                return p.range === r[0];
              });
              if (!items.length) return "";
              return (
                '<section class="phone-section"><div class="section-heading"><div><h2>' +
                r[1] +
                "</h2><p>" +
                r[2] +
                '</p></div><span class="badge">' +
                S.rangeLabel(r[0]) +
                " · " +
                items.length +
                ' fichas</span></div><div class="grid-products">' +
                items.map(TA.catalog.cardHTML).join("") +
                "</div></section>"
              );
            })
            .join("")
        : U.empty(
            "No encontramos esos teléfonos",
            "Prueba otra marca o incluye las fichas académicas anteriores.",
          );
      TA.catalog.bindCompareButtons(host);
      document.querySelectorAll("[data-range]").forEach(function (btn) {
        btn.setAttribute("aria-pressed", String(btn.dataset.range === active));
      });
      updateUrl({
        range: active,
        q: q.value,
        archive: archive.checked ? "1" : "",
      });
    }
    document.querySelectorAll("[data-range]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        active = btn.dataset.range;
        render();
        U.animate(document.getElementById("rangeSections"));
      });
    });
    TA.search.bindLive(q, render);
    archive.addEventListener("change", render);
    render();
  }
  function credit(p) {
    return p.imageCredit
      ? '<p class="detail-caption">Foto: <a href="' +
          esc(p.imageCredit.source) +
          '" target="_blank" rel="noopener noreferrer">' +
          esc(p.imageCredit.author) +
          '</a> · <a href="' +
          esc(p.imageCredit.licenseUrl) +
          '" target="_blank" rel="noopener noreferrer">' +
          esc(p.imageCredit.license) +
          "</a>. Miniatura sin retoque; color y configuración pueden variar.</p>"
      : "";
  }
  function detail() {
    var p = S.getById(params().get("id")),
      host = document.getElementById("detail");
    if (!p) {
      document.title = "Ficha no encontrada — Álbum Tecnológico";
      host.innerHTML = U.empty(
        "Esta ficha no está en el álbum.",
        "Revisa el enlace o busca un modelo desde el índice.",
        '<a class="btn" href="catalogo.html">Abrir el álbum</a>',
      );
      document.getElementById("relatedSection").hidden = true;
      return;
    }
    var c = S.categoryById(p.category),
      meta = S.comparisonMeta(p);
    document.title = name(p) + " — Álbum Tecnológico";
    document.getElementById("detailBreadcrumb").innerHTML =
      '<a href="catalogo.html">El álbum</a><span>/</span><a href="catalogo.html?group=' +
      encodeURIComponent(c.group) +
      '">' +
      esc(c.group) +
      '</a><span>/</span><a href="catalogo.html?cat=' +
      p.category +
      '">' +
      esc(c.label) +
      "</a><span>/</span><span>" +
      esc(S.rangeLabel(p.range)) +
      "</span>";
    var back = "?cat=" + encodeURIComponent(p.category);
    try {
      var previous = sessionStorage.getItem("techalbum_catalog_query");
      if (previous && /^\?[^#]*$/.test(previous)) back = previous;
    } catch (e) {}
    document.getElementById("backToAlbum").href = "catalogo.html" + back;
    var specs = Object.keys(p.specifications || {})
      .map(function (key) {
        var term = Object.keys(glossary).filter(function (g) {
          return (
            (key + " " + p.specifications[key])
              .toLowerCase()
              .indexOf(g.toLowerCase()) !== -1
          );
        })[0];
        return (
          '<div class="spec-row"><dt>' +
          esc(key) +
          (term
            ? ' <a class="spec-help" href="guia.html#term-' +
              term.toLowerCase() +
              '" aria-label="Qué significa ' +
              esc(term) +
              '">' +
              U.icon("info") +
              "</a>"
            : "") +
          "</dt><dd>" +
          esc(p.specifications[key]) +
          "</dd></div>"
        );
      })
      .join("");
    host.innerHTML =
      '<article class="detail"><div class="detail-media" data-kind="' +
      p.imageKind +
      '"><img src="' +
      esc(U.asset(p.image)) +
      '" data-cat="' +
      p.category +
      '" alt="Fotografía ' +
      (p.imageKind === "exact"
        ? "de " + esc(name(p))
        : "ilustrativa de la sección " + esc(c.label)) +
      '" width="800" height="533" onerror="TechAlbum.store.imgFallback(this)"><p class="detail-caption">' +
      (p.imageKind === "exact"
        ? "Fotografía del modelo."
        : "Fotografía ilustrativa. Consulta la fuente oficial para ver el modelo exacto.") +
      "</p>" +
      credit(p) +
      '</div><div class="detail-info"><div class="product-meta">' +
      U.status(p) +
      '<span class="badge">' +
      esc(S.rangeLabel(p.range)) +
      "</span>" +
      (p.releaseYear
        ? '<span class="badge">Lanzamiento: ' + p.releaseYear + "</span>"
        : "") +
      "</div><h1>" +
      esc(name(p)) +
      "</h1><p>" +
      esc(p.comparisonLabel) +
      " · " +
      esc((p.highlights || [])[0] || S.recommendedFor(p)) +
      '</p><div class="detail-price"><p class="product-price">' +
      esc(S.formatPrice(p.price)) +
      '<span class="price-caption">' +
      esc(U.priceCaption(p)) +
      '</span></p></div><div class="detail-actions"><a class="btn btn-primary" href="comparar.html?producto=' +
      p.id +
      '">' +
      U.icon("compare") +
      '<span>Ver comparativa</span></a><button class="btn" type="button" data-save="' +
      p.id +
      '" aria-pressed="' +
      U.isSaved(p.id) +
      '">' +
      U.icon("save") +
      'Guardar ficha</button></div><section class="detail-section"><h2>Antes de elegir.</h2><p>' +
      esc(p.reference) +
      "</p>" +
      (p.limitations
        ? "<ul>" +
          p.limitations
            .map(function (text) {
              return "<li>" + esc(text) + "</li>";
            })
            .join("") +
          "</ul>"
        : "<p>Esta ficha conserva datos demostrativos del proyecto académico. Confirma especificaciones, precio y disponibilidad con fuentes actuales.</p>") +
      '</section><section class="detail-section"><h2>Su ficha técnica.</h2><dl class="spec-list">' +
      specs +
      '</dl></section><section class="detail-section"><h2>Las fuentes de esta página.</h2><p>' +
      esc(
        p.dataStatus === "verified"
          ? "Revisión de especificaciones: " + U.date(p.verifiedAt)
          : "Especificaciones pendientes de verificación.",
      ) +
      "</p>" +
      (p.sources.length
        ? '<ul class="source-list">' +
          p.sources
            .map(function (source) {
              return (
                '<li><a href="' +
                esc(source.url) +
                '" target="_blank" rel="noopener noreferrer">' +
                esc(source.label) +
                U.icon("external") +
                "</a></li>"
              );
            })
            .join("") +
          "</ul>"
        : "<p>No se ha registrado una fuente oficial para esta ficha académica.</p>") +
      "<p>Grupo de comparación: " +
      esc(meta.type) +
      " · " +
      esc(S.rangeLabel(p.range)) +
      ".</p></section></div></article>";
    var compareButton = host.querySelector("[data-compare-btn]");
    if (compareButton && !S.hasAlternatives(p)) {
      compareButton.disabled = true;
      compareButton.querySelector("[data-compare-label]").textContent =
        "Solo consulta";
      compareButton.setAttribute("aria-describedby", "noAlternativeNote");
      host
        .querySelector(".detail-actions")
        .insertAdjacentHTML(
          "afterend",
          '<p id="noAlternativeNote">Aún no hay otra ficha del mismo tipo y gama. Puedes consultar sus especificaciones.</p>',
        );
    }
    TA.catalog.bindCompareButtons(host);
    var related = ranked(
      S.products().filter(function (x) {
        return x.id !== p.id && S.compatibleWith(p, x);
      }),
    ).slice(0, 3);
    TA.catalog.renderInto(document.getElementById("related"), related);
    if (!related.length)
      document.getElementById("relatedSection").hidden = true;
  }
  function compare() {
    TA.duel.init();
  }
  function guide() {
    var credits = document.getElementById("imageCredits");
    if (credits)
      credits.innerHTML = (window.TECHALBUM_DATA.IMAGE_CREDITS || [])
        .map(function (photo) {
          return (
            '<li><a href="' +
            esc(photo.source) +
            '" target="_blank" rel="noopener noreferrer">' +
            esc(photo.file) +
            "</a> · " +
            esc(photo.author) +
            ' · <a href="' +
            esc(photo.licenseUrl) +
            '" target="_blank" rel="noopener noreferrer">' +
            esc(photo.license) +
            "</a> · miniatura sin retoque.</li>"
          );
        })
        .join("");
    document.getElementById("glossary").innerHTML = Object.keys(glossary)
      .map(function (term) {
        return (
          '<details id="term-' +
          term.toLowerCase() +
          '"><summary>' +
          esc(term) +
          "</summary><p>" +
          esc(glossary[term]) +
          "</p></details>"
        );
      })
      .join("");
    var target = location.hash.slice(1),
      el = document.getElementById(target);
    if (el && el.tagName === "DETAILS") el.open = true;
  }
  function init() {
    var functions = {
      home: home,
      catalog: catalog,
      phones: phones,
      detail: detail,
      compare: compare,
      guide: guide,
    };
    var fn = functions[document.body.dataset.page];
    if (fn) fn();
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})(window.TechAlbum);
