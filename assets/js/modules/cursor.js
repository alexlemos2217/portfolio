import { ARCHIVE_PREVIEWS } from '../data/content.js';
import { getLang, onLangChange } from './i18n.js';

export function initCursor() {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reducedMotion) return;

  const cursorEl = document.querySelector('.custom-cursor');
  const labelEl = cursorEl?.querySelector('.cursor-label');
  const previewEl = document.querySelector('.archive-preview');
  if (!cursorEl || !labelEl) return;

  let targetX = -100;
  let targetY = -100;
  let currentX = -100;
  let currentY = -100;
  let previewX = -999;
  let previewY = -999;
  let rafId = null;
  let activeCursorNode = null;
  let activePreviewKey = null;

  const updateCursorLabel = () => {
    if (!activeCursorNode) {
      cursorEl.classList.remove('has-label');
      labelEl.textContent = '';
      return;
    }
    const lang = getLang();
    const text = lang === 'en'
      ? (activeCursorNode.dataset.cursorEn || activeCursorNode.dataset.cursor)
      : activeCursorNode.dataset.cursor;
    if (text) {
      labelEl.textContent = text;
      cursorEl.classList.add('has-label');
    } else {
      cursorEl.classList.remove('has-label');
      labelEl.textContent = '';
    }
  };

  const renderPreviewContent = key => {
    if (!previewEl || !key) return;
    const item = ARCHIVE_PREVIEWS[key];
    if (!item) return;
    const lang = getLang();
    previewEl.style.setProperty('--preview-accent', item.accent);
    previewEl.querySelector('.archive-preview-type').textContent = item.type[lang];
    previewEl.querySelector('h4').textContent = typeof item.title === 'string' ? item.title : item.title[lang];
    previewEl.querySelector('p').textContent = item.desc[lang];
    previewEl.querySelector('.archive-preview-stack').textContent = item.stack;
  };

  const tick = () => {
    const dx = targetX - currentX;
    const dy = targetY - currentY;
    currentX += dx * 0.22;
    currentY += dy * 0.22;

    cursorEl.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;

    if (previewEl && activePreviewKey) {
      const clampX = Math.min(window.innerWidth - 314, targetX + 26);
      const clampY = Math.max(88, Math.min(window.innerHeight - 190, targetY - 56));
      previewX += (clampX - previewX) * 0.16;
      previewY += (clampY - previewY) * 0.16;
      previewEl.style.transform = `translate3d(${previewX.toFixed(1)}px, ${previewY.toFixed(1)}px, 0)`;
    }

    if (Math.abs(dx) > 0.2 || Math.abs(dy) > 0.2 || activePreviewKey) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  };

  const wake = () => {
    if (!rafId) rafId = requestAnimationFrame(tick);
  };

  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    targetX = event.clientX;
    targetY = event.clientY;
    cursorEl.classList.add('is-visible');
    wake();
  }, { passive: true });

  document.addEventListener('pointerover', event => {
    const target = event.target instanceof Element ? event.target : null;
    const cursorHost = target?.closest('[data-cursor]');
    if (cursorHost !== activeCursorNode) {
      activeCursorNode = cursorHost || null;
      updateCursorLabel();
    }

    const archiveRow = target?.closest('[data-preview]');
    const nextKey = archiveRow?.dataset.preview || null;
    if (nextKey !== activePreviewKey) {
      activePreviewKey = nextKey;
      if (activePreviewKey && previewEl) {
        if (previewX < -500) {
          previewX = Math.min(window.innerWidth - 314, targetX + 26);
          previewY = Math.max(88, Math.min(window.innerHeight - 190, targetY - 56));
        }
        renderPreviewContent(activePreviewKey);
        previewEl.classList.add('is-visible');
        wake();
      } else {
        previewEl?.classList.remove('is-visible');
      }
    }
  });

  document.addEventListener('mouseleave', () => {
    cursorEl.classList.remove('is-visible', 'has-label');
    previewEl?.classList.remove('is-visible');
    activeCursorNode = null;
    activePreviewKey = null;
  });

  onLangChange(() => {
    updateCursorLabel();
    if (activePreviewKey) renderPreviewContent(activePreviewKey);
  });
}
