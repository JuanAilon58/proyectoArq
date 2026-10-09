---
name: Álbum Tecnológico
description: Identidad editorial cálida para explorar y comparar tecnología con contexto.
colors:
  bg: "#f5f2e9"
  panel: "#fffdf6"
  soft: "#eae9dd"
  ink: "#183c35"
  muted: "#59685d"
  line: "#d3d7c7"
  accent: "#aa4e22"
  accent-soft: "#fae4d3"
  forest: "#173e35"
  on-forest: "#fff9e9"
  control-border: "#788777"
  bg-dark: "#101f1c"
  panel-dark: "#182b25"
  soft-dark: "#21362e"
  ink-dark: "#f5f2e8"
  muted-dark: "#b5c5b8"
  line-dark: "#41564b"
  accent-dark: "#f2b47c"
  accent-soft-dark: "#483525"
  forest-dark: "#203e32"
  control-border-dark: "#7a9182"
  forest-muted: "#d2dfd2"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(2.8rem, 6.5vw, 5.8rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(2rem, 3.8vw, 3.6rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 750
    lineHeight: 1.35
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "11px"
    fontWeight: 750
    lineHeight: 1.3
  button:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 750
    lineHeight: 1.3
rounded:
  badge: "4px"
  control: "5px"
  button: "6px"
  media: "8px"
  dock: "10px"
  circle: "50%"
spacing:
  inline: "6px"
  icon: "8px"
  control: "10px"
  field: "12px"
  paragraph: "14px"
  card: "16px"
  slot: "18px"
  block: "20px"
  grid: "24px"
  heading: "28px"
  flow: "32px"
  section: "88px"
  section-mobile: "65px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "12px 21px"
  button-primary-hover:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.on-forest}"
  button-primary-dark:
    backgroundColor: "{colors.ink-dark}"
    textColor: "{colors.bg-dark}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "12px 21px"
  button-secondary-hover:
    backgroundColor: "{colors.soft}"
  input-search:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
    width: "100%"
  input-search-dark:
    backgroundColor: "{colors.panel-dark}"
    textColor: "{colors.ink-dark}"
  filter-chip:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.badge}"
    padding: "6px 10px"
  badge-verified:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.on-forest}"
    typography: "{typography.label}"
    rounded: "{rounded.badge}"
    padding: "5px 8px"
  badge-reference:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.badge}"
    padding: "5px 8px"
  badge-accent:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    typography: "{typography.label}"
    rounded: "{rounded.badge}"
    padding: "5px 8px"
  product-media:
    backgroundColor: "{colors.soft}"
    rounded: "{rounded.media}"
    width: "100%"
  range-control:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 17px"
  range-control-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
  compare-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 10px"
  compare-button-selected:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.on-forest}"
  compare-dock:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.on-forest}"
    rounded: "{rounded.dock}"
    padding: "13px 18px"
---
# Design System: Álbum Tecnológico

## Overview

**Creative North Star: "El álbum de consulta"**

Una lectura editorial cálida donde títulos, fotografías y fichas ayudan a comprender diferencias. La identidad existente se extiende con verde profundo, papel crema y terracota; la composición deja espacio para leer mientras los controles mantienen una densidad práctica.

Newsreader da voz a los títulos y Manrope sostiene datos, navegación y acciones. Las fotografías locales lideran las fichas: su relación con el modelo queda explícita, y autor, fuente y licencia acompañan las imágenes cuando existe atribución. El emblema académico permanece discreto en el pie.

**Key Characteristics:**

- Títulos serif amplios y datos en sans serif.
- Papel cálido, verde profundo y énfasis terracota.
- Superficies delimitadas por líneas y cambios de tono.
- Fotografía identificada, con contexto y atribución.
- Jerarquía consistente entre temas claro y oscuro.

Fuente de verdad: `css/style.css`, `css/components.css` y `css/responsive.css`. El frontmatter registra valores implementados; la portada y el recorrido concreto se describen en `.impeccable/surface.md`.

