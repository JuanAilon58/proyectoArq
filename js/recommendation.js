/* Conclusiones por criterio con evidencia, sin puntajes inventados. */
window.TechAlbum = window.TechAlbum || {};
(function (TA) {
  "use strict";
  var DEFINITIONS = {
    smartphones: [
      {
        key: "refreshHz",
        label: "Frecuencia de pantalla",
        unit: "Hz",
        direction: "max",
        note: "Una frecuencia máxima mayor puede dar más fluidez. No mide rendimiento ni calidad de imagen.",
      },
      {
        key: "storageGB",
        label: "Almacenamiento",
        unit: "GB",
        direction: "max",
        note: "Más capacidad permite guardar más archivos. No mide la velocidad del almacenamiento.",
      },
      {
        key: "weightG",
        label: "Peso",
        unit: "g",
        direction: "min",
        note: "Menor peso puede resultar más cómodo al llevarlo. El tamaño también importa.",
      },
    ],
    graficas: [
      {
        key: "vramGB",
        label: "Memoria de video",
        unit: "GB",
        direction: "max",
        note: "Más VRAM puede ayudar con texturas y proyectos grandes. No implica más FPS.",
      },
    ],
    tablets: [
      {
        key: "storageGB",
        label: "Almacenamiento",
        unit: "GB",
        direction: "max",
        note: "Compara la misma variante. La capacidad no sustituye una evaluación de las aplicaciones.",
      },
    ],
    laptops: [
      {
        key: "weightG",
        label: "Peso",
        unit: "g",
        direction: "min",
        note: "Menor peso facilita el transporte; verifica batería, puertos y compatibilidad.",
      },
    ],
    almacenamiento: [
      {
        key: "storageGB",
        label: "Capacidad",
        unit: "GB",
        direction: "max",
        note: "La capacidad no determina la velocidad ni la durabilidad.",
      },
    ],
    monitores: [
      {
        key: "refreshHz",
        label: "Frecuencia de pantalla",
        unit: "Hz",
        direction: "max",
        note: "La fluidez depende también del equipo y de la aplicación.",
      },
    ],
  };
  var CONTEXT = {
    procesadores:
      "Para recomendar una CPU por rendimiento hacen falta pruebas de la misma tarea y configuración. Los núcleos y GHz de arquitecturas distintas no bastan. Revisa además socket, memoria y refrigeración.",
    graficas:
      "Para elegir una GPU por rendimiento, contrasta FPS medidos en el mismo juego, resolución y ajustes, separando resultados nativos de generación de cuadros.",
    smartphones:
      "Elige por pantalla, almacenamiento, soporte y ecosistema. La capacidad en mAh no equivale a autonomía medida, y los megapíxeles no establecen la calidad de la cámara.",
    laptops:
      "Antes de elegir, confirma la compatibilidad de tus aplicaciones con el sistema y la arquitectura, así como memoria, puertos y pruebas de autonomía comparables.",
    tablets:
      "Revisa aplicaciones, lápiz y teclado compatibles. El sistema operativo y los accesorios pueden pesar más que una sola especificación.",
    audifonos:
      "Compara comodidad, conectividad y pruebas de cancelación de ruido. Las horas declaradas por fabricantes distintos pueden usar condiciones diferentes.",
  };
  function recommend(items, priority) {
    if (!items || items.length < 2) return null;
    if (
      !items.every(function (p) {
        return TA.store.compatibleWith(items[0], p);
      })
    )
      return {
        winner: null,
        rows: [],
        criteria: [],
        reasons: [],
        weights: {},
        status: "incompatible",
        headline: "Estas fichas no pertenecen al mismo grupo.",
        verdict: "Selecciona el mismo tipo y gama para comparar.",
        limitations: [],
      };
    var rows = items.map(function (p) {
      return {
        product: p,
        advantages: [],
        metrics: [],
        total: null,
        performance: null,
        features: null,
        priceScore: null,
      };
    });
    var definitions = (DEFINITIONS[items[0].category] || []).slice();
    if (items.every(TA.store.hasVerifiedPrice))
      definitions.push({
        key: "price",
        label: "Precio local verificado",
        unit: "Q",
        direction: "min",
        note: "Es el menor precio del conjunto en las fechas indicadas. Confirma disponibilidad y condiciones.",
      });
    var criteria = definitions
      .filter(function (def) {
        return items.every(function (p) {
          var val = def.key === "price" ? p.price : (p.metrics || {})[def.key];
          return p.dataStatus === "verified" && Number.isFinite(val) && val > 0;
        });
      })
      .map(function (def) {
        var values = items.map(function (p) {
          var value = def.key === "price" ? p.price : p.metrics[def.key];
          return {
            productId: p.id,
            value: value,
            display: value + " " + def.unit,
          };
        });
        var best = Math[def.direction === "max" ? "max" : "min"].apply(
          null,
          values.map(function (v) {
            return v.value;
          }),
        );
        var bestIds = values
          .filter(function (v) {
            return v.value === best;
          })
          .map(function (v) {
            return v.productId;
          });
        rows.forEach(function (row) {
          if (bestIds.length === 1 && bestIds[0] === row.product.id)
            row.advantages.push(
              def.label + ": " + best + " " + def.unit + ". " + def.note,
            );
        });
        return {
          key: def.key,
          label: def.label,
          note: def.note,
          unit: def.unit,
          values: values,
          bestIds: bestIds,
        };
      });
    var chosen = criteria.filter(function (c) {
      return c.key === priority;
    })[0];
    var winner =
      chosen && chosen.bestIds.length === 1
        ? items.filter(function (p) {
            return p.id === chosen.bestIds[0];
          })[0]
        : null;
    var limitations = [];
    if (
      items.some(function (p) {
        return p.dataStatus !== "verified";
      })
    )
      limitations.push(
        "Esta comparación incluye datos académicos pendientes de contrastar. Se muestran para consulta, sin usarlos para atribuir ventajas verificadas.",
      );
    if (!items.every(TA.store.hasVerifiedPrice))
      limitations.push(
        "No hay precios locales verificados para todo el conjunto; el precio no determina la recomendación.",
      );
    return {
      winner: winner,
      rows: rows,
      criteria: criteria,
      weights: {},
      reasons: winner ? [chosen.note] : [],
      status: winner
        ? "conditional"
        : criteria.length
          ? "facts-only"
          : "evidence-gap",
      headline: winner
        ? winner.brand +
          " " +
          winner.model +
          ": destaca en " +
          chosen.label.toLowerCase()
        : "La mejor opción depende de tu uso.",
      verdict:
        CONTEXT[items[0].category] ||
        "Revisa las diferencias relevantes para tu uso, la compatibilidad y las fuentes. Sin una medición comparable no asignamos un ganador global.",
      limitations: limitations,
    };
  }
  TA.recommendation = {
    recommend: recommend,
    DEFINITIONS: DEFINITIONS,
    WEIGHTS: {},
    evaluate: function (items) {
      var result = recommend(items);
      return result ? result.rows : [];
    },
  };
})(window.TechAlbum);
