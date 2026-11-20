import { API_ENDPOINTS } from '../data/content.js';
import { getLang, onLangChange } from './i18n.js';
import { sound } from './sound.js';

function createToken(className, text) {
  const span = document.createElement('span');
  span.className = className;
  span.textContent = text;
  return span;
}

function renderHighlightedJson(container, data) {
  const formatted = JSON.stringify(data, null, 2);
  const regex = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}\[\],:])/g;
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(formatted)) !== null) {
    if (match.index > lastIndex) {
      fragment.appendChild(document.createTextNode(formatted.slice(lastIndex, match.index)));
    }

    const token = match[0];
    let cls = 'syn-punct';
    if (token.startsWith('"')) {
      cls = token.endsWith(':') ? 'syn-key' : 'syn-str';
    } else if (/^(true|false|null)$/.test(token)) {
      cls = 'syn-bool';
    } else if (/^-?\d/.test(token)) {
      cls = 'syn-num';
    }

    fragment.appendChild(createToken(cls, token));
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < formatted.length) {
    fragment.appendChild(document.createTextNode(formatted.slice(lastIndex)));
  }

  container.replaceChildren(fragment);
}

export function initApiLab() {
  const outputEl = document.querySelector('#api-output');
  const statusEl = document.querySelector('#api-status');
  const latencyEl = document.querySelector('#api-latency');
  const formEl = document.querySelector('#api-form');
  const inputEl = document.querySelector('#api-input');
  const chips = Array.from(document.querySelectorAll('[data-endpoint]'));

  if (!outputEl || !statusEl || !latencyEl) return;

  let activePath = '/api/v1/alex';

  const setActiveChip = path => {
    chips.forEach(chip => {
      const match = chip.dataset.endpoint === path;
      chip.classList.toggle('is-active', match);
      chip.setAttribute('aria-pressed', String(match));
    });
  };

  const execute = rawInput => {
    const start = performance.now();
    const lang = getLang();
    const clean = rawInput.trim().toLowerCase().replace(/^get\s+/, '');

    if (clean === 'clear') {
      outputEl.textContent = lang === 'es'
        ? '// Consola limpia. Escribí "help" o elegí un endpoint arriba.'
        : '// Console cleared. Type "help" or click an endpoint above.';
      statusEl.textContent = '204 No Content';
      statusEl.classList.remove('is-error');
      latencyEl.textContent = `${(performance.now() - start + 0.4).toFixed(1)} ms`;
      setActiveChip('');
      return;
    }

    const aliases = {
      alex: '/api/v1/alex',
      me: '/api/v1/alex',
      profile: '/api/v1/alex',
      stack: '/api/v1/stack',
      skills: '/api/v1/stack',
      projects: '/api/v1/projects',
      work: '/api/v1/projects',
      contact: '/api/v1/contact',
      email: '/api/v1/contact'
    };

    if (clean === 'help' || clean === '?') {
      activePath = 'help';
      setActiveChip('');
      const payload = lang === 'es'
        ? {
            commands: ['help', 'alex', 'stack', 'projects', 'contact', 'clear'],
            endpoints: Object.keys(API_ENDPOINTS),
            tip: 'También podés usar Ctrl + K desde cualquier sección.'
          }
        : {
            commands: ['help', 'alex', 'stack', 'projects', 'contact', 'clear'],
            endpoints: Object.keys(API_ENDPOINTS),
            tip: 'You can also press Ctrl + K from anywhere on the page.'
          };
      renderHighlightedJson(outputEl, payload);
      statusEl.textContent = '200 OK';
      statusEl.classList.remove('is-error');
      latencyEl.textContent = `${(performance.now() - start + 0.9).toFixed(1)} ms`;
      return;
    }

    const resolved = aliases[clean] || clean;
    const entry = API_ENDPOINTS[resolved];

    if (entry) {
      activePath = resolved;
      setActiveChip(resolved);
      renderHighlightedJson(outputEl, entry[lang]);
      statusEl.textContent = '200 OK';
      statusEl.classList.remove('is-error');
      const elapsed = (performance.now() - start + 1.1 + Math.random() * 1.4).toFixed(1);
      latencyEl.textContent = `${elapsed} ms`;
      return;
    }

    activePath = null;
    setActiveChip('');
    const errPayload = lang === 'es'
      ? {
          status: 404,
          error: 'Endpoint no encontrado',
          received: rawInput.trim(),
          hint: 'Probá: help, stack, projects, contact o GET /api/v1/alex'
        }
      : {
          status: 404,
          error: 'Endpoint not found',
          received: rawInput.trim(),
          hint: 'Try: help, stack, projects, contact or GET /api/v1/alex'
        };
    renderHighlightedJson(outputEl, errPayload);
    statusEl.textContent = '404 Not Found';
    statusEl.classList.add('is-error');
    latencyEl.textContent = `${(performance.now() - start + 0.8).toFixed(1)} ms`;
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      sound.endpoint();
      execute(chip.dataset.endpoint);
    });
  });

  formEl?.addEventListener('submit', event => {
    event.preventDefault();
    if (!inputEl?.value.trim()) return;
    sound.endpoint();
    execute(inputEl.value);
    inputEl.value = '';
  });

  onLangChange(() => {
    if (activePath) execute(activePath);
  });

  execute('/api/v1/alex');
}
