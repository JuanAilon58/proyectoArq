/* Comportamiento compartido: navegación, tema, guardados y bandeja. */
(function () {
  "use strict";
  function ready(fn) {
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  ready(function () {
    var TA = window.TechAlbum,
      U = TA.ui;
    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      function sync() {
        var dark = document.body.dataset.theme === "dark";
        button.setAttribute("aria-pressed", String(dark));
        button.setAttribute(
          "aria-label",
          dark ? "Activar modo claro" : "Activar modo oscuro",
        );
        button.innerHTML = U.icon(dark ? "sun" : "moon");
      }
      sync();
      button.addEventListener("click", function () {
        var theme = document.body.dataset.theme === "dark" ? "light" : "dark";
        document.body.dataset.theme = theme;
        try {
          localStorage.setItem("album-tecnologico-theme", theme);
        } catch (e) {
          /* tema funciona en esta página */
        }
        sync();
      });
    });
    var menu = document.getElementById("menuToggle"),
      nav = document.getElementById("mainNav");
    menu.addEventListener("click", function () {
      var open = menu.getAttribute("aria-expanded") !== "true";
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute(
        "aria-label",
        open ? "Cerrar navegación" : "Abrir navegación",
      );
      nav.classList.toggle("is-open", open);
    });
    document.addEventListener("keydown", function (event) {
      if (
        event.key === "Escape" &&
        menu.getAttribute("aria-expanded") === "true"
      ) {
        menu.click();
        menu.focus();
      }
    });
    document.addEventListener("click", function (event) {
      if (
        menu.getAttribute("aria-expanded") === "true" &&
        !event.target.closest(".site-header")
      )
        menu.click();
    });
    function dock() {
      var el = document.getElementById("compareDock"),
        items = TA.comparator.list();
      el.hidden = !items.length || document.body.dataset.page === "compare";
      if (el.hidden) return;
      var info = TA.store.comparisonMeta(items[0]);
      el.innerHTML =
        '<div class="dock-copy"><strong>' +
        items.length +
        " de 2 productos seleccionados</strong><small>" +
        U.esc(info.subcategory + " · " + TA.store.rangeLabel(info.range)) +
        "</small></div>" +
        '<div class="dock-items">' +
        items
          .map(function (p) {
            return (
              '<div class="dock-item"><span>' +
              U.esc(p.model) +
              '</span><button type="button" data-dock-remove="' +
              p.id +
              '" aria-label="Quitar ' +
              U.esc(p.brand + " " + p.model) +
              '">' +
              U.icon("close") +
              "</button></div>"
            );
          })
          .join("") +
        "</div>" +
        '<button class="dock-clear" type="button" id="dockClear">Limpiar</button><a class="btn" href="' +
        U.page("comparar") +
        "?ids=" +
        items
          .map(function (p) {
            return p.id;
          })
          .join(",") +
        '">' +
        (items.length < 2 ? "Elegir otra ficha" : "Ver comparación") +
        U.icon("arrow") +
        "</a>";
      el.querySelectorAll("[data-dock-remove]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          TA.comparator.remove(btn.dataset.dockRemove);
        });
      });
      el.querySelector("#dockClear").addEventListener(
        "click",
        TA.comparator.clear,
      );
    }
    window.addEventListener("techalbum:compare-change", function () {
      dock();
      U.animate(document.querySelector(".dock-items"));
    });
    window.addEventListener("techalbum:compare-error", function (event) {
      var messages = {
        max: "La comparativa enfrenta dos productos. Cambia A o B para elegir otro.",
        incompatible:
          "Elige productos de la misma subcategoría. Los smartphones se comparan dentro de su gama.",
        "not-found": "No encontramos esa ficha. Vuelve al álbum y elige otra.",
        "no-alternative": "Todavía no hay otro producto en esta subcategoría.",
      };
      U.toast(messages[event.detail.reason] || "No se pudo añadir esa ficha.");
    });
    window.addEventListener("storage", function () {
      dock();
      TA.comparator.updatePill();
      TA.comparator.refreshButtons();
      U.refreshSaved();
    });
    TA.comparator.updatePill();
    dock();
    TA.catalog.bindCompareButtons(document);
  });
})();
