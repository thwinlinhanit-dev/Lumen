/* ==========================================================================
   Engineering — a real truss solver you can break
   ========================================================================== */

import * as ui from '../ui.js';

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

    const host = ui.h('div', { class: 'canvas-host' });
    const canvas = ui.h('canvas');
    host.appendChild(canvas);
    stage.appendChild(host);

    const badge = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge' }, ui.h('span', { class: 'led' }), 'Method of joints · 18 equations'));
    stage.appendChild(badge);

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
        return;
      }

      forces = MEMBERS.map((_, m) => x[m]);
      let worst = 0;
      MEMBERS.forEach(([, , g], m) => {
        const s = Math.abs(forces[m]) / Math.max(1, areas[g]);
        if (s > worst) worst = s;
      });
      maxStress = worst;
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

    const mk = (key, label, max) => ui.slider({
      label, min: 60, max: 900, step: 10, value: areas[key],
      format: (v) => Math.round(v) + ' mm²',
      onInput: (v) => { areas[key] = v; solve(); void max; }
    });

    const sBottom = mk('bottom', 'Bottom chord', 900);
    const sTop = mk('top', 'Top chord', 900);
    const sDiag = mk('diag', 'Diagonals', 900);

    const g = ui.goal(
      'Carry 20 kN with a factor of safety of <b>2.5</b> — for under <b>$95</b>.',
      () => ({
        done: !collapsed && maxStress > 0 && YIELD / maxStress >= 2.5 && cost <= 95,
        progress: `FoS ${(maxStress > 0 ? YIELD / maxStress : 0).toFixed(2)} · $${cost.toFixed(0)}`
      })
    );

    coach.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Engineering · structures'));
    coach.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Build it, then find out why it broke'));
    coach.appendChild(ui.h('p', { class: 'lesson-body' },
      'Every line is a member and its colour is what the load is doing to it — blue stretched, pink squashed. This is a real solve, not an animation: eighteen equilibrium equations, solved each time you move a slider. Notice the bottom chord working hardest while the top only braces.'));

    coach.appendChild(ui.section('Goal', g.el));
    coach.appendChild(ui.section('Observables', ui.obsList(oFos, oStress, oCost, oChord)));
    coach.appendChild(ui.section('Sections', ui.controls(sBottom.el, sTop.el, sDiag.el)));
    coach.appendChild(ui.h('div', { class: 'hairline' }));
    coach.appendChild(ui.note(
      'The solver is the <b>same linear system</b> the maths world teaches: 15 member forces plus 3 reactions, 18 equations. Steel at 250 MPa yield, $2 per kilogram — so strength and cost pull against each other, which is what engineering actually is.'));

    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);

    solve();

    const stop = ui.addTicker(() => {
      draw();
      const fos = maxStress > 0 ? YIELD / maxStress : 0;
      oFos.set(fos.toFixed(2), fos >= 2.5);
      oStress.set(maxStress.toFixed(0));
      oCost.set(cost.toFixed(0), cost <= 95);
      oChord.set((Math.abs(forces[1]) / 1000).toFixed(1));
      g.update();
      api.markDone(g.done);
    });

    return () => { stop(); ro.disconnect(); fit.destroy(); };
  }
};
