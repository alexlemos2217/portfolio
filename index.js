'use strict';
const projectData = {
  regcrim: {
    title: 'REGCRIM',
    tech: 'PHP · MariaDB · MySQL · JavaScript · SQL',
    es: 'Sistema institucional privado para registrar, consultar, organizar y analizar información. La interfaz pública es una recreación conceptual: utiliza datos sintéticos y no expone capturas, personas ni información operativa.',
    en: 'A private institutional system for capturing, searching, organizing and analyzing information. The public interface is a conceptual recreation: it uses synthetic data and exposes no screenshots, people or operational information.'
  },
  daw: {
    title: 'DAW',
    tech: { es: 'Sistema de información · Proyecto privado · Tecnologías no publicadas', en: 'Information system · Private project · Technologies not disclosed' },
    es: 'Aplicación institucional privada orientada a la gestión, consulta y organización de información. La presentación muestra una interfaz conceptual con datos ficticios: no reproduce pantallas, módulos, documentos ni información institucional real.',
    en: 'A private institutional application focused on managing, searching and organizing information. This presentation uses a conceptual interface with synthetic data: it reproduces no real screens, modules, documents or institutional information.'
  },
  secretaria: {
    title: { es: 'Secretaría', en: 'Secretariat' },
    tech: 'PHP · MySQL · JavaScript · HTML · CSS',
    es: 'Plataforma institucional que reúne procesos administrativos y coordinación operativa. La presentación protege el contexto interno y muestra únicamente una dirección de interfaz conceptual.',
    en: 'An institutional platform that brings administrative processes and operational coordination together. This presentation protects the internal context and shows only a conceptual interface direction.'
  },
  nexus: {
    title: 'NEXUS',
    tech: 'Editorial system · In development',
    es: 'Plataforma editorial en desarrollo sobre tecnología, gaming, hardware y anime. El sistema visual busca organizar contenidos distintos sin convertir la experiencia en ruido.',
    en: 'An editorial platform in development covering technology, gaming, hardware and anime. Its visual system organizes different content without turning the experience into noise.'
  }
};


const root = document.documentElement;
const menu = document.querySelector('#menu');
const menuButton = document.querySelector('.menu-button');
const langButton = document.querySelector('.lang');
const detail = document.querySelector('#detail-dialog');
let activeProject;
function renderProject() {
  if (!activeProject) return;
  const data = projectData[activeProject];
  const lang = root.dataset.lang;
  detail.querySelector('h2').textContent = typeof data.title === 'string' ? data.title : data.title[lang];
  detail.querySelector('.dialog-copy').textContent = data[lang];
  detail.querySelector('small').textContent = typeof data.tech === 'string' ? data.tech : data.tech[lang];
}
function setLanguage(value) {
  const lang = value === 'en' ? 'en' : 'es';
  root.dataset.lang = lang;
  root.lang = lang === 'en' ? 'en' : 'es-UY';
  document.querySelectorAll('[data-es][data-en]').forEach(node => { node.textContent = node.dataset[lang]; });
  document.querySelectorAll('[data-aria-es][data-aria-en]').forEach(node => node.setAttribute('aria-label', node.dataset[lang === 'es' ? 'ariaEs' : 'ariaEn']));
  langButton.innerHTML = lang === 'es' ? '<b>ES</b><span>EN</span>' : '<span>ES</span><b>EN</b>';
  langButton.setAttribute('aria-label', lang === 'es' ? 'ES / EN — Switch to English' : 'ES / EN — Cambiar a español');
  menuButton.setAttribute('aria-label', lang === 'es' ? 'Menú de navegación' : 'Navigation menu');
  menu.setAttribute('aria-label', lang === 'es' ? 'Navegación principal' : 'Main navigation');
  document.querySelector('.monogram').setAttribute('aria-label', lang === 'es' ? 'Alexander Lemos — inicio' : 'Alexander Lemos — home');
  const description = lang === 'es' ? 'Alexander Lemos — Full Stack Developer en Montevideo, Uruguay. Desarrollo de aplicaciones, sistemas e interfaces.' : 'Alexander Lemos — Full Stack Developer in Montevideo, Uruguay. Applications, systems and interfaces.';
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:description"]').content = description;
  document.querySelector('meta[property="og:locale"]').content = lang === 'es' ? 'es_UY' : 'en_US';
  renderProject();
  try { localStorage.setItem('portfolio-language', lang); } catch { /* Storage is optional. */ }
}
let preferred = 'es';
try { preferred = localStorage.getItem('portfolio-language') || 'es'; } catch { /* Use Spanish. */ }
setLanguage(preferred);
langButton.addEventListener('click', () => setLanguage(root.dataset.lang === 'es' ? 'en' : 'es'));
function closeMenu(returnFocus = false) {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.classList.contains('open')) closeMenu(true); });
document.addEventListener('click', event => { if (!event.target.closest('.nav')) closeMenu(); });
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  closeMenu();
  const target = document.querySelector(link.hash);
  target?.setAttribute('tabindex', '-1');
  target?.focus({ preventScroll: true });
}));
matchMedia('(min-width:701px)').addEventListener('change', () => closeMenu());
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelectorAll('[data-detail]').forEach(button => button.addEventListener('click', () => {
  activeProject = button.dataset.detail;
  renderProject();
  detail.showModal();
}));
const rumbo = document.querySelector('.rumbo-case');
document.querySelector('.rumbo-detail-open').addEventListener('click', () => rumbo.showModal());
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
});

