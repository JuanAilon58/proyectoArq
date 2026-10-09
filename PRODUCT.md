# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Estudiantes y personas que quieren comprender diferencias entre productos tecnológicos antes de elegir. Lo usan como apoyo académico y guía de consulta.

## Product Purpose

Álbum Tecnológico permite explorar una colección por categoría, subcategoría, tipo y gama, revisar fichas con fuentes y comparar dos o tres opciones equivalentes. La conclusión explica diferencias documentadas y sus límites.

## Positioning

Guía educativa de consulta. Sin carrito, venta, pagos, cuentas ni filtro de precio. La recomendación debe poder revisarse y no simular una certeza que los datos no ofrecen.

## Operating Context

Se consulta en computadora o teléfono durante investigación, tareas o evaluación de alternativas. La navegación comienza en el índice, continúa por tipo y gama y termina en una ficha o comparación. Filtros en la URL y guardados locales permiten regresar.

## Capabilities and Constraints

- Sitio estático HTML/CSS/JavaScript clásico, con rutas existentes conservadas y sin dependencia de APIs externas para funcionar.
- Clasificación editorial explícita e independiente del precio. Comparación solo entre productos del mismo tipo, subcategoría y gama, con máximo de tres.
- Datos oficiales contrastados identificados como verificados, con fecha y fuente; archivo académico claramente identificado como referencia.
- Año de lanzamiento separado de la fecha de revisión. No se promete que un modelo sea el último de su fabricante por estar verificado.
- Precios en GTQ: pendientes se presentan como Por verificar; precios académicos no se usan para decidir. Precios verificados exigen valor, fuente y fecha.
- Recomendación condicional por criterios relevantes cuando todos los datos necesarios están verificados; abstención de ganador global sin evidencia comparable.
- Fotografías locales: modelo exacto con licencia y crédito cuando se dispone de ella; otras identificadas como ilustrativas.
- Persistencia local, enlaces compartibles de comparación e impresión, sin registro.
- Node se utiliza únicamente para desarrollo, generación de HTML y validación. No hay dependencias en producción.

## Brand Commitments

Nombre visible: Álbum Tecnológico. Proyecto académico de la Universidad Mariano Gálvez de Guatemala, con emblema discreto. Lenguaje claro y educativo. Identidad editorial cálida con verde profundo y acento terracota; los productos y sus diferencias lideran la experiencia.

## Evidence on Hand

- Archivo original de 167 fichas: data/products.js.
- Revisión del 9 de octubre de 2026: data/catalog-2026.js, 30 fichas con documentación oficial y dos subcategorías nuevas.
- Fotos locales, licencias de tipografía y atribución visible de fotografías nuevas.
- Validación y pruebas de reglas en scripts/; comprobación de rutas en navegador de escritorio y móvil.

## Product Principles

1. Comparar opciones de la misma función y segmento da contexto.
2. Una fuente verificable importa más que una ficha extensa.
3. Un dato ausente se muestra como ausente y no como cero.
4. La fotografía debe identificarse por lo que representa realmente.
5. La interfaz acompaña la exploración y mantiene visible la selección.
6. Una recomendación debe explicar el criterio y poder abstenerse.

## Accessibility & Inclusion

HTML semántico, controles etiquetados, foco visible, tablas con encabezados, navegación con teclado, contraste suficiente, diseño móvil y alternativas con movimiento reducido. El catálogo requiere JavaScript; la metodología básica sigue visible sin él.
