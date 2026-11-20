import { getLang, onLangChange } from './i18n.js';

let ctx = null;
let enabled = false;

function getContext() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) ctx = new AudioCtx();
  }
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

function playTone({ freq = 520, endFreq = null, duration = 0.045, type = 'sine', gain = 0.035, delay = 0 } = {}) {
  if (!enabled) return;
  const audio = getContext();
  if (!audio) return;

  const now = audio.currentTime + delay;
  const osc = audio.createOscillator();
  const amp = audio.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (endFreq) {
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
  }

  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.008);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(amp);
  amp.connect(audio.destination);

  osc.start(now);
  osc.stop(now + duration + 0.01);
}

export const sound = {
  isEnabled: () => enabled,
  click() {
    playTone({ freq: 640, endFreq: 420, duration: 0.032, type: 'triangle', gain: 0.028 });
  },
  endpoint() {
    playTone({ freq: 540, endFreq: 760, duration: 0.04, type: 'sine', gain: 0.03 });
  },
  palette() {
    playTone({ freq: 480, endFreq: 660, duration: 0.055, type: 'sine', gain: 0.028, delay: 0 });
    playTone({ freq: 720, endFreq: 880, duration: 0.06, type: 'sine', gain: 0.022, delay: 0.035 });
  },
  copy() {
    playTone({ freq: 587, endFreq: 587, duration: 0.045, type: 'sine', gain: 0.03, delay: 0 });
    playTone({ freq: 880, endFreq: 988, duration: 0.065, type: 'sine', gain: 0.03, delay: 0.045 });
  },
  labStart() {
    playTone({ freq: 420, endFreq: 620, duration: 0.05, type: 'triangle', gain: 0.028 });
  },
  labSuccess() {
    playTone({ freq: 660, endFreq: 880, duration: 0.055, type: 'sine', gain: 0.03, delay: 0 });
    playTone({ freq: 990, endFreq: 1175, duration: 0.07, type: 'sine', gain: 0.025, delay: 0.05 });
  },
  labError() {
    playTone({ freq: 240, endFreq: 185, duration: 0.065, type: 'sawtooth', gain: 0.022, delay: 0 });
    playTone({ freq: 195, endFreq: 150, duration: 0.08, type: 'triangle', gain: 0.024, delay: 0.07 });
  }
};

export function initSound() {
  const btn = document.querySelector('#sound-toggle');
  if (!btn) return;

  const updateLabel = () => {
    const isEs = getLang() === 'es';
    btn.setAttribute('aria-pressed', String(enabled));
    btn.setAttribute(
      'aria-label',
      enabled
        ? (isEs ? 'Silenciar sonidos táctiles' : 'Mute tactile sounds')
        : (isEs ? 'Activar sonidos táctiles' : 'Enable tactile sounds')
    );
    btn.dataset.cursor = enabled ? 'Sonido ON' : 'Sonido OFF';
    btn.dataset.cursorEn = enabled ? 'Sound ON' : 'Sound OFF';
  };

  btn.addEventListener('click', () => {
    enabled = !enabled;
    updateLabel();
    if (enabled) sound.copy();
  });

  onLangChange(updateLabel);
  updateLabel();
}
