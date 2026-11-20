const GLYPHS = '01ABCDEF#/_·<>';
const DURATION_MS = 220;

export function initScramble() {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reducedMotion) return;

  const activeFrames = new WeakMap();

  const stopScramble = el => {
    const state = activeFrames.get(el);
    if (!state) return;
    cancelAnimationFrame(state.rafId);
    el.textContent = state.original;
    activeFrames.delete(el);
  };

  const runScramble = el => {
    stopScramble(el);
    const original = el.textContent;
    if (!original || original.trim().length < 2) return;

    const start = performance.now();
    const state = { original, rafId: 0 };

    const tick = now => {
      const progress = Math.min(1, (now - start) / DURATION_MS);
      const revealed = Math.floor(progress * original.length);
      let nextText = '';

      for (let i = 0; i < original.length; i += 1) {
        const ch = original[i];
        if (ch === ' ' || ch === '·' || i < revealed) {
          nextText += ch;
        } else {
          nextText += GLYPHS[(i + Math.floor(now / 28)) % GLYPHS.length];
        }
      }

      el.textContent = nextText;

      if (progress < 1) {
        state.rafId = requestAnimationFrame(tick);
      } else {
        el.textContent = original;
        activeFrames.delete(el);
      }
    };

    state.rafId = requestAnimationFrame(tick);
    activeFrames.set(el, state);
  };

  document.querySelectorAll('[data-scramble]').forEach(el => {
    const trigger = el.closest('.archive-row') || el;
    trigger.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      runScramble(el);
    });
    trigger.addEventListener('pointerleave', () => stopScramble(el));
  });
}
