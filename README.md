# Alexander Lemos · Portfolio

<p align="center">
  <img src="./favicon.svg" alt="Monograma AL" width="72">
</p>

<p align="center">
  <strong>Portfolio personal de Alexander Lemos</strong><br>
  Desarrollador Full Stack enfocado en backend, datos y experiencias web.
</p>

<p align="center">
  <a href="https://github.com/alexlemos2217">GitHub</a> ·
  <a href="https://www.linkedin.com/in/alexlemos22/">LinkedIn</a> ·
  <a href="https://pokedexalex.netlify.app/">Demo de la Pokédex</a>
</p>

## Sobre el proyecto

Este repositorio contiene un portfolio web estático, responsive y accesible. Presenta la experiencia, formación, stack tecnológico y una selección de proyectos de Alexander Lemos mediante una interfaz editorial de una sola página.

El sitio está pensado para comunicar capacidades de desarrollo Full Stack sin depender de un backend, un framework de frontend ni un proceso de compilación. La interfaz utiliza una identidad visual oscura con acentos verde menta y violeta, tipografías `DM Sans` y `Space Grotesk`, y componentes visuales construidos con HTML y CSS.

## Funcionalidades

- Navegación de una sola página con anclas a las secciones principales.
- Menú responsive para pantallas pequeñas, con cierre al seleccionar una sección, al pulsar `Escape` o fuera del menú.
- Tema claro/oscuro con preferencia persistida en `localStorage` y fallback a la preferencia del sistema.
- Filtro de proyectos por categoría: todos, Full Stack, Mobile y Frontend.
- Copia del correo de contacto mediante la Clipboard API, con fallback visual si el navegador no la habilita.
- Actualización automática del año mostrado en el footer.
- Enlaces de contacto a WhatsApp, correo electrónico, GitHub y LinkedIn.
- Soporte para navegación por teclado, foco visible, enlace para saltar al contenido y reducción de movimiento.
- Diseño responsive para desktop, tablet y mobile.

## Stack tecnológico

| Área | Tecnologías y recursos |
| --- | --- |
| Estructura | HTML5 semántico |
| Estilos | CSS3, variables CSS, Grid, Flexbox, media queries |
| Interactividad | JavaScript vanilla, ES modules no requeridos |
| Tipografías | DM Sans y Space Grotesk desde Google Fonts |
| Iconografía | SVG inline reutilizable mediante `<symbol>` y `<use>` |
| Persistencia local | `localStorage` para el tema visual |
| Publicación enlazada | Netlify para la demo de la Pokédex |
| Control de versiones | Git y GitHub |

No hay `package.json`, dependencias npm, framework, bundler ni servidor de aplicación en este repositorio. El proyecto se ejecuta directamente en el navegador.

## Proyectos presentados

La sección de proyectos refleja el contenido actualmente publicado en el portfolio:

