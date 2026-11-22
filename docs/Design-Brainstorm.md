# Learning App — Design & Architecture Brainstorm

## 0. The one-sentence thesis

> **Few engines, many lessons, one graph.**

This is not six apps wearing a trench coat. Four of the five things you described are not *courses* — they are *instruments* (a physics sandbox, a canvas, a DAW, a globe). The minute you force them into an LMS mould of "unit → lesson → quiz" you get six disconnected verticals and none of them is excellent.

So: build a small number of **worlds** (interactive runtimes), a universal **lesson/coaching layer** that works across all of them, and a **content graph** that connects them. Breadth comes from *lessons as data*, not from more engines.

The corollary risk, stated plainly: "so many many subjects" is the main way this project fails. The product is not *all subjects*. The product is **one connected world of knowledge, entered at any point**. Connection is the moat; breadth is the trap.

---

## 1. The unifying abstraction

### 1.1 Worlds declare parameters and observables

Every subject runs on the same contract:

```
World {
  init(state)            // start from a serialisable state
  step(dt)               // deterministic where possible
  render(rl)             // one renderer per world, WebGL2
  params: ParamSchema    // declarative knobs: name, unit, range, type
  observables: ObsMap    // named values the shell can read each frame
  snapshot(): State      // -> permalink / notebook / lesson start
}
```

Two properties do all the work:

- **`params`** means the shell can drive any world without knowing what it is. A lesson can animate `slitSeparation` in the optics world or `tempo` in the music world through the same mechanism.
- **`observables`** means the shell can *see* what the learner did. `eccentricity`, `voltages`, `pitchErrorMs`, `valueHistogram`, `countriesVisited`.

That second one is the single most important idea in this document:

> **Assessment is a goal over observables, not a multiple-choice question.**

A lesson beat can say "until `eccentricity < 0.05` for 3 seconds". Or "until the canvas has ≥5 distinct value bands". Or "until `harmonyScore > 0.8`". Same primitive, four totally different subjects. That is how you get one lesson format for physics, art and music — and it makes assessment *doing* rather than *quizzing*, which is where education apps usually collapse into flashcards.

### 1.2 A lesson is data, not code

A lesson is a sequence of beats in a declarative file (JSON/YAML):

```
beats:
  - narrate: "Two slits. Predict first — bands or blur?"
  - pose: { q: "What will you see?", options: [...] }        # prediction
  - setParam: { world: "optics", slit: 0.0002, animate: 1200ms }
  - freePlay: { highlight: ["screen"], duration: 90s }        # explore
  - goal: { observable: "fringeContrast", op: ">", value: 0.6 }
  - explain: { from: "patterns.shared", depth: 2 }            # links the graph
  - check: { type: "symbolic", expr: "d*sin(theta)=m*lambda" }
```

Authoring cost is the real budget constraint on a project this size. Worlds are ~6 files of engine code written once. Lessons are thousands of small data files. **Optimise the path from "I had an idea" to "a learner can do it" down to minutes.** That means a lesson editor that runs in the same app, plus a linter in CI.

### 1.3 The content graph

One entity table, typed edges:

```
Entity: concept | person | place | artifact | species | formula | song | painting | molecule | event
Edge:   prerequisite-of | exemplifies | discovered-by | same-pattern-as | contradicts | part-of | located-in
```

Why it matters:

- **Prerequisites** drive a knowledge-graph scheduler and honest "you're ready for this" navigation instead of a fixed course ladder.
- **`same-pattern-as`** is the app's unique idea. A wave in the physics world, a sine curve in the maths world, vibrato in the music world, a seismic surface wave on the globe — *the same pattern, four rooms*. A "Pattern Lens" that follows one concept across worlds is something no existing app does coherently, and it's mostly a data problem, not an engineering one.
- **`exemplifies`** anchors abstractions to real objects: this painting, this song, this earthquake, this molecule. Real data is free and enormous (see §4).

### 1.4 Learner model

Deliberately unsexy, deliberately shallow:

- Per-concept **mastery estimate** (Elo or BKT — 4 parameters, interpretable, debuggable). No deep learning. You will never have the data volume, and you could not explain a mistake to a parent.
- **Misconception tags.** Every wrong option and every failed goal maps to a *named* misconception (`heavier-falls-faster`, `current-is-used-up`, `minor-means-sad`). This is where diagnostic value lives; a bare right/wrong score is worthless.
- **Spaced retrieval** with FSRS (the modern open successor to SM-2): 5 minutes a day, *interleaved* across subjects. Interleaving is well-supported by the evidence and is also the mechanism that makes the cross-subject graph feel earned rather than bolted on.
- **Notebook**: every world snapshot (state + screenshot + note) auto-saved to a personal timeline. Retention mechanic, portfolio, and assessment evidence in one cheap feature. Also: every snapshot is a permalink — "here's the double slit I built" is a shareable, teachable object.

