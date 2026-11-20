import { PROFILE } from '../data/content.js';

export function initClock() {
  const clockEl = document.querySelector('#uyt-clock');
  if (!clockEl) return;

  const formatter = new Intl.DateTimeFormat('es-UY', {
    timeZone: PROFILE.timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const render = () => {
    clockEl.textContent = `${formatter.format(new Date())} UYT`;
  };

  render();
  const intervalId = setInterval(render, 1000);

  window.addEventListener('pagehide', () => clearInterval(intervalId), { once: true });
}
