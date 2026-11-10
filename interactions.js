'use strict';

// One pointer stream; layout is cached and transforms have independent CSS channels.
(() => {
  const preference = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)');
  let destroy;
  const install = () => {
    destroy?.();
    destroy = undefined;
    if (!preference.matches || !CSS.supports('translate', '1px 1px')) return;

    const controller = new AbortController();
    const { signal } = controller;
    const root = document.documentElement;
    const hero = document.querySelector('.hero-composition');
    const cursor = document.createElement('div');
    cursor.className = 'editorial-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<span class="cursor-shape"><span></span></span>';
    document.body.append(cursor);
    const label = cursor.querySelector('.cursor-shape span');
    const layers = [
      ['.hero-first', -9, -5], ['.hero-last', -5, -3],
      ['.hero-portrait', 17, 10], ['.hero-light', 24, 13], ['.hero-edition', -13, 7]
    ].map(([selector, x, y]) => ({ element: document.querySelector(selector), x, y, valueX: 0, valueY: 0 }));
    const magnets = [...document.querySelectorAll('.hero-actions .button,.project-detail,.contact-links a,.lang')]
      .map(element => ({ element, rect: null, x: 0, y: 0 }));
    const visuals = [...document.querySelectorAll('.product-stage')].map(stage => ({
      stage, rect: null, x: 0, y: 0,
      element: stage.querySelector('.reg-interface,.daw-primary,.ops-interface,.rumbo-showcase,.nexus-sphere'),
      strength: stage.closest('.nexus') ? 11 : stage.closest('.daw') ? 5 : 8
    }));
    const debug = new URLSearchParams(location.search).has('interaction-debug');
    const stats = { frames: 0, layoutPasses: 0, pointerEvents: 0, maxFrameWorkMs: 0 };
    if (debug) window.__interactionStats = stats;
    let frame = 0;
    let dirty = true;
    let heroRect;
    let x = 0, y = 0, cursorX = 0, cursorY = 0;
    let pointerPresent = false, visible = false, tracking = false, heroActive = false, activeStage;
    let context = '';
    let lastTime = 0;

    const schedule = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(update); };
    const write = (element, valueX, valueY) => {
      element.style.setProperty('--pointer-x', `${valueX.toFixed(2)}px`);
      element.style.setProperty('--pointer-y', `${valueY.toFixed(2)}px`);
    };
    const contextLabel = () => {
      const es = root.dataset.lang !== 'en';
      label.textContent = context === 'project' ? (es ? 'EXPLORAR' : 'EXPLORE')
        : context === 'open' ? (es ? 'ABRIR' : 'OPEN') : '';
      cursor.dataset.context = context;
    };
    const languageObserver = new MutationObserver(contextLabel);
    languageObserver.observe(root, { attributes: true, attributeFilter: ['data-lang'] });

    function update(time) {
      frame = 0;
      const started = performance.now();
      const smoothing = 1 - Math.pow(.72, Math.min((time - lastTime) / 16.67 || 1, 3));
      lastTime = time;
      let settling = false;
      // All reads precede all writes. No getBoundingClientRect in pointer handlers.
      if (dirty && tracking) {
        heroRect = hero.getBoundingClientRect();
        magnets.forEach(item => {
          const rect = item.element.getBoundingClientRect();
          item.rect = { left: rect.left - item.x, top: rect.top - item.y, width: rect.width, height: rect.height };
        });
        visuals.forEach(item => { item.rect = item.stage.getBoundingClientRect(); });
        dirty = false;
        if (debug) stats.layoutPasses++;
      }
      if (pointerPresent) {
        cursorX += (x - cursorX) * .65;
        cursorY += (y - cursorY) * .65;
        cursor.style.transform = `translate3d(${cursorX.toFixed(2)}px,${cursorY.toFixed(2)}px,0)`;
        // Hide native cursor only after the replacement has been positioned successfully.
        if (!visible) { visible = true; root.classList.add('pointer-ready'); cursor.classList.add('is-visible'); }
        settling ||= Math.abs(x - cursorX) + Math.abs(y - cursorY) > .15;
      }
      const hx = heroActive ? Math.max(-1, Math.min(1, (x - heroRect.left) / heroRect.width * 2 - 1)) : 0;
      const hy = heroActive ? Math.max(-1, Math.min(1, (y - heroRect.top) / heroRect.height * 2 - 1)) : 0;
      layers.forEach(item => {
        if (!heroActive && item.valueX === 0 && item.valueY === 0) return;
        const targetX = hx * item.x, targetY = hy * item.y;
        item.valueX += (targetX - item.valueX) * smoothing;
        item.valueY += (targetY - item.valueY) * smoothing;
        if (Math.abs(targetX - item.valueX) + Math.abs(targetY - item.valueY) < .08) { item.valueX = targetX; item.valueY = targetY; }
        else settling = true;
        write(item.element, item.valueX, item.valueY);
      });
      magnets.forEach(item => {
        const r = item.rect;
        if (!r) return;
        const dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2);
        const near = pointerPresent && tracking && r && x >= r.left - 24 && x <= r.left + r.width + 24 && y >= r.top - 24 && y <= r.top + r.height + 24;
        if (!near && item.x === 0 && item.y === 0) return;
        const targetX = near ? Math.max(-6, Math.min(6, dx * .12)) : 0;
        const targetY = near ? Math.max(-5, Math.min(5, dy * .15)) : 0;
        item.x += (targetX - item.x) * smoothing;
        item.y += (targetY - item.y) * smoothing;
        if (Math.abs(targetX - item.x) + Math.abs(targetY - item.y) < .08) { item.x = targetX; item.y = targetY; }
        else settling = true;
        write(item.element, item.x, item.y);
      });
      visuals.forEach(item => {
        const active = pointerPresent && activeStage === item.stage;
        if (!active && item.x === 0 && item.y === 0) return;
        const targetX = active ? ((x - item.rect.left) / item.rect.width * 2 - 1) * item.strength : 0;
        const targetY = active ? ((y - item.rect.top) / item.rect.height * 2 - 1) * item.strength * .6 : 0;
        item.x += (targetX - item.x) * smoothing;
        item.y += (targetY - item.y) * smoothing;
        if (Math.abs(targetX - item.x) + Math.abs(targetY - item.y) < .08) { item.x = targetX; item.y = targetY; }
        else settling = true;
        write(item.element, item.x, item.y);
      });
      if (debug) { stats.frames++; stats.maxFrameWorkMs = Math.max(stats.maxFrameWorkMs, performance.now() - started); }
      if (settling) schedule();
    }
    const hide = () => {
      pointerPresent = visible = tracking = heroActive = false;
      activeStage = undefined;
      root.classList.remove('pointer-ready');
      cursor.classList.remove('is-visible');
      schedule();
    };
    document.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      x = event.clientX; y = event.clientY;
      if (!pointerPresent) { cursorX = x; cursorY = y; }
      pointerPresent = true;
      tracking = true;
      heroActive = hero.contains(event.target) && !root.hasAttribute('data-intro-running');
      activeStage = event.target.closest('.product-stage');
      const control = event.target.closest('a,button');
      const next = control?.matches('.project-detail') ? 'open' : activeStage ? 'project' : control ? 'link' : '';
      if (next !== context) { context = next; contextLabel(); }
      if (debug) stats.pointerEvents++;
      schedule();
    }, { passive: true, signal });
    document.addEventListener('pointerout', event => { if (!event.relatedTarget) hide(); }, { signal });
    document.addEventListener('keydown', hide, { signal });
    window.addEventListener('blur', hide, { signal });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { hide(); cancelAnimationFrame(frame); frame = 0; }
    }, { signal });
    const invalidate = () => {
      dirty = true; tracking = false; heroActive = false; activeStage = undefined;
      if (context) { context = ''; contextLabel(); }
      if (layers.some(item => item.valueX || item.valueY) || magnets.some(item => item.x || item.y) || visuals.some(item => item.x || item.y)) schedule();
    };
    window.addEventListener('scroll', invalidate, { passive: true, signal });
    window.addEventListener('resize', invalidate, { passive: true, signal });
    document.addEventListener('click', () => { dirty = true; schedule(); }, { signal });
    document.fonts.ready.then(() => { if (!signal.aborted) invalidate(); });
    destroy = () => {
      controller.abort(); languageObserver.disconnect(); cancelAnimationFrame(frame);
      root.classList.remove('pointer-ready'); cursor.remove();
      [...layers, ...magnets, ...visuals].forEach(item => {
        item.element.style.removeProperty('--pointer-x'); item.element.style.removeProperty('--pointer-y');
      });
    };
  };
  preference.addEventListener('change', install);
  addEventListener('pagehide', () => { destroy?.(); destroy = undefined; });
  addEventListener('pageshow', event => { if (event.persisted) install(); });
  install();
})();
