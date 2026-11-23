/* ==========================================================================
   notes.js — the design notes reader, opened from the top bar
   ========================================================================== */

import { h, trapFocus } from './ui.js';
import { renderMarkdown } from './markdown.js';

const DOCS = [
  { id: 'expand', label: 'Expand', path: 'docs/Lesson-Expansion-Spec.md' },
  { id: 'path', label: 'Path', path: 'docs/Curriculum.md' },
  { id: 'specs', label: 'Specs', path: 'docs/World-Specs.md' },
  { id: 'v2', label: 'Roadmap', path: 'docs/Design-Brainstorm-v2.md' },
  { id: 'v1', label: 'Arch', path: 'docs/Design-Brainstorm.md' }
];

let root = null;
let docEl = null;
let segEl = null;
let closeBtn = null;
let current = DOCS[0].id;
let lastFocus = null;

const cache = new Map();

function build() {
  segEl = h('div', { class: 'seg notes-seg' });
  for (const d of DOCS) {
    const b = h('button', {
      type: 'button',
      'aria-pressed': String(d.id === current),
      onclick: () => show(d.id)
    }, d.label);
    b.dataset.doc = d.id;
    segEl.appendChild(b);
  }

  closeBtn = h('button', {
    class: 'tool notes-close',
    type: 'button',
    'aria-label': 'Close design notes',
    onclick: () => closeNotes()
  }, 'Close');

  docEl = h('div', { class: 'notes-doc' });

  root = h('div', {
    class: 'notes-overlay',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': 'Design notes'
  },
    h('div', { class: 'notes-bar' },
      h('div', { class: 'notes-title' }, 'Lumen · design notes'),
      segEl,
      closeBtn),
    h('div', { class: 'notes-scroll' }, docEl));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root && root.isConnected) closeNotes();
  });

  trapFocus(root);
}

function paintSeg() {
  for (const b of segEl.children) {
    b.setAttribute('aria-pressed', String(b.dataset.doc === current));
  }
}

async function show(id) {
  current = id;
  paintSeg();

  const doc = DOCS.find((d) => d.id === id);
  if (!doc) return;

  if (cache.has(id)) {
    docEl.innerHTML = cache.get(id);
    docEl.parentElement.scrollTop = 0;
    return;
  }

  docEl.innerHTML = '<p class="notes-loading">Loading…</p>';

  try {
    const res = await fetch(doc.path, { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    cache.set(id, renderMarkdown(text));
    if (current !== id) return;
    docEl.innerHTML = cache.get(id);
    docEl.parentElement.scrollTop = 0;
  } catch (err) {
    if (current !== id) return;
    docEl.innerHTML = `<p class="notes-error">Could not load ${doc.path} — ${err.message}</p>`;
  }
}

export function openNotes() {
  if (!root) build();
  if (!root.isConnected) document.body.appendChild(root);
  lastFocus = document.activeElement;
  show(current);
  if (closeBtn) closeBtn.focus({ preventScroll: true });
}

export function closeNotes() {
  if (!root || !root.isConnected) return;
  root.remove();
  if (lastFocus && typeof lastFocus.focus === 'function') {
    try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
  }
}
