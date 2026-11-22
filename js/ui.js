/* ==========================================================================
   ui.js — the tiny kit every world is built from
   ========================================================================== */

import { registerParam, registerObs, registerGoal, parseNumber } from './contract.js';

export function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else if (k.startsWith('on') && typeof v === 'function') {
        el.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, String(v));
    }
  }
  appendKids(el, kids);
  return el;
}

function appendKids(el, kids) {
  for (const kid of kids) {
    if (kid === null || kid === undefined || kid === false) continue;
    if (Array.isArray(kid)) appendKids(el, kid);
    else if (kid instanceof Node) el.appendChild(kid);
    else el.appendChild(document.createTextNode(String(kid)));
  }
}

export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}

/* ---------- coach building blocks ---------- */

export function section(title, ...kids) {
  return h('div', { class: 'section', dataset: { title } },
    h('div', { class: 'section-head' }, h('h3', {}, title)),
    ...kids);
}

export function note(html) {
  return h('p', { class: 'note', html });
}

export function controls(...kids) {
  return h('div', { class: 'controls' }, ...kids);
}

export function slider(opts) {
  const {
    label, min = 0, max = 1, step = 0.01, value = 0,
    format = (v) => v, onInput
  } = opts;

  const out = h('span', { class: 'ctl-value' });
  const input = h('input', {
    type: 'range', min: String(min), max: String(max), step: String(step),
    'aria-label': label,
  });
  input.value = String(value);

  const paint = () => {
    const v = parseFloat(input.value);
    const pct = max === min ? 0 : ((v - min) / (max - min)) * 100;
    input.style.setProperty('--pct', pct + '%');
    out.textContent = format(v);
  };

  input.addEventListener('input', () => {
    paint();
    if (onInput) onInput(parseFloat(input.value));
  });

  const el = h('label', { class: 'ctl' },
    h('div', { class: 'ctl-head' }, h('span', { class: 'ctl-label' }, label), out),
    input);

  paint();

  registerParam({
    label, min, max, step,
    node: el,
    get: () => parseFloat(input.value),
    set: (v) => {
      input.value = String(v);
      input.dispatchEvent(new Event('input'));
    }
  });

  return {
    el,
    input,
    get value() { return parseFloat(input.value); },
    set(v) { input.value = String(v); paint(); }
  };
}

export function obs(label, unit = '') {
  const num = h('span');
  const v = h('span', { class: 'v' }, num, unit ? h('span', { class: 'u' }, unit) : null);
  const el = h('div', { class: 'obs' }, h('span', { class: 'k' }, label), v);

  let last = '—';

  registerObs({
    label,
    unit,
    get: () => parseNumber(last)
  });

  return {
    el,
    set(text, hot) {
      last = String(text);
      num.textContent = text;
      v.classList.toggle('hot', !!hot);
    }
  };
}

export function obsList(...rows) {
  return h('div', { class: 'obs-list' }, ...rows.map((r) => r.el));
}

export function goal(html, check, key = 'goal') {
  const progress = h('span', { class: 'goal-progress' });
  const el = h('div', { class: 'goal' },
    h('span', { class: 'tick' }),
    h('span', { class: 'goal-text', html }, progress));

  const api = {
    el,
    done: false,
    update() {
      let r;
      try { r = check(); } catch (e) { r = false; }
      const done = typeof r === 'boolean' ? r : !!(r && r.done);
      const prog = (r && typeof r === 'object' && r.progress) ? r.progress : '';
      if (progress.textContent !== prog) progress.textContent = prog;
      if (done !== api.done) {
        api.done = done;
        el.classList.toggle('done', done);
      }
    }
  };

  registerGoal({ key, get: () => api.done });

  return api;
}

export function toggleRow(label, initial, onChange) {
  const el = h('div', {
    class: 'toggle', role: 'button', tabindex: '0',
    'aria-pressed': String(!!initial)
  }, h('span', {}, label), h('span', { class: 'switch', 'aria-hidden': 'true' }));

  let value = !!initial;
  const set = (v) => {
    value = !!v;
    el.setAttribute('aria-pressed', String(value));
    if (onChange) onChange(value);
  };
  el.addEventListener('click', () => set(!value));
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(!value); }
  });
  el.setValue = set;
  return el;
}

export function segmented(items, initial, onChange) {
  const buttons = items.map((it) =>
    h('button', {
      type: 'button',
      'aria-pressed': String(it.id === initial),
      onclick: () => {
        for (const b of buttons) b.setAttribute('aria-pressed', 'false');
        const target = buttons.find((b) => b.dataset.id === it.id);
        if (target) target.setAttribute('aria-pressed', 'true');
        if (onChange) onChange(it.id);
      }
    }, it.label));
  buttons.forEach((b, i) => { b.dataset.id = items[i].id; });
  const el = h('div', { class: 'seg' }, ...buttons);
  el.select = (id) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
  };
  return el;
}

export function button(label, onClick, variant = '') {
  return h('button', { class: `btn ${variant}`.trim(), type: 'button', onclick: onClick }, label);
}

export function buttonRow(...kids) {
  return h('div', { class: 'btn-row' }, ...kids);
}

/* ---------- canvas ---------- */

export function fitCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const size = { w: 1, h: 1, dpr: 1 };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    size.w = Math.max(1, Math.round(rect.width));
    size.h = Math.max(1, Math.round(rect.height));
    size.dpr = dpr;
    canvas.width = Math.round(size.w * dpr);
    canvas.height = Math.round(size.h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  return { ctx, size, resize, destroy: () => ro.disconnect() };
}

/* ---------- clock ---------- */

const tickers = new Set();
let running = false;
let lastTs = 0;

function frame(ts) {
  const dt = lastTs ? Math.min(0.05, (ts - lastTs) / 1000) : 1 / 60;
  lastTs = ts;
  for (const fn of Array.from(tickers)) {
    try { fn(dt, ts); } catch (err) { console.error(err); }
  }
  if (tickers.size) {
    requestAnimationFrame(frame);
  } else {
    running = false;
    lastTs = 0;
  }
}

export function addTicker(fn) {
  tickers.add(fn);
  if (!running) {
    running = true;
    lastTs = 0;
    requestAnimationFrame(frame);
  }
  return () => tickers.delete(fn);
}

/* ---------- small maths ---------- */

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const TAU = Math.PI * 2;

export function hexToRgb(hex) {
  let s = hex.replace('#', '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  const n = parseInt(s, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgba(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

/** CIE-ish approximation of a spectral colour for 380–780 nm. */
export function wavelengthToColor(nm) {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
  else if (nm <= 780) { r = 1; }
  else { r = 0.35; g = 0.35; b = 0.35; }

  let f = 1;
  if (nm >= 380 && nm < 420) f = 0.3 + (0.7 * (nm - 380)) / 40;
  else if (nm > 700 && nm <= 780) f = 0.3 + (0.7 * (780 - nm)) / 80;

  const to = (c) => Math.round(255 * Math.pow(clamp(c * f, 0, 1), 0.82));
  return `rgb(${to(r)},${to(g)},${to(b)})`;
}

export function fmt(v, digits = 1) {
  if (!isFinite(v)) return '—';
  const abs = Math.abs(v);
  if (abs !== 0 && (abs < 0.01 || abs >= 100000)) return v.toExponential(1).replace('e+', 'e');
  return v.toFixed(digits).replace(/\.0+$/, '');
}
