import { CASE_STUDIES } from '../data/content.js';
import { getLang, onLangChange } from './i18n.js';

export function initDrawer() {
  const dialog = document.querySelector('#case-drawer');
  const closeBtn = dialog?.querySelector('.drawer-close');
  const kickerEl = dialog?.querySelector('.drawer-kicker');
  const contentEl = dialog?.querySelector('.drawer-content');

  if (!dialog || !contentEl) {
    return { openCaseStudy: () => {} };
  }

  let activeId = null;
  let openerEl = null;

  const pick = (field, lang) => (typeof field === 'string' ? field : field[lang]);

  const render = id => {
    const study = CASE_STUDIES[id];
    if (!study) return;

    const lang = getLang();
    dialog.style.setProperty('--drawer-accent', study.accent);
    kickerEl.textContent = pick(study.kicker, lang);

    const frag = document.createDocumentFragment();

    // Hero Block
    const hero = document.createElement('div');
    hero.className = 'drawer-hero';

    const title = document.createElement('h2');
    title.id = 'drawer-title';
    title.textContent = pick(study.title, lang);

    const subtitle = document.createElement('p');
    subtitle.textContent = pick(study.subtitle, lang);

    const metaGrid = document.createElement('div');
    metaGrid.className = 'drawer-meta-grid';
    const metaEntries = [
      [lang === 'es' ? 'ROL' : 'ROLE', pick(study.meta.role, lang)],
      [lang === 'es' ? 'CONTEXTO' : 'CONTEXT', pick(study.meta.context, lang)],
      [lang === 'es' ? 'FOCO TÉCNICO' : 'TECHNICAL FOCUS', pick(study.meta.focus, lang)]
    ];
    metaEntries.forEach(([label, val]) => {
      const box = document.createElement('div');
      box.className = 'drawer-meta-box';
      const s = document.createElement('span');
      s.textContent = label;
      const b = document.createElement('strong');
      b.textContent = val;
      box.append(s, b);
      metaGrid.appendChild(box);
    });

    hero.append(title, subtitle, metaGrid);
    frag.appendChild(hero);

    // 01 Problem
    const secProblem = document.createElement('section');
    secProblem.className = 'drawer-section';
    const hProblem = document.createElement('h3');
    hProblem.textContent = lang === 'es' ? '01 · El Problema' : '01 · The Problem';
    const pProblem = document.createElement('p');
    pProblem.textContent = pick(study.problem, lang);
    secProblem.append(hProblem, pProblem);
    frag.appendChild(secProblem);

    // 02 Architecture & Technical Decisions
    const secArch = document.createElement('section');
    secArch.className = 'drawer-section';
    const hArch = document.createElement('h3');
    hArch.textContent = lang === 'es' ? '02 · Arquitectura y Decisiones Técnicas' : '02 · Architecture & Technical Decisions';
    const ul = document.createElement('ul');
    ul.className = 'drawer-list';
    study.decisions[lang].forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });
    const pre = document.createElement('pre');
    pre.className = 'drawer-arch-box';
    pre.textContent = study.architecture;
    secArch.append(hArch, ul, pre);
    frag.appendChild(secArch);

    // 03 Stack
    const secStack = document.createElement('section');
    secStack.className = 'drawer-section';
    const hStack = document.createElement('h3');
    hStack.textContent = lang === 'es' ? '03 · Stack Tecnológico' : '03 · Technology Stack';
    const tags = document.createElement('div');
    tags.className = 'project-tags';
    study.stack.forEach(tech => {
      const chip = document.createElement('span');
      chip.textContent = tech;
      tags.appendChild(chip);
    });
    secStack.append(hStack, tags);
    frag.appendChild(secStack);

    // 04 Impact & Takeaways
    const secImpact = document.createElement('section');
    secImpact.className = 'drawer-section';
    const hImpact = document.createElement('h3');
    hImpact.textContent = lang === 'es' ? '04 · Impacto y Aprendizaje' : '04 · Impact & Takeaways';
    const pImpact = document.createElement('p');
    pImpact.textContent = pick(study.impact, lang);
    secImpact.append(hImpact, pImpact);
    frag.appendChild(secImpact);

    // Optional NDA note
    if (study.ndaNote) {
      const nda = document.createElement('div');
      nda.className = 'drawer-nda-note';
      nda.textContent = pick(study.ndaNote, lang);
      frag.appendChild(nda);
    }

    // Optional External Action
    if (study.externalUrl) {
      const actions = document.createElement('div');
      actions.className = 'drawer-actions';
      const link = document.createElement('a');
      link.className = 'btn btn-primary';
      link.href = study.externalUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = pick(study.externalLabel, lang);
      actions.appendChild(link);
      frag.appendChild(actions);
    }

    contentEl.replaceChildren(frag);
    contentEl.scrollTop = 0;
  };

  const openCaseStudy = id => {
    if (!CASE_STUDIES[id]) return;
    openerEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    activeId = id;
    render(id);
    document.body.classList.add('no-scroll');
    dialog.showModal();
  };

  const closeDrawer = () => {
    if (dialog.open) dialog.close();
  };

  closeBtn?.addEventListener('click', closeDrawer);

  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeDrawer();
  });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('no-scroll');
    activeId = null;
    openerEl?.focus();
  });

  // Bind featured project cards and drawer buttons
  document.querySelectorAll('[data-case]').forEach(el => {
    el.addEventListener('click', event => {
      if (event.target instanceof Element && event.target.closest('[data-stop-card]')) return;
      openCaseStudy(el.dataset.case);
    });

    if (el.tagName !== 'BUTTON' && el.tagName !== 'A') {
      el.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          if (event.target instanceof Element && event.target.closest('[data-stop-card]')) return;
          event.preventDefault();
          openCaseStudy(el.dataset.case);
        }
      });
    }
  });

  onLangChange(() => {
    if (dialog.open && activeId) render(activeId);
  });

  return { openCaseStudy };
}
