# World Specs

The build specification for every world in Lumen, written against one contract so that
fourteen worlds can share a single shell, one lesson format and one content graph.

Read this with `Design-Brainstorm.md` (the architecture) and `Design-Brainstorm-v2.md`
(the axis, the lens model, and the six-point bar). This document is the part a builder
actually works from.

---

## How to read a spec

Every world is written to the same template:

- **One idea** — the single sentence the world must make true for the learner.
- **Instrument** — the thing you manipulate. If this is weak, the world fails.
- **Observables** — the exact numbers the shell can see, which is what makes assessment
  possible. Named `domain.metric`, SI units, with a stated direction.
- **Parameters** — what a lesson or a learner can drive.
- **Ladder** — the same node at four stages, through lenses rather than different content.
- **Data and sources** — where the real anchoring comes from, and its licence.
- **Cross-links** — the same pattern in another room. Each world must have two.
- **Capstone** — one project that is hard to fake.
- **Out of scope** — what to refuse, in writing, before anyone asks for it.
- **Build** — effort, and the one thing most likely to go wrong.

---

## The contract

A world is a module that mounts into the stage and the coach, and declares:

```
mount(stage, coach, api) -> cleanup
params      named, ranged, unit-bearing, animatable
observables named, unit-bearing, readable every frame
goal        a predicate over observables (never a quiz)
snapshot    serialisable state -> permalink, notebook, lesson start
dataset     optional read-only named data another world may request
lens        which of play | story | notation | proof | apply it can expose
```

Two rules that keep this honest at fourteen worlds:

1. **A goal is a predicate over observables, not a question.** "Until
   `orbit.eccentricity < 0.05` for three seconds" is a goal. "Which planet is that?" is a
   quiz, and quizzes belong inside a goal, not instead of one.
2. **A world never imports another world.** It requests a dataset or it links through the
   content graph. Anything else becomes a mesh and the mesh becomes unmaintainable.

### Observable conventions

- `domain.metric` — `optics.fringeCount`, `orbit.eccentricity`, `speech.phonemeScore`.
- SI units in the spec; the UI may format them.
- Every observable states whether higher is "better" (`↑`), "worse" (`↓`), or neither.
- Anything a goal can depend on must be **stable at rest** — jitter makes goals flaky.

---

## The six-point bar

A world ships only when it clears all six. This is the definition of "complete" that
replaces "all completed features".

1. An instrument — manipulable, not a video with a quiz.
2. A ladder — six concepts available at all four stages via lenses.
3. Observable goals — assessment by doing.
4. Real anchorage — every abstraction tied to a real object or dataset.
5. A capstone — one project that is hard to fake.
6. Two cross-links — through the content graph.

---

## Standing rules across every world

- **No advice, no diagnosis.** Financial literacy is arithmetic on the learner's own
  numbers. Biology ships no clinical content. Neither ever recommends a product.
- **Licence discipline.** Every dataset carries its licence and an "as of" date in the
  content bundle, and the app surfaces the date wherever a number is shown.
- **Uncertainty is content.** Where a dataset has error bars, the world shows them.
- **Accessibility.** Keyboard, screen reader and large-target paths for every instrument,
  designed in from the first commit, not retrofitted.

---

## The set

**Shipped as mockups (6):** Physics · Maths · Chemistry · Art · Music · Earth.
**Committed next (3):** Computer Science · Financial Literacy · Language.
**Ranked (5):** Astronomy · Biology · Statistics · Climate & Earth Science · Engineering.
**Deferred (6):** Economics · History · Philosophy & Logic · Literature & Writing ·
Cooking · Robotics.

---

# Shipped as mockups

Each of these exists in the app today in reduced form. The spec states the as-built state
and what the full world needs, so the gap is visible in one place.

## Physics

**One idea.** The universe is a small number of rules applied relentlessly, and you can
watch them run.

**As built.** A live double-slit: two point sources, an analytically solved wave field
animated in time, a screen with an intensity profile, and fringes counted from where the
waves actually meet. Wavelength 380–750 nm changes the light's real colour; separation
3–18 µm; a time control freezes or accelerates the field.

**Instrument.** The wave field itself. Everything else is annotation on it.

**Observables.**
`optics.fringeCount` (count, neither) · `optics.fringeWidth` (m, neither) ·
`optics.slitSeparation` (m, neither) · `optics.wavelength` (m, neither).

**Full world adds.** Orbit lab (Kepler, eccentricity, T² ∝ a³ verified numerically) ·
optics bench (lenses, prisms, total internal reflection — 2D ray tracer) · circuit lab
(nodal analysis linear solve, shared with Engineering) · thermodynamics (particle box,
Maxwell–Boltzmann) · relativity and quantum as *demos with real numbers*, not maths.

**Ladder.** Primary: light and shadow, pushes and pulls, magnets. Lower secondary: forces,
energy, circuits, waves. Upper secondary: Newton's laws in vectors, Ohm/Kirchhoff, wave
optics. University: Lagrange/Hamiltonian framing, thermodynamics, quantum well models.

