# Alexander Lemos — Portfolio Full Stack

Portfolio personal en **HTML, CSS y JavaScript**, sin compiladores, paquetes ni backend. Se puede alojar sin costo en GitHub Pages, Netlify o cualquier hosting estático.

## Archivos para reemplazar o agregar

- `index.html` — página completa.
- `style.css` — diseño responsive, tarjetas y tema claro/oscuro.
- `index.js` — menú móvil, filtros de proyectos, preferencia de tema, copia de correo.
- `favicon.svg` — ícono nuevo.

Todos van en la **raíz** del repositorio `portfolio`. La carpeta `img/` antigua no se necesita para esta versión, pero no es necesario borrarla.

## Publicación con GitHub Pages

1. En GitHub abrí el repositorio `alexlemos2217/portfolio`.
2. Subí/reemplazá los archivos de esta carpeta en la rama `main`.
3. Entrá a **Settings → Pages**.
4. En **Build and deployment**, elegí **Deploy from a branch** → `main` y carpeta `/(root)` → **Save**.
5. El sitio debería publicarse bajo `https://alexlemos2217.github.io/portfolio/` una vez desplegado. Si ya tenés otra URL, podés conservarla.

## Personalización pendiente de confirmar

- Las tarjetas de proyectos institucionales y de clientes son **descripciones genéricas**: revisá qué datos tenés permiso de publicar. No incluyas credenciales, información interna ni capturas con datos reales.
- Las miniaturas son **ilustraciones CSS conceptuales**, no capturas de los proyectos.
- El enlace de la Pokédex se conservó del portfolio original; **no se pudo verificar si la demo sigue en línea**.
- La sección de contacto usa el email, GitHub y LinkedIn visibles en tu portfolio original.
- No hay botón de CV porque todavía no se adjuntó un PDF actualizado. Cuando lo tengas, colocá `cv-alexander-lemos.pdf` en la raíz y agregá un enlace con `href="cv-alexander-lemos.pdf" download`.
- Si conseguís screenshots autorizados o demos reales de tus proyectos más recientes, conviene agregarlos a las tarjetas.

## Ver localmente

Abrí `index.html` con el navegador o iniciá un servidor estático:

```bash
python -m http.server 8000
```

y visitá `http://localhost:8000`.

## Privacidad y accesibilidad

- No se envían datos a servicios de terceros, a excepción de las fuentes de Google al cargarse y los enlaces externos que abra el visitante.
- Botones accesibles por teclado, enlaces externos con `rel="noopener noreferrer"`, soporte de movimiento reducido y metaetiquetas básicas.
- No hay formularios que simulen enviar correos: el botón principal abre el cliente de email del visitante.
