# Learning App — Brainstorm v2: three new subjects, one new axis

> Follows `Design-Brainstorm.md` (v1) and the working mockup in the *Lumen Mockup* project.
> The mockup already proves the world contract: worlds declare **parameters** and
> **observables**, and a lesson goal is a condition on an observable. Everything below
> is written against that contract.

---

## 1. What this request actually asks for

Three new subjects (computer science, financial literacy, language), each "with all
completed features", plus a progression **primary → university** across everything.

The arithmetic is worth stating once, plainly:

- Nine worlds instead of six.
- Four age bands instead of one audience.
- Language alone, at feature parity with the market, is a company.
- "All completed features" applied to nine subjects is not a product, it is a platform
  strategy. Platforms die of thinness.

So the most important thing in this document is not the feature list. It is **one
architectural decision** that has to be made now, because retrofitting it later is a
rewrite.

---

## 2. The decision: depth and stage are different axes

Almost every education app conflates two things and then collapses:

1. **Stage** — how much scaffolding a learner needs (age, reading fluency, independence).
2. **Depth** — how formally a single concept is being treated.

A "grade 7" tab makes these one thing, which produces exactly the failure you can see
in every school app: the content is *easier* and *narrower* at lower stages, so a
curious nine-year-old hits a ceiling and a rusty adult feels insulted by the tone.

**Instead: one concept, five lenses.**

```
Node: "rate of change"
  play      — instrument: drag a slider, watch a thing move
  story     — narrative: why anyone cared
  notation  — symbols: Δy/Δx, f'(x), dy/dx
  proof     — formalism: limit definition, existence conditions
  apply     — real task: fuel consumption, population growth, marginal cost
```

Every node in the content graph declares which lenses exist. **Primary learners get
`play` + `story`. University gets all five, plus derivation chains.** The node never
changes; the lens does. That is the whole trick, and it is a data-model decision, not
a UI one.

Consequences worth internalising:

- A learner's path is a **walk on the graph choosing a lens**, not a grade ladder.
- "Primary to university" becomes a *filter on lenses*, and the app can show a
  twelve-year-old the same node at `play` and a nineteen-year-old at `proof` on
  consecutive days.
- The existing prerequisite edges still work; they gain a lens qualifier
  (`requires: node.b, lens: notation`).
- Spaced repetition gets a second dimension: revisit at **depth + 1**, not just
  at a longer interval. That is the spiral curriculum, expressed as data.

### The five-rung assessment ladder

Correspondingly, one goal primitive, five rungs:

| rung | goal type | example |
|---|---|---|
| predict | commit a guess before running | "you said it will double — run it" |
| compute | reach a numeric observable | `eccentricity < 0.05` |
| construct | build a thing that works | "circuit that dims the lamp" |
| derive | produce the general form | "express w in terms of λ, L, d" |
| generalise | transfer to an unseen case | "same law, new system" |

Every world in the app already supports rungs 2–3 through observables. Rungs 1, 4 and 5
need the shell to grade free text and algebra — see §8.

---

## 3. What "complete" means (define it before you build it)

"All completed features" has no bottom. Replace it with a **six-point bar** every world
must clear to be shippable. This is the checklist I would hold the product to:

1. **An instrument** — something genuinely manipulable, not a video with a quiz.
2. **A ladder** — the same six concepts available at all four stages via lenses.
3. **Observable goals** — assessment by doing, using the existing goal primitive.
4. **Real anchorage** — every abstraction tied to a real object, dataset, or artefact.
5. **A capstone** — one project per subject that is hard to fake and satisfying to finish.
6. **Two cross-links** — each world must connect to at least two others through the graph.

A world that clears all six is complete enough to ship. A world that clears ten features
and three of these is not.

---

## 4. Computer science — "see computation, don't memorise syntax"

This is the best fit of the three, because CS is already instrument-shaped, and
because the incumbents teach *syntax* and almost nobody teaches *execution*.

### 4.1 The core instrument: the stepper

The centre of gravity is a **live program you can run one step at a time**, with three
panels: source, call stack, and heap.

