# Lesson Expansion Spec — for implementation agents

The work order for growing Lumen from **41 lessons across 14 worlds** to a structured
curriculum of **~170 named topics**, built to the standard of two reference projects:

- **TeddyRookBook** (`github.com/TeddyRookBookClub/TeddyRookBook`) — the curriculum spine.
  A static, zero-framework site with **27 math courses / 1,305 topics**, plus physics (490),
  chemistry (219), biology (262), Earth & space (180), economics (186), logic (156),
  geography (234), art (244), writing (270), civics (375). Its topic schema is the model.
- **PhET** (`phet.colorado.edu`) — the interaction standard. 170+ sims, 120+ languages, and
  every HTML5 sim shipped with seven baseline inclusive features.

Read `AGENTS.md` first for the code rules. This document is the content plan.

---

## 1. What exists now

Fourteen worlds, each with a working instrument and a handful of lessons:

| world id | instrument(s) | lessons today |
|---|---|---|
| `physics` | `wave`, `push` | 3 |
| `maths` | `wave`, `blocks` | 9 |
| `chem` | `chem`, `isotopes` | 2 |
| `art` | `art`, `palette` | 2 |
| `music` | `music`, `tuning` | 2 |
| `earth` | `earth`, `compare` | 2 |
| `cs` | `sort`, `search` | 2 |
| `finance` | `chart`, `shop` | 3 |
| `language` | `language`, `pace` | 2 |
| `astro` | `astro`, `moon` | 2 |
| `bio` | `bio`, `genetics` | 2 |
| `stats` | `stats`, `hypothesis` | 2 |
| `climate` | `balance`, `seasons` | 2 |
| `eng` | `eng`, `materials` | 2 |

Every lesson already has an `ENRICHMENT` entry (key idea, why, common mistake, worked
example, sources, prerequisites) and a diagnostic. The gap is **coverage**, not machinery.

**Target: 10–16 lessons per world, at least three per stage (`p`, `ls`, `us`, `uni`), each
attached to a named topic.**

---

## 2. The source of truth: TeddyRookBook's topic schema

TeddyRookBook stores each course as `data/<subject>/topics/<course>.json`. The real schema,
taken from `data/math/topics/k.json`:

```json
{
  "course": "k",
  "units": [
    { "key": "counting", "title": "Counting to 20", "blurb": "Say the numbers in order…" }
  ],
  "topics": [
    {
      "id": "k.count-to-10",
      "slug": "count-to-10",
      "unit": "counting",
      "title": "Counting to 10",
      "short": "Say the numbers from 1 to 10 in order.",
      "prereqs": [],
      "xp": 1,
      "std": "K.CC.A.1",
      "trouble": "Children skip or repeat a number name, such as \"5, 6, 8\", so every count after that is off.",
      "viz": ["counters", "numberline"]
    }
  ]
}
```

**This maps almost one-to-one onto Lumen's lesson schema.** Use the mapping literally:

| TeddyRookBook | Lumen | rule |
|---|---|---|
| `topic.id` | lesson `id` | prefix with the world: `k.count-to-10` → `mat.p.count10` |
| `topic.title` | lesson `title` | keep it a claim where you can |
| `topic.short` | beat 0 `say` | expand to one sentence of setup |
| `topic.trouble` | `ENRICHMENT[id].mistake` | rewrite in your own words; name the error |
| `topic.prereqs` | `ENRICHMENT[id].prereqs` | map to Lumen lesson ids, not TRB ids |
| `topic.viz` | `lesson.instrument` | pick the Lumen instrument that best matches |
| `topic.std` | `ENRICHMENT[id].sources` | cite the standard, e.g. "CCSS K.CC.A.1" |

**Do not copy lesson prose.** TeddyRookBook's written content is CC BY-NC 4.0. Take the
*sequence, the topic names, the prerequisites and the trouble spots* — the curriculum
skeleton — and write every sentence of Lumen's lessons yourself. Cite the source in
`ENRICHMENT.sources` as `"TeddyRookBook curriculum, Math K"` or `"CCSS K.CC.A.1"`.

---

## 3. The interaction standard: PhET

PhET ships every new HTML5 simulation with **seven baseline inclusive features**. Lumen has
three of them, partly. Every world must have all seven before its expansion counts as done:

