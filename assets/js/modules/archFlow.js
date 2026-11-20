import { ARCH_SCENARIOS } from '../data/content.js';
import { getLang, onLangChange } from './i18n.js';
import { sound } from './sound.js';

const NODE_COORDS = [
  { x: 65, y: 74 },
  { x: 205, y: 74 },
  { x: 345, y: 74 },
  { x: 485, y: 74 }
];

function formatRealTimestamp(baseTime, deltaMs) {
  const dt = new Date(baseTime + deltaMs);
  const hh = String(dt.getHours()).padStart(2, '0');
  const mm = String(dt.getMinutes()).padStart(2, '0');
  const ss = String(dt.getSeconds()).padStart(2, '0');
  const ms = String(dt.getMilliseconds()).padStart(3, '0');
  return `${hh}:${mm}:${ss}.${ms}`;
}

export function initArchFlow() {
  const simulateBtn = document.querySelector('#arch-simulate');
  const statusPill = document.querySelector('#arch-status');
  const traceEl = document.querySelector('#arch-trace');
  const packetEl = document.querySelector('#arch-packet');
  const nodes = Array.from(document.querySelectorAll('.arch-node'));
  const scenarioBtns = Array.from(document.querySelectorAll('[data-scenario]'));

  if (!simulateBtn || !traceEl || !packetEl || nodes.length < 4) {
    return { simulate: () => {} };
  }

  let currentScenario = 'miss';
  let running = false;
  let timers = [];

  const clearTimers = () => {
    timers.forEach(id => clearTimeout(id));
    timers = [];
  };

  const resetVisuals = () => {
    nodes.forEach(node => node.classList.remove('is-active', 'is-done', 'is-hit', 'is-error'));
    packetEl.classList.remove('is-flying', 'is-hit', 'is-error');
  };

  const setStatusPill = (text, mode = 'idle') => {
    if (!statusPill) return;
    statusPill.textContent = text;
    statusPill.classList.toggle('is-error', mode === 'error');
  };

  const appendTrace = (timestamp, step) => {
    const li = document.createElement('li');
    const msSpan = document.createElement('span');
    msSpan.className = 'trace-ms';
    msSpan.textContent = `[${timestamp}]`;

    const textSpan = document.createElement('span');
    textSpan.textContent = step.text;
    if (step.tone === 'ok') textSpan.className = 'trace-ok';
    if (step.tone === 'warn') textSpan.className = 'trace-warn';
    if (step.tone === 'err') textSpan.className = 'trace-err';

    li.append(msSpan, textSpan);
    traceEl.appendChild(li);
  };

  const animatePacket = (fromIdx, toIdx, durationMs) => {
    const start = NODE_COORDS[fromIdx];
    const end = NODE_COORDS[toIdx];
    const t0 = performance.now();

    const frame = now => {
      const progress = Math.min(1, (now - t0) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      const x = start.x + (end.x - start.x) * eased;
      const y = start.y + (end.y - start.y) * eased;
      packetEl.setAttribute('cx', x.toFixed(1));
      packetEl.setAttribute('cy', y.toFixed(1));
      if (progress < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  const renderIdle = () => {
    clearTimers();
    resetVisuals();
    setStatusPill('READY · TLS 1.3', 'idle');
    const lang = getLang();
    traceEl.replaceChildren();
    const li = document.createElement('li');
    const ms = document.createElement('span');
    ms.className = 'trace-ms';
    ms.textContent = '[READY]';
    const msg = document.createElement('span');
    msg.textContent = lang === 'es'
      ? 'Elegí un escenario (Cache Miss, Cache Hit o 401) o presioná "Simular Request".'
      : 'Pick a scenario (Cache Miss, Cache Hit or 401) or click "Simulate Request".';
    li.append(ms, msg);
    traceEl.appendChild(li);
  };

  const simulate = (overrideScenario = null) => {
    if (overrideScenario && ARCH_SCENARIOS[overrideScenario]) {
      currentScenario = overrideScenario;
      scenarioBtns.forEach(item => {
        const active = item.dataset.scenario === currentScenario;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
    }

    if (running) {
      clearTimers();
      running = false;
      simulateBtn.disabled = false;
    }

    resetVisuals();
    traceEl.replaceChildren();

    const lang = getLang();
    const scenario = ARCH_SCENARIOS[currentScenario] || ARCH_SCENARIOS.miss;
    const steps = scenario.steps[lang];
    const baseTime = Date.now();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    sound.labStart();

    if (reducedMotion) {
      if (scenario.mode === 'hit') {
        nodes[0]?.classList.add('is-hit');
        nodes[1]?.classList.add('is-hit');
      } else if (scenario.mode === 'error') {
        nodes[0]?.classList.add('is-done');
        nodes[1]?.classList.add('is-error');
      } else {
        nodes.forEach(node => node.classList.add('is-done'));
      }
      steps.forEach(step => appendTrace(formatRealTimestamp(baseTime, step.deltaMs), step));
      setStatusPill(scenario.status, scenario.mode);
      if (scenario.mode === 'error') sound.labError();
      else sound.labSuccess();
      return;
    }

    running = true;
    simulateBtn.disabled = true;
    setStatusPill('RUNNING...', 'idle');

    packetEl.setAttribute('cx', String(NODE_COORDS[0].x));
    packetEl.setAttribute('cy', String(NODE_COORDS[0].y));
    packetEl.classList.add('is-flying');
    if (scenario.mode === 'hit') packetEl.classList.add('is-hit');
    if (scenario.mode === 'error') packetEl.classList.add('is-error');

    const stepDelay = scenario.mode === 'hit' ? 280 : 350;

    steps.forEach((step, idx) => {
      const id = setTimeout(() => {
        nodes.forEach(n => n.classList.remove('is-active'));
        const targetNode = nodes[step.node];
        if (targetNode) {
          if (scenario.mode === 'error' && step.node === 1) {
            targetNode.classList.add('is-error');
          } else if (scenario.mode === 'hit' && step.node === 1) {
            targetNode.classList.add('is-hit');
          } else {
            targetNode.classList.add('is-active', 'is-done');
          }
        }

        appendTrace(formatRealTimestamp(baseTime, step.deltaMs), step);

        const nextStep = steps[idx + 1];
        if (nextStep) {
          animatePacket(step.node, nextStep.node, stepDelay - 50);
        } else {
          setStatusPill(scenario.status, scenario.mode);
          if (scenario.mode === 'error') sound.labError();
          else sound.labSuccess();

          const finishId = setTimeout(() => {
            packetEl.classList.remove('is-flying');
            nodes.forEach(n => n.classList.remove('is-active'));
            running = false;
            simulateBtn.disabled = false;
          }, 340);
          timers.push(finishId);
        }
      }, idx * stepDelay);
      timers.push(id);
    });
  };

  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => simulate(btn.dataset.scenario));
  });

  simulateBtn.addEventListener('click', () => simulate());

  onLangChange(() => {
    if (!running) renderIdle();
  });

  renderIdle();

  return { simulate };
}