## Colors

La paleta combina la calma del papel crema con el verde de lectura y una terracota cálida para señalar énfasis.

### Primary

- **Verde de lectura — ink:** texto principal, títulos y acciones primarias; en oscuro se convierte en papel claro.
- **Verde de superficie — forest:** franjas de contexto, estado verificado, selección de comparación y bandeja fija. Su pareja **on-forest** conserva la lectura clara.
- **Texto secundario sobre verde — forest-muted:** información auxiliar de bandeja y conclusión.

### Secondary

- **Terracota — accent:** énfasis en títulos, indicación de navegación activa y foco visible. En oscuro pasa a un tono melocotón.
- **Terracota suave — accent-soft:** fondo de etiquetas de edición y archivo anterior; acompaña texto accent.

### Neutral

- **Papel — bg:** fondo continuo de la página.
- **Papel elevado — panel:** campos, recuadro de lectura y encabezados de tabla.
- **Papel tenue — soft:** áreas de fotografía, etiquetas neutras, huecos del comparador y respuesta hover.
- **Tinta secundaria — muted:** explicaciones, metadatos y leyendas.
- **Divisor — line:** reglas, bordes de contenido y separación de filas.
- **Borde de control — control-border:** límites de búsqueda, selects y controles de icono, gama y comparación. Es más fuerte que el divisor.

Las claves terminadas en `-dark` registran los valores de `body[data-theme="dark"]`; no son una segunda identidad. La implementación cambia las variables semánticas del mismo nombre. Las etiquetas y controles superpuestos a fotografía conservan papel claro y verde para seguir siendo legibles sobre una imagen.

Las rampas de ocho tonos del sidecar se derivan en OKLCH para visualizar cada color en el panel. Son metadatos ilustrativos; no agregan colores normativos a la interfaz.

### Named Rules

**The Semantic Theme Rule.** Cambiar el tema conserva la función de cada color: fondo, lectura, selección, foco y metadatos mantienen su jerarquía.

**The Control Border Rule.** Usar control-border para límites interactivos y line para divisores de contenido; el estado seleccionado añade relleno y texto contrastados.

## Typography

**Display Font:** Newsreader, con Georgia y serif como alternativas.
**Body Font:** Manrope, con Segoe UI y sans serif como alternativas.

Las dos familias variables se sirven localmente en WOFF2 con `font-display: swap`. El contraste serif/sans distingue la lectura editorial de los datos sin introducir una tercera voz.

### Hierarchy

- **Display:** título principal; las introducciones de página usan `clamp(2.8rem, 5vw, 4.7rem)` y la ficha `clamp(2.7rem, 4.6vw, 4.3rem)`.
- **Headline:** títulos de sección; los títulos compactos de ficha e índice usan Newsreader entre (24–29px).
- **Title:** modelo de producto; baja a (14px) en móvil y usa (16px) en las grillas de smartphones de escritorio.
- **Body:** lectura general con máximo de (72ch); introducciones usan (16px), guía (14px) y explicaciones compactas (12–13px).
- **Label:** etiquetas funcionales; ningún texto funcional del sistema baja de (11px). Marcas de producto usan peso (800), mayúsculas y espaciado (0.075em) como metadato.
- **Button:** acciones principales; tamaños compactos usan (12px), y controles de tarjeta y bandeja (11px).

Los títulos equilibran saltos mediante `text-wrap: balance`; el cuerpo conserva un interlineado amplio. Los precios y cifras comparables usan números tabulares.

### Named Rules

**The Two Voices Rule.** Reservar Newsreader para títulos de lectura y Manrope para información, navegación y controles.

**The Legible Metadata Rule.** Mantener (11px) como mínimo funcional y conservar la diferencia entre texto principal y secundario en ambos temas.

## Layout

El contenedor centra contenido hasta (1320px), con (44px) de margen lateral en escritorio. A (1100px), (800px) y (580px) los márgenes pasan a (28px), (20px) y (16px). Las secciones generales usan el espaciado section del frontmatter y pasan a section-mobile bajo (800px).

