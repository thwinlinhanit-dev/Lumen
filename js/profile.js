/* ==========================================================================
   profile.js — stage, mode and what has actually been held
   Stage is formal level; mode is who is learning. Kept apart on purpose.
   ========================================================================== */

const KEY = 'lumen.profile.v1';
const STAGES = ['p', 'ls', 'us', 'uni'];
const MODES = ['child', 'teen', 'adult'];
const HELD_AFTER = 3 * 24 * 60 * 60 * 1000;   // three days

const listeners = new Set();

function blank() {
  return { stage: 'us', mode: 'adult', worlds: {} };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const p = JSON.parse(raw);
    return {
      stage: STAGES.indexOf(p.stage) >= 0 ? p.stage : 'us',
      mode: MODES.indexOf(p.mode) >= 0 ? p.mode : 'adult',
      worlds: p.worlds && typeof p.worlds === 'object' ? p.worlds : {}
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
