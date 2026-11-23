/* ==========================================================================
   app.js — the shell: rail, stage, coach. Worlds plug in here.
   ========================================================================== */

import * as ui from './ui.js';
import { openNotes } from './notes.js';
import * as profile from './profile.js';
import * as contract from './contract.js';
import * as lesson from './lesson-run.js';
import { mountStageBar } from './stagebar.js';
import { LESSONS } from './lessons.js';
/* One manifest entry per world. The metadata lives here so the rail can
   build before any world module loads; load() pulls the module on demand,
   so a syntax error in one world can no longer blank the whole app. */
const MANIFEST = [
  {
    id: "physics", name: "Physics",
    sub: "Wave optics", accent: "#5ac8fa",
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <circle cx="4.6" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    <path d="M7.8 7.8a6 6 0 010 8.4"/>
    <path d="M11 5.2a10.4 10.4 0 010 13.6"/>
  </svg>`,
    load: () => import('./worlds/physics.js')
  },
  {
    id: "maths", name: "Maths",
    sub: "Functions", accent: "#a78bfa",
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M4.5 20V4.5M4.5 20h15"/>
    <path d="M6.5 15.5c2.4-7 6.2-7 8.6 0s6.2 7 8.6 0" opacity=".9"/>
  </svg>`,
    load: () => import('./worlds/maths.js')
  },
  {
    id: "chem", name: "Chemistry",
    sub: "Periodic table", accent: "#34d399", fade: false,
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 3.2l7.3 4.2v8.4L12 20l-7.3-4.2V7.4z"/>
    <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" opacity=".85"/>
  </svg>`,
    load: () => import('./worlds/chem.js')
  },
  {
    id: "art", name: "Art",
    sub: "Value studio", accent: "#fb7185", fade: false,
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 3.2a8.8 8.8 0 100 17.6c1.5 0 2.1-1 2.1-1.9 0-1.4-1.4-1.7-1.4-2.9 0-1 .8-1.7 2-1.7h1.5A4.7 4.7 0 0021 9.7C21 5.9 17 3.2 12 3.2z"/>
    <circle cx="8.2" cy="9.4" r=".95" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="7.4" r=".95" fill="currentColor" stroke="none"/>
    <circle cx="15.8" cy="9.8" r=".95" fill="currentColor" stroke="none"/>
  </svg>`,
    load: () => import('./worlds/art.js')
  },
  {
    id: "music", name: "Music",
    sub: "Theory & practice", accent: "#fbbf24", fade: false,
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <circle cx="7" cy="17.2" r="2.6"/>
    <circle cx="17.2" cy="15" r="2.6"/>
    <path d="M9.6 17.2V6.6l10.2-2v10.4"/>
  </svg>`,
    load: () => import('./worlds/music.js')
  },
  {
    id: "earth", name: "Earth",
    sub: "Countries & time", accent: "#60a5fa",
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="8.8"/>
    <path d="M3.2 12h17.6"/>
    <path d="M12 3.2c3 3.4 3 14.2 0 17.6M12 3.2c-3 3.4-3 14.2 0 17.6"/>
  </svg>`,
    load: () => import('./worlds/earth.js')
  },
  {
    id: "cs", name: "Code",
    sub: "Algorithms", accent: "#818cf8",
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3.5" y="5" width="17" height="14" rx="2.5"/>
    <path d="M7.5 10.5l2 2-2 2"/>
    <path d="M12.5 14.5h4"/>
  </svg>`,
    load: () => import('./worlds/cs.js')
  },
  {
    id: "finance", name: "Money",
    sub: "Compounding", accent: "#a3e635",
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 19.5h16"/>
    <path d="M6 19.5v-4M10 19.5v-7M14 19.5v-5M18 19.5v-9"/>
    <path d="M5 9.5l4-3 3 2 5-4.5"/>
  </svg>`,
    load: () => import('./worlds/finance.js')
  },
  {
    id: "language", name: "Language",
    sub: "Sentence building", accent: "#e879f9", fade: false,
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3.6 6.5h16.8v9.2H9.4l-4.2 3.4v-3.4H3.6z"/>
    <path d="M7.6 11.2h6M16.6 11.2h.6"/>
  </svg>`,
    load: () => import('./worlds/language.js')
  },
  {
    id: "astro", name: "Space",
    sub: "Orbits", accent: "#f97316", fade: false,
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="4.4"/>
    <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(-22 12 12)"/>
  </svg>`,
    load: () => import('./worlds/astronomy.js')
  },
  {
    id: "bio", name: "Biology",
    sub: "Natural selection", accent: "#4ade80", fade: false,
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M6.5 3.5c0 7 11 10 11 17"/>
    <path d="M17.5 3.5c0 7-11 10-11 17"/>
    <path d="M8.4 7.6h7.2M9.6 11.2h4.8M9.6 15.4h4.8"/>
  </svg>`,
    load: () => import('./worlds/biology.js')
  },
  {
    id: "stats", name: "Data",
    sub: "Sampling", accent: "#f59e0b", fade: false,
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M4 20V4M4 20h16"/>
    <rect x="7" y="13" width="3" height="5" rx=".6"/>
    <rect x="12" y="9" width="3" height="9" rx=".6"/>
    <rect x="17" y="5.5" width="3" height="12.5" rx=".6"/>
  </svg>`,
    load: () => import('./worlds/statistics.js')
  },
  {
    id: "climate", name: "Climate",
    sub: "Energy balance", accent: "#2dd4bf", fade: false,
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <circle cx="12" cy="12" r="4.6"/>
    <path d="M12 3.2v2.2M12 18.6v2.2M3.2 12h2.2M18.6 12h2.2"/>
    <path d="M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/>
  </svg>`,
    load: () => import('./worlds/climate.js')
  },
  {
    id: "eng", name: "Build",
    sub: "Structures", accent: "#94a3b8", fade: false,
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3.5 18.5h17"/>
    <path d="M5 18.5v-1M19 18.5v-1"/>
    <path d="M5 17.5l3.5-7 3.5 7 3.5-7 3.5 7"/>
    <path d="M8.5 10.5h7"/>
  </svg>`,
    load: () => import('./worlds/engineering.js')
  }
];

