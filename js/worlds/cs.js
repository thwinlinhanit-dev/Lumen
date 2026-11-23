/* ==========================================================================
   Computer Science — a sorting race you can time
   ========================================================================== */

import * as ui from '../ui.js';
import * as contract from '../contract.js';

/* ---- algorithms as steppers ------------------------------------------- */

function* bubble(a) {
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      yield { line: 1, cmp: true, hl: [j, j + 1] };
      if (a[j] > a[j + 1]) {
        const t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
        yield { line: 2, swap: true, hl: [j, j + 1] };
      }
    }
  }
  yield { line: 3 };
}

function* insertion(a) {
  const n = a.length;
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0) {
      yield { line: 0, cmp: true, hl: [j, i] };
      if (a[j] > key) {
        a[j + 1] = a[j];
        j--;
        yield { line: 2, swap: true, hl: [j + 1, i] };
      } else break;
    }
    a[j + 1] = key;
    yield { line: 3 };
  }
}

function* quick(a) {
  const stack = [[0, a.length - 1]];
  while (stack.length) {
    const [lo, hi] = stack.pop();
    if (lo >= hi) continue;
    const pivot = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      yield { line: 0, cmp: true, hl: [j, hi] };
      if (a[j] < pivot) {
        const t = a[i]; a[i] = a[j]; a[j] = t;
        i++;
        yield { line: 2, swap: true, hl: [i - 1, j] };
      }
    }
    const t = a[i]; a[i] = a[hi]; a[hi] = t;
    yield { line: 3, swap: true, hl: [i, hi] };
    stack.push([lo, i - 1], [i + 1, hi]);
  }
}

const ALGOS = {
  bubble: {
    name: 'Bubble',
    gen: bubble,
    code: ['for j in 0..n-1-i', '  if a[j] > a[j+1]', '    swap', 'done']
  },
  insertion: {
    name: 'Insertion',
    gen: insertion,
    code: ['while j >= 0', '  shift a[j] right', 'place key', 'done']
  },
  quick: {
    name: 'Quick',
    gen: quick,
    code: ['compare a[j] to pivot', '  swap into the low side', 'place pivot', 'recurse halves']
  }
};

const NAMES = Object.keys(ALGOS);