// Optional enhancement: content and native anchors work before GSAP loads.
let motion;
function initMotion() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  motion = gsap.matchMedia();
  motion.add('(prefers-reduced-motion: no-preference)', () => {
    let seen = false;
    try { seen = sessionStorage.getItem('portfolio-intro') === 'seen'; } catch { /* No storage required. */ }
    if (!seen && !location.hash) {
      root.setAttribute('data-intro-running', '');
      gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => root.removeAttribute('data-intro-running'), onInterrupt: () => root.removeAttribute('data-intro-running') })
        .from('.hero-first,.hero-last', { y: 36, opacity: 0, stagger: .09, duration: .7 })
        .from('.hero-portrait img', { y: 18, opacity: 0, clipPath: 'inset(12% 0 0 0)', duration: .65, clearProps: 'clipPath' }, .15)
        .from('.hero-role,.hero-bottom,.hero-portrait figcaption', { y: 12, opacity: 0, stagger: .06, duration: .45 }, .35);
      try { sessionStorage.setItem('portfolio-intro', 'seen'); } catch { /* Optional. */ }
    }
    // Animate decoration, never hide or delay essential descriptions and controls.
    document.querySelectorAll('.product-stage').forEach(stage => {
      const visual = stage.querySelector('.reg-interface,.daw-interface,.ops-interface,.rumbo-showcase,.nexus-interface');
      const product = stage.closest('[data-product]').dataset.product;
      const direction = product === 'daw' ? { x: -18 } : product === 'nexus' ? { x: 14 } : { y: product === 'secretaria' ? 14 : 24 };
      gsap.from(visual, { ...direction, duration: product === 'rumbo' ? .8 : .65, ease: 'power2.out', scrollTrigger: { trigger: stage, start: 'top 92%', once: true } });
    });
    gsap.from('.trajectory-title h2', { y: 16, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: '.trajectory-title', start: 'top 92%', once: true } });
    gsap.from('.contact h2', { y: 20, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: '.contact', start: 'top 92%', once: true } });
    gsap.from('.profile-symbol', { rotation: -55, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: '.portrait-scene', start: 'top 90%', once: true } });
    gsap.to('.progress i', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true } });
    return () => root.removeAttribute('data-intro-running');
  });
}
initMotion();
let sectionObserver;
function initSectionIndicator() {
  if (!window.IntersectionObserver) return;
  const visible = new Map();
  const links = [...menu.querySelectorAll('a[href^="#"]')];
  sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top);
      else visible.delete(entry.target.id);
    });
    const active = [...visible].sort((a, b) => b[1] - a[1])[0]?.[0];
    const id = active === 'place' ? 'portrait' : active;
    links.forEach(link => {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main>section[id]').forEach(section => sectionObserver.observe(section));
}
initSectionIndicator();
// Restore optional animation after bfcache navigation without removing core events.
addEventListener('pagehide', () => { motion?.revert(); motion = undefined; sectionObserver?.disconnect(); });
addEventListener('pageshow', event => { if (event.persisted) { initMotion(); initSectionIndicator(); } });
