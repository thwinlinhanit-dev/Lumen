# AGENTS.md — how to continue building this app

You are an AI agent picking up a working project. This file is the work order. Read it
completely before you touch anything, then read the four documents in §1.2 in order.

It is written to be followed literally. Where it says "read the file first", that is not
advice, it is a step.

---

## 0. The one thing to understand first

**There is no runtime on this machine.** You cannot run the app, the JavaScript, a test, a
linter or a terminal. Nothing executes between your tool calls. The user only sees the
result after your whole turn, in a preview built by a server that does not check your code.

So your correctness comes entirely from care: reading before editing, copying patterns that
already work, re-reading after editing, and never claiming something works because it looks
right.

**A single syntax error in any file makes the entire app a blank page**, because `app.js`
imports all fourteen worlds at module load and the browser stops on the first parse error.
There is no partial failure and no error message the user can read. Treat every edit as
load-bearing.

---

## 1. What you are working on

### 1.1 The product

*Lumen* — a learning app where each subject is an **instrument you manipulate**, not a course
you watch. Fourteen worlds: Physics, Maths, Chemistry, Art, Music, Earth, Code, Money,
Language, Space, Biology, Data, Climate, Build. Each world declares a goal that is a
**predicate over observables** ("until the fringes number exactly five"), so assessment is
doing rather than quizzing.

It is a **zero-build static web app**: `index.html`, ES modules, Canvas 2D, no framework, no
dependencies, no package.json, no bundler. That is deliberate. Never add one.

### 1.2 Read these, in this order

| file | what it gives you |
|---|---|
| `docs/World-Specs.md` | what each world is, its observables, what is in and out of scope |
| `docs/Curriculum.md` | the stage model, session lengths, the ladder per world, the six-point bar |
| `docs/Design-Brainstorm-v2.md` | why the ladder is built on lenses; the cross-links |
| `docs/Design-Brainstorm.md` | the original architecture argument |

The curriculum and the specs are the source of truth for *what to build*. This file is the
source of truth for *how*.

### 1.3 File map

```
index.html            shell markup: top bar, rail, stage, coach
css/styles.css        all styling, one file, appended in sections
data/countries-110m.json   Natural Earth 110m country geometry (the only runtime fetch)
js/app.js             the shell: rail, mounting, stage bar, stuck rule, wiring
js/ui.js              the widget kit every world is built from
js/contract.js        the param/observable/goal registry
js/profile.js         stage, mode, and what has been "held" (localStorage)
js/stagebar.js        the stage + mode control above every coach
js/lessons.js         authored lessons, pure data
js/lesson-run.js      lesson runner, picker, self-placement
js/notes.js           the design-docs reader
js/markdown.js        the small markdown renderer the reader uses
js/worlds/*.js        one module per world; self-contained
docs/*.md             product documents, readable in-app under Design
```

---

## 2. Invariants — break any of these and the app is broken

1. **One syntax error = blank page.** Always read a file before editing it. Always re-read
   the edited region afterwards. Never rewrite a file you have not read.
2. **No dependencies, no build step, no framework.** Not a package, not a CDN script, not a
   bundler. Every file you need must be in the repo.
3. **The contract registry is live only during `world.mount()`.** `ui.slider`, `ui.obs` and
   `ui.goal` register themselves into it. If a world builds its own `<input>`, it must call
   `registerParam` from `js/contract.js` itself — `js/worlds/earth.js` is the worked example.
4. **`contract.end()` must not clear the registry.** Lessons read it at runtime, long after
   mount. It currently returns the registry and leaves it in place. Do not "tidy" this.
5. **An observable must be numeric-parseable.** `ui.obs` takes the first number out of
   whatever you pass to `set()`. `set('5')` is an observable of 5. `set('5 of 5')` is still
   5, but `set('complete')` is NaN and any goal waiting on it will hang forever. Put units
   in the second argument (`ui.obs('Width', 'cm')`), never in the value.
6. **A world never imports another world.** It may read the contract, or link through the
   content graph. Cross-world imports become a mesh and the mesh becomes unmaintainable.
7. **`api.markDone(done)` is called every frame** with the current goal state. That is how
   the rail dot and the "held" rule work.
8. **Every world returns a cleanup function** that stops its ticker, clears its intervals,
   disconnects its ResizeObservers and closes its AudioContext. If it does not, the world's
   frame loop keeps running after you leave it and the phone gets hot.
