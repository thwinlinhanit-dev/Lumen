/* ==========================================================================
   Chemistry — the periodic table as a map of tendencies
   ========================================================================== */

import * as ui from '../ui.js';

/* symbol, name, Z, category, atomic mass, Pauling electronegativity (null = n/a) */
const ELEMENTS = [
  ['H', 'Hydrogen', 1, 'nonmetal', 1.008, 2.20],
  ['He', 'Helium', 2, 'noble', 4.0026, null],
  ['Li', 'Lithium', 3, 'alkali', 6.94, 0.98],
  ['Be', 'Beryllium', 4, 'alkaline', 9.0122, 1.57],
  ['B', 'Boron', 5, 'metalloid', 10.81, 2.04],
  ['C', 'Carbon', 6, 'nonmetal', 12.011, 2.55],
  ['N', 'Nitrogen', 7, 'nonmetal', 14.007, 3.04],
  ['O', 'Oxygen', 8, 'nonmetal', 15.999, 3.44],
  ['F', 'Fluorine', 9, 'halogen', 18.998, 3.98],
  ['Ne', 'Neon', 10, 'noble', 20.180, null],
  ['Na', 'Sodium', 11, 'alkali', 22.990, 0.93],
  ['Mg', 'Magnesium', 12, 'alkaline', 24.305, 1.31],
  ['Al', 'Aluminium', 13, 'post', 26.982, 1.61],
  ['Si', 'Silicon', 14, 'metalloid', 28.085, 1.90],
  ['P', 'Phosphorus', 15, 'nonmetal', 30.974, 2.19],
  ['S', 'Sulfur', 16, 'nonmetal', 32.06, 2.58],
  ['Cl', 'Chlorine', 17, 'halogen', 35.45, 3.16],
  ['Ar', 'Argon', 18, 'noble', 39.948, null],
  ['K', 'Potassium', 19, 'alkali', 39.098, 0.82],
  ['Ca', 'Calcium', 20, 'alkaline', 40.078, 1.00],
  ['Sc', 'Scandium', 21, 'transition', 44.956, 1.36],
  ['Ti', 'Titanium', 22, 'transition', 47.867, 1.54],
  ['V', 'Vanadium', 23, 'transition', 50.942, 1.63],
  ['Cr', 'Chromium', 24, 'transition', 51.996, 1.66],
  ['Mn', 'Manganese', 25, 'transition', 54.938, 1.55],
  ['Fe', 'Iron', 26, 'transition', 55.845, 1.83],
  ['Co', 'Cobalt', 27, 'transition', 58.933, 1.88],
  ['Ni', 'Nickel', 28, 'transition', 58.693, 1.91],
  ['Cu', 'Copper', 29, 'transition', 63.546, 1.90],
  ['Zn', 'Zinc', 30, 'transition', 65.38, 1.65],
  ['Ga', 'Gallium', 31, 'post', 69.723, 1.81],
  ['Ge', 'Germanium', 32, 'metalloid', 72.630, 2.01],
  ['As', 'Arsenic', 33, 'metalloid', 74.922, 2.18],
  ['Se', 'Selenium', 34, 'nonmetal', 78.971, 2.55],
  ['Br', 'Bromine', 35, 'halogen', 79.904, 2.96],
  ['Kr', 'Krypton', 36, 'noble', 83.798, null],
  ['Rb', 'Rubidium', 37, 'alkali', 85.468, 0.82],
  ['Sr', 'Strontium', 38, 'alkaline', 87.62, 0.95],
  ['Y', 'Yttrium', 39, 'transition', 88.906, 1.22],
  ['Zr', 'Zirconium', 40, 'transition', 91.224, 1.33],
  ['Nb', 'Niobium', 41, 'transition', 92.906, 1.60],
  ['Mo', 'Molybdenum', 42, 'transition', 95.95, 2.16],
  ['Tc', 'Technetium', 43, 'transition', 98, 1.90],
  ['Ru', 'Ruthenium', 44, 'transition', 101.07, 2.20],
  ['Rh', 'Rhodium', 45, 'transition', 102.91, 2.28],
  ['Pd', 'Palladium', 46, 'transition', 106.42, 2.20],
  ['Ag', 'Silver', 47, 'transition', 107.87, 1.93],
  ['Cd', 'Cadmium', 48, 'transition', 112.41, 1.69],
  ['In', 'Indium', 49, 'post', 114.82, 1.78],
  ['Sn', 'Tin', 50, 'post', 118.71, 1.96],
  ['Sb', 'Antimony', 51, 'metalloid', 121.76, 2.05],
  ['Te', 'Tellurium', 52, 'metalloid', 127.60, 2.10],
  ['I', 'Iodine', 53, 'halogen', 126.90, 2.66],
  ['Xe', 'Xenon', 54, 'noble', 131.29, null],
  ['Cs', 'Caesium', 55, 'alkali', 132.91, 0.79],
  ['Ba', 'Barium', 56, 'alkaline', 137.33, 0.89],
  ['La', 'Lanthanum', 57, 'lanthanide', 138.91, 1.10],
  ['Ce', 'Cerium', 58, 'lanthanide', 140.12, 1.12],
  ['Pr', 'Praseodymium', 59, 'lanthanide', 140.91, 1.13],
  ['Nd', 'Neodymium', 60, 'lanthanide', 144.24, 1.14],
  ['Pm', 'Promethium', 61, 'lanthanide', 145, null],
  ['Sm', 'Samarium', 62, 'lanthanide', 150.36, 1.17],
  ['Eu', 'Europium', 63, 'lanthanide', 151.96, null],
  ['Gd', 'Gadolinium', 64, 'lanthanide', 157.25, 1.20],
  ['Tb', 'Terbium', 65, 'lanthanide', 158.93, null],
  ['Dy', 'Dysprosium', 66, 'lanthanide', 162.50, 1.22],
  ['Ho', 'Holmium', 67, 'lanthanide', 164.93, 1.23],
  ['Er', 'Erbium', 68, 'lanthanide', 167.26, 1.24],
  ['Tm', 'Thulium', 69, 'lanthanide', 168.93, 1.25],
  ['Yb', 'Ytterbium', 70, 'lanthanide', 173.05, null],
  ['Lu', 'Lutetium', 71, 'lanthanide', 174.97, 1.27],
  ['Hf', 'Hafnium', 72, 'transition', 178.49, 1.30],
  ['Ta', 'Tantalum', 73, 'transition', 180.95, 1.50],
  ['W', 'Tungsten', 74, 'transition', 183.84, 2.36],
  ['Re', 'Rhenium', 75, 'transition', 186.21, 1.90],
  ['Os', 'Osmium', 76, 'transition', 190.23, 2.20],
  ['Ir', 'Iridium', 77, 'transition', 192.22, 2.20],
  ['Pt', 'Platinum', 78, 'transition', 195.08, 2.28],
  ['Au', 'Gold', 79, 'transition', 196.97, 2.54],
  ['Hg', 'Mercury', 80, 'transition', 200.59, 2.00],
  ['Tl', 'Thallium', 81, 'post', 204.38, 1.62],
  ['Pb', 'Lead', 82, 'post', 207.2, 2.33],
  ['Bi', 'Bismuth', 83, 'post', 208.98, 2.02],
  ['Po', 'Polonium', 84, 'post', 209, 2.00],
  ['At', 'Astatine', 85, 'halogen', 210, 2.20],
  ['Rn', 'Radon', 86, 'noble', 222, null],
  ['Fr', 'Francium', 87, 'alkali', 223, 0.70],
  ['Ra', 'Radium', 88, 'alkaline', 226, 0.90],
  ['Ac', 'Actinium', 89, 'actinide', 227, 1.10],
  ['Th', 'Thorium', 90, 'actinide', 232.04, 1.30],
  ['Pa', 'Protactinium', 91, 'actinide', 231.04, 1.50],
  ['U', 'Uranium', 92, 'actinide', 238.03, 1.38],
  ['Np', 'Neptunium', 93, 'actinide', 237, 1.36],
  ['Pu', 'Plutonium', 94, 'actinide', 244, 1.28],
  ['Am', 'Americium', 95, 'actinide', 243, 1.13],
  ['Cm', 'Curium', 96, 'actinide', 247, 1.28],
  ['Bk', 'Berkelium', 97, 'actinide', 247, 1.30],
  ['Cf', 'Californium', 98, 'actinide', 251, 1.30],
  ['Es', 'Einsteinium', 99, 'actinide', 252, 1.30],
  ['Fm', 'Fermium', 100, 'actinide', 257, 1.30],
  ['Md', 'Mendelevium', 101, 'actinide', 258, 1.30],
  ['No', 'Nobelium', 102, 'actinide', 259, 1.30],
  ['Lr', 'Lawrencium', 103, 'actinide', 266, 1.30],
  ['Rf', 'Rutherfordium', 104, 'transition', 267, null],
  ['Db', 'Dubnium', 105, 'transition', 268, null],
  ['Sg', 'Seaborgium', 106, 'transition', 269, null],
  ['Bh', 'Bohrium', 107, 'transition', 270, null],
  ['Hs', 'Hassium', 108, 'transition', 269, null],
  ['Mt', 'Meitnerium', 109, 'transition', 278, null],
  ['Ds', 'Darmstadtium', 110, 'transition', 281, null],
  ['Rg', 'Roentgenium', 111, 'transition', 282, null],
  ['Cn', 'Copernicium', 112, 'transition', 285, null],
  ['Nh', 'Nihonium', 113, 'post', 286, null],
  ['Fl', 'Flerovium', 114, 'post', 289, null],
  ['Mc', 'Moscovium', 115, 'post', 290, null],
  ['Lv', 'Livermorium', 116, 'post', 293, null],
  ['Ts', 'Tennessine', 117, 'halogen', 294, null],
  ['Og', 'Oganesson', 118, 'noble', 294, null]
];