function shuffled(n) {
  const a = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

export default {
  id: 'cs',
  name: 'Code',
  sub: 'Algorithms',
  accent: '#818cf8',
  glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3.5" y="5" width="17" height="14" rx="2.5"/>
    <path d="M7.5 10.5l2 2-2 2"/>
    <path d="M12.5 14.5h4"/>
  </svg>`,

  mount(stage, coach, api) {
    let n = 32;
    let budget = 6;
    let running = true;
    let bestComps = Infinity;
    let chartDirty = true;
    let base = shuffled(n);
    const records = [];

    const lanes = [
      { algo: 'bubble', arr: [], gen: null, comps: 0, swaps: 0, done: false, line: 0, hl: [] },
      { algo: 'quick', arr: [], gen: null, comps: 0, swaps: 0, done: false, line: 0, hl: [] }
    ];

    /* ---------- dom ---------- */
    const host = ui.h('div', { class: 'canvas-host' });
    const canvas = ui.h('canvas');
    host.appendChild(canvas);
    stage.appendChild(host);

    const badge = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge' }, ui.h('span', { class: 'led' }), 'Two algorithms, one array'));
    stage.appendChild(badge);

    /* Wrap the sorting surface into one switchable pane. */
    const paneSort = ui.h('div', { class: 'stage-pane' });
    while (stage.firstChild) paneSort.appendChild(stage.firstChild);
    stage.appendChild(paneSort);

    /* ---- second instrument: linear vs binary search ---- */
    let instrument = 'sort';
    let searchSize = 16;
    let target = 12;
    const sorted = [];
    let linearSteps = 0;
    let binarySteps = 0;

    const paneSearch = ui.h('div', { class: 'stage-pane search-pane', style: { display: 'none' } });
    const searchHead = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge' }, ui.h('span', { class: 'led' }), 'Search · two strategies'));
    const oLinText = ui.h('div', { class: 'search-line' });
    const oBinText = ui.h('div', { class: 'search-line' });
    const chipRow = ui.h('div', { class: 'search-list' });
    paneSearch.appendChild(searchHead);
    paneSearch.appendChild(oLinText);
    paneSearch.appendChild(oBinText);
    paneSearch.appendChild(chipRow);
    stage.appendChild(paneSearch);

    function rebuildSearch() {
      sorted.length = 0;
      for (let i = 1; i <= searchSize; i++) sorted.push(i * 2);
      target = ui.clamp(Math.round(target), 2, searchSize * 2);
    }

    function paintSearch() {
      const idx = sorted.indexOf(target);
      linearSteps = idx < 0 ? searchSize : idx + 1;
      binarySteps = 0;
      let lo = 0, hi = sorted.length - 1;
      while (lo <= hi) {
        binarySteps++;
        const mid = (lo + hi) >> 1;
        if (sorted[mid] === target) break;
        if (sorted[mid] < target) lo = mid + 1; else hi = mid - 1;
      }
      oLinText.textContent = `Linear scan: ${linearSteps} comparisons from the start.`;
      oBinText.textContent = `Binary search: ${binarySteps} comparisons after halving each time.`;
      chipRow.innerHTML = '';
      for (const v of sorted) {
        chipRow.appendChild(ui.h('span', {
          class: 'search-chip' + (v === target ? ' hit' : '')
        }, String(v)));
      }
    }

    rebuildSearch();

    const fit = ui.fitCanvas(canvas);
    const ctx = fit.ctx;

    const chartCanvas = ui.h('canvas', { class: 'mini-chart' });

    /* ---------- control ---------- */
    function reset() {
      base = shuffled(n);
      for (const lane of lanes) {
        lane.arr = base.slice();
        lane.gen = ALGOS[lane.algo].gen(lane.arr);
        lane.comps = 0;
        lane.swaps = 0;
        lane.done = false;
        lane.line = 0;
        lane.hl = [];
      }
      running = true;
      chartDirty = true;
    }

    function advance(lane) {
      let k = 0;
      while (k < budget && !lane.done) {
        const r = lane.gen.next();
        if (r.done) { lane.done = true; lane.hl = []; break; }
        const s = r.value;
        if (typeof s.line === 'number') lane.line = s.line;
        lane.hl = s.hl || [];
        if (s.cmp) lane.comps++;
        if (s.swap) lane.swaps++;
        k++;
      }
    }

    function finished() {
      records.push({ n, a: lanes[0].algo, ca: lanes[0].comps, b: lanes[1].algo, cb: lanes[1].comps });
      if (records.length > 24) records.shift();
      chartDirty = true;
      running = false;
    }

    /* ---------- draw ---------- */
    function drawLane(lane, x0, w, h) {
      const a = lane.arr;
      const nn = a.length || 1;
      const pad = 2;
      const bw = Math.max(1, (w - pad * 2) / nn);
      const baseY = h - 34;
      const topY = 40;
      const span = baseY - topY;

      for (let i = 0; i < nn; i++) {
        const v = a[i] / nn;
        const bh = Math.max(1, v * span);
        const hi = lane.hl.indexOf(i) >= 0;
        const done = lane.done;

        ctx.fillStyle = done
          ? 'rgba(61,220,151,0.78)'
          : hi
            ? '#ffffff'
            : 'rgba(129,140,248,0.62)';
        ctx.fillRect(x0 + pad + i * bw, baseY - bh, Math.max(1, bw - 1), bh);
      }

      /* label */
      ctx.font = '11px -apple-system, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(233,239,247,0.86)';
      ctx.fillText(ALGOS[lane.algo].name, x0 + pad, 18);

      ctx.font = '10.5px ui-monospace, monospace';
      ctx.fillStyle = 'rgba(159,176,196,0.85)';
      ctx.fillText(`${lane.comps} comparisons · ${lane.swaps} swaps`, x0 + pad, 32);

      /* pseudocode */
      const code = ALGOS[lane.algo].code;
      ctx.font = '9.5px ui-monospace, monospace';
      for (let i = 0; i < code.length; i++) {
        const active = !lane.done && i === lane.line;
        ctx.fillStyle = active ? 'rgba(255,255,255,0.92)' : 'rgba(159,176,196,0.4)';
        ctx.fillText(code[i], x0 + pad, baseY + 16 + i * 12);
      }
    }

    function draw() {
      const W = fit.size.w, H = fit.size.h;
      ctx.setTransform(fit.size.dpr, 0, 0, fit.size.dpr, 0, 0);
      ctx.fillStyle = '#080a0f';
      ctx.fillRect(0, 0, W, H);

      const half = W / 2;
      drawLane(lanes[0], 8, half - 16, H);
      drawLane(lanes[1], half + 8, half - 16, H);

      ctx.strokeStyle = 'rgba(255,255,255,0.09)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(half, 16);
      ctx.lineTo(half, H - 8);
      ctx.stroke();
    }

    function drawChart() {
      const w = 264, h = 104;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      chartCanvas.width = w * dpr;
      chartCanvas.height = h * dpr;
      const c = chartCanvas.getContext('2d');
      c.setTransform(dpr, 0, 0, dpr, 0, 0);

      c.fillStyle = 'rgba(255,255,255,0.02)';
      c.fillRect(0, 0, w, h);

      const maxN = Math.max(40, ...records.map((r) => r.n));
      const maxC = Math.max(60, ...records.flatMap((r) => [r.ca, r.cb]));
      const X = (v) => 6 + (v / maxN) * (w - 14);
      const Y = (v) => h - 8 - (v / maxC) * (h - 18);

      c.strokeStyle = 'rgba(255,255,255,0.1)';
      c.beginPath();
      c.moveTo(6, h - 8);
      c.lineTo(w - 8, h - 8);
      c.moveTo(6, 8);
      c.lineTo(6, h - 8);
      c.stroke();

      /* n log n reference */
      c.strokeStyle = 'rgba(255,255,255,0.16)';
      c.setLineDash([3, 4]);
      c.beginPath();
      for (let i = 1; i <= maxN; i++) {
        const v = i * Math.log2(Math.max(2, i)) * 0.9;
        const px = X(i), py = Y(v);
        if (i === 1) c.moveTo(px, py); else c.lineTo(px, py);
      }
      c.stroke();
      c.setLineDash([]);

      for (const r of records) {
        c.fillStyle = 'rgba(129,140,248,0.9)';
        c.beginPath();
        c.arc(X(r.n), Y(r.ca), 2.4, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = 'rgba(61,220,151,0.9)';
        c.beginPath();
        c.arc(X(r.n), Y(r.cb), 2.4, 0, Math.PI * 2);
        c.fill();
      }

      c.font = '8.5px -apple-system, system-ui, sans-serif';
      c.fillStyle = 'rgba(159,176,196,0.7)';
      c.fillText('comparisons vs n', 8, 11);
      c.fillStyle = 'rgba(129,140,248,0.9)';
      c.fillText(ALGOS[lanes[0].algo].name, w - 78, 11);
      c.fillStyle = 'rgba(61,220,151,0.9)';
      c.fillText(ALGOS[lanes[1].algo].name, w - 30, 11);
    }

    /* ---------- coach ---------- */
    const oA = ui.obs('Comparisons · ' + ALGOS[lanes[0].algo].name, '');
    const oB = ui.obs('Comparisons · ' + ALGOS[lanes[1].algo].name, '');
    const oBest = ui.obs('Best at 32', '');

    const segA = ui.segmented(
      NAMES.map((k) => ({ id: k, label: ALGOS[k].name })),
      lanes[0].algo,
      (id) => { lanes[0].algo = id; reset(); paintLabels(); }
    );
    const segB = ui.segmented(
      NAMES.map((k) => ({ id: k, label: ALGOS[k].name })),
      lanes[1].algo,
      (id) => { lanes[1].algo = id; reset(); paintLabels(); }
    );

    function paintLabels() {
      const labelA = ALGOS[lanes[0].algo].name;
      const labelB = ALGOS[lanes[1].algo].name;
      oA.el.querySelector('.k').textContent = 'Comparisons · ' + labelA;
      oB.el.querySelector('.k').textContent = 'Comparisons · ' + labelB;
    }

    const sSize = ui.slider({
      label: 'Array size', min: 8, max: 64, step: 1, value: n,
      format: (v) => `${Math.round(v)}`,
      onInput: (v) => { n = Math.round(v); reset(); }
    });

    const sSpeed = ui.slider({
      label: 'Steps per frame', min: 1, max: 40, step: 1, value: budget,
      format: (v) => `${Math.round(v)}`,
      onInput: (v) => { budget = Math.round(v); }
    });

    const g = ui.goal(
      'At size <b>32</b>, sort the array in under <b>220</b> comparisons.',
      () => {
        let best = Infinity;
        for (const r of records) {
          if (r.n === 32) {
            if (r.a !== 'bubble') best = Math.min(best, r.ca);
            if (r.b !== 'bubble') best = Math.min(best, r.cb);
          }
        }
        bestComps = best;
        return {
          done: best < 220,
          progress: best === Infinity ? 'no run at 32 yet' : `${best} comparisons`
        };
      }
    );

    coach.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Computer science · algorithms'));
    coach.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Sorting is a race you can time'));
    coach.appendChild(ui.h('p', { class: 'lesson-body' },
      'Both lanes get the same shuffled array. They will both finish correct — the question is what they spend getting there. Watch the comparison counter, not the bars.'));

    coach.appendChild(ui.section('Goal', g.el));
    coach.appendChild(ui.section('Observables', ui.obsList(oA, oB, oBest)));
    coach.appendChild(ui.section('Lane A', segA));
    coach.appendChild(ui.section('Lane B', segB));
    coach.appendChild(ui.section('Controls', ui.controls(
      sSize.el,
      sSpeed.el,
      ui.buttonRow(
        ui.button('Run', () => reset(), 'accent'),
        ui.button('Restart', () => { records.length = 0; reset(); })
      )
    )));
    coach.appendChild(ui.section('Complexity', chartCanvas));
    coach.appendChild(ui.h('div', { class: 'hairline' }));
    coach.appendChild(ui.note(
      'The dashed curve is <b>n log n</b>. The dots are comparisons the two algorithms actually counted — the curve is a measurement here, not a definition.'));

    /* ---- wrap the sorting coach, then add the searching one ---- */
    const coachSort = ui.h('div', { class: 'instrument-pane' });
    while (coach.firstChild) coachSort.appendChild(coach.firstChild);
    const coachSearch = ui.h('div', { class: 'instrument-pane', style: { display: 'none' } });
    coach.appendChild(coachSort);
    coach.appendChild(coachSearch);

    const oLinear = ui.obs('Linear steps', '');
    const oBinary = ui.obs('Binary steps', '');
    const sSearchSize = ui.slider({
      label: 'Search size', min: 8, max: 64, step: 1, value: searchSize,
      format: (v) => String(Math.round(v)),
      onInput: (v) => { searchSize = Math.round(v); rebuildSearch(); paintSearch(); }
    });
    const sTarget = ui.slider({
      label: 'Target value', min: 2, max: 128, step: 2, value: target,
      format: (v) => String(Math.round(v)),
      onInput: (v) => { target = Math.round(v); paintSearch(); }
    });
    const sg = ui.goal(
      'Find the target in at most <b>7</b> binary comparisons.',
      () => ({ done: binarySteps <= 7, progress: `${binarySteps} binary comparisons` }),
      'search'
    );
    coachSearch.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Computer science · searching'));
    coachSearch.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Halving beats scanning'));
    coachSearch.appendChild(ui.h('p', { class: 'lesson-body' },
      'The array is sorted. One method walks from the start; the other discards half the remaining list on every comparison.'));
    coachSearch.appendChild(ui.section('Goal', sg.el));
    coachSearch.appendChild(ui.section('Observables', ui.obsList(oLinear, oBinary)));
    coachSearch.appendChild(ui.section('Controls', ui.controls(sSearchSize.el, sTarget.el)));
    coachSearch.appendChild(ui.h('div', { class: 'hairline' }));
    coachSearch.appendChild(ui.note(
      'The list is sorted and the target is always present, so both comparison counts are exact — not samples.'));

    function setInstrument(id) {
      instrument = id;
      paneSort.style.display = id === 'sort' ? '' : 'none';
      paneSearch.style.display = id === 'search' ? '' : 'none';
      coachSort.style.display = id === 'sort' ? '' : 'none';
      coachSearch.style.display = id === 'search' ? '' : 'none';
      switchSeg.select(id);
      contract.selectInstrument(id);
      if (id === 'search') paintSearch(); else { fit.resize(); draw(); }
      contract.useGoal(id);
    }
    const switchSeg = ui.segmented(
      [{ id: 'sort', label: 'Sorting' }, { id: 'search', label: 'Searching' }],
      'sort', setInstrument);
    coach.appendChild(switchSeg);
    contract.registerInstrument({ id: 'sort', activate: () => setInstrument('sort') });
    contract.registerInstrument({ id: 'search', activate: () => setInstrument('search') });

    /* ---------- loop ---------- */
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);

    reset();

    const stop = ui.addTicker(() => {
      if (instrument === 'sort') {
        if (running) {
          advance(lanes[0]);
          advance(lanes[1]);
          if (lanes[0].done && lanes[1].done) finished();
        }
        draw();
        if (chartDirty) { drawChart(); chartDirty = false; }

        oA.set(String(lanes[0].comps));
        oB.set(String(lanes[1].comps));
        oBest.set(bestComps === Infinity ? '—' : String(bestComps));
        g.update();
        api.markDone(g.done);
        return;
      }
      oLinear.set(String(linearSteps));
      oBinary.set(String(binarySteps));
      sg.update();
      api.markDone(sg.done);
    });

    return () => { stop(); ro.disconnect(); fit.destroy(); };
  }
};