- Breakpoint, step-over, step-into, rewind (keep a bounded history of snapshots).
- Watches on any expression.
- Every step emits events the shell can hang a goal on (`lineReached`, `variableValue`,
  `stackDepth`) — so "stop when `count` reaches 6" is a goal, not a quiz.
- **Predict before you step.** The stepper asks for the next value before revealing it.
  This one interaction is worth more than a hundred exercises.

Three tiers, so the stepper is usable from age eight to a CS degree:

- **Blocks / flow** (primary): a flow of actions that visibly runs — sprites, sensors,
  loops, conditionals. Not Logo, not dragged puzzle-pieces with one right answer:
  a graph you can wire badly and watch fail.
- **Lumen script** (secondary): a small, real, textual language with functions, lists,
  dictionaries and closures — implemented **in-app as an AST interpreter** so stepping
  is exact and instant. This is the important engineering call: control over the
  runtime beats generality here, and it keeps the download small.
- **Real Python** (upper secondary / university): Python via Pyodide, lazily loaded,
  stepped through `sys.settrace`. Authentic, heavy (~10–30 MB) — load it only when a
  learner opens a real-Python lesson. Honest trade.

### 4.2 The data-structure instruments

- **Array sort race.** Two algorithms side by side on the same data, counting comparisons
  and swaps. Complexity stops being notation and becomes a felt difference.
- **Then plot the counters** on the maths world's axes. `O(n log n)` becomes a curve the
  learner measured themselves. This is the single best cross-link in the app.
- **Linked list / tree / hash table**: nodes you drag, pointers that visibly move,
  collisions you can cause.
- **Graph search on real geography**: Dijkstra and A* running on the actual Earth globe —
  real cities, real road/sea distances, runnable step by step. Nothing else in the
  market does this.
- **Call stack instrument**: recursion as a growing, collapsing tower; with the trace
  visible, "why did it overflow" is obvious instead of mystical.

### 4.3 Systems and theory, done as instruments

- **Gates to ALU**: build an adder from NAND gates, then see it inside a CPU cycle.
- **Bits and bytes**: text → bits → compression, on the learner's own sentence.
- **Networks**: packets that visibly queue, drop and retransmit.
- **Concurrency**: a race-condition lab you can reliably trigger — the best way to make
  a bug real.
- **Automata and regex**: a state machine you draw, then run strings through.
- **Encryption**: Caesar → Vigenère → RSA with small primes, all arithmetic visible.
- **Machine learning literacy** (university): draw points, watch gradient descent fit a
  line, see the loss curve and overfitting. The whole point is that it is *manipulable*.

### 4.4 Explicitly out of scope

No full IDE, no web-framework course, no interview-grind question bank, no
"learn 12 languages" switcher. One language per tier, done properly.

---

## 5. Financial literacy — a calculator, never an advisor

The riskiest subject, for two reasons: it is one step from regulated advice, and it is
the one where being wrong about a number is unacceptable.

### 5.1 The enforcing constraint

> **Every screen shows arithmetic on numbers the learner entered. No product
> recommendations, no specific securities, no "you should".**

That single rule removes 90% of the legal and ethical surface, and it also happens to be
better pedagogy: the learner builds the intuition by varying their own inputs.

### 5.2 The core instrument: the lifespan timeline

Money is a time machine, so the world *is* a timeline you scrub — the same control as the
Earth globe.

- **Compound interest and inflation.** Two curves on one axis; toggle the inflation
  series and watch real value flatten. Include the fee drag demo: 1% a year over 40 years
  removed from a portfolio is the most persuasive single number in personal finance.
- **Loans.** Real month-by-month amortisation, not the closed-form formula only — the
  schedule table is where the understanding lives.
- **Tax.** Real progressive brackets, per jurisdiction, data-driven and labelled
  "as of". Marginal vs effective rate is an "aha" almost nobody has had.
- **Saving under shock.** A cash-flow model with events (job loss, a broken car, a
  medical bill) — because "what if" is the actual skill.
- **Investing as risk, not as picks.** Index-vs-single-stock distributions, volatility
  drag, sequence-of-returns risk shown as Monte Carlo runs of a whole working life.
  Reuse the maths world's Monte Carlo instrument.
- **Probability literacy**: expected value, insurance as risk transfer, base rates,
  the gambler's fallacy, why a lottery is a tax on innumeracy.

