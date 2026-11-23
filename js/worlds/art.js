/* ==========================================================================
   Art — a studio with a critique, not a filter app
   ========================================================================== */

import * as ui from '../ui.js';
import * as contract from '../contract.js';

const PAPER = '#14171c';
const SWATCHES = ['#f2e9d8', '#d9a441', '#b4503c', '#8e6b4f', '#7d8f5a', '#4a6fa5', '#3b4658', '#12151a'];

export default {
  id: 'art',
  name: 'Art',
  sub: 'Value studio',
  accent: '#fb7185',
  fade: false,
  glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 3.2a8.8 8.8 0 100 17.6c1.5 0 2.1-1 2.1-1.9 0-1.4-1.4-1.7-1.4-2.9 0-1 .8-1.7 2-1.7h1.5A4.7 4.7 0 0021 9.7C21 5.9 17 3.2 12 3.2z"/>
    <circle cx="8.2" cy="9.4" r=".95" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="7.4" r=".95" fill="currentColor" stroke="none"/>
    <circle cx="15.8" cy="9.8" r=".95" fill="currentColor" stroke="none"/>
  </svg>`,

  mount(stage, coach, api) {
    let color = SWATCHES[0];
    let size = 16;
    let showGuides = false;
    let showReference = false;
    let strokes = 0;

    const wrap = ui.h('div', { class: 'art-stage' });
    const canvasWrap = ui.h('div', { class: 'art-canvas-wrap' });
    const paint = ui.h('canvas');
    const guides = ui.h('canvas', { style: { pointerEvents: 'none' } });
    canvasWrap.appendChild(paint);
    canvasWrap.appendChild(guides);

    const panel = ui.h('div', { class: 'art-panel' });

    const swatchRow = ui.h('div', { class: 'swatches' });
    const swatchEls = SWATCHES.map((c) => {
      const b = ui.h('button', {
        class: 'swatch', type: 'button',
        'aria-pressed': String(c === color),
        'aria-label': `Colour ${c}`,
        style: { background: c },
        onclick: () => {
          color = c;
          swatchEls.forEach((s) => s.setAttribute('aria-pressed', String(s._c === c)));
        }
      });
      b._c = c;
      swatchRow.appendChild(b);
      return b;
    });

    const histo = ui.h('div', { class: 'histo' });
    const bars = [];
    for (let i = 0; i < 5; i++) {
      const b = ui.h('div', { class: 'bar' });
      bars.push(b);
      histo.appendChild(b);
    }

    panel.appendChild(ui.h('div', { class: 'ctl-label', style: { fontSize: '9.5px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)' } }, 'Palette'));
    panel.appendChild(swatchRow);
    panel.appendChild(ui.h('div', { class: 'ctl-label', style: { fontSize: '9.5px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginTop: '4px' } }, 'Value spread'));
    panel.appendChild(histo);

    const sizeCtl = ui.slider({
      label: 'Brush', min: 3, max: 44, step: 1, value: size,
      format: (v) => `${Math.round(v)}`,
      onInput: (v) => { size = v; }
    });
    panel.appendChild(sizeCtl.el);

    const btnRow = ui.h('div', { class: 'btn-row' },
      ui.button('Undo', () => undo(), 'ghost'),
      ui.button('Clear', () => clearAll(), 'ghost'));
    panel.appendChild(btnRow);

    wrap.appendChild(canvasWrap);
    wrap.appendChild(panel);
    stage.appendChild(wrap);

    /* Wrap the painting studio into one switchable pane. */
    const panePrimary = ui.h('div', { class: 'stage-pane' });
    while (stage.firstChild) panePrimary.appendChild(stage.firstChild);
    stage.appendChild(panePrimary);

    /* ---- second instrument: palette ---- */
    let instrument = 'art';
    let mixRatio = 20;
    let baseValue = 20;

    const paneSecond = ui.h('div', { class: 'stage-pane secondary-pane', style: { display: 'none' } });
    const palHead = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge' }, ui.h('span', { class: 'led' }), 'Palette · value mixing'));
    const palLine = ui.h('div', { class: 'sec-line' });
    const palBig = ui.h('div', { class: 'sec-line strong' });
    const palGrid = ui.h('div', { class: 'sec-grid' });
    const swBase = ui.h('div', { class: 'sec-cell' });
    const swMixed = ui.h('div', { class: 'sec-cell' });
    const swOther = ui.h('div', { class: 'sec-cell' });
    palGrid.appendChild(swBase);
    palGrid.appendChild(swMixed);
    palGrid.appendChild(swOther);
    paneSecond.appendChild(palHead);
    paneSecond.appendChild(palLine);
    paneSecond.appendChild(palBig);
    paneSecond.appendChild(palGrid);
    stage.appendChild(paneSecond);

    function computePalette() {
      const other = 100 - baseValue;
      const mixed = ui.lerp(baseValue, other, mixRatio / 100);
      return {
        other,
        mixed,
        gap: Math.abs(mixed - baseValue),
        steps: Math.round(mixed / 20)
      };
    }

    function paintSecond() {
      const { other, mixed, gap } = computePalette();
      palLine.textContent = `Base ${baseValue} · Other ${other} · Mix ${mixRatio}%`;
      palBig.textContent = `Mixed value ${mixed.toFixed(1)} · gap ${gap.toFixed(1)}`;
      const shades = [
        [swBase, baseValue, `Base ${baseValue}`],
        [swMixed, mixed, `Mixed ${mixed.toFixed(0)}`],
        [swOther, other, `Other ${other}`]
      ];
      for (const [node, level, label] of shades) {
        node.style.background = `hsl(0, 0%, ${level.toFixed(1)}%)`;
        node.style.color = level > 55 ? '#0b0d10' : '';
        node.textContent = label;
      }
    }

    paintSecond();

    const ctx = paint.getContext('2d');
    const gctx = guides.getContext('2d');
    const history = [];
    let W = 1, H = 1, dpr = 1;

    function resize() {
      const r = canvasWrap.getBoundingClientRect();
      const ndpr = Math.min(window.devicePixelRatio || 1, 2);
      const nw = Math.max(1, Math.round(r.width * ndpr));
      const nh = Math.max(1, Math.round(r.height * ndpr));
      if (nw === paint.width && nh === paint.height) return;

      const snap = document.createElement('canvas');
      snap.width = paint.width || 1;
      snap.height = paint.height || 1;
      if (paint.width) snap.getContext('2d').drawImage(paint, 0, 0);

      paint.width = nw; paint.height = nh;
      guides.width = nw; guides.height = nh;
      W = r.width; H = r.height; dpr = ndpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, W, H);
      if (snap.width > 1) ctx.drawImage(snap, 0, 0, W, H);

      gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawGuides();
    }

    function clearAll() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, paint.width, paint.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, W, H);
      strokes = 0;
    }

    function snapshot() {
      const c = document.createElement('canvas');
      c.width = paint.width;
      c.height = paint.height;
      if (paint.width) c.getContext('2d').drawImage(paint, 0, 0);
      history.push(c);
      if (history.length > 8) history.shift();
    }

    function undo() {
      const prev = history.pop();
      if (!prev) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, paint.width, paint.height);
      ctx.drawImage(prev, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      strokes = Math.max(0, strokes - 1);
    }

    function drawGuides() {
      gctx.clearRect(0, 0, W, H);
      if (!showGuides && !showReference) return;

      if (showGuides) {
        gctx.strokeStyle = 'rgba(255,255,255,0.16)';
        gctx.lineWidth = 1;
        for (let i = 1; i < 3; i++) {
          gctx.beginPath();
          gctx.moveTo((W * i) / 3, 0); gctx.lineTo((W * i) / 3, H);
          gctx.moveTo(0, (H * i) / 3); gctx.lineTo(W, (H * i) / 3);
          gctx.stroke();
        }
        const vx = W / 2, vy = H * 0.52;
        gctx.strokeStyle = 'rgba(90,200,250,0.22)';
        gctx.beginPath();
        gctx.moveTo(0, vy); gctx.lineTo(W, vy);
        gctx.stroke();
        for (let i = -5; i <= 5; i++) {
          gctx.beginPath();
          gctx.moveTo(vx, vy);
          gctx.lineTo(vx + i * W * 0.32, H + 40);
          gctx.stroke();
        }
        gctx.fillStyle = 'rgba(90,200,250,0.5)';
        gctx.beginPath();
        gctx.arc(vx, vy, 2.6, 0, Math.PI * 2);
        gctx.fill();
      }

      if (showReference) {
        gctx.strokeStyle = 'rgba(255,255,255,0.3)';
        gctx.lineWidth = 1.3;
        gctx.lineJoin = 'round';

        const baseY = H * 0.74;
        gctx.beginPath();
        gctx.moveTo(W * 0.06, baseY);
        gctx.lineTo(W * 0.94, baseY + H * 0.09);
        gctx.stroke();

        const cx = W * 0.3, cy = H * 0.5, rad = Math.min(W, H) * 0.16;
        gctx.beginPath();
        gctx.arc(cx, cy, rad, 0, Math.PI * 2);
        gctx.stroke();

        const bx = W * 0.56, by = H * 0.52, s = Math.min(W, H) * 0.19;
        gctx.beginPath();
        gctx.moveTo(bx, by - s);
        gctx.lineTo(bx + s, by - s * 0.5);
        gctx.lineTo(bx + s, by + s * 0.62);
        gctx.lineTo(bx, by + s * 1.12);
        gctx.lineTo(bx - s, by + s * 0.62);
        gctx.lineTo(bx - s, by - s * 0.5);
        gctx.closePath();
        gctx.moveTo(bx - s, by - s * 0.5);
        gctx.lineTo(bx, by);
        gctx.lineTo(bx + s, by - s * 0.5);
        gctx.moveTo(bx, by);
        gctx.lineTo(bx, by + s * 1.12);
        gctx.stroke();

        const vx = W * 0.78, vw = Math.min(W, H) * 0.085;
        const top = H * 0.36, bottom = baseY;
        gctx.beginPath();
        gctx.moveTo(vx - vw * 0.3, top);
        gctx.bezierCurveTo(vx - vw * 0.9, top + (bottom - top) * 0.15, vx - vw, bottom - 14, vx - vw * 0.62, bottom);
        gctx.lineTo(vx + vw * 0.62, bottom);
        gctx.bezierCurveTo(vx + vw, bottom - 14, vx + vw * 0.9, top + (bottom - top) * 0.15, vx + vw * 0.3, top);
        gctx.stroke();
      }
    }

    /* ---------- painting ---------- */
    let drawing = false;
    let last = null;
    let lineCount = 0;

    function pos(e) {
      const r = paint.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function stamp(x, y) {
      const r = size * (0.62 + Math.random() * 0.5);
      ctx.globalAlpha = 0.14 + Math.random() * 0.16;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    function strokeTo(x, y) {
      const dx = x - last.x, dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      const step = Math.max(0.7, size * 0.26);
      const n = Math.max(1, Math.ceil(dist / step));
      for (let i = 1; i <= n; i++) {
        stamp(last.x + (dx * i) / n, last.y + (dy * i) / n);
      }
      last = { x, y };
    }

    /* Named handlers so teardown can remove them explicitly. */
    const onDown = (e) => {
      paint.setPointerCapture(e.pointerId);
      snapshot();
      drawing = true;
      lineCount = 0;
      last = pos(e);
      stamp(last.x, last.y);
    };
    const onMove = (e) => {
      if (!drawing) return;
      const p = pos(e);
      strokeTo(p.x, p.y);
      lineCount++;
    };
    const end = () => {
      if (!drawing) return;
      drawing = false;
      ctx.globalAlpha = 1;
      if (lineCount > 0) strokes++;
    };
    paint.addEventListener('pointerdown', onDown);
    paint.addEventListener('pointermove', onMove);
    paint.addEventListener('pointerup', end);
    paint.addEventListener('pointercancel', end);
    paint.addEventListener('pointerleave', end);

    /* ---------- critique ---------- */
    const tmp = document.createElement('canvas');
    const tctx = tmp.getContext('2d', { willReadFrequently: true });
    let distinct = 0;
    let coverage = 0;

    function analyse() {
      const tw = 128;
      const th = Math.max(1, Math.round((128 * H) / W));
      if (tmp.width !== tw || tmp.height !== th) {
        tmp.width = tw; tmp.height = th;
      }
      tctx.clearRect(0, 0, tw, th);
      tctx.drawImage(paint, 0, 0, tw, th);
      const data = tctx.getImageData(0, 0, tw, th).data;

      const bins = new Array(5).fill(0);
      let total = 0, painted = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        total++;
        if (Math.abs(r - 20) < 7 && Math.abs(g - 23) < 7 && Math.abs(b - 28) < 7) continue;
        painted++;
        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        bins[Math.min(4, Math.floor(lum * 5))]++;
      }

      distinct = 0;
      coverage = painted / Math.max(1, total);
      for (let i = 0; i < 5; i++) {
        const share = painted ? bins[i] / painted : 0;
        const on = share > 0.05;
        if (on) distinct++;
        bars[i].style.height = `${Math.max(3, share * 100)}%`;
        bars[i].classList.toggle('on', on);
      }
    }

    /* ---------- coach ---------- */
    const oDistinct = ui.obs('Distinct values', 'of 5');
    const oCover = ui.obs('Canvas covered', '%');
    const oStrokes = ui.obs('Strokes', '');

    const tGuides = ui.toggleRow('Perspective guides', false, (v) => { showGuides = v; drawGuides(); });
    const tRef = ui.toggleRow('Master study overlay', false, (v) => { showReference = v; drawGuides(); });

    const g = ui.goal(
      'Paint a study that uses <b>five distinct values</b>.',
      () => {
        const ok = distinct >= 5 && coverage > 0.05;
        return { done: ok, progress: ok ? 'That reads from across the room.' : `${distinct} of 5 values present` };
      },
      'art'
    );

    coach.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Art · value'));
    coach.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Squint: a painting is five values, not forty'));
    coach.appendChild(ui.h('p', { class: 'lesson-body' },
      'Value is light and dark, before colour. Paint the still life on the right with guides on, then turn the overlay off and see whether the shapes still stand up. The histogram reads your canvas as you work.'));

    coach.appendChild(ui.section('Goal', g.el));
    coach.appendChild(ui.section('Critique', ui.obsList(oDistinct, oCover, oStrokes)));
    coach.appendChild(ui.section('Studio', ui.controls(tGuides, tRef)));
    coach.appendChild(ui.h('div', { class: 'hairline' }));
    coach.appendChild(ui.note(
      'This is the part consumer art apps never do: the studio <b>looks back</b>. Value distribution, edge quality, proportion against the reference — all of it is ordinary image analysis, and all of it is teachable feedback.'));

    /* ---- wrap the art coach, then add the palette one ---- */
    const coachPrimary = ui.h('div', { class: 'instrument-pane' });
    while (coach.firstChild) coachPrimary.appendChild(coach.firstChild);
    const coachSecond = ui.h('div', { class: 'instrument-pane', style: { display: 'none' } });
    coach.appendChild(coachPrimary);
    coach.appendChild(coachSecond);

    const oMixed = ui.obs('Mixed value', '');
    const oGap = ui.obs('Value gap', '');
    const oSteps = ui.obs('Value steps', '');

    const sMix = ui.slider({
      label: 'Mix ratio', min: 0, max: 100, step: 1, value: mixRatio,
      format: (v) => `${Math.round(v)}%`,
      onInput: (v) => { mixRatio = Math.round(v); paintSecond(); }
    });
    const sBase = ui.slider({
      label: 'Base value', min: 0, max: 100, step: 1, value: baseValue,
      format: (v) => String(Math.round(v)),
      onInput: (v) => { baseValue = Math.round(v); paintSecond(); }
    });

    const sg = ui.goal(
      'Mix a value between <b>40</b> and <b>60</b>.',
      () => {
        const v = computePalette().mixed;
        return { done: v >= 40 && v <= 60, progress: `Mixed value ${v.toFixed(1)}` };
      },
      'palette'
    );

    coachSecond.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Art · value mixing'));
    coachSecond.appendChild(ui.h('h2', { class: 'lesson-title' }, 'A middle value is a decision, not a filter'));
    coachSecond.appendChild(ui.h('p', { class: 'lesson-body' },
      'Two greys sit at the base value and its opposite. The mix ratio slides between them, and the gap tells you how far you have travelled from the base. Stop in the middle band and the two ends stop arguing.'));
    coachSecond.appendChild(ui.section('Goal', sg.el));
    coachSecond.appendChild(ui.section('Observables', ui.obsList(oMixed, oGap, oSteps)));
    coachSecond.appendChild(ui.section('Controls', ui.controls(sMix.el, sBase.el)));
    coachSecond.appendChild(ui.h('div', { class: 'hairline' }));
    coachSecond.appendChild(ui.note(
      'The blend is a straight linear mix between a grey and its inverse, so an even mix always lands on mid grey. Real pigment mixing subtracts light and rarely stays neutral — this one is arithmetic on lightness, not a paint simulation.'));

    function setInstrument(id) {
      instrument = id;
      panePrimary.style.display = id === 'art' ? '' : 'none';
      paneSecond.style.display = id === 'palette' ? '' : 'none';
      coachPrimary.style.display = id === 'art' ? '' : 'none';
      coachSecond.style.display = id === 'palette' ? '' : 'none';
      switchSeg.select(id);
      contract.selectInstrument(id);
      if (id === 'palette') paintSecond(); else resize();
      contract.useGoal(id);
    }
    const switchSeg = ui.segmented(
      [{ id: 'art', label: 'Studio' }, { id: 'palette', label: 'Palette' }],
      'art', setInstrument);
    coach.appendChild(switchSeg);
    contract.registerInstrument({ id: 'art', activate: () => setInstrument('art') });
    contract.registerInstrument({ id: 'palette', activate: () => setInstrument('palette') });

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvasWrap);
    resize();

    const timer = setInterval(() => {
      if (instrument === 'art') {
        analyse();
        oDistinct.set(String(distinct), distinct >= 5);
        oCover.set(String(Math.round(coverage * 100)));
        oStrokes.set(String(strokes));
        g.update();
        api.markDone(g.done);
        return;
      }
      const { mixed, gap, steps } = computePalette();
      oMixed.set(mixed.toFixed(1));
      oGap.set(gap.toFixed(1));
      oSteps.set(String(steps));
      sg.update();
      api.markDone(sg.done);
    }, 420);

    return () => {
      clearInterval(timer);
      ro.disconnect();
      paint.removeEventListener('pointerdown', onDown);
      paint.removeEventListener('pointermove', onMove);
      paint.removeEventListener('pointerup', end);
      paint.removeEventListener('pointercancel', end);
      paint.removeEventListener('pointerleave', end);
    };
  }
};