Las grillas de productos parten de tres columnas con separación (32px vertical / 24px horizontal). El catálogo combina un directorio de (220px) con contenido flexible; a (1100px) el directorio baja a (180px) y las fichas a dos columnas. Bajo (800px) el directorio se sustituye por un select y el contenido ocupa el ancho. Las fichas conservan dos columnas en móvil con separación (28px vertical / 14px horizontal). Smartphones parte de cuatro columnas, luego tres y dos.

La ficha usa dos columnas iguales separadas por (70px), con fotografía fija durante lectura en escritorio; bajo (580px) se apila. La guía combina índice de (260px) y texto; bajo (800px) su índice fluye horizontalmente sobre el contenido. Las barras de filtros envuelven filas; en móvil la búsqueda ocupa una fila y los selects se reparten la siguiente.

El comparador conserva tres huecos y una tabla horizontal desplazable. La tabla mide al menos (650px), o (570px) bajo (580px); el primer encabezado y la fila superior permanecen visibles. Bajo (800px) una indicación explícita anuncia el desplazamiento lateral. La impresión retira los controles, elimina posiciones fijas y vuelve a papel blanco.

## Elevation & Depth

El contenido ordinario usa superficie, separación y reglas finas; las tarjetas no llevan una caja exterior elevada. La fotografía, la bandeja fija y los avisos marcan distintos planos. El recuadro de lectura de portada conserva borde y fondo, con sombra final desactivada.

### Shadow Vocabulary

- **Bandeja de comparación** (`0 15px 40px -16px #0007`): separa la selección persistente del contenido que pasa debajo.
- **Aviso temporal** (`0 12px 28px -12px #0005`): destaca confirmaciones puntuales.
- **Navegación activa** (`0 2px 0 var(--accent)`): funciona como subrayado de estado, no como elevación.
- **Texto sobre fotografía** (`0 1px 4px #000`): refuerza su lectura; es una sombra de texto.

### Named Rules

**The Reading Surface Rule.** Mantener fichas y bloques de lectura planos; usar elevación para la bandeja y los avisos que se superponen al contenido.

## Shapes

Bordes discretos y esquinas suavizadas organizan el contenido. Las etiquetas usan badge, los campos y controles compactos control, las acciones button, las fotografías media y la bandeja dock. Los botones de icono y guardado son circulares. El índice editorial forma una retícula continua de celdas con reglas compartidas; no necesita cajas elevadas.

Los iconos son SVG de trazo, con `currentColor`, sin relleno, extremos y uniones redondeados y grosor (1.6). El tamaño general es (20px); las variaciones compactas acompañan etiquetas, enlaces y acciones de tarjeta.

## Components

### Buttons

Acciones firmes, compactas y claramente distinguibles.

- **Primary:** relleno ink y texto bg; al pasar el puntero cambia a forest y on-forest.
- **Secondary:** fondo transparente, borde de tinta y texto ink; hover soft.
- **Shape and spacing:** radio button, altura mínima (46px), padding definido en el frontmatter. La versión compacta tiene (39px) mínimos y padding (9px 13px).
- **States:** transición de fondo, color y desplazamiento (0.18s); al presionar baja (1px). El foco tiene contorno accent de (3px), separado (4px). Un botón deshabilitado conserva cursor de indisponibilidad y opacidad (0.55).

### Chips and status labels

Las chips resumen filtros activos y permiten retirarlos mediante texto y SVG de cierre. Usan fondo soft, radio badge y padding del frontmatter. Las etiquetas informativas no se presentan como acciones: estado verificado usa forest/on-forest; referencia académica usa soft/ink; edición y archivo anterior usan accent-soft/accent. Las palabras explican el estado, además del color.

Los controles de gama y de comparación usan `aria-pressed`. Gama seleccionada toma ink/bg; producto seleccionado toma forest/on-forest. En móvil ambos controles tienen al menos (44px) de altura. Tipo y gama conservan etiquetas distintas: el color no mezcla ambas clasificaciones.