/* Rail order is the manifest order. */
const WORLDS = MANIFEST;

/* The content graph: two deliberate doors out of every room. */
const CROSS_LINKS = {
  physics: [
    { id: 'maths', name: 'Maths', why: 'The same wave, written as a function' },
    { id: 'music', name: 'Music', why: 'Interference you can hear as timbre' }
  ],
  maths: [
    { id: 'music', name: 'Music', why: 'Frequency and period, in sound' },
    { id: 'cs', name: 'Code', why: 'Why n log n matters' }
  ],
  chem: [
    { id: 'earth', name: 'Earth', why: 'Where the elements actually sit' },
    { id: 'climate', name: 'Climate', why: 'The molecules that trap heat' }
  ],
  art: [
    { id: 'stats', name: 'Data', why: 'A histogram of what you painted' },
    { id: 'music', name: 'Music', why: 'Structure made from recurring parts' }
  ],
  music: [
    { id: 'maths', name: 'Maths', why: 'Pitch is frequency you can hear' },
    { id: 'physics', name: 'Physics', why: 'Why two notes beat against each other' }
  ],
  earth: [
    { id: 'climate', name: 'Climate', why: 'A planet’s energy in and out' },
    { id: 'chem', name: 'Chemistry', why: 'The elements behind every border' }
  ],
  cs: [
    { id: 'maths', name: 'Maths', why: 'The curve behind the comparison dots' },
    { id: 'finance', name: 'Money', why: 'Another curve that compounds' }
  ],
  finance: [
    { id: 'maths', name: 'Maths', why: 'Exponentials you can feel' },
    { id: 'stats', name: 'Data', why: 'What the average hides' }
  ],
  language: [
    { id: 'music', name: 'Music', why: 'Phrase, timing and order' },
    { id: 'earth', name: 'Earth', why: 'Where a language is spoken' }
  ],
  astro: [
    { id: 'physics', name: 'Physics', why: 'The mechanics behind the orbits' },
    { id: 'climate', name: 'Climate', why: 'The sunlight that arrives here' }
  ],
  bio: [
    { id: 'chem', name: 'Chemistry', why: 'The molecules life is made of' },
    { id: 'stats', name: 'Data', why: 'Variation in a population' }
  ],
  stats: [
    { id: 'maths', name: 'Maths', why: 'Where the normal curve comes from' },
    { id: 'finance', name: 'Money', why: 'Risk is a distribution' }
  ],
  climate: [
    { id: 'physics', name: 'Physics', why: 'Radiation and equilibrium' },
    { id: 'earth', name: 'Earth', why: 'The planet that is doing it' }
  ],
  eng: [
    { id: 'maths', name: 'Maths', why: 'The linear system being solved' },
    { id: 'physics', name: 'Physics', why: 'What the member forces are' }
  ]
};

