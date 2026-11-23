/* ==========================================================================
   Engineering — a real truss solver you can break
   ========================================================================== */

import * as ui from '../ui.js';
import * as contract from '../contract.js';
import * as profile from '../profile.js';

const NODES = [
  [0, 0], [2, 0], [4, 0], [6, 0], [8, 0],
  [1, 1.4], [3, 1.4], [5, 1.4], [7, 1.4]
];

/* i, j, group */
const MEMBERS = [
  [0, 1, 'bottom'], [1, 2, 'bottom'], [2, 3, 'bottom'], [3, 4, 'bottom'],
  [5, 6, 'top'], [6, 7, 'top'], [7, 8, 'top'],
  [0, 5, 'diag'], [5, 1, 'diag'], [1, 6, 'diag'], [6, 2, 'diag'],
  [2, 7, 'diag'], [7, 3, 'diag'], [3, 8, 'diag'], [8, 4, 'diag']
];

const LENGTHS = MEMBERS.map(([i, j]) => {
  const dx = NODES[j][0] - NODES[i][0];
  const dy = NODES[j][1] - NODES[i][1];
  return Math.hypot(dx, dy);
});

const LOAD = 20000;      // N, downward at node 2
const YIELD = 250;       // MPa
const DENSITY = 7850;    // kg/m³
const PRICE = 2;         // $ per kg

function gaussSolve(A, b) {
  const n = b.length;
  const M = A.map((row, i) => row.concat([b[i]]));

  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) {
      if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    }
    if (Math.abs(M[p][c]) < 1e-9) return null;
    const t = M[c]; M[c] = M[p]; M[p] = t;

    const piv = M[c][c];
    for (let r = c + 1; r < n; r++) {
      const f = M[r][c] / piv;
      if (!f) continue;
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }

  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let s = M[r][n];
    for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k];
    x[r] = s / M[r][r];
  }
  return x;
}