| # | PhET feature | What it means in Lumen | Status |
|---|---|---|---|
| 1 | Alternative Input | every instrument drivable without a pointer | partial — arrow keys move `paramList()[0]` only |
| 2 | Enhanced Touch Input | targets ≥ 44 px, no hover-only affordances | **missing** |
| 3 | Interactive Highlights | visible focus ring on every control | partial |
| 4 | Pan and Zoom | canvas content reachable on small screens | **missing** |
| 5 | Basic Sounds | optional audio cue on state change, off by default | **missing** |
| 6 | Core Description | a screen-reader sentence describing what the instrument shows | partial — `sr-live` reads observables |
| 7 | In-sim Language Selection | UI strings separable from mechanics | **missing** |

PhET's other architectural lesson: keep the **model separate from the view**. Lumen's worlds
already do this — the physics solver is not the renderer — and that is why the same code
drives a lesson, a goal and a diagram. Do not merge them.

### PhET and TeddyRookBook simulations → Lumen instruments

TeddyRookBook's Science Lab has 13 simulations on real models. They are the closest thing to
a spec for what each Lumen instrument should eventually do:

| TRB simulation | Lumen world | what to borrow |
|---|---|---|
| Orbit Lab (Newton's cannon, Kepler) | `astro` | eccentricity readout, transfer burn |
| Sky and Solar System (JPL elements, Meeus phases) | `astro` | moon phase from a real date |
| Rocket Builder (Δv, rocket equation) | `astro`, `eng` | staging cost model |
| Trebuchet Workshop (Lagrangian + drag) | `eng` | projectile with air drag |
| Pendulums and Resonance | `physics` | resonance curve, coupled pendulums |
| Circuit Builder (nodal analysis) | `eng` | real nodal solve, bulbs and meters |
| Optics Bench (Snell, Fresnel) | `physics` | refraction and total internal reflection |
| Gas in a Box (hard disks) | `physics`, `chem` | pressure from collisions |
| Mixing Lab (pH, titration, rates) | `chem` | titration curve |
| Build an Atom (isotopes, shells) | `chem` | the `isotopes` instrument, extended |
| Predators and Prey (Lotka–Volterra) | `bio` | coupled ODE beside the agent sim |
| Book Cart (Lagrange, inverted pendulum) | *not applicable* | control-systems idea only |
| Magnetic Bottles for Fusion | *not applicable* | — |

Deep-dive units worth mirroring as lesson sequences: **Newton's Laws** (6 chapters:
inertia · F=ma · action–reaction · free-body diagrams · momentum · circular motion and
gravity) and **Thermodynamics** (5 chapters: zeroth law · first law · entropy · engines ·
absolute zero).

---

## 4. The topic spine, world by world

For each world: the TeddyRookBook course it mirrors, then the topics to author. Format is
`id · title · stage · instrument`. Write the beats and the enrichment yourself.

### physics — mirrors TRB Physical Science → Physics 1 → Physics 2 → Mechanics
1. `phy.p.push` · A bigger push, a faster thing · p · push *(exists)*
2. `phy.p.float` · Why some things float · p · push
3. `phy.ls.light` · Light travels in straight lines · ls · wave
4. `phy.ls.circuit` · One bulb or two · ls · push
5. `phy.ls.sound` · Sound is a vibration · ls · wave
6. `phy.ls.friction` · Why things slow down · ls · push
7. `phy.us.newton1` · Nothing changes on its own · us · push
8. `phy.us.newton2` · F = ma, measured · us · push
9. `phy.us.momentum` · Collisions conserve momentum · us · push
10. `phy.us.ohm` · Voltage, current, resistance · us · push
11. `phy.us.waves` · Period, frequency and speed · us · wave
12. `phy.us.optics` · Refraction bends light · us · wave
13. `phy.uni.energy` · Work, energy and the conservation law · uni · push
14. `phy.uni.entropy` · Why heat flows one way · uni · wave