/* One concept, five lenses. Stage decides how many a learner sees. */
const LENSES = {
  physics: {
    play: 'Move the slits and watch the screen answer.',
    story: 'Young’s two-slit pattern settled a long argument about whether light is a wave.',
    notation: 'Fringe width is w = λL/d.',
    proof: 'Bright fringes appear where the path difference is a whole number of wavelengths.',
    apply: 'Gratings split starlight into its component colours.'
  },
  maths: {
    play: 'Drag a slider and watch the curve answer.',
    story: 'The sine curve began as a way to describe anything that repeats.',
    notation: 'y = a·sin(bx + c) + d, with period 2π/b.',
    proof: 'The derivative is a·b·cos(bx + c), so the steepest slope is a·b.',
    apply: 'Sharing objects evenly is division: 12 ÷ 4 = 3.'
  },
  chem: {
    play: 'Colour the table by one property and tap an element.',
    story: 'The table is arranged so that repeating patterns in properties become visible.',
    notation: 'Z is the atomic number; pulling power uses the Pauling scale.',
    proof: 'Columns share an outer-shell structure, which is why their chemistry rhymes.',
    apply: 'Fluorine’s strong pull is why PTFE barely reacts with anything.'
  },
  art: {
    play: 'Paint three values before you add any detail.',
    story: 'Value studies are a long-standing studio exercise, not a modern invention.',
    notation: 'Value runs on a scale from black at 0 to white at 1.',
    proof: 'An edge reads as a plane change where two adjacent values differ.',
    apply: 'Squint at a painting: the value structure is what survives.'
  },
  music: {
    play: 'Tap a key four times and you have a bar.',
    story: 'Common time, 4/4, underlies most of the music you know.',
    notation: 'Tempo counts beats per minute; at 120 bpm one beat is half a second.',
    proof: 'Doubling frequency halves the period, since T = 1/f.',
    apply: 'A phrase is recognised by note order, not by how fast it is played.'
  },
  earth: {
    play: 'Spin the globe and tap a country.',
    story: 'A map is a claim about what belongs where, and when.',
    notation: 'These borders are Natural Earth 110m geometry.',
    proof: 'Longitude and latitude project onto a sphere; points behind the limb are clipped.',
    apply: 'A dossier is a dated stack of events, not just a shape.'
  },
  cs: {
    play: 'Watch the two lanes race.',
    story: 'Sorting was one of the first problems where the shape of the cost mattered.',
    notation: 'The dashed reference curve grows like n log n.',
    proof: 'Doubling n for an n² algorithm multiplies the work by four.',
    apply: 'Steps per frame change only how fast you watch, not the comparisons made.'
  },
  finance: {
    play: 'Set your own numbers and watch the chart answer.',
    story: 'Compound growth is the same idea whether it helps you or works against you.',
    notation: 'A balance compounds monthly at the chosen annual rate.',
    proof: 'A yearly fee of f multiplies what you hold by (1 − f) each year.',
    apply: 'This is arithmetic on your numbers, not advice or a product.'
  },
  language: {
    play: 'Listen first, then tap the words in order.',
    story: 'Word order is one of the first things a learner notices about a new language.',
    notation: 'The tracker counts words placed and clean runs.',
    proof: 'The same words in a different order change the meaning.',
    apply: 'Slowing the voice reveals structure without changing the words.'
  },
  astro: {
    play: 'Raise Time and watch the planets move.',
    story: 'Kepler found the orbits were ellipses by working through Tycho’s measurements.',
    notation: 'The third law is T² ∝ a³.',
    proof: 'Positions come from orbital elements solved through Kepler’s equation each frame.',
    apply: 'The √a view is a presentation trick, not the true scale.'
  },
  bio: {
    play: 'Turn selection up and watch the average move.',
    story: 'Selection became visible in the finches Darwin collected, one small dataset.',
    notation: 'Mean trait and spread describe the whole distribution.',
    proof: 'A Gaussian fitness peak pulls the mean toward the environmental optimum.',
    apply: 'The landscape is simplified, but the mechanism it shows is real.'
  },
  stats: {
    play: 'Change n and watch the bars tighten.',
    story: 'The normal curve became the default because so many measurements behave like it.',
    notation: 'The spread of a sample mean is σ/√n.',
    proof: 'The white curve is predicted before any bar is drawn.',
    apply: 'A larger sample is the cheapest way to reduce uncertainty.'
  },
  climate: {
    play: 'Move albedo and watch the equilibrium change.',
    story: 'The heat balance of the Earth was worked out long before satellites.',
    notation: 'T = ((S/4)(1 − α)/(εσ))^¼.',
    proof: 'Radiated power rises as T⁴, which is why the balance is stable.',
    apply: 'The gap to real models is the feedbacks this world leaves out.'
  },
  eng: {
    play: 'Change a chord and watch the member forces recolour.',
    story: 'Trusses let long spans carry load with surprisingly little steel.',
    notation: 'Eighteen member and reaction unknowns, eighteen equations.',
    proof: 'Every joint is in equilibrium; a triangle cannot change shape without stretching a member.',
    apply: 'Strength and cost pull against each other, and that is the engineering.'
  }
};

