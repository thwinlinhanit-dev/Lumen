/* ==========================================================================
   Music — theory you can hear, practice you can play
   ========================================================================== */

import * as ui from '../ui.js';
import * as contract from '../contract.js';

const WHITE = [
  ['C4', 60], ['D4', 62], ['E4', 64], ['F4', 65], ['G4', 67], ['A4', 69], ['B4', 71],
  ['C5', 72], ['D5', 74], ['E5', 76], ['F5', 77], ['G5', 79], ['A5', 81], ['B5', 83]
];
const BLACK = [
  [0, 61], [1, 63], [3, 66], [4, 68], [5, 70],
  [7, 73], [8, 75], [10, 78], [11, 80], [12, 82]
];
const CHORDS = [
  { rn: 'I', name: 'C', midi: [60, 64, 67] },
  { rn: 'IV', name: 'F', midi: [65, 69, 72] },
  { rn: 'V', name: 'G', midi: [67, 71, 74] },
  { rn: 'vi', name: 'Am', midi: [69, 72, 76] }
];
const PHRASE = [60, 64, 67, 72, 67, 64, 62, 60];

export default {
  id: 'music',
  name: 'Music',
  sub: 'Theory & practice',
  accent: '#fbbf24',
  fade: false,
  glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <circle cx="7" cy="17.2" r="2.6"/>
    <circle cx="17.2" cy="15" r="2.6"/>
    <path d="M9.6 17.2V6.6l10.2-2v10.4"/>
  </svg>`,

  mount(stage, coach, api) {
    let ac = null, master = null, analyser = null, timeData = null;
    let mode = 'free';
    let practiceIdx = 0;
    let practiceDone = false;
    let notesPlayed = 0;
    let lastNote = '—';
    let tempo = 120;

    /* ---------- audio ---------- */
    function ensureAudio() {
      if (ac) {
        if (ac.state === 'suspended') ac.resume();
        return ac;
      }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ac = new AC();
      master = ac.createGain();
      master.gain.value = 0.2;
      analyser = ac.createAnalyser();
      analyser.fftSize = 1024;
      timeData = new Uint8Array(analyser.fftSize);
      master.connect(analyser);
      analyser.connect(ac.destination);
      return ac;
    }

    function voice(midi, when = 0, dur = 0.85, gain = 0.9) {
      const a = ensureAudio();
      if (!a || !master) return;
      const f = 440 * Math.pow(2, (midi - 69) / 12);
      const t0 = a.currentTime + when;

      const g = a.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

      const o1 = a.createOscillator();
      o1.type = 'triangle';
      o1.frequency.value = f;

      const o2 = a.createOscillator();
      o2.type = 'sine';
      o2.frequency.value = f * 2;
      const g2 = a.createGain();
      g2.gain.value = 0.2;

      const flt = a.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.value = 2800;

      o1.connect(g);
      o2.connect(g2);
      g2.connect(g);
      g.connect(flt);
      flt.connect(master);

      o1.start(t0);
      o2.start(t0);
      o1.stop(t0 + dur + 0.05);
      o2.stop(t0 + dur + 0.05);
    }

    /* ---------- dom ---------- */
    const wrap = ui.h('div', { class: 'music-stage' });
    const waveView = ui.h('div', { class: 'wave-view' });
    const waveCanvas = ui.h('canvas');
    waveView.appendChild(waveCanvas);

    const stepsRow = ui.h('div', { class: 'steps' });
    const stepEls = PHRASE.map(() => {
      const s = ui.h('div', { class: 'step' });
      stepsRow.appendChild(s);
      return s;
    });

    const chordRow = ui.h('div', { class: 'chord-row' });
    const chordEls = CHORDS.map((c) => {
      const b = ui.h('button', {
        class: 'chord', type: 'button',
        onclick: () => {
          ensureAudio();
          c.midi.forEach((m, i) => voice(m, i * 0.012, 1.1, 0.55));
          b.classList.add('on');
          setTimeout(() => b.classList.remove('on'), 180);
          notesPlayed += c.midi.length;
        }
      },
        ui.h('div', { class: 'rn' }, c.rn),
        ui.h('div', { class: 'cn' }, c.name));
      chordRow.appendChild(b);
      return b;
    });

    const keysWrap = ui.h('div', { class: 'keys-wrap' });
    const keys = ui.h('div', { class: 'keys' });
    keysWrap.appendChild(keys);

    const keyEls = new Map();

    WHITE.forEach(([name, midi], i) => {
      const k = ui.h('button', {
        class: 'wkey', type: 'button', 'aria-label': name,
        onclick: () => press(midi)
      }, name);
      k._midi = midi;
      keys.appendChild(k);
      keyEls.set(midi, k);
      void i;
    });

    BLACK.forEach(([afterIdx, midi]) => {
      const left = ((afterIdx + 1) / WHITE.length) * 100;
      const k = ui.h('button', {
        class: 'bkey', type: 'button',
        'aria-label': `sharp ${midi}`,
        style: { left: `calc(${left}% - 3.1%)` },
        onclick: () => press(midi)
      });
      k._midi = midi;
      keys.appendChild(k);
      keyEls.set(midi, k);
    });

    wrap.appendChild(waveView);
    wrap.appendChild(stepsRow);
    wrap.appendChild(chordRow);
    wrap.appendChild(keysWrap);
    stage.appendChild(wrap);

    /* Wrap the piano into one switchable pane. */
    const panePrimary = ui.h('div', { class: 'stage-pane' });
    while (stage.firstChild) panePrimary.appendChild(stage.firstChild);
    stage.appendChild(panePrimary);

    /* ---- second instrument: tuning ---- */
    let instrument = 'music';
    let noteFreq = 445;
    let reference = 440;

    const paneSecond = ui.h('div', { class: 'stage-pane secondary-pane', style: { display: 'none' } });
    const tuneHead = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge' }, ui.h('span', { class: 'led' }), 'Tuning · two frequencies'));
    const tuneLine = ui.h('div', { class: 'sec-line' });
    const matchLine = ui.h('div', { class: 'sec-line strong' });
    const tuneGrid = ui.h('div', { class: 'sec-grid' });
    const cellNote = ui.h('div', { class: 'sec-cell' });
    const cellRef = ui.h('div', { class: 'sec-cell' });
    tuneGrid.appendChild(cellNote);
    tuneGrid.appendChild(cellRef);
    paneSecond.appendChild(tuneHead);
    paneSecond.appendChild(tuneLine);
    paneSecond.appendChild(matchLine);
    paneSecond.appendChild(tuneGrid);
    stage.appendChild(paneSecond);

    function computeTuning() {
      const cents = 1200 * Math.log2(noteFreq / reference);
      const absCents = Math.abs(cents);
      return {
        cents,
        beat: Math.abs(noteFreq - reference),
        match: absCents <= 5 ? 1 : 0
      };
    }

    function paintSecond() {
      const { cents, match } = computeTuning();
      cellNote.textContent = `Note ${noteFreq} Hz`;
      cellRef.textContent = `Reference ${reference} Hz`;
      tuneLine.textContent = `Beat rate ${Math.abs(noteFreq - reference)} Hz · ${cents.toFixed(1)} cents`;
      matchLine.textContent = match
        ? 'In tune · within five cents'
        : `${cents > 0 ? 'Sharp' : 'Flat'} by ${Math.abs(cents).toFixed(1)} cents`;
      cellNote.classList.toggle('on', !!match);
      cellRef.classList.toggle('on', !!match);
    }

    paintSecond();

    const fit = ui.fitCanvas(waveCanvas);
    const ctx = fit.ctx;

    /* ---------- interaction ---------- */
    const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    function noteName(midi) {
      return NAMES[midi % 12] + (Math.floor(midi / 12) - 1);
    }

    function press(midi) {
      voice(midi, 0, 0.9);
      notesPlayed++;
      lastNote = noteName(midi);

      const el = keyEls.get(midi);
      if (el) {
        el.classList.add('on');
        setTimeout(() => el.classList.remove('on'), 140);
      }

      if (mode === 'practice' && !practiceDone) {
        if (midi === PHRASE[practiceIdx]) {
          stepEls[practiceIdx].classList.remove('bad');
          stepEls[practiceIdx].classList.add('on');
          practiceIdx++;
          paintPractice();
          if (practiceIdx >= PHRASE.length) {
            practiceDone = true;
            paintPractice();
            api.toast('Phrase complete — that is the whole melody');
          }
        } else {
          stepEls[practiceIdx].classList.add('bad');
          setTimeout(() => stepEls[practiceIdx].classList.remove('bad'), 260);
        }
      }
    }

    function paintPractice() {
      stepEls.forEach((s, i) => {
        s.classList.toggle('on', i < practiceIdx || practiceDone);
        s.classList.toggle('now', i === practiceIdx && !practiceDone);
        s.classList.remove('bad');
      });
      for (const [, k] of keyEls) k.classList.remove('target');
      if (mode === 'practice' && !practiceDone) {
        const target = keyEls.get(PHRASE[practiceIdx]);
        if (target) target.classList.add('target');
      }
    }

    function resetPractice() {
      practiceIdx = 0;
      practiceDone = false;
      paintPractice();
    }

    function listen() {
      ensureAudio();
      const a = ac;
      if (!a) return;
      const beat = 60 / Math.max(30, tempo);
      PHRASE.forEach((m, i) => {
        voice(m, i * beat, 0.6, 0.7);
        setTimeout(() => {
          const k = keyEls.get(m);
          if (k) {
            k.classList.add('on');
            setTimeout(() => k.classList.remove('on'), 130);
          }
        }, i * beat * 1000);
      });
    }

    /* ---------- wave ---------- */
    function drawWave(ts) {
      const W = fit.size.w, H = fit.size.h;
      ctx.setTransform(fit.size.dpr, 0, 0, fit.size.dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const mid = H / 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid); ctx.lineTo(W, mid);
      ctx.stroke();

      ctx.beginPath();
      if (analyser) {
        analyser.getByteTimeDomainData(timeData);
        const n = timeData.length;
        for (let i = 0; i < n; i++) {
          const v = (timeData[i] - 128) / 128;
          const x = (i / (n - 1)) * W;
          const y = mid - v * H * 0.4;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
      } else {
        const t = ts * 0.001;
        for (let x = 0; x <= W; x += 2) {
          const y = mid + Math.sin(x * 0.02 + t) * 2.2;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.6;
      ctx.shadowColor = 'rgba(251,191,36,0.5)';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    /* ---------- coach ---------- */
    const oNotes = ui.obs('Notes played', '');
    const oLast = ui.obs('Last note', '');
    const oPhrase = ui.obs('Phrase', '');

    const seg = ui.segmented([
      { id: 'free', label: 'Free play' },
      { id: 'practice', label: 'Practice' }
    ], 'free', (id) => {
      mode = id;
      resetPractice();
      chordRow.style.opacity = id === 'practice' ? '0.35' : '1';
      chordRow.style.pointerEvents = id === 'practice' ? 'none' : 'auto';
    });

    const g = ui.goal(
      'Play the eight-note phrase in order.',
      () => ({
        done: practiceDone,
        progress: practiceDone ? 'Clean run.' : `${practiceIdx} of ${PHRASE.length} notes`
      }),
      'music'
    );

    const sTempo = ui.slider({
      label: 'Tempo', min: 50, max: 200, step: 2, value: tempo,
      format: (v) => `${Math.round(v)} bpm`,
      onInput: (v) => { tempo = v; }
    });

    coach.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Music · theory in practice'));
    coach.appendChild(ui.h('h2', { class: 'lesson-title' }, 'The phrase is the lesson'));
    coach.appendChild(ui.h('p', { class: 'lesson-body' },
      'I–IV–V–vi is the spine of a thousand songs. Tap the chords to hear the pull, then switch to practice and play the phrase on the keys — every note you land lights up.'));

    coach.appendChild(ui.section('Goal', g.el));
    coach.appendChild(ui.section('Observables', ui.obsList(oNotes, oLast, oPhrase)));
    coach.appendChild(ui.section('Mode', ui.controls(
      seg,
      sTempo.el,
      ui.buttonRow(
        ui.button('Listen', () => listen(), 'accent'),
        ui.button('Restart', () => resetPractice())
      )
    )));

    coach.appendChild(ui.h('div', { class: 'hairline' }));
    coach.appendChild(ui.note(
      'In the real app the same overlay sits on a song you chose: MusicXML from open scores, <b>wait-for-you</b> mode, per-note pitch and timing from the microphone. A phone on the piano is the whole trick.'));

    /* ---- wrap the music coach, then add the tuning one ---- */
    const coachPrimary = ui.h('div', { class: 'instrument-pane' });
    while (coach.firstChild) coachPrimary.appendChild(coach.firstChild);
    const coachSecond = ui.h('div', { class: 'instrument-pane', style: { display: 'none' } });
    coach.appendChild(coachPrimary);
    coach.appendChild(coachSecond);

    const oCents = ui.obs('Cents off', '');
    const oBeat = ui.obs('Beat rate', 'Hz');
    const oMatch = ui.obs('Pitch match', '');

    const sFreq = ui.slider({
      label: 'Note frequency', min: 220, max: 880, step: 1, value: noteFreq,
      format: (v) => `${Math.round(v)} Hz`,
      onInput: (v) => { noteFreq = Math.round(v); paintSecond(); }
    });
    const sRef = ui.slider({
      label: 'Reference', min: 400, max: 500, step: 1, value: reference,
      format: (v) => `${Math.round(v)} Hz`,
      onInput: (v) => { reference = Math.round(v); paintSecond(); }
    });

    const sg = ui.goal(
      'Bring the note within <b>five cents</b> of the reference.',
      () => {
        const cents = computeTuning().cents;
        return { done: Math.abs(cents) <= 5, progress: `${cents.toFixed(1)} cents off` };
      },
      'tuning'
    );

    coachSecond.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Music · tuning'));
    coachSecond.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Two notes either agree or they beat'));
    coachSecond.appendChild(ui.h('p', { class: 'lesson-body' },
      'Set a reference pitch, then slide a note toward it. The gap in hertz is the beat rate you would hear; the gap in cents is the same distance on a musical scale. Within five cents the two read as one pitch.'));
    coachSecond.appendChild(ui.section('Goal', sg.el));
    coachSecond.appendChild(ui.section('Observables', ui.obsList(oCents, oBeat, oMatch)));
    coachSecond.appendChild(ui.section('Controls', ui.controls(sFreq.el, sRef.el)));
    coachSecond.appendChild(ui.h('div', { class: 'hairline' }));
    coachSecond.appendChild(ui.note(
      'Cents are <b>1200 × log₂(f / f₀)</b> and the beat rate is <b>|f − f₀|</b> in hertz — both are definitions, not measurements of a real instrument. The cells show the numbers only; no sound is generated here, so this reads as arithmetic rather than a proof of hearing.'));

    function setInstrument(id) {
      instrument = id;
      panePrimary.style.display = id === 'music' ? '' : 'none';
      paneSecond.style.display = id === 'tuning' ? '' : 'none';
      coachPrimary.style.display = id === 'music' ? '' : 'none';
      coachSecond.style.display = id === 'tuning' ? '' : 'none';
      switchSeg.select(id);
      contract.selectInstrument(id);
      if (id === 'tuning') paintSecond(); else { fit.resize(); drawWave(0); }
      contract.useGoal(id);
    }
    const switchSeg = ui.segmented(
      [{ id: 'music', label: 'Piano' }, { id: 'tuning', label: 'Tuning' }],
      'music', setInstrument);
    coach.appendChild(switchSeg);
    contract.registerInstrument({ id: 'music', activate: () => setInstrument('music') });
    contract.registerInstrument({ id: 'tuning', activate: () => setInstrument('tuning') });

    fit.resize();

    paintPractice();

    const stop = ui.addTicker((dt, ts) => {
      if (instrument === 'music') {
        drawWave(ts);
        oNotes.set(String(notesPlayed));
        oLast.set(lastNote, lastNote !== '—');
        oPhrase.set(practiceDone ? 'complete' : `${practiceIdx}/${PHRASE.length}`, practiceDone);
        g.update();
        api.markDone(g.done);
        return;
      }
      const { cents, beat, match } = computeTuning();
      oCents.set(cents.toFixed(1));
      oBeat.set(beat.toFixed(1));
      oMatch.set(String(match), !!match);
      sg.update();
      api.markDone(sg.done);
    });

    return () => {
      stop();
      fit.destroy();
      if (ac) { try { ac.close(); } catch (e) { /* ignore */ } }
    };
  }
};