### maths — mirrors TRB Math Ladder (k → g8 → pre → alg1 → geo → calc1)
1. `mat.p.share` · Share twelve between four · p · blocks *(exists)*
2. `mat.p.count` · Count, group and compare · p · blocks
3. `mat.p.shapes` · Sides and corners · p · blocks
4. `mat.ls.fraction` · Halves, thirds and quarters · ls · blocks
5. `mat.ls.ratio` · Two for every three · ls · blocks
6. `mat.ls.line` · Straight-line patterns · ls · wave
7. `mat.amplitude` · One number, one shape · ls · wave *(exists)*
8. `mat.us.quadratic` · The curve that throws · us · wave
9. `mat.us.trig` · Ratios in a right triangle · us · wave
10. `mat.us.slope` · The slope of a wave · us · wave *(exists)*
11. `mat.period` · Frequency is the inverse of period · us · wave *(exists)*
12. `mat.uni.chain` · Why the slope is ab · uni · wave *(exists)*
13. `mat.uni.series` · Adding up infinitely many terms · uni · wave
14. `mat.uni.vectors` · Transformations and matrices · uni · blocks

### chem — mirrors TRB Chemistry → General Chemistry 1 → 2 (219 topics)
1. `chem.p.material` · What things are made of · p · chem
2. `chem.p.mix` · Mixing and separating · p · chem
3. `chem.families` · Families behave alike · p · chem *(exists)*
4. `chem.ls.element` · Elements, compounds, mixtures · ls · chem
5. `chem.ls.acid` · Acids, alkalis and pH · ls · chem
6. `chem.isotopes` · Same element, different mass · ls · isotopes *(exists)*
7. `chem.pull` · Find the electron thief · ls · chem *(exists)*
8. `chem.us.mole` · Counting by weighing · us · chem
9. `chem.us.bond` · Ionic or covalent · us · chem
10. `chem.us.rate` · What speeds a reaction up · us · chem
11. `chem.uni.orbital` · Where the electrons actually are · uni · chem
12. `chem.uni.spectrum` · Identifying a substance by its light · uni · chem

### art — mirrors TRB Drawing Basics → Colour and Design → Art History
1. `art.p.mark` · A mark is a decision · p · art
2. `art.p.colour` · Three colours make all of them · p · palette
3. `art.three` · Three values is a drawing · p · art *(exists)*
4. `art.ls.value` · Light, middle, dark · ls · art
5. `art.ls.shape` · Drawing what you see · ls · art
6. `art.ls.persp1` · One-point perspective · ls · art
7. `art.five` · The five-value study · us · art *(exists)*
8. `art.palette` · Mixing against the wheel · p → us · palette *(exists)*
9. `art.us.persp2` · Two-point perspective · us · art
10. `art.us.composition` · Where the eye goes first · us · art
11. `art.uni.critique` · Reading a painting's structure · uni · art
12. `art.uni.history` · Why movements happen together · uni · art

### music — mirrors TRB Piano Basics (9 ch) → Reading Music (12 ch)
1. `mus.beat` · Everything starts with a pulse · p · music *(exists)*
2. `mus.p.loud` · Loud, soft, fast, slow · p · music
3. `mus.p.echo` · Call and response · p · music
4. `mus.phrase` · Play eight notes in order · ls · music *(exists)*
5. `mus.ls.staff` · Notes on a staff · ls · music
6. `mus.tuning` · Two notes beating · ls → us · tuning *(exists)*
7. `mus.ls.chords` · I, IV, V, vi · ls · music
8. `mus.us.cadence` · How a phrase ends · us · music
9. `mus.us.form` · Binary, ternary, sonata · us · music
10. `mus.us.sightread` · Reading at speed · us · music
11. `mus.uni.counterpoint` · Two lines at once · uni · music
12. `mus.uni.analysis` · Harmony as function · uni · music

### earth — mirrors TRB Geography (234) + Earth Science (180)
1. `earth.p.place` · Where I live · p · earth
2. `earth.p.landwater` · Land and water · p · earth
3. `earth.dossier` · Every place is a stack of time · ls · earth *(exists)*
4. `earth.compare` · Two places, one question · ls · compare *(exists)*
5. `earth.ls.climate` · Why the equator is hot · ls · earth
6. `earth.us.develop` · One number, one country · us · earth
7. `earth.us.border` · Borders are recent · us · compare
8. `earth.timeline` · Open five, then go back · us · earth *(exists)*
9. `earth.us.migrate` · Why people move · us · compare
10. `earth.uni.spatial` · Patterns on a map · uni · compare
11. `earth.uni.geopol` · Geography as an argument · uni · earth