const appEl = document.getElementById('app');
const railEl = document.getElementById('rail');
const stageEl = document.getElementById('stage');
const coachEl = document.getElementById('coach-inner');
const crumbsEl = document.getElementById('crumbs');
const toastEl = document.getElementById('toast');

let current = null;
let teardown = null;
const mountDefaults = new Map();
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

async function mount(id) {
  if (current === id) return true;
  const entry = WORLDS.find((w) => w.id === id);
  if (!entry) return false;

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
    btn.classList.remove('broken');
  }
  paintDot(id);

  setAccent(entry.accent);
  setCrumbs(entry);
  document.title = `${entry.name} — Lumen`;

  stageEl.innerHTML = entry.fade === false ? '' : '<div class="stage-fade" aria-hidden="true"></div>';
  coachEl.innerHTML = '';
  applyStage(id);

  const bar = mountStageBar(entry);
  coachEl.appendChild(bar.el);
  stageBarOff = () => { bar.dispose(); };

  maybeShowTip();

  lesson.configure(stageEl);

  let lastDone = false;

  const api = {
    toast,
    markDone(done) {
      if (done && !lastDone) {
        lastDone = true;
        const firstEver = profile.statusOf(id) === 'new';
        profile.recordMet(id);
        paintDot(id);
        /* Don't talk over a message the world just raised. */
        if (firstEver && !toastEl.classList.contains('show')) {
          toast(`${entry.name} goal met — come back in three days to hold it.`);
        }
      } else if (!done && lastDone) {
        lastDone = false;
      }
    }
  };

  contract.begin();

  /* The module loads on demand: one broken world file can no longer blank
     the app — it gets its own error card, and the rail dims its dot. */
  let world = null;
  try {
    const mod = await entry.load();
    if (current !== id) return false;   /* the learner moved on mid-load */
    world = mod.default;
    teardown = world.mount(stageEl, coachEl, api) || null;
  } catch (err) {
    console.error(err);
    contract.end();
    const btn = railItems.get(id);
    if (btn) btn.classList.add('broken');
    stageEl.appendChild(ui.h('div', {
      class: 'hud tl',
      style: { color: 'var(--bad)', top: '50%' }
    }, 'This world failed to start: ' + err.message));
    return false;
  }
  contract.end();

  /* Remember the state each world opens in, so "Reset controls" in the
     stuck helper can bring the instrument back to its own defaults. */
  const defaults = {};
  for (const p of contract.paramList()) {
    const v = p.get();
    if (Number.isFinite(v)) defaults[p.key] = v;
  }
  mountDefaults.set(id, defaults);

  const links = CROSS_LINKS[id];
  if (links) coachEl.appendChild(ui.connections(links, mount));

  const lens = LENSES[id];
  if (lens) coachEl.appendChild(ui.lenses(lens));

  watchStuck(id);
  /* Give a world's ticker a moment to publish its first observable values. */
  setTimeout(speakObservables, 300);
  return true;
}

