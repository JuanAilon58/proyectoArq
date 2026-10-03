/* TechAlbum — js/app.js | Inicialización general (nav, contadores) */
(function () {
  "use strict";
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    // Tema persistente: usa la preferencia guardada o la del sistema la primera vez.
    function applyTheme(theme) {
      document.body.setAttribute("data-theme", theme);
      document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
        var light = theme === "light";
        button.setAttribute("aria-pressed", light ? "true" : "false");
        button.setAttribute("aria-label", light ? "Activar modo oscuro" : "Activar modo claro");
        var icon = button.querySelector("[aria-hidden='true']");
        var label = button.querySelector(".theme-label");
        if (icon) icon.textContent = light ? "☾" : "☀";
        if (label) label.textContent = light ? "Modo oscuro" : "Modo claro";
      });
    }
    try {
      var savedTheme = localStorage.getItem("album-tecnologico-theme");
      var initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      applyTheme(initialTheme);
      document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
        button.addEventListener("click", function () {
          var next = document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
          localStorage.setItem("album-tecnologico-theme", next);
          applyTheme(next);
        });
      });
    } catch (e) { applyTheme("dark"); }

    if (window.TechAlbum && TechAlbum.comparator) {
      TechAlbum.comparator.updatePill();
      TechAlbum.comparator.refreshButtons();
      TechAlbum.catalog.bindCompareButtons(document);
    }
    // Marca la página activa en la navegación.
    try {
      var page = (location.pathname.split("/").pop() || "index.html").split("?")[0];
      document.querySelectorAll(".main-nav a").forEach(function (a) {
        var href = (a.getAttribute("href") || "").split("?")[0].split("/").pop();
        if (href === page || (page === "" && href === "index.html")) a.setAttribute("aria-current", "page");
      });
    } catch (e) { /* navegación estática */ }

    // Revela las secciones al entrar en el viewport sin ocultar contenido
    // cuando JavaScript no está disponible.
    try {
      var revealItems = document.querySelectorAll("[data-reveal]");
      if (revealItems.length && "IntersectionObserver" in window &&
          window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
        document.documentElement.classList.add("has-motion");
        var revealObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        }, { threshold: .12, rootMargin: "0px 0px -20px" });
        revealItems.forEach(function (item) { revealObserver.observe(item); });
      } else {
        revealItems.forEach(function (item) { item.classList.add("is-visible"); });
      }
    } catch (e) { /* el contenido se conserva visible */ }

    // Los CTA principales responden suavemente a la cercanía del cursor.
    try {
      if (window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) {
        document.querySelectorAll(".magnetic").forEach(function (button) {
          button.addEventListener("pointermove", function (event) {
            var box = button.getBoundingClientRect();
            var x = (event.clientX - box.left - box.width / 2) / box.width;
            var y = (event.clientY - box.top - box.height / 2) / box.height;
            button.style.transform = "translate(" + (x * 9).toFixed(1) + "px, " + (y * 7).toFixed(1) + "px)";
          });
          button.addEventListener("pointerleave", function () { button.style.transform = ""; });
        });
      }
    } catch (e) { /* el enlace funciona sin el efecto magnético */ }

    // Movimiento sutil de las imágenes con puntero. Se desactiva para
    // usuarios que prefieren menos movimiento y no se usa en pantallas táctiles.
    try {
      if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
      document.addEventListener("pointerover", function (event) {
        var media = event.target.closest && event.target.closest(".product-media, .cat-orbit, .audience-image");
        if (media) media.classList.add("is-tilting");
      });
      document.addEventListener("pointerout", function (event) {
        var media = event.target.closest && event.target.closest(".product-media, .cat-orbit, .audience-image");
        if (media && !media.contains(event.relatedTarget)) {
          media.classList.remove("is-tilting");
          media.style.removeProperty("--tilt-x");
          media.style.removeProperty("--tilt-y");
        }
      });
      document.addEventListener("pointermove", function (event) {
        var media = event.target.closest && event.target.closest(".product-media, .cat-orbit, .audience-image");
        if (!media) return;
        var box = media.getBoundingClientRect();
        var x = ((event.clientX - box.left) / box.width - .5) * 2;
        var y = ((event.clientY - box.top) / box.height - .5) * 2;
        media.style.setProperty("--tilt-x", (x * 2.5).toFixed(2) + "deg");
        media.style.setProperty("--tilt-y", (y * -2.5).toFixed(2) + "deg");
      });
    } catch (e) { /* la experiencia principal no depende del movimiento */ }
  });
})();