### cs — mirrors TRB Robotics (51) + the Blockly/Scratch benchmark model
1. `cs.p.sequence` · One step after another · p · sort
2. `cs.p.repeat` · Doing it again and again · p · sort
3. `cs.p.choice` · If this, then that · p · sort
4. `cs.ls.loop` · How many times? · ls · sort
5. `cs.ls.variable` · A name for a number · ls · search
6. `cs.beat` · Count, do not guess · us · sort *(exists)*
7. `cs.search.linear` · Looking one by one · ls · search *(exists)*
8. `cs.search.binary` · Half the list, every time · us · search *(exists)*
9. `cs.us.recursion` · A tower that collapses · us · sort
10. `cs.us.complexity` · Cost as a curve · us · sort
11. `cs.uni.automata` · Machines that accept · uni · search
12. `cs.uni.concurrency` · Two things at once · uni · sort

### finance — mirrors TRB Markets, Business, "Your tax receipt", Being an Adult 101
1. `fin.p.shop` · A shop with a budget · p · shop *(exists)*
2. `fin.p.save` · Saving for something · p · shop
3. `fin.ls.percent` · Ten per cent of what? · ls · shop
4. `fin.ls.budget` · A month of money · ls · shop
5. `fin.ls.unitprice` · Which is cheaper · ls · shop
6. `fin.us.compound` · Money earning money · us · chart
7. `fin.fee` · The fee you cannot see · us · chart *(exists)*
8. `fin.us.loan` · What a loan costs · us · chart
9. `fin.us.tax` · Marginal versus effective · us · chart
10. `fin.us.inflation` · What it buys · us · chart
11. `fin.uni.npv` · Present value · uni · chart
12. `fin.uni.risk` · Risk is a distribution · uni · chart

### language — mirrors TRB Languages (Greek/Latin drills) + Phonics Practice
1. `lang.p.greet` · Say who you are · p · language
2. `lang.p.numbers` · Numbers and colours · p · language
3. `lang.order` · Order is the grammar · ls · language *(exists)*
4. `lang.clean` · Three clean runs · ls · language *(exists)*
5. `lang.pace` · Speaking at speed · p → us · pace *(exists)*
6. `lang.ls.past` · Yesterday and today · ls · language
7. `lang.us.questions` · Asking, not telling · us · language
8. `lang.us.reading` · A short text, unglossed · us · pace
9. `lang.uni.register` · Formal and familiar · uni · language
10. `lang.uni.translate` · Saying it another way · uni · language

### astro — mirrors TRB Astronomy and Astrophysics + Science Lab Orbit Lab
1. `astro.p.daynight` · Day, night and the Moon · p · moon
2. `astro.p.seasons` · Why summer is hot · p · astro
3. `astro.speed` · Distance sets the period · ls · astro *(exists)*
4. `astro.moon` · Phases from a real date · p → ls · moon *(exists)*
5. `astro.ls.solar` · The solar system to scale · ls · astro
6. `astro.neptune` · One Neptune orbit · us · astro *(exists)*
7. `astro.us.kepler` · T² ∝ a³, measured · us · astro
8. `astro.us.spectra` · What stars are made of · us · astro
9. `astro.uni.orbit` · Transfers and Δv · uni · astro
10. `astro.uni.cosmology` · Redshift and distance · uni · astro

### bio — mirrors TRB Life Science → High School Biology → Advanced (262)
1. `bio.p.living` · Living or not · p · bio
2. `bio.p.grow` · What living things need · p · bio
3. `bio.select` · Push the population somewhere · ls · bio *(exists)*
4. `bio.mutation` · Why variation never disappears · us · bio *(exists)*
5. `bio.ls.foodweb` · Who eats whom · ls · bio
6. `bio.genetics` · One gene, two alleles · ls → us · genetics *(exists)*
7. `bio.us.cell` · The cell as a factory · us · bio
8. `bio.us.homeostasis` · Keeping the inside steady · us · bio
9. `bio.us.photosynthesis` · Turning light into sugar · us · bio
10. `bio.uni.popgen` · Allele frequencies over time · uni · genetics
11. `bio.uni.phylogeny` · Family trees from data · uni · bio

