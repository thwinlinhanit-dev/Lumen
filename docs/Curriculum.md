# Curriculum — primary to university, and the adult on-ramp

The plan that turns fourteen working instruments into a ladder a learner can climb from
age five to a degree, without the app ever feeling like two different products.

Companion to `World-Specs.md` (what each world is) and `Design-Brainstorm-v2.md` (why the
ladder is built on lenses).

---

## 1. The two axes, and why they must stay separate

Almost every education app collapses these into one "grade" and then pays for it:

- **Stage** — the formal level of the material. Primary, lower secondary, upper secondary,
  university. This is about *what* is being taught and how formally.
- **Mode** — who is doing the learning. Child, adolescent, adult. This is about *tone,
  pacing, entry point and time budget*, and it is the same at every stage.

An adult learning primary arithmetic is not a child, and a twelve-year-old reading a
university-proof is not a fraud. Keep the axes apart and both become possible:

```
        P        LS        US        Uni
child   ●         ●         ●          ·
teen    ·         ●         ●          ●
adult   ●         ●         ●          ●     ← any cell, any week
```

The rule that follows: **stage is a property of the lesson, mode is a property of the
learner's session.** One profile holds both, and they are set independently.

### Why adults are not a fifth stage

An adult is not "beyond university". An adult is usually *starting somewhere in the middle
with no free time*, and brings three things a child does not: context to hang ideas on, a
low tolerance for being talked down to, and a high tolerance for abstraction — provided
you tell them why it matters within the first minute.

So adult **mode** changes five things and nothing else: session length, scaffolding
density, framing (problem first, story second, notation third), the number of new items
per session, and the entry point. It never changes the concept.

---

## 2. What changes with stage — the lens × stage matrix

Every concept carries five lenses (`play · story · notation · proof · apply`). Which
lenses exist is content; which are *shown* is stage.

| lens | Primary | Lower secondary | Upper secondary | University |
|---|---|---|---|---|
| play | the whole lesson | the hook | a demonstration | a sanity check |
| story | two sentences | one paragraph | why it was hard to discover | the historical argument |
| notation | none | symbols named, not manipulated | symbols manipulated | symbols defined rigorously |
| proof | none | "it always works because…" | reasoning shown | full derivation |
| apply | one real object | a household example | a worked problem | an open problem |

Two consequences worth designing around:

1. **The same node is reused four times.** That is the economics of this whole plan — you
   author one instrument and one story, then add notation, proof and application variants.
2. **A learner moving up a stage does not move to a new world.** They revisit the same
   world through a harder lens, which is what makes the app feel cumulative instead of
   endless.

---

## 3. Session design by stage

These numbers are the product. They set the authoring budget, the UI density, and whether
the app is used on a bus or at a desk.

| | Primary | Lower secondary | Upper secondary | University | Adult mode |
|---|---|---|---|---|---|
| session | 5–8 min | 12–18 min | 20–30 min | 35–60 min | 20–25 min |
| per week | 4× | 3–4× | 3× | self-directed | 3–4× |
| new ideas | 1 | 2–3 | 3–5 | 5–8 | 2–3 |
| reading | one sentence | 2–3 sentences | a paragraph | a page | a paragraph, dense |
| goals | one, very concrete | one | one or two | two or three | one, tied to a real task |
| autonomy | none — guided | choose the order | choose the depth | choose the question | choose the entry |
| feedback | instant, warm | instant, specific | specific, with the rule | terse, with the derivation | specific, adult |

Primary sessions are *shorter and warmer*, not slower in content. University sessions are
longer because the reading is longer, not because the instrument is harder.

---

## 4. Entry: placement, and the adult fast path

Nobody should have to start at the beginning of fourteen worlds.

### Placement

Per world, a **diagnostic of 8–12 items** that mixes a `play` task, a `compute` task and a
`derive` task. It returns a stage estimate *per strand*, not per world — most adults are
upper-secondary in number and primary in proof, and telling them so is the most honest
thing the app can do.

Placement is a hypothesis. The learner can move a stage up or down at any time, and the
app records the move rather than arguing with it.

### The adult fast path

A separate six-lesson sequence per world, authored deliberately as **the three hours that
would have changed your life if you had had them at eighteen**. It is not a summary of the
ladder; it is a different route through it, aimed at the highest-leverage ideas, in the
order an adult can actually use them.

Each is listed in §6 under its world. They are the cheapest content in this document and
probably the most commercially valuable, because they are the only thing here that a
full-time working adult will finish.

