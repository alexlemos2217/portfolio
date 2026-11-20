const STORAGE_KEY = 'portfolio-language';
const listeners = new Set();

let currentLang = 'es';

export function getLang() {
  return currentLang;
}

export function onLangChange(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function setLang(value) {
  const lang = value === 'en' ? 'en' : 'es';
  const suffix = lang === 'es' ? 'Es' : 'En';
  currentLang = lang;

  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang === 'en' ? 'en' : 'es-UY';

  document.querySelectorAll('[data-es][data-en]').forEach(el => {
    el.textContent = el.dataset[lang];
  });

  document.querySelectorAll('[data-aria-es][data-aria-en]').forEach(el => {
    el.setAttribute('aria-label', el.dataset[`aria${suffix}`]);
  });

  document.querySelectorAll('[data-alt-es][data-alt-en]').forEach(el => {
    el.setAttribute('alt', el.dataset[`alt${suffix}`]);
  });

  document.querySelectorAll('[data-placeholder-es][data-placeholder-en]').forEach(el => {
    el.setAttribute('placeholder', el.dataset[`placeholder${suffix}`]);
  });

  const toggle = document.querySelector('.lang-toggle');
  if (toggle) {
    toggle.querySelectorAll('[data-lang-opt]').forEach(opt => {
      opt.classList.toggle('is-active', opt.dataset.langOpt === lang);
    });
    toggle.setAttribute('aria-label', lang === 'es' ? 'Switch to English' : 'Cambiar a español');
  }

  const desc = document.querySelector('meta[name="description"]');
  if (desc) {
    desc.content = lang === 'es'
      ? 'Alexander Lemos — Backend & Full-Stack Software Developer en Montevideo. APIs en C#/.NET, Java/Spring Boot, PHP, SQL y productos digitales.'
      : 'Alexander Lemos — Backend & Full-Stack Software Developer in Montevideo. C#/.NET, Java/Spring Boot, PHP, SQL APIs and digital products.';
  }

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* Storage may be restricted in private browsing. */
  }

  listeners.forEach(cb => cb(lang));
}

export function toggleLang() {
  setLang(currentLang === 'es' ? 'en' : 'es');
}

export function initI18n() {
  let saved = 'es';
  try {
    saved = localStorage.getItem(STORAGE_KEY) || 'es';
  } catch {
    saved = 'es';
  }

  setLang(saved);

  const toggle = document.querySelector('.lang-toggle');
  toggle?.addEventListener('click', toggleLang);
}
