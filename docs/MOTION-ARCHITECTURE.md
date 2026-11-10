# Motion architecture

La arquitectura usa scroll nativo. Ninguna sección tiene pinning, scrub sobre contenido esencial ni alturas de varios viewports.

`initMotion()` mejora progresivamente el HTML si GSAP y ScrollTrigger están disponibles. `gsap.matchMedia()` restringe las animaciones a `prefers-reduced-motion: no-preference` y revierte el contexto al cambiar la preferencia.

- Entrada temporal, no vinculada al scroll: nombre, retrato, rol y acciones. Termina en aproximadamente un segundo y se registra en sessionStorage para evitar repetirla durante la sesión. No se ejecuta al abrir un deep link.
- Cinco entradas de interfaces con direcciones y duraciones según el proyecto; se ejecutan una vez al entrar en el viewport. No ocultan texto ni acciones. ScrollTrigger descarta cada trigger después de ejecutarlo.
- Un giro breve del símbolo de perfil y una línea de progreso con `scaleY`.
- La V4 añade un único planificador requestAnimationFrame para interacciones del mouse. Se detiene al asentarse los valores y no escribe en componentes inactivos. No hay mapas, canvas, cámaras ni movimientos perpetuos fuera de pantalla.
- Parallax y magnetismo usan `translate` independiente del `transform` de GSAP. Los rectángulos se almacenan y se invalidan por cambios de layout; no se leen en cada evento de puntero.
- Trayectoria y contacto tienen entradas breves distintas. El indicador de sección usa IntersectionObserver y no necesita un listener de scroll.
- `pagehide` revierte el contexto; `pageshow` lo reconstruye si vuelve desde bfcache.

Las inclinaciones estáticas de dos interfaces se anulan en móvil y con movimiento reducido. Sin JS/GSAP, el contenido mantiene el mismo layout y visibilidad; CSS nunca lo oculta a la espera de una animación.

Detalle de arquitectura, cursor, limpieza y fotografía en `CINEMATIC-V4.md`.
