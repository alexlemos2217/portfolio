export function initTiltGlow() {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reducedMotion) return;

  // 3D Micro-Tilt + Specular Radial Glow + Internal Depth Parallax
  document.querySelectorAll('[data-tilt]').forEach(card => {
    const maxDeg = Number(card.dataset.tilt) || 3;
    const parallaxLayers = Array.from(card.querySelectorAll('[data-parallax]'));

    card.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const nx = px - 0.5;
      const ny = py - 0.5;

      const rotY = nx * (maxDeg * 2);
      const rotX = -ny * (maxDeg * 2);

      card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      card.style.setProperty('--glow', '1');
      card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

      parallaxLayers.forEach(layer => {
        const depth = Number(layer.dataset.parallax) || 12;
        const tx = (nx * depth).toFixed(1);
        const ty = (ny * depth).toFixed(1);
        layer.style.transform = `translate3d(${tx}px, ${ty}px, ${Math.round(depth * 0.8)}px)`;
      });
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--glow', '0');
      card.style.transform = '';
      parallaxLayers.forEach(layer => {
        layer.style.transform = '';
      });
    });
  });

  // Tactile Magnetic Buttons
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    const strength = Number(btn.dataset.magnetic) || 0.22;

    btn.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      const rect = btn.getBoundingClientRect();
      const offsetX = (event.clientX - (rect.left + rect.width / 2)) * strength;
      const offsetY = (event.clientY - (rect.top + rect.height / 2)) * strength;
      btn.style.transform = `translate3d(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px, 0)`;
    });

    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  });
}
