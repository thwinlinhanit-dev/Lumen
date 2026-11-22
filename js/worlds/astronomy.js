/* ==========================================================================
   Astronomy — the orrery you scrub
   ========================================================================== */

import * as ui from '../ui.js';

const PLANETS = [
  { name: 'Mercury', a: 0.387, e: 0.206, P: 0.241, c: '#b8bcc6', r: 1.7, ph: 0.6 },
  { name: 'Venus', a: 0.723, e: 0.007, P: 0.615, c: '#e8c98a', r: 2.6, ph: 2.1 },
  { name: 'Earth', a: 1.000, e: 0.017, P: 1.000, c: '#5ac8fa', r: 2.8, ph: 4.0 },
  { name: 'Mars', a: 1.524, e: 0.093, P: 1.881, c: '#e2725b', r: 2.1, ph: 1.2 },
  { name: 'Jupiter', a: 5.203, e: 0.048, P: 11.86, c: '#d9a066', r: 6.0, ph: 3.3 },
  { name: 'Saturn', a: 9.537, e: 0.054, P: 29.45, c: '#e3c98a', r: 5.2, ph: 5.1 },
  { name: 'Uranus', a: 19.19, e: 0.047, P: 84.02, c: '#8fd9d9', r: 3.8, ph: 0.2 },
  { name: 'Neptune', a: 30.07, e: 0.009, P: 164.8, c: '#5b7fd4', r: 3.6, ph: 2.6 }
];

const OUTER = 30.07;

/** solve Kepler's equation and return { r (AU), nu (rad) } */
function kepler(a, e, M) {
  let E = M;
  for (let i = 0; i < 4; i++) {
    E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  }
  const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
  return { r: a * (1 - e * Math.cos(E)), nu };
}

