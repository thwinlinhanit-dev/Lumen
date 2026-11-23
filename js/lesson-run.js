/* ==========================================================================
   lesson-run.js — the lesson runner, the picker and self-placement
   A lesson is data. A beat drives the world through the contract.
   ========================================================================== */

import { h, addTicker, trapFocus } from './ui.js';
import * as contract from './contract.js';
import { LESSONS, lessonsFor, DIAGNOSTICS, FAST_PATH, ENRICHMENT, TROUBLE_QUIZ } from './lessons.js';
import * as profile from './profile.js';
import * as sound from './sound.js';
import { STRINGS } from './strings.js';

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
  /* A top-of-stage badge makes it unmistakable that the instrument is now
     lesson-driven, even when the opening beat is only narration. */
  const badge = h('div', { class: 'lesson-badge' },
    h('span', { class: 'lb-dot' }), 'LESSON · ' + lesson.title);
  stageEl.appendChild(badge);
  stageEl.classList.add('stage-lesson');

  run = { lesson, i: -1, t: 0, el, badge, off: null, missing: [], applied: [], warn: '', finished: false, words: null, revealed: -1 };

  /* A lesson may need a different instrument. One that names none returns the
     world to the instrument it opens on, so it never inherits the last lesson's. */
  const wanted = lesson.instrument || contract.defaultInstrument();
  if (wanted && contract.instrumentId() !== wanted && !contract.useInstrument(wanted)) {
    run.warn = `This lesson needs the "${wanted}" instrument, which this world does not have.`;
  }

  /* put the instrument into the lesson's own starting state before beat 0 */
  applyParams(startingState(lesson));

  run.off = addTicker((dt) => {
    if (!run) return;
    run.t += dt;
    if (run.words) {
      /* Narration highlights word by word, the way Sketchd's tutor reads aloud:
         the current word is accented, the ones already reached stay lit. */
      const n = Math.min(run.words.length, Math.floor(run.t / WORD_SECONDS) + 1);
      if (n !== run.revealed) {
        for (let k = 0; k < run.words.length; k++) {
          run.words[k].classList.toggle('on', k < n);
          run.words[k].classList.toggle('now', k === n - 1);
        }
        run.revealed = n;
      }
    }
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
  if (run.badge && run.badge.parentNode) run.badge.parentNode.removeChild(run.badge);
  if (stageEl) stageEl.classList.remove('stage-lesson');
  run = null;
}

function advance() {
  if (!run) return;
  enterBeat(run.i + 1);
}

/* Step back one beat. The beat's own `set` is replayed, so the instrument
   returns to the state that step was written for. */
function goBack() {
  if (!run || run.i <= 0) return;
  enterBeat(run.i - 1);
}

/* Seconds before each narration word lights up. */
const WORD_SECONDS = 0.32;

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
  const total = lesson.beats.length;

  el.innerHTML = '';

  /* Header: the lesson, where you are, and step controls. */
  el.appendChild(h('div', { class: 'ls-head' },
    h('span', { class: 'ls-kicker' }, lesson.title),
    h('div', { class: 'ls-nav' },
      h('span', { class: 'ls-step' }, `${i + 1} / ${total}`),
      h('button', {
        class: 'ls-arrow', type: 'button', 'aria-label': 'Previous step',
        disabled: i === 0,
        onclick: () => goBack()
      }, '‹'),
      h('button', {
        class: 'ls-arrow', type: 'button', 'aria-label': 'Next step',
        onclick: () => advance()
      }, '›'),
      h('button', { class: 'ls-close', type: 'button', onclick: () => stop() }, 'Exit'))));

  const dots = h('div', { class: 'ls-dots' });
  lesson.beats.forEach((_, k) => {
    dots.appendChild(h('span', {
      class: 'ls-dot' + (k < i ? ' done' : k === i ? ' now' : '')
    }));
  });
  el.appendChild(dots);

  /* Earlier steps, collapsed, as in the reference studio. */
  if (i > 0) {
    const earlier = lesson.beats.slice(0, i).filter((b) => b.say);
    if (earlier.length) {
      el.appendChild(h('details', { class: 'ls-earlier' },
        h('summary', {}, STRINGS.earlierInLesson(earlier.length)),
        h('ol', { class: 'ls-earlier-list' }, ...earlier.map((b) => h('li', {}, b.say)))));
    }
  }

  /* Narration: one span per word, lit by the ticker as the step is read. */
  if (beat.say) {
    const words = beat.say.split(' ').map((w) => h('span', { class: 'w' }, w));
    const body = h('div', { class: 'ls-text ls-words' });
    words.forEach((s, k) => {
      body.appendChild(s);
      if (k < words.length - 1) body.appendChild(document.createTextNode(' '));
    });
    el.appendChild(body);
    run.words = words;
    run.revealed = -1;
  } else {
    run.words = null;
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
          /* Every check answer feeds the mastery ladder (three correct, the
             last two in a row, then the review schedule). */
          profile.recordAnswer(run.lesson.id, ok);
          sound.cue(ok ? 'correct' : 'wrong');
          if (ok) {
            /* Correct: lock the row and move on. */
            for (const other of opts.children) other.dataset.locked = '1';
            b.classList.add('ok');
            setTimeout(() => advance(), 700);
          } else {
            /* Wrong: this option is spent, the rest stay open. The lesson
               never advances on a wrong answer (AGENTS §5). */
            b.dataset.locked = '1';
            b.classList.add('no');
          }
        }
      }, opt));
    });
    el.appendChild(opts);
  } else {
    const waiting = !!beat.until;
    el.appendChild(h('div', { class: 'ls-actions' },
      h('span', { class: 'ls-wait' }, waiting ? STRINGS.waitingForYou : ''),
      h('button', {
        class: 'btn accent ls-next',
        type: 'button',
        onclick: () => advance()
      }, waiting ? STRINGS.skip : STRINGS.continueLabel)));
  }
}