---

## 5. Progression mechanics

- **Mastery, not completion.** A node is "held" when the learner satisfies a goal at the
  current stage *after a delay of at least three days*. Immediate success is evidence of
  short-term memory, not learning.
- **The spiral.** Every node schedules a revisit at `depth + 1` when its stage moves up.
  This is the second dimension of spaced repetition and the mechanism that makes
  primary-to-university one product.
- **Interleaving.** The daily session mixes worlds. Retrieval across subjects is where the
  cross-links earn their place.
- **Gating.** Prerequisites gate *notation and proof* lenses, never `play`. A learner may
  always touch the instrument, at any stage, whether or not they have done the reading.
- **Stuck rule.** Three failures on one goal in a row and the app drops a lens, not a
  message. "Let's look at it a different way" beats "try again".

---

## 6. The ladder for every world

Format: strands; the four stages; the adult fast path; the instrument that serves each
stage; the capstone.

### Physics
**Strands.** motion and forces · waves and light · electricity and magnetism · heat and matter · the very small and the very large.
**Primary.** pushes and pulls · floating and sinking · light and shadow · sound and vibration · magnets · hot and cold · day and night.
**Lower secondary.** balanced and unbalanced forces · speed and distance–time graphs · gravity and weight · levers and pulleys · series and parallel circuits · reflection and refraction · pitch and loudness · density.
**Upper secondary.** Newton's laws in vectors · momentum and impulse · energy, work and power · Ohm and Kirchhoff · waves (λ, f, v), interference and diffraction · the electromagnetic spectrum · specific and latent heat · gas laws · simple harmonic motion.
**University.** Lagrangian and Hamiltonian mechanics · rotational dynamics and inertia tensors · Maxwell's equations · entropy and thermodynamic cycles · the Schrödinger equation in one dimension · statistical mechanics · special relativity · solid-state foundations.
**Adult fast path.** Energy, force, work — the four equations behind a car crash, a lift and a phone battery; then lenses, for the camera they already own.
**Instruments.** P: the interference field, played with. LS: the optics bench. US: orbit lab and circuit solver. Uni: the same integrators, with the maths exposed.
**Capstones.** P: predict whether it floats. LS: build a working circuit. US: measure a wavelength. Uni: mark the boundary where a model breaks.

### Maths
**Strands.** number · algebra · geometry and space · functions and change · data and chance · proof and logic.
**Primary.** place value · addition and subtraction as stories · shape recognition · fractions as sharing · measuring · repeating patterns · "how many more".
**Lower secondary.** fractions, decimals and percentages · ratio and proportion · negative numbers · one-unknown equations · linear graphs · area, perimeter and volume · angles and congruence · probability by counting.
**Upper secondary.** quadratics and factorising · functions and transformations · trigonometry · sequences and series · differentiation and integration · vectors · logarithms and exponentials · spread and correlation.
**University.** real analysis (limits, continuity, ε–δ) · linear algebra (spaces, eigenvalues) · multivariable calculus · differential equations · probability theory · abstract algebra · numerical methods.
**Adult fast path.** Percentages, ratio and the exponential — the three that appear in a payslip, a mortgage and a headline — then functions as "anything that predicts".
**Instruments.** P: shape and counting manipulables. LS: the linked-representation plotter. US: dynamic geometry and the calculus surface. Uni: the proof checker.
**Capstones.** P: share something fairly. LS: model a real price with a line. US: fit a curve and state where it fails. Uni: prove a claim the app cannot check.

### Chemistry
**Strands.** matter and particles · reactions and equations · bonding and structure · equilibrium and energy · how we know (analysis).
**Primary.** materials and their properties · mixing and separating · changing state · "made of tiny bits" · reactions that fizz.
**Lower secondary.** elements, compounds, mixtures · the periodic table · atoms and molecules · formulas and word equations · acids, alkalis and pH · combustion · the particle model.
**Upper secondary.** moles and stoichiometry · ionic and covalent bonding · periodicity · rates · reversible reactions and equilibrium · energetics · organic basics · electrolysis · titration.
**University.** molecular orbital theory · Gibbs free energy and thermodynamics · kinetics and mechanisms · IR, NMR and mass spectroscopy · transition metals · synthesis and stereochemistry · polymers.
**Adult fast path.** The table as a map of tendencies; why salt melts ice; what "chemical-free" means (nothing is); how to read a safety label.
**Instruments.** P: mixing and separating bench. LS: the periodic table as a field. US: equilibrium and titration solvers. Uni: spectra against real structures.
**Capstones.** P: separate a mixture. LS: identify an unknown by its reactions. US: run a titration and defend the precision. Uni: assign a spectrum.

