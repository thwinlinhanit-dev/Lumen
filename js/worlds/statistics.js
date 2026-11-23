/* ==========================================================================
   Statistics — the sampling machine
   ========================================================================== */

import * as ui from '../ui.js';
import * as contract from '../contract.js';

const BINS = 64;
const SIGMA = 30;     // sd of the skewed population
const MU = 30;        // its mean
const SPAN = 0.62;    // sampling x-range, in units of sigma either side of MU

export default {
  id: 'stats',
  name: 'Data',
  sub: 'Sampling',
  accent: '#f59e0b',
  fade: false,
  glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M4 20V4M4 20h16"/>
    <rect x="7" y="13" width="3" height="5" rx=".6"/>
    <rect x="12" y="9" width="3" height="9" rx=".6"/>
    <rect x="17" y="5.5" width="3" height="12.5" rx=".6"/>
  </svg>`,

  mount(stage, coach, api) {
    let n = 8;
    let speed = 6;
    let count = 0;
    let sum = 0;
    let sumSq = 0;
    let bins = new Array(BINS).fill(0);

    const host = ui.h('div', { class: 'canvas-host' });
    const canvas = ui.h('canvas');
    host.appendChild(canvas);
    stage.appendChild(host);

    const badge = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge live' }, ui.h('span', { class: 'led' }), 'Drawing samples'));
    stage.appendChild(badge);

    /* Wrap the sampling surface into one switchable pane. */
    const panePrimary = ui.h('div', { class: 'stage-pane' });
    while (stage.firstChild) panePrimary.appendChild(stage.firstChild);
    stage.appendChild(panePrimary);

    /* ---- second instrument: is a difference detectable? ---- */
    let instrument = 'stats';
    let hypMean = 50;
    let trueMean = 55;
    let difference = 0;
    let stdErrors = 0;
    let detectable = 0;

    const paneSecond = ui.h('div', { class: 'stage-pane secondary-pane', style: { display: 'none' } });
    const secondHead = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge' }, ui.h('span', { class: 'led' }), 'Hypothesis · the gap'));
    const meansLine = ui.h('div', { class: 'sec-line' });
    const gapLine = ui.h('div', { class: 'sec-line' });
    const meanGrid = ui.h('div', { class: 'sec-grid' });
    const hypCell = ui.h('div', { class: 'sec-cell' });
    const trueCell = ui.h('div', { class: 'sec-cell' });
    const gapCell = ui.h('div', { class: 'sec-cell' });
    meanGrid.appendChild(hypCell);
    meanGrid.appendChild(trueCell);
    meanGrid.appendChild(gapCell);
    paneSecond.appendChild(secondHead);
    paneSecond.appendChild(meansLine);
    paneSecond.appendChild(gapLine);
    paneSecond.appendChild(meanGrid);
    stage.appendChild(paneSecond);

    function paintSecond() {
      difference = Math.abs(trueMean - hypMean);
      stdErrors = difference / 5;
      detectable = stdErrors >= 2 ? 1 : 0;
      meansLine.textContent = `Hypothesised mean ${hypMean} · true mean ${trueMean}.`;
      gapLine.textContent = `Gap ${difference} — that is ${stdErrors.toFixed(2)} standard errors, ${detectable ? 'detectable' : 'not yet detectable'}.`;
      hypCell.textContent = `H0: ${hypMean}`;
      trueCell.textContent = `True: ${trueMean}`;
      gapCell.textContent = `Gap: ${difference}`;
    }

    paintSecond();

    const fit = ui.fitCanvas(canvas);
    const ctx = fit.ctx;

    /* the population: exponential, strongly skewed — CLT earns its result */
    function drawValue() {
      return -Math.log(1 - Math.random()) * MU;
    }

    function reset() {
      count = 0;
      sum = 0;
      sumSq = 0;
      bins = new Array(BINS).fill(0);
    }

    const lo = MU - SIGMA * SPAN;
    const hi = MU + SIGMA * SPAN;

    /* the population never changes — sample its shape once */
    const POP_BINS = 40;
    const popCounts = new Array(POP_BINS).fill(0);
    let popMax = 1;
    for (let i = 0; i < 8000; i++) {
      const b = Math.floor((drawValue() / 130) * POP_BINS);
      if (b >= 0 && b < POP_BINS) popCounts[b]++;
    }
    for (let i = 0; i < POP_BINS; i++) if (popCounts[i] > popMax) popMax = popCounts[i];

    function takeSample() {
      let s = 0;
      for (let i = 0; i < n; i++) s += drawValue();
      const m = s / n;
      count++;
      sum += m;
      sumSq += m * m;
      const b = Math.floor(((m - lo) / (hi - lo)) * BINS);
      if (b >= 0 && b < BINS) bins[b]++;
    }

    function observedSE() {
      if (count < 2) return 0;
      const mean = sum / count;
      const v = sumSq / count - mean * mean;
      return Math.sqrt(Math.max(0, v));
    }

    function draw() {
      const W = fit.size.w, H = fit.size.h;
      ctx.setTransform(fit.size.dpr, 0, 0, fit.size.dpr, 0, 0);
      ctx.fillStyle = '#08090d';
      ctx.fillRect(0, 0, W, H);

      const padL = 46, padR = 18;
      const plotW = Math.max(10, W - padL - padR);

      /* ---- population strip ---- */
      const popH = Math.min(110, H * 0.26);
      const popY = 46;
      const pbw = plotW / POP_BINS;
      for (let i = 0; i < POP_BINS; i++) {
        const bh = (popCounts[i] / popMax) * popH;
        ctx.fillStyle = 'rgba(245,158,11,0.30)';
        ctx.fillRect(padL + i * pbw, popY + popH - bh, Math.max(1, pbw - 1), bh);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.beginPath();
      ctx.moveTo(padL, popY + popH);
      ctx.lineTo(padL + plotW, popY + popH);
      ctx.stroke();

      ctx.font = '9.5px -apple-system, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(159,176,196,0.75)';
      ctx.fillText('the population — skewed, not normal', padL, popY - 8);

      /* ---- sampling distribution ---- */
      const sy = popY + popH + 52;
      const sh = Math.max(40, H - sy - 46);

      let sMax = 1;
      for (let i = 0; i < BINS; i++) if (bins[i] > sMax) sMax = bins[i];

      const sbw = plotW / BINS;
      for (let i = 0; i < BINS; i++) {
        if (!bins[i]) continue;
        const bh = (bins[i] / sMax) * sh;
        ctx.fillStyle = 'rgba(245,158,11,0.85)';
        ctx.fillRect(padL + i * sbw, sy + sh - bh, Math.max(1, sbw - 0.8), bh);
      }

      /* predicted normal overlay */
      const se = SIGMA / Math.sqrt(n);
      const mean = count ? sum / count : MU;
      ctx.beginPath();
      for (let px = 0; px <= plotW; px++) {
        const x = lo + (px / plotW) * (hi - lo);
        const dens = Math.exp(-((x - mean) * (x - mean)) / (2 * se * se));
        const y = sy + sh - dens * sh * 0.92;
        if (px === 0) ctx.moveTo(padL + px, y); else ctx.lineTo(padL + px, y);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1.3;
      ctx.stroke();
      ctx.lineWidth = 1;

      /* axes */
      ctx.strokeStyle = 'rgba(255,255,255,0.14)';
      ctx.beginPath();
      ctx.moveTo(padL, sy + sh);
      ctx.lineTo(padL + plotW, sy + sh);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.textAlign = 'center';
      for (let k = 0; k <= 4; k++) {
        const x = lo + ((hi - lo) * k) / 4;
        ctx.fillText(x.toFixed(1), padL + (plotW * k) / 4, sy + sh + 15);
      }

      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(159,176,196,0.75)';
      ctx.fillText(`the means of ${count} samples — white curve is the prediction`, padL, sy - 10);

      /* readout */
      ctx.font = '10.5px ui-monospace, monospace';
      ctx.fillStyle = 'rgba(233,239,247,0.8)';
      ctx.fillText(`n = ${n}   expected spread = σ/√n = ${se.toFixed(2)}   measured = ${observedSE().toFixed(2)}`, padL, sy + sh + 34);
    }

    /* ---------- coach ---------- */
    const oCount = ui.obs('Samples drawn', '');
    const oSpread = ui.obs('Measured spread', '');
    const oPred = ui.obs('Predicted σ/√n', '');
    const oMean = ui.obs('Mean of means', '');

    const sN = ui.slider({
      label: 'Sample size n', min: 2, max: 100, step: 1, value: n,
      format: (v) => String(Math.round(v)),
      onInput: (v) => { n = Math.round(v); }
    });
    const sSpeed = ui.slider({
      label: 'Samples per frame', min: 1, max: 40, step: 1, value: speed,
      format: (v) => String(Math.round(v)),
      onInput: (v) => { speed = Math.round(v); }
    });

    const g = ui.goal(
      'Shrink the spread of the means below <b>3</b>.',
      () => {
        const se = observedSE();
        return {
          done: count >= 150 && se < 3,
          progress: `${count} samples · spread ${se.toFixed(2)}`
        };
      }
    );

    coach.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Statistics · sampling'));
    coach.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Averages behave better than anything else'));
    coach.appendChild(ui.h('p', { class: 'lesson-body' },
      'The population up top is aggressively skewed — nothing normal about it. Yet the means below pile up into a bell curve anyway, and its width depends only on n. That result is why sampling works at all.'));

    coach.appendChild(ui.section('Goal', g.el));
    coach.appendChild(ui.section('Observables', ui.obsList(oCount, oSpread, oPred, oMean)));
    coach.appendChild(ui.section('Controls', ui.controls(
      sN.el,
      sSpeed.el,
      ui.buttonRow(
        ui.button('Clear', () => reset(), 'ghost'),
        ui.button('Take 50 now', () => { for (let i = 0; i < 50; i++) takeSample(); }, 'accent')
      )
    )));
    coach.appendChild(ui.h('div', { class: 'hairline' }));
    coach.appendChild(ui.note(
      'The white curve is not fitted — it is the predicted normal with mean μ and spread <b>σ/√n</b>. When it tracks the bars, the central limit theorem is doing real work in front of you.'));

    /* ---- wrap the sampling coach, then add the hypothesis one ---- */
    const coachPrimary = ui.h('div', { class: 'instrument-pane' });
    while (coach.firstChild) coachPrimary.appendChild(coach.firstChild);
    const coachSecond = ui.h('div', { class: 'instrument-pane', style: { display: 'none' } });
    coach.appendChild(coachPrimary);
    coach.appendChild(coachSecond);

    const oDiff = ui.obs('Difference', '');
    const oSE = ui.obs('Standard errors', '');
    const oDetect = ui.obs('Detectable', '');
    const sHyp = ui.slider({
      label: 'Hypothesised mean', min: 0, max: 100, step: 1, value: hypMean,
      format: (v) => String(Math.round(v)),
      onInput: (v) => { hypMean = Math.round(v); paintSecond(); }
    });
    const sTrue = ui.slider({
      label: 'True mean', min: 0, max: 100, step: 1, value: trueMean,
      format: (v) => String(Math.round(v)),
      onInput: (v) => { trueMean = Math.round(v); paintSecond(); }
    });
    const sg = ui.goal(
      'Open a gap of at least <b>10</b> points — two standard errors on this scale.',
      () => ({ done: detectable >= 1, progress: `${stdErrors.toFixed(2)} standard errors` }),
      'hypothesis'
    );
    coachSecond.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Statistics · hypothesis'));
    coachSecond.appendChild(ui.h('h2', { class: 'lesson-title' }, 'A gap is only visible against noise'));
    coachSecond.appendChild(ui.h('p', { class: 'lesson-body' },
      'One mean is the claim, the other is what is actually true. Their difference is measured in fixed five-point steps here, so a gap only counts as detectable once it clears two of them.'));
    coachSecond.appendChild(ui.section('Goal', sg.el));
    coachSecond.appendChild(ui.section('Observables', ui.obsList(oDiff, oSE, oDetect)));
    coachSecond.appendChild(ui.section('Means', ui.controls(sHyp.el, sTrue.el)));
    coachSecond.appendChild(ui.h('div', { class: 'hairline' }));
    coachSecond.appendChild(ui.note(
      'The five-point step and the divide-by-five are a teaching scale, not a power calculation. Real detectability depends on sample size, variance and a chosen significance level, none of which this pane models.'));

    function setInstrument(id) {
      instrument = id;
      panePrimary.style.display = id === 'stats' ? '' : 'none';
      paneSecond.style.display = id === 'hypothesis' ? '' : 'none';
      coachPrimary.style.display = id === 'stats' ? '' : 'none';
      coachSecond.style.display = id === 'hypothesis' ? '' : 'none';
      switchSeg.select(id);
      contract.selectInstrument(id);
      if (id === 'hypothesis') paintSecond(); else { fit.resize(); draw(); }
      contract.useGoal(id);
    }
    const switchSeg = ui.segmented(
      [{ id: 'stats', label: 'Sampling' }, { id: 'hypothesis', label: 'Hypothesis' }],
      'stats', setInstrument);
    coach.appendChild(switchSeg);
    contract.registerInstrument({ id: 'stats', activate: () => setInstrument('stats') });
    contract.registerInstrument({ id: 'hypothesis', activate: () => setInstrument('hypothesis') });

    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);

    reset();

    const stop = ui.addTicker(() => {
      if (instrument === 'stats') {
        for (let i = 0; i < speed; i++) takeSample();
        draw();
        oCount.set(String(count), count > 150);
        oSpread.set(observedSE().toFixed(2), observedSE() < 3);
        oPred.set((SIGMA / Math.sqrt(n)).toFixed(2));
        oMean.set(count ? (sum / count).toFixed(2) : '—');
        g.update();
        api.markDone(g.done);
        return;
      }
      oDiff.set(String(difference));
      oSE.set(stdErrors.toFixed(2));
      oDetect.set(String(detectable));
      sg.update();
      api.markDone(sg.done);
    });

    return () => { stop(); ro.disconnect(); fit.destroy(); };
  }
};
