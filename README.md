# TechAlbum — Álbum y Comparador de Tecnología

Álbum digital de tecnología con comparador inteligente de productos: explora componentes de PC,
smartphones por gama, periféricos, audio, cables y otros dispositivos; compara marcas lado a lado
y obtén una **recomendación con puntaje transparente** debajo de cada comparación.

> 💡 **Nota visible en el sitio:** los precios están en quetzales (Q) y son **de referencia**;
> pueden variar según el establecimiento, la fecha y la disponibilidad. Las especificaciones son
> datos de demostración para fines académicos. No es una tienda (sin carrito, pagos ni usuarios).

## Funcionalidades

- **Inicio**: hero, tarjetas de categorías, productos destacados y explicación del flujo.
- **Álbum tecnológico** (`pages/catalogo.html`): tarjetas con imagen, marca, modelo, categoría,
  precio, característica principal, **Ver detalles** y **Comparar**.
- **Detalle** (`pages/producto.html?id=`): imagen grande, especificaciones, características
  sobresalientes y botón para agregar al comparador + relacionados.
- **Smartphones por gama** (`pages/smartphones.html`): pestañas baja/media/alta (2 marcas por
  gama como mínimo) y botones de comparación directa por gama.
- **Comparador** (`pages/comparar.html`): de 2 a 4 productos, tabla dinámica (unión de
  especificaciones según la categoría), fila de mejor precio y **recomendación obligatoria**
  debajo con motivos y tabla de puntajes.
- **Búsqueda dinámica**: marca, modelo, categoría y características.
- **Filtros**: categoría, grupo (navegación Periféricos/Tecnología), marca, rango de precio (Q)
  y gama (smartphones), más ordenamiento.
- **Responsive**: 4→2→1 columnas; tablas con scroll horizontal en móvil.
- **Accesibilidad**: HTML semántico, `alt` en imágenes, labels, skip-link, foco visible.

## Tecnologías

HTML5 semántico · CSS3 moderno (sin frameworks) · JavaScript vanilla ES6 (scripts clásicos,
sin build) · Datos en `data/products.js` (global `TECHALBUM_DATA`, sin `fetch` para que
funcione con `file://`) · Imágenes SVG locales · `localStorage` para la bandeja del comparador.

## Estructura

```text
.
├── index.html                 # Inicio (hero, categorías, destacados)
├── pages/
│   ├── catalogo.html          # Álbum + búsqueda + filtros
│   ├── smartphones.html       # Teléfonos por gama
│   ├── comparar.html          # Comparador + recomendación
│   └── producto.html          # Detalle (?id=)
├── css/ style.css · components.css · responsive.css
├── js/
│   ├── products.js            # Acceso a datos y utilidades
│   ├── catalog.js             # Render de tarjetas/categorías
│   ├── filters.js             # Filtros
│   ├── search.js              # Búsqueda
│   ├── comparator.js          # Bandeja (localStorage, máx. 4)
│   ├── recommendation.js      # Puntaje y recomendación
│   └── app.js                 # Init general
├── data/products.js           # CATEGORIES (48) + PRODUCTS (167 demos)
├── assets/images/categories/  # SVG por categoría + placeholder.svg
├── vercel.json
└── README.md
```

## Ejecución local

Sin instalación ni build. Opciones:

```bash
# Opción A: abrir directamente (funciona por file://)
# Doble clic en index.html

# Opción B: servidor estático
npx serve .
# o
python -m http.server 8000
```

Luego visita `http://localhost:3000` (serve) o `http://localhost:8000`.

## Cómo agregar productos

En `data/products.js`, copia un objeto y cambia al menos `id` (único), `category`, `brand`,
`model`, `price`, `specifications` y `highlights`. Ejemplo:

```js
P({ id: 168, category: "ram", brand: "Kingston", model: "FURY Beast 8GB",
  image: PX(38361202), price: 299, rating: 3,
  specifications: { "Capacidad": "8 GB", "Tipo": "DDR4", "Frecuencia": "3200 MHz" },
  highlights: ["Económica para oficina"] }),
```

Para smartphones agrega `range: "baja" | "media" | "alta"`.

## Cómo agregar categorías

1. Añade `{ id, label, icon, group, desc }` en `CATEGORIES` (id único, minúsculas, sin espacios).
2. Crea `assets/images/categories/<id>.svg` (o reutiliza `placeholder.svg`).
3. Usa ese `id` en los productos. El comparador no necesita cambios (tabla genérica).

## Imágenes (Pexels)

Cada producto trae una foto curada del CDN de Pexels (licencia gratuita,
sin key y sin fetch): `image: PX(<id>)` en `data/products.js`, donde
`PX()` construye `https://images.pexels.com/photos/<id>/...?w=800`.
Las 75 fotos fueron verificadas (HTTP 200).

- **Sin internet**: hay fallback automático al SVG local de su categoría
  (`data-cat` + `TechAlbum.store.imgFallback`) y luego a `placeholder.svg`.
- **Pexels API (opcional)**: `js/pexels.js` trae cliente + `enhance()`.
  Para activarlo: crea una key gratuita en <https://www.pexels.com/api>,
  pégala en `API_KEY` dentro de `js/pexels.js` y recarga. Hará 1 request
  por categoría (18), actualizará las tarjetas en vivo y cacheará 30 días
  en `localStorage`. Sin key el sitio funciona igual con las fotos curadas.
- **Cambiar una foto**: sustituye el número en `PX(...)` por el ID de otra
  foto de Pexels (el número al final de su URL, ej. `.../foto-1234567/`).

## Cómo usar el comparador

Desde cualquier tarjeta pulsa **Comparar** (hasta 4) → abre **Comparador** → tabla lado a
lado → lee la **recomendación** con puntajes. Atajos: botones de sugerencia
(Intel i5 vs i7, gamas, etc.) y **⚖️ Comparar gama** en Smartphones.

## Cómo funciona la recomendación

`js/recommendation.js`, pesos fijos y visibles:

```text
total = 0.40 × rendimiento (rating×2, 0–10)
      + 0.35 × precio relativo (10 = más barato DEL CONJUNTO, 0 = más caro)
      + 0.25 × características (según nº de specs + highlights)
```

Gana el mayor total. El precio se normaliza **dentro de cada comparación**, por eso la
recomendación cambia según los productos elegidos. Debajo se muestra la tabla de puntajes,
los motivos y la relación precio/características.

## Despliegue en Vercel

1. Crea un repositorio en GitHub y sube el proyecto.
2. Entra a [vercel.com](https://vercel.com) → **Add New Project** → **Import** el repositorio.
3. Framework: **Other**. Build: vacío. Output: `./` (sitio estático, sin build).
4. **Deploy** y verifica la URL (navegación, filtros, comparador).

## Requisitos académicos

Ver tabla de verificación en el resumen de entrega (todos cubiertos: hardware interno y
externo, 2+ marcas por comparativa, precios Q, imágenes, recomendación bajo cada
comparación, 3 gamas con 2 marcas, periféricos, audio, cables, catálogo, búsqueda,
filtros, comparador, responsive y Vercel).