9. **Only these files may be fetched at runtime:** `data/countries-110m.json` and the
   `docs/*.md` files. Nothing else. No APIs, no telemetry, no fonts.
10. **Never invent facts.** Element masses, country events and lesson claims are curated.
    If you do not know a number, leave it out or omit the claim. A wrong number in a physics
    or finance world is worse than a missing one.

---

## 3. The patterns — copy these exactly

### 3.1 The world module shape

```js
/* ==========================================================================
   Subject — one line about what the instrument is
   ========================================================================== */

import * as ui from '../ui.js';

export default {
  id: 'physics',            // used by lessons, profile, rail. never change it.
  name: 'Physics',          // rail label, keep it short
  sub: 'Wave optics',       // breadcrumb subtitle
  accent: '#5ac8fa',        // one colour; used for the accent, the goal, the rail
  fade: false,              // optional: false hides the stage vignette
  glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="4.6" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    <path d="M7.8 7.8a6 6 0 010 8.4"/>
  </svg>`,

  mount(stage, coach, api) {
    // 1. build DOM into `stage` (the canvas area) and `coach` (the right panel)
    // 2. register params by calling ui.slider; observables by calling ui.obs
    // 3. create the goal with ui.goal
    // 4. add a ticker with ui.addTicker that draws and updates the observables

    const stop = ui.addTicker(() => {
      draw();
      oFringes.set(String(profile.count));
      g.update();
      api.markDone(g.done);
    });

    return () => { stop(); ro.disconnect(); fit.destroy(); };
  }
};
```

Rules inside mount, in order: build the canvas first, `ui.fitCanvas` it, build the coach
sections, then start the ticker. Observables must be `.set()` at least once per frame or per
interval, or a lesson waiting on them will hang.

### 3.2 The widget kit (`js/ui.js`)

```js
ui.h(tag, attrs, ...children)   // attrs: class | html | dataset | style(object) | on* handler | true
ui.section(title, ...children)  // a coach section; title also becomes data-title for CSS
ui.controls(...children)        // vertical stack of controls
ui.slider({label, min, max, step, value, format, onInput})
                                // -> {el, input, value, set(v)} and registers a param
ui.obs(label, unit)             // -> {el, set(text, hot)} and registers an observable
ui.obsList(...rows)             // -> the .obs-list container
ui.goal(html, check)            // check() -> bool | {done, progress}; registers the goal
ui.toggleRow(label, initial, onChange)
ui.segmented([{id,label}], initial, onChange)
ui.button(label, onClick, variant)  // variant: '' | 'accent' | 'ghost'
ui.buttonRow(...buttons)
ui.fitCanvas(canvas)            // -> {ctx, size:{w,h,dpr}, resize, destroy}
ui.addTicker(fn)                // shared rAF; fn(dt, ts); returns unsubscribe
ui.clamp, ui.lerp, ui.rgba, ui.hexToRgb, ui.wavelengthToColor, ui.fmt
```

**Important:** `slider().set(v)` (the returned one) repaints but does **not** fire the user's
`onInput`. The registered param's `set(v)` does fire it, by dispatching an input event. Use
the right one: use the returned `set` when you are syncing UI, and let lessons use the
registered one.

### 3.3 The coach, in the established order

```js
coach.appendChild(ui.h('div', { class: 'kicker' },
  ui.h('span', { class: 'bar' }), 'Physics · wave optics'));