### Art
**Strands.** mark and material · value and light · colour · form and composition · meaning and history.
**Primary.** mark-making · primary colours and mixing · drawing what you see versus what you know · simple forms.
**Lower secondary.** value and shading · proportion and the grid · one-point perspective · complementary and warm/cool colour · observational drawing.
**Upper secondary.** composition (thirds, leading lines, focal point) · two- and three-point perspective · figure and gesture · colour harmony · medium exploration · movements in context.
**University.** critique and analysis · conceptual practice · art history in depth · portfolio development · professional practice.
**Adult fast path.** The five-value study — the one exercise that visibly improves an adult's drawing in an evening — then colour temperature.
**Instruments.** P: mark-making. LS: the studio with guides. US: reference studies with critique. Uni: the analysis panel.
**Capstones.** P: draw what is in front of you. LS: a value study from life. US: a composed still life with a defended value structure. Uni: a body of work with a written rationale.

### Music
**Strands.** pulse and rhythm · pitch and melody · harmony · form and listening · performance.
**Primary.** steady beat · loud and soft, fast and slow · singing in tune · call and response.
**Lower secondary.** notation basics · intervals and scales · major and minor · I–IV–V–vi · rhythm reading · playing with others.
**Upper secondary.** functional harmony · cadences and modulation · counterpoint introduction · binary, ternary and sonata form · sight-reading · performance technique.
**University.** analysis and rhetoric · orchestration · counterpoint · twentieth-century techniques · ethnomusicology · composition portfolio.
**Adult fast path.** Learn a song you already love in eight bars; the theory arrives through the piece, not before it.
**Instruments.** P: rhythm games and singing. LS: the keyboard and chord palette. US: the practice engine with real scores. Uni: analysis and composition.
**Capstones.** P: keep a beat with others. LS: play a phrase cleanly at tempo. US: perform a real piece, scored. Uni: compose in a form you can defend.

### Earth
**Strands.** place and maps · people and data · history and borders · physical geography · the map as an argument.
**Primary.** where I live · land and water · continents and oceans · direction and simple maps.
**Lower secondary.** countries and capitals · latitude and longitude · climate zones · population basics · rivers and mountains.
**Upper secondary.** development indicators · migration · how borders were made · resources · urbanisation.
**University.** geopolitics · spatial statistics · critical cartography · political economy of development · GIS.
**Adult fast path.** "Why is that country like that?" — read one country through its geography, its history and a single number.
**Instruments.** P: the globe as a place. LS: the globe with dossiers. US: indicator series and the time slider. Uni: spatial analysis over the same data.
**Capstones.** P: find your place on the globe. LS: explain a country's climate. US: account for one development indicator. Uni: argue a spatial claim from data.

### Code
**Strands.** sequencing · data · algorithms · systems · theory.
**Primary.** sequence · loops · events · conditionals · "a bug is information".
**Lower secondary.** variables · functions · lists · debugging with the stepper · simple algorithms.
**Upper secondary.** data structures · recursion · complexity · searching and sorting · abstraction · version control.
**University.** automata and formal languages · computability · concurrency · numerical methods · machine learning foundations · compilers.
**Adult fast path.** Read code you did not write — the stepper as a reading tool — then the three data structures that cover most real work.
**Instruments.** P: blocks and flow. LS: the stepper. US: the sort race and complexity plot. Uni: automata and the interpreter.
**Capstones.** P: make something that repeats. LS: fix a program that half works. US: sort a real dataset and prove the cost. Uni: write an interpreter or a scheduler.

### Money
**Strands.** earning · spending · saving and compounding · risk and borrowing · systems and policy.
**Primary.** money buys things · saving for something · what things cost · needs and wants.
**Lower secondary.** percentages and discounts · budgets · wages and hours · unit price · bank accounts.
**Upper secondary.** compound interest · loans and interest · tax and payslips · credit · inflation · insurance basics.
**University.** present value, NPV and IRR · portfolio theory · risk and return · behavioural economics · financial systems.
**Adult fast path.** The five numbers that decide a financial life — savings rate, effective tax rate, real return, fee drag, and runway in months.
**Instruments.** P: a shop and a jar. LS: the budget. US: the lifespan timeline. Uni: the Monte Carlo simulator.
**Capstones.** P: save for something real. LS: plan a month. US: defend a household plan through a shock. Uni: price a risk.

