# Álbum Tecnológico — edición 2026

Guía académica de tecnología de la Universidad Mariano Gálvez de Guatemala. Organiza la consulta por **categoría → subcategoría → tipo de producto → gama** y compara dos productos **A contra B**.

El catálogo contiene **198 productos en 50 subcategorías**: 32 fichas contrastadas con fuentes oficiales el **9 de octubre de 2026**, y 166 fichas académicas identificadas como referencia. Incluye nuevos lanzamientos de 2026 y modelos anteriores cuya ficha sigue siendo útil para consulta; el año de lanzamiento y la fecha de revisión son datos distintos.

## Experiencia

- Portada editorial, índice por áreas, fuentes Manrope y Newsreader autoalojadas y temas claro/oscuro persistentes.
- Álbum con búsqueda por marca, modelo, especificación o uso; filtros por tipo, gama y marca; selección de fuentes verificadas y fichas guardadas. Sin filtro de precio.
- URLs que conservan filtros y regreso desde la ficha a la sección consultada. Paginación progresiva de 24 fichas para evitar renderizar todo el catálogo.
- Smartphones por gama, mostrando todos los resultados; archivo académico opcional.
- Cada tarjeta y ficha abre **Ver comparativa** con una alternativa; ningún producto queda limitado a solo consulta.
- Entrar en una categoría o subcategoría muestra directamente sus parejas A/B, con fotos, tres especificaciones, ventajas y acceso a la comparativa completa. El listado general conserva fichas individuales. Los filtros de tipo, gama y fuentes se aplican a ambos lados; búsqueda, marca y guardados encuentran una ficha junto a su alternativa.
- Comparador oscuro según la referencia del usuario: dos grandes fotos, etiquetas A/B, VS central, marcas, modelos, precios, conteo de ventajas, tabla y recomendación final. Ambos productos y valores permanecen visibles en móvil.
- Selectores A/B y un índice con los 198 productos de las 50 subcategorías. Persistencia local, opción de mostrar solo diferencias, enlace compartible e impresión.
- Glosario y metodología en `pages/guia.html`. Guardados locales sin cuentas.
- Navegación móvil, foco visible, controles etiquetados, preferencia de movimiento reducido y contenido visible desde el inicio.

## Datos y honestidad

`data/products.js` conserva las fichas demostrativas y sus IDs originales. `data/catalog-2026.js` añade clasificación estable, estados y nuevas fichas con fuentes. Se carga antes de `js/products.js`.

Cada producto tiene `range`, `comparisonGroup`, `comparisonLabel`, `dataStatus`, `imageKind` y `sources`. La comparación permite productos de la misma subcategoría; en smartphones también exige la misma gama. Se sugieren primero alternativas del mismo tipo y gama. **La gama no depende del precio ni del orden de inserción.**

Una ficha `verified` contiene solo especificaciones seleccionadas contrastadas con documentación oficial, fecha `verifiedAt` y enlaces de origen. Esto no certifica disponibilidad en Guatemala. El catálogo no se actualiza automáticamente.

Los productos nuevos llevan `price: null` cuando no hay precio local comprobado. Se muestra **Por verificar**, nunca Q 0. Los precios del archivo son referencia académica. Para registrar un precio comprobado se requieren `priceStatus: 'verified'`, `currency: 'GTQ'`, `priceSource` y `priceVerifiedAt` junto con el valor.

`js/comparison-model.js` evalúa cada fila y deriva de ella los conteos y el veredicto. Destaca capacidad, frecuencias, velocidades declaradas y funciones con criterios explícitos para productos del mismo tipo. Longitud, color, GHz, núcleos, megapíxeles y mAh no generan superioridad automática. Los precios solo cuentan como ventaja si ambos están verificados. Las conclusiones de datos académicos son orientativas y los tipos distintos o empates no declaran ganador. Cada subcategoría tiene contexto propio de elección.