/** Read the current observables into the screen-reader line. */
function speakObservables() {
  const node = document.getElementById('sr-live');
  if (!node) return;
  const parts = [];
  for (const o of contract.obsList().slice(0, 5)) {
    const v = o.get();
    if (Number.isFinite(v)) parts.push(`${o.label}: ${v}`);
  }
  if (!parts.length) return;
  const text = parts.join('. ');
  if (node.textContent !== text) node.textContent = text;
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

    const dismiss = () => {
      const s = coachEl.querySelector('.stuck');
      if (s) s.remove();
    };

    coachEl.appendChild(ui.h('div', { class: 'stuck' },
      ui.h('div', { class: 'stuck-text' }, 'Stuck? Same idea, less notation.'),
      ui.h('button', {
        class: 'stuck-act',
        type: 'button',
        onclick: () => {
          profile.setWorldStage(id, order[idx - 1]);
          dismiss();
        }
      }, 'Simplify'),
      ui.h('button', {
        class: 'stuck-act',
        type: 'button',
        onclick: () => {
          const world = WORLDS.find((w) => w.id === id);
          if (world) lesson.openPicker(world);
          dismiss();
        }
      }, 'Start a lesson'),
      ui.h('button', {
        class: 'stuck-act',
        type: 'button',
        onclick: () => {
          const d = mountDefaults.get(id);
          if (d) {
            for (const p of contract.paramList()) {
              if (p.key in d) {
                try { p.set(d[p.key]); } catch (e) { console.error(e); }
              }
            }
          }
          dismiss();
        }
      }, 'Reset controls')));
  }, 5000);
}

/* ---------- first run: three lines, once ---------- */

const TIP_KEY = 'lumen.tip.v1';