### Language
**Strands.** listening · speaking · reading · writing · culture.
**Primary.** songs and rhymes · greetings · colours and numbers · simple instructions · sound to spelling.
**Lower secondary (A1–A2).** present, past and future · ~1,000 words · transactional dialogues · short texts.
**Upper secondary (B1–B2).** tense and mood · ~2,500 words · paragraph writing · authentic texts.
**University (C1–C2).** register and style · 5,000+ words · argumentation · literature · translation.
**Adult fast path.** The 300 most frequent words, the five verb forms, and the ten sounds your first language does not have.
**Instruments.** P: listening and echoing. LS: the sentence builder. US: graded reading with the practice engine. Uni: conversation with marginal correction.
**Capstones.** P: say who you are. LS: survive a shop. US: hold a five-minute conversation. Uni: argue a position in writing.

### Space
**Strands.** sky and time · the solar system · stars · galaxies and cosmology · spaceflight.
**Primary.** day and night · Moon shapes · stars are far suns · seasons.
**Lower secondary.** the solar system · eclipses · tides · the light-year · constellations.
**Upper secondary.** Kepler and gravitation · the H–R diagram · stellar life cycles · spectra · scale.
**University.** orbital mechanics · stellar structure · cosmology · exoplanets · general relativity.
**Adult fast path.** Why seasons are not about distance to the Sun, then the five numbers that size the universe.
**Instruments.** P: sky and Moon. LS: the orrery. US: the Kepler lab. Uni: the propagator with real elements.
**Capstones.** P: predict tonight's Moon. LS: place the planets to scale. US: measure a period and derive T² ∝ a³. Uni: plan a transfer.

### Biology
**Strands.** cells and molecules · inheritance · evolution · ecosystems · the body.
**Primary.** living and non-living · growth · animals and plants · food chains · the body's parts.
**Lower secondary.** cells, organs and systems · photosynthesis and respiration · food webs · simple inheritance · classification.
**Upper secondary.** DNA and protein synthesis · Mendelian and molecular genetics · natural selection's mechanism · homeostasis · population dynamics.
**University.** population genetics · developmental biology · molecular biology · ecological modelling · evolution of behaviour.
**Adult fast path.** How your body actually works — heart, lungs and blood sugar as one loop — then why antibiotics stop working.
**Instruments.** P: living things observed. LS: the selection lab. US: genetics with real structures. Uni: population models and phylogenies.
**Capstones.** P: grow something and record it. LS: trace a food chain. US: predict a trait from a cross. Uni: design and defend an experiment.

### Data
**Strands.** describing · collecting · uncertainty · inference · causation.
**Primary.** tally and chart · more and less · sorting · "how many".
**Lower secondary.** mean, median, mode, range · bar, pie and line graphs · simple probability · misleading charts.
**Upper secondary.** spread · sampling and bias · correlation versus causation · regression · significance.
**University.** estimation · testing theory · Bayesian inference · causal inference · experimental design.
**Adult fast path.** Read a news statistic in thirty seconds — base rate, sample, denominator, and what would change your mind.
**Instruments.** P: sorting and counting. LS: the chart builder. US: the sampling machine. Uni: inference and causal diagrams.
**Capstones.** P: answer a question with a chart. LS: spot the misleading chart. US: debunk a claim. Uni: design a study that could fail.

### Climate
**Strands.** weather · the energy budget · carbon · tectonics · deep time.
**Primary.** weather and seasons · the water cycle · rocks and soil.
**Lower secondary.** the greenhouse effect · climate zones · the rock cycle · plate tectonics · fossil fuels.
**Upper secondary.** energy balance · the carbon cycle · feedbacks · evidence and uncertainty · energy sources.
**University.** radiative forcing · climate sensitivity · carbon accounting · ice sheets · attribution methods.
**Adult fast path.** Weather versus climate in one demo, then what "3 °C" actually means in water and ice.
**Instruments.** P: weather and water. LS: the globe's climate overlays. US: the energy balance. Uni: the full model with feedbacks.
**Capstones.** P: record the weather for a week. LS: explain a climate zone. US: account for one forcing. Uni: attribute a change with stated confidence.

