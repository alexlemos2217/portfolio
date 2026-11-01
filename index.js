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
  daw: {
    title: 'DAW',
    tech: { es: 'Sistema de información · Proyecto privado · Tecnologías no publicadas', en: 'Information system · Private project · Technologies not disclosed' },
    es: 'Aplicación institucional privada orientada a la gestión, consulta y organización de información. La presentación muestra una interfaz conceptual con datos ficticios: no reproduce pantallas, módulos, documentos ni información institucional real.',
    en: 'A private institutional application focused on managing, searching and organizing information. This presentation uses a conceptual interface with synthetic data: it reproduces no real screens, modules, documents or institutional information.'
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
  document.querySelectorAll('[data-aria-es][data-aria-en]').forEach(node => { node.setAttribute('aria-label', node.dataset[`aria${language === 'es' ? 'Es' : 'En'}`]); });
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
  dialog.querySelector('small').textContent = typeof data.tech === 'string' ? data.tech : data.tech[language];
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
    interactive: false,
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
    if (!canvas || !window.THREE) throw new Error('WebGL unavailable');
    this.canvas = canvas; this.progress = 0; this.lastScreen = -1;
    const T = window.THREE;
    this.renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 820 ? 1.3 : 1.7));
    this.renderer.outputColorSpace = T.SRGBColorSpace; this.renderer.toneMapping = T.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.05;
    this.scene = new T.Scene();
    const environmentFaces = [0xc7d7d5, 0x20282b, 0xf7eee1, 0x101719, 0x8fa9ac, 0x30383b].map(color => { const face = document.createElement('canvas'); face.width = face.height = 64; const context = face.getContext('2d'); const gradient = context.createLinearGradient(0, 0, 64, 64); gradient.addColorStop(0, `#${color.toString(16).padStart(6, '0')}`); gradient.addColorStop(1, '#111719'); context.fillStyle = gradient; context.fillRect(0, 0, 64, 64); return face; });
    this.environment = new T.CubeTexture(environmentFaces); this.environment.colorSpace = T.SRGBColorSpace; this.environment.needsUpdate = true; this.scene.environment = this.environment;
    this.camera = new T.PerspectiveCamera(35, 1, .1, 100); this.camera.position.set(0, 0, 14.6);
    this.phone = new T.Group(); this.scene.add(this.phone);

    const roundedShape = (w, h, r) => { const s = new T.Shape(); s.moveTo(-w / 2 + r, -h / 2); s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r); s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); s.lineTo(-w / 2 + r, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2); return s; };
    const chassisShape = roundedShape(3.02, 6.34, .44);
    const chassisGeo = new T.ExtrudeGeometry(chassisShape, { depth: .22, bevelEnabled: true, bevelSegments: 8, bevelSize: .055, bevelThickness: .045, curveSegments: 24 }); chassisGeo.center();
    const chassis = new T.Mesh(chassisGeo, new T.MeshPhysicalMaterial({ color: 0x9b9b96, metalness: .92, roughness: .2, clearcoat: .75, clearcoatRoughness: .16 })); this.phone.add(chassis);
    const back = new T.Mesh(new T.ShapeGeometry(roundedShape(2.9, 6.2, .39), 24), new T.MeshPhysicalMaterial({ color: 0x1d2222, metalness: .18, roughness: .38, clearcoat: .6, clearcoatRoughness: .22 })); back.position.z = -.185; back.rotation.y = Math.PI; this.phone.add(back);
    const bezelShape = roundedShape(2.94, 6.25, .41); bezelShape.holes.push(roundedShape(2.82, 6.12, .34));
    const bezel = new T.Mesh(new T.ShapeGeometry(bezelShape, 24), new T.MeshPhysicalMaterial({ color: 0x090b0c, metalness: .65, roughness: .22, clearcoat: 1, clearcoatRoughness: .08 })); bezel.position.z = .185; this.phone.add(bezel);

    this.screenCanvas = document.createElement('canvas'); this.screenCanvas.width = 900; this.screenCanvas.height = 1950; this.screenContext = this.screenCanvas.getContext('2d');
    this.screenTexture = new T.CanvasTexture(this.screenCanvas); this.screenTexture.colorSpace = T.SRGBColorSpace; this.screenTexture.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    const screen = new T.Mesh(new T.PlaneGeometry(2.81, 6.1), new T.MeshBasicMaterial({ map: this.screenTexture, toneMapped: false })); screen.position.z = .196; this.phone.add(screen);
    const glass = new T.Mesh(new T.PlaneGeometry(2.84, 6.13), new T.MeshPhysicalMaterial({ color: 0xdff5f5, transparent: true, opacity: .09, roughness: .04, metalness: 0, transmission: .28, clearcoat: 1, clearcoatRoughness: .03 })); glass.position.z = .207; this.phone.add(glass);
    const island = new T.Mesh(new T.CapsuleGeometry(.105, .42, 8, 18), new T.MeshPhysicalMaterial({ color: 0x020303, metalness: .25, roughness: .18, clearcoat: 1 })); island.rotation.z = Math.PI / 2; island.position.set(0, 2.84, .225); this.phone.add(island);
    const sensor = new T.Mesh(new T.SphereGeometry(.045, 16, 10), new T.MeshBasicMaterial({ color: 0x173140 })); sensor.position.set(.14, 2.84, .335); this.phone.add(sensor);
    const buttonMaterial = new T.MeshPhysicalMaterial({ color: 0xa9aaa6, metalness: .95, roughness: .18, clearcoat: .6 });
    [[-1.57, 1.28, .34], [-1.57, .63, .54], [1.57, .92, .68]].forEach(([x, y, sy]) => { const button = new T.Mesh(new T.BoxGeometry(.035, sy, .105), buttonMaterial); button.position.set(x, y, -.005); this.phone.add(button); });
    const shadow = new T.Mesh(new T.PlaneGeometry(6.4, 8.5), new T.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .22, depthWrite: false })); shadow.position.set(.55, -.6, -1.1); shadow.rotation.z = -.06; this.phone.add(shadow);

    const key = new T.RectAreaLight(0xfff6e8, 5.2, 5, 8); key.position.set(-4, 5, 7); key.lookAt(0, 0, 0); this.scene.add(key);
    const rim = new T.RectAreaLight(0x7fc5d2, 4.3, 4, 7); rim.position.set(5, 1, 4); rim.lookAt(0, 0, 0); this.scene.add(rim);
    const fill = new T.DirectionalLight(0xc4b5ff, 1.8); fill.position.set(0, -4, 5); this.scene.add(fill);
    this.scene.add(new T.HemisphereLight(0xf4f7f3, 0x07100f, 1.25));

    this.destinationImages = ['img/rumbo-costa-premium.jpg', 'img/rumbo-sierras-premium.jpg', 'img/rumbo-montevideo-premium.jpg'].map(src => { const image = new Image(); image.decoding = 'async'; image.onload = () => this.drawScreen(this.lastScreen < 0 ? 0 : this.lastScreen, true); image.src = src; return image; });
    this.drawScreen(0); this.resize(); this.setProgress(0);
  }
  roundRect(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
  photo(c, image, x, y, w, h, r, fallback) {
    c.save(); this.roundRect(c, x, y, w, h, r); c.clip();
    if (image?.complete && image.naturalWidth) { const ratio = Math.max(w / image.naturalWidth, h / image.naturalHeight); const sw = w / ratio, sh = h / ratio; c.drawImage(image, (image.naturalWidth - sw) / 2, (image.naturalHeight - sh) / 2, sw, sh, x, y, w, h); }
    else { const g = c.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, fallback); g.addColorStop(1, '#173f46'); c.fillStyle = g; c.fillRect(x, y, w, h); }
    c.restore();
  }
  brandHeader(c) {
    c.fillStyle = '#f7f6f1'; c.fillRect(0, 0, 900, 1950);
    c.fillStyle = '#10221b'; c.beginPath(); c.arc(78, 110, 30, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#f7f6f1'; c.lineWidth = 3; c.beginPath(); c.moveTo(65, 120); c.lineTo(82, 98); c.lineTo(91, 116); c.stroke();
    c.fillStyle = '#10221b'; c.font = '700 43px Manrope, Arial'; c.fillText('RUMBO', 128, 124); c.font = '600 20px Manrope, Arial'; c.fillStyle = '#6c7a74'; c.fillText('UY', 790, 120);
  }
  bottomNav(c, active = 0) {
    c.fillStyle = '#f7f6f1ee'; c.fillRect(0, 1780, 900, 170); const labels = ['INICIO', 'EXPLORAR', 'GUARDADOS'];
    labels.forEach((label, i) => { const x = 170 + i * 280; c.fillStyle = i === active ? '#173f35' : '#8b958f'; c.beginPath(); c.arc(x, 1830, i === active ? 12 : 8, 0, Math.PI * 2); c.fill(); c.font = `${i === active ? '700' : '500'} 17px Manrope, Arial`; c.textAlign = 'center'; c.fillText(label, x, 1880); }); c.textAlign = 'left';
  }
  drawScreen(stage, force = false) {
    if (stage === this.lastScreen && !force) return; this.lastScreen = stage;
    const c = this.screenContext; c.clearRect(0, 0, 900, 1950); this.brandHeader(c);
    if (stage === 0) {
      c.fillStyle = '#597068'; c.font = '600 22px Manrope, Arial'; c.fillText('DESCUBRÍ URUGUAY', 58, 245);
      c.fillStyle = '#12231c'; c.font = '700 70px Manrope, Arial'; c.fillText('¿Hacia dónde', 58, 348); c.fillText('vamos hoy?', 58, 425);
      c.fillStyle = '#ecece6'; this.roundRect(c, 58, 490, 784, 106, 53); c.fill(); c.fillStyle = '#76817c'; c.font = '500 25px Manrope, Arial'; c.fillText('Buscar destinos, rutas, paisajes', 104, 557); c.font = '500 30px Arial'; c.fillText('⌕', 782, 557);
      ['COSTA', 'SIERRAS', 'CIUDAD'].forEach((label, i) => { const x = 58 + i * 208; c.fillStyle = i === 0 ? '#163f34' : '#e8e8e1'; this.roundRect(c, x, 646, 184, 68, 34); c.fill(); c.fillStyle = i === 0 ? '#fff' : '#41534b'; c.font = '600 19px Manrope, Arial'; c.textAlign = 'center'; c.fillText(label, x + 92, 690); }); c.textAlign = 'left';
      this.photo(c, this.destinationImages[0], 58, 770, 784, 860, 56, '#789c83'); const shade = c.createLinearGradient(0, 1170, 0, 1630); shade.addColorStop(0, '#08120d00'); shade.addColorStop(1, '#08120dd8'); c.fillStyle = shade; this.roundRect(c, 58, 770, 784, 860, 56); c.fill();
      c.fillStyle = '#dff1e8'; c.font = '600 20px Manrope, Arial'; c.fillText('DESTINO DESTACADO', 105, 1450); c.fillStyle = '#fff'; c.font = '700 58px Manrope, Arial'; c.fillText('Costa atlántica', 105, 1525); c.font = '500 23px Manrope, Arial'; c.fillText('Dunas · mar · horizonte', 105, 1580); this.bottomNav(c, 0);
    } else if (stage === 1) {
      c.fillStyle = '#597068'; c.font = '600 22px Manrope, Arial'; c.fillText('COLECCIONES CURADAS', 58, 250); c.fillStyle = '#12231c'; c.font = '700 67px Manrope, Arial'; c.fillText('Tres formas', 58, 350); c.fillText('de recorrer.', 58, 425);
      ['COSTA', 'SIERRAS', 'CIUDADES'].forEach((label, i) => { const y = 500 + i * 405; this.photo(c, this.destinationImages[i], 58, y, 784, 350, 42, ['#789c83','#697b56','#38596b'][i]); const g = c.createLinearGradient(0, y + 120, 0, y + 350); g.addColorStop(0, '#06110b00'); g.addColorStop(1, '#06110bc9'); c.fillStyle = g; this.roundRect(c, 58, y, 784, 350, 42); c.fill(); c.fillStyle = '#fff'; c.font = '700 38px Manrope, Arial'; c.fillText(label, 92, y + 285); c.font = '500 18px Manrope, Arial'; c.fillText(i === 0 ? 'MAR Y DUNAS' : i === 1 ? 'CERROS Y SENDEROS' : 'CULTURA Y RAMBLA', 92, y + 320); }); this.bottomNav(c, 1);
    } else if (stage === 2) {
      c.fillStyle = '#597068'; c.font = '600 22px Manrope, Arial'; c.fillText('RECORRIDO CONCEPTUAL', 58, 248); c.fillStyle = '#12231c'; c.font = '700 65px Manrope, Arial'; c.fillText('Un país,', 58, 347); c.fillText('muchos rumbos.', 58, 422);
      c.fillStyle = '#dfe8e1'; this.roundRect(c, 58, 500, 784, 1090, 54); c.fill(); c.strokeStyle = '#86a499'; c.lineWidth = 3;
      for (let n = -450; n < 1100; n += 125) { c.beginPath(); c.moveTo(58, 680 + n); c.lineTo(842, 1130 + n); c.stroke(); c.beginPath(); c.moveTo(58, 1380 - n); c.lineTo(842, 850 - n); c.stroke(); }
      [[220,790],[620,680],[460,1070],[695,1330]].forEach(([x,y],i)=>{c.beginPath();c.fillStyle=i===2?'#f0b66d':'#174f43';c.arc(x,y,22,0,Math.PI*2);c.fill();c.lineWidth=9;c.strokeStyle='#fff';c.stroke()}); this.photo(c, this.destinationImages[2], 92, 1370, 390, 165, 25, '#38596b'); this.bottomNav(c, 1);
    } else {
      this.photo(c, this.destinationImages[0], 0, 185, 900, 950, 0, '#789c83'); const g = c.createLinearGradient(0, 650, 0, 1140); g.addColorStop(0, '#06110b00'); g.addColorStop(1, '#06110bd9'); c.fillStyle = g; c.fillRect(0, 185, 900, 950);
      c.fillStyle = '#fff'; c.font = '600 21px Manrope, Arial'; c.fillText('COSTA / URUGUAY', 58, 1010); c.font = '700 60px Manrope, Arial'; c.fillText('Horizonte abierto', 58, 1082);
      c.fillStyle = '#12231c'; c.font = '700 48px Manrope, Arial'; c.fillText('Una ruta para', 58, 1245); c.fillText('respirar distinto.', 58, 1305); c.fillStyle = '#66746e'; c.font = '500 24px Manrope, Arial'; c.fillText('Paisajes, recorridos y experiencias', 58, 1380); c.fillText('en una dirección visual conceptual.', 58, 1420);
      c.fillStyle = '#173f35'; this.roundRect(c, 58, 1510, 784, 112, 56); c.fill(); c.fillStyle = '#fff'; c.font = '700 22px Manrope, Arial'; c.fillText('EXPLORAR RECORRIDO', 98, 1580); c.font = '500 31px Arial'; c.fillText('→', 765, 1582); this.bottomNav(c, 1);
    }
    this.screenTexture.needsUpdate = true;
  }
  resize() { const w = this.canvas.clientWidth || innerWidth, h = this.canvas.clientHeight || innerHeight; this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.render(); }
  setProgress(progress) {
    this.progress = Math.max(0, Math.min(1, progress)); const p = this.progress, mobile = innerWidth <= 820;
    const mix = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t)); const segment = (a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
    if (p < .14) { const t = segment(0, .14); this.phone.position.set(mobile ? mix(.6, .15, t) : mix(3.25, 2.3, t), mix(-3.4, -.1, t), mix(-2.2, 0, t)); this.phone.rotation.set(mix(-.55, -.12, t), mix(-.72, -.34, t), mix(.18, .055, t)); this.phone.scale.setScalar(mix(.58, mobile ? .76 : .82, t)); }
    else if (p < .45) { const t = segment(.14, .45); this.phone.position.set(mix(mobile ? .15 : 2.3, mobile ? 0 : 1.75, t), mix(-.1, .02, t), 0); this.phone.rotation.set(mix(-.12, -.025, t), mix(-.34, -.16, t), mix(.055, -.015, t)); this.phone.scale.setScalar(mix(mobile ? .76 : .82, mobile ? .84 : .96, t)); }
    else if (p < .64) { const t = segment(.45, .64); this.phone.position.set(mix(mobile ? 0 : 1.75, mobile ? 0 : 1.25, t), mix(.02, 0, t), mix(0, .55, t)); this.phone.rotation.set(mix(-.025, 0, t), mix(-.16, -.035, t), mix(-.015, 0, t)); this.phone.scale.setScalar(mix(mobile ? .84 : .96, mobile ? .91 : 1.08, t)); }
    else { const t = segment(.64, .82); this.phone.position.set(mobile ? 0 : mix(1.25, .55, t), 0, mix(.55, 1.6, t)); this.phone.rotation.set(0, mix(-.035, 0, t), 0); this.phone.scale.setScalar(mix(mobile ? .91 : 1.08, mobile ? 1.04 : 1.28, t)); }
    this.drawScreen(p < .27 ? 0 : p < .4 ? 1 : p < .52 ? 2 : 3); this.camera.position.z = mix(14.6, 13.3, segment(.28, .7)); this.render();
  }
  render() { this.renderer.render(this.scene, this.camera); }
  dispose() { this.scene.traverse(node => { node.geometry?.dispose(); if (node.material) { node.material.map?.dispose(); node.material.dispose(); } }); this.screenTexture?.dispose(); this.environment?.dispose(); this.renderer.dispose(); }
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
      ...chapterConfig('.place-scene', 'chapter-place', () => vh() * (mobile ? 3.65 : 4.05), .48),
      onUpdate: self => {
        if (map && self.progress > .34) map.jumpTo({ center: [-56.1645, -34.9011], zoom: camera.zoom, bearing: camera.bearing, pitch: camera.pitch });
        rumboScene?.setProgress(Math.max(0, Math.min(1, (self.progress - .54) / .36)));
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
    .addLabel('montevideo', .4)
    .from('.city-copy', { opacity: 0, y: 85, duration: .12 }, 'montevideo')
    .to(camera, { zoom: 13.8, bearing: 8, pitch: 46, duration: .14 }, 'montevideo')
    .addLabel('arrival', .54)
    .to('.city-copy', { opacity: 0, y: -65, duration: .07 }, 'arrival')
    .fromTo('.rumbo-map-label', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .07 }, 'arrival')
    .to('#map', { scale: 1.16, filter: 'saturate(.35) brightness(.42)', duration: .07 }, 'arrival')
    .addLabel('hardware-reveal', .6)
    .to('.rumbo-map-label', { opacity: 0, y: -30, duration: .06 }, 'hardware-reveal')
    .to('#map', { opacity: .18, scale: 1.28, duration: .08 }, 'hardware-reveal')
    .addLabel('hero-product', .68)
    .fromTo('.rumbo-product-title', { opacity: 0, x: -45 }, { opacity: 1, x: 0, duration: .08 }, 'hero-product')
    .addLabel('app-exploration', .74)
    .to('.rumbo-product-title', { opacity: .2, x: mobile ? -18 : -75, duration: .08 }, 'app-exploration')
    .fromTo('.rumbo-chapter', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: .08 }, 'app-exploration')
    .addLabel('immersion', .8)
    .to('.rumbo-product-title,.rumbo-chapter', { opacity: 0, duration: .07 }, 'immersion')
    .to('#map,.map-shade,.map-credit', { opacity: 0, duration: .07 }, 'immersion')
    .addLabel('enter-product', .86)
    .to('#rumbo-webgl', { opacity: .28, duration: .06 }, 'enter-product')
    .to('.rumbo-world', { clipPath: 'circle(75% at 50% 50%)', scale: 1, duration: .06 }, 'enter-product')
    .addLabel('discover-uruguay', .9)
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

  const daw = gsap.timeline({ scrollTrigger: chapterConfig('.daw', 'chapter-daw', () => vh() * (mobile ? 1.9 : 2.2)) });
  daw.addLabel('signal', 0)
    .fromTo('.daw .product-copy', { opacity: 0, x: mobile ? -35 : -90 }, { opacity: 1, x: 0, duration: .16 }, 'signal')
    .fromTo('.daw-interface', { opacity: 0, yPercent: 42, scale: .58, rotationX: 28, rotationZ: -3, transformPerspective: 1500, transformOrigin: '50% 100%' }, { opacity: 1, yPercent: 0, scale: 1, rotationX: 5, rotationZ: 0, duration: .27 }, 'signal')
    .addLabel('assemble', .3)
    .to('.daw-interface', { rotationX: 0, xPercent: mobile ? -4 : -7, duration: .2 }, 'assemble')
    .from('.daw-toolbar,.daw-primary,.daw-metric,.daw-list', { opacity: 0, y: 55, stagger: .045, duration: .16 }, 'assemble+=.03')
    .from('.daw-primary i,.daw-list i', { scaleX: 0, transformOrigin: 'left center', stagger: .025, duration: .14 }, 'assemble+=.09')
    .addLabel('inspect', .62)
    .to('.daw .product-copy', { opacity: 0, x: -55, duration: .13 }, 'inspect')
    .to('.daw-interface', { scale: 1.24, xPercent: mobile ? -18 : -22, yPercent: -3, duration: .22 }, 'inspect')
    .addLabel('handoff', .87)
    .to('.daw-interface', { opacity: 0, yPercent: -48, xPercent: 14, rotationZ: 2, duration: .13 }, 'handoff');

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
