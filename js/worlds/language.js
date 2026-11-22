/* ==========================================================================
   Language — say it before you build it
   ========================================================================== */

import * as ui from '../ui.js';

const PHRASES = [
  {
    es: 'Yo bebo agua',
    en: 'I drink water',
    note: 'Spanish usually drops the pronoun — but the verb ending already said who.'
  },
  {
    es: 'Ella vive en Madrid',
    en: 'She lives in Madrid',
    note: 'The preposition "en" carries both "in" and "on".'
  },
  {
    es: 'Nosotros comemos pan todos los días',
    en: 'We eat bread every day',
    note: 'Adjectives follow the noun, and "días" agrees with "todos".'
  },
  {
    es: '¿Dónde está la biblioteca?',
    en: 'Where is the library?',
    note: 'Opening question mark up front — Spanish marks the question before you read it.'
  }
];

const ROLES = {
  yo: 'pron', ella: 'pron', nosotros: 'pron', tú: 'pron',
  bebo: 'verb', vive: 'verb', comemos: 'verb', está: 'verb',
  agua: 'noun', madrid: 'noun', pan: 'noun', días: 'noun', biblioteca: 'noun',
  en: 'other', todos: 'other', los: 'other', la: 'other', dónde: 'other'
};

const role = (w) => ROLES[w.toLowerCase().replace(/[¿?]/g, '')] || 'other';

export default {
  id: 'language',
  name: 'Language',
  sub: 'Sentence building',
  accent: '#e879f9',
  fade: false,
  glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3.6 6.5h16.8v9.2H9.4l-4.2 3.4v-3.4H3.6z"/>
    <path d="M7.6 11.2h6M16.6 11.2h.6"/>
  </svg>`,

  mount(stage, coach, api) {
    let idx = 0;
    let solved = 0;
    let perfect = 0;
    let mistakes = 0;
    let placed = 0;
    let speaking = false;
    let rate = 0.85;

    const wrap = ui.h('div', { class: 'lang-stage' });
    const prompt = ui.h('div', { class: 'lang-prompt' });
    const answer = ui.h('div', { class: 'lang-answer' });
    const pool = ui.h('div', { class: 'lang-pool' });
    const bar = ui.h('div', { class: 'lang-bar' });

    wrap.appendChild(prompt);
    wrap.appendChild(answer);
    wrap.appendChild(pool);
    wrap.appendChild(bar);
    stage.appendChild(wrap);

    const listenBtn = ui.button('Listen', () => speak(PHRASES[idx].es), 'accent');
    const nextBtn = ui.button('Next', () => { idx = (idx + 1) % PHRASES.length; load(); }, 'ghost');
    bar.appendChild(listenBtn);
    bar.appendChild(nextBtn);

    /* ---------- speech ---------- */
    let voice = null;
    function pickVoice() {
      if (!('speechSynthesis' in window)) return null;
      const all = window.speechSynthesis.getVoices();
      voice = all.find((v) => v.lang && v.lang.toLowerCase().startsWith('es')) || null;
      return voice;
    }
    if ('speechSynthesis' in window) {
      pickVoice();
      try {
        window.speechSynthesis.addEventListener('voiceschanged', pickVoice);
      } catch (e) {
        window.speechSynthesis.onvoiceschanged = pickVoice;
      }
    }

    function speak(text) {
      if (!('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
        u.rate = rate;
        if (voice) u.voice = voice;
        u.onstart = () => { speaking = true; };
        u.onend = () => { speaking = false; };
        window.speechSynthesis.speak(u);
      } catch (e) { /* ignore */ }
    }

    /* ---------- build ---------- */
    let target = [];
    let order = [];
    let tiles = [];

    function load() {
      const p = PHRASES[idx];
      mistakes = 0;
      placed = 0;
      target = p.es.split(' ');
      order = [];

      prompt.innerHTML = '';
      prompt.appendChild(ui.h('span', { class: 'sub' }, 'Say this in Spanish'));
      prompt.appendChild(ui.h('span', {}, p.en));

      answer.innerHTML = '';
      pool.innerHTML = '';

      const shuffledTiles = target
        .map((w, i) => ({ w, i }))
        .sort(() => Math.random() - 0.5);

      tiles = shuffledTiles.map(({ w }) => {
        const t = ui.h('button', {
          class: 'lang-tile ' + role(w),
          type: 'button',
          onclick: () => tapTile(t, w)
        }, w);
        t._w = w;
        pool.appendChild(t);
        return t;
      });
    }

    function tapTile(el, word) {
      if (el.classList.contains('used')) return;
      const expected = target[order.length];
      if (word === expected) {
        el.classList.add('used');
        order.push(word);
        placed++;
        answer.appendChild(ui.h('span', { class: 'lang-tile placed ' + role(word) }, word));
        if (order.length === target.length) {
          solved++;
          if (mistakes === 0) perfect++;
          speak(PHRASES[idx].es);
          api.toast(PHRASES[idx].es);
        }
      } else {
        mistakes++;
        el.classList.add('wrong');
        setTimeout(() => el.classList.remove('wrong'), 320);
      }
    }

    /* ---------- coach ---------- */
    const oSolved = ui.obs('Sentences solved', '');
    const oPerfect = ui.obs('Clean runs', '');
    const oMistakes = ui.obs('Mistakes here', '');
    const oWords = ui.obs('Words placed', '');

    const g = ui.goal(
      'Complete <b>three</b> sentences with no wrong word.',
      () => ({
        done: perfect >= 3,
        progress: `${perfect} of 3 clean`
      })
    );

    const sRate = ui.slider({
      label: 'Voice speed', min: 0.5, max: 1.4, step: 0.05, value: rate,
      format: (v) => v.toFixed(2) + '×',
      onInput: (v) => { rate = v; }
    });

    coach.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Language · Spanish'));
    coach.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Say it before you build it'));
    coach.appendChild(ui.h('p', { class: 'lesson-body' },
      'Listen first, then assemble. The word colours are grammatical roles, so the pattern becomes visible: the pronoun, then the verb carrying the ending, then what it acts on. Drag nothing — order is the whole grammar.'));

    coach.appendChild(ui.section('Goal', g.el));
    coach.appendChild(ui.section('Observables', ui.obsList(oSolved, oPerfect, oMistakes, oWords)));
    coach.appendChild(ui.section('Phrase', ui.controls(
      sRate.el,
      ui.buttonRow(
        ui.button('Hear it', () => speak(PHRASES[idx].es), 'accent'),
        ui.button('Reset', () => load())
      )
    )));
    coach.appendChild(ui.h('div', { class: 'hairline' }));
    coach.appendChild(ui.note(
      'Speech uses the device’s own Spanish voice. In the full app this pairs with per-phoneme scoring from the microphone — the thing no competitor does well — and with graded reading drawn from the countries, art and music you are already studying.'));

    load();

    const timer = setInterval(() => {
      oSolved.set(String(solved), solved > 0);
      oPerfect.set(String(perfect), perfect >= 3);
      oMistakes.set(String(mistakes));
      oWords.set(String(placed));
      g.update();
      api.markDone(g.done);
      void speaking;
    }, 300);

    return () => {
      clearInterval(timer);
      if ('speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
      }
    };
  }
};
