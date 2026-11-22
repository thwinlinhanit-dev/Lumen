/* ==========================================================================
   lessons.js — authored lessons, as data
   A beat is one of: say · set · until · ask · hold
   ========================================================================== */

export const LESSONS = [
  /* ---------------------------------------------------------------- physics */
  {
    id: 'phy.pattern', world: 'physics', stage: 'ls',
    start: { wavelength: 680, slit_separation: 14 },
    title: 'Why two slits make stripes',
    beats: [
      { say: 'Light leaves both slits at once. Where the two waves arrive in step they add; where they oppose, they cancel. Prediction first: what happens to the stripes if you push the slits closer together?' },
      { set: { wavelength: 550, slit_separation: 6 }, hold: 3, say: 'Green light, slits 6 µm apart.' },
      {
        say: 'Now move Slit separation down and watch the screen.',
        until: { obs: 'bright_fringes', op: '>=', value: 9 },
        hint: 'Lower Slit separation toward 3 µm.'
      },
      {
        ask: 'Closer slits made the fringes…',
        options: ['wider', 'narrower', 'unchanged'],
        answer: 0
      },
      { say: 'Wider. Fringe width is λL/d — shrink d and the pattern opens up. That is the whole experiment, and it is why light had to be a wave.' }
    ]
  },
  {
    id: 'phy.five', world: 'physics', stage: 'us', start: { wavelength: 700, slit_separation: 12 },
    title: 'Hit exactly five fringes',
    beats: [
      { say: 'You have two knobs: wavelength and separation. The screen tells you how many bright fringes it can fit.' },
      { say: 'Aim for exactly five.', until: { goal: true }, hint: 'Fewer fringes means more separation, or a longer wavelength.' },
      { say: 'Five fringes means the spacing is a fifth of the screen. Everything in the app agrees with w = λL/d, because the pattern is solved, not drawn.' }
    ]
  },

  /* ----------------------------------------------------------------- maths */
  {
    id: 'mat.amplitude', world: 'maths', stage: 'ls', start: { amplitude_a: 0.4, frequency_b: 1, phase_c: 0, shift_d: 0 },
    title: 'One number, one shape',
    beats: [
      { say: 'The curve is y = a·sin(bx + c) + d. Four numbers, four different behaviours. Start with a.' },
      { say: 'Set Amplitude a to 2.', until: { obs: 'amplitude', op: '>=', value: 2 }, hint: 'Drag Amplitude a to 2.' },
      { say: 'The curve now reaches 2 and −2. Amplitude is how far it swings, not how high it goes — that is d.' },
      {
        ask: 'Which number slides the whole curve up without changing its shape?',
        options: ['a', 'b', 'c', 'd'],
        answer: 3
      }
    ]
  },
  {
    id: 'mat.period', world: 'maths', stage: 'us', start: { frequency_b: 0.5 },
    title: 'Frequency is the inverse of period',
    beats: [
      { say: 'Period is 2π/b. Double b and the period halves — the wave repeats twice as often.' },
      { say: 'Make the period exactly π.', until: { obs: 'period', op: '<=', value: 1.05 }, hint: 'That means b = 2.' },
      { say: 'The unit circle beside it turns twice per cycle now. Same curve, twice the speed.' }
    ]
  },

  /* ------------------------------------------------------------------ chem */
  {
    id: 'chem.pull', world: 'chem', stage: 'ls', start: { atomic_number: 79 },
    title: 'Find the electron thief',
    beats: [
      { say: 'Colour the table by pulling power and the pattern appears without anyone telling you: strength grows as you go right and up.' },
      { say: 'Find the element that pulls hardest.', until: { goal: true }, hint: 'Top right corner — and it is not a noble gas.' },
      { say: 'Fluorine, at 3.98. It is the reason Teflon does not react with anything and the reason your toothpaste works.' }
    ]
  },
  {
    id: 'chem.families', world: 'chem', stage: 'p', start: { atomic_number: 2 },
    title: 'Families behave alike',
    beats: [
      { say: 'The table is arranged so that things in the same column behave the same way. That is the entire idea.' },
      { say: 'Tap the tall column on the far right — the ones nobody reacts with.', hold: 8 },
      {
        ask: 'Why are those elements so calm?',
        options: ['they are too heavy', 'their shells are full', 'they are rare'],
        answer: 1
      },
      { say: 'Full shells. Everything else in chemistry is about trying to get there.' }
    ]
  },

  /* ------------------------------------------------------------------- art */
  {
    id: 'art.three', world: 'art', stage: 'p', start: { brush: 26 },
    title: 'Three values is a drawing',
    beats: [
      { say: 'Before colour, before detail: light, middle, dark. Paint three shapes using three different values.' },
      { say: 'Fill enough of the canvas to register three separate values.', until: { obs: 'distinct_values', op: '>=', value: 3 }, hint: 'Use the palette: a light, a mid, and the darkest.' },
      { say: 'That is already readable as a picture, even with no detail at all.' }
    ]
  },
  {
    id: 'art.five', world: 'art', stage: 'us', start: { brush: 22 },
    title: 'The five-value study',
    beats: [
      { say: 'Professional painters work in about five values. Turn on the master overlay and paint the still life against it.' },
      { say: 'Reach all five values with the canvas covered.', until: { goal: true }, hint: 'The histogram shows which values you are missing.' },
      { say: 'Turn the overlay off. If the shapes still stand up, you have built it on structure rather than outline.' }
    ]
  },

  /* ----------------------------------------------------------------- music */
  {
    id: 'mus.beat', world: 'music', stage: 'p', start: { tempo: 100 },
    title: 'Everything starts with a pulse',
    beats: [
      { say: 'Tap any white key four times, evenly. That is a bar. Rhythm is only counting.' },
      { hold: 6, ask: 'Four beats in a bar is called…', options: ['common time', 'a scale', 'a chord'], answer: 0 },
      { say: 'Common time, 4/4. Almost every song you know is built on it.' }
    ]
  },
  {
    id: 'mus.phrase', world: 'music', stage: 'ls', start: { tempo: 100 },
    title: 'Play eight notes in order',
    beats: [
      { say: 'Switch to Practice and the app will light the next key. The phrase is C E G C G E D C — a shape, not a scale.' },
      { say: 'Play all eight notes.', until: { goal: true }, hint: 'Use the Practice button in the coach.' },
      { say: 'Those four chords under it — I, IV, V, vi — carry thousands of songs. You just heard why.' }
    ]
  },

  /* ----------------------------------------------------------------- earth */
  {
    id: 'earth.dossier', world: 'earth', stage: 'ls', start: { year: 1900 },
    title: 'Every place is a stack of time',
    beats: [
      { say: 'Spin the globe and tap a country. What you get is not a fact sheet — it is a dated list.' },
      { say: 'Open one country.', until: { obs: 'countries_opened', op: '>=', value: 1 }, hint: 'Tap any landmass.' },
      { say: 'Now drag the timeline back to 1900. Most of that list disappears. Borders are recent inventions.' }
    ]
  },
  {
    id: 'earth.timeline', world: 'earth', stage: 'us', start: { year: 1850 },
    title: 'Open five, then go back',
    beats: [
      { say: 'Open dossiers for five countries, then scrub the year backwards and see how much of the record survives.' },
      { say: 'Five countries.', until: { goal: true }, hint: 'Paris, Berlin, Cairo, Delhi, Tokyo — somewhere with a long record.' },
      { say: 'Every one of those countries had a different century. That is what a globe hides and a timeline does not.' }
    ]
  },

  /* -------------------------------------------------------------------- cs */
  {
    id: 'cs.beat', world: 'cs', stage: 'us', start: { array_size: 56, steps_per_frame: 6 },
    title: 'Count, do not guess',
    beats: [
      { say: 'Both lanes sort the same array. One of them spends far more comparisons doing it.' },
      { set: { array_size: 32, steps_per_frame: 14 }, hold: 2, say: '32 items, running now.' },
      { say: 'Let the race finish.', until: { goal: true }, hint: 'Make sure Lane B is Quick.' },
      { say: 'That gap is not a style preference. It is the difference between n² and n log n, and it is why your phone can sort a photo library.' }
    ]
  },
  {
    id: 'cs.why', world: 'cs', stage: 'us', start: { array_size: 48, steps_per_frame: 6 },
    title: 'Why bubble sort survives anyway',
    beats: [
      { say: 'Bubble sort is quadratically slow, universally taught first, and almost never used. Look at the counts.' },
      {
        ask: 'When is bubble sort actually the right choice?',
        options: ['never', 'when the data is already nearly sorted', 'when there is a lot of data'],
        answer: 1
      },
      { say: 'Nearly sorted is the case. One pass and it stops changing anything — 32 comparisons instead of 496. Complexity is about shape, not size.' }
    ]
  },

  /* --------------------------------------------------------------- finance */
  {
    id: 'fin.fee', world: 'finance', stage: 'us',
    title: 'The fee you cannot see',
    beats: [
      { set: { annual_fee: 2.0 }, hold: 3, say: 'A 2% annual charge. Looks small. Look at the gap between the two green lines.' },
      { set: { annual_fee: 0.6 }, hold: 3, say: 'Now 0.6% — a normal index fund. Over forty years the difference is most of the money.' },
      { say: 'Fees compound exactly like returns, except they compound against you, and they are certain.' }
    ]
  },
  {
    id: 'fin.million', world: 'finance', stage: 'us', start: { saved_each_month: 400, annual_return: 7, inflation: 3, annual_fee: 0.5 },
    title: 'A million in today’s money',
    beats: [
      { say: 'Two things you control: how much goes in, and how long it stays. Everything else is arguing about the rate.' },
      { say: 'Reach $1m after inflation.', until: { goal: true }, hint: 'Raise the monthly amount before you raise the return.' },
      { say: 'Notice which knob did most of the work. It was never the return.' }
    ]
  },

  /* -------------------------------------------------------------- language */
  {
    id: 'lang.order', world: 'language', stage: 'ls', start: { voice_speed: 0.6 },
    title: 'Order is the grammar',
    beats: [
      { say: 'Spanish needs no pronoun here: the verb ending already says who. Press Listen, then build the sentence.' },
      { say: 'Complete one sentence.', until: { obs: 'sentences_solved', op: '>=', value: 1 }, hint: 'Tap the tiles in the order you hear them.' },
      { say: 'The colours are grammatical roles. Watch which word carries the information.' }
    ]
  },
  {
    id: 'lang.clean', world: 'language', stage: 'ls', start: { voice_speed: 0.6 },
    title: 'Three clean runs',
    beats: [
      { say: 'Getting there eventually is not knowing. Three sentences with no wrong tile is knowing.' },
      { say: 'Three clean runs.', until: { goal: true }, hint: 'Listen before you tap.' },
      { say: 'In the full app, the microphone scores each sound separately — which is the part no competitor does properly.' }
    ]
  },

  /* ----------------------------------------------------------------- astro */
  {
    id: 'astro.speed', world: 'astronomy', stage: 'ls', start: { time: 6 },
    title: 'Distance sets the period',
    beats: [
      { say: 'Mercury laps the Sun four times a year. Neptune has not finished one lap since it was discovered.' },
      { say: 'Let Earth run ten years.', until: { obs: 'earth_years', op: '>=', value: 10 }, hint: 'Raise the Time slider.' },
      { say: 'Nothing else in this system changes the period. Distance, and only distance.' }
    ]
  },
  {
    id: 'astro.neptune', world: 'astronomy', stage: 'us', start: { time: 20 },
    title: 'One Neptune orbit',
    beats: [
      { say: '165 years. Watch Jupiter already on its fourteenth lap while Neptune is still going.' },
      { say: 'Get Neptune round once.', until: { goal: true }, hint: 'The Time slider goes to 30 years per second.' },
      { say: 'Kepler wrote this down before Newton explained why — T² ∝ a³. The app is solving his ellipse, not drawing a circle.' }
    ]
  },

  /* ------------------------------------------------------------------- bio */
  {
    id: 'bio.select', world: 'biology', stage: 'ls', start: { environment_optimum: 0.3, selection_strength: 0.65, mutation_rate: 0.03 },
    title: 'Push the population somewhere',
    beats: [
      { say: 'Each dot has a heritable trait. Move the optimum and the population will chase it, generation by generation.' },
      { set: { environment_optimum: 0.8 }, hold: 3, say: 'Optimum moved to 0.8. Watch the colours shift.' },
      { say: 'Bring the mean within 2% of the optimum.', until: { goal: true }, hint: 'Turn Selection strength up.' },
      { say: 'Nobody planned that. Selection is just differential survival, repeated.' }
    ]
  },
  {
    id: 'bio.mutation', world: 'biology', stage: 'us', start: { mutation_rate: 0.01, selection_strength: 0.4 },
    title: 'Why variation never disappears',
    beats: [
      { say: 'Selection always pulls toward one value. Mutation always scatters. Watch which one wins.' },
      { set: { mutation_rate: 0.09, selection_strength: 0.95 }, hold: 4, say: 'Strong selection, high mutation.' },
      {
        ask: 'If selection were perfect and mutation zero, what would happen to variation?',
        options: ['it would vanish', 'it would grow', 'it would stay the same'],
        answer: 0
      },
      { say: 'It would vanish — every individual identical. The variation you see in life is the tax mutation charges on selection.' }
    ]
  },

  /* ----------------------------------------------------------------- stats */
  {
    id: 'stats.pile', world: 'statistics', stage: 'us', start: { sample_size_n: 24 },
    title: 'The means pile up',
    beats: [
      { say: 'The population on top is skewed — nothing normal about it. Take samples and watch what happens to their averages.' },
      { set: { sample_size_n: 8 }, hold: 4, say: 'Samples of eight.' },
      { say: 'Let a hundred samples accumulate.', until: { obs: 'samples_drawn', op: '>=', value: 100 } },
      { say: 'A bell curve, out of a population that looks nothing like one. That is the central limit theorem, and it is why sampling works at all.' }
    ]
  },
  {
    id: 'stats.se', world: 'statistics', stage: 'uni', start: { sample_size_n: 4 },
    title: 'σ over root n',
    beats: [
      { say: 'The white curve is not fitted — it is predicted. Its width is σ/√n.' },
      { say: 'Shrink the measured spread below 3.', until: { goal: true }, hint: 'Quadruple the sample size to halve the spread.' },
      { say: 'To halve the error you need four times the data. That sentence has decided more research budgets than any other.' }
    ]
  },

  /* --------------------------------------------------------------- climate */
  {
    id: 'cli.albedo', world: 'climate', stage: 'ls',
    title: 'Reflect more, cool down',
    beats: [
      { say: 'In has to equal out. Reflect more sunlight and there is less coming in, so the surface must cool until it balances.' },
      { set: { albedo_reflectivity: 0.5 }, hold: 4, say: 'Albedo 0.5 — like a snowball.' },
      { set: { albedo_reflectivity: 0.3 }, hold: 3, say: 'Back to 0.3, roughly Earth now.' },
      {
        ask: 'Which reflects more sunlight?',
        options: ['open ocean', 'snow and ice'],
        answer: 1
      }
    ]
  },
  {
    id: 'cli.warm', world: 'climate', stage: 'us', start: { solar_output: 1, albedo_reflectivity: 0.3, emissivity_lower_traps_more: 0.8 },
    title: 'Three degrees',
    beats: [
      { say: 'One equation: T = ((S/4)(1−α)/εσ)^¼. Turn the knobs and watch it relax toward its new balance.' },
      { say: 'Warm the surface by 3 °C.', until: { goal: true }, hint: 'Lower emissivity — that is the greenhouse.' },
      { say: 'This is the mechanism, not a forecast. Real models add feedbacks and come out warmer for the same forcing.' }
    ]
  },

  /* ------------------------------------------------------------- engineering */
  {
    id: 'eng.chord', world: 'engineering', stage: 'us', start: { bottom_chord: 120, top_chord: 100, diagonals: 80 },
    title: 'Where the load goes',
    beats: [
      { say: 'A 20 kN load pulls on the whole structure. Blue is stretched, pink is squashed. Guess before you look: which chord works hardest?' },
      {
        ask: 'Which members carry the most force?',
        options: ['the top chord', 'the bottom chord', 'the diagonals'],
        answer: 1
      },
      { say: 'The bottom chord, in tension. The top chord is in compression and mostly there to stop the bottom one sagging. That surprises almost everyone.' }
    ]
  },
  {
    id: 'eng.budget', world: 'engineering', stage: 'uni', start: { bottom_chord: 120, top_chord: 100, diagonals: 80 },
    title: 'Strong and cheap at once',
    beats: [
      { say: 'Steel costs by the kilogram, so strength and cost pull opposite ways. That tension is engineering.' },
      { say: 'Reach a factor of safety of 2.5 for under $95.', until: { goal: true }, hint: 'Spend on the bottom chord. Leave the diagonals lean.' },
      { say: 'You just did a linear solve and an optimisation in your head. The app did the matrix.' }
    ]
  },

  /* ======================= maths ladder, primary up ======================= */
  {
    id: 'mat.p.repeat', world: 'maths', stage: 'p', start: { amplitude_a: 0.4, frequency_b: 1, phase_c: 0, shift_d: 0 },
    title: 'Things that repeat',
    beats: [
      { say: 'Watch the purple line. It climbs, it comes down, and then it does exactly the same thing again. Forever.' },
      { set: { amplitude_a: 1, frequency_b: 1, phase_c: 0, shift_d: 0 }, hold: 5, say: 'This shape has a name: a wave.' },
      {
        ask: 'If you make the number b bigger, what happens?',
        options: ['it repeats more often', 'it gets taller', 'it floats upward'],
        answer: 0
      },
      { set: { frequency_b: 3 }, hold: 4, say: 'More squeezes, same height. b is how often, not how big.' }
    ]
  },
  {
    id: 'mat.ls.midline', world: 'maths', stage: 'ls',
    title: 'The line it swings around',
    beats: [
      { say: 'A wave does not swing around zero. It swings around a middle line, and d is what moves that line.' },
      { set: { amplitude_a: 1.5, frequency_b: 1, shift_d: 0 }, hold: 3, say: 'Amplitude 1.5, middle line at zero.' },
      {
        say: 'Raise the middle line until the lowest point of the curve is exactly zero.',
        until: { obs: 'range', op: '>=', value: -0.05 },
        hint: 'Set Shift d to 1.5.'
      },
      { say: 'Range reads 0 to 3 now. Nothing about the shape changed — only where it sits.' }
    ]
  },
  {
    id: 'mat.ls.two', world: 'maths', stage: 'ls',
    title: 'Two ways to reach higher',
    beats: [
      { say: 'You can make the curve reach up in two completely different ways, and they are easy to confuse.' },
      {
        ask: 'Which one changes the shape of the wave?',
        options: ['amplitude', 'shift'],
        answer: 0
      },
      { set: { amplitude_a: 2.5, shift_d: 0 }, hold: 3, say: 'Amplitude stretches it. The shape is different.' },
      { set: { amplitude_a: 1, shift_d: 1.5 }, hold: 3, say: 'Shift lifts it. The shape is identical, just higher.' }
    ]
  },
  {
    id: 'mat.us.phase', world: 'maths', stage: 'us', start: { amplitude_a: 1.4, frequency_b: 1, phase_c: 0 },
    title: 'Sliding it sideways',
    beats: [
      { say: 'c slides the wave left or right in time. It does not stretch it and it does not lift it.' },
      { set: { amplitude_a: 1, frequency_b: 1, phase_c: 0 }, hold: 3, say: 'Phase zero.' },
      { say: 'Move Phase c and watch the zero crossings slide along the axis — but the gap between them never changes.' },
      { say: 'Slide it by a quarter of a period and the sine looks exactly like a cosine. That is the only difference between them.' }
    ]
  },
  {
    id: 'mat.us.slope', world: 'maths', stage: 'us',
    title: 'The slope of a wave',
    beats: [
      { say: 'Turn on Show the derivative in the coach. The dashed line is the slope of the curve at every point.' },
      { set: { amplitude_a: 2, frequency_b: 1, phase_c: 0, shift_d: 0 }, hold: 4, say: 'Amplitude 2, b 1. The steepest slope should be 2.' },
      {
        say: 'Now double b and watch the maximum slope.',
        until: { obs: 'max_slope', op: '>=', value: 3.9 },
        hint: 'Set Frequency b to 2.'
      },
      { say: 'The maximum slope is a times b — 4, not 2. Making the wave faster makes every part of it steeper.' }
    ]
  },
  {
    id: 'mat.uni.general', world: 'maths', stage: 'uni',
    title: 'Reading the general form',
    beats: [
      { say: 'y = a·sin(bx + c) + d. Four letters, four independent behaviours. If you can read them off, you can read any sinusoid.' },
      {
        ask: 'If b = 3, what is the period?',
        options: ['2π/3', '3π', '2π'],
        answer: 0
      },
      { set: { frequency_b: 3 }, hold: 4, say: 'The readout says 0.67π. That is 2π/3.' }
    ]
  },
  {
    id: 'mat.uni.chain', world: 'maths', stage: 'uni', start: { amplitude_a: 0.5, frequency_b: 0.5 },
    title: 'Why the slope is ab',
    beats: [
      { say: 'd/dx [a sin(bx)] = ab cos(bx). The b appears because the inside function is differentiated too — the chain rule.' },
      {
        ask: 'With a = 2 and b = 2, what is the maximum slope?',
        options: ['2', '4', '8'],
        answer: 1
      },
      {
        say: 'Set a and b to 2 and read Max slope.',
        until: { obs: 'max_slope', op: '>=', value: 4 },
        hint: 'Amplitude 2, Frequency 2.'
      },
      { say: 'Four. Not eight — eight would be if the wave covered twice as much ground, which it does not; it only turned faster.' }
    ]
  },

  /* ======================= money ladder, primary up ======================= */
  {
    id: 'fin.p.straight', world: 'finance', stage: 'p',
    title: 'Straight or bending',
    beats: [
      { say: 'If money did not grow at all, the line would be straight: put in $100 a month, and each month you have exactly $100 more.' },
      { set: { annual_return: 0 }, hold: 4, say: 'Straight. That is saving with no interest.' },
      { set: { annual_return: 7 }, hold: 4, say: 'Now watch it bend upward. The money starts earning money of its own.' },
      {
        ask: 'Which line is higher at the end?',
        options: ['the straight one', 'the bent one'],
        answer: 1
      }
    ]
  },
  {
    id: 'fin.ls.half', world: 'finance', stage: 'ls',
    title: 'Half in, half out',
    beats: [
      { say: 'The green line is your balance. Halve the monthly amount and see what happens to it.' },
      { set: { saved_each_month: 800 }, hold: 3, say: '$800 a month.' },
      { set: { saved_each_month: 400 }, hold: 3, say: '$400 a month.' },
      {
        ask: 'Does the final balance halve too?',
        options: ['yes, exactly', 'no, it barely changes'],
        answer: 0
      },
      { say: 'Exactly. Contributions are linear: twice the money in, twice the money out.' }
    ]
  },
  {
    id: 'fin.ls.inflation', world: 'finance', stage: 'ls',
    title: 'What it buys',
    beats: [
      { say: 'Two lines that look similar and mean completely different things. Green is the number in the account. Blue is what that number actually buys.' },
      { set: { inflation: 0 }, hold: 3, say: 'No inflation — the two lines sit on top of each other.' },
      { set: { inflation: 3 }, hold: 3, say: '3% a year, and the blue line falls away.' },
      {
        ask: 'What does that growing gap mean?',
        options: ['the account lost money', 'the account grew but buys less'],
        answer: 1
      },
      { say: 'The second one. Growing and getting richer are not the same thing.' }
    ]
  },
  {
    id: 'fin.us.double', world: 'finance', stage: 'us',
    title: 'The rule of 72',
    beats: [
      { say: 'Divide 72 by the percentage rate and you get the years it takes to double. It is close enough to be useful in your head.' },
      { set: { annual_return: 2 }, hold: 3, say: 'At 2%, about 36 years to double. Read it under Observables.' },
      {
        say: 'Now make it double in about twelve years.',
        until: { obs: 'years_to_double', op: '<=', value: 12.5 },
        hint: 'That means a rate near 6%.'
      },
      { say: '6%. Halving the doubling time takes tripling the rate — compounding is slow, then sudden.' }
    ]
  },
  {
    id: 'fin.us.real', world: 'finance', stage: 'us',
    title: 'Two millions',
    beats: [
      { say: 'One million in the account and one million of purchasing power are different sums, and only one of them is a goal worth having.' },
      { set: { saved_each_month: 700, annual_return: 7, inflation: 3, annual_fee: 0.5 }, hold: 3, say: 'A reasonable set of numbers.' },
      { say: 'Reach a million in today’s money.', until: { goal: true }, hint: 'The monthly amount does more than the rate.' },
      { say: 'Note what you had to change. It was almost certainly the contribution, not the return.' }
    ]
  },
  {
    id: 'fin.uni.pv', world: 'finance', stage: 'uni',
    title: 'Present value',
    beats: [
      { say: 'A dollar later is worth less than a dollar now, whenever the return beats inflation. Present value is just that sentence, quantified.' },
      {
        ask: 'If inflation and the return are both 3%, what happens to today’s value over time?',
        options: ['it stays flat', 'it doubles', 'it halves'],
        answer: 0
      },
      { set: { annual_return: 3, inflation: 3 }, hold: 4, say: 'Flat. The blue line stops rising — every bit of growth is eaten.' },
      { say: 'Real return ≈ nominal minus inflation. Everything in portfolio theory is built on that subtraction.' }
    ]
  },
  {
    id: 'fin.uni.fee', world: 'finance', stage: 'uni',
    title: 'Fee drag is not a percentage',
    beats: [
      { say: 'A fee is charged on the whole balance, every year, and the balance never stops growing. So the cost is not linear in the fee.' },
      { set: { annual_fee: 0.2 }, hold: 3, say: '0.2% — a cheap index fund. Look at Lost to fees.' },
      { set: { annual_fee: 1.6 }, hold: 3, say: 'Now 1.6%. Same contributions, same return.' },
      {
        ask: 'Roughly how much of the final balance does that 1.4% difference take?',
        options: ['under 5%', 'about 10%', 'over 20%'],
        answer: 2
      },
      { say: 'Over a fifth, and at higher returns it is worse. Over forty years a fee is not a cost, it is a co-owner.' }
    ]
  },

  /* ==================== primary instruments, stage 'p' ==================== */
  {
    id: 'phy.p.push', world: 'physics', stage: 'p', instrument: 'push',
    start: { force: 4, mass: 2 },
    title: 'A bigger push, a faster thing',
    beats: [
      { say: 'The ball sits in water, and the arrow is a push. Change either number and watch what the two of them do together.' },
      {
        say: 'Make it travel further than six metres in two seconds.',
        until: { obs: 'distance', op: '>=', value: 6 },
        hint: 'Push harder, or use a lighter ball.'
      },
      { say: 'Distance grows with the push and shrinks with the mass — six newtons on one kilogram does it, and so does twelve on two.' }
    ]
  },
  {
    id: 'mat.p.share', world: 'maths', stage: 'p', instrument: 'blocks',
    start: { objects: 8, groups: 2 },
    title: 'Share twelve between four',
    beats: [
      { set: { objects: 12, groups: 4 }, hold: 2, say: 'Twelve things, four groups, and nothing left over is the only answer that is fair.' },
      {
        say: 'Tap a dot to move it into a group. Tap it again to move it on.',
        until: { obs: 'per_group', op: '>=', value: 3 },
        hint: 'Three in each group.'
      },
      { say: 'Three each, nothing left over. That is division: 12 ÷ 4 = 3, and it is the same thing as asking how many threes fit into twelve.' }
    ]
  },
  {
    id: 'fin.p.shop', world: 'finance', stage: 'p', instrument: 'shop',
    start: { budget: 15 },
    title: 'A shop, a budget, a choice',
    beats: [
      { set: { budget: 10 }, hold: 2, say: 'Ten dollars, five things, and prices you cannot argue with.' },
      {
        say: 'Buy three things and still stay inside the budget.',
        until: { goal: true },
        hint: 'Add up the prices before you tap.'
      },
      { say: 'You just made a budget. Later the numbers get bigger and the choices get harder, but the arithmetic never changes.' }
    ]
  }
];

export function lessonsFor(worldId) {
  return LESSONS.filter((l) => l.world === worldId);
}
