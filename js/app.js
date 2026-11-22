/* ==========================================================================
   app.js — the shell: rail, stage, coach. Worlds plug in here.
   ========================================================================== */

import * as ui from './ui.js';
import { openNotes } from './notes.js';
import * as profile from './profile.js';
import * as contract from './contract.js';
import * as lesson from './lesson-run.js';
import { mountStageBar } from './stagebar.js';
import physics from './worlds/physics.js';
import maths from './worlds/maths.js';
import chem from './worlds/chem.js';
import art from './worlds/art.js';
import music from './worlds/music.js';
import earth from './worlds/earth.js';
import cs from './worlds/cs.js';
import finance from './worlds/finance.js';
import language from './worlds/language.js';
import astronomy from './worlds/astronomy.js';
import biology from './worlds/biology.js';
import statistics from './worlds/statistics.js';
import climate from './worlds/climate.js';
import engineering from './worlds/engineering.js';

const WORLDS = [
  physics, maths, chem, art, music, earth,
  cs, finance, language, astronomy, biology, statistics, climate, engineering
];

const appEl = document.getElementById('app');
const railEl = document.getElementById('rail');
const stageEl = document.getElementById('stage');
const coachEl = document.getElementById('coach-inner');
const crumbsEl = document.getElementById('crumbs');
const toastEl = document.getElementById('toast');

let current = null;
let teardown = null;
let toastTimer = 0;
let stageBarOff = null;
let stuckTimer = 0;
let stuckShown = false;

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

const railItems = new Map();

function buildRail() {
  for (const world of WORLDS) {
    const btn = ui.h('button', {
      class: 'rail-item',
      type: 'button',
      'aria-current': 'false',
      'aria-label': world.name,
      onclick: () => mount(world.id)
    },
      ui.h('span', { class: 'dot' }),
      ui.h('span', { class: 'ic', html: world.glyph }),
      ui.h('span', { class: 'lbl' }, world.name));

    railItems.set(world.id, btn);
    railEl.appendChild(btn);
  }
}

function setCrumbs(world) {
  const parts = [world.name, world.sub].filter(Boolean);
  crumbsEl.innerHTML = '';
  parts.forEach((p, i) => {
    if (i > 0) crumbsEl.appendChild(ui.h('span', { class: 'sep' }, '/'));
    crumbsEl.appendChild(ui.h('span', { class: i === parts.length - 1 ? 'now' : '' }, p));
  });
}

function setAccent(hex) {
  const { r, g, b } = ui.hexToRgb(hex);
  appEl.style.setProperty('--accent', hex);
  appEl.style.setProperty('--accent-soft', `rgba(${r},${g},${b},0.14)`);
  document.querySelector('meta[name="theme-color"]').setAttribute('content', '#05070a');
}

/** Stage and mode become classes on the coach, which is what gates the lenses. */
function applyStage(id) {
  coachEl.className = 'coach-inner stage-' + profile.worldStage(id) + ' mode-' + profile.getProfile().mode;
}

function paintDot(id) {
  const btn = railItems.get(id);
  if (!btn) return;
  const st = profile.statusOf(id);
  btn.classList.toggle('done', st === 'held');
  btn.classList.toggle('met', st === 'met');
}

function mount(id) {
  if (current === id) return;
  const world = WORLDS.find((w) => w.id === id);
  if (!world) return;

  if (teardown) {
    try { teardown(); } catch (e) { console.error(e); }
    teardown = null;
  }
  if (stageBarOff) { stageBarOff(); stageBarOff = null; }
  lesson.stop();
  clearInterval(stuckTimer);
  stuckTimer = 0;
  stuckShown = false;

  current = id;

  for (const [wid, btn] of railItems) {
    btn.setAttribute('aria-current', String(wid === id));
  }
  paintDot(id);

  setAccent(world.accent);
  setCrumbs(world);
  document.title = `${world.name} — Lumen`;

  stageEl.innerHTML = world.fade === false ? '' : '<div class="stage-fade" aria-hidden="true"></div>';
  coachEl.innerHTML = '';
  applyStage(id);

  const bar = mountStageBar(world);
  coachEl.appendChild(bar.el);
  stageBarOff = () => { bar.dispose(); };

  lesson.configure(stageEl);

  let lastDone = false;

  const api = {
    toast,
    markDone(done) {
      if (done && !lastDone) {
        lastDone = true;
        profile.recordMet(id);
        paintDot(id);
      } else if (!done && lastDone) {
        lastDone = false;
      }
    }
  };

  contract.begin();
  try {
    teardown = world.mount(stageEl, coachEl, api) || null;
  } catch (err) {
    console.error(err);
    stageEl.appendChild(ui.h('div', {
      class: 'hud tl',
      style: { color: 'var(--bad)', top: '50%' }
    }, 'This world failed to start: ' + err.message));
  }
  contract.end();

  watchStuck(id);
}

/** After two and a half minutes on an unmet goal, offer to strip it back. */
function watchStuck(id) {
  const started = Date.now();
  stuckTimer = setInterval(() => {
    if (stuckShown) return;
    if (Date.now() - started < 150000) return;
    if (!current || lesson.isRunning()) return;
    if (contract.goalDone()) return;
    if (coachEl.querySelector('.stuck')) { stuckShown = true; return; }

    stuckShown = true;

    const order = ['p', 'ls', 'us', 'uni'];
    const now = profile.worldStage(id);
    const idx = order.indexOf(now);

    if (idx <= 0) return;

    coachEl.appendChild(ui.h('div', { class: 'stuck' },
      ui.h('div', { class: 'stuck-text' }, 'Stuck? Same idea, less notation.'),
      ui.h('button', {
        class: 'stuck-act',
        type: 'button',
        onclick: () => {
          profile.setWorldStage(id, order[idx - 1]);
          const s = coachEl.querySelector('.stuck');
          if (s) s.remove();
        }
      }, 'Simplify')));
  }, 5000);
}

document.getElementById('btn-snapshot').addEventListener('click', () => {
  toast('Snapshot saved to your notebook');
});
document.getElementById('btn-design').addEventListener('click', () => {
  openNotes();
});
document.getElementById('btn-search').addEventListener('click', () => {
  toast('Search across 14 worlds — coming next');
});

window.addEventListener('keydown', (e) => {
  if (document.querySelector('.notes-overlay')) return;
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= WORLDS.length) mount(WORLDS[n - 1].id);
});

buildRail();
for (const id of railItems.keys()) paintDot(id);

profile.subscribe(() => {
  if (current) applyStage(current);
});

mount(WORLDS[0].id);
