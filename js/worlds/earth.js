/* ==========================================================================
   Earth — one country at a time, with a timeline you can scrub
   ========================================================================== */

import * as ui from '../ui.js';
import { registerParam } from '../contract.js';
import * as contract from '../contract.js';

const DEG = Math.PI / 180;
const BANDS = 6;
const BAND_FILLS = Array.from({ length: BANDS }, (_, b) => {
  const t = b / (BANDS - 1);
  return `rgb(${Math.round(ui.lerp(24, 104, t))},${Math.round(ui.lerp(38, 142, t))},${Math.round(ui.lerp(46, 132, t))})`;
});

/* Curated names only; this panel makes no claims about these places. */
const PLACES = [
  'France', 'Japan', 'Brazil', 'Egypt', 'India', 'Canada',
  'Kenya', 'Poland', 'Mexico', 'Sweden', 'Turkey', 'Australia'
];

const FACTS = {
  'France': {
    blurb: '68 million people on 551,000 km² — the largest country in the European Union.',
    events: [[1789, 'Revolution begins with the storming of the Bastille'],
             [1889, 'Eiffel Tower completed for the World Fair'],
             [1944, 'Paris liberated'],
             [1981, 'First high-speed TGV line opens']]
  },
  'United Kingdom': {
    blurb: 'Four nations in one state, 67 million people.',
    events: [[1801, 'Act of Union creates the United Kingdom'],
             [1945, 'Second World War ends'],
             [1973, 'Joins the European Communities'],
             [2016, 'Votes to leave the European Union']]
  },
  'Germany': {
    blurb: '83 million people — the largest economy in Europe.',
    events: [[1871, 'Unification under the German Empire'],
             [1961, 'Berlin Wall built'],
             [1989, 'Berlin Wall falls'],
             [1990, 'Reunification']]
  },
  'Italy': {
    blurb: '59 million people; the centre of Western art for three centuries.',
    events: [[1861, 'Unification of Italy declared'],
             [1946, 'Monarchy abolished, republic founded'],
             [1957, 'Founding member of the European Communities']]
  },
  'Spain': {
    blurb: '47 million people on the Iberian peninsula.',
    events: [[1808, 'Peninsular War begins'],
             [1936, 'Civil War begins'],
             [1978, 'Democratic constitution approved']]
  },
  'Russia': {
    blurb: 'The largest country on Earth — 17 million km² across eleven time zones.',
    events: [[1861, 'Emancipation of the serfs'],
             [1917, 'Revolution brings the Bolsheviks to power'],
             [1991, 'Dissolution of the Soviet Union']]
  },
  'China': {
    blurb: '1.41 billion people and the second largest economy.',
    events: [[1911, 'Xinhai Revolution ends the imperial system'],
             [1949, 'People’s Republic founded'],
             [1978, 'Economic reforms begin']]
  },
  'India': {
    blurb: '1.43 billion people — the most populous country on Earth.',
    events: [[1857, 'Rebellion against East India Company rule'],
             [1947, 'Independence and partition'],
             [1950, 'Constitution comes into force']]
  },
  'Japan': {
    blurb: '124 million people across roughly 14,000 islands.',
    events: [[1868, 'Meiji Restoration'],
             [1945, 'Second World War ends'],
             [1964, 'Tokyo hosts the Olympics']]
  },
  'Brazil': {
    blurb: '215 million people — half of South America.',
    events: [[1822, 'Independence from Portugal'],
             [1888, 'Slavery abolished'],
             [1960, 'Brasília becomes the capital']]
  },
  'United States of America': {
    blurb: '335 million people across fifty states.',
    events: [[1861, 'Civil War begins'],
             [1929, 'Wall Street crash'],
             [1969, 'Apollo 11 lands on the Moon']]
  },
  'Egypt': {
    blurb: '110 million people, almost all of them along the Nile.',
    events: [[1869, 'Suez Canal opens'],
             [1922, 'Independence recognised'],
             [1956, 'Suez Crisis']]
  },
  'South Africa': {
    blurb: '60 million people at the southern tip of the continent.',
    events: [[1910, 'Union of South Africa'],
             [1948, 'Apartheid becomes law'],
             [1994, 'First democratic election']]
  },
  'Australia': {
    blurb: '26 million people on a continent of 7.7 million km².',
    events: [[1901, 'Federation of six colonies'],
             [1967, 'Referendum recognises Aboriginal peoples'],
             [2000, 'Sydney hosts the Olympics']]
  },
  'Mexico': {
    blurb: '128 million people between two oceans.',
    events: [[1821, 'Independence from Spain'],
             [1910, 'Revolution begins'],
             [1994, 'NAFTA takes effect']]
  },
  'Canada': {
    blurb: '39 million people on the second largest country by area.',
    events: [[1867, 'Confederation'],
             [1965, 'New national flag adopted'],
             [1982, 'Charter of Rights and Freedoms']]
  },
  'Argentina': {
    blurb: '46 million people, from subtropics to Patagonia.',
    events: [[1816, 'Independence declared'],
             [1946, 'Perón elected'],
             [1983, 'Return to democracy']]
  },
  'Nigeria': {
    blurb: '218 million people — the most populous country in Africa.',
    events: [[1960, 'Independence'],
             [1963, 'Becomes a republic'],
             [1999, 'Return to civilian rule']]
  },
  'Kenya': {
    blurb: '54 million people on the Indian Ocean coast.',
    events: [[1963, 'Independence'],
             [2010, 'New constitution approved']]
  },
  'Indonesia': {
    blurb: '275 million people across 17,000 islands.',
    events: [[1945, 'Independence declared'],
             [1998, 'Suharto resigns']]
  },
  'Turkey': {
    blurb: '85 million people bridging Europe and Asia.',
    events: [[1923, 'Republic founded'],
             [1952, 'Joins NATO']]
  },
  'Poland': {
    blurb: '37 million people on the North European Plain.',
    events: [[1918, 'Independence restored'],
             [1939, 'Invaded — the war begins'],
             [1989, 'Solidarity forms a government']]
  },
  'Saudi Arabia': {
    blurb: '36 million people on the Arabian peninsula.',
    events: [[1932, 'Kingdom unified'],
             [1938, 'Oil discovered']]
  },
  'Iran': {
    blurb: '89 million people; a civilisation of 2,500 years.',
    events: [[1906, 'Constitutional revolution'],
             [1979, 'Islamic Republic established']]
  },
  'Pakistan': {
    blurb: '240 million people along the Indus.',
    events: [[1947, 'Independence and partition'],
             [1971, 'East Pakistan becomes Bangladesh']]
  },
  'Vietnam': {
    blurb: '98 million people along the South China Sea.',
    events: [[1945, 'Independence declared'],
             [1975, 'Reunification'],
             [1986, 'Economic reforms begin']]
  },
  'New Zealand': {
    blurb: '5 million people on two main islands.',
    events: [[1893, 'Women’s suffrage becomes law'],
             [1907, 'Dominion status']]
  },
  'Sweden': {
    blurb: '10.5 million people in Scandinavia.',
    events: [[1814, 'Peace after the Napoleonic wars'],
             [1995, 'Joins the European Union']]
  }
};

