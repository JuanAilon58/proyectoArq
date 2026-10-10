# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Estudiantes y personas que quieren comprender diferencias entre productos tecnológicos antes de elegir. Lo usan como apoyo académico y guía de consulta.

## Product Purpose

Álbum Tecnológico permite explorar una colección por categoría y subcategoría, revisar fichas con fuentes y comparar dos productos A contra B. Toda ficha tiene comparativa: fotos grandes, ventajas por fila, especificaciones y veredicto final, según la referencia visual fijada por el usuario.

## Positioning

Guía educativa de consulta. Sin carrito, venta, pagos, cuentas ni filtro de precio. La recomendación debe poder revisarse y no simular una certeza que los datos no ofrecen.

## Operating Context

Se consulta en computadora o teléfono durante investigación, tareas o evaluación de alternativas. La navegación comienza en el índice, continúa por tipo y gama y termina en una ficha o comparación. Filtros en la URL y guardados locales permiten regresar.

## Capabilities and Constraints

- Sitio estático HTML/CSS/JavaScript clásico, con rutas existentes conservadas y sin dependencia de APIs externas para funcionar.
- Clasificación editorial explícita e independiente del precio. Comparación de dos productos dentro de su subcategoría; smartphones dentro de su gama. La alternativa sugerida prioriza mismo tipo y gama, sin impedir consultar otros tipos de la sección.
- Datos oficiales contrastados identificados como verificados, con fecha y fuente; archivo académico claramente identificado como referencia.
- Año de lanzamiento separado de la fecha de revisión. No se promete que un modelo sea el último de su fabricante por estar verificado.
- Precios en GTQ: pendientes se presentan como Por verificar; precios académicos no se usan para decidir. Precios verificados exigen valor, fuente y fecha.
- Ventajas derivadas de las mismas filas resaltadas. Criterios explícitos de capacidad, frecuencia, velocidades declaradas y funciones incluidas; no se puntúan GHz, núcleos, megapíxeles, mAh, longitud o color como calidad global. El veredicto siempre muestra contexto; las fichas académicas se identifican y los tipos diferentes no generan ganador.
- Fotografías locales: modelo exacto con licencia y crédito cuando se dispone de ella; otras identificadas como ilustrativas.
- Persistencia local, enlaces compartibles de comparación e impresión, sin registro.
- Las categorías muestran sus comparativas A/B desde la entrada, con vista previa de especificaciones y enlace al resultado completo. El álbum general mantiene la consulta de fichas individuales.
- Node se utiliza únicamente para desarrollo, generación de HTML y validación. No hay dependencias en producción.

## Brand Commitments

Nombre visible: Álbum Tecnológico. Proyecto académico de la Universidad Mariano Gálvez de Guatemala, con emblema discreto. Lenguaje claro y educativo. La portada y el catálogo conservan la identidad editorial cálida. El comparador sigue la imagen vinculante del usuario: fondo #141821, sans compacta, Producto A azul y Producto B violeta, VS central, valores destacados en verde y veredicto al pie.

## Evidence on Hand

- Archivo original de 167 fichas: data/products.js.
- Revisión del 9 de octubre de 2026: 198 productos, 50 subcategorías y 32 fichas con documentación oficial. Se verificó la variante Sabrent CB-SFK3 y se añadió StarTech SATA12 con fotografías de fabricantes; 166 fichas conservan condición académica.
- Fotos locales, licencias de tipografía y atribución visible de fotografías nuevas.
- Validación y pruebas de reglas en scripts/; comprobación de rutas en navegador de escritorio y móvil.

## Product Principles

1. Todas las fichas deben poder abrir una comparativa; las diferencias de función y plataforma deben quedar explícitas.
2. Una fuente verificable importa más que una ficha extensa.
3. Un dato ausente se muestra como ausente y no como cero.
4. La fotografía debe identificarse por lo que representa realmente.
5. La interfaz acompaña la exploración y mantiene visible la selección.
6. Una recomendación debe explicar el criterio y poder abstenerse.

## Accessibility & Inclusion

HTML semántico, controles etiquetados, foco visible, tablas con encabezados, navegación con teclado, contraste suficiente, diseño móvil y alternativas con movimiento reducido. El catálogo requiere JavaScript; la metodología básica sigue visible sin él.
