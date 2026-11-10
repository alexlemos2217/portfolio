# Alexander Lemos — Cinematic Portfolio

Portfolio bilingüe de Alexander Lemos, Full Stack Developer en Montevideo, Uruguay. Diseño editorial en carbón, blanco cálido y rojo; retrato real con transparencia y proyectos presentados con su contexto técnico.

La iteración actual es **Cinematic V4**, con parallax por capas, cursor contextual y botones magnéticos en dispositivos con mouse. Ver [entrega y auditoría V4](docs/CINEMATIC-V4.md) y [resultados de pruebas V4](docs/CINEMATIC-V4-QA.md). No se ha publicado esta versión.

El retrato actual incorpora superresolución conservadora 2× y halftone editorial en color. [Método, comparación y archivos](docs/PORTRAIT-EDITORIAL.md).

HTML, CSS y JavaScript sin compilación. GSAP 3.12.5 y ScrollTrigger se sirven localmente; no hay dependencias de producción que instalar ni servicios pagos.

## Previsualización

Requiere Node.js para el servidor de desarrollo:

```powershell
node scripts/serve.cjs
```

Abrir `http://127.0.0.1:4173`. Detener con Ctrl+C. El servidor solo expone archivos públicos y bloquea carpetas ocultas. También puede usarse cualquier servidor estático sobre la raíz.

## Archivos

- `index.html`: contenido, metadatos, navegación, interfaces sintéticas y diálogos.
- `style.css`: composición, responsive y accesibilidad.
- `project-visuals.css`: interfaces conceptuales y caso de Rumbo conservados del original.
- `index.js`: idioma persistente, menú, modales y motion opcional.
- `interactions.js` / `interactions.css`: seguimiento centralizado del mouse, cursor, magnetismo, parallax y estados editoriales; sin instalación en dispositivos táctiles o movimiento reducido.
- `fonts/`: fuentes WOFF2 y licencias SIL OFL; `vendor/`: GSAP con avisos originales.
- `img/alex.jpg`: foto original; `alex-cutout.png` y `alex-cutout.webp`: recortes reales con alpha, sin regeneración del rostro.
- `img/alex-portrait-v2.*`: recorte previo y máscara refinados con BiRefNet Portrait y matting, conservados como respaldo.
- `img/alex-enhanced-master.png`: master actual de 920 × 920 sin halftone; `alex-editorial-halftone.png` y `.webp`: tratamiento final en color y archivo de producción. `alex-comparison.png`: comparación con el original.
- `scripts/`: servidor, comprobaciones y utilidades opcionales de imágenes/fuentes.
- `docs/REDESIGN-AUDIT.md`: auditoría y decisiones; `docs/CINEMATIC-QA.md`: validación y límites.

## Contenido e idiomas

Los textos viven en atributos `data-es`/`data-en`; las etiquetas accesibles usan `data-aria-es`/`data-aria-en`. Los detalles de los proyectos están en `projectData` en `index.js`. Se conservan los proyectos y enlaces reales del repositorio original. DAW mantiene tecnologías no publicadas. Los sistemas institucionales usan exclusivamente recreaciones y datos sintéticos.

## Movimiento y rendimiento

Scroll nativo, sin pinning ni alturas artificiales. GSAP solo añade una entrada de aproximadamente un segundo y animaciones puntuales de interfaces. La preferencia de movimiento reducido se respeta incluso si cambia durante la visita. Con JavaScript desactivado siguen disponibles contenido, navegación y enlaces; las ampliaciones mediante diálogo requieren JavaScript. Sin GSAP funcionan idioma, menú y modales.

Tipografía local WOFF2, imágenes secundarias WebP con lazy loading, retrato prioritario. El antiguo globo/mapa animado se sustituye por ubicación editorial y enlace a OpenStreetMap para evitar cargar WebGL durante el recorrido.

## Comprobaciones reproducibles

En una terminal, ejecutar el servidor. En otra, instalar herramientas locales de QA (no son dependencias del sitio):

```powershell
npm.cmd install --no-save --package-lock=false --prefix .tools/browser playwright @axe-core/playwright lighthouse
node --check index.js
node scripts/qa.cjs
node scripts/qa-interactions.cjs
node scripts/qa-fallbacks.cjs
```

El script usa Chrome de Windows instalado en su ruta estándar. Guarda capturas y resultados en `artifacts/` (ignorado por Git). Cubre 1440, 820, 390 y 320 px, modales, idioma, menú móvil, rutas, imágenes, contraste automatizado, contenido sin JS y movimiento reducido.

Para repetir las comprobaciones del motor WebKit con tamaños de iPhone:

```powershell
node .tools/browser/node_modules/playwright/cli.js install webkit
node scripts/qa-webkit.cjs
```

## Entrega y despliegue

Rama `feature/cinematic-v4`, creada conservando los cambios de `feature/cinematic-redesign`, sin force push y sin modificar `main`. El sitio estático no necesita dependencias de build: Netlify puede publicar el resultado de `node scripts/package.cjs`. No publicar `.tools/`, `artifacts/`, `.git/` ni los scripts de QA; la configuración `netlify.toml` prepara un directorio público limpio. No se realizó push ni deploy durante esta entrega.

Consultar los resultados y limitaciones antes de publicar. Pendiente validación manual en Safari/iPhone físico. La fuente original es de 460 × 460; el retrato se exporta a 920 × 920 con mejora neural fuera del rostro y tratamiento conservador en las facciones. No se afirma haber recuperado detalle facial inexistente.
