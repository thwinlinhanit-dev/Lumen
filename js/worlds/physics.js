/* ==========================================================================
   Physics — double-slit interference
   ========================================================================== */

import * as ui from '../ui.js';
import * as contract from '../contract.js';

const SRC_X = 22;
const BUF_W = 280;

export default {
  id: 'physics',
  name: 'Physics',
  sub: 'Wave optics',
  accent: '#5ac8fa',
  glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <circle cx="4.6" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    <path d="M7.8 7.8a6 6 0 010 8.4"/>
    <path d="M11 5.2a10.4 10.4 0 010 13.6"/>
  </svg>`,

  mount(stage, coach, api) {
    /* ---------- state ---------- */
    let lam = 550;      // nm
    let sep = 6;        // µm
    let speed = 0.55;
    let wt = 0;
    let dirty = true;

    let W = 1, H = 1, screenW = 1, fieldW = 1;
    let bufH = 200;
    let env = null, spn = null, cpn = null, n = 0;
    let img = null, bctx = null, bufCanvas = null;
    let y1b = 0, y2b = 0;
    let crest = [255, 255, 255], trough = [0, 0, 0];
    let profile = { prof: new Float32Array(1), max: 1, count: 0 };
    let strip = document.createElement('canvas');
    let stripCtx = strip.getContext('2d');

    /* ---------- instruments ---------- */
    let instrument = 'wave';

    const paneWave = ui.h('div', { class: 'stage-pane' });
    const host = ui.h('div', { class: 'canvas-host' });
    const canvas = ui.h('canvas');
    host.appendChild(canvas);
    paneWave.appendChild(host);

    const badge = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge live' },
        ui.h('span', { class: 'led' }), 'Live simulation'));
    const readout = ui.h('div', { class: 'hud tr' });
    const label = ui.h('div', { class: 'hud br' }, 'screen');
    paneWave.appendChild(badge);
    paneWave.appendChild(readout);
    paneWave.appendChild(label);
    stage.appendChild(paneWave);

    const fit = ui.fitCanvas(canvas);
    const ctx = fit.ctx;

    const panePush = ui.h('div', { class: 'stage-pane' });
    panePush.style.display = 'none';
    const pCanvas = ui.h('canvas');
    panePush.appendChild(pCanvas);
    panePush.appendChild(ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge live' },
        ui.h('span', { class: 'led' }), 'push and float')));
    stage.appendChild(panePush);

    const pFit = ui.fitCanvas(pCanvas);
    const pCtx = pFit.ctx;

    /* ---------- field ---------- */
    function layout() {
      W = fit.size.w;
      H = fit.size.h;
      screenW = Math.max(64, Math.min(190, W * 0.22));
      fieldW = Math.max(40, W - screenW);
      bufH = ui.clamp(Math.round(BUF_W * (H / fieldW)), 80, 460);

      bufCanvas = document.createElement('canvas');
      bufCanvas.width = BUF_W;
      bufCanvas.height = bufH;
      bctx = bufCanvas.getContext('2d');
      img = bctx.createImageData(BUF_W, bufH);
      n = BUF_W * bufH;
      env = new Float32Array(n);
      spn = new Float32Array(n);
      cpn = new Float32Array(n);
      dirty = true;
    }

    function colors() {
      const hex = ui.wavelengthToColor(lam);
      const m = hex.match(/\d+/g).map(Number);
      crest = [
        Math.round(m[0] + (255 - m[0]) * 0.62),
        Math.round(m[1] + (255 - m[1]) * 0.62),
        Math.round(m[2] + (255 - m[2]) * 0.62)
      ];
      trough = [Math.round(m[0] * 0.82), Math.round(m[1] * 0.82), Math.round(m[2] * 0.82)];
    }

    function precompute() {
      colors();

      const lamPx = lam * (8 / 550);
      let dpx = sep * 10.9;
      dpx = Math.min(dpx, bufH - 44);

      const k = (Math.PI * 2) / Math.max(1.5, lamPx);
      const cy = bufH / 2;
      y1b = cy - dpx / 2;
      y2b = cy + dpx / 2;

      for (let y = 0; y < bufH; y++) {
        const row = y * BUF_W;
        for (let x = 0; x < BUF_W; x++) {
          const i = row + x;
          if (x < SRC_X - 2) { env[i] = 0; spn[i] = 0; cpn[i] = 0; continue; }
          const dx = x - SRC_X;
          const dy1 = y - y1b;
          const dy2 = y - y2b;
          const r1 = Math.sqrt(dx * dx + dy1 * dy1 + 1);
          const r2 = Math.sqrt(dx * dx + dy2 * dy2 + 1);
          env[i] = 2 * Math.cos((k * (r1 - r2)) / 2);
          const sum = (k * (r1 + r2)) / 2;
          spn[i] = Math.sin(sum);
          cpn[i] = Math.cos(sum);
        }
      }

      analyse();
      buildStrip();
      dirty = false;
    }

    function analyse() {
      const x = BUF_W - 3;
      const prof = new Float32Array(bufH);
      let max = 0;
      for (let y = 0; y < bufH; y++) {
        const v = env[y * BUF_W + x] * 0.5;
        const I = v * v;
        prof[y] = I;
        if (I > max) max = I;
      }
      let count = 0;
      if (max > 0) {
        for (let y = 2; y < bufH - 2; y++) {
          if (prof[y] > 0.2 * max && prof[y] >= prof[y - 1] && prof[y] > prof[y + 1]) count++;
        }
      }
      profile = { prof, max: max || 1, count };
    }

    function buildStrip() {
      strip.width = 2;
      strip.height = bufH;
      const m = ui.wavelengthToColor(lam).match(/\d+/g).map(Number);
      const imgData = stripCtx.createImageData(2, bufH);
      for (let y = 0; y < bufH; y++) {
        const I = profile.prof[y] / profile.max;
        const a = Math.pow(I, 0.85);
        for (let x = 0; x < 2; x++) {
          const i = (y * 2 + x) * 4;
          imgData.data[i] = 6 + m[0] * a;
          imgData.data[i + 1] = 9 + m[1] * a;
          imgData.data[i + 2] = 14 + m[2] * a;
          imgData.data[i + 3] = 255;
        }
      }
      stripCtx.putImageData(imgData, 0, 0);
    }

    /* ---------- render ---------- */
    function draw() {
      if (dirty) precompute();

      const cw = Math.cos(wt);
      const sw = Math.sin(wt);
      const data = img.data;
      const bgR = 7, bgG = 10, bgB = 15;

      for (let i = 0; i < n; i++) {
        const e = env[i];
        let v = 0;
        if (e !== 0) v = e * (spn[i] * cw - cpn[i] * sw) * 0.5;
        if (v > 1) v = 1; else if (v < -1) v = -1;

        const j = i * 4;
        if (v >= 0) {
          data[j] = bgR + (crest[0] - bgR) * v;
          data[j + 1] = bgG + (crest[1] - bgG) * v;
          data[j + 2] = bgB + (crest[2] - bgB) * v;
        } else {
          data[j] = bgR + (trough[0] - bgR) * -v;
          data[j + 1] = bgG + (trough[1] - bgG) * -v;
          data[j + 2] = bgB + (trough[2] - bgB) * -v;
        }
        data[j + 3] = 255;
      }
      bctx.putImageData(img, 0, 0);

      ctx.setTransform(fit.size.dpr, 0, 0, fit.size.dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#05080c';
      ctx.fillRect(0, 0, W, H);

      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(bufCanvas, 0, 0, fieldW, H);

      /* screen panel */
      ctx.drawImage(strip, fieldW, 0, screenW, H);

      const g = ctx.createLinearGradient(fieldW - 26, 0, fieldW + 4, 0);
      g.addColorStop(0, 'rgba(5,8,12,0)');
      g.addColorStop(1, 'rgba(5,8,12,0.92)');
      ctx.fillStyle = g;
      ctx.fillRect(fieldW - 26, 0, 30, H);

      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(fieldW + 0.5, 0);
      ctx.lineTo(fieldW + 0.5, H);
      ctx.stroke();

      /* intensity curve */
      ctx.beginPath();
      for (let y = 0; y < bufH; y++) {
        const I = profile.prof[y] / profile.max;
        const px = fieldW + 2 + I * (screenW - 8);
        const py = (y / (bufH - 1)) * H;
        if (y === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1.1;
      ctx.stroke();

      /* the barrier */
      const wallW = Math.max(7, ((SRC_X - 2) / BUF_W) * fieldW);
      const y1s = (y1b / bufH) * H;
      const y2s = (y2b / bufH) * H;
      const gap = Math.max(5, Math.min(9, H * 0.012));

      const wg = ctx.createLinearGradient(0, 0, wallW, 0);
      wg.addColorStop(0, '#0d1219');
      wg.addColorStop(0.55, '#2a3441');
      wg.addColorStop(1, '#161d26');
      ctx.fillStyle = wg;

      ctx.fillRect(0, 0, wallW, y1s - gap);
      ctx.fillRect(0, y1s + gap, wallW, y2s - y1s - gap * 2);
      ctx.fillRect(0, y2s + gap, wallW, H - (y2s + gap));

      /* source glow */
      for (const ys of [y1s, y2s]) {
        const grd = ctx.createRadialGradient(wallW, ys, 0, wallW, ys, gap * 3.4);
        grd.addColorStop(0, 'rgba(255,255,255,0.85)');
        grd.addColorStop(0.4, ui.rgba('#ffffff', 0.22));
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(wallW, ys, gap * 3.4, 0, Math.PI * 2);
        ctx.fill();
      }

      /* annotations */
      ctx.font = '10px -apple-system, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.30)';
      ctx.textAlign = 'left';
      ctx.fillText('double slit', wallW + 8, 16);
      ctx.textAlign = 'right';
      ctx.fillText('screen', W - 12, 16);
    }

    /* ---------- push and float ---------- */
    let pForce = 5;
    let pMass = 2;
    let pT = 0;

    const pAccel = () => pForce / pMass;
    const pDistance = () => 0.5 * pAccel() * 4;

    function drawPush() {
      const W = pFit.size.w, H = pFit.size.h;

      pCtx.setTransform(pFit.size.dpr, 0, 0, pFit.size.dpr, 0, 0);
      pCtx.clearRect(0, 0, W, H);
      pCtx.fillStyle = '#05080c';
      pCtx.fillRect(0, 0, W, H);

      const padX = 24;
      const tankTop = H * 0.18;
      const tankH = Math.max(90, H * 0.68);
      const tankW = Math.max(80, W - padX * 2);
      const floorY = tankTop + tankH;
      const waterY = tankTop + tankH * 0.44;

      pCtx.strokeStyle = 'rgba(255,255,255,0.14)';
      pCtx.lineWidth = 1.5;
      pCtx.beginPath();
      pCtx.moveTo(padX, tankTop);
      pCtx.lineTo(padX, floorY);
      pCtx.lineTo(padX + tankW, floorY);
      pCtx.lineTo(padX + tankW, tankTop);
      pCtx.stroke();

      pCtx.fillStyle = 'rgba(90,200,250,0.09)';
      pCtx.fillRect(padX, waterY, tankW, floorY - waterY);
      pCtx.strokeStyle = 'rgba(90,200,250,0.4)';
      pCtx.lineWidth = 1;
      pCtx.beginPath();
      pCtx.moveTo(padX, waterY);
      pCtx.lineTo(padX + tankW, waterY);
      pCtx.stroke();

      const r = Math.max(9, Math.min(24, W * 0.028));
      const density = pMass;

      /* where buoyancy puts it: submerged fraction equals density up to 1 */
      let cy;
      if (density <= 1) cy = waterY - r + 2 * r * density;
      else cy = Math.min(floorY - r, waterY + r);

      const travelled = 0.5 * pAccel() * pT * pT;
      const span = 0.5 * 20 * 4;
      const frac = Math.max(0, Math.min(1, travelled / span));
      const cx = padX + r + 8 + frac * (tankW - 2 * r - 16);

      /* the push */
      const arrowLen = 16 + Math.min(1, pForce / 20) * (W * 0.16);
      const ay = cy;
      pCtx.strokeStyle = 'rgba(245,184,61,0.9)';
      pCtx.lineWidth = 2;
      pCtx.beginPath();
      pCtx.moveTo(padX + 4, ay);
      pCtx.lineTo(padX + 4 + arrowLen, ay);
      pCtx.stroke();
      pCtx.beginPath();
      pCtx.moveTo(padX + 4 + arrowLen, ay);
      pCtx.lineTo(padX + arrowLen - 2, ay - 4);
      pCtx.lineTo(padX + arrowLen - 2, ay + 4);
      pCtx.closePath();
      pCtx.fillStyle = 'rgba(245,184,61,0.9)';
      pCtx.fill();

      /* the ball */
      const g = pCtx.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.2, cx, cy, r);
      g.addColorStop(0, 'rgba(233,239,247,0.95)');
      g.addColorStop(1, 'rgba(120,140,165,0.75)');
      pCtx.beginPath();
      pCtx.arc(cx, cy, r, 0, Math.PI * 2);
      pCtx.fillStyle = g;
      pCtx.fill();

      pCtx.font = '10px -apple-system, system-ui, sans-serif';
      pCtx.textAlign = 'left';
      pCtx.fillStyle = 'rgba(255,255,255,0.42)';
      pCtx.fillText(`${pForce.toFixed(1)} N on ${pMass.toFixed(1)} kg`, padX, tankTop - 10);
      pCtx.fillStyle = 'rgba(90,200,250,0.6)';
      pCtx.fillText(density < 1 ? 'floats' : 'sinks', padX + 4, floorY + 18);
      pCtx.textAlign = 'right';
      pCtx.fillStyle = 'rgba(255,255,255,0.42)';
      pCtx.fillText(`${travelled.toFixed(1)} m in ${pT.toFixed(1)} s`, W - padX, floorY + 18);
    }

    /* ---------- coach ---------- */
    const oFringes = ui.obs('Bright fringes', '');
    const oSpacing = ui.obs('Fringe width', 'cm');
    const oSep = ui.obs('Slit separation', 'µm');

    const sLam = ui.slider({
      label: 'Wavelength',
      min: 380, max: 750, step: 1, value: lam,
      format: (v) => `${Math.round(v)} nm`,
      onInput: (v) => { lam = v; dirty = true; paintReadout(); }
    });

    const sSep = ui.slider({
      label: 'Slit separation',
      min: 3, max: 18, step: 0.5, value: sep,
      format: (v) => `${v.toFixed(1)} µm`,
      onInput: (v) => { sep = v; dirty = true; }
    });

    const sSpeed = ui.slider({
      label: 'Time',
      min: 0, max: 2, step: 0.05, value: speed,
      format: (v) => (v === 0 ? 'frozen' : `${v.toFixed(2)}×`),
      onInput: (v) => { speed = v; }
    });

    const g = ui.goal(
      'Land exactly <b>five</b> bright fringes on the screen.',
      () => {
        const c = profile.count;
        const ok = c === 5;
        return { done: ok, progress: ok ? 'You found it.' : `${c} fringes right now` };
      },
      'wave'
    );

    /* ---------- push controls ---------- */
    const oAccel = ui.obs('Acceleration', 'm/s²');
    const oDistance = ui.obs('Distance', 'm');
    const oDensity = ui.obs('Density', 'kg/L');
    const oBehaviour = ui.obs('Behaviour', '');

    const sForce = ui.slider({
      label: 'Force', min: 0, max: 20, step: 0.5, value: pForce,
      format: (v) => `${v.toFixed(1)} N`,
      onInput: (v) => { pForce = v; pT = 0; }
    });

    const sMass = ui.slider({
      label: 'Mass', min: 0.2, max: 3, step: 0.1, value: pMass,
      format: (v) => `${v.toFixed(1)} kg`,
      onInput: (v) => { pMass = v; pT = 0; }
    });

    const pg = ui.goal(
      'Send it further than <b>6 m</b> in two seconds.',
      () => {
        const d = pDistance();
        return {
          done: d >= 6,
          progress: `${d.toFixed(2)} m in 2 s`
        };
      },
      'push'
    );

    function paintReadout() {
      readout.innerHTML = '';
      readout.appendChild(ui.h('span', { class: 'badge' },
        ui.h('span', {
          class: 'led',
          style: { background: ui.wavelengthToColor(lam), boxShadow: `0 0 8px ${ui.wavelengthToColor(lam)}` }
        }),
        `${Math.round(lam)} nm`));
    }
    paintReadout();

    /* ---------- coach panes ---------- */
    const coachWave = ui.h('div', { class: 'pane' });
    const coachPush = ui.h('div', { class: 'pane' });
    coachPush.style.display = 'none';

    function setInstrument(id) {
      instrument = id;
      paneWave.style.display = id === 'wave' ? '' : 'none';
      panePush.style.display = id === 'push' ? '' : 'none';
      coachWave.style.display = id === 'wave' ? '' : 'none';
      coachPush.style.display = id === 'push' ? '' : 'none';
      switchSeg.select(id);
      if (id === 'push') { pFit.resize(); drawPush(); } else { fit.resize(); layout(); }
      contract.useGoal(id);
    }

    const switchSeg = ui.segmented([
      { id: 'wave', label: 'Waves' },
      { id: 'push', label: 'Push' }
    ], 'wave', (id) => setInstrument(id));

    contract.registerInstrument({ id: 'wave', activate: () => setInstrument('wave') });
    contract.registerInstrument({ id: 'push', activate: () => setInstrument('push') });

    coach.appendChild(switchSeg);

    coachWave.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Physics · wave optics'));
    coachWave.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Two slits make a pattern one slit cannot'));
    coachWave.appendChild(ui.h('p', { class: 'lesson-body' },
      'Light leaves two narrow slits at once. Where the two waves arrive in step they add and the screen is bright; where they arrive opposed they cancel and it goes dark. Predict first — what happens to the spacing as you push the slits further apart?'));

    coachWave.appendChild(ui.section('Goal', g.el));
    coachWave.appendChild(ui.section('Observables', ui.obsList(oFringes, oSpacing, oSep)));
    coachWave.appendChild(ui.section('Controls', ui.controls(sLam.el, sSep.el, sSpeed.el)));
    coachWave.appendChild(ui.h('div', { class: 'hairline' }));
    coachWave.appendChild(ui.note(
      'Fringe width <b>w = λL/d</b> with the screen 0.6 m away — the simulation solves the same geometry, so the numbers on the right come from where the waves actually meet.'));

    coachPush.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Physics · forces'));
    coachPush.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Push hard, or push something light'));
    coachPush.appendChild(ui.h('p', { class: 'lesson-body' },
      'Two knobs and one rule: a bigger force pushes harder, a bigger mass resists more, and what comes out is how quickly the speed builds. The ball sits in water so the second idea is visible — whether it floats is decided by its density alone.'));

    coachPush.appendChild(ui.section('Goal', pg.el));
    coachPush.appendChild(ui.section('Observables',
      ui.obsList(oAccel, oDistance, oDensity, oBehaviour)));
    coachPush.appendChild(ui.section('Controls', ui.controls(sForce.el, sMass.el)));
    coachPush.appendChild(ui.h('div', { class: 'hairline' }));
    coachPush.appendChild(ui.note(
      'No friction and no drag, so the distance is <b>½at²</b> exactly and the same push keeps accelerating forever. The water is one litre, so mass in kilograms is density in kg/L — real buoyancy also depends on shape.'));

    coach.appendChild(coachWave);
    coach.appendChild(coachPush);

    contract.useGoal('wave');

    /* ---------- loop ---------- */
    const ro = new ResizeObserver(() => { layout(); });
    ro.observe(canvas);

    const pRo = new ResizeObserver(() => { drawPush(); });
    pRo.observe(pCanvas);

    layout();
    drawPush();

    const stop = ui.addTicker((dt) => {
      if (instrument === 'wave') {
        wt += dt * 6 * speed;
        draw();
        g.update();
        oFringes.set(String(profile.count), profile.count === 5);
        const spacing = (lam * 1e-9 * 0.6) / (sep * 1e-6) * 100;
        oSpacing.set(spacing.toFixed(2));
        oSep.set(sep.toFixed(1));
        api.markDone(g.done);
        return;
      }

      pT = (pT + dt) % 2;
      drawPush();
      pg.update();
      const d = pDistance();
      oAccel.set(pAccel().toFixed(2));
      oDistance.set(d.toFixed(2), d >= 6);
      oDensity.set(pMass.toFixed(2));
      oBehaviour.set(pMass < 1 ? 'floats' : 'sinks');
      api.markDone(pg.done);
    });

    return () => {
      stop();
      ro.disconnect();
      pRo.disconnect();
      fit.destroy();
      pFit.destroy();
    };
  }
};
