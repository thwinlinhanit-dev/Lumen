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
        hint: 'Raise Slit separation toward 18 µm; a shorter wavelength also packs in more fringes.'
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
      {
        ask: 'A higher annual fee leaves you with…',
        options: ['more in today’s money', 'less in today’s money', 'the same amount'],
        answer: 1
      },
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
    id: 'astro.speed', world: 'astro', stage: 'ls', start: { time: 6 },
    title: 'Distance sets the period',
    beats: [
      { say: 'Mercury laps the Sun four times a year. Neptune has not finished one lap since it was discovered.' },
      { say: 'Let Earth run ten years.', until: { obs: 'earth_years', op: '>=', value: 10 }, hint: 'Raise the Time slider.' },
      { say: 'Nothing else in this system changes the period. Distance, and only distance.' }
    ]
  },
  {
    id: 'astro.neptune', world: 'astro', stage: 'us', start: { time: 20 },
    title: 'One Neptune orbit',
    beats: [
      { say: '165 years. Watch Jupiter already on its fourteenth lap while Neptune is still going.' },
      { say: 'Get Neptune round once.', until: { goal: true }, hint: 'The Time slider goes to 30 years per second.' },
      { say: 'Kepler wrote this down before Newton explained why — T² ∝ a³. The app is solving his ellipse, not drawing a circle.' }
    ]
  },

  /* ------------------------------------------------------------------- bio */
  {
    id: 'bio.select', world: 'bio', stage: 'ls', start: { environment_optimum: 0.3, selection_strength: 0.65, mutation_rate: 0.03 },
    title: 'Push the population somewhere',
    beats: [
      { say: 'Each dot has a heritable trait. Move the optimum and the population will chase it, generation by generation.' },
      { set: { environment_optimum: 0.8 }, hold: 3, say: 'Optimum moved to 0.8. Watch the colours shift.' },
      { say: 'Bring the mean within 2% of the optimum.', until: { goal: true }, hint: 'Turn Selection strength up.' },
      { say: 'Nobody planned that. Selection is just differential survival, repeated.' }
    ]
  },
  {
    id: 'bio.mutation', world: 'bio', stage: 'us', start: { mutation_rate: 0.01, selection_strength: 0.4 },
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
    id: 'stats.pile', world: 'stats', stage: 'us', start: { sample_size_n: 24 },
    title: 'The means pile up',
    beats: [
      { say: 'The population on top is skewed — nothing normal about it. Take samples and watch what happens to their averages.' },
      { set: { sample_size_n: 8 }, hold: 4, say: 'Samples of eight.' },
      { say: 'Let a hundred samples accumulate.', until: { obs: 'samples_drawn', op: '>=', value: 100 } },
      { say: 'A bell curve, out of a population that looks nothing like one. That is the central limit theorem, and it is why sampling works at all.' }
    ]
  },
  {
    id: 'stats.se', world: 'stats', stage: 'uni', start: { sample_size_n: 4 },
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
    id: 'eng.chord', world: 'eng', stage: 'us', start: { bottom_chord: 120, top_chord: 100, diagonals: 80 },
    title: 'Where the load goes',
    beats: [
      { say: 'A 20 kN load pulls on the whole structure. Blue is stretched, pink is squashed. Guess before you look: which chord is in tension?' },
      {
        ask: 'Which chord is pulled apart rather than squashed?',
        options: ['the bottom chord', 'the top chord', 'neither'],
        answer: 0
      },
      {
        say: 'Make the structure stand with a factor of safety of at least 2.5.',
        until: { obs: 'factor_of_safety', op: '>=', value: 2.5 },
        hint: 'Thicken the chord that is working hardest, not the one that looks most important.'
      },
      { say: 'Then finish the tradeoff: hold that safety factor while spending under $95.', until: { goal: true }, hint: 'Spend on the governing group; leave quiet members lean.' },
      { say: 'The bottom chord is in tension; the top chord is in compression. Their colours told you which was which before any number did.' }
    ]
  },
  {
    id: 'eng.budget', world: 'eng', stage: 'uni', start: { bottom_chord: 120, top_chord: 100, diagonals: 80 },
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
      {
        ask: 'Changing the phase c moves the curve…',
        options: ['left or right', 'up or down', 'stretches it'],
        answer: 0
      },
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
  },

  /* ==================== ladder completion: missing stages ==================== */

  /* --------------------------------------------------------------- physics */
  {
    id: 'phy.uni.intensity', world: 'physics', stage: 'uni',
    start: { wavelength: 500, slit_separation: 8 },
    title: 'The pattern is the equation',
    beats: [
      { say: 'Fringe spacing is λL/d. The simulation solves where the two waves meet, so every number in the coach comes from the geometry — none of it is drawn by hand.' },
      { set: { wavelength: 650, slit_separation: 4 }, hold: 2, say: 'Longer waves and closer slits, together.' },
      {
        ask: 'If you double the slit separation and keep the colour, the fringe width…',
        options: ['doubles', 'halves', 'stays the same'],
        answer: 1
      },
      { say: 'Halves. d sits in the denominator of w = λL/d, so the pattern closes up exactly as the algebra says it should.' }
    ]
  },

  /* ------------------------------------------------------------- chemistry */
  {
    id: 'chem.us.periods', world: 'chem', stage: 'us',
    start: { atomic_number: 11 },
    title: 'Across a row, the pull changes',
    beats: [
      { say: 'Colour the table by pulling power and read across a row instead of down a column.' },
      { set: { atomic_number: 17 }, hold: 2, say: 'Sodium and chlorine sit in the same row, at opposite ends.' },
      {
        ask: 'Moving left to right across a period, electronegativity generally…',
        options: ['increases', 'decreases', 'does not change'],
        answer: 0
      },
      { say: 'Increases. The same shell is being filled while the pull from the nucleus grows — that is the trend the colouring reveals.' }
    ]
  },
  {
    id: 'chem.uni.shells', world: 'chem', stage: 'uni',
    start: { atomic_number: 6 },
    title: 'Shells explain the column',
    beats: [
      { say: 'Group is decided by the outer shell, not by where the element happens to sit in a row.' },
      { set: { atomic_number: 8 }, hold: 2, say: 'Carbon and oxygen: different rows, different properties, but the same column family as their neighbours.' },
      {
        ask: 'Elements in the same group behave alike mainly because they have…',
        options: ['the same mass', 'the same outer-shell structure', 'the same number of protons'],
        answer: 1
      },
      { say: 'The same outer-shell structure. Chemistry is mostly the story of what that outermost shell is trying to do.' }
    ]
  },

  /* ------------------------------------------------------------------- art */
  {
    id: 'art.ls.edge', world: 'art', stage: 'ls',
    start: { brush: 12 },
    title: 'Edges are a value decision',
    beats: [
      { say: 'A thin brush with one value draws an outline. Change the brush and the edge becomes a meeting of two shapes.' },
      { set: { brush: 34 }, hold: 2, say: 'A wider mark covers more of the canvas and changes the value histogram.' },
      {
        ask: 'An edge that reads as a change of plane is made by…',
        options: ['two different values meeting', 'a darker outline everywhere', 'more detail'],
        answer: 0
      },
      { say: 'Two different values meeting. Drawing is deciding where one value stops and the next begins.' }
    ]
  },
  {
    id: 'art.uni.analysis', world: 'art', stage: 'uni',
    start: { brush: 18 },
    title: 'The studio looks back',
    beats: [
      { say: 'The panel on the right is not decoration: it measures how many distinct values are on the canvas and how much of it is covered.' },
      { set: { brush: 42 }, hold: 2, say: 'A broad mark changes the coverage measurement immediately.' },
      {
        ask: 'An image with only two distinct values will always look…',
        options: ['photorealistic', 'flat', 'blurred'],
        answer: 1
      },
      { say: 'Flat. Value count and coverage are ordinary image analysis — the same numbers a painter checks by squinting.' }
    ]
  },

  /* ----------------------------------------------------------------- music */
  {
    id: 'mus.us.tempo', world: 'music', stage: 'us',
    start: { tempo: 90 },
    title: 'Tempo is a ratio, not a feeling',
    beats: [
      { say: 'Tempo counts beats per minute. Double it and the same eight notes take half as long.' },
      { set: { tempo: 140 }, hold: 2, say: 'Faster now — listen to the same phrase compress.' },
      {
        ask: 'At 120 bpm, one beat lasts…',
        options: ['half a second', 'one second', 'two seconds'],
        answer: 0
      },
      { say: 'Half a second. Sixty seconds divided by 120 beats — the tempo slider is doing arithmetic you can hear.' }
    ]
  },
  {
    id: 'mus.uni.phrase', world: 'music', stage: 'uni',
    start: { tempo: 100 },
    title: 'A phrase is a claim you can test',
    beats: [
      { say: 'The phrase tracker counts notes in order. It does not care about speed — only about the sequence being right.' },
      { set: { tempo: 60 }, hold: 2, say: 'Slower, so the sequence is easy to hear.' },
      {
        ask: 'Changing the tempo and keeping the same notes means the phrase is…',
        options: ['a different phrase', 'the same phrase at a different speed', 'wrong'],
        answer: 1
      },
      { say: 'The same phrase at a different speed. Pitch order and pulse rate are separate things — the instrument keeps them separate too.' }
    ]
  },

  /* ------------------------------------------------------------------ earth */
  {
    id: 'earth.p.globe', world: 'earth', stage: 'p',
    start: { year: 2020 },
    title: 'One place, many dates',
    beats: [
      { say: 'Spin the globe and tap a country. The dossier tells you what happened there in the year you choose.' },
      { set: { year: 1900 }, hold: 2, say: 'Move the timeline back and the list of events changes.' },
      {
        ask: 'The timeline lets you see a place as a stack of…',
        options: ['maps', 'times', 'sizes'],
        answer: 1
      },
      { say: 'Times. A country is not just a shape on a map — it is a stack of moments, and the slider moves through them.' }
    ]
  },
  {
    id: 'earth.uni.source', world: 'earth', stage: 'uni',
    start: { year: 1780 },
    title: 'Borders are a claim with a date',
    beats: [
      { say: 'The outlines come from Natural Earth 110m data and are projected live. They show modern borders, not historical ones.' },
      { set: { year: 2020 }, hold: 2, say: 'The dated events are a curated sample; the geometry is a separate dataset.' },
      {
        ask: 'When a map shows borders without a date, it is implying the borders are…',
        options: ['temporary', 'timeless', 'sample data'],
        answer: 1
      },
      { say: 'Timeless — which is the trap. Every boundary has a date; the full product will morph them as you scrub instead of holding them still.' }
    ]
  },

  /* -------------------------------------------------------------------- cs */
  {
    id: 'cs.p.race', world: 'cs', stage: 'p',
    start: { array_size: 16, steps_per_frame: 4 },
    title: 'Sorting is a race you can time',
    beats: [
      { say: 'Two lanes, same numbers. Each dot on the curve is one comparison the algorithm actually made.' },
      { set: { array_size: 32 }, hold: 2, say: 'A bigger array gives the race more room to separate.' },
      {
        ask: 'The dashed curve in the background shows…',
        options: ['the number of items', 'n log n growth', 'the timer'],
        answer: 1
      },
      { say: 'n log n growth. It is a reference shape, not a promise — the dots are measurements, and that is the point.' }
    ]
  },
  {
    id: 'cs.ls.steps', world: 'cs', stage: 'ls',
    start: { array_size: 24, steps_per_frame: 4 },
    title: 'Slow it down to see it',
    beats: [
      { say: 'Steps per frame controls how much work happens before the next draw. It changes the speed of the picture, not the count.' },
      { set: { steps_per_frame: 12 }, hold: 2, say: 'More steps per frame — the sort finishes sooner on screen.' },
      {
        ask: 'Lowering steps per frame changes the comparison count by…',
        options: ['a lot', 'nothing', 'half'],
        answer: 1
      },
      { say: 'Nothing. The algorithm does the same work; you are only changing how fast you are allowed to watch it.' }
    ]
  },
  {
    id: 'cs.uni.growth', world: 'cs', stage: 'uni',
    start: { array_size: 8, steps_per_frame: 6 },
    title: 'Growth is about shape, not size',
    beats: [
      { say: 'A curve that grows like n log n and one that grows like n² may be close at small n and far apart at large n.' },
      { set: { array_size: 64 }, hold: 2, say: 'Push the array size up and watch the lanes separate.' },
      {
        ask: 'Doubling n for an n² algorithm multiplies the work by about…',
        options: ['two', 'four', 'ten'],
        answer: 1
      },
      { say: 'Four. That is why the shape of the curve matters more than any single measurement you make at one size.' }
    ]
  },

  /* -------------------------------------------------------------- language */
  {
    id: 'lang.p.speed', world: 'language', stage: 'p',
    start: { voice_speed: 0.8 },
    title: 'Slow speech is a tool',
    beats: [
      { say: 'Voice speed changes how fast the sentence is spoken. Nothing about the language changes.' },
      { set: { voice_speed: 0.5 }, hold: 2, say: 'Half speed — every word is still in the same order.' },
      {
        ask: 'Slowing the voice makes each word…',
        options: ['longer', 'different', 'shorter'],
        answer: 0
      },
      { say: 'Longer. Slower audio is a way to hear the structure of a sentence you would otherwise run past.' }
    ]
  },
  {
    id: 'lang.us.order', world: 'language', stage: 'us',
    start: { voice_speed: 0.7 },
    title: 'Order carries the meaning',
    beats: [
      { say: 'The sentence game asks you to place words. The order is the grammar — the same words in the wrong order stop meaning anything.' },
      { set: { voice_speed: 1 }, hold: 2, say: 'Normal speed, so you can hear the whole sentence first.' },
      {
        ask: 'Two sentences with the same words in a different order usually have…',
        options: ['the same meaning', 'a different meaning', 'no meaning'],
        answer: 1
      },
      { say: 'A different meaning. That is why the coach counts clean runs rather than just words placed.' }
    ]
  },
  {
    id: 'lang.uni.voice', world: 'language', stage: 'uni',
    start: { voice_speed: 0.5 },
    title: 'Listen at two speeds',
    beats: [
      { say: 'Hear a sentence slowly, then at speed. Your ear recognises the same sequence even when the timing changes completely.' },
      { set: { voice_speed: 1.4 }, hold: 2, say: 'Fast now. The words are the same.' },
      {
        ask: 'What stays constant when voice speed changes?',
        options: ['the order of the words', 'the length of each word', 'the voice itself'],
        answer: 0
      },
      { say: 'The order of the words. Timing and sequence are independent — the same distinction music makes between tempo and phrase.' }
    ]
  },

  /* ------------------------------------------------------------------ space */
  {
    id: 'astro.p.orbits', world: 'astro', stage: 'p',
    start: { time: 0 },
    title: 'Everything is moving',
    beats: [
      { say: 'The time slider runs the solar system. The inner planets go round quickly; the outer ones barely seem to move.' },
      { set: { time: 5 }, hold: 2, say: 'Five years on — notice which planets have completed a lap.' },
      {
        ask: 'A planet further from the sun takes…',
        options: ['less time to orbit', 'more time to orbit', 'the same time'],
        answer: 1
      },
      { say: 'More time. That is Kepler’s third law, and you can watch it happen instead of memorising it.' }
    ]
  },
  {
    id: 'astro.uni.kepler', world: 'astro', stage: 'uni',
    start: { time: 0 },
    title: 'Ellipses, not circles',
    beats: [
      { say: 'Positions come from orbital elements solved through Kepler’s equation each frame. The paths are ellipses even when they look round.' },
      { set: { time: 15 }, hold: 2, say: 'Fifteen years — Neptune has still not finished one orbit.' },
      {
        ask: 'The default view compresses distance by √a. What does that do?',
        options: ['nothing', 'makes inner planets visible', 'changes the orbits'],
        answer: 1
      },
      { say: 'Makes the inner planets visible. It is a presentation choice, not physics — switching it off shows the true scale.' }
    ]
  },

  /* ------------------------------------------------------------------- bio */
  {
    id: 'bio.p.change', world: 'bio', stage: 'p',
    start: { environment_optimum: 0.5, selection_strength: 0.3, mutation_rate: 0.02 },
    title: 'The population moves',
    beats: [
      { say: 'The distribution shows a trait in a population. Selection pushes its average toward whatever the environment favours.' },
      { set: { selection_strength: 0.8 }, hold: 2, say: 'Stronger selection — watch the average shift faster.' },
      {
        ask: 'Selection changes the average trait by…',
        options: ['favouring some traits over others', 'changing every individual equally', 'stopping variation'],
        answer: 0
      },
      { say: 'Favouring some traits over others. The whole population does not change at once — the mix of individuals does.' }
    ]
  },
  {
    id: 'bio.uni.landscape', world: 'bio', stage: 'uni',
    start: { environment_optimum: 0.2, selection_strength: 0.6, mutation_rate: 0.01 },
    title: 'A landscape with one peak',
    beats: [
      { say: 'The fitness landscape is a Gaussian surface. Move its optimum and the population climbs toward the new peak.' },
      { set: { environment_optimum: 0.8 }, hold: 2, say: 'The environment has moved; the old average is now far from the optimum.' },
      {
        ask: 'A Gaussian fitness landscape is a…',
        options: ['measurement from the wild', 'simplification that still shows the mechanism', 'proof of evolution'],
        answer: 1
      },
      { say: 'A simplification that still shows the mechanism. The mean really moves and the spread really responds, even though the landscape is idealised.' }
    ]
  },

  /* ------------------------------------------------------------------ data */
  {
    id: 'stats.p.draw', world: 'stats', stage: 'p',
    start: { sample_size_n: 4, samples_per_frame: 3 },
    title: 'Small samples jump around',
    beats: [
      { say: 'Each bar is one sample of n draws. With only four in a sample, the bars scatter widely.' },
      { set: { sample_size_n: 10 }, hold: 2, say: 'Ten per sample — the scatter starts to tighten.' },
      {
        ask: 'With a small n, the spread of sample means is…',
        options: ['larger', 'smaller', 'zero'],
        answer: 0
      },
      { say: 'Larger. Averaging more draws is what makes the result settle down — that is the whole idea of the standard error.' }
    ]
  },
  {
    id: 'stats.ls.predict', world: 'stats', stage: 'ls',
    start: { sample_size_n: 5, samples_per_frame: 2 },
    title: 'The curve was not fitted',
    beats: [
      { say: 'The white curve is the predicted normal with mean μ and spread σ/√n. It was calculated before the bars were drawn.' },
      { set: { sample_size_n: 30 }, hold: 2, say: 'Thirty per sample — the bars should now follow the curve closely.' },
      {
        ask: 'When the bars track the white curve, that is…',
        options: ['a coincidence', 'the central limit theorem at work', 'a fitted line'],
        answer: 1
      },
      { say: 'The central limit theorem. Nothing was fitted to the data — the prediction came from n, and the bars had to catch up to it.' }
    ]
  },

  /* --------------------------------------------------------------- climate */
  {
    id: 'cli.p.sun', world: 'climate', stage: 'p',
    start: { solar_output: 1, albedo_reflectivity: 0.3, emissivity_lower_traps_more: 0.6 },
    title: 'In, out, and balance',
    beats: [
      { say: 'Sunlight arrives, some is reflected, and the rest leaves as heat. Where those balance is the equilibrium temperature.' },
      { set: { solar_output: 1.1 }, hold: 2, say: 'More sunlight — the balance point moves.' },
      {
        ask: 'If more energy comes in than leaves, the surface temperature…',
        options: ['falls', 'rises', 'does not change'],
        answer: 1
      },
      { say: 'Rises until outgoing radiation catches up. That is the entire mechanism the one-layer model is showing.' }
    ]
  },
  {
    id: 'cli.uni.feedback', world: 'climate', stage: 'uni',
    start: { solar_output: 1, albedo_reflectivity: 0.3, emissivity_lower_traps_more: 0.6 },
    title: 'One layer, and the missing gap',
    beats: [
      { say: 'T = ((S/4)(1−α) / εσ)^¼. One layer, no ocean, no clouds — the formula is exact for that toy world.' },
      { set: { emissivity_lower_traps_more: 0.9 }, hold: 2, say: 'Stronger trapping — equilibrium climbs.' },
      {
        ask: 'A real climate model is several degrees warmer than this one because of…',
        options: ['a different Stefan–Boltzmann constant', 'feedbacks this model leaves out', 'more sunlight'],
        answer: 1
      },
      { say: 'Feedbacks this model leaves out. The gap between the toy result and the real one is the interesting part, not an error.' }
    ]
  },

  /* ------------------------------------------------------------------ build */
  {
    id: 'eng.p.bridge', world: 'eng', stage: 'p',
    start: { bottom_chord: 120, top_chord: 100, diagonals: 80 },
    title: 'A triangle will not wobble',
    beats: [
      { say: 'The truss holds its shape because its members form triangles. Change a member and the forces redistribute.' },
      { set: { bottom_chord: 300 }, hold: 2, say: 'A heavier bottom chord — watch the stress colour change.' },
      {
        ask: 'Triangles are used in trusses because they are…',
        options: ['stiff', 'cheap', 'flexible'],
        answer: 0
      },
      { say: 'Stiff. Their shape cannot change without a member changing length, which is why the solver can treat them as a system of equations.' }
    ]
  },
  {
    id: 'eng.ls.cost', world: 'eng', stage: 'ls',
    start: { bottom_chord: 120, top_chord: 100, diagonals: 80 },
    title: 'Strong and cheap pull apart',
    beats: [
      { say: 'The panel shows both a factor of safety and a material cost. Making everything thicker is not free.' },
      { set: { diagonals: 400 }, hold: 2, say: 'Thick diagonals — safer, but the cost rises.' },
      {
        ask: 'Raising every member size usually…',
        options: ['lowers cost', 'raises cost', 'changes nothing'],
        answer: 1
      },
      { say: 'Raises cost. Engineering is choosing where the strength is actually needed — that trade-off is the point of the instrument.' }
    ]
  },

  /* ---------------------------------------------------- searching instrument */
  {
    id: 'cs.search.linear', world: 'cs', stage: 'ls', instrument: 'search',
    start: { search_size: 16, target_value: 30 },
    title: 'Scanning from the start costs the position',
    beats: [
      { say: 'The list is sorted and the highlighted value is the one you want. Linear scan checks every item from the left until it arrives.' },
      { set: { target_value: 30 }, hold: 2, say: 'Thirty sits near the end of this list.' },
      {
        say: 'Read the linear step count: it equals the position of the target in the list.',
        until: { obs: 'linear_steps', op: '>=', value: 15 },
        hint: 'Raise Target value toward the end of the list.'
      },
      {
        ask: 'Doubling the length of the list and keeping the target last makes a linear scan take…',
        options: ['about twice as many steps', 'about half as many steps', 'the same steps'],
        answer: 0
      }
    ]
  },
  {
    id: 'cs.search.binary', world: 'cs', stage: 'us', instrument: 'search',
    start: { search_size: 64, target_value: 100 },
    title: 'Halving asks far fewer questions',
    beats: [
      { say: 'Binary search compares with the middle, then throws away the half that cannot contain the target.' },
      { set: { search_size: 64, target_value: 128 }, hold: 2, say: 'The largest value in a sixty-four item list.' },
      {
        say: 'Keep the binary count at seven or fewer — the goal for a list this size.',
        until: { goal: true },
        hint: 'A sorted list of 64 needs at most 7 halving steps.'
      },
      {
        ask: 'Each binary comparison reduces the remaining list by…',
        options: ['one item', 'half', 'a quarter'],
        answer: 1
      }
    ]
  },

  /* ---------------------------------------------------- seasons instrument */
  {
    id: 'cli.seasons.tilt', world: 'climate', stage: 'ls', instrument: 'seasons',
    start: { axial_tilt: 0, orbital_distance: 1 },
    title: 'No tilt, no seasons',
    beats: [
      { say: 'With the axis straight up, every latitude gets the same light all year. The two means sit on top of each other.' },
      { set: { axial_tilt: 23.5 }, hold: 2, say: 'Earth’s tilt opens the gap.' },
      {
        say: 'Make the season contrast at least 20 °C.',
        until: { obs: 'season_contrast', op: '>=', value: 20 },
        hint: 'Raise Axial tilt toward 35°.'
      },
      {
        ask: 'The swing between summer and winter is set mainly by…',
        options: ['axial tilt', 'orbital distance', 'the length of the day'],
        answer: 0
      }
    ]
  },
  {
    id: 'cli.seasons.distance', world: 'climate', stage: 'us', instrument: 'seasons',
    start: { axial_tilt: 23.5, orbital_distance: 1.1 },
    title: 'Distance moves both seasons together',
    beats: [
      { say: 'Pull the planet away and both means fall. The gap between them barely changes.' },
      { set: { orbital_distance: 0.9 }, hold: 2, say: 'Closer in, both warmer.' },
      {
        say: 'Reach at least 30 °C of contrast — the goal for this instrument.',
        until: { goal: true },
        hint: 'Raise Axial tilt; distance only slides the pair up or down.'
      },
      {
        ask: 'Moving the planet closer to the sun changes the seasonal contrast by…',
        options: ['a lot', 'very little', 'it reverses it'],
        answer: 1
      }
    ]
  },

  /* ------------------------------------- second instruments, worlds 6 of 9 */
  {
    id: 'earth.compare', world: 'earth', stage: 'ls', instrument: 'compare',
    start: { first_place: 1, second_place: 2 },
    title: 'Two places, one question',
    beats: [
      { say: 'Choose two places and read them together. A dossier tells you about one; a comparison asks what is different.' },
      { set: { first_place: 4, second_place: 9 }, hold: 2, say: 'Two different places now sit side by side.' },
      {
        say: 'Open at least two distinct places on the counter.',
        until: { obs: 'places_opened', op: '>=', value: 2 },
        hint: 'Move First place and Second place so they are not the same.'
      },
      {
        ask: 'Comparing two places is most useful when you hold one thing steady, such as…',
        options: ['the year', 'their names', 'their size'],
        answer: 0
      }
    ]
  },
  {
    id: 'earth.compare.year', world: 'earth', stage: 'us', instrument: 'compare',
    start: { first_place: 1, second_place: 7 },
    title: 'A comparison needs a date',
    beats: [
      { say: 'Both cards show the same year. Change the timeline on the globe and the comparison inherits it.' },
      { set: { first_place: 2, second_place: 10 }, hold: 2, say: 'A new pair, still on the same date.' },
      {
        ask: 'If two dossiers are compared at different dates, the honest reading is that…',
        options: ['they are directly comparable', 'the dates must be named', 'the years do not matter'],
        answer: 1
      },
      { say: 'Name the date with the comparison. Otherwise you are comparing two different moments and calling it one.' }
    ]
  },
  {
    id: 'lang.pace', world: 'language', stage: 'p', instrument: 'pace',
    start: { words_per_minute: 120, passage_words: 120 },
    title: 'Reading is a rate you can change',
    beats: [
      { say: 'Words per minute and passage length decide how long reading takes. Nothing about the language changes.' },
      { set: { words_per_minute: 240 }, hold: 2, say: 'Double the pace and the same passage takes half as long.' },
      {
        say: 'Get the reading time down to 60 seconds or less.',
        until: { obs: 'reading_seconds', op: '<=', value: 60 },
        hint: 'Raise Words per minute or shorten the passage.'
      },
      {
        ask: 'At 120 words per minute, a 120-word passage takes…',
        options: ['30 seconds', '60 seconds', '2 minutes'],
        answer: 1
      }
    ]
  },
  {
    id: 'lang.pace.band', world: 'language', stage: 'us', instrument: 'pace',
    start: { words_per_minute: 90, passage_words: 160 },
    title: 'The pace band is a label, not a score',
    beats: [
      { say: 'The band just names a speed range. It does not say whether you understood anything.' },
      { set: { words_per_minute: 260 }, hold: 2, say: 'Faster now — the band changes, the words do not.' },
      {
        say: 'Move the pace band up to its fastest setting.',
        until: { obs: 'pace_band', op: '>=', value: 2 },
        hint: 'Raise Words per minute past 230.'
      },
      {
        ask: 'A faster word rate guarantees…',
        options: ['better understanding', 'nothing about understanding', 'fewer words'],
        answer: 1
      }
    ]
  },
  {
    id: 'astro.moon', world: 'astro', stage: 'p', instrument: 'moon',
    start: { phase_angle: 0, moon_distance: 1 },
    title: 'The moon has a phase you can turn',
    beats: [
      { say: 'Phase angle is the geometry of sun, moon and Earth. Turning it walks the moon through its cycle.' },
      { set: { phase_angle: 180 }, hold: 2, say: 'Halfway round — look at the illuminated fraction.' },
      {
        say: 'Bring the illuminated fraction to 0.99 or more.',
        until: { obs: 'illuminated_fraction', op: '>=', value: 0.99 },
        hint: 'Set Phase angle to 180°.'
      },
      {
        ask: 'A full moon happens when the illuminated fraction is…',
        options: ['near zero', 'near one', 'exactly half'],
        answer: 1
      }
    ]
  },
  {
    id: 'astro.moon.distance', world: 'astro', stage: 'us', instrument: 'moon',
    start: { phase_angle: 90, moon_distance: 1 },
    title: 'Distance changes size, not phase',
    beats: [
      { say: 'Move the moon closer and the disc may look different in size, but the lit fraction is set by geometry alone.' },
      { set: { moon_distance: 0.9 }, hold: 2, say: 'Closer now — the phase is unchanged.' },
      {
        ask: 'Changing Moon distance changes the illuminated fraction by…',
        options: ['a lot', 'nothing', 'it doubles it'],
        answer: 1
      },
      { say: 'Phase is an angle. Distance belongs to a different question entirely — the app keeps the two knobs separate.' }
    ]
  },
  {
    id: 'bio.genetics', world: 'bio', stage: 'ls', instrument: 'genetics',
    start: { allele_from_a: 1, allele_from_b: 0 },
    title: 'Four boxes from two alleles',
    beats: [
      { say: 'Each parent contributes one allele. The four boxes show every combination that can result.' },
      { set: { allele_from_a: 1, allele_from_b: 1 }, hold: 2, say: 'Both parents contribute the dominant allele now.' },
      {
        say: 'Make the dominant fraction at least 0.75.',
        until: { obs: 'dominant_fraction', op: '>=', value: 0.75 },
        hint: 'Set both Allele from A and Allele from B to 1.'
      },
      {
        ask: 'When both parents carry only the dominant allele, every box shows…',
        options: ['a dominant allele', 'only recessive alleles', 'a mix of both'],
        answer: 0
      }
    ]
  },
  {
    id: 'bio.genetics.hetero', world: 'bio', stage: 'us', instrument: 'genetics',
    start: { allele_from_a: 0, allele_from_b: 1 },
    title: 'A hidden allele can still be passed on',
    beats: [
      { say: 'The heterozygous fraction counts boxes with one of each allele. Those boxes look dominant but carry the other one.' },
      { set: { allele_from_a: 0, allele_from_b: 1 }, hold: 2, say: 'One of each parent — half the boxes are mixed.' },
      {
        ask: 'A box with one dominant and one recessive allele shows…',
        options: ['the dominant trait', 'the recessive trait', 'a blend'],
        answer: 0
      },
      { say: 'This is why a trait can reappear later: the allele was carried even when it was not shown.' }
    ]
  },
  {
    id: 'stats.hypothesis', world: 'stats', stage: 'ls', instrument: 'hypothesis',
    start: { hypothesised_mean: 50, true_mean: 50 },
    title: 'A claim can be tested against a gap',
    beats: [
      { say: 'One number is the claim, the other is the world. The gap between them is what a test measures.' },
      { set: { true_mean: 70 }, hold: 2, say: 'The world has moved twenty away from the claim.' },
      {
        say: 'Make the gap at least ten.',
        until: { obs: 'difference', op: '>=', value: 10 },
        hint: 'Move True mean away from Hypothesised mean.'
      },
      {
        ask: 'If the claimed mean and the true mean are equal, the difference is…',
        options: ['zero', 'one', 'unknown'],
        answer: 0
      }
    ]
  },
  {
    id: 'stats.hypothesis.power', world: 'stats', stage: 'us', instrument: 'hypothesis',
    start: { hypothesised_mean: 50, true_mean: 55 },
    title: 'Two standard errors is a decision, not a proof',
    beats: [
      { say: 'The gap is measured in standard errors. Two of them is a convention for calling a result detectable.' },
      { set: { true_mean: 65 }, hold: 2, say: 'Fifteen above the claim — three standard errors.' },
      {
        say: 'Reach the detectable flag.',
        until: { obs: 'detectable', op: '>=', value: 1 },
        hint: 'Move True mean until the gap is at least ten.'
      },
      {
        ask: 'Calling a result detectable means…',
        options: ['it is certainly true', 'it passes a threshold', 'it cannot be wrong'],
        answer: 1
      }
    ]
  },
  {
    id: 'eng.materials', world: 'eng', stage: 'p', instrument: 'materials',
    start: { member_width: 40, material: 0 },
    title: 'The material choice survives the width',
    beats: [
      { say: 'A wider member carries more and weighs more. The ratio between them is what the material decides.' },
      { set: { member_width: 80 }, hold: 2, say: 'Double the width — watch both numbers rise.' },
      {
        say: 'Reach a strength-to-weight ratio of at least 1.2.',
        until: { goal: true },
        hint: 'Choose wood — the third material — in the Materials slider.'
      },
      {
        ask: 'Changing only the width changes the strength-to-weight ratio by…',
        options: ['a lot', 'nothing', 'it halves it'],
        answer: 1
      }
    ]
  },
  {
    id: 'eng.materials.trade', world: 'eng', stage: 'us', instrument: 'materials',
    start: { member_width: 40, material: 0 },
    title: 'Strong and light are different claims',
    beats: [
      { say: 'Steel has the highest yield load here; wood has the best ratio. Which one matters depends on the question.' },
      { set: { material: 2 }, hold: 2, say: 'Wood now shows its advantage.' },
      {
        ask: 'If the question is strength for the least mass, the numbers point to…',
        options: ['steel', 'aluminium', 'wood'],
        answer: 2
      },
      { say: 'These are simplified factors for a model, not engineering data — the note says exactly what is left out.' }
    ]
  },

  /* ------------------------------------------- engineering, staged goals */
  {
    id: 'eng.p.color', world: 'eng', stage: 'p',
    start: { bottom_chord: 200, top_chord: 200, diagonals: 200 },
    title: 'Harder lines look louder',
    beats: [
      { say: 'Predict which lines will glow hardest under the yellow load. The colour is stress: force spread over the area you gave that group.' },
      {
        ask: 'Which chord is pulled apart rather than squashed?',
        options: ['the top chord', 'the bottom chord', 'neither'],
        answer: 1
      },
      { set: { bottom_chord: 100 }, hold: 2, say: 'Thin only the bottom chord — watch its colour and the safety factor change.' },
      {
        say: 'Put steel back until the bridge stands again with a factor of safety of at least 1.2.',
        until: { obs: 'factor_of_safety', op: '>=', value: 1.2 },
        hint: 'Raise Bottom chord above 100 mm² while keeping it thinner than the top chord.'
      },
      { say: 'Same load, less area, more stress. The colours were the stress all along — not a decoration.' }
    ]
  },
  {
    id: 'eng.ls.stress', world: 'eng', stage: 'ls',
    start: { bottom_chord: 100, top_chord: 200, diagonals: 80 },
    title: 'Stress is force divided by area',
    beats: [
      { say: 'The bottom chord is already the thinnest, so it is the governing group. Stress is force over area — same force, less steel, closer to breaking.' },
      {
        say: 'Reach a factor of safety of 1.5 with the peak stress still in the bottom chord.',
        until: { goal: true },
        hint: 'Add bottom-chord area a little at a time; watch Governing group change if you overshoot.'
      },
      {
        ask: 'If the force in a member stays the same and you halve its area, its stress…',
        options: ['halves', 'doubles', 'is unchanged'],
        answer: 1
      },
      { say: 'Doubles. That is the whole idea: the solver holds the forces fixed while you choose the areas.' }
    ]
  },
  {
    id: 'eng.uni.critical', world: 'eng', stage: 'uni',
    start: { bottom_chord: 120, top_chord: 100, diagonals: 80 },
    title: 'The cheapest design that still holds',
    beats: [
      { say: 'A structure that simply stands is not yet a design. Find one that carries the load safely, cheaply, and without huge spare steel.' },
      {
        say: 'Get the factor of safety to 2.5 or more while keeping the cost at $95 or less.',
        until: { obs: 'factor_of_safety', op: '>=', value: 2.5 },
        hint: 'Spend on the governing group, which the progress line names.'
      },
      {
        say: 'Keep that safety factor but spend no more than $95.',
        until: { obs: 'material_cost', op: '<=', value: 95 },
        hint: 'Trim the members that are nowhere near their allowable stress.'
      },
      {
        say: 'Now tune it so the critical group sits at 85% of its allowable or more — no gross overbuild.',
        until: { obs: 'peak_utilisation', op: '>=', value: 85 },
        hint: 'Add or remove steel until Peak utilisation passes 85%.'
      },
      {
        ask: 'A utilisation of 100% means the governing member is…',
        options: ['right at its allowable stress', 'certain to have collapsed', 'carrying no force'],
        answer: 0
      },
      { say: 'Right at the allowable. Your final governing group set the design; everything else was bracing or spare steel, and the reading came from the solver.' }
    ]
  },

  /* ------------------------------------- second instruments, worlds 1 of 3 */
  {
    id: 'chem.isotopes', world: 'chem', stage: 'ls', instrument: 'isotopes',
    start: { atomic_number: 6, neutrons: 6 },
    title: 'An isotope is the same element with a different mass',
    beats: [
      { say: 'The element fixes the proton count. Neutrons are the only thing this slider changes.' },
      { set: { neutrons: 8 }, hold: 2, say: 'Same element, two more neutrons — a heavier nucleus.' },
      {
        say: 'Bring the stability reading to at least 0.8.',
        until: { obs: 'stability', op: '>=', value: 0.8 },
        hint: 'Move Neutrons until the neutron-to-proton ratio suits this element.'
      },
      {
        ask: 'Adding neutrons changes the element’s identity by…',
        options: ['nothing', 'making it a new element', 'changing its charge'],
        answer: 0
      }
    ]
  },
  {
    id: 'chem.isotopes.heavy', world: 'chem', stage: 'us', instrument: 'isotopes',
    start: { atomic_number: 82, neutrons: 126 },
    title: 'Heavy nuclei want more neutrons',
    beats: [
      { say: 'For a heavy element a balanced nucleus needs more neutrons than protons. The target shifts with atomic number.' },
      { set: { atomic_number: 82, neutrons: 100 }, hold: 2, say: 'Too few neutrons for this element — the stability readout falls.' },
      {
        ask: 'As atomic number grows, the stable neutron-to-proton ratio…',
        options: ['rises', 'falls', 'stays at one'],
        answer: 0
      },
      { say: 'This model uses a single ideal ratio per region. It shows the trend, not a table of real isotopes.' }
    ]
  },
  {
    id: 'art.palette', world: 'art', stage: 'p', instrument: 'palette',
    start: { mix_ratio: 0, base_value: 20 },
    title: 'A value is a number you can mix',
    beats: [
      { say: 'Two greys and a ratio. The middle swatch is the blend — the same idea a painter uses on a palette.' },
      { set: { mix_ratio: 50, base_value: 20 }, hold: 2, say: 'Halfway between a dark and a light grey.' },
      {
        say: 'Bring the mixed value into the middle band, between 40 and 60.',
        until: { obs: 'mixed_value', op: '>=', value: 40 },
        hint: 'Raise Mix ratio or change Base value.'
      },
      {
        ask: 'At a mix ratio of 50, the result sits…',
        options: ['halfway between the two values', 'at the darker value', 'at the lighter value'],
        answer: 0
      }
    ]
  },
  {
    id: 'art.palette.steps', world: 'art', stage: 'us', instrument: 'palette',
    start: { mix_ratio: 100, base_value: 100 },
    title: 'Five steps are enough to build a picture',
    beats: [
      { say: 'Value steps round the continuous scale into the five buckets a studio uses.' },
      { set: { base_value: 10, mix_ratio: 0 }, hold: 2, say: 'Dark end of the scale — the step count drops.' },
      {
        ask: 'A work with only two distinct values will read as…',
        options: ['flat', 'photorealistic', 'colourful'],
        answer: 0
      },
      { say: 'The palette is a linear mix of two greys — a model of the idea, not a paint simulator.' }
    ]
  },
  {
    id: 'mus.tuning', world: 'music', stage: 'ls', instrument: 'tuning',
    start: { note_frequency: 440, reference: 440 },
    title: 'Two frequencies either agree or beat',
    beats: [
      { say: 'When a note and a reference match, the two waves line up. Cents off measures how far apart they are.' },
      { set: { note_frequency: 466, reference: 440 }, hold: 2, say: 'A little sharp — the beat rate appears.' },
      {
        say: 'Get within five cents of the reference — the goal for this instrument.',
        until: { goal: true },
        hint: 'Move Note frequency toward the Reference value.'
      },
      {
        ask: 'Cents off is a measure of…',
        options: ['how loud a note is', 'how far a pitch is from the reference', 'how long a note lasts'],
        answer: 1
      }
    ]
  },
  {
    id: 'mus.tuning.beats', world: 'music', stage: 'us', instrument: 'tuning',
    start: { note_frequency: 445, reference: 440 },
    title: 'Beat rate is the gap between frequencies',
    beats: [
      { say: 'Play two close frequencies together and you hear a slow pulsing. Its rate is the difference between them.' },
      { set: { note_frequency: 450, reference: 440 }, hold: 2, say: 'Ten hertz apart — ten pulses a second.' },
      {
        say: 'Read a beat rate of at least five hertz.',
        until: { obs: 'beat_rate', op: '>=', value: 5 },
        hint: 'Move Note frequency further from Reference.'
      },
      {
        ask: 'Two tones at 440 and 444 hertz beat at…',
        options: ['2 hertz', '4 hertz', '884 hertz'],
        answer: 1
      }
    ]
  }
];