const CAT_LABEL = {
  alkali: 'Alkali metal',
  alkaline: 'Alkaline earth',
  transition: 'Transition metal',
  post: 'Post-transition metal',
  metalloid: 'Metalloid',
  nonmetal: 'Reactive nonmetal',
  halogen: 'Halogen',
  noble: 'Noble gas',
  lanthanide: 'Lanthanide',
  actinide: 'Actinide'
};

function gridPos(z) {
  if (z === 1) return [1, 1];
  if (z === 2) return [18, 1];
  const small = [1, 2, 13, 14, 15, 16, 17, 18];
  if (z <= 10) return [small[z - 3], 2];
  if (z <= 18) return [small[z - 11], 3];
  if (z <= 36) return [z - 18, 4];
  if (z <= 54) return [z - 36, 5];
  if (z <= 56) return [z - 54, 6];
  if (z <= 71) return [3 + (z - 57), 9];
  if (z <= 86) return [4 + (z - 72), 6];
  if (z <= 88) return [z - 86, 7];
  if (z <= 103) return [3 + (z - 89), 10];
  return [4 + (z - 104), 7];
}

function ramp(t, from, to) {
  const a = ui.hexToRgb(from), b = ui.hexToRgb(to);
  t = ui.clamp(t, 0, 1);
  return `rgb(${Math.round(ui.lerp(a.r, b.r, t))},${Math.round(ui.lerp(a.g, b.g, t))},${Math.round(ui.lerp(a.b, b.b, t))})`;
}