## Ejecutar

El sitio publicado es HTML, CSS y JavaScript clásico. No requiere framework, servidor de datos, claves de API ni build; también se puede abrir `index.html` directamente.

Para la vista previa y las comprobaciones de desarrollo se necesita Node.js 20 o superior. No hay dependencias npm:

```sh
npm start
# http://127.0.0.1:4173

npm run check
# validación de catálogo, rutas, scripts y reglas del comparador
```

La búsqueda y la comparación se ejecutan en el dispositivo. Solo abrir las fuentes externas requiere conexión.

## Organización

```text
index.html                      Portada
pages/catalogo.html             Índice y fichas
pages/smartphones.html           Teléfonos por gama
pages/producto.html?id=204       Ficha y fuentes
pages/comparar.html?ids=203,205   Comparación compartida
pages/guia.html                  Método y glosario
css/                            Base, componentes y responsive
js/ui.js                        Iconos, guardados y utilidades
js/pages.js                     Comportamiento de las seis rutas
js/comparator.js                 Selección compatible y persistencia
js/duel.js                       Comparativa A/B e índice completo
js/comparison-model.js           Filas, ventajas y veredicto
css/comparison.css               Superficie oscura según referencia
scripts/comparison-template.html Plantilla de la comparativa
scripts/build-pages.cjs          Plantillas estáticas y navegación común
scripts/validate-catalog.cjs     Validación de datos y referencias
scripts/test-comparison.cjs      Pruebas de decisiones y casos límite
```

Para modificar el encabezado, pie o contenido estático, edita `scripts/build-pages.cjs` y ejecuta `npm run pages`. Las páginas generadas se incluyen en Git. No hace falta generar nada al desplegar.

## Mantener el catálogo

1. Añade una ficha a `data/catalog-2026.js` con ID único y subcategoría existente. Para una sección nueva, agrega su definición a `CATEGORIES`.
2. Asigna gama y grupo por función y segmento, usando las mismas claves para alternativas equivalentes. El grupo prioriza la alternativa sugerida y habilita la evaluación de ventajas; tipos distintos pueden consultarse en la tabla sin atribuirles un ganador.
3. Comprueba el modelo y variante exactos en fuentes oficiales. Registra `verifiedAt`, fuentes y año solo cuando esté confirmado. Las métricas en `metrics` deben corresponder a esas especificaciones.
4. Usa imágenes locales y registra licencia y atribución. Si una fotografía es genérica, conserva `imageKind: 'illustrative'`.
5. Verifica que haya al menos dos opciones en cada subcategoría (por gama en smartphones), para que toda ficha pueda abrir una comparativa.
6. Ejecuta `npm run check` y revisa las rutas afectadas en computadora y móvil antes de subir cambios.

GitHub Actions ejecuta las comprobaciones en cada push y pull request. Las pruebas verifican compatibilidad, límites, persistencia ante fallos, precios ausentes, datos incompletos y recomendaciones condicionales. No comprueban automáticamente cambios en las páginas oficiales.

## Recursos visuales

Las fotos de modelos de Galaxy A57, Galaxy S26 e iPhone 17 Pro tienen licencia abierta y crédito en sus fichas y en la guía. Las de Sabrent CB-SFK3 y StarTech SATA12 proceden de sus fabricantes, con derechos reservados y atribución visible. Las demás se identifican como ilustrativas. Consulta [fuentes y licencias de imágenes](assets/images/verified/SOURCES.md) y [tipografía](assets/fonts/SOURCES.md).

Las fotografías de referencia del proyecto original permanecen en `assets/images/products/`; no deben interpretarse como fotos del modelo. La fotografía de portada muestra un procesador genérico.

## Vercel

Mantén el proyecto como **Other**, sin comando de build y con el directorio raíz como salida. `vercel.json` conserva URLs limpias. El sitio no incluye carrito, pagos, venta ni cuentas.