export function lessonsFor(worldId) {
  return LESSONS.filter((l) => l.world === worldId);
}

/* Structured enrichment keyed by lesson id, merged from the research pass. */
export const ENRICHMENT = {
  "phy.pattern": {
    "key": "Two slits turn one beam into bright and dark bands whose width is λL/d.",
    "why": "Each slit sends out a wave, and their path difference decides whether the two arrive in step and add or opposed and cancel. Shrinking the separation reduces that path difference at a given point, so the bands spread out.",
    "mistake": "Reading fringe width as fixed by the screen rather than by wavelength and separation. Check which knob moves the width: closer slits widen the bands, they do not squeeze them.",
    "worked": {
      "q": "At a wavelength of 550 nm, what happens to fringe width when slit separation drops from 6 µm to 3 µm?",
      "steps": [
        "Fringe width is w = λL/d with the screen distance fixed.",
        "The wavelength stays at 550 nm, so only the separation changes.",
        "Halving d from 6 to 3 µm doubles w, so the bands spread apart."
      ],
      "a": "Fringe width doubles and the pattern opens up."
    },
    "sources": [
      "OpenStax University Physics"
    ],
    "prereqs": []
  },
  "phy.five": {
    "key": "Hitting exactly five fringes means tuning wavelength and separation until the band width fits the screen.",
    "why": "The screen holds a fixed span, so the count is set by how much of it each band takes. Fewer fringes need wider bands, which come from more separation or a longer wavelength.",
    "mistake": "Assuming the count can only be found by guessing at the sliders. Use w = λL/d to pick the direction first: widening the bands reduces how many fit.",
    "worked": {
      "q": "The screen shows more than five fringes. Which single change reduces the count?",
      "steps": [
        "Fringe width is w = λL/d.",
        "Fewer fringes fit when each band is wider.",
        "Raise the slit separation, or raise the wavelength, until the count reads five."
      ],
      "a": "Increase slit separation or wavelength until exactly five fringes remain."
    },
    "sources": [
      "OpenStax University Physics"
    ],
    "prereqs": [
      "phy.pattern"
    ]
  },
  "mat.amplitude": {
    "key": "In y = a·sin(bx + c) + d, amplitude a is the swing from the midline and d is the midline itself.",
    "why": "The sine term oscillates between -a and +a, and adding d translates the whole result. Separating the two keeps height from being confused with vertical position.",
    "mistake": "Calling the peak height the amplitude and folding the position into it. Read a from the swing about the centre line and read d from where that line sits.",
    "worked": {
      "q": "With a = 2 and d = 0, where are the peaks and troughs, and what happens if d becomes 1?",
      "steps": [
        "Amplitude a sets the distance from the midline to each extreme.",
        "With a = 2 and d = 0 the peaks are at +2 and the troughs at -2.",
        "Adding d = 1 lifts both, giving peaks at +3 and troughs at -1."
      ],
      "a": "Peaks +2 and troughs -2 at d = 0; +3 and -1 at d = 1."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "mat.period": {
    "key": "The period is 2π/b, so doubling the frequency halves the distance between repeats.",
    "why": "The argument bx advances b times as fast as x, so one full cycle takes 2π/b. The readout is scaled in units of π, which makes it read 2/b.",
    "mistake": "Treating b as the period instead of its reciprocal. Compute 2π/b first, then remember the app prints the answer in π units.",
    "worked": {
      "q": "With b = 2, what does the Period readout show?",
      "steps": [
        "One repeat takes 2π/b.",
        "In π units the readout is 2/b.",
        "With b = 2 that is 2/2 = 1, so the display reads 1.00π."
      ],
      "a": "1.00π, which is 2π/2."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "chem.pull": {
    "key": "Electronegativity grows toward the top right of the table, and fluorine pulls hardest at 3.98.",
    "why": "Across a row the same shell fills while nuclear charge rises; up a group the bonding electrons sit closer to the nucleus. Both effects strengthen the pull, excluding the noble gases with full shells.",
    "mistake": "Searching for the heaviest element instead of the strongest puller. Read the pulling-power colouring and go to the upper right, skipping the noble gases.",
    "worked": {
      "q": "Which element has the highest pulling power in this table, and what value does it read?",
      "steps": [
        "The pulling-power colouring grows stronger to the right and upward.",
        "The upper-right corner, excluding noble gases, holds fluorine.",
        "Fluorine reads 3.98, the largest value in the table."
      ],
      "a": "Fluorine, at 3.98."
    },
    "sources": [
      "Pauling electronegativity scale"
    ],
    "prereqs": []
  },
  "chem.families": {
    "key": "Elements in the same column behave alike because their outer shells have the same structure.",
    "why": "The table is arranged so that repeating outer-shell patterns line up in columns. A full outer shell leaves nothing to gain or lose, which is why the far-right column stays inert.",
    "mistake": "Explaining noble-gas calm by mass or rarity. Point to the full outer shell instead, and use it to predict that the column behaves alike.",
    "worked": {
      "q": "Why do the elements in the far-right column barely react?",
      "steps": [
        "The far-right column is the noble gases.",
        "Each has a full outer shell.",
        "With no drive to gain or lose electrons, they stay chemically calm."
      ],
      "a": "Because their outer shells are full."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "mat.p.repeat": {
    "key": "A wave is a shape that repeats, and b sets how often it repeats without changing its height.",
    "why": "The sine function cycles forever, and multiplying x by b makes it run through those cycles faster. The height is governed separately by a.",
    "mistake": "Reading a larger b as a taller wave. Track the two knobs separately: a changes height, b changes how many squeezes fit in the same span.",
    "worked": {
      "q": "If b goes from 1 to 3 while a stays at 1, what changes?",
      "steps": [
        "a controls height and b controls repeat frequency.",
        "With a fixed at 1, the peaks keep the same height.",
        "b = 3 fits three times as many repeats into the same span."
      ],
      "a": "It repeats three times as often; the height stays the same."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "mat.ls.midline": {
    "key": "A wave swings around the middle line d, so shifting d moves the whole range without changing the shape.",
    "why": "The sine term runs between -a and +a, and d is added to both extremes. Raising d until d - a reaches zero puts the lowest point exactly on the axis.",
    "mistake": "Assuming the curve is always centred on zero. Work from the lowest point, which is d - a, instead of guessing at the shift.",
    "worked": {
      "q": "With a = 1.5, what value of d makes the lowest point exactly zero?",
      "steps": [
        "The curve swings a = 1.5 above and below its midline d.",
        "The lowest point is d - a.",
        "Set d - 1.5 = 0, so d = 1.5."
      ],
      "a": "d = 1.5, giving a range from 0 to 3."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "mat.ls.two": {
    "key": "Amplitude and shift both raise the peaks, but only amplitude changes the shape.",
    "why": "Multiplying by a stretches the swing about the midline, while adding d carries an identical curve upward. Comparing the trough with the peak separates the two effects.",
    "mistake": "Treating the two knobs as interchangeable ways to reach higher. Check whether the swing grew (amplitude) or the whole curve lifted (shift).",
    "worked": {
      "q": "Which setting changes the shape: a = 2.5 with d = 0, or a = 1 with d = 1.5?",
      "steps": [
        "Amplitude stretches the curve; shift translates it.",
        "a = 2.5 stretches the swing, so the shape changes.",
        "a = 1 with d = 1.5 lifts the same shape without stretching it."
      ],
      "a": "a = 2.5 with d = 0 changes the shape."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "mat.amplitude",
      "mat.ls.midline"
    ]
  },
  "mat.us.phase": {
    "key": "Phase c slides the wave left or right, and a quarter-period slide turns a sine into a cosine.",
    "why": "Adding c changes where the cycle starts along x without touching the amplitude or the repeat spacing. A shift of π/2 moves the peaks by a quarter of the 2π cycle, which is exactly the cosine offset.",
    "mistake": "Reading a sideways slide as a stretch or a lift. Watch the zero crossings move while the height and the gap between them stay fixed.",
    "worked": {
      "q": "With a = 1 and b = 1, what does setting c to π/2 do to sin(x)?",
      "steps": [
        "Phase c shifts the curve horizontally.",
        "π/2 is a quarter of the 2π period.",
        "sin(x + π/2) matches cos(x), so the sine becomes a cosine."
      ],
      "a": "It becomes a cosine, with no change in height or spacing."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "mat.us.slope": {
    "key": "The steepest slope of a sinusoid is a times b, so a faster wave is steeper everywhere.",
    "why": "The derivative of a·sin(bx + c) is a·b·cos(bx + c), whose largest magnitude is a·b. Raising b makes the curve cover the same height in a shorter span.",
    "mistake": "Assuming amplitude alone sets steepness. Compute the maximum as a·b, so doubling b doubles the peak slope at fixed amplitude.",
    "worked": {
      "q": "At a = 2, what happens to the maximum slope when b goes from 1 to 2?",
      "steps": [
        "The peak slope of a·sin(bx) is a·b.",
        "With a = 2 and b = 1, the maximum is 2.",
        "Doubling b to 2 gives 2 × 2 = 4."
      ],
      "a": "The maximum slope doubles from 2 to 4."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "mat.uni.general": {
    "key": "Reading y = a·sin(bx + c) + d means reading four independent behaviours: swing, period, phase and midline.",
    "why": "Each letter changes one feature and leaves the others alone, so the general form can be decoded one letter at a time. In particular the period comes from 2π/b and appears as 2/b in the π-unit readout.",
    "mistake": "Reading b as the period itself rather than as the frequency in the denominator. Compute 2π/b and check the readout in π units.",
    "worked": {
      "q": "In y = a·sin(bx + c) + d with b = 3, what is the period?",
      "steps": [
        "One repeat takes 2π/b.",
        "Substituting b = 3 gives 2π/3.",
        "In the app’s π units that is about 0.67π."
      ],
      "a": "2π/3, shown as 0.67π."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "mat.uni.chain": {
    "key": "The maximum slope is ab because the chain rule differentiates the inside function too.",
    "why": "The derivative of a·sin(bx) is a·b·cos(bx): the b comes from differentiating bx. Doubling b makes the cycle turn faster, not cover more ground, so no extra factor appears.",
    "mistake": "Multiplying by an extra factor when b = 2, giving 8 instead of 4. Apply a·b·cos(bx) directly and read the peak as a·b.",
    "worked": {
      "q": "With a = 2 and b = 2, what is the maximum slope of a·sin(bx)?",
      "steps": [
        "The derivative is a·b·cos(bx).",
        "Its largest magnitude is a·b.",
        "2 × 2 = 4."
      ],
      "a": "4, not 8."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "mat.us.slope"
    ]
  },
  "phy.p.push": {
    "key": "A bigger force or a lighter mass sends the ball further because the two-second distance is 2F/m.",
    "why": "Acceleration is F/m and, with no drag, distance over two seconds is ½at² = 2F/m. Mass sits in the denominator, so raising it reduces the distance for the same push.",
    "mistake": "Assuming a heavier ball travels further under the same push. Read acceleration as F/m first, and the distance as that acceleration over two seconds.",
    "worked": {
      "q": "Six newtons act on a one-kilogram ball. How far does it travel in two seconds?",
      "steps": [
        "Acceleration is a = F/m = 6/1 = 6 m/s².",
        "Distance over two seconds is ½at².",
        "½ × 6 × 2² = 12 m."
      ],
      "a": "12 m, past the 6 m target."
    },
    "sources": [
      "OpenStax University Physics"
    ],
    "prereqs": []
  },
  "mat.p.share": {
    "key": "Sharing twelve objects into four even groups gives three each, with nothing left over.",
    "why": "Division asks for equal groups that use every object. Checking that four groups of three multiply back to twelve confirms the sharing is fair.",
    "mistake": "Stopping when the groups only look roughly equal while dots remain in the pile. Place every dot and confirm the groups match before reading the answer.",
    "worked": {
      "q": "Twelve objects shared into four even groups — how many in each?",
      "steps": [
        "Fair sharing means equal groups and no leftovers.",
        "Compute 12 ÷ 4.",
        "Four groups of three use all twelve objects."
      ],
      "a": "3 in each group."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "phy.uni.intensity": {
    "key": "Fringe spacing comes from the solved geometry, so doubling slit separation halves the fringe width.",
    "why": "The simulation computes where the two waves actually meet, and w = λL/d falls out of that path difference. With wavelength and screen distance fixed, d is the only denominator that can change.",
    "mistake": "Treating the width readout as proportional to separation because both appear together in the coach. Hold wavelength fixed and check the denominator: a larger d gives a smaller w.",
    "worked": {
      "q": "At 650 nm, slit separation goes from 4 µm to 8 µm. What happens to fringe width?",
      "steps": [
        "w = λL/d, so width scales inversely with d.",
        "The separation doubles from 4 to 8 µm with λ fixed.",
        "The width is multiplied by one half."
      ],
      "a": "Fringe width halves."
    },
    "sources": [
      "OpenStax University Physics"
    ],
    "prereqs": [
      "phy.pattern"
    ]
  },
  "chem.us.periods": {
    "key": "Electronegativity rises from left to right across a period as the same shell fills and the nuclear pull grows.",
    "why": "Within one row the added electrons enter the same shell, so shielding barely changes while nuclear charge increases. The stronger pull shows up as a higher electronegativity toward the right.",
    "mistake": "Carrying the down-a-group trend into a row and expecting the pull to weaken. Read across a single period, from sodium toward chlorine, to see the rise.",
    "worked": {
      "q": "Sodium (11) and chlorine (17) share a row. Which pulls harder, and why?",
      "steps": [
        "Both fill the same shell across that period.",
        "Moving right, nuclear charge grows while shielding barely changes.",
        "Chlorine at the right of the row pulls harder than sodium at the left."
      ],
      "a": "Chlorine, because the pull from the nucleus grows across the row."
    },
    "sources": [
      "Pauling electronegativity scale"
    ],
    "prereqs": [
      "chem.pull"
    ]
  },
  "chem.uni.shells": {
    "key": "A group is decided by outer-shell structure, not by mass or by a shared row.",
    "why": "Elements in one column share the arrangement of their outermost electrons, and that arrangement drives how they bond. Rows differ, but the outer-shell pattern repeats.",
    "mistake": "Sorting elements by mass or proton count and expecting similar behaviour. Check the outer-shell structure, which is what the group actually records.",
    "worked": {
      "q": "Why do elements in the same group behave alike even in different rows?",
      "steps": [
        "Group is set by the outer-shell structure.",
        "Moving down a group repeats that outer arrangement.",
        "Chemistry depends mostly on the outer shell, so the behaviour repeats."
      ],
      "a": "They share the same outer-shell structure."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "chem.families"
    ]
  },
  "chem.isotopes": {
    "key": "Isotopes of an element share the proton count and differ only in neutron count and mass.",
    "why": "The atomic number fixes which element it is, so changing neutrons only changes the nucleus, not the identity. Stability then depends on whether the neutron-to-proton ratio suits that element.",
    "mistake": "Thinking extra neutrons turn the atom into a new element. Anchor identity to the proton count and treat neutrons as a mass and stability knob.",
    "worked": {
      "q": "Carbon has six protons. If two neutrons are added, what changes?",
      "steps": [
        "Identity is fixed by the six protons, which stay put.",
        "Neutrons go from six to eight, raising the mass number from 12 to 14.",
        "The nucleus is heavier but still carbon."
      ],
      "a": "Only the mass changes; the element stays carbon."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "chem.isotopes.heavy": {
    "key": "Heavy nuclei need more neutrons than protons for stability, and the ideal ratio rises with atomic number.",
    "why": "As proton count grows, electrical repulsion grows and extra neutrons are needed to hold the nucleus together. The model uses one ideal ratio per region to show the trend.",
    "mistake": "Assuming a one-to-one neutron-to-proton ratio is stable for every element. Check the trend: the required ratio climbs with atomic number.",
    "worked": {
      "q": "For lead (atomic number 82), why does 100 neutrons read as unstable?",
      "steps": [
        "Stable heavy nuclei need more neutrons than protons.",
        "The ideal neutron-to-proton ratio rises with atomic number.",
        "100 neutrons for 82 protons sits below that target, so stability falls."
      ],
      "a": "The neutron-to-proton ratio is too low for a heavy nucleus."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "chem.isotopes"
    ]
  },
  "fast.physics.1": {
    "key": "Two lit slits make alternating bright and dark bands because the two waves add in step and cancel out of step.",
    "why": "Every point on the screen receives both waves, and their path difference decides the result. Where the difference is a whole number of wavelengths the amplitudes add; halfway between they cancel.",
    "mistake": "Picturing a single beam casting one shadow behind the barrier. Look for the path-difference pattern, which needs both openings lit at once.",
    "worked": {
      "q": "What produces the alternating bands on the screen?",
      "steps": [
        "Both slits send waves to every point on the screen.",
        "In step, the two waves add into a bright band.",
        "Out of step, they cancel into a dark band."
      ],
      "a": "Two waves overlapping and cancelling."
    },
    "sources": [
      "OpenStax University Physics"
    ],
    "prereqs": []
  },
  "fast.physics.2": {
    "key": "A target fringe count is a solvable setting because closer slits widen each band and fit fewer on the screen.",
    "why": "The screen covers a fixed span, so the count is set by band width. From w = λL/d, a larger d or a longer λ makes each band wider and reduces how many fit.",
    "mistake": "Assuming closer slits cram more bands onto the screen. Reason from w = λL/d: wider bands mean fewer of them fit.",
    "worked": {
      "q": "The screen shows more than five fringes. Which change brings the count down?",
      "steps": [
        "Fringe width follows w = λL/d.",
        "Lowering slit separation widens each band.",
        "Wider bands mean fewer fit, so the count falls toward five."
      ],
      "a": "Lower the slit separation until exactly five fringes remain."
    },
    "sources": [
      "OpenStax University Physics"
    ],
    "prereqs": []
  },
  "fast.physics.3": {
    "key": "Fringe width is a ratio you can dial in: wavelength and separation set w = λL/d with the screen fixed.",
    "why": "A longer wavelength makes each band wider, while a larger separation makes it narrower. The screen distance is held fixed in this world, leaving two knobs.",
    "mistake": "Raising slit separation when the goal is a wider band. Keep d in the denominator: lower it, or raise the wavelength, to stretch the fringes.",
    "worked": {
      "q": "With wavelength fixed, what does lowering slit separation do to fringe width?",
      "steps": [
        "Fringe width is w = λL/d.",
        "Wavelength and screen distance are unchanged.",
        "A smaller d makes the fraction larger, so the bands stretch."
      ],
      "a": "Fringe width increases."
    },
    "sources": [
      "OpenStax University Physics"
    ],
    "prereqs": []
  },
  "fast.physics.4": {
    "key": "Acceleration is the push divided by the mass being pushed, not the force alone.",
    "why": "Newton’s second law gives a = F/m: the same force on more matter builds speed more slowly. The readout performs that division each frame.",
    "mistake": "Reading the force number as the acceleration. Divide force by mass first; at 4 N on 4 kg the acceleration is only 1 m/s².",
    "worked": {
      "q": "At 4 N on 4 kg, what is the acceleration, and what force gives 6 m/s² at the same mass?",
      "steps": [
        "Acceleration is a = F/m.",
        "4 N on 4 kg gives 1 m/s².",
        "To reach 6 m/s², F = 6 × 4 = 24 N."
      ],
      "a": "1 m/s² now; 24 N is needed for 6 m/s²."
    },
    "sources": [
      "OpenStax University Physics"
    ],
    "prereqs": []
  },
  "fast.physics.5": {
    "key": "Two seconds turn acceleration into distance because d = ½at² with the time held fixed.",
    "why": "With no drag, the ball keeps accelerating, and the fixed two-second window makes distance proportional to a. Since a = F/m, doubling the force at fixed mass doubles the distance.",
    "mistake": "Treating the distance as a property of mass alone. Compute a = F/m first, then apply ½at² with t = 2 s.",
    "worked": {
      "q": "At 2 N on 2 kg, what is the two-second distance, and what force reaches 6 m at that mass?",
      "steps": [
        "a = F/m = 2/2 = 1 m/s².",
        "d = ½at² = ½ × 1 × 4 = 2 m.",
        "For 6 m, a = 3, so F = 3 × 2 = 6 N."
      ],
      "a": "2 m now; 6 N gives 6 m."
    },
    "sources": [
      "OpenStax University Physics"
    ],
    "prereqs": []
  },
  "fast.physics.6": {
    "key": "Floating is decided by density, not by the size of the sideways push.",
    "why": "The tank holds one litre, so the mass number is also the density in kg/L. A ball less dense than water rises; force only changes how far it travels sideways.",
    "mistake": "Expecting a stronger push to make a heavy ball float. Keep the two questions separate: force moves it sideways, density sets buoyancy.",
    "worked": {
      "q": "A 0.5 kg ball sits in the one-litre tank. Does it float?",
      "steps": [
        "One litre means the mass number is the density in kg/L.",
        "0.5 kg gives a density of 0.5 kg/L.",
        "Water is 1 kg/L, so the ball is less dense and floats."
      ],
      "a": "It floats, at a density of 0.5 kg/L."
    },
    "sources": [
      "OpenStax University Physics"
    ],
    "prereqs": []
  },
  "fast.maths.1": {
    "key": "Amplitude is the distance from the midline to a peak, read straight from a in y = a·sin(bx + c) + d.",
    "why": "The sine term swings between -a and +a about the centre line, so the peak sits a above that line. Changing a stretches that swing without touching the repeat spacing.",
    "mistake": "Measuring amplitude from trough to peak and reporting double its value. Measure from the centre line to one peak instead.",
    "worked": {
      "q": "The Amplitude readout is 2.5. How far is a peak above the midline?",
      "steps": [
        "Amplitude is the swing from the centre line to a peak.",
        "The readout gives the value of a directly.",
        "At a = 2.5 the peak sits 2.5 above the midline."
      ],
      "a": "2.5 units."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.maths.2": {
    "key": "Period is the reciprocal of frequency: one repeat takes 2π/b, shown as 2/b in π units.",
    "why": "Multiplying x by b makes the sine cycle b times faster, so the length of one cycle is divided by b. The readout expresses that length in units of π.",
    "mistake": "Assuming a bigger b stretches the period. Compute 2/b in π units; at b = 4 the period reads 0.50π, half of the b = 2 value.",
    "worked": {
      "q": "With b = 4, what does the Period readout show?",
      "steps": [
        "Period is 2π/b, or 2/b in π units.",
        "With b = 4 that is 2/4.",
        "2/4 = 0.5, so the display reads 0.50π."
      ],
      "a": "0.50π."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.maths.3": {
    "key": "Phase moves the peaks sideways without reshaping the wave.",
    "why": "Adding c changes only where the cycle starts along x. Height comes from a and spacing from b, so neither is affected by the slide.",
    "mistake": "Reading a large phase value as a taller or more crowded wave. Compare peak height and spacing before and after; only the horizontal position should change.",
    "worked": {
      "q": "With b = 1, what does setting c to 3.1 change?",
      "steps": [
        "c sets where the cycle starts along x.",
        "Height depends on a and spacing depends on b.",
        "A phase of 3.1 slides the curve sideways, leaving height and spacing intact."
      ],
      "a": "Only the horizontal position of the peaks changes."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.maths.4": {
    "key": "The steepest slope of a sinusoid is |a·b|, so either knob can make it steeper.",
    "why": "The derivative of a·sin(bx + c) is a·b·cos(bx + c), and cosine peaks at one. The product a·b is the largest slope the curve can have.",
    "mistake": "Assuming amplitude alone controls steepness. Use |a·b|: at a = 2, reaching a maximum slope of 6 needs b = 3.",
    "worked": {
      "q": "With a = 2, which frequency makes the maximum slope reach 6?",
      "steps": [
        "Maximum slope is |a·b|.",
        "With a = 2, set 2b = 6.",
        "b = 3 gives a peak slope of 6."
      ],
      "a": "b = 3."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.maths.5": {
    "key": "Even groups are what division means: twelve dots into four trays gives three each with none left.",
    "why": "The Per group readout appears only when every dot is placed and the groups match. Until then the picture is a partial sharing, not a division.",
    "mistake": "Accepting a group count while dots remain unplaced or trays are uneven. Place all twelve dots and confirm the four trays match before reading the answer.",
    "worked": {
      "q": "Twelve dots go into four even groups. What does Per group read?",
      "steps": [
        "The readout appears once all dots are placed and groups match.",
        "12 ÷ 4 = 3.",
        "Four trays of three give a reading of 3."
      ],
      "a": "3."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.maths.6": {
    "key": "A division sentence and a picture say the same thing: 24 ÷ 6 = 4 means four in each of six trays.",
    "why": "The written line records the result of spreading every object evenly. The Per group readout is the same number, and Spread falls to zero when the trays match.",
    "mistake": "Treating the written division and the block picture as two separate answers. Build the picture that makes the written equality true.",
    "worked": {
      "q": "Eighteen objects shared into three even groups — what does Per group read?",
      "steps": [
        "Per group shows the common group size.",
        "18 ÷ 3 = 6.",
        "Three groups of six give a reading of 6."
      ],
      "a": "6."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.chem.1": {
    "key": "One tile carries the atomic number, the symbol and the family colour in a single glance.",
    "why": "The number at the top counts protons and fixes the element’s identity, while the colour groups it with chemically similar neighbours. The card expands the same data into prose.",
    "mistake": "Reading the symbol or the mass as the identifier. Locate the atomic number at the top of the tile, which is the value the slider controls.",
    "worked": {
      "q": "On a tile, which entry identifies the element?",
      "steps": [
        "The tile shows a small number, a symbol and a family colour.",
        "That small number counts the protons.",
        "It is the atomic number."
      ],
      "a": "The atomic number."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.chem.2": {
    "key": "One element wins the pulling contest: fluorine has the highest electronegativity here at 3.98.",
    "why": "Electronegativity measures how strongly an atom pulls electrons in a bond. The pull grows toward the upper right of the table, and fluorine sits at that extreme.",
    "mistake": "Choosing oxygen or chlorine because they are familiar strong pullers. Scan the pulling-power view to the top-right corner and read fluorine’s value.",
    "worked": {
      "q": "Which element has the largest electronegativity in this table?",
      "steps": [
        "Pulling power grows toward the upper right.",
        "Fluorine occupies that corner among the reactive elements.",
        "Its recorded value is 3.98, the largest here."
      ],
      "a": "Fluorine, at 3.98."
    },
    "sources": [
      "Pauling electronegativity scale"
    ],
    "prereqs": []
  },
  "fast.chem.3": {
    "key": "A group repeats the same outer shell while the pull changes as you move up it.",
    "why": "All halogens share an outer-shell pattern, which is why they behave alike. Higher in the group the bonding electrons sit closer to the nucleus, so electronegativity rises.",
    "mistake": "Assuming the pull is identical all the way down a group. Separate the shared outer-shell structure from the strength of the pull, which grows upward.",
    "worked": {
      "q": "Moving from iodine (53) up to fluorine (9) in the halogens, what stays the same?",
      "steps": [
        "All three elements sit in the same group.",
        "A group fixes the outer-shell pattern.",
        "The pull grows going up, but the outer-shell structure repeats."
      ],
      "a": "The outer-shell structure; only the pull changes."
    },
    "sources": [
      "Pauling electronegativity scale"
    ],
    "prereqs": []
  },
  "fast.chem.4": {
    "key": "Across a period the pull climbs as the same shell fills and nuclear charge grows.",
    "why": "Electrons added across a row enter the same shell, so shielding changes little while the nucleus gets stronger. Lithium at the start of period 2 pulls far less than fluorine at its end.",
    "mistake": "Carrying the down-a-group trend into a row and expecting the pull to weaken. Read left to right within one period, from lithium toward fluorine.",
    "worked": {
      "q": "Across period 2 from lithium (3) to fluorine (9), what happens to electronegativity?",
      "steps": [
        "The same shell fills while nuclear charge grows.",
        "The pull on bonding electrons therefore rises across the row.",
        "Fluorine at the end reads higher than lithium at the start."
      ],
      "a": "It increases from lithium to fluorine."
    },
    "sources": [
      "Pauling electronegativity scale"
    ],
    "prereqs": []
  },
  "fast.chem.5": {
    "key": "A full outer shell explains the quiet corner, where electronegativity is shown as a dash.",
    "why": "Noble gases have complete outer shells and are assigned no pulling-power value in this dataset. The blank field is the table’s way of recording that, not a missing measurement.",
    "mistake": "Expecting a numeric electronegativity for every tile. Read the dash on a noble gas card as the deliberate absence of a value.",
    "worked": {
      "q": "What does a noble gas card show for electronegativity?",
      "steps": [
        "Noble gases have full outer shells.",
        "No pulling-power value is recorded for them here.",
        "The card therefore displays a dash."
      ],
      "a": "A dash."
    },
    "sources": [
      "Pauling electronegativity scale"
    ],
    "prereqs": []
  },
  "fast.chem.6": {
    "key": "Atomic number is a coordinate you can navigate by: each value fixes one row and column.",
    "why": "The proton count determines where an element sits in the periodic table, so entering one value updates the tile, the card and the electronegativity readout together. Nine selects fluorine.",
    "mistake": "Treating the atomic number slider as a position in a list to scroll past. Read it as a coordinate and enter the exact proton count of the element you want.",
    "worked": {
      "q": "Which atomic number selects fluorine?",
      "steps": [
        "Each atomic number fixes one row and column.",
        "Fluorine has nine protons.",
        "Entering 9 switches the tile, card and readout to fluorine."
      ],
      "a": "9."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "art.three": {
    "key": "Three distinct values — a light, a middle and a dark — are enough to make an image read as a picture.",
    "why": "The eye reads form from differences in lightness, so separating a subject into three value shapes preserves the structure even with no detail or colour.",
    "mistake": "Adding detail before establishing values; fix by limiting yourself to three swatches and filling enough canvas that the values register as separate shapes.",
    "worked": {
      "q": "If a drawing uses only a light, a mid and a dark value, how many distinct values does the value readout count?",
      "steps": [
        "Pick a light, a mid and the darkest swatch.",
        "Cover the canvas with shapes using those three swatches.",
        "Read the distinct-values count."
      ],
      "a": "Three."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "art.five": {
    "key": "Professional painters work in about five values, and a study holds up when its structure reads without the overlay.",
    "why": "Five steps give enough intermediate lightness to describe form while keeping the value groups readable; the histogram reveals which steps are missing.",
    "mistake": "Depending on the overlay or on outlines; fix by turning the overlay off and checking that the shapes still stand on value structure alone.",
    "worked": {
      "q": "In a five-value study, which parts of a form sit between the light and the dark?",
      "steps": [
        "Identify the light and dark endpoints.",
        "Place two middle steps and a shadow step between them.",
        "Check the histogram reaches all five values."
      ],
      "a": "Two middle steps and a shadow."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "art.three"
    ]
  },
  "art.ls.edge": {
    "key": "An edge that reads as a change of plane is made by two different values meeting, not by a drawn outline.",
    "why": "A thin single-value brush draws a contour, while a wider brush lets two neighbouring value shapes meet; the boundary emerges from their difference.",
    "mistake": "Tracing outlines everywhere; fix by changing the value on one side of a boundary instead of drawing a darker line.",
    "worked": {
      "q": "Which choice makes an edge read as two planes meeting?",
      "steps": [
        "Lay down a shape in one value.",
        "Switch to a second, different value beside it.",
        "Let the two shapes meet with a wider brush."
      ],
      "a": "Two different values meeting."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "art.uni.analysis": {
    "key": "The side panel measures distinct value count and coverage, which are the same quantities a painter checks by squinting.",
    "why": "Value count and coverage are ordinary image statistics, so a flat two-value image and a fully covered canvas show up numerically even before you judge them by eye.",
    "mistake": "Treating the panel as decoration; fix by reading its counts while painting and using them to find missing values.",
    "worked": {
      "q": "An image with only two distinct values will always read as what?",
      "steps": [
        "Count the distinct values on the canvas.",
        "Notice only two steps are present.",
        "Match that to the flat appearance the model reports."
      ],
      "a": "Flat."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "mus.beat": {
    "key": "Four evenly spaced beats make a bar, which is why common time is 4/4.",
    "why": "Rhythm reduces to counting a steady pulse, and grouping four of those pulses gives the repeating unit almost every song uses.",
    "mistake": "Treating rhythm as a pattern of notes rather than a count; fix by tapping four evenly spaced beats and hearing the bar before adding any melody.",
    "worked": {
      "q": "Four beats in a bar is called what?",
      "steps": [
        "Tap four evenly spaced beats.",
        "Group them as one repeating unit.",
        "Name the four-beat bar."
      ],
      "a": "Common time (4/4)."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "mus.phrase": {
    "key": "The phrase C E G C G E D C is a fixed shape whose four chords are I, IV, V and vi.",
    "why": "The chord progression underneath a melody carries the harmonic structure, and playing the notes in order lets you hear why those chords fit together.",
    "mistake": "Playing the notes as a scale rather than in the given order; fix by using the coach Practice mode to light the next key.",
    "worked": {
      "q": "Which four chords sit under the phrase?",
      "steps": [
        "Switch to Practice and follow the lit keys.",
        "Play the eight notes C E G C G E D C.",
        "Read the progression under the phrase."
      ],
      "a": "I, IV, V and vi."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "earth.dossier": {
    "key": "A country dossier is a dated list of events, and scrubbing back to 1900 makes most of that list disappear.",
    "why": "Borders and events are recent, so the record tied to a place depends on the year you choose rather than being a single fixed fact sheet.",
    "mistake": "Reading a dossier as a timeless description of a place; fix by dragging the timeline and noticing which events fall away.",
    "worked": {
      "q": "What happens to the event list of a country when you scrub back to 1900?",
      "steps": [
        "Open any country on the globe.",
        "Note the listed events.",
        "Drag the timeline back to 1900."
      ],
      "a": "Most of the list disappears."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "earth.timeline": {
    "key": "Opening five countries and scrubbing the year back reveals that each had a different century.",
    "why": "A single globe view flattens time, while the timeline shows that places with long records diverge when you move the year backwards.",
    "mistake": "Comparing places at a single date and assuming they share a history; fix by opening several dossiers and scrubbing the year for each.",
    "worked": {
      "q": "What does scrubbing the year back across five opened countries reveal?",
      "steps": [
        "Open five country dossiers.",
        "Scrub the timeline backwards.",
        "Compare how much of each record survives."
      ],
      "a": "Each country had a different century."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "earth.dossier"
    ]
  },
  "mus.us.tempo": {
    "key": "Tempo counts beats per minute, so at 120 bpm one beat lasts half a second.",
    "why": "Dividing sixty seconds by the beats-per-minute value gives the length of one beat, which is why doubling the tempo halves the time a phrase takes.",
    "mistake": "Describing tempo as a vague feeling of fast or slow; fix by converting bpm into seconds per beat with 60 divided by the tempo.",
    "worked": {
      "q": "At 120 bpm, how long does one beat last?",
      "steps": [
        "Read the tempo as 120 beats in 60 seconds.",
        "Divide 60 by 120.",
        "Interpret the result as seconds per beat."
      ],
      "a": "Half a second."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "mus.beat"
    ]
  },
  "mus.uni.phrase": {
    "key": "The phrase tracker checks note order and ignores speed, so the same notes at a different tempo are still the same phrase.",
    "why": "Pitch sequence and pulse rate are independent, so changing tempo cannot turn one phrase into another as long as the order is unchanged.",
    "mistake": "Assuming a slower or faster rendition is a different phrase; fix by checking the note sequence rather than the playback speed.",
    "worked": {
      "q": "If the tempo changes but the notes stay in the same order, what happens to the phrase?",
      "steps": [
        "Set a slow tempo and hear the eight notes.",
        "Raise the tempo keeping the same notes.",
        "Check the phrase tracker still counts the same sequence."
      ],
      "a": "It is the same phrase at a different speed."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "mus.phrase"
    ]
  },
  "earth.p.globe": {
    "key": "The timeline lets you see a place as a stack of times rather than a single shape on a map.",
    "why": "The chosen year selects which recorded events appear, so the same country shows different moments as the slider moves.",
    "mistake": "Treating a country as only its current outline; fix by moving the year slider and watching the event list change.",
    "worked": {
      "q": "The timeline lets you see a place as a stack of what?",
      "steps": [
        "Tap a country on the globe.",
        "Move the timeline back.",
        "Watch which events appear."
      ],
      "a": "Times."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "earth.uni.source": {
    "key": "The outlines come from Natural Earth 110m data projected live and show modern borders, so an undated map implies borders are timeless.",
    "why": "The geometry is a modern dataset separate from the curated dated events, so a boundary shown without a date hides the fact that every border has one.",
    "mistake": "Reading an undated outline as a permanent border; fix by naming the date and separating the geometry from the event record.",
    "worked": {
      "q": "When a map shows borders without a date, what does it imply?",
      "steps": [
        "Note the Natural Earth outlines are modern.",
        "Compare them with the dated events.",
        "Read the undated border as a timeless claim."
      ],
      "a": "That the borders are timeless."
    },
    "sources": [
      "Natural Earth 110m"
    ],
    "prereqs": []
  },
  "earth.compare": {
    "key": "Reading two dossiers together turns a description into a comparison, which is most useful when you hold one thing steady such as the year.",
    "why": "A dossier describes one place, while a comparison isolates what differs — holding the year constant keeps the difference about place rather than time.",
    "mistake": "Comparing two places at different dates and calling it a place comparison; fix by keeping the year the same while changing the place.",
    "worked": {
      "q": "Comparing two places is most useful when you hold one thing steady, such as what?",
      "steps": [
        "Choose two distinct places.",
        "Keep the year the same for both.",
        "Read the difference as about place."
      ],
      "a": "The year."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "earth.compare.year": {
    "key": "Both dossiers in a comparison must show the same year, otherwise the dates have to be named.",
    "why": "The comparison inherits the timeline date, so comparing two dossiers at different dates mixes two moments and the reading is not honest.",
    "mistake": "Comparing two cards without noticing their dates differ; fix by naming the date with the comparison.",
    "worked": {
      "q": "If two dossiers are compared at different dates, what is the honest reading?",
      "steps": [
        "Set both places to the same year.",
        "Change one dossier to a different date.",
        "Name both dates when comparing."
      ],
      "a": "The dates must be named."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "earth.compare"
    ]
  },
  "art.palette": {
    "key": "A mixed value is the blend of two greys set by the mix ratio, so a value can be tuned as a number.",
    "why": "Linear interpolation between a dark and a light grey gives a predictable middle swatch — at a 50 percent ratio the result sits halfway between them.",
    "mistake": "Guessing a mid value by eye without controlling the ratio; fix by setting the mix ratio and watching the swatch move between the two endpoints.",
    "worked": {
      "q": "With a mix ratio of 50 between a dark and a light grey, where does the mixed value sit?",
      "steps": [
        "Note the two endpoint values.",
        "Set the mix ratio to 50.",
        "Read the swatch at the midpoint of the two."
      ],
      "a": "Halfway between the two values."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "art.palette.steps": {
    "key": "Rounding a continuous grey scale into five value buckets gives enough steps to build a readable picture.",
    "why": "The buckets mirror the five-value studio scale, so at the dark end fewer steps fall into the range and a two-value image reads as flat.",
    "mistake": "Assuming more value steps always means a better picture; fix by checking whether the five studio buckets already describe the form.",
    "worked": {
      "q": "A work with only two distinct values reads as what?",
      "steps": [
        "Round the greys into five value steps.",
        "Remove all but two of the distinct steps.",
        "Read the resulting appearance."
      ],
      "a": "Flat."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "art.palette"
    ]
  },
  "mus.tuning": {
    "key": "When a note matches its reference the waves line up, and cents off measures how far the pitch is from the reference.",
    "why": "A frequency mismatch makes the two waves drift in and out of step, which produces the beat and shows up as cents off the target.",
    "mistake": "Judging tuning by loudness rather than pitch distance; fix by moving the note frequency toward the reference until the cents-off value is small.",
    "worked": {
      "q": "Cents off measures what?",
      "steps": [
        "Set the note away from the reference.",
        "Hear the beat appear.",
        "Read cents off as the distance from the reference pitch."
      ],
      "a": "How far a pitch is from the reference."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "mus.tuning.beats": {
    "key": "Two close tones beat at a rate equal to the difference between their frequencies.",
    "why": "The waves drift in and out of alignment once per cycle of that difference, so 440 and 444 hertz pulse four times a second.",
    "mistake": "Adding the two frequencies instead of subtracting them; fix by taking the absolute difference to get the beat rate.",
    "worked": {
      "q": "Two tones at 440 and 444 hertz beat at what rate?",
      "steps": [
        "Note the two frequencies.",
        "Subtract the smaller from the larger.",
        "Read the difference as beats per second."
      ],
      "a": "4 hertz."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "mus.tuning"
    ]
  },
  "fast.art.1": {
    "key": "Limiting a drawing to three distinct value swatches still gives enough light, middle and dark to describe a form.",
    "why": "Form reads from differences in lightness, so three well-spaced swatches keep the structure legible without a large palette.",
    "mistake": "Reaching for more swatches before the three values are clearly separated; fix by drawing only with a light, a middle and a dark until the count reaches three.",
    "worked": {
      "q": "What keeps this drawing to exactly three values?",
      "steps": [
        "Choose a light, a middle and a dark swatch.",
        "Draw using only those three.",
        "Read the distinct-value count as three."
      ],
      "a": "Using only three distinct value swatches."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.art.2": {
    "key": "Moving from three to five values adds intermediate steps between light and dark.",
    "why": "The two extra steps separate the mid tones and the shadow, giving the study more range while keeping the value groups readable.",
    "mistake": "Adding more strokes of the same value and expecting more range; fix by introducing new intermediate swatches until the count reaches five.",
    "worked": {
      "q": "Compared with three values, what does a five-value study add?",
      "steps": [
        "Start with the light, middle and dark swatches.",
        "Add two intermediate swatches.",
        "Confirm the canvas reaches five distinct values."
      ],
      "a": "More intermediate steps between light and dark."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fast.art.1"
    ]
  },
  "fast.art.3": {
    "key": "The brush slider sets how wide each stroke lands, so raising it covers more canvas per gesture.",
    "why": "A wider mark spans more pixels for the same drag, so the covered area grows quickly as the brush increases.",
    "mistake": "Judging a brush by the number of strokes instead of the area covered; fix by comparing the same gesture at a narrow and a wide setting.",
    "worked": {
      "q": "What changes when you raise the brush slider?",
      "steps": [
        "Draw a stroke with a narrow brush.",
        "Raise the brush to a wide setting.",
        "Draw the same gesture and compare the covered area."
      ],
      "a": "The area each stroke covers."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.art.4": {
    "key": "Edges are places where value changes, not outlines drawn on top of a shape.",
    "why": "Placing a dark stroke beside a light one makes a boundary appear from their difference, so the edge emerges from neighbouring values.",
    "mistake": "Drawing a thin outline before filling; fix by alternating light and dark swatches so the boundary forms from the values themselves.",
    "worked": {
      "q": "What creates an edge in this canvas?",
      "steps": [
        "Place a dark stroke.",
        "Place a light stroke next to it.",
        "Watch the boundary appear where they meet."
      ],
      "a": "Two neighbouring values that differ."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.art.5": {
    "key": "The value readout counts how many distinct values are on the canvas and rises as you add new ones.",
    "why": "The count tracks unique swatches rather than strokes, so each genuinely new value pushes it up while repeated marks leave it unchanged.",
    "mistake": "Adding more strokes of an existing value and expecting the count to climb; fix by choosing a new swatch each time you want to raise it.",
    "worked": {
      "q": "What does the value readout tell you?",
      "steps": [
        "Note the current count.",
        "Draw with a value not yet used.",
        "Read the raised distinct-value count."
      ],
      "a": "How many distinct values appear on the canvas."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.art.6": {
    "key": "Broad blocks of value arrange light and dark areas so a form reads before any contour is drawn.",
    "why": "The eye groups areas of similar lightness into shapes, so an arrangement of value blocks carries the structure on its own.",
    "mistake": "Closing an outline first and filling afterwards; fix by laying down wide value blocks and letting the form emerge from their arrangement.",
    "worked": {
      "q": "What builds the form in this approach?",
      "steps": [
        "Use a wide brush.",
        "Fill several areas with different value blocks.",
        "Read the form from the light and dark arrangement."
      ],
      "a": "Arranged areas of value."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.music.1": {
    "key": "Four pulses of the steady player make one bar.",
    "why": "The player steps at a constant tempo, and grouping that pulse in fours gives the repeating unit the bar is built from.",
    "mistake": "Counting eight notes as eight bars; fix by counting the pulse in groups of four as the player runs.",
    "worked": {
      "q": "How many beats are in one bar?",
      "steps": [
        "Press play and hear the steady pulse.",
        "Count four beats.",
        "Treat those four as one bar."
      ],
      "a": "Four."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.music.2": {
    "key": "At 120 beats per minute a four-beat bar takes two seconds, and halving the tempo doubles that time.",
    "why": "Sixty seconds divided by 120 gives half a second per beat, so four beats fill two seconds and the same bar at 60 bpm fills four.",
    "mistake": "Assuming bar length is fixed regardless of tempo; fix by computing seconds per beat from bpm and multiplying by four.",
    "worked": {
      "q": "At 120 bpm, how long is one four-beat bar?",
      "steps": [
        "Divide 60 by 120 to get seconds per beat.",
        "Multiply by four beats.",
        "Read the two-second bar."
      ],
      "a": "2 seconds."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fast.music.1"
    ]
  },
  "fast.music.3": {
    "key": "The phrase is a set run of eight notes that plays back in a fixed order.",
    "why": "A phrase is defined by its note sequence, so following the playback from start to finish covers all eight notes.",
    "mistake": "Confusing the number of bars with the number of notes; fix by counting the notes as they sound until eight have played.",
    "worked": {
      "q": "How many notes are in the phrase?",
      "steps": [
        "Press play and follow the notes.",
        "Count them as they sound.",
        "Stop at eight notes played."
      ],
      "a": "Eight."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.music.4": {
    "key": "Tempo changes how fast the phrase plays but not which note comes next.",
    "why": "Speed and sequence are separate controls, so stretching or compressing the same eight notes leaves their order intact.",
    "mistake": "Thinking a faster tempo rewrites the melody; fix by listening at two tempos and following the unchanged order.",
    "worked": {
      "q": "What changes when you raise the tempo?",
      "steps": [
        "Play the phrase at a slow tempo.",
        "Raise the tempo and play again.",
        "Compare the note order, which stays the same."
      ],
      "a": "The speed, not the note order."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.music.5": {
    "key": "The gap between two notes heard in sequence is an interval, and the last-note readout shows where the phrase landed.",
    "why": "Pitch distance is measured between two notes rather than by tempo or bar count, so the readout tracks the endpoint of the phrase.",
    "mistake": "Equating an interval with a beat or a bar; fix by listening to two successive notes and reading the last-note value.",
    "worked": {
      "q": "What is an interval?",
      "steps": [
        "Press play and hear two notes in sequence.",
        "Read the last-note readout.",
        "Name the gap between those notes."
      ],
      "a": "The distance between two notes."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.music.6": {
    "key": "Counting one, two, three, four along the pulse tells you that the fourth beat completes the bar.",
    "why": "The bar is a group of four beats, so the running count locates your position within that group.",
    "mistake": "Losing the count and assuming any four notes form a bar; fix by counting along with the pulse from the first beat.",
    "worked": {
      "q": "After four beats, where are you?",
      "steps": [
        "Press play and count along with the pulse.",
        "Reach the fourth beat.",
        "Recognise the bar is complete."
      ],
      "a": "At the end of one bar."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.earth.1": {
    "key": "Opening a country reveals a stack of events, each with its own year on the timeline.",
    "why": "The record for a place is stored as dated entries rather than a single snapshot, so opening the dossier exposes that time dimension.",
    "mistake": "Expecting a dossier to show only the current border; fix by opening a country and reading the dated events.",
    "worked": {
      "q": "What does opening a country reveal?",
      "steps": [
        "Click a country on the map.",
        "Read its recorded events.",
        "Notice each event year."
      ],
      "a": "A stack of dated events."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.earth.2": {
    "key": "The year slider sets the map date, so moving it to 2020 brings later events into view and back to 1780 removes them.",
    "why": "Events are filtered by the selected year, so the visible set changes as the slider moves while the geometry stays fixed.",
    "mistake": "Assuming the outlines change with the year; fix by scrubbing and watching the events, not the shapes, appear and disappear.",
    "worked": {
      "q": "What does moving the year slider do?",
      "steps": [
        "Set the year to 1780.",
        "Move the slider to 2020.",
        "Watch later events come into view."
      ],
      "a": "Changes which events are in view."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fast.earth.1"
    ]
  },
  "fast.earth.3": {
    "key": "The map view is tied to the year on the slider, so changing the year changes the snapshot.",
    "why": "The displayed data is selected by the slider value, so the date is set by that control rather than by the last country opened or the event count.",
    "mistake": "Assuming the last country opened fixes the date; fix by reading the year slider as the control that sets the snapshot.",
    "worked": {
      "q": "What fixes the date of the map view?",
      "steps": [
        "Note the year on the slider.",
        "Move it to a different year.",
        "Watch the snapshot change with it."
      ],
      "a": "The year set on the slider."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.earth.4": {
    "key": "Only a small set of sample events is loaded, so a year with no sample event shows nothing.",
    "why": "The event list is a curated subset rather than a complete record, so an empty year reflects a missing sample rather than a broken map.",
    "mistake": "Reading an empty year as evidence nothing happened; fix by treating the list as a sample and moving the slider to a year that has an event.",
    "worked": {
      "q": "Why might some years show no events?",
      "steps": [
        "Set the year to one with no sample.",
        "Notice nothing is displayed.",
        "Move to a year with a recorded sample event."
      ],
      "a": "No sample event is recorded for that year."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.earth.5": {
    "key": "The map outlines come from the Natural Earth geometry set, which keeps the shapes consistent across years.",
    "why": "A shared geometry dataset is reused at every date, so the outlines do not change as the timeline moves — only the events do.",
    "mistake": "Assuming the borders are redrawn for each year; fix by recognizing the Natural Earth source and separating geometry from the event record.",
    "worked": {
      "q": "Where do the country outlines come from?",
      "steps": [
        "Note the outlines are shared across years.",
        "Read the geometry label.",
        "Identify the source dataset."
      ],
      "a": "Natural Earth geometry."
    },
    "sources": [
      "Natural Earth 110m"
    ],
    "prereqs": []
  },
  "fast.earth.6": {
    "key": "Setting the slider to an early year and then a later one shows which events are present in one year but not the other.",
    "why": "Because events are filtered by year, comparing two settings exposes the difference in the visible record between those moments.",
    "mistake": "Concluding population or other facts from the event list; fix by reading only which sample events appear in each year.",
    "worked": {
      "q": "What does comparing two years show?",
      "steps": [
        "Set the slider to an early year and note the events.",
        "Move to a later year.",
        "List which events differ between them."
      ],
      "a": "Which events are present in one year but not the other."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "cs.beat": {
    "key": "On the same list, bubble sort makes far more comparisons than quicksort because their growth rates differ.",
    "why": "Bubble sort compares roughly n² pairs while quicksort compares roughly n log n, and the gap widens as the list grows; the app counts actual comparisons rather than estimating them.",
    "mistake": "Treating the gap as a coding style or animation-speed preference. The counts are measurements of real comparisons, so change the array size to see the growth difference.",
    "worked": {
      "q": "At array size 56, which lane makes more comparisons and why?",
      "steps": [
        "Both lanes sort the same 56 items.",
        "Bubble sort grows like n², quicksort like n log n.",
        "Read the comparison each lane reports."
      ],
      "a": "Bubble sort — its n² growth yields far more comparisons than quicksort’s n log n."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "cs.p.race"
    ]
  },
  "cs.why": {
    "key": "Bubble sort is the right choice only when the data is already nearly sorted.",
    "why": "A nearly sorted list needs one pass that makes no swaps to confirm it is ordered, costing about n comparisons instead of the n(n−1)/2 of a full sort.",
    "mistake": "Reading “quadratically slow” as “never useful.” Nearly sorted input collapses the work to a single pass, because complexity depends on the shape of the data, not only its size.",
    "worked": {
      "q": "For 32 items already in order, how many comparisons does one bubble-sort pass take?",
      "steps": [
        "A full bubble sort on 32 items uses 32×31/2 = 496 comparisons.",
        "An already sorted list needs one pass with no swaps.",
        "One pass checks the list about 32 times, then stops."
      ],
      "a": "About 32 comparisons — one pass — instead of 496."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "cs.beat"
    ]
  },
  "cs.p.race": {
    "key": "The dashed curve is an n log n reference, while the dots are measured comparison counts.",
    "why": "The reference curve shows the growth shape quicksort should approach, and the plotted dots come from comparisons the algorithm actually made on that list.",
    "mistake": "Reading the dashed curve as a fixed count the run must hit. It is a reference shape, not a promise — the measurements are the real evidence.",
    "worked": {
      "q": "What does the dashed background curve represent?",
      "steps": [
        "The race plots one dot per comparison a lane made.",
        "The dashed curve has the shape n log n.",
        "It is drawn as a comparison reference, not a target."
      ],
      "a": "The n log n growth shape, used as a reference for the measured dots."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "cs.ls.steps": {
    "key": "Steps per frame changes how fast the sort is displayed, not the number of comparisons it performs.",
    "why": "The slider sets how much work is drawn before each frame, but the algorithm still makes the same comparisons to sort the same list.",
    "mistake": "Assuming a faster animation means a faster algorithm. Lowering steps per frame leaves the comparison count unchanged — it only stretches out the viewing.",
    "worked": {
      "q": "If you lower steps per frame from 12 to 4, what happens to the comparison count?",
      "steps": [
        "Steps per frame sets drawn work per frame.",
        "The list and algorithm are unchanged.",
        "The total comparisons stay the same."
      ],
      "a": "Nothing — the count is unchanged; only the watching speed changes."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "cs.p.race"
    ]
  },
  "cs.uni.growth": {
    "key": "For an n² algorithm, doubling the input size multiplies the work by about four.",
    "why": "Doubling n in n² gives (2n)² = 4n², so the work grows fourfold while an n log n algorithm grows much more slowly.",
    "mistake": "Judging algorithms by one measurement at a single size. Two curves can be close at small n and far apart at large n, so the shape of growth matters most.",
    "worked": {
      "q": "Doubling n from 16 to 32 under an n² rule multiplies the comparisons by what factor?",
      "steps": [
        "The work follows n².",
        "Replace n with 2n: (2n)² = 4n².",
        "The ratio of new to old work is 4."
      ],
      "a": "About four times as many comparisons."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "cs.beat"
    ]
  },
  "cs.search.linear": {
    "key": "A linear scan checks every item from the start, so its step count equals the target’s position in the sorted list.",
    "why": "Linear scan examines items in order until it finds the target, so a target near the end costs as many steps as its position.",
    "mistake": "Assuming a sorted list automatically makes a scan logarithmic. Only binary search exploits the ordering; a linear scan still walks from the first item.",
    "worked": {
      "q": "In a 16-item list, if the target sits at position 15, how many linear steps are needed?",
      "steps": [
        "Linear scan checks from the left one at a time.",
        "The step count equals the target’s position.",
        "Position 15 means about 15 checks."
      ],
      "a": "About 15 steps — the linear count equals the position."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "cs.search.binary": {
    "key": "Binary search halves the remaining list each comparison, so a 64-item sorted list needs at most seven steps.",
    "why": "Each comparison discards the half that cannot contain the target, so the candidates fall 64 → 32 → 16 → 8 → 4 → 2 → 1 in about log₂(64) steps.",
    "mistake": "Thinking binary search checks one fewer item each time. It removes half the remaining items per step, so its cost grows logarithmically rather than linearly.",
    "worked": {
      "q": "Starting with 64 items, how many candidates remain after three halving comparisons?",
      "steps": [
        "Each comparison halves the remaining list.",
        "64 → 32 → 16 → 8 after three steps.",
        "Eight candidates remain."
      ],
      "a": "8 candidates; a full search takes about 7 steps."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "cs.search.linear"
    ]
  },
  "fin.fee": {
    "key": "A higher annual fee leaves you with less in today’s money because the fee compounds against the balance every year.",
    "why": "The fee is charged on the whole balance annually, so a 2% charge leaves less principal to earn returns than a 0.6% charge, and the gap widens over forty years.",
    "mistake": "Reading a 2% fee as a small one-time cost. It is charged each year on a growing balance, so its compounding effect is large.",
    "worked": {
      "q": "With a $0.50m balance earning returns, which annual fee leaves more after 40 years: 2% or 0.6%?",
      "steps": [
        "Fees are charged each year on the balance.",
        "A 0.6% fee removes less than 2% annually.",
        "The smaller fee leaves more to compound for forty years."
      ],
      "a": "The 0.6% fee leaves more in today’s money."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fin.million": {
    "key": "Reaching a million in today’s money is driven more by how much goes in and how long it stays than by chasing a higher return.",
    "why": "Contributions add directly and predictably, while the return only multiplies an already-built balance; over long horizons the monthly amount dominates the real outcome.",
    "mistake": "Spending effort arguing about the rate while ignoring the contribution and the time horizon. The lesson shows the monthly amount does most of the work.",
    "worked": {
      "q": "If you raise the monthly contribution versus raising the return, which moves the inflation-adjusted balance more in this model?",
      "steps": [
        "The chart applies your saved_each_month and annual_return.",
        "Contributions add principal directly.",
        "The lesson shows the monthly amount dominates."
      ],
      "a": "Raising the monthly contribution moves the real balance more than raising the return."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fin.ls.inflation"
    ]
  },
  "fin.p.straight": {
    "key": "With no return the balance line is straight; with a positive return it bends upward as the money earns money.",
    "why": "At zero return each deposit only adds its face value, so the line is linear; at 7% earlier deposits grow on themselves, making the curve bend upward.",
    "mistake": "Assuming a straight line means steady saving with growth. Its straightness specifically means no growth at all — a 0% return.",
    "worked": {
      "q": "At $100 a month with a 0% return, what does the 40-year balance line look like?",
      "steps": [
        "No return means each deposit keeps its face value.",
        "Adding $100 each month gives a constant slope.",
        "The plotted line is straight."
      ],
      "a": "A straight line — saving with no interest."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fin.ls.half": {
    "key": "Halving the monthly contribution halves the final balance, because contributions scale linearly.",
    "why": "Contributions add directly to the balance, so with all other settings fixed, twice the money in produces twice the money out.",
    "mistake": "Assuming compounding makes the final balance change nonlinearly with contributions. Compounding acts on whatever is in the account, but the contribution itself enters linearly.",
    "worked": {
      "q": "If $800 a month ends at $2.00m, roughly what does $400 a month end at?",
      "steps": [
        "Contributions are linear: half the money in.",
        "Half of $800 is $400.",
        "The final balance halves to $1.00m."
      ],
      "a": "About $1.00m — exactly half."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fin.p.straight"
    ]
  },
  "fin.ls.inflation": {
    "key": "A balance can grow in the account while its purchasing power falls, because inflation erodes what the money buys.",
    "why": "The green line tracks the account number and the blue line restates it in today’s money; with positive inflation the two diverge even as the nominal figure rises.",
    "mistake": "Reading a rising account balance as rising wealth. Check the inflation-adjusted line — growing and getting richer are different claims.",
    "worked": {
      "q": "If the account shows $1.20m after years of 3% inflation, what does the “money today” line show?",
      "steps": [
        "The green line is the nominal account number.",
        "The blue line discounts it for inflation.",
        "The blue line sits below the green one."
      ],
      "a": "A smaller figure in today’s money — the account grew but buys less."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fin.us.double": {
    "key": "Dividing 72 by the annual percentage rate gives a close estimate of the years needed to double.",
    "why": "Compound growth makes doubling time inversely related to the rate, and 72 over the rate approximates the exact logarithmic result well for ordinary rates.",
    "mistake": "Assuming doubling time scales linearly with the rate. Halving the time needs tripling the rate — 2% takes about 36 years, 6% about 12.",
    "worked": {
      "q": "At a 6% annual return, about how many years to double?",
      "steps": [
        "Apply the rule of 72.",
        "72 ÷ 6 = 12.",
        "Read the years-to-double readout near 12."
      ],
      "a": "About 12 years."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fin.us.real": {
    "key": "A million in the account and a million of purchasing power are different goals, and reaching the real one depends mostly on contributions.",
    "why": "Inflation separates the nominal balance from what it buys, and the lesson shows the monthly contribution, not the return, does most of the work in reaching the real target.",
    "mistake": "Treating hitting $1.00m in the account as the finish line. The real goal is a million in today’s money, which needs a higher real balance.",
    "worked": {
      "q": "With a $1.00m nominal balance after years of inflation, has the learner reached a million in today’s money?",
      "steps": [
        "The nominal balance is $1.00m.",
        "Inflation lowers its value in today’s terms.",
        "The real figure is below $1.00m."
      ],
      "a": "No — the real, inflation-adjusted figure is under $1.00m."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fin.us.double"
    ]
  },
  "fin.uni.pv": {
    "key": "When the return and inflation are equal, the real value of the money stays flat because nominal gain is exactly offset.",
    "why": "Real return is approximately the nominal return minus inflation, so equal rates leave no real growth and the inflation-adjusted line does not rise.",
    "mistake": "Confusing a rising nominal balance with a rising real value. When return equals inflation, every bit of growth is eaten by rising prices.",
    "worked": {
      "q": "With a 3% return and 3% inflation, what happens to the value in today’s money over time?",
      "steps": [
        "Real return ≈ nominal return − inflation.",
        "3% − 3% = 0%.",
        "The inflation-adjusted line stays flat."
      ],
      "a": "It stays flat — there is no real growth."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fin.ls.inflation"
    ]
  },
  "fin.uni.fee": {
    "key": "A fee charged annually on a growing balance takes far more than its stated percentage from the final balance.",
    "why": "Because the fee compounds against the balance each year, a 1.4 percentage-point difference removes over a fifth of the final amount over forty years, and more at higher returns.",
    "mistake": "Reading a 1.4% fee difference as costing only 1.4% of the result. On a compounding balance over forty years it removes over 20%.",
    "worked": {
      "q": "Over 40 years, roughly what share of the final balance does raising the fee from 0.2% to 1.6% remove?",
      "steps": [
        "The fee is charged yearly on the whole balance.",
        "It compounds against you, so the cost is not linear.",
        "A 1.4-point rise removes over a fifth."
      ],
      "a": "Over 20% of the final balance."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fin.fee"
    ]
  },
  "fin.p.shop": {
    "key": "A budget is a fixed total you cannot exceed, so choosing items means adding their prices and stopping before the money runs out.",
    "why": "With fixed prices and a fixed budget, the only arithmetic is addition and comparison: three chosen prices must sum to no more than the budget.",
    "mistake": "Adding items until the basket is full without checking the running total. Add the prices before committing so the spend stays inside the budget.",
    "worked": {
      "q": "With a $10 budget and items priced $2, $3 and $4, can you buy all three?",
      "steps": [
        "Add the prices: 2 + 3 + 4 = 9.",
        "Compare $9 to the $10 budget.",
        "$9 is within $10, with $1 left."
      ],
      "a": "Yes — $9 spent, $1 left."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "lang.order": {
    "key": "In Spanish the verb ending can carry the subject, so word order is the grammar that builds a sentence.",
    "why": "A verb form such as “hablo” already encodes who speaks, so an explicit pronoun is unnecessary and the arrangement of words carries the meaning.",
    "mistake": "Translating word-for-word from English and adding a pronoun Spanish would drop. Let the verb ending supply the subject and arrange the tiles by what you hear.",
    "worked": {
      "q": "Why can a Spanish sentence omit the subject pronoun?",
      "steps": [
        "The verb ending marks the person and number.",
        "“Hablo” already means “I speak.”",
        "The subject is understood from the verb, so no pronoun is needed."
      ],
      "a": "Because the verb ending identifies the subject."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "lang.clean": {
    "key": "Knowing a sentence means placing it correctly three times with no wrong tile, not getting there eventually.",
    "why": "A clean run requires every word to land right on the first try, which is a stricter test of recognition than a single correct result reached by trial and error.",
    "mistake": "Stopping after one correct placement. The coach counts clean runs, so aim for three consecutive mistake-free sentences.",
    "worked": {
      "q": "What earns one clean run in the sentence game?",
      "steps": [
        "Listen before placing any word.",
        "Place every word correctly with no wrong tile.",
        "Repeat until three such runs are done."
      ],
      "a": "A sentence placed correctly with no mistakes on the first try."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "lang.order"
    ]
  },
  "lang.p.speed": {
    "key": "Slowing the voice stretches each word in time without changing the words or their order.",
    "why": "Voice speed changes only the rate of playback, so at half speed every word lasts longer while the sequence stays identical.",
    "mistake": "Assuming slower speech changes the language being spoken. It only makes each word longer, giving you time to hear the structure.",
    "worked": {
      "q": "At 0.5 speed, what changes about a spoken sentence?",
      "steps": [
        "Voice speed controls playback rate.",
        "Each word takes longer to say.",
        "The words and their order are unchanged."
      ],
      "a": "Each word is longer; the sequence is the same."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "lang.us.order": {
    "key": "The order of words is the grammar, so the same words arranged differently usually mean something different.",
    "why": "Grammatical roles come from position, so rearranging words changes which word plays which role and therefore the sentence’s meaning.",
    "mistake": "Focusing only on which words appear and ignoring their sequence. The coach counts clean runs because the order is what carries meaning.",
    "worked": {
      "q": "Two sentences use the same words in a different order. What follows?",
      "steps": [
        "Meaning depends on grammatical roles.",
        "Roles come from word position.",
        "Reordered words change the meaning."
      ],
      "a": "They have different meanings."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "lang.order"
    ]
  },
  "lang.uni.voice": {
    "key": "The order of the words stays constant when voice speed changes; timing and sequence are independent.",
    "why": "Playback rate affects duration but not the sequence, so your ear recognises the same sentence at half speed and at full speed.",
    "mistake": "Believing a faster voice changes which words are spoken. Only the timing shifts — the word order is invariant.",
    "worked": {
      "q": "What stays the same when you listen at 0.5 speed and then 1.4 speed?",
      "steps": [
        "Speed changes how fast words are spoken.",
        "It does not reorder them.",
        "The word order is identical at both speeds."
      ],
      "a": "The order of the words."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "lang.p.speed"
    ]
  },
  "lang.pace": {
    "key": "Reading time is passage length divided by words per minute, a rate you can change.",
    "why": "At a constant pace, doubling words per minute halves the time for the same passage because time is length divided by rate.",
    "mistake": "Thinking changing the pace changes the language or the passage. It only changes how long the same reading takes.",
    "worked": {
      "q": "At 120 words per minute, how long does a 120-word passage take?",
      "steps": [
        "Time = passage words ÷ words per minute.",
        "120 ÷ 120 = 1 minute.",
        "One minute is 60 seconds."
      ],
      "a": "60 seconds."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "lang.pace.band": {
    "key": "The pace band is a label for a speed range, not a score of understanding.",
    "why": "The band names which rate bracket the reader is in; it says nothing about whether the passage was comprehended.",
    "mistake": "Treating a faster band as proof of better understanding. The band names a speed, and the lesson shows a faster rate guarantees nothing about comprehension.",
    "worked": {
      "q": "A reader moves into the fastest pace band. What does that tell you?",
      "steps": [
        "The band names a words-per-minute range.",
        "It does not measure understanding.",
        "Only the speed changed."
      ],
      "a": "Only that the reading rate is high; nothing about comprehension."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "lang.pace"
    ]
  },
  "fast.cs.1": {
    "key": "On the same list, bubble sort makes more comparisons than quicksort, and the gap grows with list size.",
    "why": "Both lanes sort identical data, so any difference in comparison counts comes from the algorithms themselves — bubble sort’s n² versus quicksort’s n log n.",
    "mistake": "Believing the speed setting or the drawing changed the comparison totals. Raising steps per frame only speeds up the picture; the list size drives the counts.",
    "worked": {
      "q": "With bubble sort above 300 comparisons on a list, which lane did more work?",
      "steps": [
        "Both lanes sort the same array.",
        "Bubble sort grows quadratically, quicksort roughly n log n.",
        "Bubble sort passes 300 first."
      ],
      "a": "Bubble sort made more comparisons."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "cs.beat"
    ]
  },
  "fast.cs.2": {
    "key": "Steps per frame changes only how fast you watch the sort, not the comparison count.",
    "why": "The control sets how many sort steps are drawn before each frame; the algorithm performs the same comparisons on the same list regardless.",
    "mistake": "Reading a faster-finishing animation as a more efficient algorithm. The comparison count stays identical because the underlying work did not change.",
    "worked": {
      "q": "Raising steps per frame from 2 to 40, what happens to total comparisons?",
      "steps": [
        "Steps per frame changes drawn work per frame.",
        "The list and algorithm stay fixed.",
        "Total comparisons are unchanged."
      ],
      "a": "Nothing — only the watching speed changes."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "cs.ls.steps"
    ]
  },
  "fast.cs.3": {
    "key": "The n log n curve is a reference shape for comparison, not a count the run must hit.",
    "why": "The dashed curve shows the growth form quicksort approaches; the actual comparison dots are measurements and need only follow that shape loosely.",
    "mistake": "Treating the reference curve as an exact target the quick lane must land on. It is a shape to compare against, and the lesson notes it fits best around size 32.",
    "worked": {
      "q": "What is the n log n curve in the race chart?",
      "steps": [
        "The quick lane plots measured comparison dots.",
        "A dashed curve shows n log n growth.",
        "It serves as a reference, not a required count."
      ],
      "a": "A reference shape for comparison; it fits best around list size 32."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "cs.p.race"
    ]
  },
  "fast.cs.4": {
    "key": "Because bubble sort grows with n², doubling the list from 16 to 32 multiplies its work by about four.",
    "why": "Squaring the input size gives (2n)² = 4n², so comparisons jump by roughly four times when n doubles.",
    "mistake": "Expecting double the work for double the input. A squared rule makes it about four times, which is why pushing the size toward 64 passes 900 comparisons.",
    "worked": {
      "q": "If 16 items take about 120 comparisons, roughly how many does 32 take under n²?",
      "steps": [
        "Doubling n multiplies n² work by four.",
        "120 × 4 = 480.",
        "The count scales by four, not two."
      ],
      "a": "About 480 comparisons — four times as many."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "cs.uni.growth"
    ]
  },
  "fast.cs.5": {
    "key": "As the list grows, the bubble-sort comparison counter climbs faster than the quick-sort one.",
    "why": "Both lanes are timed on the same list, so the diverging counters reflect the algorithms’ different growth rates, n² against n log n.",
    "mistake": "Watching only one lane and missing that the point is the comparison between them. The key observation is the widening gap as size increases.",
    "worked": {
      "q": "Which counter climbs faster as the list grows?",
      "steps": [
        "Both lanes sort the same array.",
        "Bubble sort grows quadratically; quicksort near n log n.",
        "The bubble counter pulls ahead."
      ],
      "a": "Bubble sort’s counter climbs faster."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "cs.beat"
    ]
  },
  "fast.cs.6": {
    "key": "The comparison counts come from measuring the actual run, not from a fixed rule attached to the algorithm’s name.",
    "why": "Each dot is a comparison the algorithm made on this particular list, so the number responds to the data and the run rather than to the label.",
    "mistake": "Reading the count as a formula looked up from “bubble” or “quick.” The number is a measurement of the run you watched.",
    "worked": {
      "q": "Where does the quick-lane comparison count come from?",
      "steps": [
        "The counters increment once per actual comparison.",
        "They were measured on this list.",
        "Animation speed does not affect them."
      ],
      "a": "A measurement of comparisons made on this run."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "cs.p.race"
    ]
  },
  "fast.finance.1": {
    "key": "This chart applies the numbers you enter and recommends nothing — it is arithmetic on your own inputs.",
    "why": "Every figure on the screen is computed from the monthly amount and return you set, so the tool models outcomes rather than advising a choice.",
    "mistake": "Reading the chart as a recommendation of what to buy. It performs only arithmetic on your own numbers, with no product advice.",
    "worked": {
      "q": "If you enter $500 a month, what is the chart doing with that number?",
      "steps": [
        "The tool takes saved_each_month as an input.",
        "It compounds it at the entered return.",
        "It reports the resulting 40-year balance."
      ],
      "a": "Arithmetic on the entered number — it recommends nothing."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.finance.2": {
    "key": "The balance grows faster than the total deposited because earlier earnings themselves earn returns.",
    "why": "Compounding applies the return to the whole accumulated balance, so each month’s growth builds on prior growth as well as on new deposits.",
    "mistake": "Thinking the balance only equals the sum of deposits. Earnings earn further earnings, which is why it can pass $10.00m on a much smaller total deposited.",
    "worked": {
      "q": "Why can a 40-year balance exceed the sum of all monthly deposits?",
      "steps": [
        "Each month earns on the existing balance.",
        "Those earnings join the balance and earn again.",
        "Compounding is the difference."
      ],
      "a": "Because earnings earn further earnings on top of the deposits."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fin.p.straight"
    ]
  },
  "fast.finance.3": {
    "key": "The “money today” figure restates the future balance after accounting for inflation eroding purchasing power.",
    "why": "Inflation raises prices over time, so a given future nominal amount buys less; the chart discounts it to show its value in today’s money.",
    "mistake": "Treating the future account number as what it will actually buy. Read the inflation-adjusted figure to account for purchasing power.",
    "worked": {
      "q": "With high inflation, why is the money-today figure below the future balance?",
      "steps": [
        "The future balance is a nominal number.",
        "Inflation erodes what each unit buys.",
        "Discounting gives a smaller today-value."
      ],
      "a": "Because inflation reduces purchasing power — the future sum is worth less today."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fin.ls.inflation"
    ]
  },
  "fast.finance.4": {
    "key": "A small annual fee subtracted from returns each year compounds into a large cumulative loss over forty years.",
    "why": "The fee is charged on the growing balance every year, so it removes principal that would otherwise have earned returns, and the shortfall compounds.",
    "mistake": "Treating the fee as a tiny fixed cost. Charged annually on a growing balance over forty years, even 1.5% can pass $1.00m in lost value.",
    "worked": {
      "q": "If a 1.5% annual fee is applied for 40 years, what does the lost-to-fees figure show?",
      "steps": [
        "The fee is subtracted each year from the balance.",
        "It compounds as a growing shortfall.",
        "The cumulative loss can pass $1.00m."
      ],
      "a": "A loss that compounds into more than $1.00m."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fin.fee"
    ]
  },
  "fast.finance.5": {
    "key": "A fixed annual return corresponds to a fixed doubling time, and lowering the return lengthens it.",
    "why": "Years to double is set by the rate through the rule of 72, so a lower rate stretches the time needed for the balance to double.",
    "mistake": "Assuming doubling time stays put when the return changes. A smaller return gives a longer doubling time — passing 15 years means the return fell.",
    "worked": {
      "q": "At a 4% return, about how long to double?",
      "steps": [
        "Apply the rule of 72.",
        "72 ÷ 4 = 18.",
        "That is above 15 years."
      ],
      "a": "About 18 years."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fin.us.double"
    ]
  },
  "fast.finance.6": {
    "key": "A fixed budget forces a choice among items, and the left counter shows what remains after spending.",
    "why": "With prices fixed and a finite budget, each purchase reduces the remaining money, so the left counter tracks budget minus total spent.",
    "mistake": "Reading the “left” counter as the number of items or the amount spent. It is the budget remaining after purchases.",
    "worked": {
      "q": "With a $20 budget and $6 spent, what does the left counter read?",
      "steps": [
        "The budget starts at $20.",
        "Subtract spending: 20 − 6 = 14.",
        "The left counter shows $14 remaining."
      ],
      "a": "$14 — budget remaining."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fin.p.shop"
    ]
  },
  "fast.language.1": {
    "key": "Listening to the whole sentence before placing words makes the word order clear.",
    "why": "Hearing the sentence first gives you its shape, so you can match tiles to what you actually heard rather than guessing.",
    "mistake": "Starting to place tiles before hearing the full sentence. Slow the voice, listen for the first word, then place it.",
    "worked": {
      "q": "What should you do before placing any word in a new sentence?",
      "steps": [
        "Play the whole sentence.",
        "Optionally slow the voice to hear each word.",
        "Then place the first word you heard."
      ],
      "a": "Listen to the whole sentence first."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "lang.order"
    ]
  },
  "fast.language.2": {
    "key": "Word order carries meaning, so the same words in a different sequence can say something different.",
    "why": "Grammatical roles come from position, so rearranging the tiles changes the sentence rather than merely rearranging identical content.",
    "mistake": "Focusing on which words are present and neglecting their order. Place words in the order you heard to solve the sentence.",
    "worked": {
      "q": "Why can two sentences with identical words differ in meaning?",
      "steps": [
        "Both use the same word set.",
        "Roles depend on word position.",
        "Different order gives different meaning."
      ],
      "a": "Because their word order differs."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "lang.order"
    ]
  },
  "fast.language.3": {
    "key": "Slowing the voice exposes where words begin and end, making the sentence structure audible.",
    "why": "At high speed words run together; stretching playback separates them so their boundaries and order become easier to notice.",
    "mistake": "Leaving the voice fast and assuming you heard distinct words. Drop the speed to expose word boundaries.",
    "worked": {
      "q": "What does dropping the voice speed help you notice?",
      "steps": [
        "Fast speech runs words together.",
        "Slower playback stretches each word.",
        "Word boundaries become audible."
      ],
      "a": "Where words begin and end."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "lang.p.speed"
    ]
  },
  "fast.language.4": {
    "key": "A clean run solves a sentence with every word placed correctly and no mistakes.",
    "why": "A mistake-free placement is a stricter check of recognition than a correct answer reached after corrections.",
    "mistake": "Counting a sentence as clean after fixing an error. The run is clean only if no word was wrong.",
    "worked": {
      "q": "What does earning a clean run require?",
      "steps": [
        "Listen and place every word.",
        "No word may be wrong.",
        "The sentence is solved on the first try."
      ],
      "a": "No mistakes in that sentence."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "lang.clean"
    ]
  },
  "fast.language.5": {
    "key": "A mistake marker points to the word you placed wrong, so the useful response is to recheck it against the audio.",
    "why": "The counter marks where a placement went wrong, letting you target the specific word rather than repeating the whole sentence blindly.",
    "mistake": "Guessing faster or restarting instead of examining the marked word. Relisten to that word and correct it.",
    "worked": {
      "q": "A placement is marked wrong. What should you do next?",
      "steps": [
        "Note which word the marker flags.",
        "Replay the audio for that word.",
        "Correct the placement."
      ],
      "a": "Recheck that word against the audio."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "lang.clean"
    ]
  },
  "fast.language.6": {
    "key": "Replaying the same sentence lets you confirm the order you chose before committing.",
    "why": "A second hearing checks your first placement against the audio, turning a guess into a confirmed answer.",
    "mistake": "Placing words from a single hearing and moving on. Replay at a slower speed to confirm the order.",
    "worked": {
      "q": "Why replay a sentence you have already placed?",
      "steps": [
        "Your first placement is a guess.",
        "A second hearing lets you compare it to the audio.",
        "Confirmation corrects errors."
      ],
      "a": "To confirm the order you chose."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "lang.clean"
    ]
  },
  "astro.speed": {
    "key": "A planet’s orbital period is set by its distance from the Sun.",
    "why": "Kepler’s third law ties period to orbital distance through T² ∝ a³, and the app solves each planet’s path from that single relationship.",
    "mistake": "Assuming inner planets are slower because they are smaller; they are actually faster. Avoid this by comparing lap counts at one fixed elapsed time.",
    "worked": {
      "q": "After ten Earth years, which planet has completed the most orbits?",
      "steps": [
        "Each planet’s period depends on its orbital distance.",
        "Closer planets have shorter periods.",
        "Mercury laps the Sun about four times a year, so it leads."
      ],
      "a": "Mercury, with roughly forty orbits in ten Earth years."
    },
    "sources": [
      "Kepler’s third law"
    ],
    "prereqs": []
  },
  "astro.neptune": {
    "key": "Neptune takes about 165 Earth years to complete one orbit.",
    "why": "Kepler’s third law makes period grow faster than distance, so a world as far out as Neptune has an enormously long year.",
    "mistake": "Thinking a farther planet is only a little slower; the period grows with the three-halves power of distance. Avoid this by watching Jupiter finish many laps while Neptune barely advances.",
    "worked": {
      "q": "Jupiter’s period is about 12 Earth years. Roughly how many orbits does it finish while Neptune completes one?",
      "steps": [
        "Neptune’s period is about 165 Earth years.",
        "Divide 165 by Jupiter’s 12-year period.",
        "That gives about 13.75 Jupiter orbits."
      ],
      "a": "About fourteen orbits."
    },
    "sources": [
      "Kepler’s third law"
    ],
    "prereqs": [
      "astro.speed"
    ]
  },
  "astro.p.orbits": {
    "key": "Planets farther from the Sun take longer to complete an orbit.",
    "why": "Kepler’s third law gives larger orbits longer periods, so the inner planets finish laps while the outer ones barely shift.",
    "mistake": "Reading the compressed on-screen distances as true spacing. Avoid this by focusing on lap counts rather than visual gaps.",
    "worked": {
      "q": "At five Earth years, which planets have finished at least one lap?",
      "steps": [
        "Inner planets have periods from a few months to about two years.",
        "Earth takes one year and Mars under two.",
        "In five years all four inner planets have lapped many times."
      ],
      "a": "The four inner planets: Mercury, Venus, Earth and Mars."
    },
    "sources": [
      "Kepler’s third law"
    ],
    "prereqs": []
  },
  "astro.uni.kepler": {
    "key": "Planets follow ellipses, and the √a display compression is a viewing choice rather than physics.",
    "why": "Kepler’s equation is solved each frame from orbital elements, so paths are ellipses even when they look round; the √a scaling only shrinks drawn distances so inner planets stay visible.",
    "mistake": "Believing the compressed view shows true relative distances, or trying to read the scale observable as a number. Avoid this by treating scale as a label and switching it off to see true spacing.",
    "worked": {
      "q": "Why do the inner planets crowd together when the √a compression is switched off?",
      "steps": [
        "True gaps between orbits are far larger than the compressed view suggests.",
        "Compression shrinks outer distances by √a so everything fits together.",
        "Without it, the inner orbits are tiny beside the outer ones."
      ],
      "a": "Because the real inner orbits are crowded and small compared with the outer ones."
    },
    "sources": [
      "Kepler’s first law",
      "Model derived in this world"
    ],
    "prereqs": [
      "astro.p.orbits"
    ]
  },
  "astro.moon": {
    "key": "Moon phase is set by the Sun–Moon–Earth angle, with a full moon near 180°.",
    "why": "The illuminated fraction is the share of the near side lit by the Sun, so turning the phase angle to 180° leaves the Earth-facing side fully sunlit.",
    "mistake": "Attributing phase to Earth’s shadow, which produces an eclipse instead. Avoid this by changing only the phase angle and watching the illuminated fraction respond.",
    "worked": {
      "q": "At a phase angle of 180°, what is the illuminated fraction?",
      "steps": [
        "Phase angle is the Sun–Moon–Earth angle.",
        "At 180° the Moon sits opposite the Sun as seen from Earth.",
        "The Earth-facing side is then fully sunlit."
      ],
      "a": "Near one — a full moon."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "astro.moon.distance": {
    "key": "Moon distance changes apparent size but not the illuminated fraction.",
    "why": "Phase comes from the Sun–Moon–Earth angle, which distance does not alter, so the lit fraction holds steady while the disc changes size.",
    "mistake": "Assuming a closer, larger-looking Moon must be a fuller phase. Avoid this by changing only distance and watching the fraction stay fixed.",
    "worked": {
      "q": "The Moon moves closer. What happens to the illuminated fraction?",
      "steps": [
        "Illuminated fraction depends only on phase angle.",
        "Distance does not change the Sun–Moon–Earth geometry.",
        "The fraction is therefore unchanged."
      ],
      "a": "Nothing — it stays the same."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "astro.moon"
    ]
  },
  "bio.select": {
    "key": "Moving the environmental optimum shifts the population mean toward it over generations.",
    "why": "Individuals closer to the optimum leave more offspring, so the heritable trait mean moves in that direction each generation.",
    "mistake": "Thinking individual organisms change their traits. Selection changes the mix of individuals, not each one; watch the distribution’s mean move.",
    "worked": {
      "q": "The optimum moves from 0.3 to 0.8. What happens to the population mean?",
      "steps": [
        "Selection favours individuals near the optimum.",
        "Those individuals contribute more offspring.",
        "Over generations the mean trait shifts toward 0.8."
      ],
      "a": "It moves toward 0.8."
    },
    "sources": [
      "natural selection"
    ],
    "prereqs": []
  },
  "bio.mutation": {
    "key": "Mutation continually restores variation that selection removes.",
    "why": "Selection pulls the trait distribution toward one value while mutation introduces new values, so with mutation above zero the spread never collapses to zero.",
    "mistake": "Believing selection alone eliminates all variation in nature. Avoid this by setting mutation to zero to see the spread collapse, then raising it again.",
    "worked": {
      "q": "If selection were perfect and mutation were zero, what would happen to variation?",
      "steps": [
        "Selection favours one optimal trait value.",
        "With no mutation, no new values are introduced.",
        "Every individual would eventually share the same trait."
      ],
      "a": "Variation would vanish."
    },
    "sources": [
      "natural selection"
    ],
    "prereqs": [
      "bio.select"
    ]
  },
  "bio.p.change": {
    "key": "Selection changes the population average by favouring some traits over others.",
    "why": "Differential survival shifts which traits are common, moving the mean rather than changing every individual by the same amount.",
    "mistake": "Assuming selection acts equally on each individual. Avoid this by watching the distribution change rather than following a single dot.",
    "worked": {
      "q": "Stronger selection is applied. What happens to the population mean?",
      "steps": [
        "Selection weights survival by trait value.",
        "Stronger selection gives a bigger advantage to favoured traits.",
        "The mean moves toward the favoured value faster."
      ],
      "a": "It shifts faster toward the favoured trait."
    },
    "sources": [
      "natural selection"
    ],
    "prereqs": []
  },
  "bio.uni.landscape": {
    "key": "The Gaussian fitness landscape is a simplification that still shows the selection mechanism.",
    "why": "A single smooth peak lets the mean climb toward the optimum and the spread respond, capturing the broad behaviour even though real landscapes are messier.",
    "mistake": "Treating the idealised Gaussian peak as a measurement from the wild. The lesson states it is a simplification, not proof; read it as a model of the mechanism.",
    "worked": {
      "q": "Is the Gaussian fitness landscape a real measurement or a model?",
      "steps": [
        "Real fitness landscapes involve many traits and individuals.",
        "This model uses one smooth Gaussian peak.",
        "It is a simplification that still shows the mechanism."
      ],
      "a": "A simplification that still shows the mechanism."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "bio.select"
    ]
  },
  "bio.genetics": {
    "key": "Each parent contributes one allele, giving four possible combinations in the grid.",
    "why": "With one allele from each parent, the grid enumerates every pairing, so two dominant-contributing parents make all four boxes dominant.",
    "mistake": "Forgetting that each parent gives only one allele; the four boxes are combinations, not four alleles from one parent. Avoid this by tracking one allele per parent.",
    "worked": {
      "q": "Both parents carry only the dominant allele. What fraction of boxes show a dominant allele?",
      "steps": [
        "Each parent contributes one dominant allele.",
        "Every combination is then dominant with dominant.",
        "All four boxes show a dominant allele."
      ],
      "a": "All four — a fraction of one."
    },
    "sources": [
      "Mendelian inheritance"
    ],
    "prereqs": []
  },
  "bio.genetics.hetero": {
    "key": "A box with one dominant and one recessive allele shows the dominant trait but still carries the recessive one.",
    "why": "The dominant allele masks the recessive in appearance, so a heterozygous box can pass the recessive allele on unseen.",
    "mistake": "Assuming a trait that is not shown cannot be inherited. Avoid this by reading the heterozygous fraction rather than appearance alone.",
    "worked": {
      "q": "One parent gives a dominant allele and the other a recessive one. What does the box show?",
      "steps": [
        "The box holds one of each allele.",
        "The dominant allele masks the recessive in appearance.",
        "The box shows the dominant trait while carrying the recessive."
      ],
      "a": "The dominant trait."
    },
    "sources": [
      "Mendelian inheritance"
    ],
    "prereqs": [
      "bio.genetics"
    ]
  },
  "stats.pile": {
    "key": "Sample averages pile into a bell curve even when the source population is skewed.",
    "why": "The central limit theorem says the distribution of sample means tends to normal as samples accumulate, regardless of the population’s own shape.",
    "mistake": "Assuming the sample means must mirror the skewed population. Avoid this by comparing the top distribution with the accumulating bars.",
    "worked": {
      "q": "The population is skewed. What shape do a hundred sample means form?",
      "steps": [
        "Each bar is the average of one sample.",
        "The central limit theorem applies to averages, not individuals.",
        "With enough samples, the means pile into a bell curve."
      ],
      "a": "A bell curve."
    },
    "sources": [
      "central limit theorem"
    ],
    "prereqs": []
  },
  "stats.se": {
    "key": "The standard error of the mean is σ/√n.",
    "why": "Averaging n observations reduces variation by the square root of n, so quadrupling n halves the spread of the means.",
    "mistake": "Reading the white curve as fitted to the bars. It is predicted from n before the data arrives; its width follows σ/√n.",
    "worked": {
      "q": "By what factor must n grow to halve the standard error?",
      "steps": [
        "Standard error is σ/√n.",
        "To halve it, √n must double.",
        "Doubling √n means multiplying n by four."
      ],
      "a": "Four times the sample size."
    },
    "sources": [
      "standard error"
    ],
    "prereqs": [
      "stats.pile"
    ]
  },
  "stats.p.draw": {
    "key": "Smaller samples give a wider spread of sample means.",
    "why": "With few draws per sample, one unusual value moves the mean a lot, so the bars scatter; averaging more draws settles them.",
    "mistake": "Reading one sample mean as the population value. Avoid this by comparing the scatter at n = 4 with n = 10.",
    "worked": {
      "q": "With a small n, is the spread of sample means large or small?",
      "steps": [
        "Each bar averages n draws.",
        "Few draws let outliers pull the mean strongly.",
        "More draws average those outliers away."
      ],
      "a": "Larger."
    },
    "sources": [
      "standard error"
    ],
    "prereqs": []
  },
  "stats.ls.predict": {
    "key": "The white curve is a prediction from μ and σ/√n, not a line fitted to the bars.",
    "why": "The central limit theorem fixes the shape and spread of sample means in advance, so the curve can be drawn before any data and the bars then converge to it.",
    "mistake": "Treating a close match as evidence the curve was adjusted to the data. Avoid this by noting when the curve appears relative to the bars.",
    "worked": {
      "q": "When the bars track the white curve, what is happening?",
      "steps": [
        "The curve was calculated from μ and σ/√n before drawing.",
        "Nothing was fitted to the observed bars.",
        "The agreement is the central limit theorem at work."
      ],
      "a": "The central limit theorem is at work."
    },
    "sources": [
      "central limit theorem"
    ],
    "prereqs": [
      "stats.pile"
    ]
  },
  "stats.hypothesis": {
    "key": "A hypothesis test measures the gap between a claimed mean and the true mean.",
    "why": "The difference between the two numbers is what the test evaluates, so moving the true mean away from the claim opens a gap the instrument can display.",
    "mistake": "Assuming the claimed mean is the observed result. Avoid this by moving only the true mean first and reading the resulting difference.",
    "worked": {
      "q": "If the claimed mean and the true mean are equal, what is the difference?",
      "steps": [
        "The difference is true mean minus claimed mean.",
        "With both at 50, the subtraction gives zero.",
        "A zero gap means no departure from the claim."
      ],
      "a": "Zero."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "stats.hypothesis.power": {
    "key": "Calling a result detectable means it passes a threshold, not that it is certainly true.",
    "why": "The gap is measured in standard errors and two of them is a convention, so the detectable flag reflects a decision rule rather than proof.",
    "mistake": "Treating a detectable result as certainty. Avoid this by reading the flag as a threshold crossing, not a verdict.",
    "worked": {
      "q": "Calling a result detectable means what?",
      "steps": [
        "The gap is expressed in standard errors.",
        "Two standard errors is a chosen convention.",
        "Crossing that threshold sets the flag; it is not proof."
      ],
      "a": "It passes a threshold."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "stats.hypothesis"
    ]
  },
  "fast.astro.1": {
    "key": "In a fixed span, inner planets complete far more orbits than outer planets.",
    "why": "Kepler’s third law gives inner planets short periods, so Mercury laps the Sun many times while Neptune barely advances.",
    "mistake": "Judging speed by apparent size on the compressed display. Avoid this by reading orbit counts rather than visual spacing.",
    "worked": {
      "q": "Over ten Earth years, which planet completes the most orbits?",
      "steps": [
        "By Kepler’s third law, shorter orbital distance means a shorter period.",
        "Mercury is closest to the Sun and has the shortest year.",
        "It therefore completes the most laps."
      ],
      "a": "Mercury."
    },
    "sources": [
      "Kepler’s third law"
    ],
    "prereqs": [
      "astro.p.orbits"
    ]
  },
  "fast.astro.2": {
    "key": "Planetary paths are ellipses, with the Sun offset from the centre.",
    "why": "Kepler’s first law states that planets move on ellipses, so the distance to the Sun changes over one lap; a circle would keep it constant.",
    "mistake": "Treating the near-circular on-screen traces as circles. Avoid this by watching the distance from the Sun vary during a lap.",
    "worked": {
      "q": "A planet’s distance from the Sun changes over one orbit. What shape is its path?",
      "steps": [
        "A circle would keep the Sun at a fixed distance.",
        "The traced path is an oval with varying distance.",
        "Kepler’s first law identifies it as an ellipse."
      ],
      "a": "An ellipse."
    },
    "sources": [
      "Kepler’s first law"
    ],
    "prereqs": [
      "astro.uni.kepler"
    ]
  },
  "fast.astro.3": {
    "key": "Doubling a planet’s orbital distance makes its year more than twice as long.",
    "why": "Kepler’s third law gives T ∝ a^(3/2), so doubling a multiplies the period by about 2.8.",
    "mistake": "Assuming period scales linearly with distance. Avoid this by applying T² ∝ a³ rather than T ∝ a.",
    "worked": {
      "q": "A planet is moved to twice its orbital distance. By what factor does its period grow?",
      "steps": [
        "Kepler’s third law gives T ∝ a^(3/2).",
        "With a doubled, the factor is 2^(3/2).",
        "That is the square root of eight, about 2.83."
      ],
      "a": "About 2.8 times as long."
    },
    "sources": [
      "Kepler’s third law"
    ],
    "prereqs": [
      "astro.speed"
    ]
  },
  "fast.astro.4": {
    "key": "Neptune needs about 165 Earth years for one orbit.",
    "why": "Neptune’s great distance gives it a very long period by Kepler’s third law, so in ten Earth years it shifts only a small fraction of its path.",
    "mistake": "Thinking Neptune has stopped because it looks static over short spans. Avoid this by running the clock much further.",
    "worked": {
      "q": "About how much of its orbit does Neptune finish in ten Earth years?",
      "steps": [
        "Neptune’s period is about 165 Earth years.",
        "Ten years is 10/165 of a full orbit.",
        "That is roughly six percent of its path."
      ],
      "a": "About six percent."
    },
    "sources": [
      "Kepler’s third law"
    ],
    "prereqs": [
      "astro.neptune"
    ]
  },
  "fast.astro.5": {
    "key": "The view compresses distances and sizes so all planets fit at once.",
    "why": "True orbital gaps are far larger than shown, so the display resizes them; this is a presentation choice, not a change to the physics.",
    "mistake": "Reading the on-screen spacing as real distance, or trying to wait on the scale observable numerically — it reads a word and parses as NaN. Avoid this by treating scale as a label.",
    "worked": {
      "q": "Why can every planet be seen at once in this model?",
      "steps": [
        "Real orbital distances span a huge range.",
        "The display compresses distances and planet sizes.",
        "That compression keeps inner and outer worlds visible together."
      ],
      "a": "Because the display compresses distances and sizes."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "astro.uni.kepler"
    ]
  },
  "fast.astro.6": {
    "key": "A small set of orbital elements fixes an orbit’s size, shape, tilt and position.",
    "why": "Positions are computed from these elements each frame, so changing one value changes the whole path in a defined way.",
    "mistake": "Confusing eccentricity with mass or colour. Avoid this by matching each element to the property it controls.",
    "worked": {
      "q": "Which orbital element measures how stretched an ellipse is?",
      "steps": [
        "Each orbital element encodes one property of the path.",
        "Eccentricity measures deviation from a circle.",
        "Zero eccentricity is a circle; larger values are more stretched."
      ],
      "a": "Eccentricity."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "astro.uni.kepler"
    ]
  },
  "fast.bio.1": {
    "key": "Strong selection moves the population mean toward the optimum.",
    "why": "Individuals near the optimum leave more offspring, so the heritable mean drifts toward that favoured value over generations.",
    "mistake": "Expecting the mean to jump immediately. Avoid this by waiting for many generations to accumulate.",
    "worked": {
      "q": "With strong selection and the optimum at 0.8, where does the mean head?",
      "steps": [
        "Favoured individuals are those near 0.8.",
        "They leave more offspring each generation.",
        "Over many generations the mean approaches 0.8."
      ],
      "a": "Toward 0.8."
    },
    "sources": [
      "natural selection"
    ],
    "prereqs": [
      "bio.select"
    ]
  },
  "fast.bio.2": {
    "key": "Mutation supplies the new trait values that selection can act on.",
    "why": "Selection removes extremes but cannot create new variation, so without mutation the spread narrows until little remains.",
    "mistake": "Thinking selection creates the variation it favours. Avoid this by comparing the spread with mutation at zero and then positive.",
    "worked": {
      "q": "Selection is acting but mutation is zero. What happens to the spread?",
      "steps": [
        "Selection favours one trait value and removes extremes.",
        "With no mutation, no new values enter.",
        "The spread narrows until little variation remains."
      ],
      "a": "It narrows."
    },
    "sources": [
      "natural selection"
    ],
    "prereqs": [
      "bio.mutation"
    ]
  },
  "fast.bio.3": {
    "key": "Fitness is highest at the environmental optimum and falls away on both sides.",
    "why": "The model uses a Gaussian peak centred on the optimum, so trait values close to it do best and values far from it do worse in either direction.",
    "mistake": "Assuming the highest trait value always wins. Avoid this by locating the peak before predicting which trait is favoured.",
    "worked": {
      "q": "Where is fitness highest on this landscape?",
      "steps": [
        "The Gaussian landscape has one peak.",
        "The peak is centred on the environmental optimum.",
        "Fitness declines for values both below and above it."
      ],
      "a": "At the environment optimum."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "bio.uni.landscape"
    ]
  },
  "fast.bio.4": {
    "key": "Moving the optimum redirects selection toward the new favoured trait.",
    "why": "The fitness peak relocates with the optimum, so individuals near the new value now leave more offspring and the mean follows.",
    "mistake": "Expecting the population to keep tracking the old optimum. Avoid this by resetting the optimum before the run.",
    "worked": {
      "q": "The optimum jumps from 0.2 to 0.9. Which way does the mean move?",
      "steps": [
        "The fitness peak now sits at 0.9.",
        "Individuals near 0.9 are favoured.",
        "The population mean shifts toward 0.9."
      ],
      "a": "Toward the new optimum at 0.9."
    },
    "sources": [
      "natural selection"
    ],
    "prereqs": [
      "bio.select"
    ]
  },
  "fast.bio.5": {
    "key": "Raising the mutation rate widens the trait spread.",
    "why": "More new values appear each generation than selection can remove, so the distribution broadens as mutation increases.",
    "mistake": "Assuming stronger selection widens the spread. Avoid this by isolating one knob at a time.",
    "worked": {
      "q": "Which change widens the spread of traits?",
      "steps": [
        "Mutation introduces new trait values each generation.",
        "Selection removes values away from the optimum.",
        "Increasing mutation adds values faster than selection removes them."
      ],
      "a": "Increasing the mutation rate."
    },
    "sources": [
      "natural selection"
    ],
    "prereqs": [
      "bio.mutation"
    ]
  },
  "fast.bio.6": {
    "key": "The model tracks the population mean and spread rather than every individual.",
    "why": "Real populations contain countless individuals, but two summary numbers capture the broad response to selection and mutation.",
    "mistake": "Reading the two numbers as a complete description of a real population. Avoid this by noting what the model leaves out.",
    "worked": {
      "q": "What does this simplified model keep track of?",
      "steps": [
        "Real populations involve many individuals.",
        "This model reduces them to two summary statistics.",
        "Those are the population mean and spread."
      ],
      "a": "The population mean and spread."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "bio.uni.landscape"
    ]
  },
  "fast.stats.1": {
    "key": "Very small samples produce widely scattered sample means.",
    "why": "With only a few observations, one unusual value can shift the mean a lot, so successive samples land in different places.",
    "mistake": "Concluding the population itself is erratic. Avoid this by raising n and watching the scatter shrink.",
    "worked": {
      "q": "Why do sample means vary so much when n = 3?",
      "steps": [
        "Each sample averages only three observations.",
        "A single extreme value strongly moves such a mean.",
        "Successive samples then land in different places."
      ],
      "a": "Because each sample is very small."
    },
    "sources": [
      "standard error"
    ],
    "prereqs": [
      "stats.p.draw"
    ]
  },
  "fast.stats.2": {
    "key": "Each bar of the histogram counts sample means that fall in a range.",
    "why": "One sample contributes a single mean, and as samples accumulate those means stack into bars showing how often each range occurs.",
    "mistake": "Reading a bar as one raw observation. Avoid this by tracking what a single sample adds to the histogram.",
    "worked": {
      "q": "What does one bar of the histogram represent?",
      "steps": [
        "One sample produces one mean.",
        "Means are sorted into ranges.",
        "Each bar counts the means in its range."
      ],
      "a": "The means of many samples in a range."
    },
    "sources": [
      "central limit theorem"
    ],
    "prereqs": [
      "stats.pile"
    ]
  },
  "fast.stats.3": {
    "key": "Quadrupling the sample size halves the spread of the sample means.",
    "why": "The standard error is σ/√n, so the spread scales with the inverse square root of n.",
    "mistake": "Assuming spread falls linearly with n. Avoid this by applying σ/√n, which needs four times the data for half the error.",
    "worked": {
      "q": "If n is multiplied by four, what happens to the spread of the means?",
      "steps": [
        "Standard error equals σ/√n.",
        "Multiplying n by four makes √n twice as large.",
        "Dividing σ by a twice-as-large root halves the spread."
      ],
      "a": "It is cut in half."
    },
    "sources": [
      "standard error"
    ],
    "prereqs": [
      "stats.se"
    ]
  },
  "fast.stats.4": {
    "key": "The white curve is a theoretical prediction, not a line fitted to the bars.",
    "why": "It comes from the stated rule for the mean and σ/√n, so it can be drawn before any samples are collected.",
    "mistake": "Believing the curve is adjusted to match the tallest bar. Avoid this by noting that it appears before the data.",
    "worked": {
      "q": "Where does the white curve come from?",
      "steps": [
        "It is derived from the theoretical rule for sample means.",
        "Its width is set by σ/√n, not by the bars.",
        "It is drawn before the data, so nothing is fitted."
      ],
      "a": "It is a theoretical prediction."
    },
    "sources": [
      "central limit theorem"
    ],
    "prereqs": [
      "stats.ls.predict"
    ]
  },
  "fast.stats.5": {
    "key": "Larger samples produce a tighter cluster of sample means.",
    "why": "Averaging more observations reduces the standard error, so each sample mean is a more reliable estimate and the bars bunch together.",
    "mistake": "Expecting more samples, rather than larger ones, to narrow the cluster. Avoid this by raising n instead of only the sample count.",
    "worked": {
      "q": "Raising n from 2 to 100, what happens to the cluster of means?",
      "steps": [
        "Standard error falls as σ/√n.",
        "A larger n gives a smaller spread.",
        "The sample means bunch tightly together."
      ],
      "a": "The cluster tightens."
    },
    "sources": [
      "standard error"
    ],
    "prereqs": [
      "stats.p.draw"
    ]
  },
  "fast.stats.6": {
    "key": "For a larger sample size, the predicted spread of the means shrinks.",
    "why": "The predicted spread is σ/√n, which decreases as n grows, so it can be computed before any samples are drawn.",
    "mistake": "Waiting for data before making a prediction. Avoid this by computing σ/√n from n first.",
    "worked": {
      "q": "For a larger sample size, what happens to the predicted spread?",
      "steps": [
        "Predicted spread is σ/√n.",
        "A larger n makes the denominator larger.",
        "The predicted spread therefore shrinks."
      ],
      "a": "It shrinks."
    },
    "sources": [
      "standard error"
    ],
    "prereqs": [
      "stats.se"
    ]
  },
  "cli.albedo": {
    "key": "Raising albedo reflects more sunlight away, so less energy enters the surface and its equilibrium temperature falls.",
    "why": "In the balance, absorbed sunlight is the incoming energy times (1 − α), so a larger α leaves less to radiate away and a cooler surface radiates less, restoring the match. Snow and ice have high albedo while open ocean is dark, so replacing dark surface with bright surface lowers the absorbed energy.",
    "mistake": "Thinking reflected light still warms the surface on its way out, or that albedo changes the outgoing radiation law. Reflection happens before absorption, so it removes energy from the budget and leaves the Stefan–Boltzmann response unchanged.",
    "worked": {
      "q": "If albedo rises from 0.3 to 0.5 at fixed sunlight, what happens to absorbed sunlight?",
      "steps": [
        "The absorbed fraction is 1 − α.",
        "At α = 0.3 the fraction is 0.7.",
        "At α = 0.5 the fraction is 0.5, so the absorbed energy falls."
      ],
      "a": "Absorbed sunlight falls from 0.7 to 0.5 of the incoming amount, so the surface cools."
    },
    "sources": [
      "one-layer energy balance model",
      "Stefan–Boltzmann law"
    ],
    "prereqs": [
      "cli.p.sun"
    ]
  },
  "cli.warm": {
    "key": "Lowering emissivity traps more heat and raises the equilibrium temperature in the one-layer model.",
    "why": "The balance T = ((S/4)(1−α)/εσ)^¼ shows temperature rising when ε falls, because a surface that sheds radiation less readily must get hotter to emit the same absorbed energy. The fourth root makes the temperature response sub-linear in the energy supplied.",
    "mistake": "Treating the toy model temperature change as a forecast. It shows the mechanism alone; fuller models add feedbacks and come out warmer for the same forcing, and that gap is an uncertainty to name rather than an error.",
    "worked": {
      "q": "In T = ((S/4)(1−α)/εσ)^¼, what happens to T if ε decreases?",
      "steps": [
        "ε sits in the denominator inside the fourth root.",
        "A smaller denominator makes the fraction larger.",
        "A larger quantity raised to the ¼ power gives a larger T."
      ],
      "a": "T rises."
    },
    "sources": [
      "Stefan–Boltzmann law",
      "one-layer energy balance model"
    ],
    "prereqs": [
      "cli.p.sun",
      "cli.albedo"
    ]
  },
  "eng.chord": {
    "key": "In this truss the bottom chord carries the largest force, in tension, while the top chord carries compression.",
    "why": "The load path funnels the applied force through the member groups, and the solved equilibrium leaves the bottom chord working hardest in tension. The top chord compression mostly restrains the bottom chord from sagging.",
    "mistake": "Assuming the top chord works hardest because it sits above the load. Force magnitude comes from the linear solve, not from visual position, so read the bottom_chord_force observable rather than guessing from the picture.",
    "worked": {
      "q": "Which member group carries the most force in this truss?",
      "steps": [
        "The 20 kN load pulls on the whole frame.",
        "The solver reports a force for each member group.",
        "The bottom chord reads highest, in tension."
      ],
      "a": "The bottom chord."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "eng.p.bridge"
    ]
  },
  "eng.budget": {
    "key": "A factor of safety of 2.5 can be reached on a limited budget by spending on the bottom chord and keeping the diagonals lean.",
    "why": "Material cost scales with member volume, so strength and cost pull against each other, while factor of safety is yield strength divided by the worst stress. The efficient design grows whichever member the solver flags as governing, because that is what moves the safety ratio most per dollar.",
    "mistake": "Thickening every member to gain safety. That raises cost faster than safety, since only the governing member sets the factor; targeted strengthening with the less-loaded members left lean is the cheaper route.",
    "worked": {
      "q": "Why not enlarge all three member groups to meet the safety target?",
      "steps": [
        "Factor of safety depends on the single worst-stress member.",
        "Cost grows with every member volume.",
        "Enlarging non-governing members adds cost without raising safety."
      ],
      "a": "Because cost rises across all members while safety only improves via the governing member, so targeted strengthening is cheaper."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "eng.ls.cost",
      "eng.chord"
    ]
  },
  "cli.p.sun": {
    "key": "Surface temperature settles where incoming absorbed energy equals outgoing radiated heat.",
    "why": "If more energy arrives than leaves, the surface warms, which increases radiated heat until the two match; that matching point is equilibrium. The one-layer model shows this relaxation directly through its absorbed and radiated bars.",
    "mistake": "Thinking temperature should stop changing once sunlight stops increasing. Equilibrium is about the balance of in and out, so the surface can keep warming after the sunlight is held steady until outgoing radiation catches up.",
    "worked": {
      "q": "More energy comes in than leaves; what happens next?",
      "steps": [
        "The surface has a net energy gain.",
        "Its temperature rises.",
        "Radiated heat grows until it matches the incoming energy."
      ],
      "a": "The surface warms until outgoing radiation catches up."
    },
    "sources": [
      "one-layer energy balance model"
    ],
    "prereqs": []
  },
  "cli.uni.feedback": {
    "key": "The one-layer balance is exact for its toy world, while fuller models differ because they include feedbacks this layer omits.",
    "why": "The formula T = ((S/4)(1−α) / εσ)^¼ assumes a single layer with no ocean, clouds or circulation, so its result differs from a comprehensive model by the processes left out. That difference is the honest uncertainty of the simplification.",
    "mistake": "Treating the toy result as either a full-model answer or a mistake. The formula is exact under the stated toy assumptions; the point of the lesson is the feedbacks and transport that are missing, not a faulty calculation.",
    "worked": {
      "q": "Why does a fuller climate model answer differently for the same sunlight?",
      "steps": [
        "The one-layer model fixes a single emissivity coefficient.",
        "Real systems add clouds, transport and other feedbacks.",
        "Those processes change the balance and the resulting temperature."
      ],
      "a": "Because of feedbacks and heat transport this layer omits, not a different Stefan–Boltzmann constant."
    },
    "sources": [
      "one-layer energy balance model",
      "Stefan–Boltzmann law"
    ],
    "prereqs": [
      "cli.warm"
    ]
  },
  "eng.p.bridge": {
    "key": "Trusses use triangles because a triangle cannot change shape without a member changing length.",
    "why": "Pin-jointed triangles are geometrically rigid, so the frame holds its shape and its forces follow from equilibrium equations rather than from flexible deformation. Changing a member redistributes the forces but leaves the geometry intact.",
    "mistake": "Thinking triangles are chosen because they are cheap or flexible. Their value is stiffness, and that rigidity is what lets the solver treat the frame as a determinate system of equations.",
    "worked": {
      "q": "Why are triangles used in trusses?",
      "steps": [
        "Truss members are pinned at their ends.",
        "A triangle shape is fixed unless a side changes length.",
        "That rigidity lets the solver write a determinate system."
      ],
      "a": "Because triangles are stiff — their shape cannot change without a member changing length."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "eng.ls.cost": {
    "key": "Raising every member size raises material cost, so strength and cost pull against each other.",
    "why": "Cost tracks member volume, so thickening all members increases the bill, and the design task is placing strength where it is actually needed. Showing factor of safety and cost together makes that trade-off visible.",
    "mistake": "Assuming a safer truss is automatically affordable. Every area increase adds cost, so the skill is finding the smallest member that meets the safety target rather than maximizing all of them.",
    "worked": {
      "q": "What happens to material cost when every member is made thicker?",
      "steps": [
        "Cost scales with member volume.",
        "Volume grows with cross-sectional area.",
        "Larger areas across all members raise the total cost."
      ],
      "a": "Cost rises."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "eng.chord"
    ]
  },
  "cli.seasons.tilt": {
    "key": "Axial tilt creates the seasonal contrast in sunlight between hemispheres; with zero tilt the two seasonal means coincide.",
    "why": "With a tilted axis, each hemisphere leans toward the sun at a different point in the orbit, changing the sunlight it receives and opening the gap between its summer and winter means. At zero tilt every latitude receives the same light all year, so the two means overlap.",
    "mistake": "Believing the seasons come from Earth being nearer to or farther from the sun. Distance moves both means together; it is the lean of the axis that creates the difference between seasons in this model.",
    "worked": {
      "q": "With axial tilt set to zero, what happens to the seasonal contrast?",
      "steps": [
        "No tilt means no hemisphere leans toward the sun.",
        "Every latitude gets the same light all year.",
        "The two seasonal means coincide."
      ],
      "a": "The contrast falls to zero — the means sit on top of each other."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "cli.seasons.distance": {
    "key": "Changing orbital distance shifts both seasonal means together but barely changes the contrast between them.",
    "why": "Distance changes the overall sunlight received, which moves both hemispheres in the same direction, while the tilt-driven difference between them is set by geometry. The gap therefore stays nearly constant as the pair slides up or down.",
    "mistake": "Assuming moving the planet closer creates larger seasonal swings. The contrast is set mainly by axial tilt; distance raises or lowers both means together and changes very little about the gap.",
    "worked": {
      "q": "If the planet moves farther from the sun, what happens to the seasonal contrast?",
      "steps": [
        "Greater distance lowers the sunlight at every latitude.",
        "Both seasonal means fall together.",
        "The gap between them, set by tilt, barely changes."
      ],
      "a": "The contrast changes very little."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "cli.seasons.tilt"
    ]
  },
  "eng.materials": {
    "key": "The strength-to-weight ratio is set by the material choice, not by how wide the member is.",
    "why": "Widening a member raises both the load it carries and its mass, so the ratio between them holds steady; changing the material is what changes the ratio. Wood shows the highest ratio among the three choices in this model.",
    "mistake": "Expecting a wider member to improve its strength-to-weight ratio. Capacity and mass rise together, leaving the ratio unchanged, so only the material factor can move it.",
    "worked": {
      "q": "Doubling the member width, what happens to its strength-to-weight ratio?",
      "steps": [
        "Doubling width raises the load capacity.",
        "It also raises the mass by the same factor.",
        "The ratio of the two is unchanged."
      ],
      "a": "It stays the same; only changing the material changes the ratio."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "eng.materials.trade": {
    "key": "Steel has the highest yield load in this model while wood has the best strength-to-weight ratio; which wins depends on the question.",
    "why": "The strongest material in absolute terms and the best per unit mass are different criteria, so the numbers point to different choices. These are simplified model factors rather than engineering data, and the note states what is left out.",
    "mistake": "Treating the highest absolute strength as automatically the best choice. If the goal is strength for the least mass, the ratio points to wood rather than steel, so state which criterion is being optimized before picking.",
    "worked": {
      "q": "For strength with the least mass, which material do these model numbers favour?",
      "steps": [
        "Compare yield load: steel is highest.",
        "Compare yield load divided by mass: wood is highest.",
        "The least-mass criterion uses the ratio."
      ],
      "a": "Wood."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "eng.materials"
    ]
  },
  "fast.climate.1": {
    "key": "At equilibrium the absorbed and radiated bars are equal, and the surface temperature adjusts until they match.",
    "why": "Sunlight arrives as absorbed energy and leaves as radiated heat; when the bars differ, temperature moves until outgoing radiation catches up with the incoming energy. This layer adds no feedbacks and stores no heat.",
    "mistake": "Reading the bars as permanently unequal after a change. They converge at equilibrium; a gap exists only while the surface is still adjusting to the new input.",
    "worked": {
      "q": "Once the surface settles, how do absorbed and radiated energy compare?",
      "steps": [
        "A temperature change alters the radiated heat.",
        "It continues until radiated equals absorbed.",
        "At that point the temperature stops changing."
      ],
      "a": "They are equal."
    },
    "sources": [
      "one-layer energy balance model"
    ],
    "prereqs": []
  },
  "fast.climate.2": {
    "key": "Raising albedo reflects sunlight away before it can be absorbed, so the surface cools.",
    "why": "Reflected energy never enters the surface budget, so a higher albedo lowers the absorbed bar and a cooler surface then radiates the smaller amount away. This layer has no ice or cloud feedback to amplify the change.",
    "mistake": "Thinking reflected sunlight still warms the surface on its way out. Reflection happens before absorption, so it removes energy from the budget altogether.",
    "worked": {
      "q": "Raising albedo made the surface warmer or cooler?",
      "steps": [
        "Higher albedo means more reflected sunlight.",
        "Less energy is absorbed by the surface.",
        "A cooler surface radiates the smaller amount away."
      ],
      "a": "Cooler."
    },
    "sources": [
      "one-layer energy balance model"
    ],
    "prereqs": [
      "fast.climate.1"
    ]
  },
  "fast.climate.3": {
    "key": "Lower emissivity means the surface sheds radiation less readily, so it must warm further to balance the same absorbed sunlight.",
    "why": "Emissivity sits in the denominator of T = ((S/4)(1−α)/εσ)^¼, so decreasing it raises the equilibrium temperature; the same absorbed energy needs a higher temperature to escape. Here one coefficient stands in for the whole atmosphere.",
    "mistake": "Reversing the direction by thinking higher emissivity traps more heat. Higher emissivity lets heat escape more easily and the surface settles cooler; lowering it is the trapping direction.",
    "worked": {
      "q": "Lowering emissivity made the surface warmer or cooler?",
      "steps": [
        "Emissivity is in the denominator inside the fourth root.",
        "A smaller denominator makes the equilibrium expression larger.",
        "The surface warms to radiate the same energy away."
      ],
      "a": "Warmer."
    },
    "sources": [
      "one-layer energy balance model",
      "Stefan–Boltzmann law"
    ],
    "prereqs": [
      "fast.climate.1"
    ]
  },
  "fast.climate.4": {
    "key": "Because radiated power grows as the fourth power of temperature, temperature grows as the fourth root of the energy supplied and the response is sub-linear.",
    "why": "Temperature scales with the fourth root of absorbed energy, so a 36% rise in that energy gives about 1.36^(¼) ≈ 1.08, an 8% rise in kelvin. The fourth root compresses a large flux change into a small temperature change.",
    "mistake": "Assuming temperature scales linearly with absorbed energy. A 36% flux rise is not a 36% temperature rise; apply the fourth root in kelvin rather than direct proportionality.",
    "worked": {
      "q": "Absorbed energy rises about 36%; roughly how much does equilibrium temperature in kelvin rise?",
      "steps": [
        "Temperature scales as the fourth root of absorbed energy.",
        "Compute 1.36^(¼).",
        "That value is close to 1.08."
      ],
      "a": "About 8%."
    },
    "sources": [
      "Stefan–Boltzmann law"
    ],
    "prereqs": [
      "fast.climate.1"
    ]
  },
  "fast.climate.5": {
    "key": "The instrument solves one equation for one layer and omits ocean, clouds, ice, seasons and circulation, so it shows mechanism rather than forecast.",
    "why": "A fuller climate model includes feedbacks and heat transport that this layer does not, so it answers differently for the same sunlight. The gap between the toy number and the fuller model is the honest uncertainty the app names.",
    "mistake": "Treating the one-layer result as a real-world prediction. It is exact only for its simplified assumptions; the missing feedbacks are what the lesson points to, not a calculation error.",
    "worked": {
      "q": "Why does a fuller climate model give a different answer for the same sunlight?",
      "steps": [
        "This layer fixes a single coefficient and omits feedbacks.",
        "Real models add clouds, transport and other processes.",
        "Those processes alter the balance and the temperature."
      ],
      "a": "Because of feedbacks and heat transport this layer omits."
    },
    "sources": [
      "one-layer energy balance model"
    ],
    "prereqs": [
      "fast.climate.1"
    ]
  },
  "fast.climate.6": {
    "key": "Surface is the live temperature, equilibrium is where it is heading, and the two bars show the energy fluxes driving the change.",
    "why": "After a change in sunlight, radiated and absorbed are briefly unequal, so the surface cools or warms as it relaxes toward equilibrium over a few seconds. Reading all four rows together shows what is moving and in which direction.",
    "mistake": "Expecting the surface to jump at once to its new equilibrium. It relaxes over time; right after sunlight drops, radiated exceeds absorbed and the surface cools gradually.",
    "worked": {
      "q": "Right after solar output drops, radiated is briefly larger than absorbed, so the surface…?",
      "steps": [
        "A net energy loss removes heat from the surface.",
        "Radiated exceeding absorbed means more energy leaves than arrives.",
        "The surface cools until the bars meet again."
      ],
      "a": "Cools."
    },
    "sources": [
      "one-layer energy balance model",
      "Stefan–Boltzmann law"
    ],
    "prereqs": [
      "fast.climate.1"
    ]
  },
  "fast.eng.1": {
    "key": "Pin-jointed triangles keep their shape, letting the solver write one equilibrium equation per degree of freedom.",
    "why": "Each bar is pinned at its ends and carries force along its length; because triangles are rigid, the frame holds its shape and its forces are determined by equilibrium. That rigidity is why a unique set of forces exists at all.",
    "mistake": "Assuming the frame can flex like a four-bar linkage. A triangle cannot change shape without a member changing length, and that constraint is what closes the system of equations.",
    "worked": {
      "q": "Why does a triangle keep its shape in this truss?",
      "steps": [
        "Members are pinned at their ends.",
        "A triangle geometry is fixed unless a side changes length.",
        "That rigidity gives a determinate set of forces."
      ],
      "a": "Because changing its shape would require a member to change length."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.eng.2": {
    "key": "Factor of safety is sample yield strength divided by the worst member stress, a ratio from this truss rather than a guarantee about a real structure.",
    "why": "With yield strength fixed, the factor moves inversely with peak stress, so halving the peak stress doubles it. The governing member is whichever one the solver flags as most stressed at that setting.",
    "mistake": "Treating factor of safety as an absolute promise of performance. It is a ratio built from simplified sample figures, and it shifts as the worst-stress member changes.",
    "worked": {
      "q": "If peak stress doubles while yield strength stays fixed, what happens to factor of safety?",
      "steps": [
        "Factor of safety equals yield strength divided by peak stress.",
        "The denominator doubles.",
        "The ratio therefore halves."
      ],
      "a": "It halves."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fast.eng.1"
    ]
  },
  "fast.eng.3": {
    "key": "Strengthening the group with the peak stress often hands the highest stress to a different group.",
    "why": "Stress is a distribution across the whole truss, so enlarging one group redistributes forces and the peak can migrate; an efficient design strengthens the governing groups in turn.",
    "mistake": "Repeatedly enlarging the same member expecting the peak to fall to zero. Once it stops governing, another group becomes the peak, so watch the peak_stress readout rather than focusing on one member.",
    "worked": {
      "q": "After strengthening the member with the peak stress, what often happens?",
      "steps": [
        "The truss redistributes its internal forces.",
        "The formerly weakest group is no longer governing.",
        "Another group now reads highest."
      ],
      "a": "The peak moves to another member."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fast.eng.2"
    ]
  },
  "fast.eng.4": {
    "key": "Material cost sums volume times sample density and price across members, so with fixed lengths the cross-sectional areas decide the bill.",
    "why": "Volume is length times area and the geometry fixes each length, so raising an area raises cost; the diagonals carry the most total length and dominate the bill. The prices are sample figures, so the numbers illustrate arithmetic rather than a quote.",
    "mistake": "Thinking cost is driven by the number of nodes or the colours of the bars. With lengths fixed, only the areas change volume, and the member with the most total length has the largest cost effect.",
    "worked": {
      "q": "With member lengths fixed, what drives material cost?",
      "steps": [
        "Cost comes from volume times density and price.",
        "Volume equals length times cross-sectional area.",
        "Lengths are fixed, so the areas set the cost."
      ],
      "a": "The cross-sectional areas."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "fast.eng.5": {
    "key": "Nine joints give eighteen equilibrium equations for eighteen unknowns, so each member force and reaction has one answer.",
    "why": "Fifteen member forces plus three support reactions make eighteen unknowns, matching the equations; the supports and the matched count close the system, and the solver checks stress only. The numbers come from that linear system rather than from a sketch.",
    "mistake": "Assuming a drawing can supply the forces directly. Forces come from solving the matched equilibrium system; with fewer equations the forces would be undetermined.",
    "worked": {
      "q": "Why does the equation count matching the unknown count matter?",
      "steps": [
        "Nine joints yield eighteen equilibrium equations.",
        "Fifteen member forces plus three reactions give eighteen unknowns.",
        "A matched, supported system yields one solution per unknown."
      ],
      "a": "Each member force and reaction has a single determined answer."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fast.eng.1"
    ]
  },
  "fast.eng.6": {
    "key": "The design goal is the least material that meets the safety target, since thicker members buy safety but spend money.",
    "why": "Safety rises as governing members grow while cost rises with every member volume, so the task is finding the smallest set of members that still reaches the target. The solver supplies the forces and the engineer decides where strength is worth paying for, using sample prices rather than a quote.",
    "mistake": "Trying to maximize strength and minimize cost at the same time without limit. They conflict, so the workable objective is meeting the safety target with the least material rather than maximizing both.",
    "worked": {
      "q": "Because strength costs money, what is the design task?",
      "steps": [
        "Thicker members raise both safety and cost.",
        "The goal fixes a minimum safety factor and a cost cap.",
        "The efficient design uses the least material that still meets safety."
      ],
      "a": "Find the least material that meets the safety target."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "fast.eng.2",
      "fast.eng.4"
    ]
  },

  "eng.p.color": {
    "key": "The colour of a member is its stress: the same force over a smaller area looks louder.",
    "why": "The solver fixes the forces from equilibrium; changing an area changes only stress and cost. Thinning one group therefore recolours it without changing where the load goes.",
    "mistake": "Reading the brightest colour as \"most important\" rather than \"closest to its allowable stress\". Thin the quiet groups and watch how little the safety factor moves.",
    "worked": {
      "q": "At equal areas in this truss, which group shows the higher stress peak?",
      "steps": [
        "Stress is force divided by area.",
        "With equal areas, the larger force gives the larger stress.",
        "The top chord carries the larger force here, so it peaks first."
      ],
      "a": "The top chord."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": []
  },
  "eng.ls.stress": {
    "key": "Stress is force divided by area, so halving an area doubles the stress under the same force.",
    "why": "Equilibrium fixes the member forces regardless of how much steel you buy. The area you choose only decides how hard that fixed force pushes on each square millimetre.",
    "mistake": "Assuming that only the member you changed can become the governing group. Add too much bottom-chord area and another group takes over — read Governing group after each change.",
    "worked": {
      "q": "A member carries 20 kN. Its area drops from 200 to 100 mm². What happens to its stress?",
      "steps": [
        "Stress = force / area.",
        "At 200 mm²: 20000 / 200 = 100 MPa.",
        "At 100 mm²: 20000 / 100 = 200 MPa, twice as much."
      ],
      "a": "It doubles, from 100 MPa to 200 MPa."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "eng.p.color"
    ]
  },
  "eng.uni.critical": {
    "key": "A good design is not just safe — it is safe, cheap, and close enough to its allowable to prove nothing was wasted.",
    "why": "Utilisation measures how much of the FoS 2.5 allowable the governing member is actually using. A design far below it is overbuilt; one at or near it has spent steel where it mattered.",
    "mistake": "Believing any design that stands is finished. A factor of safety of 2.9 under budget can still be wasteful if the critical group is nowhere near its allowable.",
    "worked": {
      "q": "At FoS 2.5 the allowable stress is YIELD / 2.5 = 100 MPa. If the governing member reaches 92 MPa, what is its utilisation?",
      "steps": [
        "Utilisation is stress divided by the allowable stress.",
        "92 / 100 = 0.92.",
        "That is 92% of the allowable."
      ],
      "a": "92%, which passes the 85% capstone clause."
    },
    "sources": [
      "Model derived in this world"
    ],
    "prereqs": [
      "eng.budget"
    ]
  }
};

/* Filled with the six-lesson adult fast path for each world. */
export const FAST_PATH = {
  "physics": [
    {
      "id": "fast.physics.1",
      "world": "physics",
      "stage": "us",
      "path": "adult",
      "title": "Two openings turn one wave into many bands",
      "start": {
        "wavelength": 600,
        "slit_separation": 3,
        "time": 0.55
      },
      "beats": [
        {
          "say": "One beam reaches two narrow slits. Predict what appears on the screen when both openings are lit."
        },
        {
          "say": "Spread the slits until at least nine bright fringes are counted.",
          "until": {
            "obs": "bright_fringes",
            "op": ">=",
            "value": 9
          },
          "hint": "Raise Slit separation; a longer Wavelength also widens the pattern."
        },
        {
          "ask": "The alternating bright and dark bands come from...",
          "options": [
            "two waves overlapping and cancelling",
            "the barrier casting a single shadow",
            "the source changing colour"
          ],
          "answer": 0
        },
        {
          "say": "In step they add into a bright band; out of step they cancel into a dark one."
        }
      ]
    },
    {
      "id": "fast.physics.2",
      "world": "physics",
      "stage": "us",
      "path": "adult",
      "title": "A target fringe count is a solvable setting",
      "start": {
        "wavelength": 550,
        "slit_separation": 12,
        "time": 0.55
      },
      "beats": [
        {
          "say": "The goal asks for exactly five bright fringes. The current setting gives more."
        },
        {
          "say": "Bring the readout to exactly five fringes.",
          "until": {
            "goal": true
          },
          "hint": "Lower Slit separation toward the middle of its range; tune Wavelength if the count overshoots."
        },
        {
          "ask": "Moving the slits closer together changed the fringe count by...",
          "options": [
            "reducing it",
            "increasing it",
            "leaving it unchanged"
          ],
          "answer": 0
        },
        {
          "say": "Closer slits widen each band, so fewer of them fit on the screen."
        }
      ]
    },
    {
      "id": "fast.physics.3",
      "world": "physics",
      "stage": "us",
      "path": "adult",
      "title": "Fringe width is a ratio you can dial in",
      "start": {
        "wavelength": 400,
        "slit_separation": 18,
        "time": 0.55
      },
      "beats": [
        {
          "say": "Fringe width follows w = λL/d, and this world keeps the screen distance fixed."
        },
        {
          "set": {
            "wavelength": 650,
            "slit_separation": 10
          },
          "hold": 2,
          "say": "A longer wavelength and closer slits both stretch the bands."
        },
        {
          "say": "Make the Fringe width readout reach at least 8 cm.",
          "until": {
            "obs": "fringe_width",
            "op": ">=",
            "value": 8
          },
          "hint": "Lower Slit separation and raise Wavelength."
        },
        {
          "ask": "Fringe width grew because the slits moved...",
          "options": [
            "closer together",
            "further apart",
            "not at all"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.physics.4",
      "world": "physics",
      "stage": "us",
      "path": "adult",
      "instrument": "push",
      "title": "Acceleration is a ratio, not a force alone",
      "start": {
        "force": 4,
        "mass": 4
      },
      "beats": [
        {
          "say": "The readout divides the push by the mass being pushed."
        },
        {
          "say": "Lift Acceleration to at least 6 m/s².",
          "until": {
            "obs": "acceleration",
            "op": ">=",
            "value": 6
          },
          "hint": "Lower Mass, or raise Force."
        },
        {
          "ask": "Holding the force steady, a heavier mass gives...",
          "options": [
            "less acceleration",
            "more acceleration",
            "the same acceleration"
          ],
          "answer": 0
        },
        {
          "say": "The same push on more matter builds speed more slowly."
        }
      ]
    },
    {
      "id": "fast.physics.5",
      "world": "physics",
      "stage": "us",
      "path": "adult",
      "instrument": "push",
      "title": "Two seconds turn acceleration into a distance",
      "start": {
        "force": 2,
        "mass": 2
      },
      "beats": [
        {
          "say": "With no drag in this tank, distance over two seconds is ½at²."
        },
        {
          "say": "Send the ball past 6 m in two seconds.",
          "until": {
            "goal": true
          },
          "hint": "Raise Force or lower Mass until the Distance readout passes 6."
        },
        {
          "ask": "Double the force at fixed mass and the two-second distance...",
          "options": [
            "doubles",
            "halves",
            "stays the same"
          ],
          "answer": 0
        },
        {
          "say": "Distance scales with acceleration because the two seconds are held fixed."
        }
      ]
    },
    {
      "id": "fast.physics.6",
      "world": "physics",
      "stage": "us",
      "path": "adult",
      "instrument": "push",
      "title": "Floating is decided by density, not by the push",
      "start": {
        "force": 0,
        "mass": 2
      },
      "beats": [
        {
          "say": "The tank holds one litre, so the mass number doubles as density in kg/L."
        },
        {
          "say": "Drop Density below 1 kg/L and watch the ball rise in the water.",
          "until": {
            "obs": "density",
            "op": "<",
            "value": 1
          },
          "hint": "Lower Mass below 1 kg; Force does not change floating."
        },
        {
          "ask": "A 0.5 kg ball in this one-litre tank...",
          "options": [
            "floats",
            "sinks",
            "sits on the bottom"
          ],
          "answer": 0
        },
        {
          "say": "Force changes how far it travels sideways; density decides whether it rises."
        }
      ]
    }
  ],
  "maths": [
    {
      "id": "fast.maths.1",
      "world": "maths",
      "stage": "us",
      "path": "adult",
      "title": "Amplitude is the distance from midline to peak",
      "start": {
        "amplitude_a": 1,
        "frequency_b": 1,
        "phase_c": 0,
        "shift_d": 0
      },
      "beats": [
        {
          "say": "The dashed guides mark how far the curve swings from its centre line."
        },
        {
          "say": "Raise the Amplitude readout to at least 2.5.",
          "until": {
            "obs": "amplitude",
            "op": ">=",
            "value": 2.5
          },
          "hint": "Move the Amplitude a slider away from zero."
        },
        {
          "ask": "Changing a while holding b fixed changes the...",
          "options": [
            "height of the peaks",
            "number of peaks in view",
            "horizontal position of the peaks"
          ],
          "answer": 0
        },
        {
          "say": "Amplitude stretches the curve vertically and leaves its repeat spacing alone."
        }
      ]
    },
    {
      "id": "fast.maths.2",
      "world": "maths",
      "stage": "us",
      "path": "adult",
      "title": "Period is the reciprocal of frequency",
      "start": {
        "amplitude_a": 2,
        "frequency_b": 1,
        "phase_c": 0,
        "shift_d": 0
      },
      "beats": [
        {
          "say": "Period is shown here in units of π; doubling b halves the gap between repeats."
        },
        {
          "say": "Make the Period readout read 1.00π or less.",
          "until": {
            "obs": "period",
            "op": "<=",
            "value": 1.05
          },
          "hint": "Raise Frequency b toward 2 and beyond."
        },
        {
          "ask": "If b doubles, the period...",
          "options": [
            "halves",
            "doubles",
            "is unchanged"
          ],
          "answer": 0
        },
        {
          "say": "One repeat takes 2π/b, so this readout tracks 2/b in its own units."
        }
      ]
    },
    {
      "id": "fast.maths.3",
      "world": "maths",
      "stage": "us",
      "path": "adult",
      "title": "Phase moves the peaks without reshaping them",
      "start": {
        "amplitude_a": 1,
        "frequency_b": 1,
        "phase_c": 0,
        "shift_d": 0
      },
      "beats": [
        {
          "set": {
            "phase_c": 3.1
          },
          "hold": 2,
          "say": "The whole curve has slid sideways; its height and spacing are untouched."
        },
        {
          "say": "Try a negative phase and watch the peaks slide the other way."
        },
        {
          "ask": "The phase slider c changes...",
          "options": [
            "where the peaks sit horizontally",
            "how tall the peaks are",
            "how far apart the peaks are"
          ],
          "answer": 0
        },
        {
          "say": "Phase sets where the cycle starts, not the shape of the cycle."
        }
      ]
    },
    {
      "id": "fast.maths.4",
      "world": "maths",
      "stage": "us",
      "path": "adult",
      "title": "The steepest slope is amplitude times frequency",
      "start": {
        "amplitude_a": 1,
        "frequency_b": 1,
        "phase_c": 0,
        "shift_d": 0
      },
      "beats": [
        {
          "say": "The derivative curve peaks wherever the original climbs fastest."
        },
        {
          "say": "Push Max slope to at least 6.",
          "until": {
            "obs": "max_slope",
            "op": ">=",
            "value": 6
          },
          "hint": "Raise Amplitude a or Frequency b."
        },
        {
          "ask": "At fixed amplitude, doubling frequency makes the steepest slope...",
          "options": [
            "twice as steep",
            "half as steep",
            "unchanged"
          ],
          "answer": 0
        },
        {
          "say": "The derivative of a·sin(bx+c) is a·b·cos(bx+c), so its peak size is |a·b|."
        }
      ]
    },
    {
      "id": "fast.maths.5",
      "world": "maths",
      "stage": "us",
      "path": "adult",
      "instrument": "blocks",
      "title": "Even groups are what division means",
      "start": {
        "objects": 12,
        "groups": 4
      },
      "beats": [
        {
          "say": "Twelve dots, four groups. Tap dots into groups until none is left in the pile."
        },
        {
          "say": "Get a Per group reading of 3.",
          "until": {
            "obs": "per_group",
            "op": "==",
            "value": 3
          },
          "hint": "Tap each unplaced dot into a group until all twelve are placed and the groups match."
        },
        {
          "ask": "When every group holds the same number and nothing is left over, 12 ÷ 4 is...",
          "options": [
            "3",
            "4",
            "12"
          ],
          "answer": 0
        },
        {
          "say": "The readout shows a number only once the groups are even; before that it shows a dash."
        }
      ]
    },
    {
      "id": "fast.maths.6",
      "world": "maths",
      "stage": "us",
      "path": "adult",
      "instrument": "blocks",
      "title": "A division sentence and a picture say the same thing",
      "start": {
        "objects": 24,
        "groups": 6
      },
      "beats": [
        {
          "say": "The written line 24 ÷ 6 = 4 should match what you see in the trays."
        },
        {
          "say": "Build the picture that makes Per group read 4.",
          "until": {
            "obs": "per_group",
            "op": "==",
            "value": 4
          },
          "hint": "Move all 24 dots into the 6 groups so every tray matches."
        },
        {
          "ask": "Eighteen objects shared into three even groups give a Per group reading of...",
          "options": [
            "6",
            "3",
            "18"
          ],
          "answer": 0
        },
        {
          "say": "Spread is the gap between the fullest and emptiest group, so it falls to zero when sharing is even."
        }
      ]
    }
  ],
  "chem": [
    {
      "id": "fast.chem.1",
      "world": "chem",
      "stage": "us",
      "path": "adult",
      "title": "One tile carries identity, family and pulling power",
      "start": {
        "atomic_number": 6
      },
      "beats": [
        {
          "say": "Open a few tiles and read the small number, the symbol and the family colour."
        },
        {
          "say": "Open at least three different elements.",
          "until": {
            "obs": "elements_opened",
            "op": ">=",
            "value": 3
          },
          "hint": "Move the Atomic number slider through several values."
        },
        {
          "ask": "The number printed at the top of a tile is the...",
          "options": [
            "atomic number",
            "atomic mass",
            "electronegativity"
          ],
          "answer": 0
        },
        {
          "say": "The card spells out each value; the tile keeps the essentials in one glance."
        }
      ]
    },
    {
      "id": "fast.chem.2",
      "world": "chem",
      "stage": "us",
      "path": "adult",
      "title": "One element wins the pulling contest",
      "start": {
        "atomic_number": 6
      },
      "beats": [
        {
          "say": "Electronegativity describes how strongly an atom pulls electrons in a bond."
        },
        {
          "say": "Find the element with the highest pulling power in this table.",
          "until": {
            "goal": true
          },
          "hint": "Scan the Pulling power view, or set Atomic number toward the upper right of the table."
        },
        {
          "ask": "Which element has the highest electronegativity in this dataset?",
          "options": [
            "fluorine",
            "chlorine",
            "oxygen"
          ],
          "answer": 0
        },
        {
          "say": "Fluorine reads 3.98, the largest value recorded here."
        }
      ]
    },
    {
      "id": "fast.chem.3",
      "world": "chem",
      "stage": "us",
      "path": "adult",
      "title": "A group repeats the same outer shell",
      "start": {
        "atomic_number": 53
      },
      "beats": [
        {
          "say": "Iodine sits in the halogen column. Moving up that column keeps the outer-shell pattern while changing the pull."
        },
        {
          "say": "Reach an electronegativity of at least 3.1 while staying in that column.",
          "until": {
            "obs": "electronegativity",
            "op": ">=",
            "value": 3.1
          },
          "hint": "Lower Atomic number from 53 toward chlorine at 17 or fluorine at 9."
        },
        {
          "ask": "Elements in the same group share...",
          "options": [
            "the same outer-shell structure",
            "the same atomic mass",
            "the same period"
          ],
          "answer": 0
        },
        {
          "say": "Going up a group strengthens the pull even though the outer-shell structure repeats."
        }
      ]
    },
    {
      "id": "fast.chem.4",
      "world": "chem",
      "stage": "us",
      "path": "adult",
      "title": "Across a period the pull climbs",
      "start": {
        "atomic_number": 3
      },
      "beats": [
        {
          "say": "Lithium begins period 2; fluorine ends the reactive part of that row."
        },
        {
          "say": "Raise electronegativity past 3.4 by moving right across the row.",
          "until": {
            "obs": "electronegativity",
            "op": ">=",
            "value": 3.4
          },
          "hint": "Increase Atomic number from 3 toward oxygen at 8 and fluorine at 9."
        },
        {
          "ask": "Moving left to right across a period, electronegativity...",
          "options": [
            "increases",
            "decreases",
            "stays the same"
          ],
          "answer": 0
        },
        {
          "say": "Colour the table by pulling power and the rise across each row becomes visible."
        }
      ]
    },
    {
      "id": "fast.chem.5",
      "world": "chem",
      "stage": "us",
      "path": "adult",
      "title": "A full outer shell explains the quiet corner",
      "start": {
        "atomic_number": 10
      },
      "beats": [
        {
          "say": "Neon sits at the far right of its row with a full outer shell."
        },
        {
          "set": {
            "atomic_number": 2
          },
          "hold": 2,
          "say": "Helium is the same idea one row higher."
        },
        {
          "ask": "On a noble gas card, electronegativity is shown as...",
          "options": [
            "a dash",
            "the largest number",
            "zero"
          ],
          "answer": 0
        },
        {
          "say": "The table leaves that value blank for the noble gases."
        }
      ]
    },
    {
      "id": "fast.chem.6",
      "world": "chem",
      "stage": "us",
      "path": "adult",
      "title": "Atomic number is a coordinate you can navigate by",
      "start": {
        "atomic_number": 6
      },
      "beats": [
        {
          "say": "The slider is a coordinate, not a place in a list: each number fixes one row and column."
        },
        {
          "say": "Sweep the slider until you have opened at least six elements.",
          "until": {
            "obs": "elements_opened",
            "op": ">=",
            "value": 6
          },
          "hint": "Move Atomic number through several values, including 9."
        },
        {
          "ask": "Which atomic number selects fluorine?",
          "options": [
            "9",
            "17",
            "8"
          ],
          "answer": 0
        },
        {
          "say": "Enter 9 and the tile, the card and the electronegativity readout switch together."
        }
      ]
    }
  ],
  "art": [
    {
      "id": "fast.art.1",
      "world": "art",
      "stage": "us",
      "path": "adult",
      "title": "Three values can describe a whole form.",
      "start": {
        "brush": 8
      },
      "beats": [
        {
          "say": "This canvas builds an image from a few values rather than a large palette."
        },
        {
          "say": "Limit yourself to three distinct values: a light, a middle, and a dark."
        },
        {
          "say": "Add strokes until the drawing holds three distinct values.",
          "until": {
            "obs": "distinct_values",
            "op": ">=",
            "value": 3
          },
          "hint": "Switch between three value swatches and draw."
        },
        {
          "ask": "What limits the drawing to three values?",
          "options": [
            "Using only three distinct value swatches",
            "Setting the brush to exactly three pixels",
            "Drawing exactly three strokes"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.art.2",
      "world": "art",
      "stage": "us",
      "path": "adult",
      "title": "Five values give a study more range than three.",
      "start": {
        "brush": 12
      },
      "beats": [
        {
          "say": "Widen the value set from three steps to five."
        },
        {
          "say": "A five-value study separates light, two middle steps, shadow, and dark."
        },
        {
          "say": "Build up to five distinct values on the canvas.",
          "until": {
            "obs": "distinct_values",
            "op": ">=",
            "value": 5
          },
          "hint": "Pick a fifth value swatch and add strokes."
        },
        {
          "ask": "Compared with three values, what does a five-value study add?",
          "options": [
            "More intermediate steps between light and dark",
            "A larger brush",
            "More strokes of the same value"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.art.3",
      "world": "art",
      "stage": "us",
      "path": "adult",
      "title": "A wider brush covers more canvas per stroke.",
      "start": {
        "brush": 3
      },
      "beats": [
        {
          "say": "The brush control sets how wide each stroke lands."
        },
        {
          "set": {
            "brush": 3
          },
          "hold": 2,
          "say": "Watch how little a narrow brush covers."
        },
        {
          "set": {
            "brush": 44
          },
          "hold": 2,
          "say": "The same gesture with a wide brush covers far more."
        },
        {
          "say": "Draw a few strokes to see the covered area grow.",
          "until": {
            "obs": "strokes",
            "op": ">=",
            "value": 3
          },
          "hint": "Drag on the canvas to draw."
        },
        {
          "ask": "What changes when you raise the brush slider?",
          "options": [
            "The area each stroke covers",
            "The number of value swatches",
            "The colour of the canvas"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.art.4",
      "world": "art",
      "stage": "us",
      "path": "adult",
      "title": "An edge is where one value meets another.",
      "start": {
        "brush": 10
      },
      "beats": [
        {
          "say": "Edges in this canvas are not outlines; they are places where value changes."
        },
        {
          "say": "Place a dark stroke next to a light stroke and watch the boundary appear."
        },
        {
          "say": "Add strokes until the canvas shows several value boundaries.",
          "until": {
            "obs": "distinct_values",
            "op": ">=",
            "value": 3
          },
          "hint": "Alternate between a light and a dark value swatch."
        },
        {
          "ask": "What creates an edge here?",
          "options": [
            "Two neighbouring values that differ",
            "A thin brush",
            "Drawing an outline first"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.art.5",
      "world": "art",
      "stage": "us",
      "path": "adult",
      "title": "A value readout shows which values you have used.",
      "start": {
        "brush": 16
      },
      "beats": [
        {
          "say": "The value readout reflects how many different values are on the canvas."
        },
        {
          "say": "Each new value you add should raise that count."
        },
        {
          "say": "Push the count to four distinct values.",
          "until": {
            "obs": "distinct_values",
            "op": ">=",
            "value": 4
          },
          "hint": "Choose a new value swatch and draw with it."
        },
        {
          "ask": "What does the value readout tell you?",
          "options": [
            "How many distinct values appear on the canvas",
            "How wide the brush is",
            "How many strokes you made"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.art.6",
      "world": "art",
      "stage": "us",
      "path": "adult",
      "title": "Value blocks can build form before any outline.",
      "start": {
        "brush": 20
      },
      "beats": [
        {
          "say": "Start with broad blocks of value rather than a contour."
        },
        {
          "say": "The form reads from the arrangement of light and dark areas."
        },
        {
          "say": "Lay down a few blocks to build the structure.",
          "until": {
            "obs": "strokes",
            "op": ">=",
            "value": 4
          },
          "hint": "Use a wide brush and fill areas with value."
        },
        {
          "ask": "What builds the form in this approach?",
          "options": [
            "Arranged areas of value",
            "A closed outline drawn first",
            "The brush slider alone"
          ],
          "answer": 0
        }
      ]
    }
  ],
  "music": [
    {
      "id": "fast.music.1",
      "world": "music",
      "stage": "us",
      "path": "adult",
      "title": "A bar groups the pulse into four beats.",
      "start": {
        "tempo": 120
      },
      "beats": [
        {
          "say": "The player steps through a steady pulse at the set tempo."
        },
        {
          "say": "Four of those pulses make one bar."
        },
        {
          "say": "Let the player run until eight notes have sounded.",
          "until": {
            "obs": "notes_played",
            "op": ">=",
            "value": 8
          },
          "hint": "Press play and let it run."
        },
        {
          "ask": "How many beats are in one bar?",
          "options": [
            "Four",
            "Two",
            "Eight"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.music.2",
      "world": "music",
      "stage": "us",
      "path": "adult",
      "title": "At 120 bpm a four-beat bar lasts two seconds.",
      "start": {
        "tempo": 120
      },
      "beats": [
        {
          "say": "Tempo is given in beats per minute, so 120 beats fill one minute."
        },
        {
          "say": "That is two beats each second, and two seconds for a four-beat bar."
        },
        {
          "set": {
            "tempo": 60
          },
          "hold": 2,
          "say": "At half the tempo, the same bar takes twice as long."
        },
        {
          "set": {
            "tempo": 120
          },
          "hold": 2,
          "say": "Back at 120, the bar is two seconds again."
        },
        {
          "ask": "At 120 bpm, how long is one four-beat bar?",
          "options": [
            "2 seconds",
            "1 second",
            "4 seconds"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.music.3",
      "world": "music",
      "stage": "us",
      "path": "adult",
      "title": "A phrase plays as a fixed run of eight notes.",
      "start": {
        "tempo": 100
      },
      "beats": [
        {
          "say": "The phrase holds eight notes in a set order."
        },
        {
          "say": "Play it back and follow the notes as they sound."
        },
        {
          "say": "Run the player until all eight notes have played.",
          "until": {
            "obs": "notes_played",
            "op": ">=",
            "value": 8
          },
          "hint": "Press play and wait for the phrase to finish."
        },
        {
          "ask": "How many notes are in the phrase?",
          "options": [
            "Eight",
            "Four",
            "Sixteen"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.music.4",
      "world": "music",
      "stage": "us",
      "path": "adult",
      "title": "Changing tempo leaves the note order untouched.",
      "start": {
        "tempo": 50
      },
      "beats": [
        {
          "say": "Tempo changes how fast the phrase plays, not which note comes next."
        },
        {
          "set": {
            "tempo": 50
          },
          "hold": 2,
          "say": "Slow: the same eight notes, stretched out."
        },
        {
          "set": {
            "tempo": 200
          },
          "hold": 2,
          "say": "Fast: the same eight notes, compressed."
        },
        {
          "say": "Play through once at the fast setting.",
          "until": {
            "obs": "notes_played",
            "op": ">=",
            "value": 8
          },
          "hint": "Press play and let the phrase finish."
        },
        {
          "ask": "What changes when you raise the tempo?",
          "options": [
            "The speed, not the note order",
            "The order of the notes",
            "The number of notes in the phrase"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.music.5",
      "world": "music",
      "stage": "us",
      "path": "adult",
      "title": "An interval is the distance between two notes.",
      "start": {
        "tempo": 120
      },
      "beats": [
        {
          "say": "Listen to two notes in sequence; the gap between them is an interval."
        },
        {
          "say": "The last-note readout shows where the phrase landed."
        },
        {
          "say": "Play until at least two notes have sounded.",
          "until": {
            "obs": "notes_played",
            "op": ">=",
            "value": 2
          },
          "hint": "Press play and listen to the first two notes."
        },
        {
          "ask": "What is an interval?",
          "options": [
            "The distance between two notes",
            "The tempo of the phrase",
            "The number of bars"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.music.6",
      "world": "music",
      "stage": "us",
      "path": "adult",
      "title": "Counting beats tells you where you are in a bar.",
      "start": {
        "tempo": 120
      },
      "beats": [
        {
          "say": "Follow the pulse and count one, two, three, four."
        },
        {
          "say": "Each count is one beat, and the fourth completes the bar."
        },
        {
          "say": "Let four beats sound.",
          "until": {
            "obs": "notes_played",
            "op": ">=",
            "value": 4
          },
          "hint": "Press play and count along with the pulse."
        },
        {
          "ask": "After four beats, where are you?",
          "options": [
            "At the end of one bar",
            "At the start of a new phrase",
            "Halfway through a note"
          ],
          "answer": 0
        }
      ]
    }
  ],
  "earth": [
    {
      "id": "fast.earth.1",
      "world": "earth",
      "stage": "us",
      "path": "adult",
      "title": "A country here is a stack of dated events.",
      "start": {
        "year": 1900
      },
      "beats": [
        {
          "say": "Open a country to see the events recorded for it."
        },
        {
          "say": "Those events are stacked along a timeline, each with its own year."
        },
        {
          "say": "Open any country on the map to see its events.",
          "until": {
            "goal": true
          },
          "hint": "Click a country on the map."
        },
        {
          "ask": "What does opening a country reveal?",
          "options": [
            "A stack of dated events",
            "Only its current border",
            "A list of neighbouring countries alone"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.earth.2",
      "world": "earth",
      "stage": "us",
      "path": "adult",
      "title": "Scrubbing the year changes what is in view.",
      "start": {
        "year": 1780
      },
      "beats": [
        {
          "say": "The year slider sets the date of the map."
        },
        {
          "set": {
            "year": 2020
          },
          "hold": 2,
          "say": "Moving to 2020 brings later events into view."
        },
        {
          "set": {
            "year": 1780
          },
          "hold": 2,
          "say": "Moving back to 1780 removes them."
        },
        {
          "say": "Scrub the slider and watch which events appear.",
          "until": {
            "obs": "events_in_view",
            "op": ">=",
            "value": 1
          },
          "hint": "Drag the year slider toward 2020."
        },
        {
          "ask": "What does moving the year slider do?",
          "options": [
            "Changes which events are in view",
            "Changes the country outlines",
            "Opens a country automatically"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.earth.3",
      "world": "earth",
      "stage": "us",
      "path": "adult",
      "title": "The map is a snapshot of one chosen year.",
      "start": {
        "year": 1850
      },
      "beats": [
        {
          "say": "The view you see is tied to the year on the slider."
        },
        {
          "set": {
            "year": 1950
          },
          "hold": 2,
          "say": "Change the year and the snapshot changes with it."
        },
        {
          "ask": "What fixes the date of the map view?",
          "options": [
            "The year set on the slider",
            "The last country you opened",
            "The number of events"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.earth.4",
      "world": "earth",
      "stage": "us",
      "path": "adult",
      "title": "The events shown are a curated sample, not a full history.",
      "start": {
        "year": 1900
      },
      "beats": [
        {
          "say": "Only a small set of sample events is loaded into this world."
        },
        {
          "say": "A year with no sample event shows nothing for that year."
        },
        {
          "say": "Find a year that has at least one event.",
          "until": {
            "obs": "events_in_view",
            "op": ">=",
            "value": 1
          },
          "hint": "Move the year slider until an event appears."
        },
        {
          "ask": "Why might some years show no events?",
          "options": [
            "No sample event is recorded for that year",
            "The map has no countries",
            "The slider is broken"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.earth.5",
      "world": "earth",
      "stage": "us",
      "path": "adult",
      "title": "The country shapes come from Natural Earth geometry.",
      "start": {
        "year": 2000
      },
      "beats": [
        {
          "say": "The outlines on the map are drawn from a shared geometry set."
        },
        {
          "say": "That set is labelled Natural Earth, so the shapes stay consistent across years."
        },
        {
          "say": "Click a country to see its outlined shape up close.",
          "until": {
            "goal": true
          },
          "hint": "Point at and click a country on the map."
        },
        {
          "ask": "Where do the country outlines come from?",
          "options": [
            "Natural Earth geometry",
            "Hand-drawn per year",
            "The event list"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.earth.6",
      "world": "earth",
      "stage": "us",
      "path": "adult",
      "title": "Comparing two years reveals what changed between them.",
      "start": {
        "year": 1900
      },
      "beats": [
        {
          "say": "Set the slider to an early year and note the events in view."
        },
        {
          "set": {
            "year": 2000
          },
          "hold": 2,
          "say": "Now move to a later year and compare."
        },
        {
          "say": "Scrub until at least one event is visible.",
          "until": {
            "obs": "events_in_view",
            "op": ">=",
            "value": 1
          },
          "hint": "Drag the year slider toward a year with events."
        },
        {
          "ask": "What does comparing two years show?",
          "options": [
            "Which events are present in one year but not the other",
            "The exact population of each country",
            "The width of the slider"
          ],
          "answer": 0
        }
      ]
    }
  ],
  "cs": [
    {
      "id": "fast.cs.1",
      "world": "cs",
      "stage": "us",
      "path": "adult",
      "title": "You can time two sorts on the same list",
      "start": {
        "array_size": 32,
        "steps_per_frame": 10
      },
      "beats": [
        {
          "say": "Two lanes sort the same list so you can compare their work."
        },
        {
          "set": {
            "steps_per_frame": 30
          },
          "hold": 2,
          "say": "I sped up the drawing so both lanes finish sooner."
        },
        {
          "say": "Raise the list size until bubble sort passes 300 comparisons.",
          "until": {
            "obs": "comparisons_bubble",
            "op": ">=",
            "value": 300
          },
          "hint": "Move the array size slider up."
        },
        {
          "ask": "Which lane made more comparisons on that list?",
          "options": [
            "Bubble sort",
            "Quick sort",
            "They tied"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.cs.2",
      "world": "cs",
      "stage": "us",
      "path": "adult",
      "title": "Steps per frame only changes how fast you watch",
      "start": {
        "array_size": 32,
        "steps_per_frame": 2
      },
      "beats": [
        {
          "say": "Steps per frame sets how many sort steps the drawing shows each frame."
        },
        {
          "set": {
            "steps_per_frame": 40
          },
          "hold": 2,
          "say": "I pushed the speed from 2 to 40 steps per frame."
        },
        {
          "say": "The comparison count stayed the same because the work did not change."
        },
        {
          "ask": "What does raising steps per frame change?",
          "options": [
            "The number of comparisons",
            "Only the watching speed",
            "The sorted order"
          ],
          "answer": 1
        }
      ]
    },
    {
      "id": "fast.cs.3",
      "world": "cs",
      "stage": "us",
      "path": "adult",
      "title": "An n log n curve is a reference, not a promise",
      "start": {
        "array_size": 8,
        "steps_per_frame": 10
      },
      "beats": [
        {
          "say": "The quick lane follows an n log n reference curve."
        },
        {
          "say": "Grow the list until the quick lane passes 100 comparisons.",
          "until": {
            "obs": "comparisons_quick",
            "op": ">=",
            "value": 100
          },
          "hint": "Increase the array size."
        },
        {
          "ask": "What is the n log n curve here?",
          "options": [
            "A reference shape to compare against",
            "An exact count the run must hit",
            "The bubble sort total"
          ],
          "answer": 0
        },
        {
          "ask": "At which list size does that reference fit best?",
          "options": [
            "8",
            "32",
            "64"
          ],
          "answer": 1
        }
      ]
    },
    {
      "id": "fast.cs.4",
      "world": "cs",
      "stage": "us",
      "path": "adult",
      "title": "Doubling the list quadruples bubble sort work",
      "start": {
        "array_size": 16,
        "steps_per_frame": 20
      },
      "beats": [
        {
          "say": "Bubble sort grows with the square of the list length."
        },
        {
          "set": {
            "array_size": 32
          },
          "hold": 2,
          "say": "I doubled the list from 16 to 32 entries."
        },
        {
          "say": "Push the size until bubble sort passes 900 comparisons.",
          "until": {
            "obs": "comparisons_bubble",
            "op": ">=",
            "value": 900
          },
          "hint": "Raise the array size toward 64."
        },
        {
          "ask": "Doubling n under a squared rule multiplies the work by about what factor?",
          "options": [
            "2",
            "4",
            "8"
          ],
          "answer": 1
        }
      ]
    },
    {
      "id": "fast.cs.5",
      "world": "cs",
      "stage": "us",
      "path": "adult",
      "title": "Two lanes reveal the gap between the sorts",
      "start": {
        "array_size": 8,
        "steps_per_frame": 15
      },
      "beats": [
        {
          "say": "Run both lanes together and watch the two counters drift apart."
        },
        {
          "say": "Grow the list until bubble sort passes 500 comparisons.",
          "until": {
            "obs": "comparisons_bubble",
            "op": ">=",
            "value": 500
          },
          "hint": "Increase the array size."
        },
        {
          "ask": "As the list grows, which counter climbs faster?",
          "options": [
            "Bubble sort",
            "Quick sort",
            "Both at the same rate"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.cs.6",
      "world": "cs",
      "stage": "us",
      "path": "adult",
      "title": "A counted comparison measures this run",
      "start": {
        "array_size": 24,
        "steps_per_frame": 10
      },
      "beats": [
        {
          "say": "The counters count comparisons actually made on this run."
        },
        {
          "say": "Nudge the size until quick sort passes 40 comparisons.",
          "until": {
            "obs": "comparisons_quick",
            "op": ">=",
            "value": 40
          },
          "hint": "Move the array size slightly."
        },
        {
          "say": "That number came from measuring this list, not from the algorithm name."
        },
        {
          "ask": "Where does the comparison count come from?",
          "options": [
            "A measurement of this run",
            "A fixed rule from the label",
            "The animation speed"
          ],
          "answer": 0
        }
      ]
    }
  ],
  "finance": [
    {
      "id": "fast.finance.1",
      "world": "finance",
      "stage": "us",
      "path": "adult",
      "title": "This chart only does arithmetic on your numbers",
      "start": {
        "saved_each_month": 100,
        "annual_return": 5
      },
      "beats": [
        {
          "say": "This chart applies the numbers you enter and recommends nothing."
        },
        {
          "set": {
            "saved_each_month": 500
          },
          "hold": 2,
          "say": "I changed my own monthly amount to 500."
        },
        {
          "say": "Raise the monthly amount until the 40 year balance passes $5m.",
          "until": {
            "obs": "balance_at_40y",
            "op": ">=",
            "value": 5
          },
          "hint": "Increase saved each month."
        },
        {
          "ask": "What does this tool do?",
          "options": [
            "Arithmetic on the numbers I enter",
            "Recommend a product to buy",
            "Guarantee a return"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.finance.2",
      "world": "finance",
      "stage": "us",
      "path": "adult",
      "title": "Monthly contributions compound on earlier earnings",
      "start": {
        "saved_each_month": 200,
        "annual_return": 6
      },
      "beats": [
        {
          "say": "Each month earns on the balance already accumulated."
        },
        {
          "say": "Raise the annual return until the balance passes $10m.",
          "until": {
            "obs": "balance_at_40y",
            "op": ">=",
            "value": 10
          },
          "hint": "Increase the annual return."
        },
        {
          "ask": "Why does the balance grow faster than the total deposited?",
          "options": [
            "Earnings earn further earnings",
            "Extra months are added only",
            "The return was lowered"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.finance.3",
      "world": "finance",
      "stage": "us",
      "path": "adult",
      "title": "Inflation changes what a future balance is worth today",
      "start": {
        "saved_each_month": 300,
        "annual_return": 5,
        "inflation": 6
      },
      "beats": [
        {
          "say": "The chart also restates the future balance in money today."
        },
        {
          "say": "Lower inflation until that value passes $3m in today's money.",
          "until": {
            "obs": "in_today_s_money",
            "op": ">=",
            "value": 3
          },
          "hint": "Move the inflation slider down."
        },
        {
          "ask": "What does the money today figure account for?",
          "options": [
            "Inflation eroding purchasing power",
            "Extra monthly deposits",
            "A guaranteed bonus"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.finance.4",
      "world": "finance",
      "stage": "us",
      "path": "adult",
      "title": "A small annual fee compounds into a large loss",
      "start": {
        "saved_each_month": 300,
        "annual_return": 6,
        "annual_fee": 0
      },
      "beats": [
        {
          "say": "The annual fee is subtracted from returns every year."
        },
        {
          "set": {
            "annual_fee": 1.5
          },
          "hold": 2,
          "say": "I added a 1.5 percent annual fee."
        },
        {
          "say": "Raise the fee until the amount lost to fees passes $1m.",
          "until": {
            "obs": "lost_to_fees",
            "op": ">=",
            "value": 1
          },
          "hint": "Increase the annual fee."
        },
        {
          "ask": "Over 40 years, how does a small fee behave?",
          "options": [
            "It compounds into a large loss",
            "It stays a tiny fixed cost",
            "It raises the balance"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.finance.5",
      "world": "finance",
      "stage": "us",
      "path": "adult",
      "title": "A fixed return gives a fixed time to double",
      "start": {
        "saved_each_month": 100,
        "annual_return": 12
      },
      "beats": [
        {
          "say": "Years to double falls as the return rises."
        },
        {
          "say": "Lower the return until doubling time passes 15 years.",
          "until": {
            "obs": "years_to_double",
            "op": ">=",
            "value": 15
          },
          "hint": "Move the annual return down."
        },
        {
          "ask": "What happens to doubling time when the return falls?",
          "options": [
            "It gets longer",
            "It stays the same",
            "It gets shorter"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.finance.6",
      "world": "finance",
      "stage": "us",
      "path": "adult",
      "instrument": "shop",
      "title": "A budget forces a choice between items",
      "start": {
        "budget": 20
      },
      "beats": [
        {
          "say": "Here you spend a budget on items and the counters track where it goes."
        },
        {
          "say": "Raise the budget until you can buy three items.",
          "until": {
            "obs": "items_bought",
            "op": ">=",
            "value": 3
          },
          "hint": "Increase the budget."
        },
        {
          "set": {
            "budget": 10
          },
          "hold": 2,
          "say": "I cut the budget back to 10."
        },
        {
          "ask": "After buying items, what does the left counter show?",
          "options": [
            "Budget remaining",
            "Total spent",
            "Number of items"
          ],
          "answer": 0
        }
      ]
    }
  ],
  "language": [
    {
      "id": "fast.language.1",
      "world": "language",
      "stage": "us",
      "path": "adult",
      "title": "Listening first makes the word order clear",
      "start": {
        "voice_speed": 0.7
      },
      "beats": [
        {
          "say": "Play the sentence and hear its shape before you touch any words."
        },
        {
          "set": {
            "voice_speed": 0.6
          },
          "hold": 2,
          "say": "I slowed the voice to hear each word."
        },
        {
          "say": "Now place the first word you heard.",
          "until": {
            "obs": "words_placed",
            "op": ">=",
            "value": 1
          },
          "hint": "Drag one word into its slot."
        },
        {
          "ask": "What should you do first with a new sentence?",
          "options": [
            "Listen to the whole sentence",
            "Place words immediately",
            "Skip the audio"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.language.2",
      "world": "language",
      "stage": "us",
      "path": "adult",
      "title": "Word order carries meaning, not only word choice",
      "start": {
        "voice_speed": 0.8
      },
      "beats": [
        {
          "say": "The same words in a different order can say something different."
        },
        {
          "say": "Place the words until one sentence is solved.",
          "until": {
            "obs": "sentences_solved",
            "op": ">=",
            "value": 1
          },
          "hint": "Drag words into the order you heard."
        },
        {
          "ask": "Why can two sentences with the same words differ?",
          "options": [
            "Their word order differs",
            "One uses louder audio",
            "They use different voices"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.language.3",
      "world": "language",
      "stage": "us",
      "path": "adult",
      "title": "A slower voice exposes the sentence structure",
      "start": {
        "voice_speed": 1.2
      },
      "beats": [
        {
          "say": "At high speed the sentence runs together."
        },
        {
          "set": {
            "voice_speed": 0.6
          },
          "hold": 2,
          "say": "I dropped the speed so the structure is audible."
        },
        {
          "ask": "What does slowing the voice help you notice?",
          "options": [
            "Where words begin and end",
            "The color of the words",
            "The number of buttons"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.language.4",
      "world": "language",
      "stage": "us",
      "path": "adult",
      "title": "A clean run solves a sentence with no mistakes",
      "start": {
        "voice_speed": 0.8
      },
      "beats": [
        {
          "say": "A clean run means every word landed correctly on the first try."
        },
        {
          "say": "Earn one clean run.",
          "until": {
            "obs": "clean_runs",
            "op": ">=",
            "value": 1
          },
          "hint": "Place the words in the right order without a slip."
        },
        {
          "ask": "What does a clean run require?",
          "options": [
            "No mistakes in that sentence",
            "The fastest speed",
            "Skipping the listening"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.language.5",
      "world": "language",
      "stage": "us",
      "path": "adult",
      "title": "A mistake points to the word you misheard",
      "start": {
        "voice_speed": 0.9
      },
      "beats": [
        {
          "say": "When a placement is wrong, the counter marks where it happened."
        },
        {
          "say": "Let one mistake register, then correct it.",
          "until": {
            "obs": "mistakes_here",
            "op": ">=",
            "value": 1
          },
          "hint": "Place a word in the wrong slot to see the marker."
        },
        {
          "ask": "What is the useful response to a mistake marker?",
          "options": [
            "Recheck that word against the audio",
            "Ignore it and guess faster",
            "Restart at a higher speed"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.language.6",
      "world": "language",
      "stage": "us",
      "path": "adult",
      "title": "A second hearing confirms your first guess",
      "start": {
        "voice_speed": 0.7
      },
      "beats": [
        {
          "say": "Replaying the same sentence lets you check your placement."
        },
        {
          "set": {
            "voice_speed": 0.5
          },
          "hold": 2,
          "say": "I replayed it slower to confirm."
        },
        {
          "say": "Place words until two sentences are solved.",
          "until": {
            "obs": "sentences_solved",
            "op": ">=",
            "value": 2
          },
          "hint": "Listen again, then place the words."
        },
        {
          "ask": "Why replay the same sentence?",
          "options": [
            "To confirm the order you chose",
            "To change the words",
            "To end the lesson"
          ],
          "answer": 0
        }
      ]
    }
  ],
  "astro": [
    {
      "id": "fast.astro.1",
      "world": "astro",
      "stage": "us",
      "path": "adult",
      "title": "Inner planets finish orbits while outer worlds barely move",
      "start": {
        "time": 30
      },
      "beats": [
        {
          "set": {
            "time": 30
          },
          "hold": 2,
          "say": "Watch the inner worlds. They circle the sun many times in the span that a distant planet crawls through a fraction of its path."
        },
        {
          "say": "Let enough earth years pass and the contrast becomes unmistakable.",
          "until": {
            "obs": "earth_years",
            "op": ">=",
            "value": 10
          },
          "hint": "advance the time control"
        },
        {
          "ask": "Which planet completes the most orbits in the same stretch of time?",
          "options": [
            "Neptune",
            "Earth",
            "Mercury"
          ],
          "answer": 2
        }
      ]
    },
    {
      "id": "fast.astro.2",
      "world": "astro",
      "stage": "us",
      "path": "adult",
      "title": "Planetary paths are ellipses, not perfect circles",
      "start": {
        "time": 10
      },
      "beats": [
        {
          "set": {
            "time": 12
          },
          "hold": 2,
          "say": "The traced paths are ovals. A circle would keep the sun at an equal distance all the way around; these paths do not."
        },
        {
          "say": "Follow one planet for a full lap and notice how its distance from the sun changes."
        },
        {
          "ask": "What shape do the planets actually trace around the sun?",
          "options": [
            "Perfect circles",
            "Ellipses",
            "Straight lines"
          ],
          "answer": 1
        }
      ]
    },
    {
      "id": "fast.astro.3",
      "world": "astro",
      "stage": "us",
      "path": "adult",
      "title": "Farther planets take more than proportionally longer to orbit",
      "start": {
        "time": 30
      },
      "beats": [
        {
          "set": {
            "time": 30
          },
          "hold": 2,
          "say": "Orbital period grows faster than orbital distance. Moving a world farther out lengthens its year by more than the same factor."
        },
        {
          "ask": "If a planet were moved twice as far from the sun, what would happen to its year?",
          "options": [
            "It would stay the same length",
            "It would roughly double",
            "It would become more than twice as long"
          ],
          "answer": 2
        }
      ]
    },
    {
      "id": "fast.astro.4",
      "world": "astro",
      "stage": "us",
      "path": "adult",
      "title": "Neptune takes about 165 earth years for a single orbit",
      "start": {
        "time": 0
      },
      "beats": [
        {
          "set": {
            "time": 30
          },
          "hold": 2,
          "say": "Neptune needs roughly 165 earth years for one circuit. The inner planets complete many circuits before it returns to its starting point."
        },
        {
          "say": "Advance until ten earth years have accumulated and notice how little Neptune has shifted.",
          "until": {
            "obs": "earth_years",
            "op": ">=",
            "value": 10
          },
          "hint": "advance the time control"
        },
        {
          "ask": "Why does Neptune barely move during a single human lifetime?",
          "options": [
            "Its orbit is enormous and slow",
            "It has stopped orbiting",
            "It is closer to the sun than Earth"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.astro.5",
      "world": "astro",
      "stage": "us",
      "path": "adult",
      "title": "Compressed scale is a presentation choice, not reality",
      "start": {
        "time": 0
      },
      "beats": [
        {
          "say": "On screen, planets and distances are resized so everything fits at once. The real gaps between orbits are far larger than this view suggests."
        },
        {
          "ask": "Why can all the planets be seen at once in this model?",
          "options": [
            "Space is actually that crowded",
            "The display compresses distances and sizes",
            "The planets have stopped moving"
          ],
          "answer": 1
        }
      ]
    },
    {
      "id": "fast.astro.6",
      "world": "astro",
      "stage": "us",
      "path": "adult",
      "title": "A handful of numbers fully describe an orbit",
      "start": {
        "time": 5
      },
      "beats": [
        {
          "set": {
            "time": 8
          },
          "hold": 2,
          "say": "An orbit is more than a path. A small set of values fixes its size, its shape, its tilt, and where the planet sits along it."
        },
        {
          "ask": "Which orbital element describes how stretched an ellipse is?",
          "options": [
            "Eccentricity",
            "Mass",
            "Color"
          ],
          "answer": 0
        }
      ]
    }
  ],
  "bio": [
    {
      "id": "fast.bio.1",
      "world": "bio",
      "stage": "us",
      "path": "adult",
      "title": "Selection shifts the population average toward the optimum",
      "start": {
        "environment_optimum": 0.8,
        "selection_strength": 0.95,
        "mutation_rate": 0.002
      },
      "beats": [
        {
          "set": {
            "selection_strength": 0.95
          },
          "hold": 2,
          "say": "With strong selection, individuals near the optimum leave more offspring. The population mean drifts toward that favored value."
        },
        {
          "say": "Let generations accumulate and watch the average settle near the favored trait.",
          "until": {
            "obs": "generation",
            "op": ">=",
            "value": 20
          },
          "hint": "let the generations run"
        },
        {
          "ask": "What does strong selection do to the population average?",
          "options": [
            "It moves toward the optimum",
            "It always moves toward zero",
            "It stops changing entirely"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.bio.2",
      "world": "bio",
      "stage": "us",
      "path": "adult",
      "title": "Mutation replenishes the variation selection removes",
      "start": {
        "environment_optimum": 0.5,
        "selection_strength": 0.5,
        "mutation_rate": 0
      },
      "beats": [
        {
          "say": "Without mutation, selection eventually strips away differences. The spread narrows until little variation remains."
        },
        {
          "set": {
            "mutation_rate": 0.08
          },
          "hold": 2,
          "say": "Introduce mutation and new trait values reappear each generation. Variation is restored even while selection keeps pulling."
        },
        {
          "ask": "What supplies the new trait values that selection can act on?",
          "options": [
            "Mutation",
            "Selection alone",
            "A moving optimum"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.bio.3",
      "world": "bio",
      "stage": "us",
      "path": "adult",
      "title": "Fitness peaks at the optimum and falls away on both sides",
      "start": {
        "environment_optimum": 0.5,
        "selection_strength": 0.7,
        "mutation_rate": 0.02
      },
      "beats": [
        {
          "set": {
            "environment_optimum": 0.5
          },
          "hold": 2,
          "say": "Trait values near the optimum do best. Fitness drops for values both below and above it, forming a single peak."
        },
        {
          "ask": "Where is fitness highest on this landscape?",
          "options": [
            "At the lowest trait value",
            "At the environment optimum",
            "At the highest trait value"
          ],
          "answer": 1
        }
      ]
    },
    {
      "id": "fast.bio.4",
      "world": "bio",
      "stage": "us",
      "path": "adult",
      "title": "Moving the optimum redirects selection",
      "start": {
        "environment_optimum": 0.2,
        "selection_strength": 0.9,
        "mutation_rate": 0.002
      },
      "beats": [
        {
          "set": {
            "environment_optimum": 0.9
          },
          "hold": 2,
          "say": "Shift the environment optimum and the target moves. The population mean begins chasing the new favored value."
        },
        {
          "say": "Let more generations pass while the population tracks its new target.",
          "until": {
            "obs": "generation",
            "op": ">=",
            "value": 20
          },
          "hint": "move the environment optimum and let generations run"
        },
        {
          "ask": "After the optimum moves, which way does the population mean shift?",
          "options": [
            "Toward the new optimum",
            "Away from the new optimum",
            "It stays exactly where it was"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.bio.5",
      "world": "bio",
      "stage": "us",
      "path": "adult",
      "title": "Spread grows with mutation and shrinks with selection",
      "start": {
        "environment_optimum": 0.5,
        "selection_strength": 0.9,
        "mutation_rate": 0.002
      },
      "beats": [
        {
          "set": {
            "mutation_rate": 0.1
          },
          "hold": 2,
          "say": "Raise mutation and the trait distribution widens. More new values appear each generation than selection can remove."
        },
        {
          "ask": "Which change widens the spread of traits in the population?",
          "options": [
            "Increasing the mutation rate",
            "Increasing selection strength",
            "Holding the optimum fixed"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.bio.6",
      "world": "bio",
      "stage": "us",
      "path": "adult",
      "title": "A simple rule stands in for a messier mechanism",
      "start": {
        "environment_optimum": 0.5,
        "selection_strength": 0.6,
        "mutation_rate": 0.02
      },
      "beats": [
        {
          "say": "This model tracks only a mean and a spread. Real populations involve countless individuals, yet these two numbers capture the broad response."
        },
        {
          "ask": "What does this simplified model keep track of?",
          "options": [
            "Every individual organism",
            "The population mean and spread",
            "The exact sequence of each member"
          ],
          "answer": 1
        }
      ]
    }
  ],
  "stats": [
    {
      "id": "fast.stats.1",
      "world": "stats",
      "stage": "us",
      "path": "adult",
      "title": "Small samples produce wildly different results",
      "start": {
        "sample_size_n": 3,
        "samples_per_frame": 5
      },
      "beats": [
        {
          "set": {
            "sample_size_n": 3
          },
          "hold": 2,
          "say": "With only a few observations per sample, the mean jumps from one sample to the next. Each new bar lands in a different place."
        },
        {
          "say": "Keep drawing until many samples have accumulated and watch how scattered the results remain.",
          "until": {
            "obs": "samples_drawn",
            "op": ">=",
            "value": 100
          },
          "hint": "raise samples per frame and let samples draw"
        },
        {
          "ask": "Why do the sample means vary so much here?",
          "options": [
            "Each sample is very small",
            "The samples are all identical",
            "The drawing has stopped"
          ],
          "answer": 0
        }
      ]
    },
    {
      "id": "fast.stats.2",
      "world": "stats",
      "stage": "us",
      "path": "adult",
      "title": "Each batch of draws builds one bar of the histogram",
      "start": {
        "sample_size_n": 10,
        "samples_per_frame": 10
      },
      "beats": [
        {
          "set": {
            "samples_per_frame": 10
          },
          "hold": 2,
          "say": "Every sample contributes a single mean. As samples accumulate, those means stack into bars."
        },
        {
          "say": "Draw until a hundred samples have been recorded.",
          "until": {
            "obs": "samples_drawn",
            "op": ">=",
            "value": 100
          },
          "hint": "raise samples per frame to fill bars faster"
        },
        {
          "ask": "What does one bar of the histogram represent?",
          "options": [
            "One individual observation",
            "The means of many samples in a range",
            "The total number of samples"
          ],
          "answer": 1
        }
      ]
    },
    {
      "id": "fast.stats.3",
      "world": "stats",
      "stage": "us",
      "path": "adult",
      "title": "The spread of sample means shrinks as the square root of n",
      "start": {
        "sample_size_n": 4,
        "samples_per_frame": 20
      },
      "beats": [
        {
          "set": {
            "sample_size_n": 4
          },
          "hold": 2,
          "say": "The standard error is the population spread divided by the square root of the sample size. Quadrupling the sample size halves this spread."
        },
        {
          "ask": "If the sample size is multiplied by four, what happens to the spread of the sample means?",
          "options": [
            "It doubles",
            "It is cut in half",
            "It stays the same"
          ],
          "answer": 1
        }
      ]
    },
    {
      "id": "fast.stats.4",
      "world": "stats",
      "stage": "us",
      "path": "adult",
      "title": "The white curve is a prediction, not a fitted line",
      "start": {
        "sample_size_n": 10,
        "samples_per_frame": 20
      },
      "beats": [
        {
          "set": {
            "samples_per_frame": 20
          },
          "hold": 2,
          "say": "The smooth white curve comes from the theoretical rule, not from adjusting it to match the bars. It is drawn before the data arrives."
        },
        {
          "ask": "Where does the white curve come from?",
          "options": [
            "It is fitted to the tallest bar",
            "It is a theoretical prediction",
            "It is copied from the last sample"
          ],
          "answer": 1
        }
      ]
    },
    {
      "id": "fast.stats.5",
      "world": "stats",
      "stage": "us",
      "path": "adult",
      "title": "Larger samples tighten the cluster of means",
      "start": {
        "sample_size_n": 2,
        "samples_per_frame": 20
      },
      "beats": [
        {
          "set": {
            "sample_size_n": 100
          },
          "hold": 2,
          "say": "Raise the sample size and the means bunch together. Each individual sample becomes a more reliable estimate."
        },
        {
          "say": "Keep sampling until a hundred draws have been recorded at the larger size.",
          "until": {
            "obs": "samples_drawn",
            "op": ">=",
            "value": 100
          },
          "hint": "set sample size high and let samples draw"
        }
      ]
    },
    {
      "id": "fast.stats.6",
      "world": "stats",
      "stage": "us",
      "path": "adult",
      "title": "Predict the spread before drawing the samples",
      "start": {
        "sample_size_n": 25,
        "samples_per_frame": 10
      },
      "beats": [
        {
          "set": {
            "sample_size_n": 25
          },
          "hold": 2,
          "say": "Before drawing, work out the expected spread from the sample size. That predicted value can then be checked against what appears."
        },
        {
          "ask": "For a larger sample size, what should happen to the predicted spread?",
          "options": [
            "It grows",
            "It shrinks",
            "It is unchanged"
          ],
          "answer": 1
        }
      ]
    }
  ],
  "climate": [
    {
      "id": "fast.climate.1",
      "world": "climate",
      "stage": "us",
      "path": "adult",
      "title": "Balance is where in meets out",
      "start": {
        "solar_output": 1,
        "albedo_reflectivity": 0.3,
        "emissivity_lower_traps_more": 0.61
      },
      "beats": [
        {
          "say": "Sunlight arrives as absorbed energy and leaves as radiated heat. When the two bars differ, the surface temperature moves until they match, and that match is equilibrium."
        },
        {
          "set": {
            "solar_output": 1,
            "albedo_reflectivity": 0.3,
            "emissivity_lower_traps_more": 0.61
          },
          "hold": 3,
          "say": "At full sun and 0.30 reflectivity both bars sit near 238 W/m² and the surface rests near 15 °C."
        },
        {
          "say": "Raise Solar output until the surface passes 20 °C.",
          "until": {
            "obs": "surface",
            "op": ">=",
            "value": 20
          },
          "hint": "Push Solar output toward 108%."
        },
        {
          "ask": "Once the surface settles, the absorbed and radiated bars are…",
          "options": [
            "equal",
            "far apart with absorbed larger",
            "far apart with radiated larger"
          ],
          "answer": 0
        },
        {
          "say": "Equal. The surface warms until outgoing radiation catches up with the incoming sunlight; nothing in this layer adds feedbacks or stores heat."
        }
      ]
    },
    {
      "id": "fast.climate.2",
      "world": "climate",
      "stage": "us",
      "path": "adult",
      "title": "Reflection removes energy before it can warm",
      "start": {
        "solar_output": 1,
        "albedo_reflectivity": 0.1,
        "emissivity_lower_traps_more": 0.61
      },
      "beats": [
        {
          "say": "Albedo is the share of sunlight reflected away before it enters the surface. Reflected energy never reaches the balance, so it cannot warm anything."
        },
        {
          "set": {
            "albedo_reflectivity": 0.1
          },
          "hold": 3,
          "say": "At 0.10 the surface absorbs about 306 W/m² and settles near 34 °C."
        },
        {
          "say": "Raise reflectivity until the absorbed bar falls to 170 W/m² or less.",
          "until": {
            "obs": "absorbed",
            "op": "<=",
            "value": 170
          },
          "hint": "Drag Albedo (reflectivity) up to about 0.50."
        },
        {
          "ask": "Raising albedo made the surface…",
          "options": [
            "warmer",
            "cooler",
            "unchanged"
          ],
          "answer": 1
        },
        {
          "say": "Cooler. Less absorbed energy means a lower temperature radiates the same amount away, and this layer has no ice or cloud feedback to amplify it."
        }
      ]
    },
    {
      "id": "fast.climate.3",
      "world": "climate",
      "stage": "us",
      "path": "adult",
      "title": "Lower emissivity holds heat in",
      "start": {
        "solar_output": 1,
        "albedo_reflectivity": 0.3,
        "emissivity_lower_traps_more": 0.61
      },
      "beats": [
        {
          "say": "Emissivity measures how readily the surface sheds heat as radiation. Lower emissivity means less escapes at a given temperature, so the surface must warm further to balance."
        },
        {
          "set": {
            "emissivity_lower_traps_more": 0.9
          },
          "hold": 3,
          "say": "At 0.90 it sheds heat easily and settles below freezing."
        },
        {
          "say": "Now lower emissivity until the surface passes 25 °C.",
          "until": {
            "obs": "surface",
            "op": ">=",
            "value": 25
          },
          "hint": "Drag Emissivity (lower traps more) down toward 0.50."
        },
        {
          "ask": "Lower emissivity made the surface…",
          "options": [
            "warmer",
            "cooler",
            "unchanged"
          ],
          "answer": 0
        },
        {
          "say": "Warmer. The same absorbed sunlight needs a higher temperature to escape, and this single coefficient stands in for the whole atmosphere."
        }
      ]
    },
    {
      "id": "fast.climate.4",
      "world": "climate",
      "stage": "us",
      "path": "adult",
      "title": "A fourth root shrinks the response",
      "start": {
        "solar_output": 1,
        "albedo_reflectivity": 0.3,
        "emissivity_lower_traps_more": 0.61
      },
      "beats": [
        {
          "say": "Radiated power grows with the fourth power of absolute temperature. Temperature therefore grows as the fourth root of the energy supplied, so a large flux change becomes a small temperature change."
        },
        {
          "set": {
            "albedo_reflectivity": 0.05
          },
          "hold": 4,
          "say": "Albedo 0.05 lifts absorbed energy from 238 to about 323 W/m², a rise of roughly 36%."
        },
        {
          "ask": "Absorbed energy rose about 36%. The equilibrium temperature in kelvin rose about…",
          "options": [
            "8%",
            "36%",
            "144%"
          ],
          "answer": 0
        },
        {
          "say": "About 8%. The fourth root of 1.36 is close to 1.08, and the readout agrees."
        },
        {
          "say": "Cool the equilibrium back below 0 °C.",
          "until": {
            "obs": "equilibrium",
            "op": "<",
            "value": 0
          },
          "hint": "Raise Albedo past 0.45, or raise Emissivity past 0.75."
        }
      ]
    },
    {
      "id": "fast.climate.5",
      "world": "climate",
      "stage": "us",
      "path": "adult",
      "title": "This layer leaves things out",
      "start": {
        "solar_output": 1,
        "albedo_reflectivity": 0.3,
        "emissivity_lower_traps_more": 0.61
      },
      "beats": [
        {
          "say": "The instrument solves one equation for one layer. It has no ocean, no clouds, no ice, no seasons and no circulation, so it is a mechanism, not a forecast."
        },
        {
          "set": {
            "emissivity_lower_traps_more": 0.45
          },
          "hold": 3,
          "say": "At emissivity 0.45 the toy surface reaches about 38 °C for these inputs."
        },
        {
          "say": "Hold the surface above 30 °C.",
          "until": {
            "obs": "surface",
            "op": ">=",
            "value": 30
          },
          "hint": "Lower Emissivity (lower traps more) toward 0.45."
        },
        {
          "ask": "A full climate model answers differently for the same sunlight because it includes…",
          "options": [
            "a different Stefan-Boltzmann constant",
            "feedbacks and heat transport this layer omits",
            "no reflection at all"
          ],
          "answer": 1
        },
        {
          "say": "Feedbacks and transport. The gap between this number and a full model is the honest uncertainty, and it is why the app shows the mechanism and names what is missing."
        }
      ]
    },
    {
      "id": "fast.climate.6",
      "world": "climate",
      "stage": "us",
      "path": "adult",
      "title": "Read the surface against its target",
      "start": {
        "solar_output": 1,
        "albedo_reflectivity": 0.3,
        "emissivity_lower_traps_more": 0.61
      },
      "beats": [
        {
          "say": "Surface is the live temperature, Equilibrium is where it is heading, and the other two rows are the energy bars. Read all four together to see what is moving."
        },
        {
          "set": {
            "solar_output": 0.9
          },
          "hold": 3,
          "say": "At 90% sun the absorbed bar drops to about 214 W/m² and the surface heads for roughly 7 °C."
        },
        {
          "say": "Confirm the surface has fallen below 10 °C.",
          "until": {
            "obs": "surface",
            "op": "<",
            "value": 10
          },
          "hint": "Lower Solar output toward 90%."
        },
        {
          "ask": "Right after Solar output drops, radiated is briefly larger than absorbed, so the surface…",
          "options": [
            "cools",
            "warms",
            "holds steady"
          ],
          "answer": 0
        },
        {
          "say": "Cools until the bars meet again. The surface value is the readout of that adjustment, and this model relaxes toward equilibrium over a few seconds."
        }
      ]
    }
  ],
  "eng": [
    {
      "id": "fast.eng.1",
      "world": "eng",
      "stage": "us",
      "path": "adult",
      "title": "Triangles turn load into equations",
      "start": {
        "bottom_chord": 200,
        "top_chord": 150,
        "diagonals": 120
      },
      "beats": [
        {
          "say": "Every bar is pinned at its ends, so each carries force along its length. Triangles keep their shape without bending, which lets the solver write one equilibrium equation per degree of freedom."
        },
        {
          "set": {
            "bottom_chord": 400
          },
          "hold": 3,
          "say": "A heavier bottom chord changes the stresses but not the shape of the truss."
        },
        {
          "say": "Bring the factor of safety to 2.0.",
          "until": {
            "obs": "factor_of_safety",
            "op": ">=",
            "value": 2
          },
          "hint": "Raise Top chord to about 230 mm²."
        },
        {
          "ask": "A triangle keeps its shape because changing that shape requires…",
          "options": [
            "a member to change length",
            "the joints to rotate freely",
            "more load on the span"
          ],
          "answer": 0
        },
        {
          "say": "A member to change length. That is why this frame has a unique set of forces rather than a wobble, and why the numbers come from a solve rather than a drawing."
        }
      ]
    },
    {
      "id": "fast.eng.2",
      "world": "eng",
      "stage": "us",
      "path": "adult",
      "title": "Safety is a ratio, not a promise",
      "start": {
        "bottom_chord": 200,
        "top_chord": 150,
        "diagonals": 120
      },
      "beats": [
        {
          "say": "Factor of safety divides the sample yield strength of 250 MPa by the worst stress in any member. It is a ratio from this truss and these sample figures, not a guarantee about a real structure."
        },
        {
          "set": {
            "top_chord": 300
          },
          "hold": 3,
          "say": "Top chord at 300 mm² cuts that member stress; the worst stress now sits in the bottom chord."
        },
        {
          "say": "Reach a factor of safety of 2.5.",
          "until": {
            "obs": "factor_of_safety",
            "op": ">=",
            "value": 2.5
          },
          "hint": "Grow Bottom chord to 220 and Diagonals to 130 mm²."
        },
        {
          "ask": "If the peak stress doubles while yield strength stays fixed, the factor of safety…",
          "options": [
            "doubles",
            "halves",
            "stays the same"
          ],
          "answer": 1
        },
        {
          "say": "Halves. It moves inversely with the worst stress, so the next member to strengthen is whichever one the solver flags."
        }
      ]
    },
    {
      "id": "fast.eng.3",
      "world": "eng",
      "stage": "us",
      "path": "adult",
      "title": "The worst member can change",
      "start": {
        "bottom_chord": 200,
        "top_chord": 150,
        "diagonals": 120
      },
      "beats": [
        {
          "say": "Peak stress is the largest stress in any one group. Enlarging that group does not remove the stress; it can hand the title to a different set of members."
        },
        {
          "set": {
            "top_chord": 300,
            "bottom_chord": 200,
            "diagonals": 120
          },
          "hold": 3,
          "say": "The top chord is no longer the weakest group; the bottom chord now reads highest."
        },
        {
          "say": "Bring peak stress below 100 MPa.",
          "until": {
            "obs": "peak_stress",
            "op": "<=",
            "value": 100
          },
          "hint": "Raise Bottom chord to 220 and Diagonals to 130 mm²."
        },
        {
          "ask": "Strengthening only the member with the peak stress often makes the peak…",
          "options": [
            "move to another member",
            "stay in that member forever",
            "drop to zero"
          ],
          "answer": 0
        },
        {
          "say": "Move to another member. Stress is a distribution across the whole truss, so an efficient design strengthens the groups in turn rather than one at a time at random."
        }
      ]
    },
    {
      "id": "fast.eng.4",
      "world": "eng",
      "stage": "us",
      "path": "adult",
      "title": "Cost is length times area",
      "start": {
        "bottom_chord": 200,
        "top_chord": 150,
        "diagonals": 120
      },
      "beats": [
        {
          "say": "Cost sums volume times a sample density and a sample price of $2 per kilogram across the members. The geometry fixes each length, so the three areas decide the bill."
        },
        {
          "say": "Push material cost above $100.",
          "until": {
            "obs": "material_cost",
            "op": ">=",
            "value": 100
          },
          "hint": "Raise Diagonals toward 290 mm²; they carry the most total length."
        },
        {
          "set": {
            "bottom_chord": 400,
            "top_chord": 300,
            "diagonals": 240
          },
          "hold": 3,
          "say": "Thicker everywhere: the cost roughly doubles to about $130."
        },
        {
          "ask": "With member lengths fixed, cost is driven by…",
          "options": [
            "the cross-sectional areas",
            "the colours of the bars",
            "the number of nodes"
          ],
          "answer": 0
        },
        {
          "say": "The areas. Volume is length times area, and the prices are sample 2024 figures, so this is an illustration of the arithmetic rather than a quote."
        }
      ]
    },
    {
      "id": "fast.eng.5",
      "world": "eng",
      "stage": "us",
      "path": "adult",
      "title": "Eighteen equations, one answer per bar",
      "start": {
        "bottom_chord": 200,
        "top_chord": 150,
        "diagonals": 120
      },
      "beats": [
        {
          "say": "Nine joints give eighteen equilibrium equations. Fifteen member forces plus three support reactions are eighteen unknowns, solved afresh whenever a slider moves."
        },
        {
          "set": {
            "bottom_chord": 220,
            "top_chord": 290,
            "diagonals": 130
          },
          "hold": 3,
          "say": "A stronger setting. These numbers came from the linear system, not from a sketch."
        },
        {
          "say": "Hold a factor of safety of 2.5.",
          "until": {
            "obs": "factor_of_safety",
            "op": ">=",
            "value": 2.5
          },
          "hint": "Bottom 220, Top 290, Diagonals 130 mm²."
        },
        {
          "ask": "The equation count matches the unknown count so that…",
          "options": [
            "the drawing looks balanced",
            "each member force and reaction has one answer",
            "the steel gets cheaper"
          ],
          "answer": 1
        },
        {
          "say": "Each force has one answer. With fewer equations the forces would be undetermined; the supports and the matched count close the system, and the solver checks stress only."
        }
      ]
    },
    {
      "id": "fast.eng.6",
      "world": "eng",
      "stage": "us",
      "path": "adult",
      "title": "Strength and cost pull apart",
      "start": {
        "bottom_chord": 200,
        "top_chord": 200,
        "diagonals": 120
      },
      "beats": [
        {
          "say": "Thicker members buy safety and spend money. The goal asks for both at once: a factor of safety of 2.5 for no more than $95."
        },
        {
          "set": {
            "bottom_chord": 200,
            "top_chord": 200,
            "diagonals": 120
          },
          "hold": 3,
          "say": "A middle setting: the top chord is still the weakest group and the bill is about $70."
        },
        {
          "say": "Meet the goal: safety 2.5 and cost at most $95.",
          "until": {
            "goal": true
          },
          "hint": "Grow Bottom chord to 220 and Top chord to 290; keep Diagonals near 130 mm²."
        },
        {
          "ask": "Because strength costs money, the design task is to…",
          "options": [
            "maximise both without limit",
            "find the least material that meets the safety target",
            "ignore the factor of safety"
          ],
          "answer": 1
        },
        {
          "say": "Find the least material that meets the target. The solver supplies the forces; the engineer decides where strength is worth paying for, and these prices are sample data rather than a quote."
        }
      ]
    }
  ]
};

/* ==========================================================================
   diagnostics.js-in-data — five authored placement items per world.
   One each for play, compute, derive, apply and a common misconception.
   ========================================================================== */

export const DIAGNOSTICS = {
  physics: [
    { lens: 'play', stage: 'p', q: 'Push the two slits closer together. The bright stripes get…', options: ['wider', 'narrower', 'unchanged'], answer: 0 },
    { lens: 'compute', stage: 'ls', q: 'In w = λL/d, doubling the wavelength makes the fringe width…', options: ['double', 'halve', 'stay the same'], answer: 0 },
    { lens: 'derive', stage: 'us', q: 'Two waves arrive half a wavelength out of step. At that point they…', options: ['cancel', 'add', 'do nothing'], answer: 0 },
    { lens: 'apply', stage: 'uni', q: 'A 6 N push on a 2 kg ball gives what distance in two seconds?', options: ['3 m', '6 m', '12 m'], answer: 1 },
    { lens: 'misconception', stage: 'us', q: 'A heavier ball floats more easily because it is heavier.', options: ['true', 'false'], answer: 1 }
  ],
  maths: [
    { lens: 'play', stage: 'p', q: 'In y = a·sin(bx+c)+d, the number a controls…', options: ['the size of the swings', 'the speed', 'the sideways shift'], answer: 0 },
    { lens: 'compute', stage: 'ls', q: 'The period of sin(bx) is…', options: ['2π/b', 'b/2π', '2πb'], answer: 0 },
    { lens: 'derive', stage: 'us', q: 'The steepest slope of a·sin(bx) is…', options: ['a', 'a·b', 'b'], answer: 1 },
    { lens: 'apply', stage: 'uni', q: 'Share 18 dots into 3 even groups. How many in each?', options: ['6', '3', '9'], answer: 0 },
    { lens: 'misconception', stage: 'ls', q: 'Changing the frequency b slides the curve sideways.', options: ['true', 'false'], answer: 1 }
  ],
  chem: [
    { lens: 'play', stage: 'p', q: 'Elements in the same column of the table…', options: ['behave alike', 'have the same mass', 'have the same number of protons'], answer: 0 },
    { lens: 'compute', stage: 'ls', q: 'Which element pulls electrons hardest of all?', options: ['fluorine', 'oxygen', 'chlorine'], answer: 0 },
    { lens: 'derive', stage: 'us', q: 'Across a period from left to right, electronegativity generally…', options: ['increases', 'decreases', 'stays the same'], answer: 0 },
    { lens: 'apply', stage: 'uni', q: 'An element with a full outer shell is usually…', options: ['very reactive', 'unreactive', 'very heavy'], answer: 1 },
    { lens: 'misconception', stage: 'us', q: 'Noble gases are unreactive because they are heavy.', options: ['true', 'false'], answer: 1 }
  ],
  art: [
    { lens: 'play', stage: 'p', q: 'Before colour or detail, the first thing to separate in a drawing is…', options: ['values', 'brands', 'outlines'], answer: 0 },
    { lens: 'compute', stage: 'ls', q: 'A five-value study uses…', options: ['five distinct values', 'five colours', 'five brushes'], answer: 0 },
    { lens: 'derive', stage: 'us', q: 'An edge that reads as a change of plane is made by…', options: ['two values meeting', 'a dark outline everywhere', 'more detail'], answer: 0 },
    { lens: 'apply', stage: 'uni', q: 'The histogram on the studio panel shows…', options: ['the spread of values', 'the brush count', 'the canvas size'], answer: 0 },
    { lens: 'misconception', stage: 'ls', q: 'Adding more detail always makes a drawing better.', options: ['true', 'false'], answer: 1 }
  ],
  music: [
    { lens: 'play', stage: 'p', q: 'Four beats in a bar is called…', options: ['common time', 'a scale', 'a chord'], answer: 0 },
    { lens: 'compute', stage: 'ls', q: 'At 120 bpm, one beat lasts…', options: ['half a second', 'one second', 'two seconds'], answer: 0 },
    { lens: 'derive', stage: 'us', q: 'Doubling the tempo makes the same phrase take…', options: ['half as long', 'twice as long', 'the same time'], answer: 0 },
    { lens: 'apply', stage: 'uni', q: 'Changing the tempo keeps the phrase’s…', options: ['note order', 'note durations', 'style'], answer: 0 },
    { lens: 'misconception', stage: 'us', q: 'A faster tempo changes which notes are in the phrase.', options: ['true', 'false'], answer: 1 }
  ],
  earth: [
    { lens: 'play', stage: 'p', q: 'The timeline slider changes…', options: ['which events you see', 'the country’s size', 'the country’s name'], answer: 0 },
    { lens: 'compute', stage: 'ls', q: 'Natural Earth 110m is…', options: ['a boundary dataset', 'a date', 'one country'], answer: 0 },
    { lens: 'derive', stage: 'us', q: 'Showing modern borders means the map is…', options: ['a snapshot with a date', 'timeless', 'a future map'], answer: 0 },
    { lens: 'apply', stage: 'uni', q: 'Scrubbing historical borders would need…', options: ['dated boundary sources', 'a new projection', 'a larger canvas'], answer: 0 },
    { lens: 'misconception', stage: 'us', q: 'A map with no printed date has no implied date.', options: ['true', 'false'], answer: 1 }
  ],
  cs: [
    { lens: 'play', stage: 'p', q: 'The dashed curve behind the dots shows…', options: ['n log n growth', 'the timer', 'the array size'], answer: 0 },
    { lens: 'compute', stage: 'ls', q: 'Steps per frame changes…', options: ['how fast you watch', 'how much work is done', 'the algorithm'], answer: 0 },
    { lens: 'derive', stage: 'us', q: 'Doubling n for an n² algorithm multiplies the work by…', options: ['two', 'four', 'ten'], answer: 1 },
    { lens: 'apply', stage: 'uni', q: 'Comparing two curves at one size tells you…', options: ['little about their growth', 'everything about them', 'nothing at all'], answer: 0 },
    { lens: 'misconception', stage: 'ls', q: 'More steps per frame means the algorithm makes fewer comparisons.', options: ['true', 'false'], answer: 1 }
  ],
  finance: [
    { lens: 'play', stage: 'p', q: 'The budget in the shop is…', options: ['an amount you set', 'a product', 'an investment tip'], answer: 0 },
    { lens: 'compute', stage: 'ls', q: 'What is 10% of $200?', options: ['$20', '$2', '$200'], answer: 0 },
    { lens: 'derive', stage: 'us', q: 'A 0.5% annual fee over forty years…', options: ['compounds against you', 'is too small to matter', 'doubles your money'], answer: 0 },
    { lens: 'apply', stage: 'uni', q: 'Present value discounts future money because…', options: ['a future sum is worth less today', 'it is larger', 'inflation is zero'], answer: 0 },
    { lens: 'misconception', stage: 'us', q: 'This app recommends financial products.', options: ['true', 'false'], answer: 1 }
  ],
  language: [
    { lens: 'play', stage: 'p', q: 'Voice speed changes…', options: ['how fast words are spoken', 'their order', 'their meaning'], answer: 0 },
    { lens: 'compute', stage: 'ls', q: 'Slowing from 1.0 to 0.5 makes each word…', options: ['twice as long', 'half as long', 'different'], answer: 0 },
    { lens: 'derive', stage: 'us', q: 'The same words in a different order usually have…', options: ['a different meaning', 'the same meaning', 'no meaning'], answer: 0 },
    { lens: 'apply', stage: 'uni', q: 'Timing and word sequence are…', options: ['independent', 'the same thing', 'identical'], answer: 0 },
    { lens: 'misconception', stage: 'ls', q: 'Speaking more slowly changes the words themselves.', options: ['true', 'false'], answer: 1 }
  ],
  astro: [
    { lens: 'play', stage: 'p', q: 'Compared with outer planets, inner planets orbit…', options: ['faster', 'slower', 'at the same speed'], answer: 0 },
    { lens: 'compute', stage: 'ls', q: 'Kepler’s third law relates orbital period to…', options: ['distance from the sun', 'colour', 'surface area'], answer: 0 },
    { lens: 'derive', stage: 'us', q: 'Real planetary orbits are…', options: ['ellipses', 'perfect circles', 'squares'], answer: 0 },
    { lens: 'apply', stage: 'uni', q: 'Compressing distance by √a makes…', options: ['inner planets visible', 'outer planets smaller', 'the orbits real'], answer: 0 },
    { lens: 'misconception', stage: 'us', q: 'The compressed view shows true distances.', options: ['true', 'false'], answer: 1 }
  ],
  bio: [
    { lens: 'play', stage: 'p', q: 'Selection pushes the population’s average trait toward…', options: ['the environmental optimum', 'zero', 'a random value'], answer: 0 },
    { lens: 'compute', stage: 'ls', q: 'A Gaussian fitness landscape has…', options: ['one peak', 'many peaks', 'no peak'], answer: 0 },
    { lens: 'derive', stage: 'us', q: 'Mutation rate mainly supplies…', options: ['variation', 'selection', 'population size'], answer: 0 },
    { lens: 'apply', stage: 'uni', q: 'An idealised landscape still shows…', options: ['the mechanism', 'proof from the wild', 'exact field data'], answer: 0 },
    { lens: 'misconception', stage: 'us', q: 'Selection changes every individual equally.', options: ['true', 'false'], answer: 1 }
  ],
  stats: [
    { lens: 'play', stage: 'p', q: 'With very small samples, the bars of sample means…', options: ['jump around more', 'are identical', 'have no mean'], answer: 0 },
    { lens: 'compute', stage: 'ls', q: 'The spread of sample means is…', options: ['σ/√n', 'σ/n', 'σ·n'], answer: 0 },
    { lens: 'derive', stage: 'us', q: 'The white curve on the chart is…', options: ['a prediction, not a fit', 'a best fit to the bars', 'the raw data'], answer: 0 },
    { lens: 'apply', stage: 'uni', q: 'Increasing n makes that predicted curve…', options: ['tighter', 'wider', 'identical'], answer: 0 },
    { lens: 'misconception', stage: 'us', q: 'The white curve was fitted to the bars that were drawn.', options: ['true', 'false'], answer: 1 }
  ],
  climate: [
    { lens: 'play', stage: 'p', q: 'If more energy arrives than leaves, surface temperature…', options: ['rises', 'falls', 'stays the same'], answer: 0 },
    { lens: 'compute', stage: 'ls', q: 'In T⁴ ∝ S(1−α)/εσ, raising the albedo α…', options: ['cools the surface', 'warms it', 'does nothing'], answer: 0 },
    { lens: 'derive', stage: 'us', q: 'The one-layer model leaves out…', options: ['clouds and oceans', 'the Stefan–Boltzmann constant', 'sunlight'], answer: 0 },
    { lens: 'apply', stage: 'uni', q: 'Real models run warmer because of…', options: ['feedbacks', 'a different constant', 'more sunlight'], answer: 0 },
    { lens: 'misconception', stage: 'us', q: 'The Stefan–Boltzmann constant changes between models.', options: ['true', 'false'], answer: 1 }
  ],
  eng: [
    { lens: 'play', stage: 'p', q: 'Triangles make a truss…', options: ['stiff', 'flexible', 'cheap'], answer: 0 },
    { lens: 'compute', stage: 'ls', q: 'This truss is solved with…', options: ['18 equations for 18 unknowns', 'one equation', 'no equations'], answer: 0 },
    { lens: 'derive', stage: 'us', q: 'Factor of safety measures…', options: ['margin against failure', 'the cost', 'the weight'], answer: 0 },
    { lens: 'apply', stage: 'uni', q: 'Making every member bigger generally…', options: ['raises cost', 'lowers cost', 'changes nothing'], answer: 0 },
    { lens: 'misconception', stage: 'ls', q: 'A thicker member is always the best design.', options: ['true', 'false'], answer: 1 }
  ]
};

/* One graded misconception per world, drawn from the lessons' own mistake data. */
export const TROUBLE_QUIZ = {
  physics: { q: 'Pushing the two slits closer together makes the bright bands…', options: ['wider', 'narrower', 'unchanged'], answer: 0, lessonId: 'phy.pattern' },
  maths: { q: 'In y = a·sin(bx+c)+d, the value d sets…', options: ['the swing about the centre line', 'where the centre line sits', 'the repeat spacing'], answer: 1, lessonId: 'mat.amplitude' },
  chem: { q: 'To find the strongest puller you should look…', options: ['upper right, skipping noble gases', 'for the heaviest element', 'at the bottom left'], answer: 0, lessonId: 'chem.pull' },
  art: { q: 'A first drawing becomes readable when…', options: ['a few distinct values are established', 'every outline is detailed', 'five colours are used'], answer: 0, lessonId: 'art.three' },
  music: { q: 'Rhythm is fundamentally…', options: ['a count of beats', 'a pattern of note names', 'a kind of melody'], answer: 0, lessonId: 'mus.beat' },
  earth: { q: 'A country dossier describes…', options: ['a place at one chosen date', 'a place for all time', 'only its area'], answer: 0, lessonId: 'earth.dossier' },
  cs: { q: 'The gap between the two lanes shows…', options: ['measured comparisons', 'animation speed', 'a coding-style choice'], answer: 0, lessonId: 'cs.beat' },
  finance: { q: 'A 2% annual fee is…', options: ['charged once', 'charged yearly on a growing balance', 'a product recommendation'], answer: 1, lessonId: 'fin.fee' },
  language: { q: 'In the sentence tiles the subject is often supplied by…', options: ['a separate word', 'the verb ending', 'the tile order alone'], answer: 1, lessonId: 'lang.order' },
  astro: { q: 'Inner planets orbit…', options: ['faster than outer ones', 'slower because they are smaller', 'at the same speed'], answer: 0, lessonId: 'astro.speed' },
  bio: { q: 'Natural selection changes…', options: ['each individual’s traits', 'the mix of individuals', 'the habitat instantly'], answer: 1, lessonId: 'bio.select' },
  stats: { q: 'Sample means tend to…', options: ['mirror the population’s skew', 'pile up near the true mean', 'be identical'], answer: 1, lessonId: 'stats.pile' },
  climate: { q: 'Sunlight that is reflected…', options: ['warms the surface on its way out', 'never enters the energy budget', 'is the same as absorbed sunlight'], answer: 1, lessonId: 'cli.albedo' },
  eng: { q: 'The force in the top chord is found by…', options: ['reading its visual position', 'solving the linear system', 'guessing from the load arrow'], answer: 1, lessonId: 'eng.chord' }
};