export default {
  id: 'astro',
  name: 'Space',
  sub: 'Orbits',
  accent: '#f97316',
  fade: false,
  glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="4.4"/>
    <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(-22 12 12)"/>
  </svg>`,

  mount(stage, coach, api) {
    let years = 0;
    let speed = 4;
    let trueScale = false;

    const host = ui.h('div', { class: 'canvas-host' });
    const canvas = ui.h('canvas');
    host.appendChild(canvas);
    stage.appendChild(host);

    const badge = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge live' }, ui.h('span', { class: 'led' }), 'Live orbital motion'));
    stage.appendChild(badge);

    const legend = ui.h('div', { class: 'astro-legend' });
    stage.appendChild(legend);

    const fit = ui.fitCanvas(canvas);
    const ctx = fit.ctx;

    /* ---------- draw ---------- */
    function radiusFor(a, R) {
      return trueScale
        ? (a / OUTER) * R
        : Math.sqrt(a / OUTER) * R;
    }

    function draw() {
      const W = fit.size.w, H = fit.size.h;
      ctx.setTransform(fit.size.dpr, 0, 0, fit.size.dpr, 0, 0);
      ctx.fillStyle = '#05070b';
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.44;

      /* sun */
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.16);
      glow.addColorStop(0, 'rgba(255,236,190,0.95)');
      glow.addColorStop(0.4, 'rgba(249,115,22,0.45)');
      glow.addColorStop(1, 'rgba(249,115,22,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffedc4';
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(2.4, R * 0.022), 0, Math.PI * 2);
      ctx.fill();

      for (const p of PLANETS) {
        const orbitR = radiusFor(p.a, R);

        /* orbit path, sampled so the scale mapping stays consistent */
        ctx.beginPath();
        for (let k = 0; k <= 72; k++) {
          const t = (k / 72) * p.P;
          const { r, nu } = kepler(p.a, p.e, (2 * Math.PI * t) / p.P);
          const pr = radiusFor(r, R);
          const px = cx + pr * Math.cos(nu + p.ph);
          const py = cy - pr * Math.sin(nu + p.ph);
          if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = trueScale ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.075)';
        ctx.lineWidth = 1;
        ctx.stroke();

        const M = (2 * Math.PI * years) / p.P;
        const { r, nu } = kepler(p.a, p.e, M);
        const pr = radiusFor(r, R);
        const px = cx + pr * Math.cos(nu + p.ph);
        const py = cy - pr * Math.sin(nu + p.ph);

        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.shadowColor = p.c;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (!trueScale || pr > 46) {
          ctx.font = '9.5px -apple-system, system-ui, sans-serif';
          ctx.fillStyle = 'rgba(233,239,247,0.5)';
          ctx.textAlign = 'left';
          ctx.fillText(p.name, px + p.r + 4, py + 3);
        }
      }

      /* scale note */
      ctx.font = '10px -apple-system, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(159,176,196,0.6)';
      ctx.textAlign = 'left';
      ctx.fillText(trueScale ? 'TRUE distances — logarithmic no more' : 'distances compressed (√a)', 16, H - 16);
    }

    /* ---------- legend ---------- */
    function buildLegend() {
      legend.innerHTML = '';
      legend.appendChild(ui.h('div', { class: 'astro-head' }, 'a (AU) · period (y)'));
      for (const p of PLANETS) {
        legend.appendChild(ui.h('div', { class: 'astro-row' },
          ui.h('span', { class: 'dot', style: { background: p.c } }),
          ui.h('span', { class: 'nm' }, p.name),
          ui.h('span', { class: 'v' }, `${p.a.toFixed(2)} · ${p.P < 10 ? p.P.toFixed(2) : p.P.toFixed(0)}`)));
      }
    }

    /* ---------- coach ---------- */
    const oYears = ui.obs('Elapsed', 'y');
    const oNeptune = ui.obs('Neptune orbits', '');
    const oEarth = ui.obs('Earth years', '');
    const oScale = ui.obs('Scale', '');

    const sSpeed = ui.slider({
      label: 'Time', min: 0, max: 30, step: 0.5, value: speed,
      format: (v) => (v === 0 ? 'paused' : `${v.toFixed(1)} y/s`),
      onInput: (v) => { speed = v; }
    });

    const tScale = ui.toggleRow('True distances', false, (v) => {
      trueScale = v;
      buildLegend();
    });

    const g = ui.goal(
      'Give <b>Neptune</b> one full orbit — 165 years.',
      () => ({
        done: years >= 164.8,
        progress: `${years.toFixed(0)} of 165 years`
      })
    );

    coach.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Astronomy · orbital mechanics'));
    coach.appendChild(ui.h('h2', { class: 'lesson-title' }, 'One small rock, one large machine'));
    coach.appendChild(ui.h('p', { class: 'lesson-body' },
      'Distance from the Sun sets the period, and nothing else does. Watch Mercury race while Neptune has barely moved — then press <strong>True distances</strong> and find out how badly the drawing has been lying to you.'));

    coach.appendChild(ui.section('Goal', g.el));
    coach.appendChild(ui.section('Observables', ui.obsList(oYears, oNeptune, oEarth, oScale)));
    coach.appendChild(ui.section('Controls', ui.controls(
      sSpeed.el,
      tScale,
      ui.buttonRow(ui.button('Jump 10 years', () => { years += 10; }, 'ghost'))
    )));
    coach.appendChild(ui.h('div', { class: 'hairline' }));
    coach.appendChild(ui.note(
      'Positions come from real orbital elements, solved through Kepler’s equation each frame — elliptical, not circular. The default view compresses distance by <b>√a</b> so the inner planets stay visible; that is a lie, and the toggle removes it.'));

    buildLegend();

    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);

    const stop = ui.addTicker((dt) => {
      years += dt * speed;
      draw();
      oYears.set(years.toFixed(1));
      oNeptune.set((years / 164.8).toFixed(2));
      oEarth.set(years.toFixed(1));
      oScale.set(trueScale ? 'true' : 'compressed', trueScale);
      g.update();
      api.markDone(g.done);
    });

    return () => { stop(); ro.disconnect(); fit.destroy(); };
  }
};
