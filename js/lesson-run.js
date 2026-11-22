/* ==========================================================================
   lesson-run.js — the lesson runner, the picker and self-placement
   A lesson is data. A beat drives the world through the contract.
   ========================================================================== */

import { h, addTicker } from './ui.js';
import * as contract from './contract.js';
import { lessonsFor } from './lessons.js';
import * as profile from './profile.js';

let stageEl = null;
let run = null;

export function configure(el) {
  stageEl = el;
}

/* ---------- conditions ---------- */

function conditionMet(c) {
  const reg = contract.current();
  if (!reg || !c) return false;

  if (c.goal) return !!(reg.goal && reg.goal.get());
  if (!c.obs) return false;

  const o = reg.obs.get(c.obs);
  if (!o) return false;

  const v = o.get();
  if (!Number.isFinite(v)) return false;

  switch (c.op) {
    case '>': return v > c.value;
    case '>=': return v >= c.value;
    case '<': return v < c.value;
    case '<=': return v <= c.value;
    case '==': return Math.abs(v - c.value) < 1e-6;
    default: return false;
  }
}

const driveTimers = new WeakMap();

/** Briefly mark the control a lesson just moved, so the change is visible in the coach. */
function flash(p) {
  if (!p || !p.node) return;
  const node = p.node;
  node.classList.add('is-driving');
  clearTimeout(driveTimers.get(node));
  driveTimers.set(node, setTimeout(() => node.classList.remove('is-driving'), 1200));
}

function record(missing, applied) {
  if (!run) return;
  run.missing = missing;
  run.applied = applied;
}

/**
 * Drive the instrument. Returns which controls moved, and which keys the
 * lesson asked for that this world does not have — a silent no-op here is
 * exactly what makes a lesson look broken.
 */
function applyParams(map) {
  const reg = contract.current();
  const keys = Object.keys(map || {});
  const missing = [];
  const applied = [];

  if (!reg) {
    missing.push(...keys);
    record(missing, applied);
    return { applied, missing };
  }

  for (const key of keys) {
    const p = reg.params.get(key);
    if (!p) { missing.push(key); continue; }
    try {
      p.set(map[key]);
      applied.push(p.label);
      flash(p);
    } catch (e) {
      console.error(e);
      missing.push(key);
    }
  }

  record(missing, applied);
  return { applied, missing };
}

/**
 * A lesson must be reproducible, so it always starts from a known state.
 * Prefer an explicit `start` block; otherwise take the first value each beat
 * ever sets, which is almost always the lesson's intended starting point.
 */
function startingState(lesson) {
  if (lesson.start && typeof lesson.start === 'object') return lesson.start;
  const out = {};
  for (const beat of lesson.beats) {
    if (!beat.set) continue;
    for (const key of Object.keys(beat.set)) {
      if (!(key in out)) out[key] = beat.set[key];
    }
  }
  return out;
}

/* ---------- runner ---------- */

export function isRunning() {
  return !!run && !run.finished;
}

export function start(lesson) {
  stop();
  if (!stageEl) return;

  const el = h('div', { class: 'lesson-strip' });
  stageEl.appendChild(el);
  stageEl.classList.add('stage-lesson');

  run = { lesson, i: -1, t: 0, el, off: null, missing: [], applied: [], warn: '', finished: false };

  /* A lesson may need a different instrument from the one the world opens on. */
  if (lesson.instrument && !contract.useInstrument(lesson.instrument)) {
    run.warn = `This lesson needs the "${lesson.instrument}" instrument, which this world does not have.`;
  }

  /* put the instrument into the lesson's own starting state before beat 0 */
  applyParams(startingState(lesson));

  run.off = addTicker((dt) => {
    if (!run) return;
    run.t += dt;
    const beat = run.lesson.beats[run.i];
    if (!beat) return;
    if (beat.until && conditionMet(beat.until)) { advance(); return; }
    if (beat.hold && !beat.ask && run.t >= beat.hold) { advance(); }
  });

  enterBeat(0);
}

