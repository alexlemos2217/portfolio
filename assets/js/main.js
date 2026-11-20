import { PROFILE, RBAC_ROLES } from './data/content.js';
import { getLang, initI18n, toggleLang } from './modules/i18n.js';
import { initClock } from './modules/clock.js';
import { initCursor } from './modules/cursor.js';
import { initTiltGlow } from './modules/tiltGlow.js';
import { initScramble } from './modules/scramble.js';
import { initSound, sound } from './modules/sound.js';
import { initApiLab } from './modules/apiLab.js';
import { initArchFlow } from './modules/archFlow.js';
import { initDrawer } from './modules/drawer.js';
import { initCommandPalette } from './modules/commandPalette.js';

let toastTimer = null;

function showToast(message) {
  const toast = document.querySelector('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

async function copyEmail() {
  const lang = getLang();
  sound.copy();
  try {
    await navigator.clipboard.writeText(PROFILE.email);
    showToast(lang === 'es' ? `Copiado ✓ · ${PROFILE.email}` : `Copied ✓ · ${PROFILE.email}`);
  } catch {
    showToast(PROFILE.email);
  }
}

function initNavigation() {
  const navPill = document.querySelector('.nav-pill');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('#primary-nav');

  const closeMenu = () => {
    navLinks?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };

  menuToggle?.addEventListener('click', () => {
    const open = navLinks?.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(Boolean(open)));
    sound.click();
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('scroll', () => {
    navPill?.classList.toggle('is-scrolled', window.scrollY > 24);
  }, { passive: true });
}

function initReadingProgress() {
  const bar = document.querySelector('.scroll-progress-bar');
  if (!bar) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  window.addEventListener('resize', update, { passive: true });
  update();
}

function initRevealAndThemes() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('[data-reveal]');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObs.observe(el));
  }

  // Dynamic ambient scroll lighting + active nav scroll-spy
  const themedBlocks = document.querySelectorAll('[data-theme-section]');
  const navMap = new Map(
    Array.from(document.querySelectorAll('#primary-nav a')).map(a => [a.getAttribute('href')?.slice(1), a])
  );

  if ('IntersectionObserver' in window && themedBlocks.length) {
    const themeObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const theme = entry.target.dataset.themeSection;
        if (theme) document.body.dataset.theme = theme;

        const navKey = entry.target.dataset.navKey;
        if (navKey && navMap.has(navKey)) {
          navMap.forEach(link => link.classList.remove('is-active'));
          navMap.get(navKey)?.classList.add('is-active');
        }
      });
    }, { threshold: 0.32, rootMargin: '-12% 0px -22% 0px' });

    themedBlocks.forEach(block => themeObs.observe(block));
  }
}

function initTimelineProgress() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const rect = timeline.getBoundingClientRect();
    const viewH = window.innerHeight;
    const progress = Math.max(0.08, Math.min(1, (viewH * 0.68 - rect.top) / Math.max(1, rect.height)));
    timeline.style.setProperty('--timeline-progress', progress.toFixed(3));
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  update();
}

function initRbacArtifact() {
  const roleBtns = Array.from(document.querySelectorAll('[data-rbac-role]'));
  const tokenEl = document.querySelector('#rbac-token');
  const rulesEl = document.querySelector('#rbac-rules');
  if (!roleBtns.length || !tokenEl || !rulesEl) return;

  const renderRole = roleName => {
    const config = RBAC_ROLES[roleName];
    if (!config) return;
    tokenEl.textContent = config.token;

    roleBtns.forEach(btn => {
      const active = btn.dataset.rbacRole === roleName;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    const frag = document.createDocumentFragment();
    config.rules.forEach(rule => {
      const row = document.createElement('div');
      row.className = 'rbac-rule';
      row.dataset.state = rule.state;

      const ep = document.createElement('span');
      ep.textContent = rule.endpoint;

      const st = document.createElement('span');
      st.className = 'rbac-status';
      st.textContent = rule.status;

      row.append(ep, st);
      frag.appendChild(row);
    });
    rulesEl.replaceChildren(frag);
  };

  roleBtns.forEach(btn => {
    btn.addEventListener('click', event => {
      event.stopPropagation();
      sound.click();
      renderRole(btn.dataset.rbacRole);
    });
  });

  renderRole('ADMIN');
}

function initStackFilters() {
  const buttons = Array.from(document.querySelectorAll('[data-stack-filter]'));
  const groups = Array.from(document.querySelectorAll('[data-stack-group]'));
  if (!buttons.length || !groups.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.click();
      const filter = btn.dataset.stackFilter;
      buttons.forEach(item => {
        const active = item === btn;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      groups.forEach(group => {
        const dim = filter !== 'all' && group.dataset.stackGroup !== filter;
        group.classList.toggle('is-dimmed', dim);
      });
    });
  });
}

function initUtilities() {
  document.querySelectorAll('[data-copy-email]').forEach(btn => {
    btn.addEventListener('click', copyEmail);
  });

  const yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function boot() {
  initI18n();
  initSound();
  initNavigation();
  initReadingProgress();
  initClock();
  initCursor();
  initTiltGlow();
  initScramble();
  initRevealAndThemes();
  initTimelineProgress();
  initRbacArtifact();
  initStackFilters();
  initApiLab();
  const { simulate } = initArchFlow();
  const { openCaseStudy } = initDrawer();
  initCommandPalette({
    openCaseStudy,
    copyEmail,
    simulateRequest: simulate,
    toggleLang
  });
  initUtilities();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
