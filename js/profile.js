/* ==========================================================================
   profile.js — stage, mode and what has actually been held
   Stage is formal level; mode is who is learning. Kept apart on purpose.
   ========================================================================== */

const KEY = 'lumen.profile.v1';
const STAGES = ['p', 'ls', 'us', 'uni'];
const MODES = ['child', 'teen', 'adult'];
const HELD_AFTER = 3 * 24 * 60 * 60 * 1000;   // legacy world-goal rule, kept for old data

/* TeddyRookBook review ladder: a topic returns at these gaps after it is
   learned. Learned = three correct answers, the last two in a row. */
const REVIEW_LADDER_DAYS = [1, 3, 7, 16, 35, 75, 150];
const LADDER = REVIEW_LADDER_DAYS.map((d) => d * 24 * 60 * 60 * 1000);
const CHECKPOINT_EVERY = 5;                   // a mixed checkpoint every 5 finished lessons

const listeners = new Set();

function blank() {
  return { stage: 'us', mode: 'adult', worlds: {}, mastery: {}, checkpoints: {}, sound: false };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const p = JSON.parse(raw);
    return {
      stage: STAGES.indexOf(p.stage) >= 0 ? p.stage : 'us',
      mode: MODES.indexOf(p.mode) >= 0 ? p.mode : 'adult',
      worlds: p.worlds && typeof p.worlds === 'object' ? p.worlds : {},
      mastery: p.mastery && typeof p.mastery === 'object' ? p.mastery : {},
      checkpoints: p.checkpoints && typeof p.checkpoints === 'object' ? p.checkpoints : {},
      sound: !!p.sound
    };
  } catch (e) {
    return blank();
  }
}

let data = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* private mode */ }
}

function emit() {
  for (const fn of Array.from(listeners)) {
    try { fn(data); } catch (e) { console.error(e); }
  }
}