export function stop() {
  if (!run) return;
  if (run.off) { run.off(); run.off = null; }
  if (run.el && run.el.parentNode) run.el.parentNode.removeChild(run.el);
  if (stageEl) stageEl.classList.remove('stage-lesson');
  run = null;
}

function advance() {
  if (!run) return;
  enterBeat(run.i + 1);
}

function enterBeat(i) {
  if (!run) return;
  const beats = run.lesson.beats;

  if (i >= beats.length) {
    finish();
    return;
  }

  run.i = i;
  run.t = 0;

  const beat = beats[i];
  if (beat.set) applyParams(beat.set);
  render();
}

function render() {
  if (!run) return;
  const { lesson, i, el } = run;
  const beat = lesson.beats[i];

  el.innerHTML = '';

  const dots = h('div', { class: 'ls-dots' });
  lesson.beats.forEach((_, k) => {
    dots.appendChild(h('span', {
      class: 'ls-dot' + (k < i ? ' done' : k === i ? ' now' : '')
    }));
  });

  el.appendChild(h('div', { class: 'ls-head' },
    h('span', { class: 'ls-kicker' }, lesson.title),
    h('button', { class: 'ls-close', type: 'button', onclick: () => stop() }, 'Exit')));

  el.appendChild(dots);

  if (beat.say) {
    el.appendChild(h('div', { class: 'ls-text' }, beat.say));
  }

  if (beat.hint) {
    el.appendChild(h('div', { class: 'ls-hint' }, beat.hint));
  }

  if (beat.set) {
    const reg = contract.current();
    const labels = Object.keys(beat.set).map((k) => {
      const p = reg && reg.params.get(k);
      return p ? p.label : k;
    });
    el.appendChild(h('div', { class: 'ls-set' }, 'Set · ' + labels.join(' · ')));
  }

  if (run.missing && run.missing.length) {
    el.appendChild(h('div', { class: 'ls-warn' },
      `This lesson sets ${run.missing.join(', ')}, which this world does not have.`));
  }

  if (run.warn) {
    el.appendChild(h('div', { class: 'ls-warn' }, run.warn));
  }

  if (beat.ask) {
    const options = beat.options || [];
    const answer = typeof beat.answer === 'number' ? beat.answer : -1;

    el.appendChild(h('div', { class: 'ls-q' }, beat.ask));

    const opts = h('div', { class: 'ls-options' });
    options.forEach((opt, idx) => {
      opts.appendChild(h('button', {
        class: 'ls-opt',
        type: 'button',
        onclick: (ev) => {
          const b = ev.currentTarget;
          if (b.dataset.locked) return;
          const ok = idx === answer;
          for (const other of opts.children) other.dataset.locked = '1';
          b.classList.add(ok ? 'ok' : 'no');
          setTimeout(() => advance(), 700);
        }
      }, opt));
    });
    el.appendChild(opts);
  } else {
    const waiting = !!beat.until;
    el.appendChild(h('div', { class: 'ls-actions' },
      h('span', { class: 'ls-wait' }, waiting ? '● waiting for you' : ''),
      h('button', {
        class: 'btn accent ls-next',
        type: 'button',
        onclick: () => advance()
      }, waiting ? 'Skip' : 'Next')));
  }
}

const STAGE_ORDER = ['p', 'ls', 'us', 'uni'];

function nextLessonFrom(lesson) {
  const list = lessonsFor(lesson.world)
    .slice()
    .sort((a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage));
  const i = list.findIndex((l) => l.id === lesson.id);
  return i >= 0 && i + 1 < list.length ? list[i + 1] : null;
}