coach.appendChild(ui.h('h2', { class: 'lesson-title' }, 'A short claim, not a topic'));
coach.appendChild(ui.h('p', { class: 'lesson-body' }, 'Two or three sentences.'));
coach.appendChild(ui.section('Goal', g.el));
coach.appendChild(ui.section('Observables', ui.obsList(oA, oB)));
coach.appendChild(ui.section('Controls', ui.controls(s1.el, s2.el)));
coach.appendChild(ui.h('div', { class: 'hairline' }));
coach.appendChild(ui.note('The honest caveat. <b>What the model leaves out.</b>'));
```

Keep the title as a *claim*. "Sorting is a race you can time", not "Sorting algorithms".
Keep the body to three sentences. The note is where you are honest about the simplification.

### 3.4 Drawing, per frame

```js
function draw() {
  const W = fit.size.w, H = fit.size.h;
  ctx.setTransform(fit.size.dpr, 0, 0, fit.size.dpr, 0, 0);
  ctx.fillStyle = '#080a0f';
  ctx.fillRect(0, 0, W, H);
  // ... draw in CSS pixels; the dpr transform handles retina
}
```

Never allocate inside the per-frame path if you can help it: no `new Path2D()` storms, no
array literals in a 60 fps loop over thousands of items, no `Math.max(...bigArray)`.

---

## 4. Recipes

### 4.1 Add a lesson

1. Open `js/lessons.js`. Each lesson is one object in `LESSONS`.
2. Copy the shape exactly:
   ```js
   {
     id: 'phy.myname', world: 'physics', stage: 'ls',
     title: 'A short claim',
     beats: [
       { say: 'Prediction first: what will happen when…' },
       { set: { wavelength: 550 }, hold: 3, say: 'Green light.' },
       { say: 'Now move the sliders.', until: { obs: 'bright_fringes', op: '>=', value: 9 }, hint: 'Try Slit separation.' },
       { ask: 'Closer slits made the fringes…', options: ['wider', 'narrower'], answer: 0 },
       { say: 'Wider — because w = λL/d.' }
     ]
   }
   ```
3. `stage` is one of `'p' | 'ls' | 'us' | 'uni'`.
4. Every `obs` key must exist in §6, or the beat hangs. Verify against the table.
5. Prefer ending a lesson on `until: { goal: true }` when the world's goal is the natural
   finish — it is the most robust condition there is.
6. Acceptance: the lesson appears in the picker under its stage, and every `until` can
   plausibly be satisfied by moving the sliders the hint mentions.

### 4.2 Add a parameter to a world

1. Read the world file. Find where the coach controls are built.
2. Add the slider next to the others:
   ```js
   const sTempo = ui.slider({
     label: 'Tempo', min: 50, max: 200, step: 2, value: tempo,
     format: (v) => `${Math.round(v)} bpm`,
     onInput: (v) => { tempo = v; }
   });
   coach.appendChild(ui.section('Mode', ui.controls(sTempo.el)));
   ```
3. The key is derived from the label: lowercase, runs of non-alphanumerics become `_`.
   `'Slit separation'` → `slit_separation`. Add it to §6 of this file when you do.
4. If the control is not a `ui.slider` (a custom input, a canvas drag), register it yourself:
   ```js
   import { registerParam } from '../contract.js';
   registerParam({ label: 'Year', min: 1780, max: 2020, step: 1,
                   get: () => year, set: (v) => setYear(v) });
   ```
5. Acceptance: a lesson can `set` it and the world visibly responds.

### 4.3 Add an observable

Identical to a parameter, with `ui.obs(label, unit)` and a `set` call each frame. The value
you pass must start with a number. Acceptance: it reads correctly in the coach, and a goal
built on it flips when the condition is met.

### 4.4 Add a whole world

Do not. There are already fourteen and the plan says deepen before widening. If you are
told to anyway, these are the twelve steps and skipping any one leaves it invisible or
blank:

1. Create `js/worlds/<id>.js` with the shape in §3.1.
2. `import <id> from './worlds/<id>.js';` in `js/app.js`.
3. Add it to the `WORLDS` array in the order it should appear in the rail.
4. Give it a unique `accent` — check the existing ones first: `#5ac8fa #a78bfa #34d399
   #fb7185 #fbbf24 #60a5fa #818cf8 #a3e635 #e879f9 #f97316 #4ade80 #f59e0b #2dd4bf #94a3b8`.
5. Give it a 24×24 stroke-only `glyph` using `currentColor`.
6. Give it a goal with `ui.goal` and call `api.markDone(g.done)` every frame.
7. Register at least one parameter if the world can be steered at all.
8. Set `fade: false` if the stage vignette hurts it (tables, text, UI panels).
9. If it has bottom-anchored chrome, add a `.stage-lesson` shift rule in `css/styles.css`
   so the lesson strip does not cover it.
10. Author at least two lessons in `js/lessons.js` (`world: '<id>'`).
11. Add its key list to §6 here.
12. Publish and check the rail shows it, the world mounts, and the stage bar appears.

### 4.5 Add CSS

Append to `css/styles.css`. Never reorder existing rules — later rules win, and several
depend on that. Keep the existing conventions: `/* ===== section ===== */` banners, tokens
from `:root`, no new colours outside the palette, mobile overrides in a
`@media (max-width: 860px)` block at the end of your section.

### 4.6 Change a document