export function getProfile() {
  return data;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function worldStage(id) {
  const w = data.worlds[id];
  return w && STAGES.indexOf(w.stage) >= 0 ? w.stage : data.stage;
}

export function hasOverride(id) {
  const w = data.worlds[id];
  return !!(w && STAGES.indexOf(w.stage) >= 0);
}

export function setWorldStage(id, stage) {
  if (STAGES.indexOf(stage) < 0) return;
  data.worlds[id] = data.worlds[id] || {};
  if (stage === data.stage) delete data.worlds[id].stage;
  else data.worlds[id].stage = stage;
  save();
  emit();
}

export function setGlobalStage(stage) {
  if (STAGES.indexOf(stage) < 0) return;
  data.stage = stage;
  save();
  emit();
}

export function setMode(mode) {
  if (MODES.indexOf(mode) < 0) return;
  data.mode = mode;
  save();
  emit();
}

/* Optional audio cues (PhET Basic Sounds) — off until the learner opts in. */
export function soundEnabled() {
  return !!data.sound;
}

export function setSound(on) {
  data.sound = !!on;
  save();
  emit();
}

/** Records that the world's goal was met in this session. */
export function recordMet(id, when) {
  const t = when || Date.now();
  const w = data.worlds[id] || (data.worlds[id] = {});
  if (!w.metAt) {
    w.metAt = t;
  } else if (w.metAt && !w.heldAt && t - w.metAt >= HELD_AFTER) {
    w.heldAt = t;
  }
  save();
  emit();
}

/* ---------- per-lesson mastery ladder ----------
   A topic is learned on three correct answers with the last two in a row,
   then returns for review at 1, 3, 7, 16, 35, 75 and 150 days. The whole
   schedule is stored per lesson, never per world. */

function masteryOf(id) {
  const m = data.mastery[id];
  return m && typeof m === 'object' ? m : null;
}

/** One correct or wrong answer on a lesson's check question. */
export function recordAnswer(lessonId, correct, when) {
  const t = when || Date.now();
  const m = data.mastery[lessonId] ||
    (data.mastery[lessonId] = { totalCorrect: 0, lastCorrect: false, prevCorrect: false });
  if (correct) {
    m.totalCorrect = (m.totalCorrect || 0) + 1;
    m.prevCorrect = !!m.lastCorrect;
    m.lastCorrect = true;
    if (!m.learnedAt && m.totalCorrect >= 3 && m.lastCorrect && m.prevCorrect) {
      m.learnedAt = t;
      m.reviewIdx = 0;
      m.dueAt = t + LADDER[0];
    } else if (m.learnedAt && !m.heldAt && t >= (m.dueAt || 0)) {
      m.reviewIdx = (m.reviewIdx || 0) + 1;
      if (m.reviewIdx >= LADDER.length) m.heldAt = t;
      else m.dueAt = t + LADDER[m.reviewIdx];
    }
  } else {
    m.lastCorrect = false;
  }
  save();
  emit();
}

/** 'held' | 'met' | 'learning' | 'new' for one lesson. */
export function lessonStatus(lessonId) {
  const m = masteryOf(lessonId);
  if (!m) return 'new';
  if (m.heldAt) return 'held';
  if (m.learnedAt) return 'met';
  if (m.totalCorrect > 0) return 'learning';
  return 'new';
}

/** Four-state dot for a world, aggregated over its lessons' schedules. */
const DOT_ORDER = { new: 0, learning: 1, met: 2, held: 3 };
export function worldDotStatus(worldId, lessonIds) {
  let best = 'new';
  for (const id of lessonIds || []) {
    const s = lessonStatus(id);
    if (DOT_ORDER[s] > DOT_ORDER[best]) best = s;
  }
  /* A world whose goal was held under the earlier rule keeps its green. */
  const w = data.worlds[worldId];
  if (w && w.heldAt && DOT_ORDER[best] < 3) best = 'held';
  return best;
}

/** Ladder facts for copy: where this lesson sits, when it is due back. */
export function reviewInfo(lessonId, now) {
  const m = masteryOf(lessonId);
  const t = now || Date.now();
  if (!m) return { status: 'new', correct: 0 };
  if (m.heldAt) return { status: 'held', correct: m.totalCorrect };
  if (m.learnedAt) {
    const gap = (m.dueAt || 0) - t;
    return {
      status: 'met',
      correct: m.totalCorrect,
      dueInDays: Math.max(0, Math.ceil(gap / (24 * 60 * 60 * 1000))),
      rung: (m.reviewIdx || 0) + 1,
      rungs: REVIEW_LADDER_DAYS.length
    };
  }
  return { status: 'learning', correct: m.totalCorrect || 0 };
}

/** Every CHECKPOINT_EVERY finished lessons in a world, a mixed checkpoint is
    due: returns true exactly on the multiples. */
export function recordLessonDone(worldId) {
  const n = ((data.checkpoints && data.checkpoints[worldId]) || 0) + 1;
  data.checkpoints[worldId] = n;
  save();
  emit();
  return n % CHECKPOINT_EVERY === 0;
}

export const CHECKPOINT_INTERVAL = CHECKPOINT_EVERY;

/** 'held' | 'met' | 'new' */
export function statusOf(id) {
  const w = data.worlds[id] || {};
  if (w.heldAt) return 'held';
  if (w.metAt) return 'met';
  return 'new';
}

export const STAGE_LABEL = {
  p: 'Primary',
  ls: 'Lower secondary',
  us: 'Upper secondary',
  uni: 'University'
};

export const STAGE_SHORT = { p: 'P', ls: 'LS', us: 'US', uni: 'U' };

export const SESSION_MINUTES = {
  p: '5–8',
  ls: '12–18',
  us: '20–30',
  uni: '35–60'
};

export const MODE_LABEL = { child: 'Child', teen: 'Teen', adult: 'Adult' };
export const MODES_LIST = MODES;
