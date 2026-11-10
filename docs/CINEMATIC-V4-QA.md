# Cinematic V4 — resultados de validación

10 de noviembre de 2026. Implementación local en `feature/cinematic-v4`. No se realizó push ni deploy. El informe de cambios, archivos y método fotográfico está en [CINEMATIC-V4.md](CINEMATIC-V4.md).

## Pruebas funcionales y accesibilidad

`node scripts/qa.cjs`: aprobado en Chrome a 1440 × 1000, 820 × 1180, 390 × 844 y 320 × 740.

- Cero errores JavaScript y cero respuestas HTTP de error en recursos.
- Un único `main`, cinco proyectos principales y los cinco proyectos del archivo conservados.
- Imágenes cargadas, rutas locales y anchors internos válidos.
- Sin desplazamiento horizontal en los cuatro tamaños.
- Los cinco diálogos abren, cierran con Escape y devuelven foco al botón de origen.
- Cambio español/inglés y persistencia al recargar comprobados.
- Menú móvil: apertura, estado accesible, navegación y cierre comprobados.
- Contenido visible sin JavaScript; cero ScrollTriggers con movimiento reducido.
- Cero infracciones en axe-core con reglas WCAG 2 A/AA y WCAG 2.1 AA. Se corrigió el contraste de las notas contextuales añadidas.
- Cero capítulos con pinning.

Datos completos: `artifacts/qa-results.json`. Capturas generales en `artifacts/desktop-hero.png`, `iphone-hero.png`, `tablet-hero.png`, `small-hero.png` y sus equivalentes de proyectos.

`node scripts/qa-fallbacks.cjs`: aprobado. Sin GSAP siguen funcionando modales e idioma; deep link utilizable; cambios de movimiento reducido durante la visita comprobados. Se conservó la exportación PNG de metadatos sociales.

## Interacciones reales del mouse

`node scripts/qa-interactions.cjs`: aprobado. Chrome, viewport de escritorio 1440 × 1000.

| Comprobación | Resultado |
| --- | --- |
| Cursor nativo antes del primer movimiento | Conservado |
| Parallax medido del retrato | +11,9 px horizontal |
| Parallax medido de tipografía | −6,3 px horizontal |
| Parallax medido de luz | +16,8 px horizontal |
| Botón magnético cerca de su borde | +6 px; dentro del límite |
| Retorno del hero y botones al salir | 0 px |
| Hovers individuales de los cinco proyectos | Movimiento medido en los cinco |
| Estados de cursor ES/EN | EXPLORAR/EXPLORE; ABRIR/OPEN |
| Diálogo en la capa superior | Cursor nativo y cero infracciones axe |
| Teclado antes de mover el mouse | Sin errores; cursor nativo disponible |
| Movimiento reducido y colores forzados en vivo | Cursor retirado; reinstalación sin duplicados |
| Loop en reposo | Contador de cuadros estable |
| Hero fuera de pantalla | Regresa a posición neutra |

Se verificó también ausencia de desbordamiento a 320, 390, 700, 820 y 1920 px, con cursor desactivado en los tres contextos táctiles.

Durante una muestra de dos segundos de movimiento:

- 118 intervalos de cuadro registrados.
- Mediana: 16,7 ms; percentil 95: 16,8 ms, aproximadamente 60 cuadros/s en esta muestra.
- Cero tareas largas durante la interacción.
- Trabajo máximo observado del controlador por cuadro: 1,4 ms.
- 9 pasadas de lectura de geometría frente a 134 eventos de puntero durante el recorrido completo: no se lee layout por cada movimiento.
- CLS observado durante la sesión funcional completa: aproximadamente 0,003. Esta sesión incluye carga, navegación, idiomas y modales; no equivale al CLS de Lighthouse de una carga inicial.

La prueba de rueda nativa avanzó 3200 px, con cero tareas largas registradas y cero escenas fijadas. Estas mediciones describen esta máquina y este recorrido, no garantizan el mismo FPS en todos los equipos.

Resultados: `artifacts/v4/interaction-results.json`. Capturas: `desktop-hero.png`, `desktop-parallax.png`, `project-*-hover.png` y `hero-*.png` en `artifacts/v4/`.

## WebKit y tamaños de iPhone