### stats — mirrors TRB Probability and Statistics + Science Lab Predators and Prey
1. `stats.p.chart` · Which has more · p · stats
2. `stats.p.sort` · Sorting and counting · p · stats
3. `stats.pile` · The means pile up · us · stats *(exists)*
4. `stats.se` · σ over root n · uni · stats *(exists)*
5. `stats.hypothesis` · A test that could fail · ls → us · hypothesis *(exists)*
6. `stats.ls.average` · Mean, median, mode · ls · stats
7. `stats.ls.chartlie` · Charts that mislead · ls · stats
8. `stats.us.spread` · More than an average · us · stats
9. `stats.us.correlation` · Together is not cause · us · hypothesis
10. `stats.uni.bayes` · Updating a belief · uni · hypothesis

### climate — mirrors TRB Weather and Climate (Earth & Space) + NASA Climate Kids
1. `cli.p.weather` · Weather today, climate always · p · seasons
2. `cli.p.water` · The water cycle · p · seasons
3. `cli.albedo` · Reflect more, cool down · ls · balance *(exists)*
4. `cli.seasons.tilt` · The tilt does it · ls · seasons *(exists)*
5. `cli.seasons.distance` · It is not the distance · us · seasons *(exists)*
6. `cli.warm` · Three degrees · us · balance *(exists)*
7. `cli.us.carbon` · The carbon cycle as boxes · us · balance
8. `cli.us.feedback` · Loops that amplify · us · balance
9. `cli.uni.forcing` · Radiative forcing, quantified · uni · balance
10. `cli.uni.attribute` · Attributing a change · uni · balance

### eng — mirrors TRB Science Lab Circuit Builder, Trebuchet, Trades
1. `eng.p.build` · A bridge that holds · p · materials
2. `eng.p.wheel` · Wheels and axles · p · materials
3. `eng.chord` · Where the load goes · us · eng *(exists)*
4. `eng.budget` · Strong and cheap at once · uni · eng *(exists)*
5. `eng.materials` · Choosing a material · p → us · materials *(exists)*
6. `eng.ls.circuit` · One bulb, two bulbs · ls · eng
7. `eng.ls.machine` · Levers and pulleys · ls · materials
8. `eng.us.truss` · Triangles carry load · us · eng
9. `eng.us.control` · On, off and proportional · us · eng
10. `eng.uni.fea` · Solving a structure · uni · eng

**Total after this pass: ~160 lessons.** That is the target. Ship in the phases of §7.

---

## 5. The lesson recipe

Every lesson is one object in `LESSONS` in `js/lessons.js`. Follow this shape exactly.

```js
{
  id: 'phy.us.ohm', world: 'physics', stage: 'us', instrument: 'push',
  /* start: the state the instrument opens in — MUST differ from its default,
     or the first beat changes nothing and the lesson looks broken. */
  start: { force: 2, mass: 1 },
  title: 'Voltage, current, resistance',
  beats: [
    /* 1. hook — a prediction or a puzzle, never a definition */
    { say: 'Two newtons or eight, on the same mass. Which pushes it further, and by how much?' },
    /* 2. do — the learner moves something; wait on an observable or the goal */
    { say: 'Make it travel nine metres.', until: { obs: 'distance', op: '>=', value: 9 },
      hint: 'Raise Force, or lower Mass.' },
    /* 3. name — the idea, after the experience */
    { say: 'Distance grows with force and shrinks with mass. That is one equation, not two facts.' },
    /* 4. check — a question that tests the idea, with a wrong answer that is tempting */
    { ask: 'Double the force on the same mass. The distance is…',
      options: ['the same', 'double', 'four times'], answer: 1 },
    /* 5. close — one sentence that connects it to another world */
    { say: 'The same equation is why a loaded lorry brakes later than a car.' }
  ]
}
```

Rules that experience has already settled:

- **`start` must not equal the instrument's default.** A lesson that opens at the default
  value appears to do nothing. Check the world's slider defaults before choosing.
- **Use `until` with an observable from the key map, or `{ goal: true }`.** Never invent a
  key; a missing key waits forever and only Skip saves the learner.
- **One idea per lesson.** Five beats, not fifteen. The palindromic shape above (hook, do,
  name, check, close) is the house style.
- **`ask` never advances on a wrong answer.** It marks the option and leaves the rest open.
- **`hint` is required on every `until` beat**, and it must name the control to move.
- **`hold`** is only for a beat with no interaction — a beat that shows something.

### The enrichment entry

Every lesson needs an `ENRICHMENT[lessonId]` in the same file:

