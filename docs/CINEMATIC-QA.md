# Validación del rediseño

Registro de la primera entrega, anterior al refinamiento V4. Para los resultados actuales, consultar `CINEMATIC-V4-QA.md` y `CINEMATIC-V4.md`.

Fecha: 10 de noviembre de 2026. Sitio servido localmente con `node scripts/serve.cjs`; Chrome instalado, controlado con Playwright. No se ha desplegado ni enviado al remoto.

## Resultados funcionales

`node scripts/qa.cjs`: aprobado en 1440 × 1000, 820 × 1180, 390 × 844 y 320 × 740.

- Cero excepciones JavaScript y cero respuestas HTTP de error en recursos del sitio.
- Un único landmark `main`, cinco proyectos principales y cinco entradas de archivo conservados.
- Imágenes cargadas y anchors internos válidos.
- Sin desplazamiento horizontal en los cuatro tamaños, incluyendo el modo sin JS y movimiento reducido.
- Cuatro diálogos generales y el caso de Rumbo: apertura, Escape, cierre y retorno de foco al botón de origen.
- Español/inglés, cambio del idioma del documento y persistencia tras recargar.
- Menú móvil: apertura, actualización de `aria-expanded`, navegación y cierre.
- Contenido visible sin JavaScript; con movimiento reducido no se crean ScrollTriggers.
- Cero infracciones detectadas por axe-core con reglas WCAG 2 A/AA y WCAG 2.1 AA en los cuatro tamaños. Se corrigió el contraste de etiquetas de las interfaces heredadas.
- Cero elementos fijados por ScrollTrigger. Los triggers de presentación se descartan al ejecutarse; el número restante depende del scroll y viewport.
- `node scripts/qa-fallbacks.cjs`: modales e idioma funcionan con GSAP bloqueado; deep link utilizable y cambio de movimiento reducido durante la visita comprobado. Se exportó una imagen social PNG a partir del SVG editorial.

Las capturas se guardan en `artifacts/desktop-hero.png`, `iphone-hero.png`, `small-hero.png`, `tablet-hero.png` y sus equivalentes `*-projects.png`. También se capturaron `no-js-hero.png` y `reduced-hero.png`. Resultados en `artifacts/qa-results.json`. Estos archivos de QA están ignorados por Git.

## Lighthouse móvil

Chrome headless; perfil móvil y throttling simulados predeterminados de Lighthouse. Es una medición local de laboratorio y puede variar por CPU, carga del equipo y hosting.

| Categoría | Puntaje |
| --- | ---: |
| Rendimiento | 83 |
| Accesibilidad | 100 |
| Buenas prácticas | 100 |
| SEO | 100 |

FCP: 2,4 s. LCP: 3,8 s. Total Blocking Time: 160 ms. CLS: 0. Speed Index: 2,4 s.

La primera medición dio 81 de rendimiento y 230 ms de bloqueo; después de eliminar imports CSS encadenados, precargar el retrato/fuente principal y ajustar imágenes, la medición final dio 83 y 160 ms. No se presenta esta variación como una medición de campo ni como garantía de velocidad en todos los dispositivos.

Informes completos: `artifacts/lighthouse-final.report.html` y `.json`. Oportunidades restantes: reducir JS no utilizado de GSAP/ScrollTrigger, imágenes responsive con variantes de menor tamaño y compresión HTTP/caché de producción. La entrega conserva animaciones, calidad de retrato y stack original; no se han eliminado todas las animaciones para subir el puntaje.

## Recursos y fotografía

`node --check index.js`, `node scripts/package.cjs` y `git diff --check` ejecutados correctamente. El empaquetado produce `dist/` con archivos públicos, sin herramientas, modelos, Git ni capturas.

PNG de 460 × 460: RGB idéntico al JPEG decodificado original; canal alpha con extremos 0 y 255. WebP lossless usado en el hero. Original conservado. Recorte local rembg/U2NetP, matting y refinado suave de bordes. Inspección visual sobre carbón; no se ha generado una nueva cara ni añadido detalle ficticio.

Fuentes convertidas de TTF a WOFF2: aproximadamente 681 KB → 243 KB incluyendo el CSS (solo se descargan las variantes utilizadas). Licencias OFL incluidas. GSAP conserva su aviso y enlace de licencia en los archivos originales.

## Enlaces externos

HEAD 200: perfil GitHub, Pixel Rush, FARO:09, Pokédex y OpenStreetMap. LinkedIn devuelve 405 a HEAD: comprobación automática inconclusa, enlace original conservado. El enlace `mailto:` tiene la dirección del repositorio; no se envió correo ni se verificó su entrega.

## Límites y pendientes

- Chrome con viewport táctil simulado no equivale a Safari/iOS ni a un Android físico de gama media. Validar manualmente esos dispositivos antes de dar por comprobado su comportamiento específico.
- Las verificaciones automáticas de accesibilidad no sustituyen una revisión completa con lector de pantalla.
- Las ampliaciones de proyecto son una mejora con JS; sin JS se conserva el resumen y los enlaces públicos.
- Los metadatos de sitemap/robots conservan el dominio público del repositorio. Si se elige otro dominio para Netlify, actualizarlos al dominio definitivo.
- No se realizó push ni deploy. Configuración de Netlify y directorio público preparados para revisión.