`docs/*.md` render in-app through `js/markdown.js`. That renderer supports headings,
paragraphs, bullet and numbered lists, tables, fenced code, blockquotes, rules, and inline
bold / italic / code / links. It does **not** support nested lists, images, HTML or
footnotes. Keep documents to what it renders.

---

## 5. The lesson DSL

A lesson is `{ id, world, stage, title, start?, beats: [...] }`. A beat is:

| field | meaning |
|---|---|
| `say` | the narration line |
| `set` | `{ paramKey: value }`, applied on entering the beat |
| `until` | `{ obs: key, op, value }` or `{ goal: true }` — waits; skips when true |
| `hint` | shown while waiting; say which slider to move |
| `ask` | the question text (a string, not an object) |
| `options` / `answer` | siblings of `ask`; `answer` is the index of the right option |
| `hold` | seconds before auto-advancing; ignored on `ask` beats |

`op` is one of `> >= < <= ==`. Conditions compare the **parsed number** of the observable.

**`start`** (on the lesson, optional) is an object of param values applied the moment the
lesson begins, before beat 0, so the instrument is reproducible. If you omit it, the runner
falls back to the first value each beat ever `set`s. A lesson with neither runs against
whatever state the learner left behind, which makes it non-deterministic and lets `until`
conditions fire instantly — always give a lesson a starting state one way or the other.

Beats with `until` show a Skip button so nobody is trapped. Beats with `ask` wait for an
answer. Everything else shows Next.

**Trap:** an earlier version of the runner read `beat.ask.q` and `beat.ask.options`. It no
longer does. `ask` is a string. Do not "restore" the object shape.

---

## 6. The key map — every parameter and observable, today

Params are what a lesson can `set`. Observables are what a lesson can wait on. Keys are
derived from the label as described in §4.2. If you add one, add it here.

| world id | parameters | observables |
|---|---|---|
| `physics` | `wavelength`, `slit_separation`, `time`, `force`, `mass` | `bright_fringes`, `fringe_width`, `slit_separation`, `acceleration`, `distance`, `density`, `behaviour` |
| `maths` | `amplitude_a`, `frequency_b`, `phase_c`, `shift_d`, `objects`, `groups` | `amplitude`, `period`, `range`, `max_slope`, `per_group`, `spread`, `placed` |
| `chem` | `atomic_number` | `selected`, `electronegativity`, `elements_opened`, `family` |
| `art` | `brush` | `distinct_values`, `canvas_covered`, `strokes` |
| `music` | `tempo` | `notes_played`, `last_note`, `phrase` |
| `earth` | `year` | `country`, `timeline`, `events_in_view`, `countries_opened` |
| `cs` | `array_size`, `steps_per_frame` | `comparisons_bubble`, `comparisons_quick`, `best_at_32` |
| `finance` | `saved_each_month`, `annual_return`, `inflation`, `annual_fee`, `budget` | `balance_at_40y`, `in_today_s_money`, `lost_to_fees`, `years_to_double`, `spent`, `left`, `items_bought` |
| `language` | `voice_speed` | `sentences_solved`, `clean_runs`, `mistakes_here`, `words_placed` |
| `astro` | `time` | `elapsed`, `neptune_orbits`, `earth_years`, `scale` |
| `bio` | `environment_optimum`, `selection_strength`, `mutation_rate` | `generation`, `mean_trait`, `spread`, `distance_from_optimum` |
| `stats` | `sample_size_n`, `samples_per_frame` | `samples_drawn`, `measured_spread`, `predicted_n`, `mean_of_means` |
| `climate` | `solar_output`, `albedo_reflectivity`, `emissivity_lower_traps_more` | `surface`, `equilibrium`, `absorbed`, `radiated` |
| `eng` | `bottom_chord`, `top_chord`, `diagonals` | `factor_of_safety`, `peak_stress`, `material_cost`, `bottom_chord_force` |

**Two instruments in one world.** Physics, Maths and Money each hold two: `physics` has
`wave` and `push`, `maths` has `wave` and `blocks`, `finance` has `chart` and `shop`.
All their params and observables are registered together, so the key map above covers both.
A lesson picks one with `instrument: '<id>'`; the runner calls `contract.useInstrument`, which
runs the world's own `activate` and points `goal: true` at that instrument's goal. Each world
registers its goals with `ui.goal(html, check, key)` — the key must match the instrument id —
and calls `contract.useGoal(id)` when it switches. Never register two goals without keys: the
first one registered silently wins forever.