export default {
  id: 'eng',
  name: 'Build',
  sub: 'Structures',
  accent: '#94a3b8',
  fade: false,
  glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3.5 18.5h17"/>
    <path d="M5 18.5v-1M19 18.5v-1"/>
    <path d="M5 17.5l3.5-7 3.5 7 3.5-7 3.5 7"/>
    <path d="M8.5 10.5h7"/>
  </svg>`,

  mount(stage, coach, api) {
    const areas = { bottom: 200, top: 150, diag: 120 };
    let forces = new Array(MEMBERS.length).fill(0);
    let maxStress = 0;
    let cost = 0;
    let collapsed = false;
    let governing = 'bottom';
    let utilization = 0;
    const groupPeak = { bottom: 0, top: 0, diag: 0 };

    const host = ui.h('div', { class: 'canvas-host' });
    const canvas = ui.h('canvas');
    host.appendChild(canvas);
    stage.appendChild(host);

    const badge = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge' }, ui.h('span', { class: 'led' }), 'Method of joints · 18 equations'));
    stage.appendChild(badge);

    /* Wrap the truss surface into one switchable pane. */
    const panePrimary = ui.h('div', { class: 'stage-pane' });
    while (stage.firstChild) panePrimary.appendChild(stage.firstChild);
    stage.appendChild(panePrimary);

    /* ---- second instrument: compare three materials ---- */
    const MATERIALS = [
      { name: 'Steel', factor: 3, density: 7.8 },
      { name: 'Aluminium', factor: 1.7, density: 2.7 },
      { name: 'Wood', factor: 0.8, density: 0.6 }
    ];
    let instrument = 'eng';
    let memberWidth = 40;
    let material = 0;
    let yieldLoad = 0;
    let massPerMetre = 0;
    let strengthToWeight = 0;

    const paneSecond = ui.h('div', { class: 'stage-pane secondary-pane', style: { display: 'none' } });
    const secondHead = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge' }, ui.h('span', { class: 'led' }), 'Materials · a simple trade-off'));
    const widthLine = ui.h('div', { class: 'sec-line' });
    const loadLine = ui.h('div', { class: 'sec-line' });
    const materialGrid = ui.h('div', { class: 'sec-grid' });
    const materialCells = MATERIALS.map((m) => ui.h('div', { class: 'sec-cell' }, m.name));
    for (const cell of materialCells) materialGrid.appendChild(cell);
    paneSecond.appendChild(secondHead);
    paneSecond.appendChild(widthLine);
    paneSecond.appendChild(loadLine);
    paneSecond.appendChild(materialGrid);
    stage.appendChild(paneSecond);

    function paintSecond() {
      const mat = MATERIALS[material];
      yieldLoad = memberWidth * mat.factor;
      massPerMetre = memberWidth * mat.density;
      strengthToWeight = massPerMetre > 0 ? yieldLoad / massPerMetre : 0;
      widthLine.textContent = `${mat.name} · width ${memberWidth}.`;
      loadLine.textContent = `Yield load ${yieldLoad.toFixed(1)} · mass per metre ${massPerMetre.toFixed(1)} · strength to weight ${strengthToWeight.toFixed(2)}.`;
      materialCells.forEach((cell, i) => cell.classList.toggle('on', i === material));
    }

    paintSecond();

    const fit = ui.fitCanvas(canvas);
    const ctx = fit.ctx;

    function solve() {
      const n = 18;
      const A = Array.from({ length: n }, () => new Array(n).fill(0));
      const b = new Array(n).fill(0);

      MEMBERS.forEach(([i, j], m) => {
        const dx = NODES[j][0] - NODES[i][0];
        const dy = NODES[j][1] - NODES[i][1];
        const L = LENGTHS[m];
        const ux = dx / L;
        const uy = dy / L;

        A[2 * i][m] += ux;
        A[2 * i + 1][m] += uy;
        A[2 * j][m] -= ux;
        A[2 * j + 1][m] -= uy;
      });

      A[0][15] = 1;          // pin at node 0, x
      A[1][16] = 1;          // pin at node 0, y
      A[2 * 4 + 1][17] = 1;  // roller at node 4, y

      b[2 * 2 + 1] = LOAD;

      const x = gaussSolve(A, b);

      if (!x) {
        forces = forces.map(() => 0);
        maxStress = 0;
        collapsed = true;
        groupPeak.bottom = 0; groupPeak.top = 0; groupPeak.diag = 0;
        governing = 'bottom';
        utilization = 0;
        return;
      }

      forces = MEMBERS.map((_, m) => x[m]);
      groupPeak.bottom = 0; groupPeak.top = 0; groupPeak.diag = 0;
      let worst = 0;
      MEMBERS.forEach(([, , g], m) => {
        const s = Math.abs(forces[m]) / Math.max(1, areas[g]);
        if (s > groupPeak[g]) groupPeak[g] = s;
        if (s > worst) worst = s;
      });
      maxStress = worst;
      governing = groupPeak.bottom >= groupPeak.top && groupPeak.bottom >= groupPeak.diag
        ? 'bottom'
        : (groupPeak.top >= groupPeak.diag ? 'top' : 'diag');
      /* 1.00 means the governing member sits exactly at the FoS 2.5 allowable. */
      utilization = YIELD > 0 ? maxStress / (YIELD / 2.5) : 0;
      collapsed = worst > YIELD;

      cost = MEMBERS.reduce((sum, [, , g], m) => {
        const vol = LENGTHS[m] * areas[g] * 1e-6;
        return sum + vol * DENSITY * PRICE;
      }, 0);
    }

    function draw() {
      const W = fit.size.w, H = fit.size.h;
      ctx.setTransform(fit.size.dpr, 0, 0, fit.size.dpr, 0, 0);
      ctx.fillStyle = '#070a0e';
      ctx.fillRect(0, 0, W, H);

      const padX = 54, padY = 66;
      const plotW = W - padX * 2;
      const plotH = H - padY - 66;
      const sx = plotW / 8;
      const sy = plotH / 1.4;
      const scale = Math.min(sx, sy);

      const ox = padX + (plotW - 8 * scale) / 2;
      const oy = padY + (plotH - 1.4 * scale) / 2 + 1.4 * scale;

      const P = NODES.map(([x, y]) => [ox + x * scale, oy - y * scale]);

      /* ground */
      ctx.strokeStyle = 'rgba(255,255,255,0.14)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ox - 24, oy + 1);
      ctx.lineTo(ox + 8 * scale + 24, oy + 1);
      ctx.stroke();

      /* members */
      MEMBERS.forEach(([i, j, g], m) => {
        const f = forces[m];
        const stress = Math.abs(f) / Math.max(1, areas[g]);
        const ratio = ui.clamp(stress / YIELD, 0, 1);
        const tension = f >= 0;

        let col;
        if (ratio > 1) col = 'rgba(255,107,107,0.95)';
        else if (tension) col = `rgba(56,189,248,${0.32 + ratio * 0.68})`;
        else col = `rgba(251,113,133,${0.32 + ratio * 0.68})`;

        ctx.strokeStyle = col;
        ctx.lineWidth = 1 + ui.clamp(areas[g] / 220, 0.8, 3.4);
        ctx.beginPath();
        ctx.moveTo(P[i][0], P[i][1]);
        ctx.lineTo(P[j][0], P[j][1]);
        ctx.stroke();
      });

      /* nodes */
      for (const [x, y] of P) {
        ctx.beginPath();
        ctx.arc(x, y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = '#0b0f14';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      /* supports */
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.beginPath();
      ctx.moveTo(P[0][0], P[0][1]);
      ctx.lineTo(P[0][0] - 9, P[0][1] + 15);
      ctx.lineTo(P[0][0] + 9, P[0][1] + 15);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(P[4][0], P[4][1]);
      ctx.lineTo(P[4][0] - 9, P[4][1] + 13);
      ctx.lineTo(P[4][0] + 9, P[4][1] + 13);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(P[4][0] - 6, P[4][1] + 15);
      ctx.lineTo(P[4][0] + 6, P[4][1] + 15);
      ctx.stroke();

      /* load arrow */
      const lx = P[2][0], ly = P[2][1];
      ctx.strokeStyle = '#fbbf24';
      ctx.fillStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lx, ly - 54);
      ctx.lineTo(lx, ly - 8);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lx, ly - 2);
      ctx.lineTo(lx - 5, ly - 12);
      ctx.lineTo(lx + 5, ly - 12);
      ctx.closePath();
      ctx.fill();

      ctx.font = '10px -apple-system, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('20 kN', lx, ly - 60);

      /* legend */
      ctx.textAlign = 'left';
      ctx.font = '9.5px -apple-system, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(56,189,248,0.9)';
      ctx.fillText('tension', 16, H - 20);
      ctx.fillStyle = 'rgba(251,113,133,0.9)';
      ctx.fillText('compression', 72, H - 20);
      ctx.fillStyle = collapsed ? '#ff6b6b' : 'rgba(61,220,151,0.9)';
      ctx.fillText(collapsed ? 'over yield — failed' : 'holding', 168, H - 20);
    }

    /* ---------- coach ---------- */
    const oFos = ui.obs('Factor of safety', '');
    const oStress = ui.obs('Peak stress', 'MPa');
    const oCost = ui.obs('Material cost', '$');
    const oChord = ui.obs('Bottom chord force', 'kN');
    const oGov = ui.obs('Governing group', '');
    const oUtil = ui.obs('Peak utilisation', '%');

    const mk = (key, label, max) => ui.slider({
      label, min: 60, max: 900, step: 10, value: areas[key],
      format: (v) => Math.round(v) + ' mm²',
      onInput: (v) => { areas[key] = v; solve(); void max; }
    });

    const sBottom = mk('bottom', 'Bottom chord', 900);
    const sTop = mk('top', 'Top chord', 900);
    const sDiag = mk('diag', 'Diagonals', 900);

    const GOAL_COPY = {
      p: 'Keep it standing after you thin the bottom chord — FoS ≥ 1.2.',
      ls: 'Reach FoS ≥ 1.5 with the peak stress in the bottom chord.',
      us: 'Carry 20 kN with a factor of safety of <b>2.5</b> — for under <b>$95</b>.',
      uni: 'FoS 2.5 under $95 — and no group grossly overbuilt.'
    };

    function stageGoal() {
      const stage = profile.worldStage('eng');
      const fos = maxStress > 0 ? YIELD / maxStress : 0;
      const sound = !collapsed && maxStress > 0;
      let pass = false, progress = '';

      if (stage === 'p') {
        pass = sound && fos >= 1.2 && areas.bottom < areas.top;
        progress = `FoS ${fos.toFixed(2)} · bottom ${areas.bottom} mm² · top ${areas.top} mm²`;
      } else if (stage === 'ls') {
        pass = sound && fos >= 1.5 && governing === 'bottom';
        progress = `FoS ${fos.toFixed(2)} · peak in ${governing}`;
      } else if (stage === 'uni') {
        pass = sound && fos >= 2.5 && cost <= 95 && utilization >= 0.85;
        progress = `$${cost.toFixed(0)} · FoS ${fos.toFixed(2)} · critical ${governing} @ ${(utilization * 100).toFixed(0)}%`;
      } else {
        pass = sound && fos >= 2.5 && cost <= 95;
        progress = pass
          ? `Held · critical ${governing}`
          : `FoS ${fos.toFixed(2)} · $${cost.toFixed(0)} · limit ${governing}`;
      }
      return { stage, pass, progress };
    }

    let holdSince = 0;
    let lastStage = null;
    const g = ui.goal(
      '<span class="goal-copy">' + GOAL_COPY[profile.worldStage('eng')] + '</span>',
      () => {
        const s = stageGoal();
        if (!s.pass) { holdSince = 0; return { done: false, progress: s.progress }; }
        if (s.stage !== 'us' && s.stage !== 'uni') return { done: true, progress: s.progress };
        const now = performance.now();
        if (!holdSince) holdSince = now;
        return { done: now - holdSince >= 1500, progress: s.progress };
      }
    );

    coach.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Engineering · structures'));
    coach.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Build it, then find out why it broke'));
    coach.appendChild(ui.h('p', { class: 'lesson-body' },
      'Every line is a member and its colour is what the load is doing to it — blue stretched, pink squashed. This is a real solve, not an animation: eighteen equilibrium equations, solved each time you move a slider. Notice the bottom chord working hardest while the top only braces.'));

    coach.appendChild(ui.section('Goal', g.el));
    coach.appendChild(ui.section('Observables', ui.obsList(oFos, oStress, oCost, oChord, oGov, oUtil)));
    coach.appendChild(ui.section('Sections', ui.controls(sBottom.el, sTop.el, sDiag.el)));
    coach.appendChild(ui.h('div', { class: 'hairline' }));
    coach.appendChild(ui.note(
      'The solver is the <b>same linear system</b> the maths world teaches: 15 member forces plus 3 reactions, 18 equations. Steel at 250 MPa yield, $2 per kilogram — sample material figures as of 2024 — so strength and cost pull against each other, which is what engineering actually is.'));

    /* ---- wrap the truss coach, then add the materials one ---- */
    const coachPrimary = ui.h('div', { class: 'instrument-pane' });
    while (coach.firstChild) coachPrimary.appendChild(coach.firstChild);
    const coachSecond = ui.h('div', { class: 'instrument-pane', style: { display: 'none' } });
    coach.appendChild(coachPrimary);
    coach.appendChild(coachSecond);

    const oYield = ui.obs('Yield load', '');
    const oMass = ui.obs('Mass per metre', '');
    const oRatio = ui.obs('Strength to weight', '');
    const sWidth = ui.slider({
      label: 'Member width', min: 10, max: 100, step: 5, value: memberWidth,
      format: (v) => String(Math.round(v)),
      onInput: (v) => { memberWidth = Math.round(v); paintSecond(); }
    });
    const sMaterial = ui.slider({
      label: 'Material', min: 0, max: 2, step: 1, value: material,
      format: (v) => MATERIALS[Math.round(v)].name,
      onInput: (v) => { material = Math.round(v); paintSecond(); }
    });
    const sg = ui.goal(
      'Reach a strength-to-weight ratio of at least <b>1.2</b>.',
      () => ({ done: strengthToWeight >= 1.2, progress: strengthToWeight.toFixed(2) }),
      'materials'
    );
    coachSecond.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Engineering · materials'));
    coachSecond.appendChild(ui.h('h2', { class: 'lesson-title' }, 'A wider member is not a free win'));
    coachSecond.appendChild(ui.h('p', { class: 'lesson-body' },
      'Width lifts the load a member can carry, but it adds mass in the same proportion. Switching material changes the two by different amounts, so the ratio is really a comparison between the three choices.'));
    coachSecond.appendChild(ui.section('Goal', sg.el));
    coachSecond.appendChild(ui.section('Observables', ui.obsList(oYield, oMass, oRatio)));
    coachSecond.appendChild(ui.section('Member', ui.controls(sWidth.el, sMaterial.el)));
    coachSecond.appendChild(ui.h('div', { class: 'hairline' }));
    coachSecond.appendChild(ui.note(
      'These factors and densities are a simplified comparison for the model, not engineering data: a single yield factor per material, mass proportional to width, and no buckling, joints or safety codes. The ratio cancels the width out, so the three cells show a genuinely like-for-like choice.'));

    function setInstrument(id) {
      instrument = id;
      panePrimary.style.display = id === 'eng' ? '' : 'none';
      paneSecond.style.display = id === 'materials' ? '' : 'none';
      coachPrimary.style.display = id === 'eng' ? '' : 'none';
      coachSecond.style.display = id === 'materials' ? '' : 'none';
      switchSeg.select(id);
      contract.selectInstrument(id);
      if (id === 'materials') paintSecond(); else { fit.resize(); draw(); }
      contract.useGoal(id);
    }
    const switchSeg = ui.segmented(
      [{ id: 'eng', label: 'Truss' }, { id: 'materials', label: 'Materials' }],
      'eng', setInstrument);
    coach.appendChild(switchSeg);
    contract.registerInstrument({ id: 'eng', activate: () => setInstrument('eng') });
    contract.registerInstrument({ id: 'materials', activate: () => setInstrument('materials') });

    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);

    solve();

    const stop = ui.addTicker(() => {
      if (instrument === 'eng') {
        draw();
        const s = stageGoal();
        if (s.stage !== lastStage) {
          lastStage = s.stage;
          const copy = g.el.querySelector('.goal-copy');
          if (copy) copy.innerHTML = GOAL_COPY[s.stage];
        }
        const fos = maxStress > 0 ? YIELD / maxStress : 0;
        oFos.set(fos.toFixed(2), fos >= 2.5);
        oStress.set(maxStress.toFixed(0));
        oCost.set(cost.toFixed(0), cost <= 95);
        oChord.set((Math.abs(forces[1]) / 1000).toFixed(1));
        oGov.set(governing);
        oUtil.set((utilization * 100).toFixed(0));
        g.update();
        api.markDone(g.done);
        return;
      }
      oYield.set(yieldLoad.toFixed(1));
      oMass.set(massPerMetre.toFixed(1));
      oRatio.set(strengthToWeight.toFixed(2));
      sg.update();
      api.markDone(sg.done);
    });

    return () => { stop(); ro.disconnect(); fit.destroy(); };
  }
};