export default {
  id: 'earth',
  name: 'Earth',
  sub: 'Countries & time',
  accent: '#60a5fa',
  glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="8.8"/>
    <path d="M3.2 12h17.6"/>
    <path d="M12 3.2c3 3.4 3 14.2 0 17.6M12 3.2c-3 3.4-3 14.2 0 17.6"/>
  </svg>`,

  mount(stage, coach, api) {
    let rotLon = 12, rotLat = 18;
    let zoom = 1;
    let velLon = 0, velLat = 0;
    let dragging = false, moved = 0, lastPtr = null;

    let countries = null;
    let lonlat = null;
    let ptsBuf = null;
    let bbox = null;
    let zAvg = null;
    let visFlags = null;
    let ready = false;
    let loadError = null;

    let hoverIdx = -1;
    let selectedIdx = -1;
    let hoverAt = 0;
    let year = 2020;
    const visited = new Set();

    /* ---------- dom ---------- */
    const host = ui.h('div', { class: 'canvas-host' });
    const canvas = ui.h('canvas');
    host.appendChild(canvas);
    stage.appendChild(host);

    const hint = ui.h('div', { class: 'hud tl' },
      ui.h('span', { class: 'badge' }, ui.h('span', { class: 'led' }), 'Drag to spin · tap a country'));
    const hoverLabel = ui.h('div', { class: 'hud tr' });
    stage.appendChild(hint);
    stage.appendChild(hoverLabel);

    const dossier = ui.h('div', { class: 'earth-dossier', style: { display: 'none' } });
    stage.appendChild(dossier);

    const yearLabel = ui.h('span', { class: 'yr-now' }, String(year));
    const yearInput = ui.h('input', { type: 'range', min: '1780', max: '2020', step: '1', value: String(year), 'aria-label': 'Year' });
    const timeline = ui.h('div', { class: 'timeline' },
      ui.h('div', { class: 'row' },
        yearLabel,
        yearInput,
        ui.h('span', { class: 'yr-end' }, '2020')));
    stage.appendChild(timeline);

    /* Wrap the globe surface into one switchable pane. */
    const panePrimary = ui.h('div', { class: 'stage-pane' });
    while (stage.firstChild) panePrimary.appendChild(stage.firstChild);
    stage.appendChild(panePrimary);

    /* ---- second instrument: compare two places ---- */
    let instrument = 'earth';
    let placeA = 1;
    let placeB = 2;
    const placesOpened = new Set();

    function openPlace(n) {
      const name = PLACES[n - 1];
      if (name) placesOpened.add(name);
    }

    const paneSecond = ui.h('div', { class: 'stage-pane secondary-pane', style: { display: 'none' } });
    const secA = ui.h('div', { class: 'sec-line' });
    const secB = ui.h('div', { class: 'sec-line' });
    const secOpened = ui.h('div', { class: 'sec-line strong' });
    const secCells = ui.h('div', { class: 'sec-grid' });
    const cellA = ui.h('div', { class: 'sec-cell' });
    const cellB = ui.h('div', { class: 'sec-cell' });
    secCells.appendChild(cellA);
    secCells.appendChild(cellB);
    paneSecond.appendChild(secA);
    paneSecond.appendChild(secB);
    paneSecond.appendChild(secOpened);
    paneSecond.appendChild(secCells);
    stage.appendChild(paneSecond);

    function paintSecond() {
      const nameA = PLACES[placeA - 1];
      const nameB = PLACES[placeB - 1];
      secA.textContent = 'Place A: ' + nameA;
      secB.textContent = 'Place B: ' + nameB;
      secOpened.textContent = placesOpened.size + ' of 2 places opened';
      cellA.textContent = nameA;
      cellB.textContent = nameB;
      cellA.classList.toggle('on', placesOpened.has(nameA));
      cellB.classList.toggle('on', placesOpened.has(nameB));
    }

    paintSecond();

    const fit = ui.fitCanvas(canvas);
    const ctx = fit.ctx;

    /* ---------- data ---------- */
    function decode(topo) {
      const sc = topo.transform.scale;
      const tr = topo.transform.translate;

      const arcs = topo.arcs.map((arc) => {
        let x = 0, y = 0;
        const out = new Array(arc.length);
        for (let i = 0; i < arc.length; i++) {
          x += arc[i][0];
          y += arc[i][1];
          out[i] = [x * sc[0] + tr[0], y * sc[1] + tr[1]];
        }
        return out;
      });

      const ring = (idxs) => {
        const pts = [];
        for (const idx of idxs) {
          const rev = idx < 0;
          const a = arcs[rev ? ~idx : idx];
          if (!a) continue;
          const seg = rev ? a.slice().reverse() : a;
          const start = pts.length ? 1 : 0;
          for (let i = start; i < seg.length; i++) pts.push(seg[i]);
        }
        return pts;
      };

      const geoms = topo.objects.countries.geometries;
      const list = [];
      const flat = [];
      let cursor = 0;

      for (const g of geoms) {
        const polys = g.type === 'Polygon' ? [g.arcs] : g.arcs;
        const ringList = [];
        for (const poly of polys) {
          for (const ids of poly) {
            const r = ring(ids);
            if (!r.length) continue;
            ringList.push({ off: cursor, len: r.length });
            for (let i = 0; i < r.length; i++) {
              flat.push(r[i][0], r[i][1]);
              cursor++;
            }
          }
        }
        if (!ringList.length) continue;
        list.push({
          name: (g.properties && g.properties.name) || 'Unknown',
          ringList,
          ptCount: ringList.reduce((s, r) => s + r.len, 0)
        });
      }

      lonlat = Float32Array.from(flat);
      countries = list;
      ptsBuf = new Float32Array(cursor * 2);
      bbox = new Float32Array(list.length * 4);
      zAvg = new Float32Array(list.length);
      visFlags = new Uint8Array(list.length);
    }

    fetch('data/countries-110m.json')
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then((topo) => {
        decode(topo);
        ready = true;
      })
      .catch((err) => {
        loadError = err.message || 'could not load';
        console.error(err);
      });

    /* ---------- draw ---------- */
    function draw() {
      const W = fit.size.w, H = fit.size.h;
      ctx.setTransform(fit.size.dpr, 0, 0, fit.size.dpr, 0, 0);
      ctx.fillStyle = '#04070b';
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2 - 6;
      const R = Math.min(W, H) * 0.42 * zoom;

      const halo = ctx.createRadialGradient(cx, cy, R * 0.94, cx, cy, R * 1.26);
      halo.addColorStop(0, 'rgba(96,165,250,0.22)');
      halo.addColorStop(1, 'rgba(96,165,250,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.26, 0, Math.PI * 2);
      ctx.fill();

      const og = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.34, R * 0.06, cx, cy, R);
      og.addColorStop(0, '#18405a');
      og.addColorStop(0.55, '#0c2333');
      og.addColorStop(1, '#040b12');
      ctx.fillStyle = og;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      if (!ready) {
        ctx.fillStyle = 'rgba(233,239,247,0.55)';
        ctx.font = '12px -apple-system, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(loadError ? `Country data unavailable (${loadError})` : 'Loading country geometry…', cx, cy + 4);
        return;
      }

      const cl = Math.cos(rotLat * DEG);
      const sl = Math.sin(rotLat * DEG);

      /* graticule */
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -88; lat <= 88; lat += 4) {
          const lam = (lon - rotLon) * DEG;
          const phi = lat * DEG;
          const cf = Math.cos(phi), sf = Math.sin(phi);
          const cll = Math.cos(lam);
          const x = cf * Math.sin(lam);
          const y = cl * sf - sl * cf * cll;
          const z = sl * sf + cl * cf * cll;
          if (z > 0) {
            const sx = cx + R * x, sy = cy - R * y;
            if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
          } else started = false;
        }
        ctx.stroke();
      }
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        const phi = lat * DEG;
        const cf = Math.cos(phi), sf = Math.sin(phi);
        const yConst = cl * sf;   // y = yConst - yLam * cos(lam)
        const yLam = sl * cf;
        const zConst = sl * sf;   // z = zConst + zLam * cos(lam)
        const zLam = cl * cf;

        for (let lon = -180; lon <= 180; lon += 4) {
          const lam = (lon - rotLon) * DEG;
          const cll = Math.cos(lam);
          const x = cf * Math.sin(lam);
          const y = yConst - yLam * cll;
          const z = zConst + zLam * cll;
          if (z > 0) {
            const sx = cx + R * x, sy = cy - R * y;
            if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
          } else started = false;
        }
        ctx.stroke();
      }

      /* project every point */
      let cursor = 0;
      for (let ci = 0; ci < countries.length; ci++) {
        const c = countries[ci];
        let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
        let vis = 0, zsum = 0;

        const end = cursor + c.ptCount;
        for (let k = cursor; k < end; k++) {
          const lon = lonlat[k * 2];
          const lat = lonlat[k * 2 + 1];
          const lam = (lon - rotLon) * DEG;
          const phi = lat * DEG;
          const cf = Math.cos(phi), sf = Math.sin(phi);
          const cll = Math.cos(lam);
          const x = cf * Math.sin(lam);
          const y = cl * sf - sl * cf * cll;
          const z = sl * sf + cl * cf * cll;

          let sx, sy;
          if (z > 0.002) {
            sx = cx + R * x;
            sy = cy - R * y;
            vis++;
            zsum += z;
            if (sx < minX) minX = sx;
            if (sx > maxX) maxX = sx;
            if (sy < minY) minY = sy;
            if (sy > maxY) maxY = sy;
          } else {
            const len = Math.sqrt(x * x + y * y) || 1;
            sx = cx + R * (x / len);
            sy = cy - R * (y / len);
          }
          ptsBuf[k * 2] = sx;
          ptsBuf[k * 2 + 1] = sy;
        }

        visFlags[ci] = vis > 0 ? 1 : 0;
        zAvg[ci] = vis > 0 ? zsum / vis : 0;
        bbox[ci * 4] = minX;
        bbox[ci * 4 + 1] = minY;
        bbox[ci * 4 + 2] = maxX;
        bbox[ci * 4 + 3] = maxY;
        cursor = end;
      }

      /* banded fills — use the context path directly; a Path2D per band per
         frame was the largest allocation in this world's ticker. */
      for (let b = 0; b < BANDS; b++) {
        ctx.beginPath();
        let any = false;
        for (let ci = 0; ci < countries.length; ci++) {
          if (!visFlags[ci]) continue;
          const c = countries[ci];
          let cb = Math.floor(zAvg[ci] * BANDS);
          if (cb < 0) cb = 0; else if (cb >= BANDS) cb = BANDS - 1;
          if (cb !== b) continue;
          any = true;
          for (let ri = 0; ri < c.ringList.length; ri++) {
            const r = c.ringList[ri];
            const off = r.off;
            ctx.moveTo(ptsBuf[off * 2], ptsBuf[off * 2 + 1]);
            for (let i = 1; i < r.len; i++) {
              const k = off + i;
              ctx.lineTo(ptsBuf[k * 2], ptsBuf[k * 2 + 1]);
            }
            ctx.closePath();
          }
        }
        if (!any) continue;
        ctx.fillStyle = BAND_FILLS[b];
        ctx.fill();
        ctx.strokeStyle = 'rgba(4,8,12,0.5)';
        ctx.lineWidth = 0.35;
        ctx.stroke();
      }

      /* highlight */
      const hi = selectedIdx >= 0 ? selectedIdx : hoverIdx;
      if (hi >= 0 && visFlags[hi]) {
        const c = countries[hi];
        ctx.beginPath();
        for (let ri = 0; ri < c.ringList.length; ri++) {
          const r = c.ringList[ri];
          ctx.moveTo(ptsBuf[r.off * 2], ptsBuf[r.off * 2 + 1]);
          for (let i = 1; i < r.len; i++) {
            const k = r.off + i;
            ctx.lineTo(ptsBuf[k * 2], ptsBuf[k * 2 + 1]);
          }
          ctx.closePath();
        }
        ctx.fillStyle = 'rgba(96,165,250,0.42)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(160,205,255,0.95)';
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      /* sphere shading */
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();
      const shade = ctx.createRadialGradient(cx - R * 0.32, cy - R * 0.36, R * 0.12, cx, cy, R * 1.04);
      shade.addColorStop(0, 'rgba(255,255,255,0.10)');
      shade.addColorStop(0.45, 'rgba(255,255,255,0)');
      shade.addColorStop(1, 'rgba(0,0,0,0.66)');
      ctx.fillStyle = shade;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      ctx.restore();

      ctx.strokeStyle = 'rgba(150,200,255,0.26)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
    }

    /* ---------- hit test ---------- */
    function hitTest(px, py) {
      if (!ready) return -1;
      for (let ci = 0; ci < countries.length; ci++) {
        if (!visFlags[ci]) continue;
        if (px < bbox[ci * 4] || px > bbox[ci * 4 + 2] || py < bbox[ci * 4 + 1] || py > bbox[ci * 4 + 3]) continue;
        const c = countries[ci];
        let inside = false;
        for (let ri = 0; ri < c.ringList.length; ri++) {
          const r = c.ringList[ri];
          for (let i = 0, j = r.len - 1; i < r.len; j = i++) {
            const xi = ptsBuf[(r.off + i) * 2], yi = ptsBuf[(r.off + i) * 2 + 1];
            const xj = ptsBuf[(r.off + j) * 2], yj = ptsBuf[(r.off + j) * 2 + 1];
            if (((yi > py) !== (yj > py)) && (px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)) {
              inside = !inside;
            }
          }
        }
        if (inside) return ci;
      }
      return -1;
    }

    /* ---------- dossier ---------- */
    function renderDossier() {
      if (selectedIdx < 0) {
        dossier.style.display = 'none';
        return;
      }
      const name = countries[selectedIdx].name;
      const f = FACTS[name];
      dossier.style.display = 'block';
      dossier.innerHTML = '';

      dossier.appendChild(ui.h('h4', {}, name));
      dossier.appendChild(ui.h('div', { class: 'meta' },
        f ? 'Country dossier' : 'No dossier yet'));

      if (f) {
        dossier.appendChild(ui.h('p', {}, f.blurb));
        const list = ui.h('ul', { class: 'facts' });
        const shown = f.events.filter((e) => e[0] <= year);
        if (!shown.length) {
          list.appendChild(ui.h('li', {}, ui.h('span', {}, 'Nothing in the record before this year.')));
        }
        for (const [yr, text] of shown) {
          list.appendChild(ui.h('li', {}, ui.h('span', { class: 'yr' }, String(yr)), ui.h('span', {}, text)));
        }
        dossier.appendChild(list);
      } else {
        dossier.appendChild(ui.h('p', {},
          'This mockup ships dossiers for about thirty countries. Scrub the timeline to see the country’s dated events.'))
      }
    }

    function select(idx) {
      selectedIdx = idx;
      if (idx >= 0) visited.add(countries[idx].name);
      renderDossier();
    }

    /* ---------- interaction ---------- */
    /* Named handlers so teardown can remove them explicitly — the stage wipe
       is the real GC today, but the cleanup should not depend on that. */
    const onDown = (e) => {
      canvas.setPointerCapture(e.pointerId);
      dragging = true;
      moved = 0;
      lastPtr = { x: e.clientX, y: e.clientY };
      velLon = 0;
      velLat = 0;
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (dragging && lastPtr) {
        const dx = e.clientX - lastPtr.x;
        const dy = e.clientY - lastPtr.y;
        lastPtr = { x: e.clientX, y: e.clientY };
        moved += Math.abs(dx) + Math.abs(dy);
        const k = 0.3 / zoom;
        rotLon -= dx * k;
        rotLat = ui.clamp(rotLat + dy * k, -82, 82);
        velLon = -dx * k * 55;
        velLat = dy * k * 55;
      } else {
        const now = performance.now();
        if (now - hoverAt > 110) {
          hoverAt = now;
          const idx = hitTest(e.clientX - rect.left, e.clientY - rect.top);
          if (idx !== hoverIdx) {
            hoverIdx = idx;
            hoverLabel.innerHTML = '';
            if (idx >= 0) {
              hoverLabel.appendChild(ui.h('span', { class: 'badge' }, countries[idx].name));
              canvas.style.cursor = 'pointer';
            } else {
              canvas.style.cursor = 'grab';
            }
          }
        }
      }
    };

    const release = (e) => {
      if (!dragging) return;
      dragging = false;
      if (moved < 7) {
        const rect = canvas.getBoundingClientRect();
        const idx = hitTest(e.clientX - rect.left, e.clientY - rect.top);
        select(idx);
      }
    };
    const onCancel = () => { dragging = false; };
    const onWheel = (e) => {
      e.preventDefault();
      zoom = ui.clamp(zoom * (1 - e.deltaY * 0.0015), 0.72, 3.4);
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', onCancel);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    function setYear(v) {
      year = Math.max(1780, Math.min(2020, Math.round(v)));
      yearInput.value = String(year);
      const pct = ((year - 1780) / (2020 - 1780)) * 100;
      yearInput.style.setProperty('--pct', pct + '%');
      yearLabel.textContent = String(year);
      renderDossier();
    }

    const onYearInput = () => setYear(parseInt(yearInput.value, 10));
    yearInput.addEventListener('input', onYearInput);
    yearInput.style.setProperty('--pct', '100%');

    registerParam({
      label: 'Year',
      min: 1780, max: 2020, step: 1,
      get: () => year,
      set: (v) => setYear(v)
    });

    /* ---------- coach ---------- */
    const oSel = ui.obs('Country', '');
    const oYear = ui.obs('Timeline', '');
    const oEvents = ui.obs('Events in view', '');
    const oVisited = ui.obs('Countries opened', '');

    const g = ui.goal(
      'Open dossiers for <b>five</b> different countries.',
      () => ({
        done: visited.size >= 5,
        progress: `${visited.size} of 5 opened`
      })
    );

    coach.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Earth · a country at a time'));
    coach.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Every place is a stack of time'));
    coach.appendChild(ui.h('p', { class: 'lesson-body' },
      'Spin the globe and tap a country for its dossier, then drag the timeline underneath. The same control will scrub a painting’s restoration, a musical form’s evolution, and the history of an idea.'));

    coach.appendChild(ui.section('Goal', g.el));
    coach.appendChild(ui.section('Observables', ui.obsList(oSel, oYear, oEvents, oVisited)));
    coach.appendChild(ui.h('div', { class: 'hairline' }));
    coach.appendChild(ui.note(
      'Geometry: <b>Natural Earth 110m</b> country boundaries, projected live. Borders shown are modern — the full product morphs historical borders from CShapes and OpenHistoricalMap as you scrub. Dated events here are a curated sample, as of 2024.'));

    /* ---- wrap the globe coach, then add the comparison one ---- */
    const coachPrimary = ui.h('div', { class: 'instrument-pane' });
    while (coach.firstChild) coachPrimary.appendChild(coach.firstChild);
    const coachSecond = ui.h('div', { class: 'instrument-pane', style: { display: 'none' } });
    coach.appendChild(coachPrimary);
    coach.appendChild(coachSecond);

    const oPlaceA = ui.obs('Place A', '');
    const oPlaceB = ui.obs('Place B', '');
    const oPlacesOpened = ui.obs('Places opened', '');

    const sPlaceA = ui.slider({
      label: 'First place', min: 1, max: 12, step: 1, value: placeA,
      format: (v) => PLACES[Math.round(v) - 1],
      onInput: (v) => { placeA = Math.round(v); openPlace(placeA); paintSecond(); }
    });
    const sPlaceB = ui.slider({
      label: 'Second place', min: 1, max: 12, step: 1, value: placeB,
      format: (v) => PLACES[Math.round(v) - 1],
      onInput: (v) => { placeB = Math.round(v); openPlace(placeB); paintSecond(); }
    });

    const sg = ui.goal(
      'Open dossiers for at least <b>two</b> distinct places using the sliders.',
      () => ({
        done: placesOpened.size >= 2,
        progress: `${placesOpened.size} of 2 opened`
      }),
      'compare'
    );

    coachSecond.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Earth · compare places'));
    coachSecond.appendChild(ui.h('h2', { class: 'lesson-title' }, 'Two places, side by side'));
    coachSecond.appendChild(ui.h('p', { class: 'lesson-body' },
      'Pick two places from the curated list. Each one you choose is marked as opened; bring the count to two distinct places to finish.'));
    coachSecond.appendChild(ui.section('Goal', sg.el));
    coachSecond.appendChild(ui.section('Observables', ui.obsList(oPlaceA, oPlaceB, oPlacesOpened)));
    coachSecond.appendChild(ui.section('Controls', ui.controls(sPlaceA.el, sPlaceB.el)));
    coachSecond.appendChild(ui.h('div', { class: 'hairline' }));
    coachSecond.appendChild(ui.note(
      'This panel reuses the twelve country names from the sample dossiers and nothing else about them. It compares labels, not places.'));

    function setInstrument(id) {
      instrument = id;
      panePrimary.style.display = id === 'earth' ? '' : 'none';
      paneSecond.style.display = id === 'compare' ? '' : 'none';
      coachPrimary.style.display = id === 'earth' ? '' : 'none';
      coachSecond.style.display = id === 'compare' ? '' : 'none';
      switchSeg.select(id);
      contract.selectInstrument(id);
      if (id === 'compare') paintSecond(); else { fit.resize(); draw(); }
      contract.useGoal(id);
    }
    const switchSeg = ui.segmented(
      [{ id: 'earth', label: 'Globe' }, { id: 'compare', label: 'Compare' }],
      'earth', (id) => setInstrument(id));
    coach.appendChild(switchSeg);
    contract.registerInstrument({ id: 'earth', activate: () => setInstrument('earth') });
    contract.registerInstrument({ id: 'compare', activate: () => setInstrument('compare') });

    /* ---------- loop ---------- */
    const stop = ui.addTicker((dt) => {
      if (instrument !== 'earth') {
        oPlaceA.set(PLACES[placeA - 1]);
        oPlaceB.set(PLACES[placeB - 1]);
        oPlacesOpened.set(String(placesOpened.size));
        sg.update();
        api.markDone(sg.done);
        return;
      }
      if (!dragging) {
        const decay = Math.exp(-3.2 * dt);
        rotLon += (3.0 + velLon) * dt;
        rotLat = ui.clamp(rotLat + velLat * dt, -82, 82);
        velLon *= decay;
        velLat *= decay;
        if (Math.abs(velLon) < 0.2) velLon = 0;
        if (Math.abs(velLat) < 0.2) velLat = 0;
      }
      if (rotLon > 180) rotLon -= 360;
      if (rotLon < -180) rotLon += 360;

      draw();

      oSel.set(selectedIdx >= 0 ? countries[selectedIdx].name : '—', selectedIdx >= 0);
      oYear.set(String(year));
      const f = selectedIdx >= 0 ? FACTS[countries[selectedIdx].name] : null;
      oEvents.set(f ? String(f.events.filter((e) => e[0] <= year).length) : '—');
      oVisited.set(String(visited.size));
      g.update();
      api.markDone(g.done);
    });

    return () => {
      stop();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', release);
      canvas.removeEventListener('pointercancel', onCancel);
      canvas.removeEventListener('wheel', onWheel);
      yearInput.removeEventListener('input', onYearInput);
      fit.destroy();
    };
  }
};