function maybeShowTip() {
  let seen = true;
  try { seen = localStorage.getItem(TIP_KEY) === '1'; } catch (e) { seen = true; }
  if (seen) return;

  const tip = ui.h('div', { class: 'first-run', role: 'note', 'aria-label': 'How Lumen works' },
    ui.h('div', { class: 'fr-step' },
      ui.h('b', {}, 'The rail'), ' is your subjects — fourteen worlds, each one an instrument you steer.'),
    ui.h('div', { class: 'fr-step' },
      ui.h('b', {}, 'This coach'), ' states the claim, the goal, and the controls that move it.'),
    ui.h('div', { class: 'fr-step' },
      ui.h('b', {}, 'The dots'), ' — amber means the goal was met once; green means held, met again after three days.'),
    ui.h('button', {
      class: 'fr-dismiss', type: 'button',
      onclick: () => {
        tip.remove();
        try { localStorage.setItem(TIP_KEY, '1'); } catch (e) { /* private mode */ }
      }
    }, 'Got it'));

  coachEl.appendChild(tip);
}

/* ---------- snapshots: save the instrument, bring it back exactly ---------- */

const SNAP_KEY = 'lumen.snapshots.v1';

function loadSnapshots() {
  try {
    const list = JSON.parse(localStorage.getItem(SNAP_KEY) || '[]');
    return Array.isArray(list)
      ? list.filter((s) => s && s.worldId && WORLDS.some((w) => w.id === s.worldId))
      : [];
  } catch (e) {
    return [];
  }
}

function saveSnapshots(list) {
  try { localStorage.setItem(SNAP_KEY, JSON.stringify(list.slice(0, 8))); } catch (e) { /* private mode */ }
}

function captureSnapshot() {
  if (!current) { toast('Open a world first'); return; }
  const params = {};
  for (const p of contract.paramList()) {
    const v = p.get();
    if (Number.isFinite(v)) params[p.key] = v;
  }
  const list = loadSnapshots();
  list.unshift({ worldId: current, instrument: contract.instrumentId(), params, ts: Date.now() });
  saveSnapshots(list);
  toast('Snapshot saved — ' + WORLDS.find((w) => w.id === current).name);
}

function timeAgo(ts) {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const hr = Math.round(m / 60);
  if (hr < 24) return `${hr} h ago`;
  return `${Math.round(hr / 24)} d ago`;
}

function restoreSnapshot(s) {
  /* mount() is async: params exist once it resolves. */
  return mount(s.worldId).then((ok) => {
    if (!ok) return;
    for (const [key, value] of Object.entries(s.params || {})) {
      const p = contract.paramList().find((q) => q.key === key);
      if (p) {
        try { p.set(value); } catch (e) { console.error(e); }
      }
    }
    if (s.instrument) contract.useInstrument(s.instrument);
    toast('Snapshot restored');
  });
}

function openSnapshots() {
  const m = lesson.openModal('Snapshots');

  function paint() {
    m.body.innerHTML = '';
    if (current) {
      const world = WORLDS.find((w) => w.id === current);
      m.body.appendChild(ui.h('div', { class: 'snap-save' },
        ui.h('button', {
          class: 'snap-btn primary', type: 'button',
          onclick: () => {
            captureSnapshot();
            paint();
          }
        }, `Save this world — ${world ? world.name : ''}`)));
    }
    const list = loadSnapshots();
    if (!list.length) {
      m.body.appendChild(ui.h('p', { class: 'modal-copy' },
        'No snapshots yet. Snapshot saves every control of the world you are on, so you can come back to exactly this instrument.'));
      return;
    }
    m.body.appendChild(ui.h('p', { class: 'modal-copy' },
      'Your last eight instrument states. Restoring moves you to its world and replays its controls.'));

    list.forEach((s, i) => {
      const world = WORLDS.find((w) => w.id === s.worldId);
      if (!world) return;
      m.body.appendChild(ui.h('div', { class: 'snap-row' },
        ui.h('div', { class: 'snap-info' },
          ui.h('div', { class: 'snap-name' }, world.name),
          ui.h('div', { class: 'snap-meta' },
            `${Object.keys(s.params || {}).length} controls · ${timeAgo(s.ts)}`)),
        ui.h('div', { class: 'snap-actions' },
          ui.h('button', {
            class: 'snap-btn primary', type: 'button',
            onclick: () => {
              m.close();
              restoreSnapshot(s);
            }
          }, 'Restore'),
          ui.h('button', {
            class: 'snap-btn', type: 'button',
            onclick: () => {
              const next = loadSnapshots();
              next.splice(i, 1);
              saveSnapshots(next);
              paint();
            }
          }, 'Delete'))));
    });
  }

  paint();
}