**Data and sources.** PhET (CC BY, attribution) as a design reference, never as a runtime
dependency. NIST constants. All simulation is computed, not fetched.

**Cross-links.** Maths — the wave is the same sine; the interference pattern is the same
Fourier idea. Chemistry — spectra and orbitals. Astronomy — gravity is one rule in both.
Music — frequency, beats, consonance.

**Capstone.** *Build the experiment.* Given a question ("what is the wavelength of this
unknown LED?"), assemble an apparatus from available parts, take the measurement in the
simulation, and defend the uncertainty.

**Out of scope.** A general physics engine. Fluid dynamics. Anything needing an SCF loop.

**Build.** Low for what exists; **medium** for the full set. Main risk: writing your own
rigid-body engine instead of using Rapier.

---

## Maths

**One idea.** Symbols are a compressed description of something you can already see.

**As built.** Linked representations for `y = a·sin(bx + c) + d`: four sliders, live
equation and period, amplitude guides, zero crossings, optional derivative, drag-to-read
exact coordinates.

**Instrument.** The curve, with its symbolic twin always visible beside it.

**Observables.**
`func.amplitude` (neither) · `func.period` (neither) · `func.range` (neither) ·
`func.maxSlope` (neither).

**Full world adds.** Algebra with **step-level diagnosis** (AST rewrite rules, named
misconceptions — `distributed-over-product-wrongly`, `sign-error-on-transposition`) ·
dynamic geometry with constraint propagation · linear algebra as transformation (matrix
moves space) · 3D surfaces and calculus visualisation · Monte Carlo and probability
simulators, exported as a dataset other worlds use · proof lens with a real checker at
university level.

**Ladder.** Primary: pattern, shape, counting, "which is more". Lower secondary: fractions,
ratio, linear relations, area. Upper secondary: functions, trigonometry, probability,
calculus intuition. University: analysis, linear algebra, discrete maths, proofs.

**Data and sources.** OEIS for integer sequences (free with citation) · Lean `mathlib`
(Apache 2.0) if the proof lens becomes real · hand-built generators where the simulation
is its own answer key.

**Cross-links.** Physics — the same sine, the same derivative. Statistics — distributions
come from here. Engineering — the truss solver *is* a linear system. Finance — compounding
is an exponential.

**Capstone.** *Model something real.* Take a phenomenon, choose a function, fit it, and
state where the model fails.

**Out of scope.** A general CAS. You need differentiate, simplify, solve numerically,
check equivalence — nothing more.

**Build.** Low for what exists; **high** for step-level diagnosis. Main risk: building a
symbolic engine when rewrite rules and AST equivalence would do.

---

## Chemistry

**One idea.** The periodic table is a map of tendencies, and the diagonals are the story.

**As built.** All 118 elements with masses and Pauling electronegativities. Recolour the
table by family, electronegativity or mass; tap any element for a card with a property
trend chart. Goal: find the strongest electron-puller.

**Instrument.** The table as a manipulable field — colour it by one property and the
structure of chemistry appears.

**Observables.**
`chem.selectedZ` (neither) · `chem.electronegativity` (neither) ·
`chem.elementsExplored` (↑) · `chem.family` (neither).

**Full world adds.** Molecules from real structures (PubChem, PDB) with 3D rotation ·
orbitals as analytic spherical harmonics · stoichiometry and balancing (algorithmic and
exact) · equilibrium and titration solved numerically (mass action + Newton) · reaction
mechanisms hand-authored, never generated · spectra, which is where the physics and
astronomy cross-links live.

**Ladder.** Primary: materials, mixing, "what is it made of". Lower secondary: atoms,
elements, compounds, reactions. Upper secondary: moles, bonding, equilibrium, organic
basics. University: thermodynamics, kinetics, spectroscopy, quantum chemistry *described*.

**Data and sources.** PubChem (PUG-REST and bulk) · PDB · Crystallography Open Database ·
NIST Chemistry WebBook · OpenStax Chemistry (CC BY).

**Cross-links.** Physics — spectra, orbitals, thermodynamics. Earth — minerals, ores, and
where elements come from (nucleosynthesis). Art — pigments. Biology — biochemistry.

**Capstone.** *Identify the unknown.* Given spectra, mass and reactivity, name the substance
and justify it.

**Out of scope.** Quantum chemistry (DFT). Reaction prediction from scratch.

**Build.** Low for the table; **high** for equilibrium and mechanisms work. Main risk:
generating structures or mechanisms instead of curating real ones.

---

## Art

**One idea.** The studio that looks back — a computer can see your drawing and tell you
something true about it.

**As built.** A stamp-based brush on canvas, an eight-colour palette, perspective guides
with a vanishing point, a master-study line overlay to paint against, and a live
five-band value histogram that scores your canvas as you work.

**Instrument.** The canvas — and the critique panel beside it, which is the actual product.

**Observables.**
`art.distinctValues` (0–5, ↑) · `art.coverage` (%, neither) · `art.strokes` (count, neither)
· `art.valueEntropy` (↑, planned).

**Full world adds.** Silhouette and proportion comparison against a reference · edge-quality
and "muddy colour" detection · colour-harmony analysis · 1/2/3-point perspective checking ·
real master studies from open collections with attribution · a lessons ladder from mark-making
to composition.

**Ladder.** Primary: mark-making, colour mixing, shape. Lower secondary: value, proportion,
perspective basics. Upper secondary: composition, colour theory, art history in context.
University: critique vocabulary, historical analysis, practice-led projects.

**Data and sources.** Met Open Access (CC0) · Rijksmuseum (CC0) · Smithsonian Open Access
(CC0) · Art Institute of Chicago (CC0). Attribution shown on every image.

**Cross-links.** Earth — where and when a movement happened on the timeline. Chemistry —
pigments and binders. Maths — perspective is projective geometry.

**Capstone.** *A study from life, critiqued.* Paint a set-up, then defend your value
structure against the analysis.

**Out of scope.** Filters, AI image generation, brush marketplaces, clone-stamp tools.

**Build.** Low–medium. Main risk: scope creep toward Photoshop. The critique panel is the
product; the paint tools only need to be credible.

---

## Music

**One idea.** Theory you can hear, and a phrase you can actually play.

**As built.** A two-octave keyboard with real Web Audio voices, I–IV–V–vi chords shown as
roman numerals, a live waveform, and a practice mode that lights the next key, scores the
phrase and marks the target key.

**Instrument.** The keyboard plus the chord palette — theory as something you press.

**Observables.**
`music.notesPlayed` (count, ↑) · `music.lastNote` (neither) · `music.phraseProgress` (0–1, ↑)
· `music.timingError` (ms, ↓, planned) · `music.pitchError` (cents, ↓, planned).

**Full world adds.** *Practice engine*: real scores (MusicXML) with wait-for-you mode,
per-note timing and pitch scoring, loop-the-hard-bar, slow-down without pitch shift ·
**microphone pitch detection** (YIN/MPM) so a phone on the piano coaches the learner ·
theory sandbox with voice leading you can hear · a small sequencer (8–16 tracks, one good
sampled piano) — enough to compose eight bars, not to master an album.

**Ladder.** Primary: pulse, rhythm games, singing in tune. Lower secondary: notation,
intervals, scales, chords I–V–vi–IV. Upper secondary: harmony and function, sight-reading,
performance. University: form and analysis, counterpoint, orchestration.

**Data and sources.** MuseScore/OpenScore and Mutopia for MusicXML · IMSLP public-domain
scores (**check per-item performance restrictions**) · Salamander Grand Piano samples
(CC BY) · system TTS is not used for singing.

**Cross-links.** Physics — frequency, beats, harmonic series. Maths — ratios, the sine.
Language — prosody and rhythm of speech. Earth — where a form came from.

**Capstone.** *Learn and perform.* Pick a real piece, get a scored run at tempo, record it.

**Out of scope.** A full DAW, plugin hosting, mixing consoles, a synth zoo.

**Build.** Low for what exists; **high** for the practice engine. Main risk: webview audio
latency on iOS. Spike it before committing; if it cannot reach instrument feel, the music
world is the one justified native module.

---

## Earth

**One idea.** Every place is a stack of time, and one timeline control scrubs all of it.

**As built.** A real orthographic globe from Natural Earth 110m geometry, drag to spin,
scroll to zoom, hover to identify, tap for a country dossier, and a 1780–2020 timeline that
filters the dossier's dated events.

**Instrument.** The globe plus the time slider — the same slider that will later drive
climate, music history and a painting's restoration.

**Observables.**
`earth.selectedCountry` (neither) · `earth.year` (neither) · `earth.eventsInView` (count,
neither) · `earth.countriesOpened` (↑).

**Full world adds.** Historical borders (CShapes 2.0, OpenHistoricalMap) morphing as you
scrub · indicator time series per country (population, income, health, energy) from World
Bank and OWID, charted in place · climate overlays (this is the Climate world's dashboard) ·
a "then vs now" imagery slider · event pins from Wikidata with a human curation pass.

**Ladder.** Primary: continents, oceans, where I live, day and night. Lower secondary:
countries, capitals, landforms, basic data. Upper secondary: development indicators,
migration, borders and their history. University: geopolitics, spatial statistics, the
politics of the map itself.

**Data and sources.** Natural Earth (public domain) · CShapes 2.0 · OpenHistoricalMap (ODbL)
· World Bank WDI (CC BY) · Our World in Data (CC BY) · Wikidata (CC0) · USGS.

**Cross-links.** Climate — the planet, not just the polities. History — the same timeline.
Finance — development indicators. Biology — biomes.

**Capstone.** *Explain a place.* Choose a country and account for one number about it —
income, life expectancy, forest cover — using its geography, history and neighbours.

**Out of scope.** Live feeds instead of versioned dataset releases. Any editorial line on
contested borders: pick a documented border policy and show it.

**Build.** Medium — the renderer exists, the data pipeline is the work. Main risk:
underestimating curation. History needs an editor, not just a pipeline.

---

# Committed next

## Computer Science

**One idea.** See computation happen — stop memorising syntax and watch the machine.

**Instrument.** **The stepper.** Source, call stack and heap side by side, with breakpoints,
step-over, step-into, bounded rewind, and a watch expression. The stepper asks for the next
value *before* revealing it. That one interaction is worth more than a hundred exercises.

**Observables.**
`code.line` (neither) · `code.steps` (count, ↓ for a fixed task) · `runtime.comparisons`
(count, ↓) · `runtime.swaps` (count, ↓) · `runtime.stackDepth` (neither) ·
`memory.heapCells` (count, neither) · `graph.visited` (count, neither) ·
`sort.correctness` (0–1, ↑) · `algo.timeComplexityFit` (exponent, neither).

**Parameters.** Input size, algorithm choice, data distribution, breakpoints, speed.

**Three tiers.**
1. **Blocks / flow** (primary): actions that visibly run — sprites, sensors, loops,
   conditionals, wireable badly so failure is real.
2. **Lumen script** (secondary): a small real language with functions, lists, dicts and
   closures, implemented **in-app as an AST interpreter** so stepping is exact and instant.
   Control beats generality here, and it keeps the download small.
3. **Real Python** (upper secondary and university): Pyodide, lazily loaded, stepped via
   `sys.settrace`. Authentic and heavy; load only when a real-Python lesson opens.

**Data structures as instruments.** Sort race with live comparison counters, then **plot
those counters on the maths world's axes** — complexity becomes a curve the learner
measured. Linked lists with draggable nodes. BST, hash tables with visible collisions.
**Dijkstra and A\* running on the real Earth globe** — real cities, real distances, stepped.
Recursion as a growing and collapsing tower.

**Systems.** NAND gates to an ALU · text to bits to compression, on the learner's own
sentence · packets that queue and drop · a race-condition lab you can reliably trigger ·
automata and regex drawn as state machines · Caesar to Vigenère to RSA with small primes.

**Ladder.** Primary: sequence, repetition, choice, events. Lower secondary: variables,
functions, lists, debugging. Upper secondary: data structures, recursion, complexity,
algorithms. University: automata, computability, concurrency, numerical methods, ML.

**Data and sources.** CS Unplugged (CC BY-SA) for unplugged framing · official language
documentation · Scratch design patterns. No shipped dataset; the world computes.

**Cross-links.** Maths — the complexity curve, and sorting is ordering. Earth — graph search
on real geography. Finance — Monte Carlo from the same code. Language — state machines and
grammar.

**Capstone.** *Build something that sorts a real dataset correctly, and prove its cost.*

**Out of scope.** A full IDE, a web-framework course, an interview-grind question bank, a
twelve-language switcher.

**Build.** **High.** Main risk: the stepper feels great on toy code and collapses on real
programs. Test it against a 200-line program early.

---

## Financial Literacy

**One idea.** Money is a time machine — everything is a cash-flow timeline plus compounding,
and you can scrub it.

**Instrument.** **The lifespan timeline.** Age on the x-axis, real and nominal value on the
y-axis, with every mechanism (interest, inflation, tax, fees, shocks) as a layer you toggle.

**Observables.**
`money.balance` (none, neither) · `money.realValue` (none at today's prices, ↑) ·
`loan.interestPaid` (none, ↓) · `loan.monthsToClear` (months, ↓) · `tax.marginalRate` (%
neither) · `tax.effectiveRate` (% neither) · `save.runwayMonths` (months, ↑) ·
`invest.feeDrag` (none, ↓) · `sim.survivedYears` (years, ↑) · `sim.p10` / `sim.p90`
(none, neither).

**Parameters.** Age, income, savings rate, rate of return, inflation assumption, country,
loan terms, shock events.

**Instruments.**
Compound and inflation on one axis, with the **1% fee over 40 years** demo as the single most
persuasive number in the world · real month-by-month amortisation, not just the closed form ·
progressive tax brackets per jurisdiction, so marginal versus effective rate becomes an
"aha" · a budget with shocks, because "what if" is the actual skill · investing as
**risk, not as picks** (distributions, volatility drag, sequence-of-returns risk as Monte
Carlo runs of a whole working life, reusing the maths world's engine) · probability literacy:
expected value, insurance as risk transfer, base rates, the gambler's fallacy.

**Ladder.** Primary: pocket money, saving toward a thing, unit price. Lower secondary:
percentages, discounts, budgets, wages and hours. Upper secondary: compound interest, loans,
tax, payslips, credit. University: present value, NPV and IRR, portfolio variance, insurance
pricing, behavioural traps.

**Data and sources.** World Bank and OWID CPI series (CC BY) · tax bands per country as a
versioned dataset with dates (curated, cited, "as of") · FRED for rate history · the
OECD/INFE financial competence framework as the curriculum's spine · CFPB and Investor.gov
for neutral consumer framing.

**Cross-links.** Maths — the exponential curve, and the Monte Carlo engine. Earth — national
development indicators. Chemistry — *nothing*, and that is fine; not every world needs a
science link. Statistics — sampling and uncertainty.

**The rule that shapes everything.**
> Every screen shows arithmetic on numbers the learner entered. No product recommendations,
> no specific securities, no "you should".

**Capstone.** *Design a life you can afford.* Thirty simulated years, shocks included,
scored on whether the household survives — with every mechanism visible and no advice given.

**Out of scope.** Product advice, securities, crypto price feeds, credit-score simulation
tied to a bureau.

**Build.** Medium. Main risk: drifting from arithmetic into advice, which is both the legal
and the reputational cliff.

---

## Language

**One idea.** Learn the language through a world worth understanding, and be told when your
*mouth* is wrong.

**Instrument.** Three, in priority order:

1. **Pronunciation lab.** Record, then score **per phoneme**, not per word. Ship the tractable
   version first: minimal-pair drills (ship/sheep, l/r, tones) scored by a lightweight
   contrastive classifier. Then forced alignment against the expected phoneme sequence, so
   the feedback is "your third syllable" rather than "83%".
2. **Sentence builder.** Drag words, see the pattern, hear it. Pattern induction before
   declension tables — grammar as something you manipulate.
3. **Graded reading with tap-to-define**, built by rewriting nodes the app already owns.

**Observables.**
`speech.phonemeScore` (0–1, ↑) · `speech.wordScore` (0–1, ↑) · `vocab.known` (count, ↑) ·
`vocab.retention` (0–1, ↑) · `reading.wpm` (words/min, ↑) · `reading.comprehension` (0–1, ↑)
· `grammar.accuracy` (0–1, ↑) · `conv.turns` (count, ↑) · `conv.corrections` (count, ↓).

**Parameters.** Target language, CEFR level, daily new items, speech threshold, topic domain.

**Machinery.** FSRS for vocabulary and structures — the app's existing scheduler, no new
system · system TTS for listening (free, every language, good enough — never train voices) ·
ASR plus phoneme scoring for speech · an LLM conversation partner with a **constrained
correction channel**: corrections in the margin, never interrupting the flow, transcripts
into the notebook · a real tokenizer/segmenter for CJK, with stroke-order-validated
handwriting and frequency-ordered character introduction.

**Ladder.** Not primary-to-university but **CEFR A1–C2**, mapped onto the same five lenses.
A1 play — repeat what you hear. A2 story — survive a transaction. B1 notation — the grammar
becomes visible. B2 apply — real texts. C1/C2 proof — register, style, ambiguity.

**Data and sources.** Tatoeba (CC BY 2.0) for sentence pairs · Wiktionary (CC BY-SA) for
definitions · Mozilla Common Voice (CC0) for pronunciation data · Universal Dependencies for
grammar treebanks · Unicode CLDR for locale conventions.

**Cross-links.** Earth — the dossier in your target language at your level. Music — song
lyrics through the practice engine. History — reading the period in its own words.

**Capstone.** *Hold a conversation about something you learned in another world* — ten
minutes, unscripted, with the transcript and the corrections in the notebook.

**Out of scope.** Twelve languages at A1. A complete language app is a company; this is not
one. One well-served language to C1/C2, plus one underserved language served at all.

**Build.** **Very high.** Main risk: treating it as a feature of the app rather than a
product with its own roadmap. Budget it accordingly, and choose the language before writing
any code.

---


# Ranked

These five are the next to build, in this order. Astronomy first because it is mostly
already written (the physics integrator), Statistics second because it is the cheapest
world to make genuinely useful, and Engineering last because it is the one that most
tempts you into building a game instead of a simulator.

## Astronomy

**One idea.** You are standing on a small rock inside a very large machine, and its moving
parts are predictable.

**Instrument.** **The orrery you scrub.** Time on a slider, bodies on real orbital elements,
and the scale toggle that stops lying to you ("if Earth were a marble, the Moon is here").

**Observables.**
`orbit.eccentricity` (neither) · `orbit.semiMajor` (m, neither) · `orbit.period` (s, neither)
· `orbit.visViva` (m/s, neither) · `sky.visibleBodies` (count, neither) ·
`sky.altitude` (degrees, neither) · `mission.deltaV` (m/s, ↓) · `mission.arrived` (bool, ↑) ·
`scale.ratio` (neither).

**Parameters.** Time and rate · observer latitude and longitude · body mass, position and
velocity · magnitude limit · scale mode (true / compressed).

**Instruments.**
1. **Kepler lab.** Set a velocity, watch the ellipse change. Semi-major axis, eccentricity
   and period are read live, and the learner verifies **T² ∝ a³** numerically rather than
   being told it.
2. **Sky simulator.** Your latitude, longitude and date → what is actually above you: planets,
   the Moon's phase, the brighter stars, the Milky Way's band. Drag the horizon, spin the
   night, watch a planet retrograde.
3. **Scale truth mode.** The single most effective astronomy lesson ever made: distance at
   true scale, on a real screen, with a scroll that never seems to end.
4. **Mission planner.** Pick a target, budget Δv, choose a transfer and a launch window, and
   find out whether you arrive. Uses the same propagator as everything else.
5. **Spectra.** Absorption lines from a real stellar spectrum matched to the chemistry
   world's elements — the bridge that makes "we know what stars are made of" believable.

**Ladder.** Primary: day and night, Moon phases, stars as far-away suns. Lower secondary:
the solar system, seasons, tides, light-years. Upper secondary: Kepler's laws, Newtonian
gravitation, the H–R diagram, stellar life cycles. University: orbital mechanics and
conics, three-body behaviour, stellar structure, redshift and cosmology.

**Data and sources.** JPL Horizons ephemerides (public domain) for positions · Gaia DR3
(free, acknowledgement) · HYG star database (CC BY-SA) for the sky · NASA Exoplanet
Archive (public) · IAU constellation boundaries (free) · NASA and ESA imagery (public
domain / ESA CC BY-SA 3.0 IGO — check per image).

**Cross-links.** Physics — the same gravity, the same optics. Maths — conic sections and
eccentricity. Chemistry — spectra identify composition. Earth — seasons and day length from
the same geometry. History — calendars, navigation, and what people believed.

**Capstone.** *Plan a mission.* Budget the Δv, find the window, arrive, and explain the
error bars.

**Out of scope.** Precision N-body. Relativistic astrophysics beyond a demonstration with
real numbers. Live telescope control.

**Build.** **Medium.** Main risk: implying precision you do not have. Use real orbital
elements, and state the approximation level on screen.

---

## Biology

**One idea.** Life is a set of loops that maintain themselves against decay — and you can
watch a population change shape over generations.

**Instrument.** **The natural-selection lab.** A population with a heritable trait, an
environment you can perturb, and a distribution that visibly moves generation by generation
while the allele frequencies shift beside it.

**Observables.**
`evo.generation` (count, neither) · `evo.traitMean` (neither) · `evo.traitSd` (neither) ·
`evo.alleleFrequency` (0–1, neither) · `eco.population` (count, neither) ·
`eco.carryingCapacity` (count, neither) · `eco.extinctions` (count, ↓) ·
`genome.mutations` (count, neither) · `homeostasis.heartRate` (bpm, neither).

**Parameters.** Mutation rate, selection pressure, population size, environment variable
(temperature, food, predator), generations per second.

**Instruments.**
1. **Selection and drift.** Same lab, two regimes: strong selection versus pure drift in a
   small population. Learners see *both* and stop conflating them — the single most common
   misunderstanding in the subject.
2. **Ecosystem builder.** Species with traits, energy flow and a carrying capacity you can
   exceed. Over-shoot, collapse, recover — with the graph in front of you.
3. **Gene → protein → trait.** Real structures from the PDB, rotatable, tied to a written
   sequence and to a visible trait.
4. **Phylogeny from real data.** A tree built from actual sequences, rotatable and
   collapsible, with branch lengths in time.
5. **Body systems.** Heart, lungs and circulation as coupled parameters — set a heart rate,
   watch oxygen delivery and the feedback that restores it.

**Ladder.** Primary: living things, growth, food chains, what animals need. Lower secondary:
cells, organs, inheritance, ecosystems. Upper secondary: Mendelian and molecular genetics,
natural selection's mechanism, homeostasis. University: population genetics, Hardy–Weinberg,
phylogenetics, molecular biology, developmental biology.

**Data and sources.** NCBI Taxonomy · GBIF for occurrences (licences vary per record) ·
UniProt (CC BY 4.0) · RCSB PDB (CC0) · OpenStax Biology (CC BY) · iNaturalist (per-observation
licence, must be carried through).

**Cross-links.** Chemistry — macromolecules and enzymes. Physics — diffusion, energy, scale.
Statistics — sampling and distributions, which is exactly what population genetics is.
Maths — logistic growth is the same exponential's sibling. Earth and Climate — biomes and
shifting ranges.

**Capstone.** *Design an experiment.* State a hypothesis, choose a sample, run it in the
simulation, and defend why the sampling is not a lie.

**Out of scope.** No medical, clinical, diagnostic or dosing content, ever. No health advice.

**Build.** **High** — the largest content load of any world. Main risk: biology drifts into
memorisation. Every fact must arrive attached to a mechanism you can manipulate, or it
belongs in the graph rather than in the world.

---

## Statistics

**One idea.** A number is an argument, and you can learn to check it.

This should be its own world, not a chapter of maths. It is the skill behind the financial
world's risk lessons, the CS world's machine learning, the climate world's error bars, and
almost every claim a learner will meet in public life.

**Instrument.** **The sampling machine.** Draw samples from a real dataset, watch the
sampling distribution accumulate in front of you, and see the central limit theorem arrive
as a fact rather than a formula.

**Observables.**
`sample.n` (count, neither) · `sample.mean` (neither) · `sample.sd` (neither) ·
`infer.pValue` (0–1, neither) · `infer.falsePositives` (count, ↓) ·
`fit.r2` (0–1, ↑) · `fit.rmse` (↓) · `fit.overfitGap` (train minus test error, ↓) ·
`bayes.posterior` (0–1, neither).

**Parameters.** Sample size, number of tests, noise level, model complexity, prior, dataset
choice.

**Instruments.**
1. **p-hacking lab.** Run twenty null tests and count the false positives. Nothing else
   teaches significance this quickly, and it inoculates the learner for life.
2. **Regression playground.** Drag points, watch the line, the residuals and R²; add terms
   and watch it overfit; split into train and test and see the gap open.
3. **The Bayes box.** Natural frequency trees beat formulae: 1,000 people, a disease, a
   test — and the posterior becomes obvious.
4. **Distribution zoo.** Shape parameters on histograms and densities, side by side.
5. **Chart builder plus a misleading-chart gallery.** Real charts, deliberately bad, with
   the fix one tap away.

**Ladder.** Primary: charts, "which is more", fair shares. Lower secondary: mean, median,
mode, range, simple probability. Upper secondary: spread, sampling, regression, significance,
bias. University: estimation, hypothesis-testing theory, Bayesian inference, causal inference.

**Data and sources.** Our World in Data (CC BY) · Gapminder (CC BY) · UCI Machine Learning
Repository · Palmer Penguins (CC0) · World Bank WDI (CC BY). The datasets *are* the
curriculum here, so licence hygiene matters more than in any other world.

**Cross-links.** Finance — risk and uncertainty. Maths — probability. CS — machine learning
is this world with more parameters. Climate — error bars. Biology — genetics. Language —
corpora and frequency.

**Capstone.** *Debunk a claim.* Take a real published headline claim, find the data, and show
whether it holds — with the working shown.

**Out of scope.** A statistical package. No p-value oracle, no "run the test" button that
hides the reasoning.

**Build.** **Medium.** Main risk: teaching procedure instead of judgement. If a learner can
run the test but cannot say what would change their mind, the world has failed.

---

## Climate & Earth Science

**One idea.** The planet is a system of feedbacks, and you can turn the knobs yourself.

**Instrument.** **The energy-balance model.** Albedo, emissivity and CO₂ in; equilibrium
temperature out — a real (simple) climate model, small enough to understand entirely.

**Observables.**
`climate.tempAnomaly` (K, neither) · `climate.co2` (ppm, neither) ·
`climate.forcing` (W/m², neither) · `climate.sensitivity` (K per doubling, neither) ·
`carbon.reservoir` (GtC, per reservoir) · `tectonics.plateRate` (cm/yr, neither) ·
`system.divergence` (neither) · `quake.magnitude` (neither).

**Parameters.** CO₂, albedo, solar input, reservoir exchange rates, plate velocities, time.

**Instruments.**
1. **The climate dashboard on the globe.** CO₂, temperature anomaly, sea ice and sea level
   as real time series you scrub on the existing timeline control. The data is the argument.
2. **Energy balance.** Change CO₂ and watch the outgoing radiation re-balance. Feedbacks as
   switches: water vapour, ice albedo, clouds (with the honest uncertainty attached).
3. **The carbon cycle as boxes.** Reservoirs with flows; perturb one and watch the others
   respond over centuries.
4. **Plate tectonics.** Drag continents, watch them collide, see mountains rise and quakes
   appear — the same globe, a different timescale.
5. **Chaos, not fate.** Two nearly identical model runs diverging: weather is unpredictable,
   climate is a distribution. This one panel prevents the most common public confusion.

**Ladder.** Primary: seasons, weather, the water cycle. Lower secondary: the greenhouse
effect, rocks and the rock cycle, plate tectonics. Upper secondary: energy balance, the
carbon cycle, feedbacks, evidence. University: radiative forcing, climate sensitivity, carbon
accounting, ice-sheet dynamics.

**Data and sources.** NOAA NCEI · the Mauna Loa CO₂ record (Scripps/NOAA) · NASA GISS
temperatures · Copernicus Climate Data Store · USGS earthquake catalogues (public domain) ·
GPlates for tectonics (free for non-commercial — verify before shipping).

**Cross-links.** Chemistry — CO₂ equilibrium and ocean acidification. Physics — radiation
and the greenhouse mechanism. Earth — the same globe and timeline. Statistics — uncertainty
and attribution. Biology — shifting ranges and phenology. Finance — carbon pricing.

**The rule.** Teach the mechanism, show the data, state the uncertainty, cite the source, and
take no political position. The numbers are already persuasive; advocacy would only make them
less so.

**Capstone.** *Explain the last hundred years.* Choose one dataset and account for its shape
using the mechanisms in this world.

**Out of scope.** Advocacy in either direction. Prediction beyond stated scenarios. Moralising.

**Build.** **Medium-high.** Main risk: the political surface. Every claim carries a source
and a date, or it does not ship.

---

## Engineering

**One idea.** Build it, then find out why it broke — with physics you can trust because the
solvers are real.

**Instrument.** **The bridge you load until it fails.** A real 2D truss solved as a linear
system, member stresses shown as colour, a budget for material, and a collapse you caused.

**Observables.**
`circuit.voltage` (V, neither) · `circuit.current` (A, neither) ·
`circuit.ledBrightness` (0–1, ↑) · `truss.maxStress` (Pa, ↓) ·
`truss.factorOfSafety` (↑) · `truss.cost` (↓) · `truss.collapsed` (bool, ↓) ·
`control.overshoot` (%, ↓) · `control.settlingTime` (s, ↓) · `control.stable` (bool, ↑).

**Parameters.** Component values, member cross-sections, load position and magnitude, gains
(P, I, D), material choice, budget.

**Instruments.**
1. **Circuit lab.** The nodal-analysis linear solve from the physics spec: real voltages and
   currents, LEDs that light at the right current, motors that stall. Bridges physics into
   electronics with the same code.
2. **Truss builder.** Drag nodes, add members, apply a load, watch the force distribution and
   then the failure. The solver is the same linear algebra the maths world teaches — and
   saying so out loud is the cross-link.
3. **Simple machines and gears.** Ratios, torque and speed trade-offs, felt rather than
   memorised.
4. **Control systems.** A PID you tune on a drone or a thermostat; overshoot, oscillation and
   instability are instantly intuitive and famously hard to teach on paper.
5. **Materials.** Stress–strain curves, and "choose a material for this job" with real
   trade-offs between strength, mass and cost.

**Ladder.** Primary: build a bridge in a game, wheels and axles, "why did it fall down".
Lower secondary: forces, simple circuits, energy and work. Upper secondary: Ohm and Kirchhoff,
statics, material properties. University: matrix structural analysis, control theory,
thermodynamics, systems design.

**Data and sources.** Almost entirely computed — the solvers are small and exact, which is
the point. OpenStax Engineering (CC BY) for framing. Material properties curated and cited
(verify any provider's licence before shipping).

**Cross-links.** Maths — the linear system, visibly. Physics — the same forces and circuits.
CS — the control loop is a program. Finance — budget versus safety, which is engineering's
real ethical question.

**Capstone.** *Survive the load on a budget.* Build the cheapest structure that holds;
then explain which member was closest to failure and why.

**Out of scope.** CAD, manufacturing, a general FEA solver, anything that pretends to be
professional software.

**Build.** **Medium.** Main risk: faking the physics to make the game feel better. Use the
real solvers — a truss solve is a few dozen lines and a circuit solve is one matrix
inversion, and the credibility is the whole product.

---

# Deferred

Named so they are not re-litigated every quarter. Each is a real product; none is next.

- **Economics** — shares supply and demand with Financial Literacy, so it must share the
  market instrument rather than duplicate it. Build after finance, not beside it.
- **History** — the Earth world already carries the timeline and the dossiers. History earns
  its own world only when it has its own instrument (competing narratives, source analysis),
  not before.
- **Philosophy & Logic** — argument mapping and formal logic are genuinely manipulable and
  there is nothing good on the market. Strong candidate to be promoted.
- **Literature & Writing** — the LLM makes feedback on writing possible for the first time;
  also the most licence-sensitive, since most texts are not free.
- **Cooking** — applied chemistry, biology and maths, and a rare subject where primary
  learners and adults learn the same thing. Cheap to build; easy to get wrong on safety.
- **Robotics** — a natural pair with Computer Science and Engineering, and a natural home for
  the existing *Robotics Redesign* project. Build after both parents exist.

---

# Build order

Effort is engineering, not content; content is the larger half in every case.

| order | world | effort | why now |
|---|---|---|---|
| 0 | Shell v2 — lenses, five-rung goals, data bus, text surface, audio service | High | Every world below depends on it; retrofitting later is a rewrite |
| 1 | Computer Science | High | Highest novelty per unit of effort, exercises every new shell service |
| 2 | Statistics | Medium | Cheapest genuinely useful world; the datasets are the curriculum |
| 3 | Financial Literacy | Medium | Immediately credible to adults; reuses the maths Monte Carlo |
| 4 | Astronomy | Medium | Mostly already written; the best single "wow" screenshot |
| 5 | Engineering | Medium | Reuses physics and maths solvers; strong retention |
| 6 | Climate & Earth Science | Medium-high | Extends the globe rather than adding an engine |
| 7 | Biology | High | Largest content load; do it with a content team, not a coder |
| 8 | Language | Very high | A product, not a feature. Cost it separately |
| 9 | Deepen the original six to the six-point bar | Medium | Resist the tenth world until this is done |

---

# What I would cut

- **"All completed features"** as a goal. Replace it with the six-point bar; it is the only
  definition that ever terminates.
- **A grade selector.** The lens model replaces it and is strictly better.
- **Twelve languages.** One to C1/C2, plus one nobody serves.
- **A full DAW.** The practice engine is the product; the sequencer only needs to be honest.
- **Any product recommendation in finance**, and any clinical content in biology. These are
  brand-ending, not feature-ending.
- **Live data feeds.** Versioned releases with dates and citations instead.

---

# Open questions

1. **Which language, and for whom?** Decide before writing a line of the language world.
2. **How far up is "university" real?** First-year foundations is achievable; a degree is
   not. Publish the ceiling.
3. **Who is the learner?** A curious adult who wants grounding, or a child being schooled?
   The lens model serves the first superbly and the second adequately. Schooling is a
   different product with different obligations.
4. **Does the app compute or fetch?** Simulation is more defensible and more impressive;
   data is more credible. Almost every world needs both, and the split should be a rule,
   not an accident.
5. **Is the mockup a pitch or a product?** If it is a pitch, the next artefact is a demo of
   *one* new world done completely, not a tenth world done thinly.
