/* ==========================================================================
   stagebar.js — the stage and mode control that sits above every coach
   ========================================================================== */

import { h } from './ui.js';
import * as profile from './profile.js';
import { openPicker, openFastPicker, openPlacement } from './lesson-run.js';
import { lessonsFor, FAST_PATH } from './lessons.js';

export function mountStageBar(world) {
  const worldId = world.id;

  const seg = h('div', { class: 'seg stage-seg' });
  const modeBtn = h('button', { class: 'mode-pill', type: 'button' });
  const meta = h('div', { class: 'stagebar-meta' });

  const reset = h('button', {
    class: 'stagebar-link',
    type: 'button',
    onclick: () => profile.setWorldStage(worldId, profile.getProfile().stage)
  }, 'all worlds');

  const place = h('button', {
    class: 'stagebar-link',
    type: 'button',
    onclick: () => openPlacement(world)
  }, 'place me');

  const buttons = ['p', 'ls', 'us', 'uni'].map((s) => {
    const b = h('button', {
      type: 'button',
      'aria-label': `${profile.STAGE_LABEL[s]} (${profile.STAGE_SHORT[s]})`,
      onclick: () => profile.setWorldStage(worldId, s)
    }, profile.STAGE_SHORT[s]);
    b.dataset.stage = s;
    seg.appendChild(b);
    return b;
  });

  modeBtn.addEventListener('click', () => {
    const list = profile.MODES_LIST;
    const now = profile.getProfile().mode;
    profile.setMode(list[(list.indexOf(now) + 1) % list.length]);
  });

  const lessonCount = lessonsFor(worldId).length;
  const learn = h('button', {
    class: 'stagebar-learn',
    type: 'button',
    disabled: lessonCount === 0,
    onclick: () => openPicker(world)
  },
    h('span', { class: 'sl-label' }, lessonCount ? 'Start a lesson' : 'No lessons yet'),
    h('span', { class: 'sl-count' }, lessonCount ? String(lessonCount) : ''));

  const fastCount = (FAST_PATH[worldId] || []).length;
  const fast = h('button', {
    class: 'stagebar-fast',
    type: 'button',
    disabled: fastCount === 0,
    onclick: () => openFastPicker(world)
  }, `Adult path${fastCount ? ' · ' + fastCount : ''}`);

  const el = h('div', { class: 'stagebar' },
    h('div', { class: 'stagebar-row' }, seg, modeBtn),
    learn,
    fast,
    h('div', { class: 'stagebar-foot' },
      meta,
      h('div', { class: 'stagebar-links' }, place, reset)));

  function paint() {
    const stage = profile.worldStage(worldId);
    for (const b of buttons) {
      b.setAttribute('aria-pressed', String(b.dataset.stage === stage));
    }

    const mode = profile.getProfile().mode;
    modeBtn.textContent = profile.MODE_LABEL[mode];
    modeBtn.setAttribute('aria-label', `${profile.MODE_LABEL[mode]} — Learning mode`);
    modeBtn.setAttribute('aria-pressed', String(mode === 'adult'));

    const session = mode === 'adult' ? '20–25' : profile.SESSION_MINUTES[stage];
    meta.textContent = `${profile.STAGE_LABEL[stage]} · ${session} min`;
    reset.style.display = profile.hasOverride(worldId) ? '' : 'none';
  }

  paint();
  const off = profile.subscribe(paint);

  return { el, dispose: off };
}
