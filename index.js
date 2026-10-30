'use strict';

const root = document.documentElement;
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');
const languageButton = document.querySelector('.language-toggle');
const translatableNodes = document.querySelectorAll('[data-es][data-en]');
const toast = document.querySelector('.toast');
const accessibleLabels = [
  ['.nav-links', 'Navegación principal', 'Primary navigation'],
  ['.hero-facts', 'Información profesional', 'Professional information'],
  ['.hero-system', 'Visualización interactiva de un sistema full stack', 'Interactive visualization of a full stack system'],
  ['.pixel-visual', 'Ver Pixel Rush en GitHub', 'View Pixel Rush on GitHub'],
  ['.faro-visual', 'Ver FARO:09 en GitHub', 'View FARO:09 on GitHub'],
  ['.dex-visual', 'Abrir demo de Pokédex', 'Open Pokédex demo'],
  ['.portfolio-visual', 'Ver código de este Portfolio', 'View this Portfolio source code'],
  ['.stack-tabs', 'Categorías de tecnologías', 'Technology categories']
];
let toastTimer;

function closeMenu() {
  navigation?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', root.dataset.lang === 'en' ? 'Open menu' : 'Abrir menú');
}

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen
    ? (root.dataset.lang === 'en' ? 'Close menu' : 'Cerrar menú')
    : (root.dataset.lang === 'en' ? 'Open menu' : 'Abrir menú'));
});

navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => {
  if (navigation?.classList.contains('open') && !navigation.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
});

function setLanguage(language) {
  const lang = language === 'en' ? 'en' : 'es';
  root.dataset.lang = lang;
  root.lang = lang === 'en' ? 'en' : 'es-UY';
  translatableNodes.forEach(node => { node.textContent = node.dataset[lang]; });
  accessibleLabels.forEach(([selector, es, en]) => document.querySelector(selector)?.setAttribute('aria-label', lang === 'es' ? es : en));
  if (languageButton) {
    languageButton.innerHTML = lang === 'es'
      ? '<span class="lang-active">ES</span><span aria-hidden="true">/</span><span>EN</span>'
      : '<span>ES</span><span aria-hidden="true">/</span><span class="lang-active">EN</span>';
    languageButton.setAttribute('aria-label', lang === 'es' ? 'Switch to English' : 'Cambiar a español');
  }
  document.querySelector('meta[name="description"]').content = lang === 'es'
    ? 'Portfolio de Alexander Lemos, Full Stack Developer en Montevideo. Software web, interfaces, lógica de negocio y bases de datos.'
    : 'Portfolio of Alexander Lemos, Full Stack Developer in Montevideo. Web software, interfaces, business logic and databases.';
  try { localStorage.setItem('portfolio-language', lang); } catch (_) { /* Progressive enhancement. */ }
}

let savedLanguage = 'es';
try { savedLanguage = localStorage.getItem('portfolio-language') || 'es'; } catch (_) { /* Use Spanish. */ }
setLanguage(savedLanguage);
languageButton?.addEventListener('click', () => setLanguage(root.dataset.lang === 'es' ? 'en' : 'es'));

function updateHeader() { header?.classList.toggle('scrolled', window.scrollY > 18); }
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });
document.querySelectorAll('.reveal').forEach(node => revealObserver.observe(node));

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('[data-nav]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      const active = link.dataset.nav === entry.target.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

document.querySelectorAll('[data-stack]').forEach(tab => {
  tab.addEventListener('click', () => {
    const selected = tab.dataset.stack;
    document.querySelectorAll('[data-stack]').forEach(button => button.setAttribute('aria-selected', String(button === tab)));
    document.querySelectorAll('[data-panel]').forEach(panel => {
      const active = panel.dataset.panel === selected;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
  });
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    const tabs = [...document.querySelectorAll('[data-stack]')];
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    tabs[(tabs.indexOf(tab) + direction + tabs.length) % tabs.length].focus();
  });
});

const systemCard = document.querySelector('#system-card');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (systemCard && !reduceMotion && matchMedia('(pointer: fine)').matches) {
  systemCard.addEventListener('pointermove', event => {
    const bounds = systemCard.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    systemCard.style.transform = `rotateY(${x * 7}deg) rotateX(${y * -7}deg)`;
  });
  systemCard.addEventListener('pointerleave', () => { systemCard.style.transform = ''; });
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

document.querySelector('.copy-email')?.addEventListener('click', async event => {
  const email = event.currentTarget.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    showToast(root.dataset.lang === 'en' ? 'Email copied' : 'Correo copiado');
  } catch (_) {
    showToast(email);
  }
});

document.getElementById('year').textContent = String(new Date().getFullYear());
