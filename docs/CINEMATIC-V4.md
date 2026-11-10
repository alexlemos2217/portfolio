# Cinematic V4 — entrega local

## Estado y alcance

Trabajo en `feature/cinematic-v4`, creada desde la rama de rediseño existente conservando todos los cambios locales. El remoto `origin` y `main` no se modificaron. Hay una copia local del código previo a los ajustes V4 en `.tools/checkpoints/pre-v4/`, ignorada por Git.

Se mantiene HTML/CSS/JavaScript con GSAP 3.12.5 y ScrollTrigger. No se incorporan dependencias de producción, servicios pagos ni scroll artificial. No se realizó deploy ni push.

## Auditoría de interacción y referencia

La primera versión tenía entrada temporal, revelados de proyectos y una línea de progreso. No implementaba seguimiento del mouse, cursores contextuales, parallax ni magnetismo. El arco rígido detrás del retrato, el filtro monocromático y la ampliación a 570 px acentuaban la percepción de una silueta recortada.

Se abrió la página pública de Kairo en Chrome y se capturó `artifacts/v2/reference-page.png`. Se pudo observar la composición promocional; no apareció una demo final interactiva accesible. El material se ofrece detrás del acceso Pro. Por eso no se atribuyen al sitio final efectos del mouse no observados. No se copió código, texto, fotografía ni recursos de esa página, ni se implementaron agentes, guías de construcción o cursores ficticios.

## Fotografía

Fuente de mayor resolución disponible: `img/alex.jpg`, 460 × 460. Se conservan el original y los recortes U2NetP anteriores (`alex-cutout.*`).

Se comparó el recorte anterior con **BiRefNet Portrait**, procesado localmente mediante rembg/ONNX Runtime. La máscara nueva se refinó con un trimap estrecho y closed-form alpha matting (`pymatting.estimate_alpha_cf`). Se suprimieron residuos claros de baja opacidad en el contorno y se recuperó el color de primer plano de los píxeles de alpha parcial con `estimate_foreground_ml`. Esta última operación afecta exclusivamente la franja de transición, para descontaminar el fondo anterior; el interior opaco conserva los valores RGB originales. No se regeneró el rostro, se cambió su expresión, se alteraron proporciones ni se aplicaron filtros de belleza.

La comprobación del script exige RGB idéntico en el interior opaco y en una región central del rostro. Se inspeccionaron comparaciones sobre negro absoluto, gris medio, blanco y fondo oscuro, además de ampliaciones de cabello, ambas orejas y hombros. No se aplicó desenfoque global ni erosión uniforme del cabello en esta versión.

Archivos nuevos:

- `img/alex-portrait-v2.png`: master RGBA.
- `img/alex-portrait-v2-alpha.png`: máscara final.
- `img/alex-portrait-v2.webp`: versión lossless del master utilizada por la V4 del sitio.
- `artifacts/v2/portrait/comparison-birefnet-portrait.jpg`: original / recorte previo / recorte nuevo sobre cuatro fondos.
- `artifacts/v2/portrait/birefnet-portrait-*.png`: máscara del modelo y ampliaciones de inspección.

El sufijo `v2` identifica la segunda extracción de la fotografía; la composición y entrega del sitio son V4. El modelo de desarrollo pesa aproximadamente 973 MB y permanece en `.tools/models/`, excluido de Git y del empaquetado de producción. El navegador no carga modelos ni librerías de imagen.

## Hero y proyectos

Hero de altura natural y pantalla completa en escritorio, nombre monumental, luz ambiental discreta y retrato en color natural sin arco ovalado ni filtros faciales. La foto se limita a 460 px de ancho CSS en escritorio y se reencuadra en móvil. Una máscara gradual únicamente en la base integra el final de la ropa en la superficie; la silueta tiene transparencia real en el archivo.

Se preservan la jerarquía y las acciones. Se añade al hero la condición de estudiante de Licenciatura en Sistemas en ORT, sin presentar el título como obtenido. La entrada dura aproximadamente un segundo y coordina tipografía, revelado del retrato e información; no bloquea navegación y el parallax se habilita al finalizar. El contenido se conserva si no hay JavaScript o GSAP.