export default {
  id: 'chem',
  name: 'Chemistry',
  sub: 'Periodic table',
  accent: '#34d399',
  fade: false,
  glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 3.2l7.3 4.2v8.4L12 20l-7.3-4.2V7.4z"/>
    <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" opacity=".85"/>
  </svg>`,

  mount(stage, coach, api) {
    let mode = 'cat';
    let selected = null;
    let hovered = null;
    let sZ = null;
    const visited = new Set();

    const wrap = ui.h('div', { class: 'pt-wrap' });
    const grid = ui.h('div', { class: 'pt-grid', style: { minHeight: '330px' } });
    wrap.appendChild(grid);
    stage.appendChild(wrap);

    const legend = ui.h('div', { class: 'legend' });
    wrap.appendChild(legend);

    const cells = new Map();

    function buildTable() {
      for (const [sym, name, z, cat, mass, en] of ELEMENTS) {
        const [col, row] = gridPos(z);
        const cell = ui.h('button', {
          class: 'el',
          type: 'button',
          'aria-selected': 'false',
          dataset: { cat },
          style: { gridColumn: String(col), gridRow: String(row) },
          'aria-label': `${name}, atomic number ${z}`,
          onclick: () => select(z)
        },
          ui.h('span', { class: 'z' }, String(z)),
          ui.h('span', { class: 'sym' }, sym),
          ui.h('span', { class: 'nm' }, name));
        cell._data = { sym, name, z, cat, mass, en };
        cells.set(z, cell);
        grid.appendChild(cell);
      }
      grid.appendChild(ui.h('button', {
        class: 'el placeholder', type: 'button', disabled: true,
        style: { gridColumn: '3', gridRow: '6' }
      }, '57–71'));
      grid.appendChild(ui.h('button', {
        class: 'el placeholder', type: 'button', disabled: true,
        style: { gridColumn: '3', gridRow: '7' }
      }, '89–103'));
    }

    function paintMode() {
      for (const [, cell] of cells) {
        const { mass, en } = cell._data;
        if (mode === 'cat') {
          cell.style.background = '';
        } else if (mode === 'en') {
          cell.style.background = en == null
            ? 'rgba(255,255,255,0.05)'
            : ramp((en - 0.7) / 3.28, '#22303f', '#ff9a5c');
        } else {
          cell.style.background = ramp(mass / 294, '#1d2430', '#8fd0ff');
        }
      }
      legend.innerHTML = '';
      if (mode === 'cat') {
        const cats = ['alkali', 'alkaline', 'transition', 'post', 'metalloid', 'nonmetal', 'halogen', 'noble', 'lanthanide', 'actinide'];
        const swatch = {
          alkali: '#ff8a5c', alkaline: '#ffc45c', transition: '#5ac8fa', post: '#7ed9be',
          metalloid: '#c49aff', nonmetal: '#3ddc97', halogen: '#ff7ac2', noble: '#8ca0ff',
          lanthanide: '#78e6d2', actinide: '#a0d7ff'
        };
        for (const c of cats) {
          legend.appendChild(ui.h('span', {},
            ui.h('i', { style: { background: swatch[c] } }), CAT_LABEL[c]));
        }
      } else {
        legend.appendChild(ui.h('span', {}, mode === 'en'
          ? 'Low electronegativity → high (white where no reliable value exists)'
          : 'Lightest → heaviest'));
      }
    }

    function select(z) {
      selected = z;
      if (sZ) sZ.set(z);
      for (const [cz, cell] of cells) {
        cell.setAttribute('aria-selected', String(cz === z));
        cell.classList.toggle('dim', z !== null && cz !== z);
      }
      visited.add(z);
      drawCard();
    }

    /* ---------- element card ---------- */
    let card = null;
    function drawCard() {
      if (!selected) return;
      const cell = cells.get(selected);
      const el = cell._data;
      if (!card) {
        card = ui.h('div', { class: 'el-card' });
        stage.appendChild(card);
      }
      card.innerHTML = '';
      card.appendChild(ui.h('div', { class: 'big' },
        ui.h('span', { class: 's' }, el.sym),
        ui.h('span', { class: 'z' }, `Z ${el.z}`)));
      card.appendChild(ui.h('div', { class: 'n' }, el.name));
      card.appendChild(ui.h('div', { class: 'c' }, CAT_LABEL[el.cat]));

      const period = el.z <= 2 ? 1 : el.z <= 10 ? 2 : el.z <= 18 ? 3 : el.z <= 36 ? 4 : el.z <= 54 ? 5 : el.z <= 86 ? 6 : 7;
      const group = el.cat === 'lanthanide' || el.cat === 'actinide' ? 'f-block' : String(gridPos(el.z)[0]);

      const dl = ui.h('dl', {},
        ui.h('dt', {}, 'Mass'), ui.h('dd', {}, el.mass != null ? `${el.mass} u` : '—'),
        ui.h('dt', {}, 'Electronegativity'), ui.h('dd', {}, el.en != null ? el.en.toFixed(2) : '—'),
        ui.h('dt', {}, 'Group'), ui.h('dd', {}, group),
        ui.h('dt', {}, 'Period'), ui.h('dd', {}, String(period)));
      card.appendChild(dl);

      const tc = ui.h('canvas', { class: 'trend-canvas' });
      card.appendChild(tc);
      drawTrend(tc, el.z);
    }

    function drawTrend(canvas, highlightZ) {
      const w = 168, h = 54;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const c = canvas.getContext('2d');
      c.setTransform(dpr, 0, 0, dpr, 0, 0);

      const pts = ELEMENTS.filter((e) => e[5] != null);
      const max = 4.1;

      c.strokeStyle = 'rgba(255,255,255,0.14)';
      c.lineWidth = 1;
      c.beginPath();
      pts.forEach((e, i) => {
        const x = ((e[2] - 1) / 117) * w;
        const y = h - (e[5] / max) * h;
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
      });
      c.stroke();

      for (const e of pts) {
        const x = ((e[2] - 1) / 117) * w;
        const y = h - (e[5] / max) * h;
        c.beginPath();
        c.arc(x, y, e[2] === highlightZ ? 2.6 : 1.1, 0, Math.PI * 2);
        c.fillStyle = e[2] === highlightZ ? '#ffffff' : 'rgba(52,211,153,0.55)';
        c.fill();
      }
    }

    /* ---------- coach ---------- */
    const oSel = ui.obs('Selected', '');
    const oEn = ui.obs('Electronegativity', '');
    const oSeen = ui.obs('Elements opened', '');
    const oCat = ui.obs('Family', '');

    const seg = ui.segmented([
      { id: 'cat', label: 'Family' },
      { id: 'en', label: 'Pulling power' },
      { id: 'mass', label: 'Mass' }
    ], 'cat', (id) => { mode = id; paintMode(); });

    const g = ui.goal(
      'Find the element that pulls electrons hardest of all.',
      () => {
        const en = cells.get(selected)?._data?.en;
        const best = Math.max(...ELEMENTS.filter((e) => e[5] != null).map((e) => e[5]));
        return { done: en === best, progress: `${visited.size} opened · strongest so far ${best.toFixed(2)}` };
      }
    );

    sZ = ui.slider({
      label: 'Atomic number',
      min: 1, max: 118, step: 1, value: 6,
      format: (v) => String(Math.round(v)),
      onInput: (v) => select(Math.round(v))
    });

    coach.appendChild(ui.h('div', { class: 'kicker' },
      ui.h('span', { class: 'bar' }), 'Chemistry · periodicity'));
    coach.appendChild(ui.h('h2', { class: 'lesson-title' }, 'The table is a map of tendencies'));
    coach.appendChild(ui.h('p', { class: 'lesson-body' },
      'Rows are shells filling up; columns are families with the same appetite. Colour the table by one property and the diagonal patterns jump out — that shape is chemistry.'));

    coach.appendChild(ui.section('Goal', g.el));
    coach.appendChild(ui.section('Selection', ui.obsList(oSel, oCat, oEn, oSeen)));
    coach.appendChild(ui.section('Element', ui.controls(sZ.el)));
    coach.appendChild(ui.section('Colour the table by', seg));
    coach.appendChild(ui.h('div', { class: 'hairline' }));
    coach.appendChild(ui.note(
      'Mockup dataset: <b>118 elements</b>, masses and Pauling electronegativities. Tap any element. The full product pulls live from PubChem and links each element to the minerals, pigments and molecules it appears in.'));

    buildTable();
    paintMode();
    select(6);

    const timer = setInterval(() => {
      const el = selected ? cells.get(selected)._data : null;
      oSel.set(el ? el.sym : '—', !!el);
      oCat.set(el ? CAT_LABEL[el.cat] : '—');
      oEn.set(el && el.en != null ? el.en.toFixed(2) : '—');
      oSeen.set(String(visited.size));
      g.update();
      api.markDone(g.done);
    }, 220);

    return () => {
      clearInterval(timer);
      if (card) card.remove();
    };
  }
};