```js
"phy.us.ohm": {
  "key":   "One sentence: the single thing this lesson makes true.",
  "why":   "Two or three sentences: the mechanism, not the procedure.",
  "mistake": "The specific wrong model a learner brings, named and corrected.",
  "worked": {
    "q": "A question with numbers or symbols.",
    "steps": ["Step one.", "Step two.", "Step three."],
    "a": "The answer, with units."
  },
  "sources": ["OpenStax University Physics", "CCSS 8.EE.C.7"],
  "prereqs": ["phy.us.newton2"]
}
```

`mistake` is the valuable field — take it from TeddyRookBook's `trouble` and rewrite it.
`sources` must name a real standard or textbook. Never leave it empty and never invent one.

---

## 6. Acceptance criteria

A lesson counts as done only when all of these hold. Check each by reading, not by
publishing — you cannot run the app.

1. **It appears.** `world` is one of the fourteen real ids, and the picker lists it under
   its stage. Ids are `astro`, `bio`, `stats`, `eng` — never the long names.
2. **The instrument exists.** `lesson.instrument` matches a `registerInstrument` id in that
   world, or is omitted.
3. **The opening state differs** from the world's slider defaults.
4. **Every `until` key is in the key map** in `AGENTS.md` §6.
5. **Every `set` key is a registered param** in that world.
6. **The goal is reachable** using only that world's controls, at that stage.
7. **`ENRICHMENT` exists** with all seven fields, and `prereqs` point at real lesson ids.
8. **The stage matches the content**: `p` needs no notation, `uni` needs a derivation.

---

## 7. Work order

Do these in order and finish each before starting the next.

### Phase 1 — coverage (the bulk)
Bring every world to **at least three lessons per stage**, using §4. This is authoring, not
engineering: one file, `js/lessons.js`, plus `ENRICHMENT`. Do one world per commit.
**Done when:** all fourteen worlds have ≥ 10 lessons and every stage is represented.

### Phase 2 — the dual-instrument gap
Every world has two instruments but most lessons use one. Author at least two lessons per
world on the secondary instrument (`blocks`, `shop`, `palette`, `tuning`, `moon`,
`genetics`, `hypothesis`, `seasons`, `compare`, `materials`, `search`, `pace`, `isotopes`,
`push`). **Done when:** every registered instrument has at least two lessons.

### Phase 3 — the mastery ladder (from TeddyRookBook)
Replace the single "held after 3 days" rule with TRB's review ladder: a topic is learned on
**three correct answers with the last two in a row**, and returns at **1, 3, 7, 16, 35, 75
and 150 days**. A checkpoint mixes topics every few lessons. Work in `js/profile.js` and the
rail-dot logic in `js/app.js`. **Done when:** a world shows four dot states — new, learning,
met, held — and the schedule is stored per lesson, not per world.

### Phase 4 — PhET's seven features
Implement the four missing ones from §3: touch targets, pan and zoom on canvas worlds,
optional sounds, and UI-string separation. **Done when:** every world can be driven by
keyboard alone, and the stage can be panned on a phone.

### Phase 5 — diagnostics
Replace the generic self-placement with **five authored items per world** — one `play`, one
`compute`, one `derive`, one `apply`, one misconception — as specified in `Curriculum.md`.
**Done when:** placement sets a per-world stage from real answers and shows its reasoning.

---

## 8. Attribution and licensing

- **TeddyRookBook:** take structure, sequence and topic names. Do **not** copy lesson text.
  Its lessons are CC BY-NC 4.0; its engine is MIT. Add `"TeddyRookBook curriculum, <course>"`
  to `sources` wherever a topic sequence came from it.
- **PhET:** a design and accessibility reference. Sims are CC BY; do not embed or copy their
  assets. Cite in `sources` when a lesson mirrors a sim.
- **OpenStax:** CC BY. Safe to draw problem framings from, with citation.
- **Never invent a standard code** (CCSS, NGSS, AP). If unsure, cite the textbook instead.

---

## 9. What not to do

- Do not add a fifteenth world. Deepen the fourteen.
- Do not add a dependency. The app is zero-build by design.
- Do not rewrite the lesson runner to make authoring easier; author to the runner.
- Do not copy a lesson's prose from any source, including TeddyRookBook.
- Do not mark a phase done without the acceptance criteria in §6 holding for **every**
  world in that phase.