Los diez proyectos, datos, enlaces y modales se conservan. DAW invierte el orden visual en escritorio; Rumbo recibe una composición destacada con imágenes a todo el ancho. REGCRIM, DAW y Secretaría continúan usando exclusivamente interfaces conceptuales y datos sintéticos. Los movimientos de entrada varían por proyecto sin ocultar texto ni controles.

## Sistema de mouse

`interactions.js` centraliza un único listener `pointermove` y un único planificador requestAnimationFrame que se detiene al asentarse los valores.

- Cursor editorial de 8 px; estados compactos para links y etiquetas EXPLORAR/EXPLORE y ABRIR/OPEN. Contraste por mezcla de diferencia. El cursor nativo se oculta después de posicionar el reemplazo; reaparece con teclado, blur o abandono de la ventana. En diálogos nativos se conserva el cursor del navegador porque estos pertenecen a la capa superior.
- Parallax con intensidades diferentes: tipografía hasta 9 px en sentido contrario, retrato hasta 17 px, luz hasta 24 px y detalle lateral hasta 13 px. Sin rotar el rostro. Retorno al abandonar el hero.
- Botones principales, detalles, idioma y contacto: radio cercano de 24 px y movimiento máximo de 6 × 5 px, con retorno suave. No se modifican dimensiones ni posición de layout.
- Proyectos: REGCRIM corrige ligeramente su inclinación y reacciona en el mapa conceptual; DAW desplaza líneas internas; Secretaría responde con filas alternadas; Rumbo desplaza imágenes secundarias; NEXUS mueve esfera y módulos editoriales. Títulos, notas y flechas tienen estados coherentes de hover y foco.
- Navegación: subrayados, sección activa con `aria-current="location"`, foco visible y flechas de enlaces destacados.

Los desplazamientos usan la propiedad CSS `translate` y variables propias para no competir con `transform`, que sigue bajo control de GSAP. Las lecturas de geometría se agrupan antes de las escrituras y solo se repiten tras invalidaciones, al reanudar el seguimiento. El scroll restablece estados y no recalcula geometría en cada cuadro. Los componentes inactivos en reposo no reciben escrituras.

La instalación requiere hover, puntero fino, movimiento permitido y colores forzados desactivados. No se instala en móvil táctil, movimiento reducido o alto contraste forzado. Al cambiar preferencias se abortan listeners, se retira el cursor y se eliminan los desplazamientos. Se limpian observadores y recursos al salir y se restauran al regresar desde bfcache.

## Archivos principales

`index.html`, `index.js`, `interactions.js`, `interactions.css`, imágenes de retrato, `scripts/refine-portrait.py`, `scripts/qa-interactions.cjs` y `scripts/package.cjs`. Se conserva `style.css` como base y `project-visuals.css` como definición de las interfaces conceptuales. Documentación y README actualizados.

## Revisión local

```powershell
node scripts/serve.cjs
```

Abrir `http://127.0.0.1:4173`. Si el servidor de una revisión previa sigue abierto, utilizar esa misma dirección. Para las comprobaciones automatizadas:

```powershell
node --check index.js
node --check interactions.js
node scripts/qa.cjs
node scripts/qa-interactions.cjs
node scripts/qa-fallbacks.cjs
node scripts/package.cjs
```

Las herramientas de QA se instalan en `.tools/browser` como documenta el README. `scripts/refine-portrait.py` utiliza el entorno Python de desarrollo con rembg, pymatting, scipy y Pillow; `--reuse-mask` permite repetir el matting desde la máscara local sin volver a descargar ni ejecutar el modelo.

El servidor de revisión admite compresión gzip de HTML/CSS/JS y caché de compresión invalidada por cambios del archivo. Para usar otro puerto: `node scripts/serve.cjs --port=4174`. La lectura del contenido conserva scroll nativo; la compresión afecta solo la transferencia inicial.

## Límites

La fuente fotográfica es de 460 × 460: no se inventó detalle para pantallas Retina ni se generó una versión de mayor resolución. Las pruebas táctiles automatizadas en Chrome no certifican Safari en un iPhone físico ni el rendimiento de un Android de gama media real. Las métricas son de laboratorio local. La revisión automatizada de accesibilidad no sustituye una auditoría completa con lectores de pantalla.

Se comprobó también el motor WebKit en tamaños de iPhone verticales y horizontal. Los resultados medidos y las capturas finales se detallan en `docs/CINEMATIC-V4-QA.md`. El sitio queda para revisión local, sin modificar producción.
