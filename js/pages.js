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
        ? c.label
        : state.group || "Abre una nueva sección.";
      document.getElementById("catalogDescription").textContent = c
        ? c.desc
        : "Explora por categoría, afina por tipo y gama, y guarda las fichas que quieres volver a consultar.";
      document.title =
        (c ? c.label : state.group || "El álbum") + " — Álbum Tecnológico";
    }
    function render() {
      var items = ranked(
        scope().filter(function (p) {
          return (
            (!state.type || p.comparisonGroup === state.type) &&
            (!state.range || p.range === state.range) &&
            (!state.brand || p.brand === state.brand) &&
            (!state.status || p.dataStatus === "verified") &&
            (!state.saved || U.isSaved(p.id)) &&
            TA.search.matches(p, state.q)
          );
        }),
      );
      document.getElementById("catalogCount").textContent =
        items.length +
        " fichas · " +
        items.filter(function (p) {
          return p.dataStatus === "verified";
        }).length +
        " con fuentes verificadas";
      TA.catalog.renderInto(host, items.slice(0, limit));
      if (!items.length)
        host.innerHTML = U.empty(
          state.saved
            ? "Aún no hay fichas guardadas aquí"
            : "No encontramos esas fichas",
          state.saved
            ? "Guarda una ficha con el marcador o amplía los filtros."
            : "Prueba otra búsqueda o restablece los filtros.",
          '<button class="btn" type="button" id="emptyReset">Restablecer filtros</button>',
        );
      var emptyReset = document.getElementById("emptyReset");
      if (emptyReset) emptyReset.addEventListener("click", reset);
      document.getElementById("loadMore").hidden = items.length <= limit;
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
      '</span></p></div><div class="detail-actions"><button class="btn btn-primary" type="button" data-compare-btn="' +
      p.id +
      '" aria-pressed="false">' +
      U.icon("compare") +
      '<span data-compare-label>Comparar</span></button><button class="btn" type="button" data-save="' +
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
    if (!S.hasAlternatives(p)) {
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
    var q = document.getElementById("addQ"),
      select = document.getElementById("addSelect"),
      priority = "",
      onlyDifferences = false;
    function fill() {
      var current = TA.comparator.list(),
        items = ranked(
          S.products().filter(function (p) {
            return (
              S.hasAlternatives(p) &&
              !TA.comparator.contains(p.id) &&
              (!current.length || S.compatibleWith(current[0], p)) &&
              TA.search.matches(p, q.value)
            );
          }),
        );
      select.innerHTML = items.length
        ? items
            .map(function (p) {
              return option(p.id, name(p) + " · " + S.rangeLabel(p.range));
            })
            .join("")
        : option("", "No hay más fichas compatibles");
      document.getElementById("addBtn").disabled =
        !items.length || current.length >= 3;
    }
    function render() {
      var items = TA.comparator.list(),
        meta = items.length ? S.comparisonMeta(items[0]) : null;
      document.getElementById("trayCount").textContent = items.length + "/3";
      document.getElementById("comparisonContext").textContent = meta
        ? meta.category +
          " / " +
          meta.subcategory +
          " / " +
          meta.type +
          " / " +
          S.rangeLabel(meta.range)
        : "El primer producto define el tipo y la gama de la comparación.";
      document.getElementById("tray").innerHTML =
        items
          .map(function (p) {
            return (
              '<article class="tray-slot"><img src="' +
              esc(U.asset(p.image)) +
              '" data-cat="' +
              p.category +
              '" alt="" width="66" height="78" onerror="TechAlbum.store.imgFallback(this)"><div><h3><a href="producto.html?id=' +
              p.id +
              '">' +
              esc(name(p)) +
              "</a></h3><p>" +
              esc(S.formatPrice(p.price)) +
              "</p>" +
              U.status(p) +
              '</div><button class="tray-remove" type="button" data-remove="' +
              p.id +
              '" aria-label="Quitar ' +
              esc(name(p)) +
              '">' +
              U.icon("close") +
              "</button></article>"
            );
          })
          .join("") +
        Array.from({ length: 3 - items.length }, function () {
          return '<div class="tray-slot empty-slot">Un espacio para otra opción.</div>';
        }).join("");
      document.querySelectorAll("[data-remove]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          TA.comparator.remove(btn.dataset.remove);
        });
      });
      fill();
      renderResults(items);
    }
    function renderResults(items) {
      var zone = document.getElementById("compareZone"),
        verdict = document.getElementById("verdictZone");
      if (items.length < 2) {
        zone.innerHTML = U.empty(
          "La comparación empieza con dos fichas.",
          "Añade otra opción compatible o elige una comparación sugerida.",
        );
        verdict.innerHTML = "";
        return;
      }
      var keys = [],
        seen = {};
      items.forEach(function (p) {
        Object.keys(p.specifications || {}).forEach(function (key) {
          if (!seen[key]) {
            seen[key] = true;
            keys.push(key);
          }
        });
      });
      var differences = 0,
        rows = keys
          .map(function (key) {
            var values = items.map(function (p) {
                return (p.specifications || {})[key] || "Sin dato";
              }),
              different = values.some(function (v) {
                return v !== values[0];
              });
            if (different) differences++;
            if (onlyDifferences && !different) return "";
            return (
              "<tr" +
              (different ? ' class="spec-different"' : "") +
              '><th scope="row">' +
              esc(key) +
              "</th>" +
              values
                .map(function (v) {
                  return "<td>" + esc(v) + "</td>";
                })
                .join("") +
              "</tr>"
            );
          })
          .join("");
      zone.innerHTML =
        '<div class="section-heading"><div><h2 id="resultTitle">Lo que cambia entre tus opciones.</h2><p>' +
        differences +
        ' características con diferencias. «Sin dato» indica que falta información.</p></div></div><div class="compare-actions"><label class="check-label"><input type="checkbox" id="onlyDifferences"' +
        (onlyDifferences ? " checked" : "") +
        '>Mostrar solo diferencias</label><button class="text-button" type="button" id="shareCompare">Copiar enlace</button><button class="text-button" type="button" id="printCompare">Imprimir comparación</button></div><p class="table-hint">' +
        U.icon("arrow") +
        'Desliza la tabla para ver todas las fichas.</p><div class="table-wrap" role="region" aria-label="Tabla comparativa, desplázate horizontalmente en pantallas pequeñas" tabindex="0"><table class="compare"><caption class="visually-hidden">Comparación de ' +
        items
          .map(function (p) {
            return esc(name(p));
          })
          .join(", ") +
        '</caption><thead><tr><th scope="col">Característica</th>' +
        items
          .map(function (p) {
            return (
              '<th scope="col"><a href="producto.html?id=' +
              p.id +
              '">' +
              esc(name(p)) +
              "</a></th>"
            );
          })
          .join("") +
        "</tr></thead><tbody>" +
        rows +
        '<tr><th scope="row">Precio de referencia</th>' +
        items
          .map(function (p) {
            return (
              "<td>" +
              esc(S.formatPrice(p.price)) +
              '<span class="price-caption">' +
              esc(U.priceCaption(p)) +
              "</span></td>"
            );
          })
          .join("") +
        '</tr><tr><th scope="row">Revisión de fuentes</th>' +
        items
          .map(function (p) {
            return (
              "<td>" +
              esc(
                p.dataStatus === "verified"
                  ? U.date(p.verifiedAt)
                  : "Pendiente de verificación",
              ) +
              "</td>"
            );
          })
          .join("") +
        '</tr></tbody></table></div><div id="shareFallback" hidden class="share-fallback"></div>';
      document
        .getElementById("onlyDifferences")
        .addEventListener("change", function (e) {
          onlyDifferences = e.target.checked;
          renderResults(items);
          document.getElementById("onlyDifferences").focus();
        });
      document
        .getElementById("printCompare")
        .addEventListener("click", function () {
          window.print();
        });
      document
        .getElementById("shareCompare")
        .addEventListener("click", function () {
          var link = TA.comparator.shareUrl();
          if (navigator.clipboard && window.isSecureContext)
            navigator.clipboard
              .writeText(link)
              .then(function () {
                U.toast("Enlace de comparación copiado.");
              })
              .catch(function () {
                fallback(link);
              });
          else fallback(link);
        });
      function fallback(link) {
        var el = document.getElementById("shareFallback");
        el.hidden = false;
        el.innerHTML =
          'Copia este enlace: <a href="' +
          esc(link) +
          '">' +
          esc(link) +
          "</a>";
      }
      var rec = TA.recommendation.recommend(items, priority);
      if (
        priority &&
        !rec.criteria.some(function (c) {
          return c.key === priority;
        })
      )
        priority = "";
      verdict.innerHTML =
        '<section class="verdict" aria-label="Conclusión de la comparación"><h2>' +
        esc(rec.headline) +
        "</h2><p>" +
        esc(rec.verdict) +
        "</p>" +
        (rec.criteria.length
          ? '<div class="field" style="margin-top:24px;max-width:360px"><label for="prioritySelect">¿Qué quieres priorizar?</label><select id="prioritySelect">' +
            option("", "Revisar todas las diferencias") +
            rec.criteria
              .map(function (c) {
                return option(c.key, c.label);
              })
              .join("") +
            "</select></div>"
          : "") +
        '<div class="verdict-facts">' +
        rec.rows
          .map(function (row) {
            return (
              "<div><h3>" +
              esc(row.product.brand) +
              " " +
              esc(row.product.model) +
              "</h3><ul>" +
              (row.advantages.length
                ? row.advantages
                : [
                    "Revisa sus características en la tabla. No hay una ventaja cuantitativa única documentada para este conjunto.",
                  ]
              )
                .map(function (text) {
                  return "<li>" + esc(text) + "</li>";
                })
                .join("") +
              "</ul></div>"
            );
          })
          .join("") +
        "</div>" +
        rec.limitations
          .map(function (text) {
            return "<p>" + esc(text) + "</p>";
          })
          .join("") +
        "</section>";
      var chooser = document.getElementById("prioritySelect");
      if (chooser) {
        chooser.value = priority;
        chooser.addEventListener("change", function () {
          priority = chooser.value;
          renderResults(items);
          document.getElementById("prioritySelect").focus();
        });
      }
    }
    function pairs() {
      var groups = {};
      ranked(
        S.products().filter(function (p) {
          return p.dataStatus === "verified";
        }),
      ).forEach(function (p) {
        var key = S.comparisonMeta(p).key;
        if (key) (groups[key] || (groups[key] = [])).push(p);
      });
      var choices = Object.keys(groups)
        .map(function (key) {
          var all = groups[key],
            first = all[0],
            other = all.filter(function (p) {
              return p.brand !== first.brand;
            })[0];
          return other ? [first, other] : [];
        })
        .filter(function (items) {
          return items.length >= 2;
        })
        .slice(0, 12);
      document.getElementById("suggestedPairs").innerHTML = choices
        .map(function (items) {
          var meta = S.comparisonMeta(items[0]);
          return (
            '<button class="pair-option" type="button" data-pair="' +
            items
              .map(function (p) {
                return p.id;
              })
              .join(",") +
            '"><span>' +
            esc(meta.subcategory + " · " + S.rangeLabel(meta.range)) +
            "</span><strong>" +
            esc(items[0].brand + " / " + items[1].brand) +
            "</strong><small>" +
            esc(
              items
                .map(function (p) {
                  return p.model;
                })
                .join(" · "),
            ) +
            "</small></button>"
          );
        })
        .join("");
      document.querySelectorAll("[data-pair]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          priority = "";
          TA.comparator.replace(btn.dataset.pair.split(","));
          document
            .getElementById("selectionTitle")
            .scrollIntoView({ block: "start" });
          U.animate(document.getElementById("tray"));
        });
      });
    }
    document
      .getElementById("compareForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        var result = TA.comparator.add(select.value);
        if (!result.ok)
          window.dispatchEvent(
            new CustomEvent("techalbum:compare-error", { detail: result }),
          );
      });
    document.getElementById("clearTray").addEventListener("click", function () {
      priority = "";
      TA.comparator.clear();
    });
    TA.search.bindLive(q, fill);
    window.addEventListener("techalbum:compare-change", render);
    var imported = TA.comparator.importFromUrl(location.search);
    if (!imported.ok)
      U.toast(
        "El enlace incluía fichas incompatibles o ausentes. Conservamos solo las opciones válidas.",
      );
    pairs();
    render();
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