1. **Plataforma de gestión y analítica** — PHP, MySQL, JavaScript y dashboards. Proyecto privado.
2. **Campus para instituto educativo** — JavaScript, Supabase, SQL y UX/UI. Proyecto para cliente.
3. **API y solución de gestión ERP** — ASP.NET Core, C#, SQL Server y API REST. Proyecto privado.
4. **Bios Fitness** — Flutter, Dart, SQLite y patrón BLoC. Proyecto académico.
5. **Sistema de gestión aeroportuaria** — C#, ASP.NET Web Forms y SQL Server. Proyecto académico.
6. **Pokédex interactiva** — HTML, CSS y JavaScript. Incluye una [demo publicada](https://pokedexalex.netlify.app/).

Los proyectos privados se describen sin exponer información interna. Sus tarjetas usan composiciones visuales CSS, no capturas de productos reales.

## Estructura del repositorio

```text
portfolio/
├── index.html       # Contenido, estructura semántica y datos visibles
├── index.js         # Tema, menú, filtros, clipboard y año del footer
├── style.css        # Sistema visual, componentes y responsive design
├── favicon.svg      # Favicon SVG y monograma de la marca
├── img/
│   └── logo.ico     # Icono raster disponible
└── README.md        # Documentación del proyecto
```

### Arquitectura

El sitio sigue una arquitectura estática de tres capas simples:

- **Presentación:** `index.html` define el contenido y las secciones `Sobre mí`, `Proyectos`, `Tecnologías`, `Trayectoria` y `Contacto`.
- **Estilos:** `style.css` centraliza tokens de color, tipografía, layout, estados interactivos, breakpoints y accesibilidad visual.
- **Comportamiento:** `index.js` añade mejoras progresivas sin alterar el contenido base. La página sigue siendo navegable aunque JavaScript no esté disponible.

## Instalación y ejecución local

### Requisitos

- Un navegador moderno.
- Git, únicamente si se desea clonar el repositorio.
- Un servidor HTTP local es recomendable para probar el comportamiento como sitio publicado, aunque no es obligatorio.

### Clonar el repositorio

```bash
git clone https://github.com/alexlemos2217/portfolio.git
cd portfolio
```

### Opción 1: abrir directamente

Abrir `index.html` en el navegador. Es suficiente para revisar la maquetación y la navegación.

### Opción 2: servidor local recomendado

Con Python instalado:

```bash
python -m http.server 8000
```

Luego visitar <http://localhost:8000>.

También se puede utilizar la extensión **Live Server** de VS Code. No se requiere `npm install` ni ningún paso de compilación.

## Despliegue

### GitHub Pages

1. Crear o abrir el repositorio `portfolio` en GitHub.
2. Ir a **Settings → Pages**.
3. En **Build and deployment**, seleccionar **Deploy from a branch**.
4. Elegir la rama a publicar y la carpeta `/ (root)`.
5. Guardar y esperar la URL que GitHub Pages mostrará en esa misma sección.

La configuración actual no requiere una carpeta `dist`, variables de entorno ni comandos de build.

### Netlify

1. Crear un nuevo sitio en Netlify.
2. Importar el repositorio de GitHub o arrastrar la carpeta del proyecto.
3. Dejar vacío el comando de build.
4. Usar `.` como directorio de publicación si Netlify solicita uno.

Para publicar la demo enlazada de la Pokédex se utiliza actualmente <https://pokedexalex.netlify.app/>.

## Capturas y recursos visuales

Este repositorio no incluye capturas de pantalla de las aplicaciones presentadas. Las tarjetas de proyectos son mockups generados íntegramente con HTML/CSS para proteger los proyectos privados y mantener una presentación consistente.

Los recursos visuales disponibles en el repositorio son:

- [`favicon.svg`](./favicon.svg): monograma usado como favicon y en este README.
- [`img/logo.ico`](./img/logo.ico): icono raster disponible.

Cuando existan capturas autorizadas de proyectos, se pueden agregar en `img/` y enlazar desde esta sección sin exponer datos sensibles de clientes.

## Identidad visual

- **Base:** azul casi negro para el tema oscuro y gris muy claro para el tema claro.
- **Acentos:** verde menta para acciones y estados positivos; violeta y celeste para profundidad y contraste.
- **Tipografía:** `Space Grotesk` en títulos y `DM Sans` en texto de lectura.
- **Marca:** monograma `AL.` y lenguaje visual orientado a código, datos y producto.

La identidad coincide con la presentación personal del sitio: nombre, ubicación en Montevideo, foco Full Stack y enlaces profesionales de GitHub y LinkedIn.

## Calidad y automatización propuesta

Actualmente el repositorio no incluye GitHub Actions ni una suite de tests automatizados. Estas son mejoras concretas que se pueden incorporar sin cambiar la lógica de negocio:

- Validar HTML y CSS en cada pull request.
- Ejecutar un verificador de enlaces externos e internos.
- Auditar accesibilidad con Lighthouse o `pa11y`.
- Comprobar el formato y errores básicos de JavaScript.
- Publicar automáticamente a GitHub Pages cuando se actualice la rama principal.
- Ejecutar Lighthouse en CI y conservar un umbral mínimo de rendimiento y accesibilidad.

Estas acciones son oportunidades futuras; no se presentan como capacidades ya implementadas.

## Contacto

- **GitHub:** [alexlemos2217](https://github.com/alexlemos2217)
- **LinkedIn:** [alexlemos22](https://www.linkedin.com/in/alexlemos22/)
- **WhatsApp:** [+598 99 025 324](https://wa.me/59899025324)
- **Email:** [alexlemos2297@gmail.com](mailto:alexlemos2297@gmail.com)

## Licencia

Este repositorio no declara una licencia open source. Para reutilizar el código o los recursos visuales, consultar previamente con el autor.
