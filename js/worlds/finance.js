/* ==========================================================================
   Financial literacy — the lifespan timeline
   ========================================================================== */

import * as ui from '../ui.js';

const YEARS = 40;
const MONTHS = YEARS * 12;

export default {
  id: 'finance',
  name: 'Money',
  sub: 'Compounding',
  accent: '#a3e635',
  glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 19.5h16"/>
    <path d="M6 19.5v-4M10 19.5v-7M14 19.5v-5M18 19.5v-9"/>
    <path d="M5 9.5l4-3 3 2 5-4.5"/>
  </svg>`,

  mount(stage, coach, api) {
    let save = 400;      // per month
    let rate = 7;        // % annual
    let inflation = 2.5; // % annual
    let fee = 0.5;       // % annual

    let series = { gross: [], net: [], real: [] };
    let final = { gross: 0, net: 0, real: 0 };

    /* ---------- maths ---------- */
    function compute() {
      const rm = rate / 100 / 12;
      const fm = fee / 100 / 12;
      const im = inflation / 100 / 12;

      let gross = 0, net = 0;
      const grossS = [0], netS = [0], realS = [0];

      for (let m = 1; m <= MONTHS; m++) {
        gross = gross * (1 + rm) + save;
        net = net * (1 + rm - fm) + save;

        if (m % 12 === 0) {
          const yrs = m / 12;
          const deflator = Math.pow(1 + im, m);
          grossS.push(gross);
          netS.push(net);
          realS.push(net / deflator);
        }
      }

      series = { gross: grossS, net: netS, real: realS };
      final = {
        gross: grossS[grossS.length - 1],
        net: netS[netS.length - 1],
        real: realS[realS.length - 1]
      };
    }

    /* ---------- instruments ---------- */
    let instrument = 'chart';

    const paneChart = ui.h('div', { class: 'stage-pane' });
    const host = ui.h('div', { class: 'canvas-host' });
    const canvas = ui.h('canvas');
    host.appendChild(canvas);
    paneChart.appendChild(host);

    const badge = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge' }, ui.h('span', { class: 'led' }), '40 years, monthly'));
    paneChart.appendChild(badge);
    stage.appendChild(paneChart);

    const paneShop = ui.h('div', { class: 'stage-pane shop-pane' });
    paneShop.style.display = 'none';
    stage.appendChild(paneShop);

    const fit = ui.fitCanvas(canvas);
    const ctx = fit.ctx;

    /* ---------- shop ---------- */
    const GOODS = [
      { id: 'apple', name: 'Apple', price: 0.6 },
      { id: 'bread', name: 'Bread', price: 2.4 },
      { id: 'milk', name: 'Milk', price: 1.2 },
      { id: 'cheese', name: 'Cheese', price: 4.5 },
      { id: 'coffee', name: 'Coffee', price: 3.2 }
    ];

    const basket = new Map();
    let budget = 10;

    function money2(v) {
      return '$' + v.toFixed(2);
    }

    function itemsBought() {
      let n = 0;
      for (const q of basket.values()) n += q;
      return n;
    }

    function spentTotal() {
      let s = 0;
      for (const g of GOODS) s += (basket.get(g.id) || 0) * g.price;
      return s;
    }

    function bump(id, by) {
      const next = Math.max(0, (basket.get(id) || 0) + by);
      if (next === 0) basket.delete(id);
      else basket.set(id, next);
      renderShop();
    }

    const shelf = ui.h('div', { class: 'shop-shelf' });
    const basketEl = ui.h('div', { class: 'shop-basket' });
    const countEls = new Map();

    for (const g of GOODS) {
      const count = ui.h('span', { class: 'si-count' }, '');
      countEls.set(g.id, count);

      shelf.appendChild(ui.h('button', {
        class: 'shop-item', type: 'button',
        onclick: () => bump(g.id, 1)
      },
        ui.h('span', { class: 'si-name' }, g.name),
        ui.h('span', { class: 'si-price' }, money2(g.price)),
        count));
    }

    function renderShop() {
      for (const g of GOODS) {
        const n = basket.get(g.id) || 0;
        const el = countEls.get(g.id);
        el.textContent = n ? '×' + n : '';
        el.classList.toggle('on', n > 0);
      }

      const spent = spentTotal();
      const left = budget - spent;
      const items = itemsBought();

      basketEl.innerHTML = '';
      basketEl.appendChild(ui.h('div', { class: 'shop-line' },
        ui.h('span', {}, 'Basket'),
        ui.h('span', { class: left < 0 ? 'over' : '' },
          `${items} item${items === 1 ? '' : 's'} · spent ${money2(spent)} · left ${money2(left)}`)));

      const chips = ui.h('div', { class: 'shop-chips' });
      for (const g of GOODS) {
        const n = basket.get(g.id) || 0;
        if (!n) continue;
        chips.appendChild(ui.h('button', {
          class: 'shop-chip', type: 'button',
          'aria-label': `Remove one ${g.name}`,
          onclick: () => bump(g.id, -1)
        }, `${g.name} ×${n}`));
      }
      if (!chips.children.length) {
        chips.appendChild(ui.h('span', { class: 'shop-empty' }, 'Tap an item to put it in the basket.'));
      }
      basketEl.appendChild(chips);
    }

    paneShop.appendChild(ui.h('div', { class: 'shop-head' },
      ui.h('span', { class: 'kicker' }, ui.h('span', { class: 'bar' }), 'Money · a shop, a budget, no advice'),
      ui.h('div', { class: 'shop-budget' }, 'Budget ', ui.h('b', {}, money2(budget)))));
    paneShop.appendChild(shelf);
    paneShop.appendChild(basketEl);
    renderShop();

    const money = (v) => {
      if (!isFinite(v)) return '—';
      const abs = Math.abs(v);
      if (abs >= 1e6) return '$' + (v / 1e6).toFixed(abs >= 1e7 ? 1 : 2) + 'm';
      if (abs >= 1e3) return '$' + Math.round(v / 1e3) + 'k';
      return '$' + Math.round(v);
    };

    function draw() {
      const W = fit.size.w, H = fit.size.h;
      ctx.setTransform(fit.size.dpr, 0, 0, fit.size.dpr, 0, 0);
      ctx.fillStyle = '#080a0f';
      ctx.fillRect(0, 0, W, H);

      const padL = 52, padR = 16, padT = 42, padB = 34;
      const plotW = Math.max(10, W - padL - padR);
      const plotH = Math.max(10, H - padT - padB);

      const yMax = Math.max(1000, final.gross) * 1.08;
      const X = (yr) => padL + (yr / YEARS) * plotW;
      const Y = (v) => padT + plotH - (v / yMax) * plotH;

      /* grid */
      ctx.font = '9.5px -apple-system, system-ui, sans-serif';
      ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) {
        const v = (yMax * i) / 4;
        const y = Y(v);
        ctx.strokeStyle = i === 0 ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.055)';
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(padL + plotW, y);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.fillText(money(v), padL - 8, y + 3);
      }

      ctx.textAlign = 'center';
      for (let yr = 0; yr <= YEARS; yr += 5) {
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.fillText(String(yr), X(yr), padT + plotH + 15);
      }

      function line(data, color, width, fill) {
        if (fill) {
          ctx.beginPath();
          ctx.moveTo(X(0), Y(0));
          for (let i = 0; i < data.length; i++) ctx.lineTo(X(i), Y(data[i]));
          ctx.lineTo(X(data.length - 1), Y(0));
          ctx.closePath();
          ctx.fillStyle = fill;
          ctx.fill();
        }
        ctx.beginPath();
        for (let i = 0; i < data.length; i++) {
          const px = X(i), py = Y(data[i]);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      line(series.gross, 'rgba(163,230,53,0.55)', 1.4, null);
      line(series.net, '#a3e635', 2.2, 'rgba(163,230,53,0.10)');
      line(series.real, '#5ac8fa', 2.2, 'rgba(90,200,250,0.10)');

      /* end markers */
      const last = series.net.length - 1;
      for (const [data, color, label] of [
        [series.gross, 'rgba(163,230,53,0.7)', 'before fees'],
        [series.net, '#a3e635', 'after fees'],
        [series.real, '#5ac8fa', 'after inflation']
      ]) {
        const px = X(last), py = Y(data[last]);
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.font = '9.5px -apple-system, system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillStyle = color;
        ctx.fillText(label, px - 8, py - 6);
      }

      /* title */
      ctx.textAlign = 'left';
      ctx.font = '11px -apple-system, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(159,176,196,0.8)';
      ctx.fillText(`${money(save)} a month · ${rate}% return · ${inflation}% inflation · ${fee}% fees`, padL, 24);
    }

    /* ---------- coach ---------- */
    const oNet = ui.obs('Balance at 40y', '');
    const oReal = ui.obs('In today’s money', '');
    const oFee = ui.obs('Lost to fees', '');
    const oDouble = ui.obs('Years to double', '');

    const sSave = ui.slider({
      label: 'Saved each month', min: 0, max: 2000, step: 25, value: save,
      format: (v) => '$' + Math.round(v),
      onInput: (v) => { save = v; compute(); }
    });
    const sRate = ui.slider({
      label: 'Annual return', min: 0, max: 12, step: 0.1, value: rate,
      format: (v) => v.toFixed(1) + '%',
      onInput: (v) => { rate = v; compute(); }
    });
    const sInfl = ui.slider({
      label: 'Inflation', min: 0, max: 8, step: 0.1, value: inflation,
      format: (v) => v.toFixed(1) + '%',
      onInput: (v) => { inflation = v; compute(); }
    });
    const sFee = ui.slider({
      label: 'Annual fee', min: 0, max: 2.5, step: 0.05, value: fee,
      format: (v) => v.toFixed(2) + '%',
      onInput: (v) => { fee = v; compute(); }
    });

    const g = ui.goal(
      'Reach <b>$1,000,000</b> in today’s money by year 40.',
      () => ({
        done: final.real >= 1e6,
        progress: `${money(final.real)} so far`
      }),
      'compound'
    );

    /* ---------- shop controls ---------- */
    const oSpent = ui.obs('Spent', '');
    const oLeft = ui.obs('Left', '');
    const oItems = ui.obs('Items bought', '');

    const sBudget = ui.slider({
      label: 'Budget', min: 5, max: 40, step: 1, value: budget,
      format: (v) => '$' + Math.round(v),
      onInput: (v) => {
        budget = Math.round(v);
        const head = paneShop.querySelector('.shop-budget b');
        if (head) head.textContent = money2(budget);
        renderShop();
      }
    });

    const sg = ui.goal(
      'Buy at least <b>three</b> things and stay within the budget.',
      () => {
        const spent = spentTotal();
        const items = itemsBought();
        return {
          done: items >= 3 && spent <= budget,
          progress: `${items} item${items === 1 ? '' : 's'} · ${money2(spent)} of ${money2(budget)}`
        };
      },
      'shop'
    );

    /* ---------- coach panes ---------- */
    const coachChart = ui.h('div', { class: 'pane' });
    const coachShop = ui.h('div', { class: 'pane' });
    coachShop.style.display = 'none';

    function setInstrument(id) {
      instrument = id;
      paneChart.style.display = id === 'chart' ? '' : 'none';
      paneShop.style.display = id === 'shop' ? '' : 'none';
      coachChart.style.display = id === 'chart' ? '' : 'none';
      coachShop.style.display = id === 'shop' ? '' : 'none';
      switchSeg.select(id);
      if (id === 'chart') fit.resize();
      contract.useGoal(id);
    }

    const switchSeg = ui.segmented([
      { id: 'chart', label: 'Lifespan' },
      { id: 'shop', label: 'Shop' }
    ], 'chart', (id) => setInstrument(id));

    contract.registerInstrument({ id: 'chart', activate: () => setInstrument('chart') });
    contract.registerInstrument({ id: 'shop', activate: () => setInstrument('shop') });

    coach.appendChild(switchSeg);

    coachChart.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Financial literacy · compounding'));
    coachChart.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Money is a time machine'));
    coachChart.appendChild(ui.h('p', { class: 'lesson-body' },
      'The green line is what the account says. The blue line is what it buys. Everything interesting in personal finance is the gap between them — and the fact that both bend upward, slowly, then suddenly.'));

    coachChart.appendChild(ui.section('Goal', g.el));
    coachChart.appendChild(ui.section('Observables', ui.obsList(oNet, oReal, oFee, oDouble)));
    coachChart.appendChild(ui.section('Your numbers', ui.controls(
      sSave.el, sRate.el, sInfl.el, sFee.el
    )));
    coachChart.appendChild(ui.h('div', { class: 'hairline' }));
    coachChart.appendChild(ui.note(
      'This is arithmetic on numbers you set — not advice, and no product is recommended. The fee line is the argument: a <b>0.5%</b> annual charge is invisible year to year and enormous decade to decade.'));

    coachShop.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Financial literacy · a budget'));
    coachShop.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Prices are the whole lesson'));
    coachShop.appendChild(ui.h('p', { class: 'lesson-body' },
      'Every budget you will ever make is this screen: a list of things with prices, one number you cannot cross, and the arithmetic of choosing. Tap an item to add it; tap its chip to take it out.'));

    coachShop.appendChild(ui.section('Goal', sg.el));
    coachShop.appendChild(ui.section('Observables', ui.obsList(oSpent, oLeft, oItems)));
    coachShop.appendChild(ui.section('Budget', ui.controls(sBudget.el)));
    coachShop.appendChild(ui.h('div', { class: 'hairline' }));
    coachShop.appendChild(ui.note(
      'Prices are a made-up shelf, not a market. The number left can go below zero — going over budget is shown as arithmetic, not as a warning, because that is how it happens in life.'));

    coach.appendChild(coachChart);
    coach.appendChild(coachShop);

    contract.useGoal('compound');

    compute();

    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);

    const stop = ui.addTicker(() => {
      if (instrument === 'chart') {
        draw();
        oNet.set(money(final.net), final.net > 0);
        oReal.set(money(final.real));
        oFee.set(money(final.gross - final.net));
        const dbl = rate > 0.01 ? 72 / rate : Infinity;
        oDouble.set(isFinite(dbl) ? dbl.toFixed(0) + 'y' : '—');
        g.update();
        api.markDone(g.done);
        return;
      }

      const spent = spentTotal();
      const left = budget - spent;
      sg.update();
      oSpent.set(money2(spent));
      oLeft.set(money2(left), left < 0);
      oItems.set(String(itemsBought()));
      api.markDone(sg.done);
    });

    return () => { stop(); ro.disconnect(); fit.destroy(); };
  }
};
