/* ==========================================================================
   Maths — linked representations: equation, curve, unit circle
   ========================================================================== */

import * as ui from '../ui.js';

export default {
  id: 'maths',
  name: 'Maths',
  sub: 'Functions',
  accent: '#a78bfa',
  glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M4.5 20V4.5M4.5 20h15"/>
    <path d="M6.5 15.5c2.4-7 6.2-7 8.6 0s6.2 7 8.6 0" opacity=".9"/>
  </svg>`,

  mount(stage, coach, api) {
    let a = 1, b = 1, c = 0, d = 0;
    let showDeriv = false;
    let hoverX = null;

    /* ---------- instruments ---------- */
    let instrument = 'wave';

    const paneWave = ui.h('div', { class: 'stage-pane' });
    const host = ui.h('div', { class: 'canvas-host' });
    const canvas = ui.h('canvas');
    host.appendChild(canvas);
    paneWave.appendChild(host);

    const badge = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge' },
        ui.h('span', { class: 'led' }), 'y = a · sin(bx + c) + d'));
    paneWave.appendChild(badge);
    stage.appendChild(paneWave);

    const fit = ui.fitCanvas(canvas);
    const ctx = fit.ctx;

    const paneBlocks = ui.h('div', { class: 'stage-pane' });
    paneBlocks.style.display = 'none';
    const bCanvas = ui.h('canvas');
    paneBlocks.appendChild(bCanvas);
    paneBlocks.appendChild(ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge' },
        ui.h('span', { class: 'led' }), 'tap a dot to move it on')));
    stage.appendChild(paneBlocks);

    const bFit = ui.fitCanvas(bCanvas);
    const bCtx = bFit.ctx;

    const f = (x) => a * Math.sin(b * x + c) + d;
    const df = (x) => a * b * Math.cos(b * x + c);

    function draw() {
      const W = fit.size.w, H = fit.size.h;
      const padL = 40, padR = 24, padT = 44, padB = 34;
      const plotW = Math.max(10, W - padL - padR);
      const plotH = Math.max(10, H - padT - padB);

      const xMin = -Math.PI * 2, xMax = Math.PI * 2;
      const yMax = Math.max(2.2, Math.abs(a) + Math.abs(d) + 0.8);
      const yMin = -yMax;

      const X = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
      const Y = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

      ctx.setTransform(fit.size.dpr, 0, 0, fit.size.dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#080a0f';
      ctx.fillRect(0, 0, W, H);

      /* grid — every π/2 */
      ctx.lineWidth = 1;
      for (let k = -4; k <= 4; k++) {
        const gx = X((k * Math.PI) / 2);
        ctx.strokeStyle = k === 0 ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.055)';
        ctx.beginPath();
        ctx.moveTo(gx, padT);
        ctx.lineTo(gx, padT + plotH);
        ctx.stroke();
      }

      /* horizontal grid */
      const stepY = yMax > 4 ? 2 : 1;
      for (let y = Math.ceil(yMin / stepY) * stepY; y <= yMax; y += stepY) {
        const gy = Y(y);
        ctx.strokeStyle = Math.abs(y) < 1e-9 ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.055)';
        ctx.beginPath();
        ctx.moveTo(padL, gy);
        ctx.lineTo(padL + plotW, gy);
        ctx.stroke();
        if (Math.abs(y) > 1e-9) {
          ctx.fillStyle = 'rgba(255,255,255,0.28)';
          ctx.font = '9.5px -apple-system, system-ui, sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(String(y), padL - 7, gy + 3);
        }
      }

      /* x labels in multiples of π/2 */
      const labels = [
        [-2, '−2π'], [-1.5, '−3π/2'], [-1, '−π'], [-0.5, '−π/2'],
        [0, '0'], [0.5, 'π/2'], [1, 'π'], [1.5, '3π/2'], [2, '2π']
      ];
      ctx.fillStyle = 'rgba(255,255,255,0.30)';
      ctx.font = '9.5px -apple-system, system-ui, sans-serif';
      ctx.textAlign = 'center';
      for (const [k, txt] of labels) {
        ctx.fillText(txt, X(k * Math.PI), padT + plotH + 15);
      }

      /* amplitude guides */
      if (Math.abs(a) > 0.02) {
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = 'rgba(167,139,250,0.34)';
        for (const sign of [1, -1]) {
          const gy = Y(d + sign * a);
          ctx.beginPath();
          ctx.moveTo(padL, gy);
          ctx.lineTo(padL + plotW, gy);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      /* derivative */
      if (showDeriv) {
        ctx.beginPath();
        for (let px = 0; px <= plotW; px += 1) {
          const x = xMin + (px / plotW) * (xMax - xMin);
          const y = df(x);
          const py = Y(ui.clamp(y, yMin, yMax));
          if (px === 0) ctx.moveTo(padL + px, py); else ctx.lineTo(padL + px, py);
        }
        ctx.strokeStyle = 'rgba(167,139,250,0.34)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      /* the curve */
      ctx.beginPath();
      for (let px = 0; px <= plotW; px += 0.75) {
        const x = xMin + (px / plotW) * (xMax - xMin);
        const y = ui.clamp(f(x), yMin, yMax);
        const sx = padL + px, sy = Y(y);
        if (px === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(167,139,250,0.55)';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      /* zero crossings */
      for (let k = -4; k <= 4; k++) {
        const mid = (k * Math.PI) / 2;
        const lo = mid - 0.42, hi = mid + 0.42;
        let prev = f(lo), prevX = lo;
        for (let i = 1; i <= 24; i++) {
          const x = lo + ((hi - lo) * i) / 24;
          const v = f(x);
          if (prev === 0 || (prev < 0) !== (v < 0)) {
            const t = Math.abs(prev) / (Math.abs(prev) + Math.abs(v) || 1);
            const zx = prevX + (x - prevX) * t;
            ctx.beginPath();
            ctx.arc(X(zx), Y(0), 2.1, 0, Math.PI * 2);
            ctx.fillStyle = '#0b0e14';
            ctx.fill();
            ctx.strokeStyle = 'rgba(167,139,250,0.9)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
          prev = v; prevX = x;
        }
      }

      /* hover crosshair */
      if (hoverX !== null) {
        const x = xMin + (ui.clamp(hoverX, padL, padL + plotW) - padL) / plotW * (xMax - xMin);
        const y = f(x);
        const sx = X(x), sy = Y(ui.clamp(y, yMin, yMax));
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx, padT);
        ctx.lineTo(sx, padT + plotH);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(sx, sy, 3.6, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        const txt = `(${(x / Math.PI).toFixed(2)}π, ${y.toFixed(2)})`;
        ctx.font = '11px ui-monospace, monospace';
        ctx.fillStyle = 'rgba(233,239,247,0.85)';
        ctx.textAlign = sx > padL + plotW * 0.7 ? 'right' : 'left';
        ctx.fillText(txt, sx + (sx > padL + plotW * 0.7 ? -10 : 10), padT + 14);
      }
    }

    canvas.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      hoverX = e.clientX - r.left;
    });
    canvas.addEventListener('pointerleave', () => { hoverX = null; });

    /* ---------- blocks: counting and sharing ---------- */
    let bObjects = 12;
    let bGroupCount = 4;
    let bAssign = new Array(bObjects).fill(0);
    const bPos = [];

    const BLOCK_COLOURS = ['#2a3441', '#a78bfa', '#5ac8fa', '#3ddc97', '#f5b83d', '#fb7185', '#a3e635'];

    function blockCounts() {
      const out = new Array(bGroupCount + 1).fill(0);
      for (const a of bAssign) if (a > 0) out[a]++;
      return out;
    }

    function blocksPlaced() {
      let n = 0;
      for (const a of bAssign) if (a > 0) n++;
      return n;
    }

    function blocksEven() {
      const used = blockCounts().slice(1);
      if (blocksPlaced() !== bObjects || bObjects <= 0) return false;
      return Math.max(...used) === Math.min(...used);
    }

    function layoutDots(list, x0, y0, w, h, r) {
      if (!list.length) return;
      const sx = r * 2.9;
      const cols = Math.max(1, Math.min(list.length, Math.floor(w / sx)));
      const rows = Math.ceil(list.length / cols);
      const sy = Math.max(r * 2.2, Math.min(sx, h / rows));
      const offY = y0 + (h - (rows - 1) * sy) / 2;

      for (let k = 0; k < list.length; k++) {
        const row = Math.floor(k / cols);
        const start = row * cols;
        const inRow = Math.min(cols, list.length - start);
        const offX = x0 + (w - (inRow - 1) * sx) / 2;
        bPos[list[k]] = {
          x: offX + (k - start) * sx,
          y: offY + row * sy
        };
      }
    }

    function roundedRect(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
    }

    function drawBlocks() {
      const W = bFit.size.w, H = bFit.size.h;

      bCtx.setTransform(bFit.size.dpr, 0, 0, bFit.size.dpr, 0, 0);
      bCtx.clearRect(0, 0, W, H);
      bCtx.fillStyle = '#080a0f';
      bCtx.fillRect(0, 0, W, H);

      const pad = 16;
      const trayTop = Math.max(104, H * 0.34);
      const trayH = Math.max(58, H - trayTop - pad - 16);
      const gap = 7;
      const trayW = Math.max(24, (W - pad * 2 - gap * (bGroupCount - 1)) / bGroupCount);
      const r = Math.max(4, Math.min(9, Math.min(W, H) / 30));

      const counts = blockCounts();
      const pile = [];
      const trays = [];
      for (let g = 0; g < bGroupCount; g++) trays.push([]);

      for (let i = 0; i < bObjects; i++) {
        const a = bAssign[i];
        if (a > 0 && trays[a - 1]) trays[a - 1].push(i);
        else pile.push(i);
      }

      layoutDots(pile, pad, 30, W - pad * 2, trayTop - 44, r);

      bCtx.font = '10px -apple-system, system-ui, sans-serif';
      bCtx.textAlign = 'left';
      bCtx.fillStyle = 'rgba(255,255,255,0.3)';
      bCtx.fillText(pile.length
        ? 'unplaced — tap a dot to move it into a group'
        : 'all placed', pad, 20);

      for (let g = 0; g < bGroupCount; g++) {
        const x = pad + g * (trayW + gap);

        roundedRect(bCtx, x, trayTop, trayW, trayH, 11);
        bCtx.fillStyle = 'rgba(255,255,255,0.035)';
        bCtx.fill();
        bCtx.strokeStyle = 'rgba(255,255,255,0.09)';
        bCtx.lineWidth = 1;
        bCtx.stroke();

        bCtx.beginPath();
        bCtx.arc(x + 13, trayTop + 15, 3, 0, Math.PI * 2);
        bCtx.fillStyle = BLOCK_COLOURS[(g + 1) % BLOCK_COLOURS.length];
        bCtx.fill();

        bCtx.fillStyle = 'rgba(255,255,255,0.42)';
        bCtx.fillText(String(counts[g + 1]), x + 21, trayTop + 19);

        layoutDots(trays[g], x + 6, trayTop + 26, trayW - 12, trayH - 34, r);
      }

      for (let i = 0; i < bObjects; i++) {
        const p = bPos[i];
        if (!p) continue;
        bCtx.beginPath();
        bCtx.arc(p.x, p.y, r, 0, Math.PI * 2);
        bCtx.fillStyle = BLOCK_COLOURS[bAssign[i] % BLOCK_COLOURS.length];
        bCtx.fill();
      }
    }

    bCanvas.addEventListener('pointerdown', (e) => {
      if (instrument !== 'blocks') return;
      const rect = bCanvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      let best = -1;
      let bestD = 28;
      for (let i = 0; i < bObjects; i++) {
        const p = bPos[i];
        if (!p) continue;
        const d = Math.hypot(p.x - px, p.y - py);
        if (d < bestD) { bestD = d; best = i; }
      }
      if (best < 0) return;

      bAssign[best] = (bAssign[best] + 1) % (bGroupCount + 1);
      drawBlocks();
    });

    /* ---------- coach ---------- */
    const formula = ui.h('div', {
      class: 'lesson-title',
      style: { fontFamily: 'var(--mono)', fontSize: '19px', marginBottom: '2px' }
    });
    const sub = ui.h('div', { style: { fontSize: '12px', color: 'var(--ink-3)' } });

    function paintFormula() {
      const inner = `${b === 1 ? '' : b}x${c === 0 ? '' : c > 0 ? ` + ${c.toFixed(2)}` : ` − ${Math.abs(c).toFixed(2)}`}`;
      const coef = a === 1 ? '' : a === -1 ? '−' : String(a);
      formula.textContent = `y = ${coef}sin(${inner})${d === 0 ? '' : d > 0 ? ` + ${d}` : ` − ${Math.abs(d)}`}`;
      const period = b === 0 ? Infinity : (Math.PI * 2) / Math.abs(b);
      sub.textContent = `period ${period === Infinity ? '—' : (period / Math.PI).toFixed(2) + 'π'} · amplitude ${Math.abs(a).toFixed(2)}`;
    }
    paintFormula();

    const oAmp = ui.obs('Amplitude', '');
    const oPeriod = ui.obs('Period', '');
    const oRange = ui.obs('Range', '');
    const oSlope = ui.obs('Max slope', '');

    const sA = ui.slider({
      label: 'Amplitude  a', min: -3, max: 3, step: 0.05, value: a,
      format: (v) => v.toFixed(2), onInput: (v) => { a = v; paintFormula(); }
    });
    const sB = ui.slider({
      label: 'Frequency  b', min: 0.25, max: 4, step: 0.05, value: b,
      format: (v) => v.toFixed(2), onInput: (v) => { b = v; paintFormula(); }
    });
    const sC = ui.slider({
      label: 'Phase  c', min: -3.2, max: 3.2, step: 0.05, value: c,
      format: (v) => (v / Math.PI).toFixed(2) + 'π', onInput: (v) => { c = v; paintFormula(); }
    });
    const sD = ui.slider({
      label: 'Shift  d', min: -2, max: 2, step: 0.05, value: d,
      format: (v) => v.toFixed(2), onInput: (v) => { d = v; paintFormula(); }
    });

    const tDeriv = ui.toggleRow('Show the derivative', false, (v) => { showDeriv = v; });

    const g = ui.goal(
      'Make the period exactly <b>π</b> — with amplitude <b>2</b>.',
      () => {
        const period = (Math.PI * 2) / Math.abs(b);
        const okP = Math.abs(period - Math.PI) < 0.03;
        const okA = Math.abs(Math.abs(a) - 2) < 0.03;
        return {
          done: okP && okA,
          progress: goodText(okP, okA)
        };
      },
      'wave'
    );

    function goodText(okP, okA) {
      if (okP && okA) return 'Both solved.';
      if (!okP && !okA) return 'Two things to tune.';
      return okP ? 'Amplitude still open.' : 'Period still open.';
    }

    /* ---------- blocks controls ---------- */
    const oBPer = ui.obs('Per group', '');
    const oBSpread = ui.obs('Spread', '');
    const oBPlaced = ui.obs('Placed', '');

    const sObjects = ui.slider({
      label: 'Objects', min: 4, max: 24, step: 1, value: bObjects,
      format: (v) => String(Math.round(v)),
      onInput: (v) => {
        bObjects = Math.round(v);
        bAssign = new Array(bObjects).fill(0);
        bPos.length = 0;
        drawBlocks();
      }
    });

    const sGroups = ui.slider({
      label: 'Groups', min: 2, max: 6, step: 1, value: bGroupCount,
      format: (v) => String(Math.round(v)),
      onInput: (v) => {
        bGroupCount = Math.round(v);
        bAssign = bAssign.map((x) => (x > bGroupCount ? 0 : x));
        bPos.length = 0;
        drawBlocks();
      }
    });

    const bg = ui.goal(
      'Share them so every group holds <b>the same number</b>, with none left over.',
      () => {
        const placed = blocksPlaced();
        if (placed !== bObjects) {
          return { done: false, progress: `${placed} of ${bObjects} placed` };
        }
        if (!blocksEven()) return { done: false, progress: 'The groups are uneven.' };
        return { done: true, progress: `${bObjects} ÷ ${bGroupCount}` };
      },
      'blocks'
    );

    /* ---------- coach panes ---------- */
    const coachWave = ui.h('div', { class: 'pane' });
    const coachBlocks = ui.h('div', { class: 'pane' });
    coachBlocks.style.display = 'none';

    function setInstrument(id) {
      instrument = id;
      paneWave.style.display = id === 'wave' ? '' : 'none';
      paneBlocks.style.display = id === 'blocks' ? '' : 'none';
      coachWave.style.display = id === 'wave' ? '' : 'none';
      coachBlocks.style.display = id === 'blocks' ? '' : 'none';
      switchSeg.select(id);
      if (id === 'blocks') { bFit.resize(); drawBlocks(); } else { fit.resize(); }
      contract.useGoal(id);
    }

    const switchSeg = ui.segmented([
      { id: 'wave', label: 'Waves' },
      { id: 'blocks', label: 'Sharing' }
    ], 'wave', (id) => setInstrument(id));

    contract.registerInstrument({ id: 'wave', activate: () => setInstrument('wave') });
    contract.registerInstrument({ id: 'blocks', activate: () => setInstrument('blocks') });

    coach.appendChild(switchSeg);

    coachWave.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Maths · trigonometry'));
    coachWave.appendChild(ui.h('h2', { class: 'lesson-title' }, 'What a wave is made of'));
    coachWave.appendChild(formula);
    coachWave.appendChild(sub);
    coachWave.appendChild(ui.h('p', { class: 'lesson-body', style: { marginTop: '12px' } },
      'Every parameter is a physical thing. <strong>a</strong> is how far it swings, <strong>b</strong> is how fast it repeats, <strong>c</strong> slides it in time, <strong>d</strong> lifts the whole thing. Change one and watch what the others do.'));

    coachWave.appendChild(ui.section('Goal', g.el));
    coachWave.appendChild(ui.section('Observables', ui.obsList(oAmp, oPeriod, oRange, oSlope)));
    coachWave.appendChild(ui.section('Controls',
      ui.controls(sA.el, sB.el, sC.el, sD.el, tDeriv)));

    coachWave.appendChild(ui.h('div', { class: 'hairline' }));
    coachWave.appendChild(ui.note(
      'Drag across the plot to read exact values. The same curve appears in the physics world as a light wave and in the music world as a pitch — <b>one pattern, three rooms</b>.'));

    coachBlocks.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Maths · counting and sharing'));
    coachBlocks.appendChild(ui.h('h2', { class: 'lesson-title' }, 'The same number in every group'));
    coachBlocks.appendChild(ui.h('p', { class: 'lesson-body' },
      'Put the things into groups so that no group is bigger than another and nothing is left over. That is division, and it is the only kind of sharing that stays fair as the numbers grow.'));

    coachBlocks.appendChild(ui.section('Goal', bg.el));
    coachBlocks.appendChild(ui.section('Observables', ui.obsList(oBPer, oBSpread, oBPlaced)));
    coachBlocks.appendChild(ui.section('Controls', ui.controls(sObjects.el, sGroups.el)));

    coachBlocks.appendChild(ui.h('div', { class: 'hairline' }));
    coachBlocks.appendChild(ui.note(
      'Tap a dot to move it into the next group; tap it again to move it on, and past the last group it returns to the pile. A remainder is the honest answer when the number will not divide.'));

    coach.appendChild(coachWave);
    coach.appendChild(coachBlocks);

    contract.useGoal('wave');
    drawBlocks();

    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);

    const bRo = new ResizeObserver(() => drawBlocks());
    bRo.observe(bCanvas);

    const stop = ui.addTicker(() => {
      if (instrument === 'wave') {
        draw();
        g.update();
        const period = (Math.PI * 2) / Math.abs(b);
        oAmp.set(Math.abs(a).toFixed(2));
        oPeriod.set((period / Math.PI).toFixed(2) + 'π', Math.abs(period - Math.PI) < 0.03);
        oRange.set(`${(d - Math.abs(a)).toFixed(2)} … ${(d + Math.abs(a)).toFixed(2)}`);
        oSlope.set(Math.abs(a * b).toFixed(2));
        api.markDone(g.done);
        return;
      }

      drawBlocks();
      bg.update();
      const counts = blockCounts().slice(1);
      const placed = blocksPlaced();
      const even = blocksEven();
      const min = Math.min(...counts);
      const max = Math.max(...counts);
      oBPer.set(even ? String(max) : '—', even);
      oBSpread.set(String(max - min), max === min);
      oBPlaced.set(`${placed} of ${bObjects}`);
      api.markDone(bg.done);
    });

    return () => {
      stop();
      ro.disconnect();
      bRo.disconnect();
      fit.destroy();
      bFit.destroy();
    };
  }
};