const STAGE_ORDER = ['p', 'ls', 'us', 'uni'];

/* ---------- mastery ladder copy and mixed checkpoints ---------- */

function ladderHint(info) {
  if (info.status === 'held') {
    return 'Held — the full review ladder is behind this one. It stays yours.';
  }
  if (info.status === 'met') {
    const day = info.dueInDays === 1 ? 'tomorrow' : `in ${info.dueInDays} days`;
    return `Learned — review ${day} (ladder rung ${info.rung} of ${info.rungs}: 1, 3, 7, 16, 35, 75, 150 days).`;
  }
  if (info.status === 'learning') {
    const left = 3 - info.correct;
    return `Learning — ${info.correct} of 3 correct answers so far; ${left} more (the last two in a row) starts the review ladder.`;
  }
  return 'Answer this lesson’s check question three times — the last two in a row — and it joins the review ladder: 1, 3, 7, 16, 35, 75, 150 days.';
}

/* A checkpoint mixes topics: every CHECKPOINT_INTERVAL finished lessons in a
   world, two check questions from *other* lessons of the same world. */
function addCheckpoint(el, lesson) {
  if (!profile.recordLessonDone(lesson.world)) return;
  const pool = lessonsFor(lesson.world)
    .filter((l) => l.id !== lesson.id && l.beats.some((b) => b.ask));
  if (pool.length < 2) return;

  const picked = [pool[0], pool[Math.min(pool.length - 1, Math.floor(pool.length / 2))]]
    .filter((l, i, arr) => arr.indexOf(l) === i);

  const card = h('div', { class: 'ls-check' });
  card.appendChild(h('div', { class: 'ls-check-title' }, STRINGS.checkpointTitle));
  card.appendChild(h('p', { class: 'ls-check-copy' }, STRINGS.checkpointCopy));

  picked.forEach((l) => {
    const beat = l.beats.find((b) => b.ask);
    const row = h('div', { class: 'ls-check-q' });
    row.appendChild(h('div', { class: 'ls-q' }, beat.ask));
    const opts = h('div', { class: 'ls-options' });
    (beat.options || []).forEach((opt, idx) => {
      opts.appendChild(h('button', {
        class: 'ls-opt', type: 'button',
        onclick: (ev) => {
          const b = ev.currentTarget;
          if (b.dataset.locked) return;
          const ok = idx === beat.answer;
          profile.recordAnswer(l.id, ok);
          if (ok) {
            for (const other of opts.children) other.dataset.locked = '1';
            b.classList.add('ok');
          } else {
            b.dataset.locked = '1';
            b.classList.add('no');
          }
        }
      }, opt));
    });
    row.appendChild(opts);
    card.appendChild(row);
  });
  el.appendChild(card);
}

function nextLessonFrom(lesson) {
  const list = lessonsFor(lesson.world)
    .slice()
    .sort((a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage));
  const i = list.findIndex((l) => l.id === lesson.id);
  return i >= 0 && i + 1 < list.length ? list[i + 1] : null;
}

