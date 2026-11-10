# Retrato editorial en color — procesamiento y entrega

## Resultado

Se generó un retrato de **920 × 920 px (2×)** desde `img/alex.jpg` de 460 × 460, con mejora neural conservadora fuera del rostro, tratamiento fotográfico moderado, alpha real y halftone progresivo en color. Se integró en el hero existente sin cambiar composición, proyectos, navegación, idiomas ni animaciones.

| Archivo | Uso |
| --- | --- |
| `img/alex-enhanced-master.png` | Master RGBA de 920 × 920, sin halftone |
| `img/alex-editorial-halftone.png` | Tratamiento editorial final con alpha |
| `img/alex-editorial-halftone.webp` | Imagen de producción, 118.178 bytes, aproximadamente 115 KiB |
| `img/alex-comparison.png` | Original / mejora conservadora / resultado editorial, con recortes faciales a la misma escala visual |

Se conservan el JPEG original y todos los recortes anteriores.

Prueba visual posterior solicitada: el hero aplica `grayscale(.65)` para un blanco y negro suave que conserva parte del color natural y acompaña el rojo editorial. Los archivos de imagen, el master, la transparencia y el halftone permanecen en color; el ajuste se realiza únicamente en la presentación CSS.

## Investigación y comparación ejecutada

Se consultaron las fuentes oficiales de [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN), [su configuración de inferencia y pesos](https://github.com/xinntao/Real-ESRGAN/blob/master/inference_realesrgan.py), [RRDBNet de BasicSR](https://github.com/XPixelGroup/BasicSR/blob/master/basicsr/archs/rrdbnet_arch.py) y [SwinIR](https://github.com/JingyunLiang/SwinIR). SwinIR se evaluó documentalmente; **no se ejecutó** y no se atribuyen a ese modelo resultados sobre esta foto.

Se ejecutaron localmente, en CPU, dos modelos con sus pesos oficiales:

| Método | Salida neural | Tiempo local observado | Evaluación visual de esta fotografía |
| --- | --- | ---: | --- |
| RealESRGAN_x2plus | 920 × 920 | 16,4 s | Mejor textura perceptual en cabello y camiseta; modifica detalles de ojos y dientes si se aplica directamente |
| RealESRNet_x4plus | 1840 × 1840 | 57,5 s | Resultado demasiado liso/plástico en el rostro para esta fuente; descartado como acabado final |

La comparación completa está en `artifacts/portrait-editorial/model-comparison.png`. Los archivos `esrgan2-raw.png` y `esrnet4-raw.png` permiten inspeccionar los resultados sin protección facial. Los tiempos son de inferencia en esta máquina, sin contar descarga o instalación; no son una comparación general de rendimiento entre modelos.

Se eligió **Real-ESRGAN 2× mezclado al 65% fuera de la zona facial protegida**. Una ampliación Lanczos del original sirve de control y de base conservadora facial. La entrega completa no es una ampliación bicúbica: contiene inferencia neural realmente ejecutada en las regiones permitidas.

No se afirma que el modelo haya recuperado detalles reales de la escena: sus detalles son estimaciones. No existe una fotografía de alta resolución de referencia para medir recuperación fiel de textura. Se priorizó autenticidad sobre máxima nitidez aparente.

## Protección de identidad

No se utilizó GFPGAN, CodeFormer ni ningún modelo de reconstrucción facial. Se trazó una región protegida alrededor de cara, orejas y barba, con transición suave exterior y exclusiones explícitas de ojos/cejas, nariz, sonrisa y dientes.

Dentro de esa región, la contribución de superresolución neural es **cero**. Los píxeles proceden del original ampliado con Lanczos y un Unsharp Mask leve y determinista. No se deformó la geometría ni se cambió pose, expresión o proporciones. El master conserva la textura de piel existente en lugar de reemplazarla por piel estimada por el modelo.

El ajuste de luz y color modifica valores fotométricos, por lo que no se declara igualdad RGB absoluta entre el original y el master. La igualdad comprobada es la ausencia de mezcla neural en las zonas protegidas y la ausencia de halftone en los píxeles centrales del rostro respecto del master.

## Acabado fotográfico y transparencia

- Balance de blancos moderado mediante una muestra neutral del fondo original; multiplicadores limitados a ±1,5%.
- Ligero ajuste global de tonos medios y contraste; no se trataron los dientes de forma selectiva ni se blanquearon.
- Nitidez conservadora sobre la base original; no se aplicó suavizado de belleza.
- Máscara alpha revisada de la extracción BiRefNet/matting anterior, ampliada como **máscara**, sin usar un retrato procesado como nueva fotografía base.
- Descontaminación matemática de color únicamente en el contorno semitransparente mediante `estimate_foreground_ml`, sin sombras para ocultar el recorte.

La inspección local incluye fondos negro, gris, blanco y el carbón real del hero: `artifacts/portrait-editorial/editorial-on-*.png`.

## Halftone en color

El patrón se exporta en el bitmap y su canal alpha; no usa canvas, filtros animados, shaders ni loops de navegador.

- Rostro central: sin patrón y con alpha intacto respecto del master.
- Cabello: se conserva la textura fotográfica; se evitó añadir una trama visible que dañara los detalles finos.
- Cuello: transición débil y gradual.
- Camiseta: puntos claramente visibles, con color tomado de la fotografía.
- Base: progresión hacia puntos más pequeños y transparencia total.
- Bordes de hombros seleccionados: dispersión discreta a partir del color de primer plano cercano.

Trama rotada 18°, separación de 9,2 px en la imagen de 920 px, equivalente a unos 4,6 px al mostrarla a 460 px. Tamaño, cobertura y presencia dependen de luminosidad, altura y máscara de protección; no es una textura uniforme sobre toda la foto.

## Integración y alcance

`index.html` cambia únicamente la precarga, el `src` y las dimensiones intrínsecas del retrato. `interactions.css` deja de aplicar el fundido CSS inferior porque el nuevo alpha ya realiza la disolución editorial; así no se oculta el halftone mediante un segundo fundido.

Los scripts de interacción, GSAP, CSS base e interfaces de proyectos y el JPEG original se verifican contra hashes anteriores. El HTML desde la sección de proyectos hasta el final se verifica idéntico. La única actualización de una prueba anterior es la dimensión natural esperada del retrato, de 460 a 920 px.

## Reproducción local

Las herramientas y modelos están en `.tools/`, ignorados por Git y excluidos de producción. La arquitectura oficial de BasicSR y su licencia se guardaron en `.tools/sr/`. Los modelos se cargan con `torch.load(..., weights_only=True)` y el state dictionary se valida estrictamente.

Preparación del entorno ya existente:

```powershell
uv pip install --python .tools/venv/Scripts/python.exe torch --index-url https://download.pytorch.org/whl/cpu
```

Archivos oficiales necesarios en `.tools/sr/`:

- [rrdbnet_arch.py](https://raw.githubusercontent.com/XPixelGroup/BasicSR/master/basicsr/archs/rrdbnet_arch.py)
- [Licencia BasicSR](https://raw.githubusercontent.com/XPixelGroup/BasicSR/master/LICENSE.txt)
- [RealESRGAN_x2plus.pth](https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.1/RealESRGAN_x2plus.pth)
- [RealESRNet_x4plus.pth](https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.1/RealESRNet_x4plus.pth)

```powershell
.tools/venv/Scripts/python.exe scripts/portrait-superresolution.py --model esrgan2
.tools/venv/Scripts/python.exe scripts/portrait-superresolution.py --model esrnet4
.tools/venv/Scripts/python.exe scripts/portrait-editorial.py --preview-only
.tools/venv/Scripts/python.exe scripts/portrait-editorial.py --select esrgan2
node scripts/qa-portrait.cjs
node scripts/qa.cjs
node scripts/package.cjs
```

La composición usa NumPy, Pillow, scipy y pymatting, disponibles en el entorno de desarrollo previo. Los manifiestos de inferencia registran SHA-256 del original, arquitectura y pesos, resolución, versión de torch y tiempo. El reporte final está en `artifacts/portrait-editorial/processing-report.json`.

## Validación ejecutada

- `scripts/validate-portrait.py`: dimensiones 920 × 920, alpha real de 0 a 255 en master y editorial, color conservado y píxeles RGBA del rostro protegido idénticos entre master y halftone. El alpha del WebP es idéntico al del PNG; error medio RGB de compresión de aproximadamente 1,31 sobre 255 en el rostro opaco protegido.
- `scripts/qa-portrait.cjs`: aprobado en Chrome de escritorio (imagen mostrada a 460 px), Chrome táctil con densidad 2× y WebKit con perfil de iPhone 13. Sin errores JS, recursos faltantes o desbordamiento; fotografía de 920 px cargada, sin filtro monocromático ni doble máscara CSS, parallax preservado, idioma y diálogo comprobados.
- `scripts/qa.cjs`: aprobado en 1440, 820, 390 y 320 px. Menú, modales, idioma persistente, anchors, imágenes, movimiento reducido y modo sin JS comprobados. Cero infracciones axe detectadas.
- Verificación de alcance: scripts y estilos base, interfaces, HTML desde proyectos hasta el final y original fotográfico idénticos a sus hashes previos. El hash Git del JPEG coincide con el de `HEAD`.
- Inspección visual de comparación, recortes faciales, cuatro fondos y capturas finales de escritorio y WebKit móvil.
- `node scripts/package.cjs`, comprobaciones sintácticas de Python/JavaScript y `git diff --check` ejecutados correctamente. Los modelos y herramientas no se incluyen en `dist/`.

Resultados completos en `artifacts/portrait-editorial/image-validation.json`, `browser-validation.json` y `processing-report.json`. Capturas en `hero-desktop.png`, `hero-chrome-mobile.png` y `hero-webkit-iphone.png` dentro de esa carpeta. El informe anterior de Lighthouse V4 corresponde al retrato previo; no se presenta como una nueva medición de este archivo.

## Límites

La información real de captura sigue siendo la de una fotografía de 460 × 460. La zona facial se mantiene deliberadamente más conservadora que los resultados neurales sin protección; no se presenta como una nueva sesión de estudio ni como recuperación de detalle que no existía. Una fuente original de mayor resolución permitiría aumentar la nitidez facial auténtica.

No se realizó deploy ni push; se trabaja sobre `feature/cinematic-v4`. La revisión en dispositivos físicos continúa siendo un límite de la validación local. Las imágenes de comparación y de inspección no forman parte del recorrido de la página.
