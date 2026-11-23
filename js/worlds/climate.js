/* ==========================================================================
   Climate — the energy balance you can turn
   ========================================================================== */

import * as ui from '../ui.js';
import * as contract from '../contract.js';

const SIGMA = 5.670374419e-8;
const SOLAR = 1361;      // W/m²
const SUN_FACTOR = 1;    // slider multiplier

export default {
  id: 'climate',
  name: 'Climate',
  sub: 'Energy balance',
  accent: '#2dd4bf',
  fade: false,
  glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <circle cx="12" cy="12" r="4.6"/>
    <path d="M12 3.2v2.2M12 18.6v2.2M3.2 12h2.2M18.6 12h2.2"/>
    <path d="M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/>
  </svg>`,

  mount(stage, coach, api) {
    let solar = 1;
    let albedo = 0.30;
    let emissivity = 0.61;
    let T = 288;            // current surface temperature, K
    const history = [];

    const host = ui.h('div', { class: 'canvas-host' });
    const canvas = ui.h('canvas');
    host.appendChild(canvas);
    stage.appendChild(host);

    const badge = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge' }, ui.h('span', { class: 'led' }), 'Single-layer energy balance'));
    stage.appendChild(badge);

    const paneBalance = ui.h('div', { class: 'stage-pane' });
    while (stage.firstChild) paneBalance.appendChild(stage.firstChild);
    stage.appendChild(paneBalance);

    /* ---- second instrument: seasons from tilt and distance ---- */
    let instrument = 'balance';
    let tilt = 23.5;
    let dist = 1;
    const DEG = Math.PI / 180;
    let summerT = 0, winterT = 0, contrastT = 0;

    const paneSeasons = ui.h('div', { class: 'stage-pane seasons-pane', style: { display: 'none' } });
    const seasonHead = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge' }, ui.h('span', { class: 'led' }), 'Seasons · tilt and distance'));
    const summerLine = ui.h('div', { class: 'season-line' });
    const winterLine = ui.h('div', { class: 'season-line' });
    const contrastLine = ui.h('div', { class: 'season-line strong' });
    const seasonNote = ui.h('div', { class: 'season-note' },
      'A simple model: tilt sets the swing, distance sets the mean. It shows the mechanism, not a forecast.');
    paneSeasons.appendChild(seasonHead);
    paneSeasons.appendChild(summerLine);
    paneSeasons.appendChild(winterLine);
    paneSeasons.appendChild(contrastLine);
    paneSeasons.appendChild(seasonNote);
    stage.appendChild(paneSeasons);

    function seasonStats() {
      const base = 15 / Math.sqrt(dist);
      const swing = 14 * Math.sin(tilt * DEG) / Math.sin(23.5 * DEG);
      summerT = base + swing;
      winterT = base - swing;
      contrastT = summerT - winterT;
    }

    function paintSeasons() {
      seasonStats();
      summerLine.textContent = `Summer mean: ${summerT.toFixed(1)} °C`;
      winterLine.textContent = `Winter mean: ${winterT.toFixed(1)} °C`;
      contrastLine.textContent = `Season contrast: ${contrastT.toFixed(1)} °C`;
    }
    paintSeasons();

    const fit = ui.fitCanvas(canvas);
    const ctx = fit.ctx;

    const absorbed = () => (SOLAR * SUN_FACTOR * solar * (1 - albedo)) / 4;
    const emitted = (tempK) => emissivity * SIGMA * Math.pow(tempK, 4);
    const equilibrium = () => Math.pow(absorbed() / (emissivity * SIGMA), 0.25);

    function kelvinToC(k) { return k - 273.15; }

    function planetColour(tempK) {
      const t = ui.clamp((tempK - 255) / 55, 0, 1);
      const r = Math.round(ui.lerp(58, 239, t));
      const g = Math.round(ui.lerp(120, 110, t));
      const b = Math.round(ui.lerp(246, 60, t));
      return `rgb(${r},${g},${b})`;
    }

    function draw() {
      const W = fit.size.w, H = fit.size.h;
      /* A hidden pane measures 1×1; skip it rather than building a negative radius. */
      if (W < 80 || H < 80) return;
      ctx.setTransform(fit.size.dpr, 0, 0, fit.size.dpr, 0, 0);
      ctx.fillStyle = '#06090e';
      ctx.fillRect(0, 0, W, H);

      const stripH = 66;
      const mainH = H - stripH;
      const leftW = Math.min(W * 0.44, mainH * 0.8);

      /* planet */
      const cx = leftW / 2;
      const cy = mainH / 2 - 10;
      const R = Math.min(leftW, mainH) * 0.34;

      const col = planetColour(T);
      const grd = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.34, R * 0.1, cx, cy, R);
      grd.addColorStop(0, col);
      grd.addColorStop(0.75, col);
      grd.addColorStop(1, 'rgba(0,0,0,0.65)');

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      /* atmosphere glow */
      const halo = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.3);
      halo.addColorStop(0, 'rgba(45,212,191,0.20)');
      halo.addColorStop(1, 'rgba(45,212,191,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
      ctx.fill();

      /* temperature readout */
      const c = kelvinToC(T);
      ctx.textAlign = 'center';
      ctx.font = '600 32px ui-serif, Georgia, serif';
      ctx.fillStyle = '#e9eff7';
      ctx.fillText(`${c.toFixed(1)}°`, cx, cy + R + 44);

      ctx.font = '10px -apple-system, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(159,176,196,0.75)';
      ctx.fillText('mean surface', cx, cy + R + 62);

      /* balance bars */
      const bx = leftW + 22;
      const bw = W - bx - 24;
      const inNow = absorbed();
      const outNow = emitted(T);
      const maxW = Math.max(inNow, outNow, 380);

      function bar(y, value, colour, label) {
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(bx, y, bw, 14);
        ctx.fillStyle = colour;
        ctx.fillRect(bx, y, (value / maxW) * bw, 14);
        ctx.textAlign = 'left';
        ctx.font = '9.5px -apple-system, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(159,176,196,0.8)';
        ctx.fillText(label, bx, y - 6);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#e9eff7';
        ctx.font = '10.5px ui-monospace, monospace';
        ctx.fillText(value.toFixed(1) + ' W/m²', bx + bw, y - 6);
      }

      bar(64, inNow, '#fbbf24', 'absorbed from the Sun');
      bar(112, outNow, '#2dd4bf', 'radiated to space');
      const diff = inNow - outNow;
      const dcol = Math.abs(diff) < 0.6 ? 'rgba(61,220,151,0.9)' : diff > 0 ? '#fb7185' : '#60a5fa';
      ctx.textAlign = 'left';
      ctx.font = '10px -apple-system, system-ui, sans-serif';
      ctx.fillStyle = dcol;
      ctx.fillText(`imbalance ${diff > 0 ? '+' : ''}${diff.toFixed(1)} W/m²`, bx, 152);

      /* equilibrium marker */
      const teq = equilibrium();
      ctx.fillStyle = 'rgba(159,176,196,0.7)';
      ctx.fillText(`equilibrium ${kelvinToC(teq).toFixed(1)}°`, bx, 170);
      ctx.fillStyle = 'rgba(159,176,196,0.45)';
      ctx.fillText(`albedo ${albedo.toFixed(2)} · ε ${emissivity.toFixed(2)}`, bx, 188);

      /* history strip */
      const sy = mainH + 10;
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.moveTo(0, sy + stripH - 14);
      ctx.lineTo(W, sy + stripH - 14);
      ctx.stroke();

      if (history.length > 1) {
        ctx.beginPath();
        for (let i = 0; i < history.length; i++) {
          const px = (i / (history.length - 1)) * W;
          const py = sy + (stripH - 14) - ((history[i] - 250) / 70) * (stripH - 24);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = '#2dd4bf';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.lineWidth = 1;
      }

      ctx.textAlign = 'left';
      ctx.font = '9px -apple-system, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(159,176,196,0.5)';
      ctx.fillText('temperature, last few seconds', 10, sy + 8);
    }

    /* ---------- coach ---------- */
    const oT = ui.obs('Surface', '°C');
    const oEq = ui.obs('Equilibrium', '°C');
    const oIn = ui.obs('Absorbed', 'W/m²');
    const oOut = ui.obs('Radiated', 'W/m²');

    const sSun = ui.slider({
      label: 'Solar output', min: 0.85, max: 1.15, step: 0.005, value: solar,
      format: (v) => (v * 100).toFixed(1) + '%',
      onInput: (v) => { solar = v; }
    });
    const sAlb = ui.slider({
      label: 'Albedo (reflectivity)', min: 0.05, max: 0.6, step: 0.005, value: albedo,
      format: (v) => v.toFixed(2),
      onInput: (v) => { albedo = v; }
    });
    const sEps = ui.slider({
      label: 'Emissivity (lower traps more)', min: 0.45, max: 0.95, step: 0.005, value: emissivity,
      format: (v) => v.toFixed(2),
      onInput: (v) => { emissivity = v; }
    });

    const g = ui.goal(
      'Warm the surface by <b>3 °C</b> above where it started.',
      () => {
        const c = kelvinToC(T);
        return {
          done: c >= 17.9,
          progress: `${(c - 14.9).toFixed(1)} °C above the start`
        };
      }
    );

    coach.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Climate · radiative balance'));
    coach.appendChild(ui.h('h2', { class: 'lesson-title' }, 'The planet is a balance you can turn'));
    coach.appendChild(ui.h('p', { class: 'lesson-body' },
      'In equals out, or the temperature moves until it does. Reflect more sunlight and it cools; trap more outgoing radiation and it warms. Nothing here is a forecast — it is one equation, solved live, and it is the spine of every climate model there is.'));

    coach.appendChild(ui.section('Goal', g.el));
    coach.appendChild(ui.section('Observables', ui.obsList(oT, oEq, oIn, oOut)));
    coach.appendChild(ui.section('Knobs', ui.controls(sSun.el, sAlb.el, sEps.el)));
    coach.appendChild(ui.h('div', { class: 'hairline' }));
    coach.appendChild(ui.note(
      '<b>T = ((S/4)(1−α) / εσ)^¼</b> — Stefan–Boltzmann, one layer, no ocean, no clouds. A real model adds feedbacks and comes out several degrees warmer for the same forcing. That gap is the honest uncertainty, and it is why the app shows the mechanism rather than a forecast.'));

    /* ---- wrap the balance coach, then add the seasons one ---- */
    const coachBalance = ui.h('div', { class: 'instrument-pane' });
    while (coach.firstChild) coachBalance.appendChild(coach.firstChild);
    const coachSeasons = ui.h('div', { class: 'instrument-pane', style: { display: 'none' } });
    coach.appendChild(coachBalance);
    coach.appendChild(coachSeasons);

    const oSummer = ui.obs('Summer mean', '°C');
    const oWinter = ui.obs('Winter mean', '°C');
    const oContrast = ui.obs('Season contrast', '°C');
    const sTilt = ui.slider({
      label: 'Axial tilt', min: 0, max: 45, step: 0.5, value: tilt,
      format: (v) => v.toFixed(1) + '°',
      onInput: (v) => { tilt = v; paintSeasons(); }
    });
    const sDist = ui.slider({
      label: 'Orbital distance', min: 0.9, max: 1.1, step: 0.005, value: dist,
      format: (v) => v.toFixed(3) + ' AU',
      onInput: (v) => { dist = v; paintSeasons(); }
    });
    const sg = ui.goal(
      'Make the gap between summer and winter at least <b>30 °C</b>.',
      () => ({ done: contrastT >= 30, progress: `${contrastT.toFixed(1)} °C contrast` }),
      'seasons'
    );
    coachSeasons.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Climate · seasons'));
    coachSeasons.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Tilt makes the seasons, not distance'));
    coachSeasons.appendChild(ui.h('p', { class: 'lesson-body' },
      'Move the planet closer and both seasons warm together. Increase the tilt and the two pull apart — contrast is what tilt buys you.'));
    coachSeasons.appendChild(ui.section('Goal', sg.el));
    coachSeasons.appendChild(ui.section('Observables', ui.obsList(oSummer, oWinter, oContrast)));
    coachSeasons.appendChild(ui.section('Knobs', ui.controls(sTilt.el, sDist.el)));
    coachSeasons.appendChild(ui.h('div', { class: 'hairline' }));
    coachSeasons.appendChild(ui.note(
      'The model is deliberately simple: a sinusoidal swing on a distance-scaled mean. It shows why tilt drives contrast and distance drives the average — not a seasonal forecast.'));

    function setInstrument(id) {
      instrument = id;
      paneBalance.style.display = id === 'balance' ? '' : 'none';
      paneSeasons.style.display = id === 'seasons' ? '' : 'none';
      coachBalance.style.display = id === 'balance' ? '' : 'none';
      coachSeasons.style.display = id === 'seasons' ? '' : 'none';
      switchSeg.select(id);
      contract.selectInstrument(id);
      if (id === 'seasons') paintSeasons(); else { fit.resize(); draw(); }
      contract.useGoal(id);
    }
    const switchSeg = ui.segmented(
      [{ id: 'balance', label: 'Balance' }, { id: 'seasons', label: 'Seasons' }],
      'balance', setInstrument);
    coach.appendChild(switchSeg);
    contract.registerInstrument({ id: 'balance', activate: () => setInstrument('balance') });
    contract.registerInstrument({ id: 'seasons', activate: () => setInstrument('seasons') });

    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);

    let acc = 0;
    const stop = ui.addTicker((dt) => {
      if (instrument === 'seasons') {
        oSummer.set(summerT.toFixed(1));
        oWinter.set(winterT.toFixed(1));
        oContrast.set(contrastT.toFixed(1), contrastT >= 30);
        sg.update();
        api.markDone(sg.done);
        return;
      }
      const teq = equilibrium();
      T += (teq - T) * (1 - Math.exp(-dt * 1.6));

      acc += dt;
      if (acc > 0.08) {
        acc = 0;
        history.push(T);
        if (history.length > 260) history.shift();
      }

      draw();

      oT.set(kelvinToC(T).toFixed(1), kelvinToC(T) >= 17.9);
      oEq.set(kelvinToC(teq).toFixed(1));
      oIn.set(absorbed().toFixed(0));
      oOut.set(emitted(T).toFixed(0));
      g.update();
      api.markDone(g.done);
    });

    return () => { stop(); ro.disconnect(); fit.destroy(); };
  }
};