### 5.3 Data

CPI/inflation series from World Bank and Our World in Data; tax bands per country as a
versioned dataset with dates; interest-rate history. All free, all citable, all
labelled with an "as of" date. Staleness is an editorial obligation, not a bug.

### 5.4 The ladder

- **Primary**: pocket money, saving toward a thing, unit price, "which is cheaper".
- **Lower secondary**: percentages, discounts, budgets, wages and hours.
- **Upper secondary**: compound interest, loans, tax, payslips, credit.
- **University**: present value, NPV and IRR, portfolio variance, insurance pricing,
  behavioural traps.

### 5.5 Capstone

**"Design a life you can afford."** Age, income, city, obligations, shocks, and thirty
years of decisions, scored on whether the household survives — with every mechanism
visible, and no advice given.

---

## 6. Language — the one you cannot win on features

Be blunt internally: Duolingo, Babbel, Anki and a thousand YouTube channels exist. A
feature-complete language app is not shippable by a small team, and "all completed
features" here is a trap that will consume the whole roadmap.

There is exactly one defensible wedge, and it has three parts.

### 6.1 Win on pronunciation, which nobody does well

- Microphone → record → score **per phoneme**, not per word.
- Tractable version first: minimal-pair drills (ship/sheep, l/r, tones) scored by a
  lightweight contrastive classifier — genuinely useful and buildable.
- Ambitious version later: forced alignment against the expected phoneme sequence, giving
  "your third syllable is wrong" rather than "83%".
- This is the single feature that makes a learner say *"oh, this one actually teaches me
  to speak."*

### 6.2 Win on content the learner cannot get elsewhere

The app already has a world of physics, art, music, history and geography. **Learn the
language through that content**, not through "the cat drinks milk".

- The Earth dossier in your target language, at your level.
- Song lyrics with the music world's practice engine.
- Graded readers built by *rewriting existing graph nodes* at a CEFR level. That is a
  content generator the app already owns, and it is the real moat.

### 6.3 Win on depth, in one language, plus one nobody serves

- One well-served language, done to C1/C2 — not twelve to A1.
- One underserved language, served at all (a heritage or minority language), because that
  is where goodwill and press come from.
- Adult false-beginners — people who studied it at school and retained nothing — are the
  most underserved and most motivated segment in the entire market.

### 6.4 The machinery

- **FSRS** for vocabulary and structures — already the app's scheduler, no new system.
- **Sentence builder** as the grammar instrument: drag words, see the pattern, hear it.
  Pattern induction before declension tables.
- **TTS** for listening — system voices are free, cover every language, and are good
  enough. Do not train voices.
- **ASR + phoneme scoring** for speech (§6.1).
- **Conversation**: an LLM roleplay partner with a constrained correction channel —
  corrections in the margin, not interrupting the flow. Transcripts land in the notebook.
- **CJK specifically**: a real segmenter (no spaces), handwriting with stroke-order
  validation, and frequency-ordered character introduction. This is a whole sub-product
  and should be scoped as one.
- **CEFR ladder** A1–C2 with can-do statements as the stage axis, and the same five
  lenses mapped onto it.

---

## 7. What the shell must grow

The v1 architecture holds — worlds are isolated modules with parameters and observables,
so three more plug in cleanly. But three new *shared* concerns appear:

1. **A data bus.** The CS world needs geography from the Earth world; financial literacy
   needs the maths world's Monte Carlo. Worlds currently expose params and observables
   only. Add: a world may expose **named datasets** (read-only) that other worlds and the
   lesson layer can request. Keep it read-only and declarative or it becomes a mesh.
2. **A text surface.** Code (CS) and rich text with tap-to-define (language) are the same
   component shape: editable, tokenised, annotatable. Build once.
3. **An audio service.** Music and language both need a shared AudioContext, mic capture,
   TTS queue and alignment. Currently audio lives inside the music world and would be
   duplicated.
4. **A notation renderer.** Maths, physics, chemistry, CS and language all need typeset
   symbols. One renderer (KaTeX-class), used everywhere, instead of per-world hacks.

And two product-level consequences of nine worlds:

