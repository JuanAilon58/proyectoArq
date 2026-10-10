/* Una evaluación por fila: los conteos y el veredicto usan la misma evidencia. */
window.TechAlbum = window.TechAlbum || {};
(function (TA) {
  "use strict";
  var normalize = function (s) {
    return String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };
  var contexts = {
    procesadores:
      "Elige primero una plataforma compatible con tu placa y memoria. Para decidir rendimiento hacen falta benchmarks de la misma tarea; núcleos y GHz no bastan.",
    graficas:
      "Revisa resolución, juegos, fuente y tamaño del gabinete. Más VRAM amplía capacidad; los FPS necesitan pruebas equivalentes.",
    ram: "Comprueba DDR4 o DDR5, capacidad admitida y perfiles de la placa. Un kit incompatible no se sustituye por otro aunque tenga más capacidad.",
    almacenamiento:
      "Elige formato y conexión compatibles. Más capacidad y velocidades declaradas son criterios distintos; revisa garantía y durabilidad.",
    motherboards:
      "El socket, chipset, BIOS y tipo de memoria deben ser compatibles con tu procesador. Las placas de plataformas distintas requieren un equipo diferente.",
    fuentes:
      "Calcula la potencia necesaria y confirma conectores y protecciones. Más vatios no garantizan mayor calidad.",
    refrigeracion:
      "Confirma socket y espacio: altura del disipador o soporte para radiador. El rendimiento térmico necesita pruebas bajo la misma carga.",
    gabinetes:
      "Comprueba formato de placa, largo de GPU y espacio para refrigeración. Decide según tamaño, ventilación y facilidad de montaje.",
    monitores:
      "Elige resolución y tamaño para tu distancia de uso. La frecuencia es solo uno de los criterios junto a panel, conexión y calidad de imagen.",
    teclados:
      "Decide por distribución, tipo de interruptor, ruido y conexión. Más funciones no sustituyen comodidad al escribir.",
    mouse:
      "Prioriza forma, peso y conexión. Los DPI máximos no determinan precisión real ni comodidad.",
    webcams:
      "Revisa resolución, luz, micrófono y compatibilidad. La calidad en una habitación real necesita pruebas de imagen.",
    microfonos:
      "Elige conexión y patrón según tu espacio. XLR puede necesitar interfaz y alimentación phantom; USB y solapa cubren usos diferentes.",
    bocinas:
      "Comprueba conexiones y espacio. Potencia declarada y calidad de sonido no son equivalentes.",
    audifonos:
      "Prioriza comodidad, formato, conexión y uso. ANC y calidad de audio necesitan pruebas; la autonomía declarada depende de las condiciones.",
    cables:
      "Confirma el conector y la función antes de elegir. La longitud adecuada depende del recorrido; un cable más largo no es automáticamente mejor.",
    smartphones:
      "Elige pantalla, almacenamiento, soporte y ecosistema. Megapíxeles y mAh no equivalen a mejor cámara o autonomía real.",
    laptops:
      "Confirma aplicaciones, arquitectura, memoria, puertos y movilidad. Compara la variante exacta y pruebas de autonomía.",
    tablets:
      "Decide según aplicaciones, almacenamiento y compatibilidad con lápiz o teclado. Comprueba qué accesorios están incluidos.",
    tecnologia:
      "Estos dispositivos pueden cumplir funciones distintas. Revisa el tipo y las conexiones; la tabla muestra alternativas de la sección, no sustitutos automáticos.",
    mezcladores:
      "Comprueba entradas, salidas y tu flujo de grabación. Una mezcladora y una interfaz de audio no hacen necesariamente el mismo trabajo.",
    sonido:
      "Revisa conexión USB o PCIe, impedancia de tus audífonos y sistemas compatibles. Elige por tus necesidades de entrada y salida.",
    radios:
      "Elige bandas, alimentación y portabilidad. Confirma recepción y altavoz para el lugar donde la usarás.",
    adaptadores:
      "Comprueba la dirección de la conversión, los puertos y los estándares. Adaptadores de video, red y USB tienen funciones distintas.",
    redes:
      "Define si necesitas router, switch, extensor o punto de acceso. Las velocidades anunciadas no equivalen a cobertura ni velocidad de Internet.",
    camaras:
      "Elige sistema de lentes, tamaño y uso. Más megapíxeles no determinan por sí solos la calidad de imagen.",
    "camaras-deportivas":
      "Comprueba estabilización, resistencia, formatos y accesorios. La calidad real de video necesita muestras comparables.",
    "camaras-video":
      "Prioriza enfoque, zoom útil, audio y formatos de grabación para tu trabajo.",
    estabilizadores:
      "Comprueba peso y dimensiones admitidos. Un estabilizador para teléfono no reemplaza uno para una cámara.",
    "aros-luz":
      "Elige tamaño, montaje, alimentación y control de temperatura. Revisa cómo ilumina tu espacio.",
    selfie:
      "Comprueba compatibilidad, altura y estabilidad; decide entre movilidad y uso como trípode.",
    drones:
      "Elige por uso, cámara, autonomía y facilidad de control. Confirma requisitos de vuelo en tu ubicación.",
    impresoras:
      "Define color o monocromo, volumen y costo de consumibles. La velocidad declarada no resume el costo por página.",
    scanners:
      "Decide según movilidad o volumen de documentos. ADF y dúplex reducen pasos al digitalizar lotes.",
    luces:
      "Define si necesitas bombilla, tira o lámpara. Comprueba alimentación, conexión y sistema de control.",
    televisores:
      "Elige tamaño para tu distancia, sistema y entradas. Contraste, HDR y latencia necesitan pruebas además de especificaciones.",
    proyectores:
      "Comprueba distancia de tiro, luz ambiente y conexiones. No compares cifras de brillo expresadas con métodos distintos.",
    baterias:
      "Confirma voltaje, conectores y carga que vas a respaldar. UPS, pilas y baterías DC no son intercambiables.",
    "pasta-termica":
      "Elige por aplicación, seguridad y facilidad de limpieza. La conductividad declarada no reemplaza pruebas térmicas equivalentes.",
    servidores:
      "Define almacenamiento, servicios y expansión. Un NAS y un servidor cubren necesidades diferentes.",
    usb: "Prioriza capacidad, conexión y velocidades declaradas. La forma y resistencia también importan para transporte.",
    memorias:
      "Comprueba formato compatible con tu dispositivo y clase de velocidad. SD, microSD y Memory Stick no son intercambiables.",
    smartwatch:
      "Comprueba compatibilidad con tu teléfono, tamaño y funciones necesarias. Autonomía y mediciones dependen del uso y del dispositivo.",
    anillos:
      "Revisa talla, aplicación, suscripción y comodidad. Sus métricas no sustituyen una valoración médica.",
    lentes:
      "Decide si necesitas cámara, audio o pantalla. Estos formatos cumplen tareas distintas.",
    vr: "Confirma plataforma, conexión y catálogo de aplicaciones. Algunos visores necesitan una consola o PC.",
    "lentes-proteccion":
      "Prioriza ajuste, comodidad y graduación compatible. Una cifra de filtro no basta para atribuir beneficios de salud.",
    consolas:
      "Elige por juegos, plataforma, formato físico o digital y movilidad. El almacenamiento es solo un criterio.",
    robots:
      "Define la tarea: aprendizaje, limpieza o juego. No atribuyas un ganador entre funciones diferentes.",
    "discos-opticos":
      "Comprueba si buscas un disco o un lector y qué formatos admite tu equipo. Capacidad y compatibilidad tienen prioridad.",
  };
  function quantity(text, units) {
    var match = String(text)
      .replace(/,/g, ".")
      .match(
        /(\d+(?:\.\d+)?)\s*(TB|GB|MB\/s|GB\/s|Mbps|Gbps|Hz|MHz|g|kg|ppm|anos|años)\b/i,
      );
    if (!match) return null;
    var unit = match[2].toLowerCase();
    if (units.indexOf(unit) === -1) return null;
    var value = Number(match[1]);
    if (unit === "tb") value *= 1024;
    if (unit === "gb/s" || unit === "gbps" || unit === "kg") value *= 1000;
    return value;
  }
  function rule(key, items, values) {
    var k = normalize(key),
      category = items[0].category;
    if (items[0].comparisonGroup !== items[1].comparisonGroup) return null;
    var directions = {
      capacidad: ["tb", "gb"],
      almacenamiento: ["tb", "gb"],
      ram: ["gb"],
      "memoria vram": ["gb"],
      "memoria de video": ["gb"],
      lectura: ["mb/s", "gb/s"],
      escritura: ["mb/s", "gb/s"],
      "frecuencia de pantalla": ["hz"],
      garantia: ["anos", "años"],
    };
    if (k === "frecuencia" && category === "ram") directions[k] = ["mhz"];
    if (k === "velocidad" && category === "cables")
      directions[k] = ["mbps", "gbps"];
    if (
      k === "velocidad" &&
      ["impresoras", "scanners"].indexOf(category) !== -1
    )
      directions[k] = ["ppm"];
    if (
      k === "peso" &&
      ["laptops", "tablets", "selfie", "lentes"].indexOf(category) !== -1
    ) {
      return {
        direction: "min",
        values: values.map(function (v) {
          return quantity(v, ["g", "kg"]);
        }),
        note: "Menor peso para transportar; no mide calidad.",
      };
    }
    if (directions[k])
      return {
        direction: "max",
        values: values.map(function (v) {
          return quantity(v, directions[k]);
        }),
        note:
          k === "garantia"
            ? "Mayor duración declarada; revisa condiciones."
            : k === "memoria vram" || k === "memoria de video"
              ? "Más capacidad de VRAM; no implica más FPS."
              : ["lectura", "escritura", "velocidad", "frecuencia"].indexOf(
                    k,
                  ) !== -1
                ? "Mayor cifra declarada para este criterio; no resume el rendimiento real."
                : "Mayor capacidad o frecuencia en este criterio; el uso y la compatibilidad también importan.",
      };
    if (
      [
        "seguro metalico",
        "blindaje",
        "wifi",
        "bluetooth",
        "duplex",
        "cancelacion de ruido",
        "anc",
      ].indexOf(k) !== -1
    ) {
      var flags = values.map(function (v) {
        var text = normalize(v);
        if (/^(si|automatico|integrado|incluido|wifi\s*[4567])/.test(text))
          return 1;
        if (/^(no|manual|sin)/.test(text)) return 0;
        return null;
      });
      return {
        direction: "max",
        values: flags,
        note: "Función incluida en la ficha; su utilidad depende de tu necesidad.",
      };
    }
    return null;
  }
  function rows(items) {
    if (items.length !== 2) return [];
    var keys = [],
      seen = {};
    items.forEach(function (p) {
      Object.keys(p.specifications).forEach(function (key) {
        if (!seen[key]) {
          seen[key] = true;
          keys.push(key);
        }
      });
    });
    var priceComparable =
      items[0].comparisonGroup === items[1].comparisonGroup &&
      items.every(TA.store.hasVerifiedPrice);
    var result = [
      {
        key: "price",
        label: "Precio de referencia",
        values: items.map(function (p) {
          return TA.store.formatPrice(p.price);
        }),
        state: items.some(function (p) {
          return p.price === null;
        })
          ? "missing"
          : items[0].price === items[1].price
            ? "equal"
            : "unevaluated",
        best: null,
        note: "",
        price: true,
      },
    ];
    if (priceComparable && items[0].price !== items[1].price) {
      result[0].best = items[0].price < items[1].price ? 0 : 1;
      result[0].state = "advantage";
      result[0].note = "Menor precio local verificado.";
    }
    keys.forEach(function (key) {
      var values = items.map(function (p) {
        return p.specifications[key] == null
          ? "Sin dato"
          : String(p.specifications[key]);
      });
      var equal = normalize(values[0]) === normalize(values[1]),
        missing = values.indexOf("Sin dato") !== -1;
      var evaluation = rule(key, items, values),
        best = null,
        note = "";
      if (
        evaluation &&
        evaluation.values.every(function (v) {
          return v !== null && Number.isFinite(v);
        }) &&
        evaluation.values[0] !== evaluation.values[1]
      ) {
        best =
          evaluation.direction === "min"
            ? evaluation.values[0] < evaluation.values[1]
              ? 0
              : 1
            : evaluation.values[0] > evaluation.values[1]
              ? 0
              : 1;
        note = evaluation.note;
      }
      result.push({
        key: key,
        label: key,
        values: values,
        state:
          best !== null
            ? "advantage"
            : missing
              ? "missing"
              : equal
                ? "equal"
                : "different",
        best: best,
        note: note,
        price: false,
      });
    });
    return result;
  }
  function summary(items, evaluated, priority) {
    var counts = [0, 0],
      chosen = null;
    evaluated.forEach(function (row) {
      if (row.best !== null) counts[row.best]++;
      if (row.key === priority && row.best !== null) chosen = row;
    });
    var sameType = items[0].comparisonGroup === items[1].comparisonGroup;
    var winner = !sameType
      ? null
      : chosen
        ? chosen.best
        : counts[0] !== counts[1]
          ? counts[0] > counts[1]
            ? 0
            : 1
          : null;
    var reasons =
      winner === null
        ? []
        : evaluated
            .filter(function (row) {
              return row.best === winner && (!priority || row.key === priority);
            })
            .map(function (row) {
              return row.label.toLowerCase();
            });
    var verified = items.every(function (p) {
      return p.dataStatus === "verified";
    });
    var headline =
      winner === null
        ? "La elección depende de lo que necesitas."
        : items[winner].brand +
          " " +
          items[winner].model +
          (verified
            ? " es la opción recomendada si priorizas "
            : " destaca en esta ficha por ") +
          reasons.slice(0, 3).join(", ") +
          ".";
    if (priority && !chosen) {
      winner = null;
      headline = "Este criterio no ofrece una ventaja evaluable.";
    }
    return {
      counts: counts,
      winner: winner,
      headline: headline,
      verified: verified,
      context:
        contexts[items[0].category] ||
        "Compara conexiones, compatibilidad y características según tu uso.",
      caveat: !sameType
        ? "Estos productos tienen funciones o plataformas distintas. Puedes contrastar sus fichas, pero no son sustitutos directos y no asignamos un ganador."
        : !verified
          ? "Comparación académica: las ventajas describen los datos de estas fichas, pendientes de verificación. No equivalen a una recomendación de compra comprobada."
          : "La recomendación se limita a las ventajas de esta tabla; no es una puntuación global de calidad o rendimiento.",
    };
  }
  TA.duelModel = { rows: rows, summary: summary, contexts: contexts };
})(window.TechAlbum);
