# Alexander Lemos — Portfolio

Portfolio bilingüe y cinematográfico construido con HTML, CSS y JavaScript. El recorrido usa escenas sticky y timelines reversibles con GSAP/ScrollTrigger, una visualización canvas del viaje hacia Montevideo, MapLibre con cartografía de OpenStreetMap y presentaciones conceptuales de proyectos privados sin datos sensibles.

## Desarrollo local

No requiere compilación ni instalación de dependencias. GSAP y MapLibre se cargan desde jsDelivr; la cartografía usa teselas estándar de OpenStreetMap. Serví la raíz con cualquier servidor estático, por ejemplo:

```bash
npx serve .
```

Abrí la URL local informada por el servidor. Abrir `index.html` directamente también funciona, salvo restricciones del navegador sobre recursos remotos.

## Estructura

- `index.html`: contenido, escenas, navegación y metadatos.
- `style.css`: dirección visual, motion, responsive y modo de movimiento reducido.
- `index.js`: timelines, idioma, navegación, diálogos, globo canvas y configuración de MapLibre.
- `img/alex.jpg`: retrato real utilizado en la escena personal.

Los textos en español e inglés viven en atributos `data-es` y `data-en`. Los datos públicos de contacto y los enlaces reales se mantienen en `index.html`.

## Despliegue

El sitio es compatible con GitHub Pages porque usa rutas relativas y no necesita build. Publicá la raíz de la rama elegida mediante Pages. No se requieren variables de entorno ni servicios pagos.

## Privacidad y fallbacks

Las interfaces de REGCRIM y Secretaría son composiciones conceptuales con datos sintéticos. No contienen capturas ni información institucional. El mapa conserva un enlace de atribución a OpenStreetMap. Con `prefers-reduced-motion: reduce`, las escenas se convierten en una lectura lineal y todo el contenido permanece accesible.