5. **A "today" surface.** With nine worlds, the app needs one interleaved five-minute
   session — the retrieval engine, not a menu. Without it, nine worlds is nine apps.
6. **A content linter.** At this scale the content graph will rot. CI must fail when a
   prerequisite does not exist, a node declares no lenses, a goal has no observable, or a
   world has no cross-links.

---

## 8. Assessment, the model, and safety

- **Deterministic grading first.** Numeric and observable goals are exact. Symbolic
  answers grade by AST equivalence, not string match.
- **LLM where it earns its place**: free-response derivation, conversation practice,
  open-ended capstones. Never as the sole judge of a recorded grade; always with a
  deterministic fallback and a "this was model-graded" marker.
- **Primary users** bring child-safety obligations: no open chat with strangers, no
  accounts by default, local-first profiles, COPPA/GDPR-K if any school use.
- **Financial literacy** carries the disclaimer discipline of §5.1, permanently.
- **Accessibility is not optional** at primary level: large targets, high contrast,
  screen-reader paths through the globe, the code stepper and the keyboard.

---

## 9. The cross-links — this is the product

Nine subjects is only impressive if they talk. The catalogue I would actually build
against, because each of these is the *same mathematics* in two rooms:

- **Exponential growth**: compound interest ↔ population on the globe ↔ radioactive decay
  in physics ↔ the maths world's curve. One shape, four rooms.
- **Equilibrium**: supply and demand ↔ chemical equilibrium and Le Chatelier ↔ the
  titration solver. Genuinely the same system of equations.
- **Conservation**: energy in physics ↔ mass in chemistry ↔ **double-entry bookkeeping**.
  Debits and credits are conservation of value. This is the best single cross-link in the
  app and nobody teaches it.
- **Ordering**: sorting algorithms ↔ the periodic table ↔ country rankings ↔ a sentence's
  word order.
- **Graph search**: Dijkstra on the real globe ↔ network routing ↔ a maze ↔ a family tree
  in history.
- **Recursion**: the call stack ↔ fractals ↔ a musical canon ↔ river deltas.
- **State machines**: regex ↔ traffic lights ↔ grammatical agreement ↔ musical form.
- **Feedback loops**: control systems ↔ thermostats ↔ the water cycle ↔ inflation spirals.

Each one is a lesson for nothing, and a memorable insight for free.

---

## 10. Roadmap — what to build, in what order

The order matters because of §2: build the **lens model** before the third world, or you
will rewrite every world afterwards.

1. **Shell v2** — lenses, the five-rung goals, the data bus, the text surface, the audio
   service, the notation renderer, the "today" surface. No new subjects yet.
2. **Computer science** — the stepper and the sort/plot cross-link. Highest novelty per
   unit of effort, and it exercises every new shell service at once.
3. **Financial literacy** — the lifespan timeline. Cheap to build, immediately credible,
   and it reuses the maths Monte Carlo.
4. **Language** — last, and narrow. One language to C1, one underserved language, and the
   pronunciation instrument. Cost this as its own product.
5. **Then** deepen the original six to the six-point bar rather than adding a tenth world.

### What to cut from the request, and why

- Cut "all completed features" as a goal, replace it with the six-point bar (§3).
- Cut twelve-language support; cut a full DAW from v1 of music; cut any product
  recommendation from finance.
- Cut the idea of a grade selector. The lens model replaces it and is strictly better.

---

## 11. Open decisions

1. **Which language, and for whom?** This single choice determines a year of work. My
   default: English for a large non-English market, or the heritage-language play for
   goodwill. Never both at once.
2. **How far up the ladder is real?** "University" can mean first-year foundations (very
   achievable) or full degree coverage (not). Pick a ceiling and say it out loud.
3. **Is the app for a curious adult who wants primary-level exposure, or for a child
   being schooled?** The lens model serves the first superbly and the second adequately.
   Schooling is a different product with different obligations.
4. **Does CS ship with its own language, or with Python only?** Own language first, for
   control and size; Python as the authentic second tier.

---

## 12. The one-line version

> **Add an axis, not three apps.** One concept, five lenses, four stages; three new
> worlds that are instruments rather than courses; and the cross-links are the product.