function findLesson(id) {
  return LESSONS.find((l) => l.id === id) || Object.values(FAST_PATH).flat().find((l) => l.id === id) || null;
}

/** The corpus-style wrap-up: key idea, why, common trap, worked example, sources. */
function addEnrichment(el, lesson) {
  const ex = ENRICHMENT[lesson.id];
  if (!ex) return;

  if (ex.key) el.appendChild(h('div', { class: 'ls-ex' },
    h('span', { class: 'ls-ex-tag' }, 'Key idea'), ex.key));
  if (ex.why) el.appendChild(h('div', { class: 'ls-ex' },
    h('span', { class: 'ls-ex-tag' }, 'Why'), ex.why));
  if (ex.mistake) el.appendChild(h('div', { class: 'ls-ex ls-ex-trap' },
    h('span', { class: 'ls-ex-tag' }, 'Common mistake'), ex.mistake));

  if (ex.worked) {
    const body = h('div', { class: 'ls-ex-worked-body', style: { display: 'none' } },
      h('div', { class: 'ls-ex-q' }, ex.worked.q),
      h('ol', { class: 'ls-ex-steps' }, ...(ex.worked.steps || []).map((s) => h('li', {}, s))),
      h('div', { class: 'ls-ex-a' }, 'Answer · ' + ex.worked.a));
    const toggle = h('button', {
      class: 'ls-ex-toggle', type: 'button',
      onclick: () => {
        const open = body.style.display !== 'none';
        body.style.display = open ? 'none' : '';
        toggle.textContent = open ? 'Reveal working' : 'Hide working';
      }
    }, 'Reveal working');
    el.appendChild(h('div', { class: 'ls-ex ls-ex-worked' },
      h('span', { class: 'ls-ex-tag' }, 'Worked example'), toggle, body));
  }

  if (ex.prereqs && ex.prereqs.length) {
    const row = h('div', { class: 'ls-ex' },
      h('span', { class: 'ls-ex-tag' }, 'Builds on'));
    for (const pid of ex.prereqs) {
      const target = findLesson(pid);
      row.appendChild(h('button', {
        class: 'ls-prereq', type: 'button',
        onclick: () => { if (target) start(target); }
      }, target ? target.title : pid));
    }
    el.appendChild(row);
  }
  if (ex.sources && ex.sources.length) {
    el.appendChild(h('div', { class: 'ls-ex' },
      h('span', { class: 'ls-ex-tag' }, 'Sources'), ex.sources.join(' · ')));
  }
}