function finish() {
  if (!run) return;
  if (run.off) { run.off(); run.off = null; }
  run.finished = true;

  const el = run.el;
  const title = run.lesson.title;
  const next = nextLessonFrom(run.lesson);
  el.innerHTML = '';

  el.appendChild(h('div', { class: 'ls-head' },
    h('span', { class: 'ls-kicker' }, 'Lesson complete'),
    h('button', { class: 'ls-close', type: 'button', onclick: () => stop() }, 'Close')));
  el.appendChild(h('div', { class: 'ls-text' }, `${title} — done.`));
  el.appendChild(h('div', { class: 'ls-hint' },
    'Not held yet: come back in three days and do it again, and the dot in the rail goes green.'));

  if (next) {
    el.appendChild(h('div', { class: 'ls-actions' },
      h('span', { class: 'ls-wait' }, `Next · ${profile.STAGE_LABEL[next.stage]}`),
      h('button', {
        class: 'btn accent ls-next',
        type: 'button',
        onclick: () => start(next)
      }, 'Continue')));
  }
}

/* ---------- modal ---------- */

function buildModal(title) {
  const body = h('div', { class: 'modal-body' });

  const el = h('div', { class: 'modal-backdrop', role: 'dialog', 'aria-modal': 'true' },
    h('div', { class: 'modal' },
      h('div', { class: 'modal-head' },
        h('span', { class: 'modal-title' }, title),
        h('button', {
          class: 'modal-close',
          type: 'button',
          onclick: () => closeModal(m)
        }, 'Close')),
      body));

  const m = { el, body, onKey: null };
  document.body.appendChild(el);

  m.onKey = (e) => {
    if (e.key === 'Escape') closeModal(m);
  };
  document.addEventListener('keydown', m.onKey);

  return m;
}

function closeModal(m) {
  if (!m) return;
  if (m.onKey) document.removeEventListener('keydown', m.onKey);
  if (m.el && m.el.parentNode) m.el.remove();
}

/* ---------- picker ---------- */

export function openPicker(world) {
  const list = lessonsFor(world.id);
  const stage = profile.worldStage(world.id);
  const m = buildModal(`Lessons · ${world.name}`);

  if (!list.length) {
    m.body.appendChild(h('p', { class: 'modal-copy' },
      'No lessons authored for this world yet. The instruments above are free play.'));
    return;
  }

  m.body.appendChild(h('p', { class: 'modal-copy' },
    'Short guided sequences that drive the instrument for you. Your stage is set per world.'));

  const sorted = list.slice().sort((a, b) => {
    const order = ['p', 'ls', 'us', 'uni'];
    return order.indexOf(a.stage) - order.indexOf(b.stage);
  });

  for (const lesson of sorted) {
    m.body.appendChild(h('button', {
      class: 'lesson-card' + (lesson.stage === stage ? ' current' : ''),
      type: 'button',
      onclick: () => {
        closeModal(m);
        start(lesson);
      }
    },
      h('div', { class: 'lc-top' },
        h('span', { class: 'lc-stage' }, profile.STAGE_LABEL[lesson.stage]),
        h('span', { class: 'lc-count' }, `${lesson.beats.length} beats`)),
      h('div', { class: 'lc-title' }, lesson.title)));
  }
}

/* ---------- self-placement ---------- */

const PLACEMENT = [
  ['p', 'I have never met this subject, or only at school a long time ago.'],
  ['ls', 'I know the basics — the words, some rules, a few formulas.'],
  ['us', 'I can do standard problems, but I am not sure why the rules hold.'],
  ['uni', 'I am comfortable with the formal version and the derivations.']
];

export function openPlacement(world) {
  const m = buildModal('Where should I start?');
  m.body.appendChild(h('p', { class: 'modal-copy' },
    'Pick the hardest statement you are confident about. This sets the stage for this world only, and you can change it any time.'));

  for (const [stage, text] of PLACEMENT) {
    m.body.appendChild(h('button', {
      class: 'place-opt' + (profile.worldStage(world.id) === stage ? ' current' : ''),
      type: 'button',
      onclick: () => {
        profile.setWorldStage(world.id, stage);
        closeModal(m);
      }
    },
      h('span', { class: 'po-stage' }, profile.STAGE_SHORT[stage]),
      h('span', { class: 'po-text' }, text)));
  }
}
