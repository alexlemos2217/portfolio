# Cinematic redesign — auditoría y decisiones

## Punto de partida

Se clonó `https://github.com/alexlemos2217/portfolio.git` en una carpeta vacía. Rama original: `main`, sin modificaciones locales. Remoto `origin` conservado. Implementación realizada en `feature/cinematic-redesign`.

Stack original: HTML, CSS y JavaScript sin build; GSAP 3.12.5, ScrollTrigger, MapLibre 4.7.1 por CDN. Se conservan HTML/CSS/JS y GSAP/ScrollTrigger.

### Problemas encontrados

- Escenas de 400vh, 380vh, 620vh y 360vh y posteriores overrides contradictorios. Ocho capítulos con pinning y desplazamientos adicionales.
- `enableCinematicMotionStyles()` modificaba CSSOM para desactivar `prefers-reduced-motion: reduce`, contradiciendo la preferencia del usuario.
- El hero dependía de scroll para su entrada; varias secuencias ocultaban la descripción antes de terminar de mostrar el producto.
- Canvas de globo, WebGL y cámara de mapa actualizados durante el scroll, sin necesidad para explorar proyectos.
- Dependencia de CDN para tipografía, motion y mapa; fallback tipográfico con desbordamiento del título.
- Landmarks `main` anidados dentro de las interfaces sintéticas; modal general sin nombre accesible.
- Contraste insuficiente en etiquetas pequeñas de las interfaces existentes.
- Foto JPEG de 460 × 460 con fondo: la resolución limita su ampliación y no se inventaron detalles.

## Decisiones implementadas

- Identidad carbón, blanco cálido y rojo editorial. Nombre en Barlow Condensed, cuerpo en Geist y títulos en Manrope. Hero de capas, fotografía monocromática mediante CSS y edición móvil propia.
- Perfil con hechos suministrados; se conserva formación BIOS y stack del repositorio, sin añadir títulos ni experiencia cuantificada.
- Los diez proyectos existentes se conservan: cinco presentaciones principales y cinco entradas de archivo. Las interfaces privadas continúan siendo composiciones conceptuales con datos sintéticos. No se publican tecnologías de DAW.
- Se reutilizan las interfaces CSS y el caso de Rumbo; se extraen a `project-visuals.css`. El controller conserva datos y traducciones y elimina las cámaras/timelines pesadas.
- La secuencia decorativa globo → mapa se sustituye por una sección de ubicación y enlace público a OpenStreetMap. No se utiliza WebGL ni teselas durante la lectura; esta es una simplificación deliberada de la presentación anterior.
- Alturas naturales, cero pinning, desplazamiento nativo. Se mantienen entrada breve y animaciones de las interfaces con GSAP, sin ocultar títulos, descripciones ni botones al scroll.
- Tipografías locales WOFF2 y GSAP local: sin llamadas externas para renderizar el sitio. Imágenes Rumbo WebP; originales conservados.
- Fotografía segmentada localmente con rembg/U2NetP, matting y contracción suave de un píxel en el alpha. PNG y WebP lossless. Se conserva el RGB original: no se genera ni modifica el rostro. El original permanece en `img/alex.jpg`.
- Diálogos nativos: Escape, foco contenido por el navegador, retorno al disparador y cierre al pulsar fuera del rectángulo del diálogo. Menú con estado accesible, Escape y cierre al navegar.

## Referencia

Se consultó el HTML de la referencia Kairo indicada en la misión. Se toma la dirección editorial y de composición, sin instalar una plantilla ni incorporar código o imágenes de esa página.

## Límites

Las pruebas móviles automatizadas usan Chrome con viewports y entrada táctil simulados; no sustituyen Safari en un iPhone físico. No se verifican años de experiencia, resultados laborales ni tecnologías adicionales. El enlace LinkedIn impide la comprobación HTTP HEAD (405), por lo que requiere apertura manual. Los servicios externos pueden cambiar después de esta revisión.