/* ---------- search: worlds and lessons, client-side ---------- */

function openSearch() {
  const m = lesson.openModal('Search');

  const input = ui.h('input', {
    class: 'modal-search', type: 'search',
    placeholder: 'Worlds and lessons…',
    'aria-label': 'Search worlds and lessons'
  });
  const results = ui.h('div', { class: 'search-results' });
  m.body.appendChild(input);
  m.body.appendChild(results);

  function go(fn) {
    m.close();
    fn();
  }

  function worldRow(w) {
    return ui.h('button', {
      class: 'search-row', type: 'button',
      onclick: () => go(() => mount(w.id))
    },
      ui.h('span', { class: 'search-ic', html: w.glyph }),
      ui.h('span', { class: 'search-name' }, w.name),
      ui.h('span', { class: 'search-kind' }, 'World'));
  }

  function lessonRow(l) {
    const w = WORLDS.find((x) => x.id === l.world);
    return ui.h('button', {
      class: 'search-row is-lesson', type: 'button',
      onclick: () => go(async () => {
        const ok = await mount(l.world);
        if (ok) lesson.start(l);
      })
    },
      ui.h('span', { class: 'search-ic', html: w ? w.glyph : '' }),
      ui.h('span', { class: 'search-name' }, l.title),
      ui.h('span', { class: 'search-kind' }, w ? w.name : l.world));
  }

  function paint() {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = '';

    if (!q) {
      for (const w of WORLDS) results.appendChild(worldRow(w));
      return;
    }

    const worlds = WORLDS.filter((w) =>
      w.name.toLowerCase().includes(q) || (w.sub || '').toLowerCase().includes(q));
    const lessons = LESSONS.filter((l) => l.title.toLowerCase().includes(q));

    if (!worlds.length && !lessons.length) {
      results.appendChild(ui.h('div', { class: 'search-none' },
        'Nothing matches that yet. Try a subject name or a lesson title.'));
      return;
    }

    for (const w of worlds.slice(0, 8)) results.appendChild(worldRow(w));
    for (const l of lessons.slice(0, 8)) results.appendChild(lessonRow(l));
  }

  input.addEventListener('input', paint);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const first = results.querySelector('button');
      if (first) first.click();
    }
  });

  paint();
  setTimeout(() => input.focus({ preventScroll: true }), 0);
}

document.getElementById('btn-snapshot').addEventListener('click', () => {
  openSnapshots();
});
document.getElementById('btn-design').addEventListener('click', () => {
  openNotes();
});
document.getElementById('btn-search').addEventListener('click', () => {
  openSearch();
});

window.addEventListener('keydown', (e) => {
  if (document.querySelector('.notes-overlay, .modal-backdrop')) return;
  const tag = document.activeElement && document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

  /* Arrow keys drive the world's primary parameter while the stage has focus. */
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    if (document.activeElement !== stageEl) return;
    const p = contract.paramList()[0];
    if (!p) return;
    const v = Number(p.get());
    if (!Number.isFinite(v)) return;
    const step = Number(p.step) || 1;
    const next = ui.clamp(v + (e.key === 'ArrowRight' ? step : -step), Number(p.min), Number(p.max));
    p.set(next);
    e.preventDefault();
    speakObservables();
    return;
  }

  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= WORLDS.length) mount(WORLDS[n - 1].id);
});

buildRail();
for (const id of railItems.keys()) paintDot(id);

profile.subscribe(() => {
  if (current) applyStage(current);
});

mount(WORLDS[0].id);
