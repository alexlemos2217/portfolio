import { PROFILE } from '../data/content.js';
import { getLang, onLangChange } from './i18n.js';
import { sound } from './sound.js';

export function initCommandPalette({ openCaseStudy, copyEmail, simulateRequest, toggleLang }) {
  const dialog = document.querySelector('#cmd-dialog');
  const input = dialog?.querySelector('#cmd-input');
  const listEl = dialog?.querySelector('#cmd-list');
  const triggerBtn = document.querySelector('.cmd-trigger');

  if (!dialog || !input || !listEl) return;

  let selectedIdx = 0;
  let filteredCommands = [];

  const getCommands = () => {
    const lang = getLang();
    const isEs = lang === 'es';
    return [
      {
        label: isEs ? 'Ir a Proyectos destacados' : 'Jump to Selected Work',
        meta: '#work',
        keywords: 'work proyectos portfolio bios',
        run: () => document.querySelector('#work')?.scrollIntoView()
      },
      {
        label: isEs ? 'Ir a Systems Lab (API + Arquitectura)' : 'Jump to Systems Lab (API + Architecture)',
        meta: '#lab',
        keywords: 'lab api playground architecture flow',
        run: () => document.querySelector('#lab')?.scrollIntoView()
      },
      {
        label: isEs ? 'Simular Request en Architecture Flow' : 'Simulate Request in Architecture Flow',
        meta: 'RUN',
        keywords: 'simulate request trace sql net spring',
        run: () => {
          document.querySelector('#lab')?.scrollIntoView();
          setTimeout(() => simulateRequest(), 280);
        }
      },
      {
        label: isEs ? 'Ir a Stack Técnico' : 'Jump to Technical Stack',
        meta: '#stack',
        keywords: 'stack tech c# .net java spring php sql flutter',
        run: () => document.querySelector('#stack')?.scrollIntoView()
      },
      {
        label: isEs ? 'Ir a Trayectoria y Perfil' : 'Jump to About & Trajectory',
        meta: '#about',
        keywords: 'about perfil trayectoria ort bios',
        run: () => document.querySelector('#about')?.scrollIntoView()
      },
      {
        label: isEs ? 'Abrir caso: BIOS Work (Spring Boot)' : 'Open case: BIOS Work (Spring Boot)',
        meta: 'CASE 01',
        keywords: 'bios work java spring security rbac',
        run: () => openCaseStudy('bios-work')
      },
      {
        label: isEs ? 'Abrir caso: BIOS Fitness (Flutter)' : 'Open case: BIOS Fitness (Flutter)',
        meta: 'CASE 02',
        keywords: 'bios fitness flutter dart bloc sqlite mobile',
        run: () => openCaseStudy('bios-fitness')
      },
      {
        label: isEs ? 'Abrir caso: Sistemas Operativos & Datos (NDA)' : 'Open case: Operational & Data Systems (NDA)',
        meta: 'CASE 03',
        keywords: 'php mariadb mysql sql regcrim secretaria pado nda',
        run: () => openCaseStudy('ops-systems')
      },
      {
        label: isEs ? 'Copiar email (alexlemos2297@gmail.com)' : 'Copy email (alexlemos2297@gmail.com)',
        meta: 'COPY',
        keywords: 'email mail correo copiar contact',
        run: () => copyEmail()
      },
      {
        label: isEs ? 'Cambiar idioma (ES ↔ EN)' : 'Switch language (EN ↔ ES)',
        meta: 'I18N',
        keywords: 'idioma language english español',
        run: () => toggleLang()
      },
      {
        label: 'GitHub — alexlemos2217',
        meta: 'EXT ↗',
        keywords: 'github code repos source',
        run: () => window.open(PROFILE.github, '_blank', 'noopener,noreferrer')
      },
      {
        label: 'LinkedIn — alexlemos22',
        meta: 'EXT ↗',
        keywords: 'linkedin profile network',
        run: () => window.open(PROFILE.linkedin, '_blank', 'noopener,noreferrer')
      }
    ];
  };

  const renderList = query => {
    const q = query.trim().toLowerCase();
    const all = getCommands();
    filteredCommands = q
      ? all.filter(cmd => `${cmd.label} ${cmd.keywords} ${cmd.meta}`.toLowerCase().includes(q))
      : all;

    selectedIdx = Math.min(selectedIdx, Math.max(0, filteredCommands.length - 1));
    listEl.replaceChildren();

    if (!filteredCommands.length) {
      const empty = document.createElement('li');
      empty.className = 'cmd-empty';
      empty.textContent = getLang() === 'es' ? 'Sin resultados para esa búsqueda.' : 'No matching commands.';
      listEl.appendChild(empty);
      return;
    }

    filteredCommands.forEach((cmd, idx) => {
      const li = document.createElement('li');
      li.className = idx === selectedIdx ? 'cmd-item is-selected' : 'cmd-item';
      const btn = document.createElement('button');
      btn.type = 'button';

      const label = document.createElement('span');
      label.className = 'cmd-item-label';
      label.textContent = cmd.label;

      const meta = document.createElement('span');
      meta.className = 'cmd-item-meta';
      meta.textContent = cmd.meta;

      btn.append(label, meta);
      btn.addEventListener('click', () => {
        dialog.close();
        cmd.run();
      });
      li.appendChild(btn);
      listEl.appendChild(li);
    });
  };

  const openPalette = () => {
    if (dialog.open) return;
    input.value = '';
    selectedIdx = 0;
    renderList('');
    document.body.classList.add('no-scroll');
    sound.palette();
    dialog.showModal();
    requestAnimationFrame(() => input.focus());
  };

  triggerBtn?.addEventListener('click', openPalette);

  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (dialog.open) dialog.close();
      else openPalette();
    }
  });

  input.addEventListener('input', () => {
    selectedIdx = 0;
    renderList(input.value);
  });

  input.addEventListener('keydown', event => {
    if (!filteredCommands.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      selectedIdx = (selectedIdx + 1) % filteredCommands.length;
      renderList(input.value);
      listEl.children[selectedIdx]?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      selectedIdx = (selectedIdx - 1 + filteredCommands.length) % filteredCommands.length;
      renderList(input.value);
      listEl.children[selectedIdx]?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const chosen = filteredCommands[selectedIdx];
      if (chosen) {
        dialog.close();
        chosen.run();
      }
    }
  });

  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('no-scroll');
  });

  onLangChange(() => {
    if (dialog.open) renderList(input.value);
  });
}
