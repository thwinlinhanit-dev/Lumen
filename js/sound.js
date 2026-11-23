/* ==========================================================================
   sound.js — optional audio cues (PhET "Basic Sounds")
   Off by default; a three-pair Earcon per event kind, tiny and synthesised
   with WebAudio. No assets, no dependency.
   ========================================================================== */

let ctx = null;
let enabled = false;

export function setEnabled(v) {
  enabled = !!v;
  if (enabled && !ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
  }
}

export function isEnabled() {
  return enabled;
}

const TONES = {
  /* goal met: rising third, confident */
  goal: [[523.25, 0], [659.25, 0.12]],
  /* correct answer: short ping */
  correct: [[784, 0]],
  /* wrong answer: low thud, not punishing */
  wrong: [[196, 0]],
  /* lesson complete: two-note close */
  done: [[440, 0], [587.33, 0.14]]
};

function blip(freq, at) {
  if (!ctx) return;
  const t = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.3);
}

/** Fire the cue for a kind — silent unless sounds are enabled. */
export function cue(kind) {
  if (!enabled || !TONES[kind]) return;
  if (enabled && !ctx) setEnabled(true);
  if (!ctx) return;
  for (const [f, at] of TONES[kind]) blip(f, at);
}