---

## 2. Architecture

```
apps/
  shell/            routing, search, notebook, profile, offline cache, sync
packages/
  world-core/       the World contract, param schema, observable bus, time
  world-physics/    integrator, rigid bodies, optics, waves, circuits
  world-chem/       molecules, orbitals, equilibrium, periodic data
  world-maths/      algebra AST, plotting, geometry, lin-alg 3D
  world-art/        canvas, brush engine, layers, feedback overlays
  world-music/      audio graph, notation, practice engine, theory sandbox
  world-earth/      globe, time slider, dossiers
  lesson-dsl/       schema + runtime + validator
  content-graph/    entities, edges, query, cross-links
  learner/          mastery, FSRS, misconceptions
  ui/               design system
content/            datasets, lessons, graph seeds (versioned bundles)
tools/              lesson editor, world sandbox, linter, bundle builder
```

Rules that will save you months:

1. **React renders chrome, never frames.** A world owns its own rAF loop and writes to canvas/WebGL directly. Putting 60fps state in React is the classic fatal mistake.
2. **Every world is deterministic given (state, input, dt).** Needed for permalinks, replay, tests, and for the lesson's `goal` to be checkable. Seed all randomness.
3. **Worlds never import each other.** They talk through the graph and the shell.
4. **Content bundles are signed and versioned**, fetched lazily, cached. A lesson is 2 KB; a country dataset is 400 KB; a SoundFont is 20 MB. Different lifecycles, different caches.

### Stack (recommendation)

The web platform is decisive here — not because web is fashionable, but because *every hard piece of this app already exists there and nowhere else*: Cesium for the globe, VexFlow/OSMD for notation, Tone.js/Web Audio for sound, Rapier or Jolt for physics, MathLive for maths input, three.js for 3D. A native Swift build means re-implementing a globe, a notation renderer and a sampler from scratch — that alone is a year.

