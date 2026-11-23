/* ==========================================================================
   ui.js — the tiny kit every world is built from
   ========================================================================== */

import { registerParam, registerObs, registerGoal, parseNumber } from './contract.js';

/**
 * Keep Tab cycling inside a dialog container (notes overlay, modals).
 * Call once, after the container is in the document.
 */
export function trapFocus(container) {
  const SEL = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const items = Array.prototype.filter.call(
      container.querySelectorAll(SEL),
      (n) => !n.disabled && n.offsetWidth > 0 && n.offsetHeight > 0
    );
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus({ preventScroll: true });
    }
  });
}

/**
 * A goal must be stable at rest. A holdTracker lets a world require its
 * condition to stay true continuously for `ms` before `met` flips; drag the
 * condition away and it resets. Call `update(ok, dt)` from the world's ticker
 * (dt in seconds), and read `met` inside ui.goal's check.
 */
export function holdTracker(ms = 2000) {
  let acc = 0;
  let met = false;
  return {
    update(ok, dt) {
      if (ok) {
        acc = Math.min(ms, acc + (dt || 0) * 1000);
        if (acc >= ms) met = true;
      } else {
        acc = 0;
        met = false;
      }
      return met;
    },
    get met() { return met; },
    get secondsLeft() { return Math.max(0, (ms - acc) / 1000); }
  };
}

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
  /* A stable role for stage gating, so CSS never has to match on prose.
     New sections should extend ROLE_OF rather than inventing title strings. */
  const role = ROLE_OF[title] || '';
  return h('div', {
    class: 'section',
    dataset: role ? { title, role } : { title }
  },
    h('div', { class: 'section-head' }, h('h3', {}, title)),
    ...kids);
}

const ROLE_OF = {
  Observables: 'metrics',
  Selection: 'metrics',
  Critique: 'critique'
};

/** Two or more curated links out of this world into the content graph. */
export function connections(links, onNavigate) {
  const rows = links.map((l) => h('button', {
    class: 'xlink', type: 'button',
    onclick: () => onNavigate(l.id)
  },
    h('span', { class: 'xl-name' }, l.name),
    h('span', { class: 'xl-why' }, l.why),
    h('span', { class: 'xl-go', html: '&rarr;' })));
  return section('Connections', h('div', { class: 'xlinks' }, ...rows));
}

/** The same concept seen five ways. The stage gates which rows are shown. */
const LENS_LABELS = {
  play: 'Play', story: 'Story', notation: 'Notation', proof: 'Proof', apply: 'Apply'
};

export function lenses(map) {
  const rows = Object.keys(LENS_LABELS)
    .filter((k) => map[k])
    .map((k) => h('div', { class: `lens-row lens-${k}` },
      h('span', { class: 'lens-key' }, LENS_LABELS[k]),
      h('span', { class: 'lens-text' }, map[k])));
  return section('Lenses', h('div', { class: 'lenses' }, ...rows));
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
  let hadFinite = false;
  let warnedNaN = false;

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

      /* AGENTS invariant 5: an observable must stay numeric-parseable.
         A status string after a number parses as NaN, and any lesson waiting
         on this observable would hang forever — say so, once per incident. */
      const n = parseNumber(last);
      if (Number.isFinite(n)) {
        hadFinite = true;
        warnedNaN = false;
      } else if (hadFinite && !warnedNaN) {
        warnedNaN = true;
        console.warn(`observable "${label}" was set to "${last}" — it no longer parses as a number. Put the status in a separate observable; a lesson waiting on this would hang.`);
      }
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

/* ---- pan and zoom (PhET "Pan and Zoom") ---------------------------------
   Attach to a zoom wrapper around a world's stage content. Wheel zooms at
   the pointer; two fingers pinch-zoom and pan. A single-pointer press
   settles the view back to 1:1 so worlds that map pointer coordinates to
   canvas pixels (drawing, selecting) always see true geometry. ---------- */

export function attachPanZoom(host, opts = {}) {
  const maxScale = opts.maxScale || 4;
  let scale = 1;
  let tx = 0, ty = 0;

  const apply = () => {
    host.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    host.style.transformOrigin = '0 0';
    if (opts.onState) opts.onState(scale);
  };

  const zoomAt = (cx, cy, factor) => {
    const rect = host.getBoundingClientRect();
    const px = cx - rect.left, py = cy - rect.top;
    const next = clamp(scale * factor, 1, maxScale);
    const k = next / scale;
    tx = px - k * (px - tx);
    ty = py - k * (py - ty);
    scale = next;
    if (scale === 1) { tx = 0; ty = 0; }
    apply();
  };

  const reset = () => { scale = 1; tx = 0; ty = 0; apply(); };

  host.addEventListener('wheel', (e) => {
    if (!e.ctrlKey && Math.abs(e.deltaY) < 2) return;
    e.preventDefault();
    zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.12 : 1 / 1.12);
  }, { passive: false });

  const pts = new Map();
  let pinch = null;
  let settleTimer = 0;

  host.addEventListener('pointerdown', (e) => {
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 1 && scale > 1) {
      /* settle unless a second finger lands quickly (that is a pinch) */
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => { if (pts.size === 1) reset(); }, 160);
    }
    if (pts.size === 2) {
      clearTimeout(settleTimer);
      const [a, b] = Array.from(pts.values());
      pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, scale };
    }
  });
  host.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2 && pinch) {
      e.preventDefault();
      const [a, b] = Array.from(pts.values());
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
      zoomAt(cx, cy, d / Math.max(1, pinch.dist));
      tx += cx - pinch.cx; ty += cy - pinch.cy;
      pinch = { dist: d, cx, cy, scale };
      apply();
    }
  });
  const lift = (e) => {
    pts.delete(e.pointerId);
    if (pts.size < 2) pinch = null;
  };
  host.addEventListener('pointerup', lift);
  host.addEventListener('pointercancel', lift);

  return { reset, get scale() { return scale; } };
}
