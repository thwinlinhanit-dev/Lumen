/* ==========================================================================
   contract.js — what a world exposes to the shell
   Param and observable registration is done by the widget layer, so every
   world satisfies the contract without knowing the contract exists.
   ========================================================================== */

let registry = null;

export function keyOf(label) {
  return String(label)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function begin() {
  registry = {
    params: new Map(),
    obs: new Map(),
    goal: null,
    goals: new Map(),
    instruments: new Map(),
    instrument: null
  };
  return registry;
}

export function end() {
  /* The registry stays readable after mount: lessons read it at runtime. */
  return registry;
}

export function current() {
  return registry;
}

export function registerParam(spec) {
  if (!registry) return;
  const key = keyOf(spec.label);
  registry.params.set(key, {
    key,
    label: spec.label,
    min: spec.min,
    max: spec.max,
    step: spec.step,
    node: spec.node || null,
    get: spec.get,
    set: spec.set
  });
}

export function registerObs(spec) {
  if (!registry) return;
  const key = keyOf(spec.label);
  registry.obs.set(key, {
    key,
    label: spec.label,
    unit: spec.unit || '',
    get: spec.get
  });
}

export function registerGoal(spec) {
  if (!registry) return;
  const key = spec.key || 'goal';
  const entry = { key, get: spec.get };
  registry.goals.set(key, entry);
  /* The first instrument registered owns the goal until another is activated. */
  if (!registry.goal) registry.goal = entry;
}

/** Point `goal: true` conditions at one instrument's goal. */
export function useGoal(key) {
  if (!registry) return;
  const g = registry.goals.get(key);
  if (g) registry.goal = g;
}

/**
 * A world may hold more than one instrument. A lesson names the one it needs,
 * and `activate` does the world's own switching — staging, panes and goal.
 */
export function registerInstrument(spec) {
  if (!registry) return;
  registry.instruments.set(spec.id, spec);
  if (!registry.instrument) registry.instrument = spec.id;
}

export function useInstrument(id) {
  if (!registry) return false;
  const spec = registry.instruments.get(id);
  if (!spec) return false;
  registry.instrument = id;
  if (spec.activate) {
    try { spec.activate(); } catch (e) { console.error(e); }
  }
  /* Goal pairing lives here so no world can forget it: an instrument that
     owns a goal named after itself becomes the one `goal: true` binds to.
     Instruments whose primary goal uses the default key fall back to the
     first registered goal — every world registers its primary goal first. */
  const paired = registry.goals.get(id) || registry.goals.values().next().value;
  if (paired) registry.goal = paired;
  return true;
}

export function instrumentId() {
  return registry ? registry.instrument : null;
}

/** Record a switch the world made itself (no activate callback). */
export function selectInstrument(id) {
  if (registry && registry.instruments.has(id)) registry.instrument = id;
}

/** The instrument a world opens on — the first one it registered. */
export function defaultInstrument() {
  if (!registry || !registry.instruments.size) return null;
  return registry.instruments.keys().next().value;
}

export function parseNumber(text) {
  const m = String(text).match(/-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : NaN;
}

/** Every param, for a debug or placement surface. */
export function paramList() {
  return registry ? Array.from(registry.params.values()) : [];
}

export function obsList() {
  return registry ? Array.from(registry.obs.values()) : [];
}

export function goalDone() {
  return !!(registry && registry.goal && registry.goal.get());
}