- Vite + TypeScript + React (shell only). WebGL2 renderer (don't depend on WebGPU in iOS webviews yet).
- CesiumJS (Apache-2.0) for Earth — terrain, 3D Tiles, imagery dates, sun position. Highest-leverage dependency in the project.
- three.js for maths/chem 3D; 2D canvas + WebGL for art.
- Rapier (WASM) for rigid bodies. Do **not** write your own.
- Tone.js + Web Audio + SoundFont samples for music; YIN/MPM autocorrelation for pitch.
- math.js AST for algebra, MathLive + KaTeX for input/display. Not a CAS.
- SQLite (wa-sqlite) + prebuilt binary/vector tile bundles; OPFS for offline.
- **The honest caveat:** audio round-trip latency inside a webview on iOS is worse than native AVAudioSession. This is the one place I'd run a spike before committing — a 5–10 ms instrument feel matters for the music world. If it can't be reached, the music world is the one justified candidate for a native/AUv3 module.

---

## 3. Subject by subject: build this, skip that

### Physics — 5 reusable engines, not a universal simulator

| Engine | Covers | Effort |
|---|---|---|
| RK4/Verlet integrator over an arbitrary force field | gravity, orbits, projectile, springs, pendulums, electrostatics, charged particles in E/B, fields | days |
| 2D wave-equation PDE on a grid → heightmap render | interference, single/double slit, standing waves, Doppler, beats | ~100 lines, enormous wow |
| 2D ray tracer | lenses, mirrors, prisms, refraction/TIR, fibre optics, rainbows | days |
| Rigid bodies (library) | ramps, pulleys, collisions, momentum, friction | config only |
| Nodal analysis circuit solver (solve one linear system) | real circuits that actually compute voltages and currents | days |

A circuit simulator looks intimidating and is a matrix solve. Include it — it bridges physics → electronics → "why your phone charges".

**Skip:** real fluid dynamics, general relativity, anything needing a full game engine. Fake fluids with SPH-lite or don't ship them.

### Chemistry — real structures, not generated ones

- **Periodic table as the data spine.** Real element properties → interactive trend plots. Nucleosynthesis (physics/earth) → elements → minerals → pigments (art) → materials. This single link makes three worlds feel like one app.
- **Molecules from real data**: PubChem (PUG-REST + bulk), PDB for proteins, Crystallography Open Database for crystals. Never generate a structure you can download.
- **Orbitals**: analytic spherical harmonics. Cheap, beautiful, genuinely clarifying.
- **Stoichiometry / balancing**: algorithmic, trivially correct, high value, boring to build — build it anyway.
- **Equilibrium / titration**: solve the system numerically (Newton on mass-action equations). Real curves, real buffer behaviour.
- **Reaction mechanisms**: hand-authored arrow-pushing, curated. Not generated.

**Skip:** quantum chemistry (DFT). If it needs an SCF loop, it doesn't ship in v1. Reaction *prediction* from scratch — no.

### Maths — linked representations + step-level diagnosis

The differentiator is not graphing. It's this:

- **One model, four views:** expression ↔ graph ↔ table ↔ geometric figure, all live. Change one, all update.
- **Step-by-step algebra with mistake diagnosis.** Parse to AST, encode valid rewrite rules, let the learner make the step, and *diagnose the specific error* (`distributed-over-product-wrongly`, `sign-error-on-transposition`). This is tractable (rule-based rewriting, not a CAS) and it's what students actually need.
- **Dynamic geometry** with real constraint propagation (JSXGraph, or your own point/constraint solver) — compass-and-straightedge construction, then proof hints.
- **Linear algebra as transformation**: matrix = a machine that moves space. Visualise it; it's the single highest-impact 3D visual in maths.
- **Monte Carlo / probability simulators** — instant, correct, cheap.
- **Symbolic answer checking by AST equivalence**, never string comparison. Obvious, and half the industry gets it wrong.

**Skip:** a general CAS. You need: differentiate, simplify, solve-numerically, equivalence-check. That's it.

### Art — a studio where tools map to concepts, plus critique

The trap is building Photoshop. The scope that wins:

- Layers, stamp-based brush engine (texture + tilt/velocity; no pressure on glass), HSV/LAB colour, palette harmony rules.
- **Pedagogy that only a computer can add: the app can *see* your drawing and critique it.** Value histogram and contrast distribution; edge quality; proportions by silhouette comparison against a reference; perspective line checks; colour harmony analysis; "you have 3 values where the master has 7". Every one of those is ordinary image analysis and none of the consumer art apps do it. This is a real moat.
- **Master studies** from open-access collections: Met Open Access, Rijksmuseum, Art Institute of Chicago, Smithsonian — all free with real metadata. Paint alongside, overlay-compare, then walk to the globe and the period's history.
- Value-study mode (desaturate, lock to 5 greys), gesture/life drawing with timers, perspective guides.

**Skip:** filters, AI generation, brush marketplaces. All commodity, all off-mission.

### Music — do not build GarageBand

GarageBand is 30 person-years of commodity DAW that teaches almost nothing. Split it:

- **The practice engine is the differentiator.** Real songs (MusicXML from MuseScore/OpenScore, IMSLP public domain, Mutopia), scrolling notation with VexFlow/OSMD, "wait for you" mode, per-note timing and pitch scoring, loop the hard bar, slow it down without pitch shift.
- **Real instrument in hand, phone as coach.** This is the magical, cheap, undervalued move: the phone sits on the piano, listens, and tells you which note you're fumbling. Same for singing (tune, intervals, solfège) and rhythm (clap along, onset detection). Pitch detection is a solved problem and needs no MIDI controller. Nobody expects it to work this well.
- **Theory you can hear.** A chord-function sandbox where roman numerals are drag-and-drop and voice leading is audible. Then *the same overlay* sits on the song you're practising: "here are the ii–V–I you just learned."
- **A sequencer, but small**: 8–16 tracks, a good sampled piano, a few real instruments, basic FX. Enough to compose 8 bars. Not enough to master an album.

**Skip:** plugin hosting, mixing consoles, mastering chains, AUv3 hosting, a synth zoo.

**Note on form factor:** practice works brilliantly on a phone (you're holding it while playing). *Composition* does not — a 4-inch arrangement view is a demo. Music and art are iPad-shaped; practice and theory are phone-shaped. Design for that split rather than pretending one layout serves both.

### Earth — the product is data and time, not polygons

- **CesiumJS** gives you the globe *and the time dimension* for free: sun position, day/night, historical imagery, 3D tiles, terrain.
- **Country dossier** recomputed from real datasets: World Bank / UN / WHO / Our World in Data time series per indicator; Natural Earth borders; GADM subnational. This is "current info of any country" if you treat it as a *dataset release pipeline* rather than a live API.
- **History**: CShapes 2.0 (real historical borders, 1886–2019) for border morphing; OpenHistoricalMap for period detail; Wikidata (geo-coordinates + dates + entity links) for event pins — with the caveat that you need a curation pass, Wikidata's query service is rate-limited and untrustworthy at scale, and *history needs an editor, not just a pipeline*.
- **The killer interaction: one time slider, everywhere.** Scrub a country's borders, its population curve, its art movements, its scientists, its earthquakes. Same control in the art world (a painting's restoration) and the music world (a form's evolution). Time is your universal axis.

**Non-obvious hard parts:** data staleness (label every figure "as of", cite it), border politics (document a border policy and pick a tile origin), and neutrality — a country dossier makes you an editorial publisher. Budget for that.

---

## 4. Content & authoring economics

The engineering is not the hard part. The hard part is that deep content across six subjects costs more than all the code.

Four levers, in order of impact:

1. **Lessons as data** (§1.2), with an in-app editor and a CI linter. Non-programmers must be able to author.
2. **Real datasets instead of invented content.** Two centuries of open data, imagery, scores, paintings, molecules and gazetteers already exist. Your content team's job is *selection and curation*, which is 10× cheaper than creation and 10× more credible.
3. **Generators.** Parametric problem sets (physics, maths) validated by the solver itself — the simulator is the answer key. Generate 10,000 verified exercises, tag by misconception.
4. **Reuse across worlds.** One authoring effort per *pattern*, linked many times. The wave appears in four worlds for the cost of one lesson plus three cross-links.

---

## 5. Pedagogy (the part most apps get wrong)

- **Predict → observe → explain.** Let them commit to a guess before running it. The wrong prediction is the whole lesson.
- **Productive failure first.** Manipulate before you're told. Text after, not before.
- **Feedback specificity beats feedback frequency.** "Wrong" teaches nothing; "you treated current as consumed by the first resistor" teaches.
- **Capstones per subject.** "Get the orbit circular." "Build a circuit that dims the lamp." "Paint a 7-value study." "Play this bar at tempo." Doable things, capped by observables.
- **The daily 5 minutes.** Interleaved retrieval across subjects, weighted by mastery decay. This is your retention engine.
- **Nothing is a dead end.** Every screen has a "go deeper" edge into the graph.

---

## 6. Cost traps (name them now, thank yourself later)

1. Writing your own physics engine.
2. Real fluid dynamics, real quantum chemistry, real SPICE.
3. A full DAW.
4. User-generated content, social features, multiplayer, classrooms — before the core loop works.
5. Live data feeds instead of periodic dataset releases.
6. Hand-coding lessons.
7. Native per-platform from day one.
8. A general-purpose CAS.
9. Becoming a curriculum (standards alignment, grade books, teacher dashboards) before one learner finishes one satisfying arc.
10. 3D-for-everything. 2D ray tracing beats a mediocre 3D render every time.

---

## 7. Sequencing — and the one test that matters

**Phase 0 (weeks): one world, fully real.**
Pick the cheapest high-wow world: **waves + optics**, on the shell, with the full lesson DSL, the observable-goal primitive, permalinks, the notebook, and ten lessons that are actually good. Ship it to one real learner.

**Phase 1 (the architecture test): a radically different second world, zero shell changes.**
Add **Earth + country dossiers**. Globe, time slider, data pipeline, graph links. If the lesson DSL needed changes to accommodate it — good, learn that now, in weeks. If it needed *no* changes, your abstraction is right and everything after is repetition.

Do not start with music. It's the highest-value differentiator and the most expensive; it needs the shell to be settled first. But do the **audio latency spike in week one** in parallel, because its result may change your platform decision.

**Phase 2:** chemistry (shares the physics integrator) → maths (shares the graph and plotting) → art → music practice engine → music composition.

**Rough honesty on scale:** what you described is 5–10 person-years of engineering plus a content programme larger than that. A 1–3 person team in 18 months ships **three worlds done well**. Three excellent worlds that talk to each other beat eight shallow ones, and they're the only version that survives contact with a real user.

---

## 8. Open decisions that change the architecture

1. **Audience**: self-directed adults / curious teens (design for delight, no accounts, offline) vs. schools (rosters, dashboards, COPPA/GDPR-K, procurement). These are different products. My assumption throughout: the former, with schools as a later, separate surface.
2. **Form factor**: phone-first (practice, quick daily) vs iPad-first (art, music, globe, sims). Recommendation: **iPad-first, phone as companion**, since four of six worlds are instrument-shaped.
3. **Native vs web**: recommend web-tech + Cesium; validate audio latency before the music world.
4. **Free vs paid**: the compute-heavy worlds (Cesium, audio) are cheap to run because content is bundled, not streamed. A one-time purchase or cheap annual is viable — this app can be profitable without ads or surveillance, which matters for the brand.

---

## 9. Ideas worth keeping in the back pocket

- **Pattern Lens**: one concept traced across four worlds (wave, ratio, cycle, symmetry). The brand idea.
- **The periodic table as Rosetta stone**: stars → elements → minerals → pigments → materials → instruments.
- **Every snapshot is a permalink**: experiments are shareable objects; a lesson can start from someone else's state.
- **Then vs now slider**: borders, cities, coastlines, paintings, instruments, theories.
- **"Real things" mode**: a concept is never taught without a real anchor object from an open dataset.
- **The notebook as portfolio**: what you made, not what you scored.