### Cards / Containers

La ficha de producto deja el texto sobre el fondo de página y reserva soft y radio media para la fotografía. El área de imagen tiene proporción (1.45) en escritorio y (1.1) en móvil. El cuerpo comienza a (16px), y precio y comparación se separan por una regla.

La fotografía del modelo usa `object-fit: contain`, con padding (12px) en tarjeta y (18px) en detalle. La imagen ilustrativa usa `object-fit: cover`. Una etiqueta visible indica qué representa; el detalle añade autor, fuente y licencia disponibles. Guardar es una acción circular con estado `aria-pressed`.

El hover de fotografía escala la imagen a (1.035) durante (0.45s); no revela información exclusiva. En portada, la entrada modifica saturación durante (0.8s), sin ocultar texto.

### Inputs / Fields

Campos de búsqueda y selects usan panel, ink, borde control-border, radio control y altura mínima (44px). El texto de campo es (12px), la etiqueta (11px) y el placeholder muted. Los filtros mantienen labels visibles. El foco común usa accent con el contorno y separación descritos para botones.

### Navigation

Cabecera fija con fondo bg y regla line. Los enlaces Manrope de (13px) y peso (700) pasan de muted a ink; la página actual suma el subrayado accent y `aria-current`. Bajo (800px) el menú se abre desde un botón de icono y los enlaces envuelven filas. La cabecera pasa de (88px) a (74px). El enlace de salto aparece al recibir foco.

### Comparison dock and table

La bandeja verde conserva el número de seleccionados y la acción de comparar. En escritorio muestra miniaturas textuales y controles de retirada; en móvil prioriza resumen y acción. Tiene ancho máximo (850px), posición fija centrada, radio dock y separación del borde inferior de (20px), o (12px) bajo (800px).

La tabla usa encabezados semánticos, reglas line y fondos soft/panel; las diferencias se señalan con panel. La conclusión verde emplea texto contrastado y grupos de criterios separados por una regla translúcida. El mensaje de desplazamiento móvil usa texto e icono.

### Motion and accessibility

El foco visible se aplica a enlaces, botones, campos, selects, summaries y elementos con tabindex. Mantener texto o nombre accesible en acciones con SVG. Las transiciones son breves y ligadas a estado. `prefers-reduced-motion: reduce` elimina animaciones y transiciones y mantiene desplazamiento automático. La selección, los filtros y la información principal no dependen de animación.

## Do's and Don'ts

### Do:

- **Do** conservar los roles semánticos de color y verificar la lectura en claro y oscuro.
- **Do** usar Newsreader para títulos y Manrope para datos y controles.
- **Do** mantener un mínimo funcional de 11px, foco visible y bordes interactivos control-border.
- **Do** identificar la fotografía como del modelo o ilustrativa y mostrar su atribución disponible.
- **Do** distinguir tipo, gama y estado de la fuente mediante texto explícito.
- **Do** conservar movimiento breve, información accesible sin hover y la alternativa de movimiento reducido.
- **Do** permitir desplazamiento horizontal de la tabla móvil con encabezados y ayuda visibles.

### Don't:

- **Don't** convertir metadatos en títulos o usar mayúsculas de marca como estilo general de lectura.
- **Don't** añadir sombras a cada ficha ni reemplazar las reglas del índice por cajas elevadas.
- **Don't** presentar una fotografía ilustrativa como prueba del aspecto de un modelo exacto.
- **Don't** comunicar selección, verificación o gama únicamente mediante color.
- **Don't** reducir textos funcionales por debajo del mínimo registrado para ganar densidad.
- **Don't** sustituir las variables semánticas por colores locales que rompan el doble tema.

No canonizado: las declaraciones de sombra del recuadro y la primera versión de `uncover` están sobreescritas en el CSS; se documenta el resultado final plano y la entrada por saturación, sin promover las reglas inactivas.
