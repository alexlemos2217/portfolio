'use strict';

const root = document.documentElement;
const body = document.body;
const initialHash = location.hash;
if (initialHash) history.replaceState(null, '', `${location.pathname}${location.search}`);
const header = document.querySelector('.nav');
const menu = document.querySelector('#menu');
const menuButton = document.querySelector('.menu-button');
const langButton = document.querySelector('.lang');
function enableCinematicMotionStyles() {
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (!(rule instanceof CSSMediaRule)) continue;
        if (rule.conditionText.includes('prefers-reduced-motion: reduce')) rule.media.mediaText = 'not all';
        if (rule.conditionText.includes('prefers-reduced-motion: no-preference')) rule.media.mediaText = 'all';
      }
    } catch { /* Cross-origin stylesheets are intentionally ignored. */ }
  }
}
const projectData = {
  regcrim: {
    title: 'REGCRIM',
    tech: 'PHP · MariaDB · MySQL · JavaScript · SQL',
    es: 'Sistema institucional privado para registrar, consultar, organizar y analizar información. La interfaz pública es una recreación conceptual: utiliza datos sintéticos y no expone capturas, personas ni información operativa.',
    en: 'A private institutional system for capturing, searching, organizing and analyzing information. The public interface is a conceptual recreation: it uses synthetic data and exposes no screenshots, people or operational information.'
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

function setLanguage(value) {
  const language = value === 'en' ? 'en' : 'es';
  root.dataset.lang = language;
  root.lang = language === 'en' ? 'en' : 'es-UY';
  document.querySelectorAll('[data-es][data-en]').forEach(node => { node.textContent = node.dataset[language]; });
  langButton.innerHTML = language === 'es' ? '<b>ES</b><span>EN</span>' : '<span>ES</span><b>EN</b>';
  langButton.setAttribute('aria-label', language === 'es' ? 'Switch to English' : 'Cambiar a español');
  document.querySelector('meta[name="description"]').content = language === 'es'
    ? 'Alexander Lemos — Software Developer y Creative Technologist en Montevideo. Sistemas web, datos y experiencias digitales.'
    : 'Alexander Lemos — Software Developer and Creative Technologist in Montevideo. Web systems, data and digital experiences.';
  try { localStorage.setItem('portfolio-language', language); } catch { /* Progressive enhancement. */ }
}

let preferredLanguage = 'es';
try { preferredLanguage = localStorage.getItem('portfolio-language') || 'es'; } catch { /* Spanish is the default. */ }
setLanguage(preferredLanguage);
langButton.addEventListener('click', () => setLanguage(root.dataset.lang === 'es' ? 'en' : 'es'));

function closeMenu() {
  menu.classList.remove('open');
  body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 24), { passive: true });
document.getElementById('year').textContent = new Date().getFullYear();

const dialog = document.querySelector('#detail-dialog');
document.querySelectorAll('[data-detail]').forEach(button => button.addEventListener('click', () => {
  const data = projectData[button.dataset.detail];
  const language = root.dataset.lang;
  dialog.querySelector('h2').textContent = typeof data.title === 'string' ? data.title : data.title[language];
  dialog.querySelector('.dialog-copy').textContent = data[language];
  dialog.querySelector('small').textContent = data.tech;
  dialog.showModal();
}));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

const rumboDemo = document.querySelector('.rumbo-demo');
document.querySelector('.rumbo-explore')?.addEventListener('click', () => rumboDemo.showModal());
rumboDemo?.querySelector('.rumbo-demo-close').addEventListener('click', () => rumboDemo.close());
rumboDemo?.addEventListener('click', event => { if (event.target === rumboDemo) rumboDemo.close(); });
rumboDemo?.querySelectorAll('[data-demo-view]').forEach(button => button.addEventListener('click', () => {
  rumboDemo.querySelectorAll('[data-demo-view],.demo-views section').forEach(node => node.classList.remove('active'));
  button.classList.add('active');
  rumboDemo.querySelector(`[data-view="${button.dataset.demoView}"]`)?.classList.add('active');
}));

let map;
function createMap() {
  if (!window.maplibregl || map) return;
  map = new maplibregl.Map({
    container: 'map',
    center: [-56.1645, -34.9011],
    zoom: 10.4,
    bearing: -8,
    pitch: 28,
    attributionControl: false,
    interactive: true,
    fadeDuration: 0,
    style: {
      version: 8,
      sources: { osm: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '© OpenStreetMap contributors' } },
      layers: [{ id: 'osm', type: 'raster', source: 'osm', paint: { 'raster-opacity': .96, 'raster-saturation': -.45, 'raster-contrast': .18, 'raster-brightness-min': .05, 'raster-brightness-max': .72 } }]
    }
  });
  map.on('load', () => map.resize());
  map.on('error', () => body.classList.add('map-fallback'));
}

