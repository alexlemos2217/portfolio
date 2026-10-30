# Alexander Lemos — Portfolio

Portfolio personal bilingüe de **Alexander Lemos**, Full Stack Developer en Montevideo, Uruguay. El sitio transforma una arquitectura estática mínima en una experiencia editorial enfocada en proyectos reales, criterio técnico y atención al detalle.

## La experiencia

- Hero interactivo con un sistema visual original construido íntegramente con CSS.
- Galería editorial de proyectos públicos verificados: Pixel Rush, FARO:09, Pokédex y este Portfolio.
- Perfil profesional y formación en Licenciatura en Sistemas en Universidad ORT Uruguay.
- Explorador de stack accesible mediante pestañas y teclado.
- Interfaz completa en español e inglés, con preferencia guardada localmente.
- Navegación con indicador de sección activa y menú móvil animado.
- Apariciones progresivas con `IntersectionObserver` y microinteracción de cursor.
- Copia de correo con fallback cuando la Clipboard API no está disponible.
- Experiencia responsive específica para desktop, tablet y mobile.
- Soporte para teclado, foco visible, enlace de salto y `prefers-reduced-motion`.

## Stack

El portfolio no utiliza frameworks, bundlers ni servicios pagos.

| Capa | Implementación |
| --- | --- |
| Estructura | HTML5 semántico |
| Sistema visual | CSS, Grid, Flexbox, custom properties y media queries |
| Interactividad | JavaScript moderno y mejora progresiva |
| Animación | CSS, Intersection Observer y Pointer Events |
| Tipografía | Manrope y Geist desde Google Fonts |
| Persistencia | `localStorage` para el idioma |
| Hosting | Compatible con GitHub Pages, Netlify y cualquier hosting estático |

## Proyectos presentados

La selección se apoya exclusivamente en información pública comprobable:

1. **[Pixel Rush](https://github.com/alexlemos2217/pixel-rush)** — endless runner arcade desarrollado con JavaScript, Canvas 2D, HTML y CSS.
2. **[FARO:09](https://github.com/alexlemos2217/faro-09)** — prólogo web narrativo de misterio y ciencia ficción.
3. **[Pokédex](https://github.com/alexlemos2217/Pokedex)** — explorador conectado a una API pública, con [demo en Netlify](https://pokedexalex.netlify.app/).
4. **[Portfolio](https://github.com/alexlemos2217/portfolio)** — este sistema visual bilingüe y responsive.

## Estructura

```text
portfolio/
├── index.html       # Contenido semántico y traducciones
├── style.css        # Tokens, layouts, componentes y responsive
├── index.js         # Idioma, navegación, tabs y animaciones
├── favicon.svg      # Identidad AL
├── img/
│   └── logo.ico     # Recurso legado disponible
└── README.md        # Documentación
```

## Ejecutar localmente

No hay dependencias que instalar. Se recomienda servir la carpeta por HTTP:

```bash
python -m http.server 8000
```

Después, abrir <http://localhost:8000>. También puede abrirse `index.html` directamente, aunque algunas APIs del navegador tienen restricciones bajo `file://`.

## Despliegue

### GitHub Pages

1. Abrir **Settings → Pages** en el repositorio.
2. Elegir **Deploy from a branch**.
3. Seleccionar la rama deseada y la carpeta `/ (root)`.
4. Guardar. No se requiere comando de build.

### Netlify

Importar el repositorio o arrastrar la carpeta. Dejar el comando de build vacío y usar `.` como directorio de publicación.

## Personalización

- El contenido y sus traducciones viven juntos en `index.html` mediante atributos `data-es` y `data-en`.
- Los tokens de color, tipografía, radios y ancho máximo están al comienzo de `style.css`.
- Los enlaces verificados de GitHub, LinkedIn, correo y proyectos están declarados directamente en el HTML.
- Al agregar un texto visible, se deben incluir ambos idiomas para evitar una interfaz mezclada.

## Calidad y accesibilidad

El JavaScript se aplica como mejora progresiva: el contenido y los enlaces principales siguen disponibles sin ejecutarlo. Las animaciones se desactivan para usuarios con reducción de movimiento, los controles exponen sus estados con ARIA y toda la navegación principal es operable con teclado.

## Autor

**Alexander Lemos** — Full Stack Developer, Montevideo, Uruguay.

- [GitHub](https://github.com/alexlemos2217)
- [LinkedIn](https://www.linkedin.com/in/alexlemos22)
- [Email](mailto:alexlemos2297@gmail.com)

Este repositorio no declara una licencia open source.
