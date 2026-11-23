/* ==========================================================================
   Biology — natural selection you can watch happen
   ========================================================================== */

import * as ui from '../ui.js';
import * as contract from '../contract.js';

const N = 108;
const BINS = 18;

function gauss(mu, sd) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mu + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default {
  id: 'bio',
  name: 'Biology',
  sub: 'Natural selection',
  accent: '#4ade80',
  fade: false,
  glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M6.5 3.5c0 7 11 10 11 17"/>
    <path d="M17.5 3.5c0 7-11 10-11 17"/>
    <path d="M8.4 7.6h7.2M9.6 11.2h4.8M9.6 15.4h4.8"/>
  </svg>`,

  mount(stage, coach, api) {
    let pop = [];
    let generation = 0;
    let optimum = 0.72;
    let strength = 0.65;
    let mutation = 0.03;
    let timer = 0;
    let mean = 0.5;
    let sd = 0.12;

    const host = ui.h('div', { class: 'canvas-host' });
    const canvas = ui.h('canvas');
    host.appendChild(canvas);
    stage.appendChild(host);

    const badge = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge live' }, ui.h('span', { class: 'led' }), 'Population evolving'));
    stage.appendChild(badge);

    /* Wrap the evolution surface into one switchable pane. */
    const panePrimary = ui.h('div', { class: 'stage-pane' });
    while (stage.firstChild) panePrimary.appendChild(stage.firstChild);
    stage.appendChild(panePrimary);

    /* ---- second instrument: a one-locus Punnett square ---- */
    let instrument = 'bio';
    let alleleA = 0;
    let alleleB = 0;
    let domFraction = 0;
    let hetFraction = 0;
    let genotypeCode = 0;
    const combos = [];

    const paneSecond = ui.h('div', { class: 'stage-pane secondary-pane', style: { display: 'none' } });
    const secondHead = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge' }, ui.h('span', { class: 'led' }), 'Genetics · one locus'));
    const alleleLine = ui.h('div', { class: 'sec-line' });
    const fracLine = ui.h('div', { class: 'sec-line' });
    const comboGrid = ui.h('div', { class: 'sec-grid' });
    paneSecond.appendChild(secondHead);
    paneSecond.appendChild(alleleLine);
    paneSecond.appendChild(fracLine);
    paneSecond.appendChild(comboGrid);
    stage.appendChild(paneSecond);

    function paintSecond() {
      const alleles = [alleleA, alleleB];
      combos.length = 0;
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) combos.push(String(alleles[i]) + String(alleles[j]));
      }
      let domCount = 0;
      let hetCount = 0;
      for (const combo of combos) {
        if (combo.indexOf('1') >= 0) domCount++;
        if (combo[0] !== combo[1]) hetCount++;
      }
      domFraction = domCount / combos.length;
      hetFraction = hetCount / combos.length;
      genotypeCode = alleleA * 2 + alleleB;
      alleleLine.textContent = `Carried alleles: ${alleleA ? 'A' : 'a'} from parent A, ${alleleB ? 'A' : 'a'} from parent B.`;
      fracLine.textContent = `Dominant ${domFraction.toFixed(2)} · heterozygous ${hetFraction.toFixed(2)} · genotype code ${genotypeCode}`;
      comboGrid.innerHTML = '';
      for (const combo of combos) {
        const cell = ui.h('div', { class: 'sec-cell' }, combo.replace(/1/g, 'A').replace(/0/g, 'a'));
        if (combo.indexOf('1') >= 0) cell.classList.add('on');
        comboGrid.appendChild(cell);
      }
    }

    paintSecond();

    const fit = ui.fitCanvas(canvas);
    const ctx = fit.ctx;

    function reseed() {
      pop = new Array(N);
      for (let i = 0; i < N; i++) pop[i] = clamp01(gauss(0.4, 0.1));
      generation = 0;
      timer = 0;
      stats();
    }

    function stats() {
      let s = 0;
      for (let i = 0; i < pop.length; i++) s += pop[i];
      mean = pop.length ? s / pop.length : 0;
      let q = 0;
      for (let i = 0; i < pop.length; i++) q += (pop[i] - mean) * (pop[i] - mean);
      sd = pop.length > 1 ? Math.sqrt(q / (pop.length - 1)) : 0;
    }

    function step() {
      const sigma = 0.05 + (1 - strength) * 0.34;
      const w = new Array(N);
      let total = 0;
      for (let i = 0; i < N; i++) {
        const d = pop[i] - optimum;
        const f = Math.exp(-(d * d) / (2 * sigma * sigma));
        w[i] = f;
        total += f;
      }
      if (total <= 0) total = 1;

      const next = new Array(N);
      for (let i = 0; i < N; i++) {
        let r = Math.random() * total;
        let k = 0;
        while (k < N - 1 && r > w[k]) { r -= w[k]; k++; }
        next[i] = clamp01(pop[k] + gauss(0, mutation));
      }
      pop = next;
      generation++;
      stats();
    }

    function traitColour(t) {
      const r = Math.round(ui.lerp(96, 74, t));
      const g = Math.round(ui.lerp(165, 222, t));
      const b = Math.round(ui.lerp(250, 128, t));
      return `rgb(${r},${g},${b})`;
    }

    function draw() {
      const W = fit.size.w, H = fit.size.h;
      ctx.setTransform(fit.size.dpr, 0, 0, fit.size.dpr, 0, 0);
      ctx.fillStyle = '#070a0e';
      ctx.fillRect(0, 0, W, H);

      const histW = Math.min(230, W * 0.32);
      const leftW = W - histW - 24;

      /* agents */
      const cols = 12;
      const rows = Math.ceil(N / cols);
      const cell = Math.min(leftW / cols, (H - 80) / rows);
      const ox = 16 + (leftW - cols * cell) / 2;
      const oy = 52;

      const sorted = pop.slice().sort((a, b) => a - b);

      for (let i = 0; i < sorted.length; i++) {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const t = sorted[i];
        const near = Math.abs(t - optimum) < 0.06;
        ctx.beginPath();
        ctx.arc(ox + c * cell + cell / 2, oy + r * cell + cell / 2, Math.max(1.5, cell * 0.32), 0, Math.PI * 2);
        ctx.fillStyle = traitColour(t);
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
        if (near) {
          ctx.strokeStyle = 'rgba(255,255,255,0.55)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      /* histogram */
      const bins = new Array(BINS).fill(0);
      for (let i = 0; i < pop.length; i++) {
        const b = Math.min(BINS - 1, Math.floor(pop[i] * BINS));
        bins[b]++;
      }
      let maxBin = 1;
      for (let i = 0; i < BINS; i++) if (bins[i] > maxBin) maxBin = bins[i];

      const hx = W - histW - 12;
      const hy = 52;
      const hh = H - 130;
      const bw = histW / BINS;

      ctx.fillStyle = 'rgba(255,255,255,0.025)';
      ctx.fillRect(hx, hy, histW, hh);

      for (let i = 0; i < BINS; i++) {
        const bh = (bins[i] / maxBin) * hh;
        ctx.fillStyle = traitColour((i + 0.5) / BINS);
        ctx.globalAlpha = 0.85;
        ctx.fillRect(hx + i * bw + 0.5, hy + hh - bh, Math.max(1, bw - 1.5), bh);
        ctx.globalAlpha = 1;
      }

      /* optimum marker */
      const optX = hx + optimum * histW;
      ctx.strokeStyle = '#ffffff';
      ctx.globalAlpha = 0.75;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(optX, hy - 4);
      ctx.lineTo(optX, hy + hh);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      /* mean marker */
      const meanX = hx + mean * histW;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(meanX, hy);
      ctx.lineTo(meanX, hy + hh);
      ctx.stroke();
      ctx.lineWidth = 1;

      ctx.font = '9.5px -apple-system, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fillText('trait value →', hx, hy + hh + 16);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('mean', hx, hy + hh + 30);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText('optimum', hx + 40, hy + hh + 30);

      ctx.fillStyle = 'rgba(233,239,247,0.85)';
      ctx.font = '11px -apple-system, system-ui, sans-serif';
      ctx.fillText(`generation ${generation}`, 16, 26);
      ctx.fillStyle = 'rgba(159,176,196,0.7)';
      ctx.font = '10px -apple-system, system-ui, sans-serif';
      ctx.fillText(`mean ${mean.toFixed(3)} · spread ${sd.toFixed(3)}`, 16, 40);
    }

    /* ---------- coach ---------- */
    const oGen = ui.obs('Generation', '');
    const oMean = ui.obs('Mean trait', '');
    const oSd = ui.obs('Spread', '');
    const oGap = ui.obs('Distance from optimum', '');

    const sOpt = ui.slider({
      label: 'Environment optimum', min: 0, max: 1, step: 0.01, value: optimum,
      format: (v) => v.toFixed(2),
      onInput: (v) => { optimum = v; }
    });
    const sStr = ui.slider({
      label: 'Selection strength', min: 0, max: 1, step: 0.01, value: strength,
      format: (v) => Math.round(v * 100) + '%',
      onInput: (v) => { strength = v; }
    });
    const sMut = ui.slider({
      label: 'Mutation rate', min: 0, max: 0.12, step: 0.002, value: mutation,
      format: (v) => v.toFixed(3),
      onInput: (v) => { mutation = v; }
    });

    /* The goal must be stable at rest: within 2% of the optimum, and it has
       to stay there for two seconds — a lucky single frame is not enough. */
    const hold = ui.holdTracker(2000);

    const g = ui.goal(
      'Pull the population to within <b>2%</b> of the optimum — and hold it there for two seconds.',
      () => {
        const at = Math.abs(mean - optimum) < 0.02 && generation >= 8;
        return {
          done: hold.met,
          progress: hold.met
            ? 'held at the optimum'
            : at
              ? `holding · ${hold.secondsLeft.toFixed(1)} s to go`
              : `gap ${(Math.abs(mean - optimum) * 100).toFixed(0)}%`
        };
      }
    );

    coach.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Biology · evolution'));
    coach.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Selection pulls, mutation pushes back'));
    coach.appendChild(ui.h('p', { class: 'lesson-body' },
      'Each dot is one individual and its colour is a heritable trait. Move the optimum away and watch the population chase it — then turn mutation up and watch the spread refuse to collapse. Those two forces are the whole of evolution in one picture.'));

    coach.appendChild(ui.section('Goal', g.el));
    coach.appendChild(ui.section('Observables', ui.obsList(oGen, oMean, oSd, oGap)));
    coach.appendChild(ui.section('Environment', ui.controls(sOpt.el, sStr.el, sMut.el)));
    coach.appendChild(ui.section('Restart', ui.buttonRow(
      ui.button('Reseed population', () => reseed(), 'accent')
    )));
    coach.appendChild(ui.h('div', { class: 'hairline' }));
    coach.appendChild(ui.note(
      'Selection here is a Gaussian fitness landscape — a simplification, but the mean really does move and the variance really does respond. The same engine, at a different timescale, is the ecosystem builder and the phylogeny view.'));

    /* ---- wrap the evolution coach, then add the genetics one ---- */
    const coachPrimary = ui.h('div', { class: 'instrument-pane' });
    while (coach.firstChild) coachPrimary.appendChild(coach.firstChild);
    const coachSecond = ui.h('div', { class: 'instrument-pane', style: { display: 'none' } });
    coach.appendChild(coachPrimary);
    coach.appendChild(coachSecond);

    const oDom = ui.obs('Dominant fraction', '');
    const oHet = ui.obs('Heterozygous fraction', '');
    const oCode = ui.obs('Genotype code', '');
    const sAlleleA = ui.slider({
      label: 'Allele from A', min: 0, max: 1, step: 1, value: alleleA,
      format: (v) => (Math.round(v) ? 'A' : 'a'),
      onInput: (v) => { alleleA = Math.round(v); paintSecond(); }
    });
    const sAlleleB = ui.slider({
      label: 'Allele from B', min: 0, max: 1, step: 1, value: alleleB,
      format: (v) => (Math.round(v) ? 'A' : 'a'),
      onInput: (v) => { alleleB = Math.round(v); paintSecond(); }
    });
    const sg = ui.goal(
      'Reach a dominant fraction of at least <b>0.75</b>.',
      () => ({ done: domFraction >= 0.75, progress: `${domFraction.toFixed(2)} dominant` }),
      'genetics'
    );
    coachSecond.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Biology · genetics'));
    coachSecond.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Four boxes hold one locus'));
    coachSecond.appendChild(ui.h('p', { class: 'lesson-body' },
      'One individual carries an allele from each parent. Self it and the square shows the four allele pairs its offspring can receive — each one equally likely.'));
    coachSecond.appendChild(ui.section('Goal', sg.el));
    coachSecond.appendChild(ui.section('Observables', ui.obsList(oDom, oHet, oCode)));
    coachSecond.appendChild(ui.section('Alleles', ui.controls(sAlleleA.el, sAlleleB.el)));
    coachSecond.appendChild(ui.h('div', { class: 'hairline' }));
    coachSecond.appendChild(ui.note(
      'This is a single-locus square with complete dominance: two alleles, four equally likely boxes. Real inheritance spreads across many loci with linkage and environmental effects, all left out here.'));

    function setInstrument(id) {
      instrument = id;
      panePrimary.style.display = id === 'bio' ? '' : 'none';
      paneSecond.style.display = id === 'genetics' ? '' : 'none';
      coachPrimary.style.display = id === 'bio' ? '' : 'none';
      coachSecond.style.display = id === 'genetics' ? '' : 'none';
      switchSeg.select(id);
      contract.selectInstrument(id);
      if (id === 'genetics') paintSecond(); else { fit.resize(); draw(); }
      contract.useGoal(id);
    }
    const switchSeg = ui.segmented(
      [{ id: 'bio', label: 'Evolution' }, { id: 'genetics', label: 'Genetics' }],
      'bio', setInstrument);
    coach.appendChild(switchSeg);
    contract.registerInstrument({ id: 'bio', activate: () => setInstrument('bio') });
    contract.registerInstrument({ id: 'genetics', activate: () => setInstrument('genetics') });

    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);

    reseed();

    const stop = ui.addTicker((dt) => {
      if (instrument === 'bio') {
        timer += dt;
        if (timer > 0.34) {
          timer = 0;
          step();
        }
        draw();
        oGen.set(String(generation), generation > 8);
        oMean.set(mean.toFixed(3));
        oSd.set(sd.toFixed(3));
        oGap.set(((Math.abs(mean - optimum)) * 100).toFixed(1) + '%');
        hold.update(Math.abs(mean - optimum) < 0.02 && generation >= 8, dt);
        g.update();
        api.markDone(g.done);
        return;
      }
      oDom.set(domFraction.toFixed(2));
      oHet.set(hetFraction.toFixed(2));
      oCode.set(String(genotypeCode));
      sg.update();
      api.markDone(sg.done);
    });

    return () => { stop(); ro.disconnect(); fit.destroy(); };
  }
};