const canvas = document.querySelector('#earth');
const context = canvas.getContext('2d', { alpha: true });
const EARTH_FRAME_COUNT = 120;
let canvasWidth = 0;
let canvasHeight = 0;
let pixelRatio = 1;
let currentEarthFrame = 0;

function resizeCanvas() {
  pixelRatio = Math.min(devicePixelRatio || 1, 2);
  canvasWidth = canvas.clientWidth;
  canvasHeight = canvas.clientHeight;
  canvas.width = Math.round(canvasWidth * pixelRatio);
  canvas.height = Math.round(canvasHeight * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  renderEarthFrame(currentEarthFrame);
  map?.resize();
  rumboScene?.resize();
}

// Procedurally pre-directed frame sequence: every integer frame is a deterministic visual state.
function renderEarthFrame(frame) {
  currentEarthFrame = Math.max(0, Math.min(EARTH_FRAME_COUNT - 1, Math.round(frame)));
  const progress = currentEarthFrame / (EARTH_FRAME_COUNT - 1);
  const radius = Math.min(canvasWidth, canvasHeight) * (.22 + progress * .31);
  const x = canvasWidth * (.66 - progress * .13);
  const y = canvasHeight * (.52 + progress * .01);
  const rotation = progress * 2.7;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.save();
  context.translate(x, y);
  const halo = context.createRadialGradient(-radius * .25, -radius * .3, 0, 0, 0, radius * 1.45);
  halo.addColorStop(0, 'rgba(76,141,255,.34)');
  halo.addColorStop(.52, 'rgba(13,46,83,.55)');
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  context.fillStyle = halo;
  context.beginPath(); context.arc(0, 0, radius * 1.45, 0, Math.PI * 2); context.fill();
  context.beginPath(); context.arc(0, 0, radius, 0, Math.PI * 2); context.clip();
  const ocean = context.createRadialGradient(-radius * .35, -radius * .4, 0, 0, 0, radius);
  ocean.addColorStop(0, '#315f96'); ocean.addColorStop(.54, '#0d2b50'); ocean.addColorStop(1, '#020811');
  context.fillStyle = ocean; context.fillRect(-radius, -radius, radius * 2, radius * 2);
  context.strokeStyle = 'rgba(192,218,255,.12)'; context.lineWidth = 1;
  for (let latitude = -60; latitude <= 60; latitude += 20) {
    const ry = radius * Math.cos(latitude * Math.PI / 180);
    const yy = radius * Math.sin(latitude * Math.PI / 180);
    context.beginPath(); context.ellipse(0, yy, ry, ry * .1, 0, 0, Math.PI * 2); context.stroke();
  }
  for (let line = 0; line < 10; line += 1) {
    context.beginPath(); context.ellipse(0, 0, radius * Math.abs(Math.cos(rotation + line * Math.PI / 5)), radius, 0, 0, Math.PI * 2); context.stroke();
  }
  context.fillStyle = 'rgba(142,171,178,.7)';
  context.beginPath();
  context.moveTo(-radius * .3, -radius * .67);
  context.bezierCurveTo(radius * .03, -radius * .78, radius * .2, -radius * .52, radius * .06, -radius * .28);
  context.bezierCurveTo(radius * .3, -radius * .08, radius * .12, radius * .08, radius * .17, radius * .3);
  context.bezierCurveTo(radius * .06, radius * .62, -radius * .05, radius * .82, -radius * .16, radius * .57);
  context.bezierCurveTo(-radius * .29, radius * .27, -radius * .45, radius * .03, -radius * .33, -radius * .2);
  context.bezierCurveTo(-radius * .51, -radius * .35, -radius * .46, -radius * .54, -radius * .3, -radius * .67);
  context.fill();
  context.shadowColor = '#6aa4ff'; context.shadowBlur = 18; context.fillStyle = '#d8e9ff';
  context.beginPath(); context.arc(-radius * .11, radius * .57, 3.5, 0, Math.PI * 2); context.fill();
  context.restore();
}

class RumboDeviceScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.progress = 0;
    this.lastScreen = -1;
    this.active = false;
    if (!canvas || !window.THREE) throw new Error('WebGL unavailable');
    const T = window.THREE;
    this.renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 820 ? 1.35 : 1.8));
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.scene = new T.Scene();
    this.camera = new T.PerspectiveCamera(32, 1, .1, 100);
    this.camera.position.set(0, 0, 13.5);
    this.phone = new T.Group();
    this.scene.add(this.phone);
    const shape = new T.Shape();
    const w = 3.08, h = 6.28, r = .34;
    shape.moveTo(-w / 2 + r, -h / 2); shape.lineTo(w / 2 - r, -h / 2); shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r); shape.lineTo(w / 2, h / 2 - r); shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); shape.lineTo(-w / 2 + r, h / 2); shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); shape.lineTo(-w / 2, -h / 2 + r); shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const bodyGeometry = new T.ExtrudeGeometry(shape, { depth: .34, bevelEnabled: true, bevelSegments: 6, steps: 1, bevelSize: .08, bevelThickness: .07, curveSegments: 18 });
    bodyGeometry.center();
    const bodyMaterial = new T.MeshPhysicalMaterial({ color: 0x161a1d, metalness: .92, roughness: .24, clearcoat: 1, clearcoatRoughness: .18 });
    this.phone.add(new T.Mesh(bodyGeometry, bodyMaterial));
    const glass = new T.Mesh(new T.PlaneGeometry(2.82, 5.95, 1, 1), new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: .08, transmission: .05, clearcoat: 1 }));
    glass.position.z = .255; this.phone.add(glass);
    this.screenCanvas = document.createElement('canvas'); this.screenCanvas.width = 900; this.screenCanvas.height = 1800;
    this.screenContext = this.screenCanvas.getContext('2d');
    this.screenTexture = new T.CanvasTexture(this.screenCanvas); this.screenTexture.colorSpace = T.SRGBColorSpace; this.screenTexture.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    const screen = new T.Mesh(new T.PlaneGeometry(2.7, 5.82), new T.MeshBasicMaterial({ map: this.screenTexture, toneMapped: false }));
    screen.position.z = .272; this.phone.add(screen);
    const speaker = new T.Mesh(new T.CapsuleGeometry(.07, .52, 4, 12), new T.MeshStandardMaterial({ color: 0x050606, metalness: .7, roughness: .35 }));
    speaker.rotation.z = Math.PI / 2; speaker.position.set(0, 2.72, .31); this.phone.add(speaker);
    const side = new T.MeshStandardMaterial({ color: 0x30363a, metalness: 1, roughness: .22 });
    [[-1.65, 1.3, .42], [-1.65, .48, .66], [1.65, .9, .78]].forEach(([x, y, sy]) => { const button = new T.Mesh(new T.BoxGeometry(.08, sy, .14), side); button.position.set(x, y, .02); this.phone.add(button); });
    const key = new T.DirectionalLight(0xddeaff, 4.4); key.position.set(-4, 5, 8); this.scene.add(key);
    const rim = new T.DirectionalLight(0x78a8ff, 3.2); rim.position.set(5, -1, 3); this.scene.add(rim);
    this.scene.add(new T.HemisphereLight(0xe9f5ff, 0x061018, 1.7));
    this.drawScreen(0); this.resize(); this.setProgress(0);
  }
  drawScreen(stage) {
    if (stage === this.lastScreen) return;
    this.lastScreen = stage;
    const c = this.screenContext, w = this.screenCanvas.width, h = this.screenCanvas.height;
    c.clearRect(0, 0, w, h); c.fillStyle = '#e7eee8'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#10221b'; c.font = '700 44px Arial'; c.fillText('RUMBO', 58, 92); c.font = '500 24px Arial'; c.fillText('UY', 790, 90);
    if (stage === 0) {
      c.fillStyle = '#3f6f62'; c.font = '500 25px Arial'; c.fillText('DESCUBRÍ URUGUAY', 58, 235); c.fillStyle = '#10221b'; c.font = '700 72px Arial'; c.fillText('¿Hacia dónde', 58, 345); c.fillText('vamos?', 58, 425);
      c.strokeStyle = '#9bb1a8'; c.lineWidth = 3; this.roundRect(c, 58, 510, 784, 110, 55); c.stroke(); c.font = '400 27px Arial'; c.fillText('Buscar destinos', 95, 580);
      this.paintLandscape(c, 58, 720, 784, 860); c.fillStyle = 'white'; c.font = '700 62px Arial'; c.fillText('COSTA', 105, 1460); c.font = '400 25px Arial'; c.fillText('Rutas  ·  Naturaleza  ·  Mar', 105, 1510);
    } else if (stage === 1) {
      c.fillStyle = '#315f52'; c.font = '500 25px Arial'; c.fillText('EXPLORAR', 58, 220); c.fillStyle = '#10221b'; c.font = '700 66px Arial'; c.fillText('Destinos', 58, 330);
      ['COSTA', 'SIERRAS', 'CIUDADES'].forEach((label, index) => { const y = 430 + index * 410; this.paintLandscape(c, 58, y, 784, 340, index); c.fillStyle = 'white'; c.font = '700 38px Arial'; c.fillText(label, 90, y + 285); });
    } else if (stage === 2) {
      c.fillStyle = '#315f52'; c.font = '500 25px Arial'; c.fillText('MAPA CONCEPTUAL', 58, 220); c.fillStyle = '#d7e4dd'; c.fillRect(58, 300, 784, 1280); c.strokeStyle = '#6f9a8e'; c.lineWidth = 3;
      for (let n = -600; n < 1200; n += 115) { c.beginPath(); c.moveTo(58, 500 + n); c.lineTo(842, 1050 + n); c.stroke(); c.beginPath(); c.moveTo(58, 1200 - n); c.lineTo(842, 650 - n); c.stroke(); }
      [[230,620],[610,510],[450,980],[700,1240]].forEach(([x,y])=>{c.beginPath();c.fillStyle='#174f43';c.arc(x,y,22,0,Math.PI*2);c.fill();c.lineWidth=8;c.strokeStyle='white';c.stroke()});
    } else {
      this.paintLandscape(c, 0, 170, 900, 980); c.fillStyle = '#10221b'; c.font = '500 25px Arial'; c.fillText('EXPERIENCIA CONCEPTUAL', 58, 1260); c.font = '700 61px Arial'; c.fillText('Costa atlántica', 58, 1360); c.font = '400 27px Arial'; c.fillStyle = '#49665d'; c.fillText('Naturaleza · rutas · experiencias', 58, 1435);
    }
    this.screenTexture.needsUpdate = true;
  }
  roundRect(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
  paintLandscape(c, x, y, w, h, variant = 0) { const sky = c.createLinearGradient(0, y, 0, y + h); sky.addColorStop(0, variant === 1 ? '#b6c9c4' : '#dfd08e'); sky.addColorStop(.42, '#789c83'); sky.addColorStop(.43, '#285d62'); sky.addColorStop(1, '#173f46'); c.fillStyle = sky; this.roundRect(c, x, y, w, h, 48); c.fill(); }
  resize() { const w = this.canvas.clientWidth || innerWidth, h = this.canvas.clientHeight || innerHeight; this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.render(); }
  setProgress(progress) {
    this.progress = Math.max(0, Math.min(1, progress));
    const p = this.progress, mobile = innerWidth <= 820;
    const mix = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
    const segment = (a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
    if (p < .12) { const t = segment(0, .12); this.phone.position.set(mobile ? 1.8 : 3.5, mix(-5.5, -.5, t), mix(-3, 0, t)); this.phone.rotation.set(mix(-.9, -.35, t), mix(-1.15, -.55, t), mix(.5, .18, t)); this.phone.scale.setScalar(mix(.45, .78, t)); }
    else if (p < .45) { const t = segment(.12, .45); this.phone.position.set(mix(mobile ? .75 : 2.6, mobile ? 0 : 1.7, t), mix(-.15, 0, t), 0); this.phone.rotation.set(mix(-.34, -.04, t), mix(-.55, -.08, t), mix(.18, 0, t)); this.phone.scale.setScalar(mix(.78, 1.03, t)); }
    else if (p < .62) { const t = segment(.45, .62); this.phone.position.set(mix(mobile ? 0 : 1.7, 0, t), 0, mix(0, 1.45, t)); this.phone.rotation.set(mix(-.04, .06, t), mix(-.08, .13, t), 0); this.phone.scale.setScalar(mix(1.03, 1.34, t)); }
    else { const t = segment(.62, .82); this.phone.position.set(0, 0, mix(1.45, 5.2, t)); this.phone.rotation.set(mix(.06, 0, t), mix(.13, 0, t), 0); this.phone.scale.setScalar(mix(1.34, 2.65, t)); }
    this.drawScreen(p < .28 ? 0 : p < .38 ? 1 : p < .5 ? 2 : 3);
    this.camera.position.z = mix(13.5, 11.2, segment(.28, .62));
    this.render();
  }
  render() { this.renderer.render(this.scene, this.camera); }
  dispose() { this.scene.traverse(node => { node.geometry?.dispose(); if (node.material) { node.material.map?.dispose(); node.material.dispose(); } }); this.renderer.dispose(); }
}

let rumboScene;
function createRumboScene() { try { rumboScene = new RumboDeviceScene(document.querySelector('#rumbo-webgl')); } catch { body.classList.add('rumbo-webgl-failed'); } }

function chapterConfig(trigger, id, distance, scrub = .8) {
  return { trigger, id, pin: true, pinSpacing: true, start: 'top top', end: typeof distance === 'function' ? () => `+=${distance()}` : `+=${distance}`, scrub, anticipatePin: 1, invalidateOnRefresh: true };
}

function initMotion() {
  if (!window.gsap || !window.ScrollTrigger) {
    body.classList.add('motion-static');
    return;
  }
  const mobile = innerWidth <= 820;
  const vh = () => innerHeight;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'none' });

  gsap.to('.progress i', { scaleY: 1, scrollTrigger: { id: 'page-progress', trigger: body, start: 'top top', end: 'bottom bottom', scrub: .2 } });

  const intro = gsap.timeline({ scrollTrigger: chapterConfig('.intro', 'chapter-intro', () => vh() * (mobile ? 1.8 : 2.15)) });
  intro.addLabel('reveal', 0)
    .from('.intro h1 .line i', { yPercent: 105, stagger: .08, duration: .22 }, 'reveal')
    .from('.intro-meta,.intro-copy>.overline', { opacity: 0, y: 30, duration: .18 }, 'reveal+=.06')
    .addLabel('open', .24)
    .to('.intro h1 .line:first-child i', { xPercent: mobile ? 7 : 15, scale: 1.12, duration: .38 }, 'open')
    .to('.intro h1 .outline i', { xPercent: mobile ? -9 : -18, scale: 1.18, duration: .38 }, 'open')
    .to('.orb', { scale: 1.85, rotation: 45, opacity: .18, duration: .38 }, 'open')
    .to('.scroll-note,.intro-meta,.intro-copy>.overline', { opacity: 0, y: -35, duration: .18 }, 'open')
    .addLabel('handoff', .68)
    .to('.intro h1', { xPercent: -42, scale: .58, duration: .28 }, 'handoff')
    .to('.intro-canvas', { backgroundColor: '#08090b', duration: .28 }, 'handoff')
    .to('.orb', { xPercent: 32, scale: .55, opacity: 0, duration: .28 }, 'handoff');

  const portrait = gsap.timeline({ scrollTrigger: chapterConfig('.portrait-scene', 'chapter-portrait', () => vh() * (mobile ? 2.05 : 2.35)) });
  portrait.addLabel('concealed', 0)
    .set('.portrait-frame', { autoAlpha: 1 })
    .fromTo('.portrait-intro h2', { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .16 }, 'concealed')
    .fromTo('.portrait-reveal', { clipPath: 'inset(50% 0 50% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration: .24 }, 'concealed+=.08')
    .fromTo('.portrait-frame img', { scale: mobile ? 1.05 : 1.12 }, { scale: 1, duration: .24 }, 'concealed+=.08')
    .addLabel('open', .28)
    .to('.portrait-intro', { xPercent: mobile ? -5 : -20, opacity: .18, duration: .18 }, 'open')
    .to('.portrait-frame', { xPercent: mobile ? 0 : -30, scale: mobile ? 1 : 1.06, duration: .22 }, 'open')
    .fromTo('.portrait-statement', { y: 65, opacity: 0 }, { y: 0, opacity: 1, duration: .18 }, 'open+=.05')
    .addLabel('hero', .5)
    .to('.portrait-frame', { scale: mobile ? 1.02 : 1.13, duration: .18 }, 'hero')
    .to('.portrait-statement', { opacity: 1, duration: .18 }, 'hero')
    .addLabel('rest', .62)
    .to({}, { duration: .12 }, 'rest')
    .addLabel('exit', .76)
    .to('.portrait-intro,.portrait-statement', { opacity: 0, y: -45, duration: .2 }, 'exit')
    .to('.portrait-frame', { scale: mobile ? .36 : .28, xPercent: mobile ? 48 : 112, yPercent: mobile ? -18 : -8, opacity: .28, duration: .24 }, 'exit')
    .to('.portrait-stage', { backgroundColor: '#020407', duration: .24 }, 'exit');

  const earthSequence = { frame: 0 };
  const camera = { zoom: 10.4, bearing: -8, pitch: 28 };
  const place = gsap.timeline({
    scrollTrigger: {
      ...chapterConfig('.place-scene', 'chapter-place', () => vh() * (mobile ? 3.35 : 3.75), .48),
      onUpdate: self => {
        if (map && self.progress > .34) map.jumpTo({ center: [-56.1645, -34.9011], zoom: camera.zoom, bearing: camera.bearing, pitch: camera.pitch });
        rumboScene?.setProgress(Math.max(0, Math.min(1, (self.progress - .42) / .58)));
      }
    }
  });
  place.addLabel('world', 0)
    .to(earthSequence, { frame: EARTH_FRAME_COUNT - 1, snap: 'frame', duration: .34, onUpdate: () => renderEarthFrame(earthSequence.frame) }, 'world')
    .from('.world-copy', { opacity: 0, y: 55, duration: .12 }, 'world')
    .addLabel('south-america', .18)
    .to('.world-copy', { opacity: 0, y: -75, duration: .12 }, 'south-america')
    .from('.coordinates', { opacity: 0, y: 55, duration: .14 }, 'south-america')
    .addLabel('uruguay', .34)
    .to('.coordinates', { opacity: 0, y: -60, duration: .1 }, 'uruguay')
    .to('#earth', { opacity: 0, scale: 2.5, duration: .13 }, 'uruguay')
    .set('#map', { visibility: 'visible' }, 'uruguay')
    .to('#map,.map-shade,.map-credit', { opacity: 1, duration: .13 }, 'uruguay')
    .to(camera, { zoom: 12.1, bearing: -2, pitch: 36, duration: .13 }, 'uruguay')
    .addLabel('montevideo', .48)
    .from('.city-copy', { opacity: 0, y: 85, duration: .15 }, 'montevideo')
    .to(camera, { zoom: 13.8, bearing: 8, pitch: 46, duration: .18 }, 'montevideo')
    .addLabel('arrival', .42)
    .to('.city-copy', { opacity: 0, y: -65, duration: .08 }, 'arrival')
    .fromTo('.rumbo-map-label', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .07 }, 'arrival')
    .to('#map', { scale: 1.16, filter: 'saturate(.35) brightness(.42)', duration: .07 }, 'arrival')
    .addLabel('device', .49)
    .to('.rumbo-map-label', { opacity: 0, y: -30, duration: .06 }, 'device')
    .to('#map', { opacity: .18, scale: 1.28, duration: .09 }, 'device')
    .fromTo('.rumbo-product-title', { opacity: 0, x: -45 }, { opacity: 1, x: 0, duration: .09 }, 'device')
    .addLabel('experience', .58)
    .to('.rumbo-product-title', { opacity: .2, x: mobile ? -18 : -75, duration: .1 }, 'experience')
    .fromTo('.rumbo-chapter', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: .1 }, 'experience')
    .addLabel('into-product', .68)
    .to('.rumbo-product-title,.rumbo-chapter', { opacity: 0, duration: .1 }, 'into-product')
    .to('#map,.map-shade,.map-credit', { opacity: 0, duration: .1 }, 'into-product')
    .addLabel('beyond-screen', .78)
    .to('#rumbo-webgl', { opacity: .28, duration: .09 }, 'beyond-screen')
    .to('.rumbo-world', { clipPath: 'circle(75% at 50% 50%)', scale: 1, duration: .09 }, 'beyond-screen')
    .addLabel('discover-uruguay', .87)
    .to('#rumbo-webgl', { opacity: 0, duration: .08 }, 'discover-uruguay')
    .fromTo('.rumbo-editorial', { opacity: 0, y: 45 }, { opacity: 1, y: 0, duration: .08 }, 'discover-uruguay')
    .to('.rumbo-explore', { autoAlpha: 1, duration: .08 }, 'discover-uruguay')
    .addLabel('next-chapter', .95)
    .to('.rumbo-editorial,.rumbo-explore', { opacity: 0, y: -35, duration: .05 }, 'next-chapter')
    .to('.rumbo-world', { filter: 'brightness(.28) saturate(.6)', scale: 1.06, duration: .05 }, 'next-chapter');

  const reg = gsap.timeline({ scrollTrigger: chapterConfig('.regcrim', 'chapter-regcrim', () => vh() * (mobile ? 1.75 : 2.05)) });
  reg.addLabel('distance', 0)
    .fromTo('.regcrim .product-copy', { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: .18 }, 'distance')
    .fromTo('.reg-interface', { opacity: 0, scale: .52, rotationY: -24, rotationX: 10, xPercent: 22, transformPerspective: 1400 }, { opacity: 1, scale: 1, rotationY: 0, rotationX: 0, xPercent: 0, duration: .3 }, 'distance')
    .addLabel('reveal', .3)
    .to('.reg-interface', { scale: 1.02, rotationY: 0, rotationX: 0, xPercent: -5, duration: .28 }, 'reveal')
    .from('.reg-map i,.reg-bars i,.reg-list i', { opacity: 0, scaleY: 0, stagger: .018, duration: .16 }, 'reveal+=.04')
    .addLabel('feature', .62)
    .to('.regcrim .product-copy', { opacity: 0, x: -100, duration: .15 }, 'feature')
    .to('.reg-interface', { scale: 1.32, xPercent: -18, yPercent: -4, duration: .22 }, 'feature')
    .addLabel('exit', .86)
    .to('.reg-interface', { opacity: 0, xPercent: -80, duration: .14 }, 'exit');

  const ops = gsap.timeline({ scrollTrigger: chapterConfig('.secretaria', 'chapter-secretaria', () => vh() * (mobile ? 1.75 : 2.05)) });
  ops.addLabel('surface', 0)
    .fromTo('.secretaria .product-copy', { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: .18 }, 'surface')
    .fromTo('.ops-interface', { opacity: 0, scale: .65, z: -300, rotationX: 12, transformPerspective: 1300 }, { opacity: 1, scale: 1, z: 0, rotationX: 0, duration: .26 }, 'surface')
    .addLabel('structure', .32)
    .to('.ops-interface', { scale: 1, z: 0, rotationX: 0, xPercent: -7, duration: .24 }, 'structure')
    .from('.ops-numbers span,.ops-flow i', { opacity: 0, y: 45, stagger: .035, duration: .14 }, 'structure+=.05')
    .addLabel('focus', .62)
    .to('.secretaria .product-copy', { opacity: 0, y: -55, duration: .14 }, 'focus')
    .to('.ops-interface', { scale: 1.25, xPercent: -20, duration: .22 }, 'focus')
    .addLabel('exit', .87)
    .to('.ops-interface', { xPercent: -120, opacity: 0, duration: .13 }, 'exit');

  const nexus = gsap.timeline({ scrollTrigger: chapterConfig('.nexus', 'chapter-nexus', () => vh() * (mobile ? 1.75 : 2.05)) });
  nexus.addLabel('type', 0)
    .fromTo('.nexus .product-copy', { opacity: 0, x: -70 }, { opacity: 1, x: 0, duration: .16 }, 'type')
    .fromTo('.nexus-interface', { opacity: 0, scale: .7, rotationY: 20, transformPerspective: 1300 }, { opacity: 1, scale: 1, rotationY: 0, duration: .25 }, 'type')
    .addLabel('assemble', .28)
    .from('.nexus-issue', { xPercent: -65, opacity: 0, duration: .2 }, 'assemble')
    .from('.nexus-tile.one', { xPercent: 75, opacity: 0, duration: .18 }, 'assemble+=.04')
    .from('.nexus-tile.two', { xPercent: 90, opacity: 0, duration: .18 }, 'assemble+=.1')
    .from('.nexus-sphere', { scale: 0, rotation: 110, duration: .2 }, 'assemble+=.08')
    .addLabel('read', .62)
    .to('.nexus .product-copy', { opacity: 0, y: -65, duration: .14 }, 'read')
    .to('.nexus-interface', { scale: 1.22, xPercent: -16, duration: .22 }, 'read')
    .addLabel('disperse', .86)
    .to('.nexus-issue', { xPercent: -50, duration: .14 }, 'disperse')
    .to('.nexus-tile', { xPercent: 65, duration: .14 }, 'disperse')
    .to('.nexus-sphere', { scale: 1.45, yPercent: 28, duration: .14 }, 'disperse');

  gsap.from('.archive-list>*', { opacity: 0, y: 30, stagger: .06, scrollTrigger: { id: 'archive-reveal', trigger: '.archive', start: 'top 70%', end: 'top 24%', scrub: .5 } });
  gsap.from('.trajectory-list article', { opacity: 0, y: 40, stagger: .1, scrollTrigger: { id: 'trajectory-reveal', trigger: '.trajectory-list', start: 'top 75%', end: 'center 55%', scrub: .5 } });
  gsap.from('.contact h2 span,.contact h2 i', { yPercent: 100, opacity: 0, stagger: .1, scrollTrigger: { id: 'contact-reveal', trigger: '.contact', start: 'top 68%', end: 'top 18%', scrub: .6 } });

  const chapterTriggers = new Map(ScrollTrigger.getAll().filter(trigger => trigger.vars.id?.startsWith('chapter-')).map(trigger => [trigger.trigger.id || trigger.trigger.dataset.product, trigger]));
  menu.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    const id = link.hash.slice(1);
    const trigger = chapterTriggers.get(id);
    if (!trigger) return;
    event.preventDefault();
    closeMenu();
    scrollTo({ top: trigger.start + 1, behavior: 'smooth' });
    history.replaceState(null, '', link.hash);
  }));

  ScrollTrigger.addEventListener('refreshInit', () => map?.resize());
  ScrollTrigger.refresh();
  requestAnimationFrame(() => {
    if (!initialHash) return;
    const id = initialHash.slice(1);
    const trigger = chapterTriggers.get(id);
    if (trigger) {
      scrollTo(0, trigger.start + 1);
      history.replaceState(null, '', initialHash);
    }
  });
}

let resizeTimer;
addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    resizeCanvas();
    window.ScrollTrigger?.refresh();
  }, 160);
}, { passive: true });

addEventListener('pagehide', () => {
  window.ScrollTrigger?.getAll().forEach(trigger => trigger.kill());
  map?.remove();
  rumboScene?.dispose();
  map = undefined;
}, { once: true });

async function boot() {
  enableCinematicMotionStyles();
  resizeCanvas();
  renderEarthFrame(0);
  createRumboScene();
  const portrait = document.querySelector('.portrait-frame img');
  await Promise.race([
    Promise.allSettled([document.fonts?.ready, portrait?.decode?.()]),
    new Promise(resolve => setTimeout(resolve, 1200))
  ]);
  createMap();
  initMotion();
}

if (document.readyState === 'loading') addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