function finish() {
  if (!run) return;
  if (run.off) { run.off(); run.off = null; }
  run.finished = true;

  const el = run.el;
  const title = run.lesson.title;
  const next = nextLessonFrom(run.lesson);
  const info = profile.reviewInfo(run.lesson.id);
  el.innerHTML = '';

  el.appendChild(h('div', { class: 'ls-head' },
    h('span', { class: 'ls-kicker' }, STRINGS.lessonComplete),
    h('button', { class: 'ls-close', type: 'button', onclick: () => stop() }, STRINGS.exit)));
  el.appendChild(h('div', { class: 'ls-text' }, STRINGS.lessonDone(title)));
  el.appendChild(h('div', { class: 'ls-hint' }, ladderHint(info)));
  sound.cue('done');
  addCheckpoint(el, run.lesson);
  addEnrichment(el, run.lesson);

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

  const el = h('div', { class: 'modal-backdrop', role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
    h('div', { class: 'modal' },
      h('div', { class: 'modal-head' },
        h('span', { class: 'modal-title' }, title),
        h('button', {
          class: 'modal-close',
          type: 'button',
          onclick: () => closeModal(m)
        }, 'Close')),
      body));

  const m = { el, body, onKey: null, lastFocus: document.activeElement };
  document.body.appendChild(el);

  /* Keyboard: Escape closes, Tab never leaves the dialog. */
  trapFocus(el);
  const first = el.querySelector('.modal-close');
  if (first) first.focus({ preventScroll: true });

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
  const back = m.lastFocus;
  if (back && typeof back.focus === 'function' && back.isConnected) {
    try { back.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
  }
}

/** Modal shell for the shell's own dialogs (snapshots, search). */
export function openModal(title) {
  const m = buildModal(title);
  return { el: m.el, body: m.body, close: () => closeModal(m) };
}

/* ---------- picker ---------- */

function addCards(m, list, stage) {
  const order = ['p', 'ls', 'us', 'uni'];
  const sorted = list.slice().sort((a, b) => order.indexOf(a.stage) - order.indexOf(b.stage));
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

export function openPicker(world) {
  const list = lessonsFor(world.id);
  const m = buildModal(`Lessons · ${world.name}`);

  if (!list.length) {
    m.body.appendChild(h('p', { class: 'modal-copy' },
      'No lessons authored for this world yet. The instruments above are free play.'));
    return;
  }

  m.body.appendChild(h('p', { class: 'modal-copy' },
    'Short guided sequences that drive the instrument for you. Your stage is set per world.'));
  addCards(m, list, profile.worldStage(world.id));
}

/** The adult route: six lessons chosen for what an adult can use immediately. */
export function openFastPicker(world) {
  const list = FAST_PATH[world.id] || [];
  const m = buildModal(`Adult path · ${world.name}`);

  if (!list.length) {
    m.body.appendChild(h('p', { class: 'modal-copy' },
      'No adult path authored for this world yet. Use the ladder instead.'));
    return;
  }

  m.body.appendChild(h('p', { class: 'modal-copy' },
    'Six lessons picked for the ideas you can actually use. This is a different route through the subject, not a summary of the ladder.'));
  addCards(m, list, profile.worldStage(world.id));
}

/* ---------- self-placement ---------- */

const LENS_LABEL = {
  play: 'hands-on',
  compute: 'arithmetic',
  derive: 'reasoning',
  apply: 'applying it',
  misconception: 'a common trap',
  trouble: 'a lesson trap'
};

export function openPlacement(world) {
  const base = (DIAGNOSTICS[world.id] || []).slice();
  const trap = TROUBLE_QUIZ[world.id];
  if (trap) base.push({ lens: 'trouble', stage: 'us', q: trap.q, options: trap.options, answer: trap.answer });
  const items = base;
  const m = buildModal('Where should I start?');

  if (!items.length) {
    m.body.appendChild(h('p', { class: 'modal-copy' },
      'No diagnostic items are authored for this world yet. Choose a stage above instead.'));
    return;
  }

  m.body.appendChild(h('p', { class: 'modal-copy' },
    'Six short questions: exploring, arithmetic, reasoning, applying it, and two common traps. The hardest rung you clear sets this world’s stage.'));

  const answers = new Array(items.length).fill(null);
  const result = h('div', { class: 'dx-result' });

  items.forEach((item, idx) => {
    const opts = h('div', { class: 'dx-opts' });
    item.options.forEach((text, oi) => {
      opts.appendChild(h('button', {
        class: 'dx-opt', type: 'button',
        onclick: (ev) => {
          if (answers[idx] !== null) return;
          answers[idx] = oi;
          const b = ev.currentTarget;
          for (const other of opts.children) other.dataset.locked = '1';
          b.classList.add(oi === item.answer ? 'ok' : 'no');
          if (answers.every((a) => a !== null)) finishPlacement();
        }
      }, text));
    });
    m.body.appendChild(h('div', { class: 'dx-item' },
      h('div', { class: 'dx-q' }, `${idx + 1}. ${item.q}`),
      h('div', { class: 'dx-lens' }, LENS_LABEL[item.lens] || item.lens),
      opts));
  });

  m.body.appendChild(result);

  function finishPlacement() {
    const cleared = items.filter((it, i) => answers[i] === it.answer);
    const missed = items.filter((it, i) => answers[i] !== it.answer);
    const best = cleared.reduce(
      (acc, it) => STAGE_ORDER.indexOf(it.stage) > STAGE_ORDER.indexOf(acc) ? it.stage : acc,
      'p'
    );
    profile.setWorldStage(world.id, best);
    result.innerHTML = '';
    result.appendChild(h('div', { class: 'dx-head' }, `Placed at ${profile.STAGE_LABEL[best]}.`));
    result.appendChild(h('div', { class: 'dx-why' },
      `You cleared ${cleared.length} of ${items.length}: ${cleared.map((c) => LENS_LABEL[c.lens]).join(', ') || 'none'}.` +
      (missed.length
        ? ` To reach the next rung, revisit ${missed.map((c) => LENS_LABEL[c.lens]).join(', ')}.`
        : ` All ${items.length} cleared — this world starts at university.`)));
    result.classList.add('show');
  }
}
