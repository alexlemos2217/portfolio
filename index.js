'use strict';

const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('.project-card');
const copyButton = document.querySelector('.copy-email');
const toast = document.querySelector('.toast');
let toastTimeout;

// Tema persistente: respetamos primero la preferencia guardada.
try {
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.dataset.theme = savedTheme;
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.dataset.theme = 'light';
  }
} catch (_) {
  // En navegación privada u otros entornos, sigue funcionando sin persistencia.
}

function syncThemeButton() {
  if (!themeButton) return;
  const light = root.dataset.theme === 'light';
  themeButton.setAttribute('aria-label', light ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
  themeButton.title = light ? 'Modo oscuro' : 'Modo claro';
  document.querySelector('meta[name="theme-color"]').content = light ? '#f6f8fb' : '#0a0d16';
}

syncThemeButton();
themeButton?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch (_) { /* opcional */ }
  syncThemeButton();
});

function closeMenu() {
  navigation?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menú');
}

menuButton?.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => {
  if (navigation?.classList.contains('open') && !navigation.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
});

filterButtons.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  filterButtons.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  projectCards.forEach(card => {
    card.hidden = selected !== 'todos' && card.dataset.category !== selected;
  });
}));

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

copyButton?.addEventListener('click', async () => {
  const email = copyButton.dataset.email;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API no disponible');
    await navigator.clipboard.writeText(email);
    showToast('Correo copiado: ' + email);
  } catch (_) {
    showToast('Correo: ' + email);
  }
});

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
