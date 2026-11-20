# Alexander Lemos — Backend & Full-Stack Software Developer Portfolio

Portfolio técnico bilingüe (ES/EN) construido con **HTML5 semántico, CSS modular y JavaScript ES Modules nativos**, sin frameworks pesados ni scroll-jacking.

Diseñado con estética *Tactile Editorial Engineering*: foco claro en ingeniería backend (`C#/.NET`, `Java/Spring Boot`, `PHP`, `SQL`), 60fps reales, atmósfera de iluminación ambiental dinámica al scroll, accesibilidad por teclado, soporte estricto de `prefers-reduced-motion: reduce` y artefactos interactivos propios.

## Qué incluye

- **Hero Editorial + bloque `NOW` en vivo**: posicionamiento inmediato, CTAs limpios (`Ver proyectos ↓`, `Copiar email`, `GitHub`, `LinkedIn`) y reloj en tiempo real de Montevideo (`UYT`).
- **Iluminación ambiental viva + barra de lectura 2px**: halo/aurora GPU que transiciona de color según la sección activa y barra de progreso superior ultra-fina.
- **Showcase de proyectos con parallax interno y Case Study Drawer**:
  - **BIOS Work** (`Java · Spring Boot · Spring Security · SQL`): simulador interactivo de matriz RBAC por rol (`ADMIN / STAFF / USER`).
  - **BIOS Fitness** (`Flutter · Dart · BLoC · SQLite`): mockup móvil flotante con anillo de progreso y métricas semanales.
  - **Sistemas de Gestión Operativa & Datos** (`PHP · MariaDB / MySQL · SQL · NDA`): vista de arquitectura en capas y consulta SQL indexada.
  - **Archive interactivo**: decodificación de texto sutil (`scramble`) al hover + vista previa flotante que sigue al cursor.
- **Systems Lab**:
  - **Live API Playground**: consola interactiva (`GET /api/v1/alex`, `/stack`, `/projects`, `/contact`, comandos `help`, `clear`) con syntax highlighting JSON y latencia real.
  - **Interactive Architecture Flow**: diagrama SVG con 3 escenarios clickeables (`200 OK Cache Miss ~18ms`, `200 OK Cache Hit ~2ms`, `401 Unauthorized`) y consola de logs con timestamps reales.
- **Paleta de comandos (`Ctrl + K` / `⌘ + K`) y micro-sonidos Web Audio opcionales** (apagados por defecto, activables desde la navbar sin archivos externos).

## Estructura del proyecto

```text
.
├── index.html
├── favicon.svg
├── og-image.svg
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/
    │   ├── tokens.css
    │   ├── base.css
    │   ├── layout.css
    │   ├── showcase.css
    │   ├── lab.css
    │   ├── components.css
    │   └── responsive.css
    ├── img/
    │   ├── alex.jpg
    │   └── og-image.png
    └── js/
        ├── main.js
        ├── data/
        │   └── content.js
        └── modules/
            ├── apiLab.js
            ├── archFlow.js
            ├── clock.js
            ├── commandPalette.js
            ├── cursor.js
            ├── drawer.js
            ├── i18n.js
            ├── scramble.js
            ├── sound.js
            └── tiltGlow.js
```

## Desarrollo local

Por usar ES Modules (`type="module"`), serví la raíz con cualquier servidor HTTP estático:

```bash
npx serve .
```

o con Python:

```bash
python -m http.server 8080
```

## Despliegue

Compatible de forma directa con **GitHub Pages** desde la raíz de `main`.