Caveats you must know when authoring conditions:

- `maths` `period` displays in units of π, so it parses as `1.00` meaning π. Conditions on
  it mean "π units".
- `maths` `per_group` is `—` until every object is placed *and* the groups are even, so a
  condition on it is false for a while and then true; it parses as the common group size.
- `physics` `distance` is the two-second distance in metres: `2 × force / mass`.
- `maths` `range` is the string `"-1.50 … 1.50"`; parsing takes the **minimum**.
- `finance` money observables display like `$1.24m`; they parse as `1.24`.
- `astro` `scale` is the word `compressed` or `true` — it parses NaN. Never wait on it.
- `cs` observable labels change with the chosen algorithm, but the **registered keys do not**:
  they were captured at construction. `comparisons_bubble` is lane A's original label.

---

## 7. Verification protocol — you have no runtime

Follow this every time. It is the only reason the app still works.

1. **Read before you write.** `read_file` the file you are about to change. If you cannot
   quote the lines you are replacing, you are not ready to replace them.
2. **Anchor precisely.** `modify_file` with `replace`, and an `old_content` string that
   includes at least two lines of surrounding context so it can match only once.
3. **Batch independent edits.** All the edits that do not depend on each other go in one
   round. Reading is cheap, rounds are not.
4. **Re-read the edited region.** After a multi-edit round, read the touched areas back.
   Look for: an unclosed brace, a duplicated declaration, a `const` used before its line, a
   function you renamed in one place and not another.
5. **Trace by hand.** For every new identifier, search the file for its definition and every
   use. `search_files` finds a symbol across the project — use it when you rename anything.
6. **Check the seams.** New code touching these is the most common way to break the app:
   `app.js` imports, `contract.begin()/end()`, `lesson.configure(stageEl)`, the cleanup
   return, and anything that reads `contract.current()`.
7. **Publish.** Call `publish_preview` at the end of the turn and fix what it reports.
   Remember what it does *not* report: it builds and serves static files, so it will not
   tell you about a runtime error, a bad selector or a logic bug.
8. **Say what you did not verify.** In the final message, state plainly that you did not run
   it. Never write "verified", "tested", "confirmed working" or "should work now".

### The self-check before you publish

- Every file you edited: did you read it back after editing?
- Every function you added: is it closed?
- Every symbol you used: does it exist, with that spelling, in that module's exports?
- Every lesson key you used: is it in §6?
- Every new bottom-anchored element: does `.stage-lesson` shift the right things?
- Did you add a dependency? Remove it.

---

## 8. Known traps

These have all happened. Each one cost a broken build or an hour.

- **`contract.end()` must keep the registry.** Lessons read it after mount. Clearing it
  silently disables every `until` condition.
- **`ui.section(title)` writes `data-title`** and the stage gating CSS keys off exact
  strings (`Observables`, `Selection`, `Critique`). Renaming a section title changes what
  Primary hides.
- **`stagebar-reset` was renamed to `stagebar-link`.** The old CSS rule is dead text; do not
  copy it.
- **`slider().set()` does not fire `onInput`; the registered param's `set()` does.** Use the
  returned one for syncing UI or you get feedback loops.
- **Mutating the canvas in its own ResizeObserver** (or resizing the observed element inside
  the observer) causes an infinite layout loop. `ui.fitCanvas` already handles this; do not
  add a second observer that resizes the same canvas.
- **`speechSynthesis` may not exist.** Guard with `'speechSynthesis' in window` and try/catch
  the listener registration. `js/worlds/language.js` is the reference.
- **`AudioContext` must be constructed inside a user gesture.** Never at module load.
- **`localStorage` throws in private mode.** Every access is already wrapped; keep it that way.
- **Nine worlds draw on Canvas and five render DOM.** Do not assume a world's stage
  children are a canvas.
- **Adding a world without touching `app.js` does nothing.** There is no auto-discovery.
- **A lesson whose `obs` key is misspelled** does not error — it waits forever, and only the
  Skip button saves the learner. Whenever you add a condition, re-check §6.

---

## 9. The work queue

Do these in order. Each has an acceptance test you can check by reasoning, since you cannot
run anything. Do not start the next until the current one is complete across the whole app.

### 9.1 Primary instruments — DONE