### Build
**Strands.** structures · machines · circuits · control · materials.
**Primary.** build and test · wheels and axles · bridges that hold · "why did it fall down".
**Lower secondary.** forces in structures · simple circuits · levers, gears and pulleys · energy.
**Upper secondary.** Ohm and Kirchhoff · statics · material properties · on/off and proportional control.
**University.** matrix structural analysis · control theory (PID, stability) · thermodynamics · systems design.
**Adult fast path.** How the things you own work — the four mechanisms behind almost every machine in a house.
**Instruments.** P: the bridge you can break. LS: circuits in series and parallel. US: the truss solver. Uni: control and stability.
**Capstones.** P: a bridge that holds a weight. LS: a lamp that dims. US: survive the load on a budget. Uni: design a stable controller.

---

## 7. Coverage and effort — the honest numbers

A real primary-to-university ladder in one subject is 300–600 hours of instruction. Across
fourteen subjects that is 5,000+ hours of *learner* time and roughly ten times that in
authoring. Nobody ships that, and pretending otherwise is how education products die.

So the plan is a **core ladder**, defined precisely:

| | lessons per world | minutes each | authoring each |
|---|---|---|---|
| Primary | 30 | 6 | 2 h (mostly instrument reuse) |
| Lower secondary | 30 | 15 | 3 h |
| Upper secondary | 40 | 22 | 4 h |
| University foundation | 20 | 40 | 6 h |
| Adult fast path | 6 | 24 | 3 h |
| **per world** | **126** | | **≈ 420 h** |

Fourteen worlds: **≈ 1,760 lessons and ≈ 5,800 authoring hours** — about three person-years
for content, on top of the engineering. That is the whole plan in one number, and it is
achievable over two to three years with a small team and good generators.

The full university depth is a further multiple of that, and should be added **only where
learners ask for it**. A speculative fourth year of a subject nobody reaches is the most
expensive content in the catalogue.

---

## 8. Sequencing — what to author, in what order

Ordered by value per authored hour, not by subject prestige.

1. **The stage framework** (one sprint). Stage and mode on the profile, per-strand
   placement, the lens gating rule, the stuck rule. Nothing below can be authored cleanly
   until this exists.
2. **Six adult fast paths** — Maths, Money, Data, Code, Physics, Biology. The adult on-ramp
   is the commercial wedge: it is cheap, it finishes, and it is what makes a stranger
   recommend the app.
3. **The Primary shelf** — all fourteen worlds, 30 lessons each. Bright, short, low
   reading, and it is what makes the app safe to hand to a child. Instruments already
   exist for most of it.
4. **Two complete ladders** — Maths and Money. Chosen because both are heavily generatable:
   the simulation is its own answer key, so parametric problems cover most of the practice.
   These two prove the ladder before you author twelve more.
5. **Lower secondary across the rest** — the 11–14 shelf is the largest market and the
   place where thirteen of the fourteen instruments are already at their best.
6. **Upper secondary across the rest**, starting with the exam-heavy subjects where the
   demand is provable.
7. **University foundations**, only in the three worlds learners actually reach.

### What to cut

- The **university band in nine of the fourteen worlds** until demand exists.
- **Proof lenses** below upper secondary, entirely.
- **Every world's exotic strands**: relativistic astrophysics, art since 1970, consciousness.
- **A fifth stage.** There is no "postgraduate". The ceiling is a defended first year.

---

## 9. What "university" means here, and what it does not

Say it plainly, in the app and in the marketing: **university means a defended first year
of a degree**, across ~20 lessons per world. That is a real, valuable, honest ceiling —
first-year material is where most adults have gaps and where the instrument approach pays
off most.

It is not a degree. It will not replace a lab, a seminar, a tutor or three thousand pages of
reading, and any product claiming otherwise is lying to its users.

---

## 10. Open questions

1. **Do stages share one probation?** If a learner is primary in maths and university in
   music, what does the home screen show? My answer: the daily session mixes by *strand*,
   not by world, and shows the stage on each card rather than in a global setting.
2. **How is "held" defined for a `play`-only learner?** A five-year-old cannot return in
   three days to a spaced test. Answer: for primary, "held" means success on a *new*
   example of the same node, in the same session, in a different context.
3. **Does the adult fast path stay separate forever?** It should fold into the ladder once
   the ladder is complete — as a marked route through existing nodes, not a parallel shelf.
4. **Who authors?** The plan above assumes one curriculum lead plus subject advisors per
   world, and a generator for the derivable practice. Without the generator the numbers
   triple.
5. **Which stage do you test first?** My answer: lower secondary. It is the largest, most
   competitive and most measurable shelf, and it is where the instruments already shine.