`node scripts/qa-webkit.cjs`: aprobado en Playwright WebKit 27.2 sobre Windows.

| Perfil simulado | Viewport | Resultado |
| --- | --- | --- |
| iPhone SE | 375 × 667 | Aprobado |
| iPhone 13 | 390 × 844 | Aprobado |
| iPhone horizontal | 844 × 390 | Aprobado |

En los tres: fotografía cargada, nombre visible, cero desbordamiento horizontal, cero errores JS, sin seguimiento del mouse, cambio de idioma, diálogos y modo de movimiento reducido comprobados. Menú móvil probado en los dos viewports verticales; en horizontal se usa la navegación de escritorio según el breakpoint del sitio.

Resultados: `artifacts/v4/webkit-results.json`. Capturas: `artifacts/v4/webkit-iphone-se.png`, `webkit-iphone-13.png` y `webkit-iphone-landscape.png`.

WebKit simulado ofrece cobertura del motor de renderizado; **no sustituye una prueba en Safari/iPhone físico**. Los contextos táctiles de Chrome tampoco certifican un dispositivo Android físico de gama media.

## Fotografía

Comparación visual inspeccionada: `artifacts/v2/portrait/comparison-birefnet-portrait.jpg`, con original, U2NetP previo y BiRefNet Portrait refinado sobre negro, gris, blanco y `#0a0a09`. Se revisaron ampliaciones de cabello, orejas y hombros. La nueva extracción reduce el contorno claro visible en la versión anterior; no se aplicaron sombras agresivas para ocultarlo.

Comprobaciones numéricas ejecutadas:

- Original de 460 × 460 conservado.
- Master RGBA con alpha mínimo 0 y máximo 255.
- Interior opaco y región central del rostro con RGB exactamente igual a la fotografía fuente.
- WebP lossless con alpha idéntico al master y valores RGB idénticos en todos los píxeles visibles.

Se inspeccionó su integración final en Chrome y WebKit. La fuente original limita la nitidez en pantallas Retina; no se inventaron detalles ni se generó una nueva cara.

## Lighthouse móvil

Informe final en `artifacts/v4/lighthouse-compressed.report.html` y `.json`, URL de revisión `http://127.0.0.1:4174`, servidor con gzip y precarga de fuentes. Perfil móvil y throttling simulado predeterminados de Lighthouse.

| Categoría | Puntaje |
| --- | ---: |
| Rendimiento | 89 |
| Accesibilidad | 100 |
| Buenas prácticas | 100 |
| SEO | 100 |

FCP: **1,4 s**. LCP: **3,2 s**. Total Blocking Time: **220 ms**. CLS: **0**. Speed Index: **2,9 s**.

Antes de habilitar gzip y precargar la fuente de cuerpo, se midieron 80 de rendimiento, FCP 2,3 s y LCP 4,2 s en el servidor de revisión sin compresión (`artifacts/v4/lighthouse-mobile.report.*`). La comparación incluye el cambio de configuración HTTP: no se atribuye toda la diferencia a código del sitio ni se considera una medición de producción. En Netlify la compresión debe verificarse después del despliegue autorizado.

Quedan oportunidades de carga inicial: parte del JS de GSAP/ScrollTrigger no se utiliza, pueden generarse variantes responsive más pequeñas del retrato y minificarse los archivos al publicar. Las interacciones táctiles ya se desactivan por capacidad del dispositivo; no se eliminaron las animaciones de entrada ni las de proyectos para mejorar la medición.

## Verificaciones de código y empaquetado

`node --check index.js`, `node --check interactions.js`, `node --check scripts/qa-interactions.cjs`, `node --check scripts/qa-webkit.cjs`, compilación sintáctica de `scripts/refine-portrait.py`, `git diff --check` y `node scripts/package.cjs` ejecutados correctamente.

`dist/` contiene el sitio estático y los módulos de interacción, fuentes e imágenes. No contiene modelos de segmentación, `.tools`, Git, credenciales ni capturas de pruebas. La configuración de Netlify está preparada; no se ha ejecutado un despliegue.

Los enlaces públicos ya comprobados en la primera entrega se conservan. LinkedIn bloqueó la comprobación automática HEAD con 405 y requiere comprobación manual. No se envió correo.