Physics, Maths and Money each now hold a second instrument for the primary band, switched by
a segmented control at the top of the coach: `physics` `push` (force and mass, a ball in a
one-litre tank), `maths` `blocks` (tap dots between groups until they are even), `finance`
`shop` (a shelf, a budget, a basket). The stage is **toggled**, not rebuilt: both panes exist
and one is `display: none`, because rebuilding would need teardown bookkeeping for two
canvases and two ResizeObservers. Each world registers both instruments; lessons select one
with `instrument:`.

### 9.2 Ladder completion

`maths` and `finance` have nine lessons each. Every other world has two. Bring all fourteen
to at least four: one each at `p`, `ls`, `us`, `uni`, in that order in the file, each with a
`until` condition or a graded `ask`.

**Acceptance:** `lessonsFor(world).map(l => l.stage)` contains all four stages for all
fourteen worlds, and §6 lists every key used.

### 9.3 Real diagnostics

Self-placement in `js/lesson-run.js` asks four generic statements. Replace it with five
authored items per world: one that needs the `play` instrument, one `compute`, one `derive`,
one `apply`, one about a misconception. Correct answers set the stage score; the highest
cleared rung is the placement.

**Acceptance:** placement sets a per-world stage and the reason is shown to the learner.

### 9.4 Data honesty

Every dataset shown in the app must state its source and an "as of" date. Chemistry's table,
Earth's dossiers and the finance figures are curated samples and say so in their notes —
extend that to any number you add.

**Acceptance:** no number appears in any coach without either a source or an explicit
"sample" note in the same world.

### 9.5 Accessibility

Canvas worlds currently have no keyboard path. Add: a focusable stage, arrow-key nudging of
the primary parameter, and an `aria-live` line that reads the current observables. Text
worlds already pass.

**Acceptance:** every world can be driven without a pointer.

### 9.6 Performance

Cap per-frame allocation. Any `new` inside a ticker, any `Array.from` over thousands of
items, any `Math.max(...bigArray)` per frame is a defect on a phone.

**Acceptance:** a read of each ticker shows no allocation proportional to the data size.

---

## 10. Style and content rules

**Code.** Two-space indent. Single quotes. Semicolons. Named function declarations, not
classes, for the most part. Section banners in the `/* ---------- name ---------- */` style.
Comments only where they explain *why*. Match the file you are in, always.

**Copy.** Titles are claims. Bodies are three sentences. Notes are the honest caveat — say
what the model leaves out, every time. Never write "simply", "just" or "obviously".

**Content.** No medical or clinical content anywhere. No financial product recommendation,
ever — Money shows arithmetic on the learner's own numbers and nothing else. No invented
facts. No political position on the Climate or Earth worlds: teach the mechanism, show the
data, cite it, state the uncertainty.

**Scope.** Change only what the task needs. Do not reformat, rename or tidy code you were not
asked to touch. If you create an unused import or variable, remove that one; do not go
looking for others.

---

## 11. How to report back

When you finish a turn, the final message says, in this order and in a few lines:

1. **What changed**, naming the files.
2. **What you could not check**, plainly. You did not run it.
3. **What the user should look at**, as a concrete action ("open Money, press Start a
   lesson, pick the primary one").
4. **What is next**, if the work queue is not finished.

Never claim a fix or a check you did not make. If a tool failed and you worked around it,
say so. If you are unsure whether something works, say that instead of implying it does.

---

## 12. Glossary

- **World** — one subject module under `js/worlds/`. Owns its canvas, its parameters, its
  observables and its goal.
- **Instrument** — the thing the learner manipulates. If a world has a weak instrument, the
  world fails no matter how good its lessons are.
- **Param** — a named, ranged, unit-bearing control that a lesson can drive.
- **Observable** — a named live value the shell and lessons can read.
- **Goal** — a predicate over observables, registered by `ui.goal`. Assessment by doing.
- **Stage** — the formal level: `p`, `ls`, `us`, `uni`. Gates which lenses the coach shows.
- **Mode** — who is learning: `child`, `teen`, `adult`. Changes session length and density,
  never the concept.
- **Held** — a world's goal met again at least three days after the first time. The green dot.
- **Lens** — `play`, `story`, `notation`, `proof`, `apply`. A concept has all five; the stage
  decides which are shown.
- **Lesson** — pure data in `js/lessons.js`, a sequence of beats.
- **Beat** — one step of a lesson: say, set, wait, or ask.
