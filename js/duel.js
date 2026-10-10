window.TechAlbum = window.TechAlbum || {};
(function (TA) {
  "use strict";
  var S = TA.store,
    U = TA.ui,
    esc = U.esc,
    M = TA.duelModel;
  function fullName(p) {
    return p.brand + " " + p.model;
  }
  function option(value, label) {
    return '<option value="' + esc(value) + '">' + esc(label) + "</option>";
  }
  function init() {
    var category = document.getElementById("duelCategory"),
      range = document.getElementById("duelRange"),
      first = document.getElementById("productA"),
      second = document.getElementById("productB"),
      search = document.getElementById("duelSearch"),
      priority = "",
      differences = false,
      rendering = false;
    var categories = S.categories();
    category.innerHTML = categories
      .map(function (c) {
        return option(c.id, c.group + " / " + c.label);
      })
      .join("");
    function allInCategory() {
      return S.products()
        .filter(function (p) {
          return (
            p.category === category.value &&
            (p.category !== "smartphones" || p.range === range.value)
          );
        })
        .sort(function (a, b) {
          return (
            (b.dataStatus === "verified") - (a.dataStatus === "verified") ||
            (b.releaseYear || 0) - (a.releaseYear || 0) ||
            a.id - b.id
          );
        });
    }
    function fillSelectors(items) {
      category.value = items[0].category;
      range.value = items[0].range;
      document.getElementById("duelRangeField").hidden =
        category.value !== "smartphones";
      var pool = allInCategory();
      first.innerHTML = pool
        .map(function (p) {
          return option(p.id, fullName(p));
        })
        .join("");
      first.value = items[0].id;
      second.innerHTML = S.alternatives(items[0])
        .map(function (p) {
          return option(p.id, fullName(p));
        })
        .join("");
      second.value = items[1].id;
      document.getElementById("duelPoolCount").textContent =
        pool.length +
        " productos disponibles en esta sección. Puedes cambiar A y B.";
    }
    function setPair(ids, reset) {
      if (reset) priority = "";
      TA.comparator.replace(ids);
    }
    function card(p, index) {
      var exact = p.imageKind === "exact",
        credit = p.imageCredit;
      return (
        '<article class="duel-card side-' +
        index +
        '" aria-label="Producto ' +
        (index ? "B" : "A") +
        '"><div class="duel-photo">' +
        '<span class="duel-product-tag">Producto ' +
        (index ? "B" : "A") +
        '</span><img src="' +
        esc(U.asset(p.image)) +
        '" alt="' +
        esc(
          exact
            ? fullName(p)
            : "Imagen ilustrativa de la sección; no representa " + fullName(p),
        ) +
        '" width="800" height="800" data-cat="' +
        esc(p.category) +
        '" onerror="TechAlbum.store.imgFallback(this)">' +
        '<span class="duel-photo-label">' +
        (exact
          ? "Foto del modelo"
          : "Imagen ilustrativa · no representa el modelo") +
        "</span></div>" +
        '<div class="duel-card-info"><span class="duel-brand">' +
        esc(p.brand) +
        '</span><h2><a href="producto.html?id=' +
        p.id +
        '">' +
        esc(p.model) +
        "</a></h2>" +
        '<p class="duel-price">' +
        esc(S.formatPrice(p.price)) +
        (p.price !== null ? " <span>GTQ</span>" : "") +
        '</p><p class="duel-price-note">' +
        esc(U.priceCaption(p)) +
        "</p></div>" +
        '<div class="duel-card-foot">' +
        U.status(p) +
        '<a href="producto.html?id=' +
        p.id +
        '">Ficha y fuentes ' +
        U.icon("external") +
        "</a>" +
        (credit
          ? '<small>Imagen: <a href="' +
            esc(credit.source) +
            '" target="_blank" rel="noopener noreferrer">' +
            esc(credit.author) +
            "</a></small>"
          : "") +
        "</div></article>"
      );
    }
    function results(items) {
      var evaluated = M.rows(items),
        summary = M.summary(items, evaluated, priority),
        cat = S.categoryById(items[0].category);
      var sameType = items[0].comparisonGroup === items[1].comparisonGroup;
      document.getElementById("duelTitle").textContent = sameType
        ? items[0].comparisonLabel
        : cat.label;
      document.getElementById("duelGroup").textContent = cat.group;
      document.getElementById("duelIds").textContent =
        "#" +
        String(items[0].id).padStart(3, "0") +
        " / #" +
        String(items[1].id).padStart(3, "0");
      document.getElementById("duelDescription").textContent =
        cat.id === "cables" &&
        sameType &&
        items[0].comparisonGroup === "sata-cable"
          ? "Cables de datos para conectar unidades HDD y SSD SATA a la placa base. Compara longitud, conectores y funciones de cada opción."
          : cat.desc;
      document.getElementById("duelBack").href =
        "catalogo.html?cat=" + encodeURIComponent(cat.id);
      document.title =
        document.getElementById("duelTitle").textContent +
        " · Comparativa — Álbum Tecnológico";
      document.getElementById("duelCards").innerHTML =
        card(items[0], 0) +
        '<div class="duel-versus" aria-label="frente a">VS</div>' +
        card(items[1], 1);
      var count = function (index) {
        return (
          '<div class="side-' +
          index +
          '"><span class="duel-brand">' +
          esc(items[index].brand) +
          "</span><strong>" +
          summary.counts[index] +
          " " +
          (summary.counts[index] === 1 ? "ventaja" : "ventajas") +
          "</strong></div>"
        );
      };
      document.getElementById("duelSummary").innerHTML =
        count(0) +
        "<h2>" +
        U.icon("table") +
        "Especificaciones</h2>" +
        count(1);
      document.getElementById("duelLegend").innerHTML =
        '<span><i class="duel-dot side-0"></i>Ventaja A</span><span><i class="duel-dot side-1"></i>Ventaja B</span><span><i class="duel-dot equal"></i>Iguales</span><span><i class="duel-dot different"></i>Diferencia sin ganador</span><span><i class="duel-dot missing"></i>Sin dato</span>';
      var rowHTML = evaluated
        .filter(function (row) {
          return !differences || row.price || row.state !== "equal";
        })
        .map(function (row) {
          var stateText =
            row.best !== null
              ? "Ventaja del producto " + (row.best ? "B" : "A")
              : row.state === "equal"
                ? "Mismo valor"
                : row.state === "missing"
                  ? "Información incompleta"
                  : "Diferencia sin ganador";
          return (
            '<tr><th scope="row">' +
            esc(row.label) +
            "</th>" +
            row.values
              .map(function (value, index) {
                var best = row.best === index;
                return (
                  "<td" +
                  (best ? ' class="duel-best"' : "") +
                  '><span class="duel-value">' +
                  esc(value) +
                  "</span>" +
                  (row.price
                    ? "<small>" + esc(U.priceCaption(items[index])) + "</small>"
                    : "") +
                  (best
                    ? "<small>" +
                      U.icon("check") +
                      "Ventaja " +
                      (index ? "B" : "A") +
                      "</small>"
                    : "") +
                  "</td>"
                );
              })
              .join("") +
            '<td class="duel-row-state"><span class="duel-dot ' +
            (row.best !== null ? "side-" + row.best : row.state) +
            '" title="' +
            esc(stateText + (row.note ? ". " + row.note : "")) +
            '"></span><span class="visually-hidden">' +
            esc(stateText) +
            "</span></td></tr>"
          );
        })
        .join("");
      document.getElementById("duelTable").innerHTML =
        '<caption class="visually-hidden">Comparativa de ' +
        esc(fullName(items[0])) +
        " y " +
        esc(fullName(items[1])) +
        "</caption>" +
        '<colgroup><col class="duel-label-col"><col><col><col class="duel-state-col"></colgroup><thead><tr><th scope="col">Característica</th><th scope="col"><span class="side-0">A</span> · ' +
        esc(items[0].brand) +
        '</th><th scope="col"><span class="side-1">B</span> · ' +
        esc(items[1].brand) +
        '</th><th scope="col"><span class="visually-hidden">Resultado</span></th></tr></thead><tbody>' +
        rowHTML +
        "</tbody>";
      var priorities = evaluated.filter(function (row) {
        return row.best !== null;
      });
      var chooser = priorities.length
        ? '<div class="duel-priority"><label for="duelPriority">Priorizar un criterio</label><select id="duelPriority">' +
          option("", "Ver todas las ventajas") +
          priorities
            .map(function (row) {
              return option(row.key, row.label);
            })
            .join("") +
          "</select></div>"
        : "";
      var evidence = evaluated
        .filter(function (row) {
          return row.best !== null;
        })
        .map(function (row) {
          return (
            "<li><strong>" +
            esc(row.label) +
            ":</strong> " +
            esc(row.note) +
            "</li>"
          );
        })
        .join("");
      document.getElementById("duelVerdict").innerHTML =
        '<section class="duel-verdict" aria-labelledby="verdictTitle"><span class="duel-trophy">' +
        U.icon("trophy") +
        '</span><div><h2 id="verdictTitle">Recomendación final</h2><p class="duel-verdict-headline">' +
        esc(summary.headline) +
        "</p><h3>Veredicto</h3><p>" +
        esc(summary.context) +
        '</p><p class="duel-caveat">' +
        esc(summary.caveat) +
        "</p>" +
        chooser +
        '<div class="duel-fit-grid">' +
        items
          .map(function (p, index) {
            return (
              '<div><h3 class="side-' +
              index +
              '">Elige ' +
              (index ? "B" : "A") +
              " si buscas</h3><p>" +
              esc(
                (p.highlights || []).slice(0, 2).join(". ") ||
                  S.recommendedFor(p),
              ) +
              ".</p></div>"
            );
          })
          .join("") +
        "</div>" +
        (evidence
          ? '<details class="duel-method"><summary>Cómo contamos las ventajas</summary><p>Cada ventaja corresponde a una fila resaltada. El conteo no es un puntaje de calidad. Longitud, color, GHz, megapíxeles y mAh no se califican como mejores por tener una cifra mayor.</p><ul>' +
            evidence +
            "</ul></details>"
          : "") +
        "</div></section>";
      var prioritySelect = document.getElementById("duelPriority");
      if (prioritySelect) {
        prioritySelect.value = priority;
        prioritySelect.addEventListener("change", function () {
          priority = prioritySelect.value;
          results(items);
          document.getElementById("duelPriority").focus();
        });
      }
      document.getElementById("duelLive").textContent =
        "Comparativa de " +
        fullName(items[0]) +
        " frente a " +
        fullName(items[1]) +
        ".";
    }
    function render() {
      if (rendering) return;
      var items = TA.comparator.list();
      if (items.length < 2) {
        var seed = items[0] || S.getById(69) || S.products()[0];
        rendering = true;
        TA.comparator.replace(S.comparisonIds(seed));
        rendering = false;
        items = TA.comparator.list();
      }
      if (items.length !== 2) {
        document.getElementById("duelCards").innerHTML = U.empty(
          "Falta otra opción en esta sección",
          "Abre el catálogo para elegir una subcategoría con dos productos.",
        );
        return;
      }
      fillSelectors(items);
      results(items);
      try {
        history.replaceState(
          null,
          "",
          location.pathname +
            "?ids=" +
            items
              .map(function (p) {
                return p.id;
              })
              .join(","),
        );
      } catch (e) {}
    }
    function chooseCategory() {
      var pool = allInCategory();
      if (pool.length) setPair(S.comparisonIds(pool[0]), true);
    }
    category.addEventListener("change", chooseCategory);
    range.addEventListener("change", chooseCategory);
    first.addEventListener("change", function () {
      var p = S.getById(first.value),
        current = S.getById(second.value);
      setPair(
        current && current.id !== p.id && S.compatibleWith(p, current)
          ? [p.id, current.id]
          : S.comparisonIds(p),
        true,
      );
    });
    second.addEventListener("change", function () {
      setPair([first.value, second.value], true);
    });
    document.getElementById("swapDuel").addEventListener("click", function () {
      setPair(
        TA.comparator
          .list()
          .map(function (p) {
            return p.id;
          })
          .reverse(),
        false,
      );
    });
    document
      .getElementById("duelDifferences")
      .addEventListener("change", function (e) {
        differences = e.target.checked;
        results(TA.comparator.list());
      });
    document.getElementById("printDuel").addEventListener("click", function () {
      window.print();
    });
    document.getElementById("shareDuel").addEventListener("click", function () {
      var url = TA.comparator.shareUrl();
      function fallback() {
        var el = document.getElementById("duelShareFallback");
        el.hidden = false;
        el.innerHTML =
          '<label for="duelShareUrl">Copia este enlace</label><input id="duelShareUrl" readonly value="' +
          esc(url) +
          '">';
      }
      if (navigator.clipboard && window.isSecureContext)
        navigator.clipboard
          .writeText(url)
          .then(function () {
            U.toast("Enlace de comparativa copiado.");
          })
          .catch(fallback);
      else fallback();
    });
    function directory() {
      var matching = S.products().filter(function (p) {
        return TA.search.matches(p, search.value);
      });
      document.getElementById("duelDirectory").innerHTML =
        categories
          .map(function (c) {
            var products = matching.filter(function (p) {
              return p.category === c.id;
            });
            if (!products.length) return "";
            return (
              '<details class="duel-directory-group"' +
              (search.value ? " open" : "") +
              "><summary>" +
              esc(c.label) +
              "<span>" +
              products.length +
              " productos</span></summary><ul>" +
              products
                .map(function (p) {
                  return (
                    '<li><a href="comparar.html?producto=' +
                    p.id +
                    '"><span>' +
                    esc(fullName(p)) +
                    "</span><small>" +
                    esc(p.comparisonLabel + " · " + S.rangeLabel(p.range)) +
                    "</small>" +
                    U.icon("arrow") +
                    "</a></li>"
                  );
                })
                .join("") +
              "</ul></details>"
            );
          })
          .join("") ||
        U.empty(
          "No encontramos productos",
          "Busca una marca, modelo o subcategoría.",
        );
      document.getElementById("duelDirectoryCount").textContent =
        matching.length +
        " productos / " +
        categories.filter(function (c) {
          return matching.some(function (p) {
            return p.category === c.id;
          });
        }).length +
        " subcategorías";
    }
    TA.search.bindLive(search, directory);
    var query = new URLSearchParams(location.search),
      targetCategory = query.get("cat");
    var imported = TA.comparator.importFromUrl(location.search);
    if (!imported.ok)
      U.toast(
        "El enlace incluía productos ausentes o de otra subcategoría. Se muestra una pareja disponible.",
      );
    if (
      targetCategory &&
      S.products().some(function (p) {
        return p.category === targetCategory;
      })
    )
      TA.comparator.replace(
        S.comparisonIds(
          S.products().filter(function (p) {
            return p.category === targetCategory;
          })[0],
        ),
      );
    window.addEventListener("techalbum:compare-change", render);
    render();
    directory();
  }
  TA.duel = { init: init };
})(window.TechAlbum);
