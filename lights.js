import { rewards, rewardCard, getStore, saveStore, connectStore, syncMode, onStore, tiltCard } from './game.js';

/* ===== Světelná cedule: hlavolam se žárovkami, karty 25–32 ===== */

const lEsc = (v = '') => String(v).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const lLevels = [
  {n:1, name:'Zkouška světel', mask:['###','###','###']},
  {n:2, name:'Klubová cedule', mask:['####','####','####','####']},
  {n:3, name:'Kříž', mask:['..#..','.###.','#####','.###.','..#..']},
  {n:4, name:'Hvězda Starchilda', mask:['...#...','..###..','#######','.#####.','..###..','.##.##.','##...##']},
  {n:5, name:'Spacemanův blesk', mask:['...###','..###.','.###..','######','..###.','.###..','###...']},
  {n:6, name:'Démonův netopýr', mask:['#.......#','##.#.#.##','#########','.#######.','...#.#...']},
  {n:7, name:'Velká cedule', mask:['######','######','######','######','######']},
  {n:8, name:'Madison Square Garden', mask:['#######','#######','#######','#######','#######','#######']}
];

/* ---------- logika: přepnutí žárovky a sousedů, řešení nad GF(2) ---------- */
function lCells(mask) {
  const cells = [];
  mask.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === '#') cells.push([r, c]); }));
  return cells;
}
function lNeighbours(cells) {
  const idx = new Map(cells.map(([r, c], i) => [r + ',' + c, i]));
  return cells.map(([r, c], i) => [i, ...[[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].map(([y, x]) => idx.get(y + ',' + x)).filter((k) => k !== undefined)]);
}
function lPress(state, nb, i) { for (const k of nb[i]) state[k] = !state[k]; }
function lSolve(state, nb) {
  const n = state.length;
  const rows = nb.map((_, j) => { const row = Array(n + 1).fill(0); return row; });
  for (let i = 0; i < n; i++) for (const k of nb[i]) rows[k][i] = 1;
  for (let k = 0; k < n; k++) rows[k][n] = state[k] ? 0 : 1;
  const pivots = [];
  let r = 0;
  for (let c = 0; c < n && r < n; c++) {
    let p = r; while (p < n && !rows[p][c]) p++;
    if (p === n) continue;
    [rows[r], rows[p]] = [rows[p], rows[r]];
    for (let i = 0; i < n; i++) if (i !== r && rows[i][c]) for (let j = c; j <= n; j++) rows[i][j] ^= rows[r][j];
    pivots.push(c); r++;
  }
  for (let i = r; i < n; i++) if (rows[i][n]) return null;
  const x = Array(n).fill(0);
  pivots.forEach((c, i) => { x[c] = rows[i][n]; });
  return x.map((v, i) => v ? i : -1).filter((i) => i >= 0);
}

/* ---------- vykreslení ---------- */
let lRoot = null, lView = {screen:'home'}, lHooked = false;
const lDone = (n) => !!getStore().done[24 + n];

export function lightsPage() { return '<div class="shell page lights-page" id="lights-root"></div>'; }

export function mountLights() {
  lRoot = document.getElementById('lights-root');
  if (!lRoot) return;
  lView = {screen:'home'};
  lRoot.addEventListener('click', lClick);
  lRoot.addEventListener('pointermove', tiltCard);
  if (!lHooked) { lHooked = true; onStore(() => { if (lRoot && lRoot.isConnected && lView.screen === 'home') lHome(); }); }
  lHome();
  connectStore();
}

function lHome() {
  const st = getStore();
  const done = lLevels.filter((l) => lDone(l.n)).length;
  const next = lLevels.find((l) => !lDone(l.n));
  lRoot.innerHTML = '<header class="section-head"><p class="eyebrow">Hra</p><h1>Světelná cedule</h1>'
    + '<p class="lede">Rozbitá cedule po koncertu. Ťuknutí na žárovku přepne ji i čtyři sousední, rozsvícené zhasnou a zhasnuté se rozsvítí. Rozsviť celou ceduli. Kdo to zvládne bez nápovědy a v limitu tahů, získá lesklou edici karty.</p></header>'
    + '<div class="g-stats"><div><b>' + done + '</b><span>z 8 karet</span></div>'
    + '<p class="g-sync">' + (syncMode() === 'cloud' ? 'Sbírka se ukládá do tvého účtu a je stejná na všech zařízeních.' : 'Sbírka se ukládá v tomto prohlížeči.') + '</p></div>'
    + (next ? '<button type="button" class="button primary" data-llevel="' + next.n + '">' + (done ? 'Pokračovat: level ' + next.n : 'Rozsvítit první ceduli') + ' <span aria-hidden="true">→</span></button>'
            : '<p class="g-all">Všech osm cedulí svítí. Každá nová hra je jinak rozbitá.</p>')
    + '<h2 class="g-h2">Levely</h2><ol class="g-levels">' + lLevels.map((l) => {
        const open = l.n === 1 || lDone(l.n - 1) || lDone(l.n);
        const b = st.lbest[l.n];
        return '<li><button type="button" class="g-level' + (lDone(l.n) ? ' is-done' : '') + '"' + (open ? ' data-llevel="' + l.n + '"' : ' disabled') + '>'
          + '<span class="g-ln">' + l.n + '</span><span class="g-lname">' + lEsc(l.name) + '</span>'
          + '<span class="g-lmeta">' + lCells(l.mask).length + ' žárovek' + (b != null ? ' · nejlépe ' + b + ' tahů' : '') + '</span>'
          + '<span class="g-lstate">' + (lDone(l.n) ? (st.foil[24 + l.n] ? '✦' : '✓') : open ? '▶' : '🔒') + '</span></button></li>';
      }).join('') + '</ol>'
    + '<h2 class="g-h2">Sbírka ze světelné cedule</h2><div class="g-collection">' + rewards.slice(24, 32).map((r) => rewardCard(r)).join('') + '</div>'
    + '<div class="g-modal" hidden></div>';
}

function lStart(n) {
  const level = lLevels.find((l) => l.n === n);
  const cells = lCells(level.mask), nb = lNeighbours(cells);
  const state = Array(cells.length).fill(true);
  const min = Math.max(3, Math.round(cells.length * 0.22));
  let tries = 0, sol = [];
  do {
    state.fill(true);
    cells.forEach((_, i) => { if (Math.random() < 0.38) lPress(state, nb, i); });
    sol = lSolve(state, nb) || [];
  } while ((state.every(Boolean) || sol.length < min) && ++tries < 60);
  const par = sol.length + (n >= 6 ? 2 : 1);
  lView = {screen:'play', level, cells, nb, state, moves:0, par, hints:0, over:false, hint:-1};
  const rows = level.mask.length, cols = Math.max(...level.mask.map((r) => r.length));
  lRoot.innerHTML = '<div class="lt-play"><div class="g-bar"><button type="button" class="back g-back" data-lhome>← Levely</button>'
    + '<h1 class="g-title">Level ' + n + ' · ' + lEsc(level.name) + '</h1><div class="g-hud"><span data-l="moves"></span><span data-l="par"></span><span data-l="on"></span></div></div>'
    + '<div class="lt-board" style="--cols:' + cols + ';--rows:' + rows + '">' + cells.map(([r, c], i) =>
        '<button type="button" class="lt-bulb" data-bulb="' + i + '" style="grid-row:' + (r + 1) + ';grid-column:' + (c + 1) + '"><span></span></button>').join('') + '</div>'
    + '<div class="sd-tools"><button type="button" class="button secondary" data-lhint>Nápověda</button><button type="button" class="button secondary" data-llevel="' + n + '">Nová cedule</button></div></div>'
    + '<div class="g-modal" hidden></div>';
  lRoot.scrollIntoView({block:'start'});
  lRender();
}

function lRender() {
  const v = lView;
  lRoot.querySelectorAll('.lt-bulb').forEach((el) => {
    const i = +el.dataset.bulb;
    el.classList.toggle('on', v.state[i]);
    el.classList.toggle('hint', i === v.hint);
    el.setAttribute('aria-label', 'Žárovka ' + (i + 1) + (v.state[i] ? ', svítí' : ', zhasnutá'));
    el.setAttribute('aria-pressed', v.state[i] ? 'true' : 'false');
  });
  const set = (k, t) => { const e = lRoot.querySelector('[data-l="' + k + '"]'); if (e) e.textContent = t; };
  set('moves', 'Tahy: ' + v.moves);
  set('par', 'Limit: ' + v.par);
  set('on', 'Svítí: ' + v.state.filter(Boolean).length + ' / ' + v.state.length);
  const p = lRoot.querySelector('[data-l="par"]'); if (p) p.classList.toggle('warn', v.moves > v.par);
}

function lTap(i) {
  const v = lView;
  if (v.over) return;
  lPress(v.state, v.nb, i);
  v.moves++; v.hint = -1;
  for (const k of v.nb[i]) { const el = lRoot.querySelector('[data-bulb="' + k + '"]'); if (el) { el.classList.remove('flick'); void el.offsetWidth; el.classList.add('flick'); } }
  lRender();
  if (v.state.every(Boolean)) lWin();
}

function lHint() {
  const v = lView;
  if (v.over) return;
  const sol = lSolve(v.state, v.nb);
  if (!sol || !sol.length) return;
  v.hints++; v.hint = sol[Math.floor(Math.random() * sol.length)];
  lRender();
}

function lWin() {
  const v = lView; v.over = true;
  const n = v.level.n, st = getStore();
  const first = !st.done[24 + n];
  const earned = v.hints === 0 && v.moves <= v.par;
  const newFoil = earned && !st.foil[24 + n];
  st.done[24 + n] = true;
  if (earned) st.foil[24 + n] = true;
  const rec = st.lbest[n] == null || v.moves < st.lbest[n];
  if (rec) st.lbest[n] = v.moves;
  saveStore();
  lRoot.querySelector('.lt-board')?.classList.add('lit');
  const next = lLevels.find((l) => l.n === n + 1);
  setTimeout(() => {
    const m = lRoot.querySelector('.g-modal');
    m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><p class="eyebrow">Level ' + n + ' · ' + v.moves + ' tahů (limit ' + v.par + ')' + (rec ? ' · rekord' : '') + '</p>'
      + '<h2>' + (first ? 'Cedule svítí! Nová karta' : 'Cedule svítí!') + '</h2>'
      + '<div class="g-reveal' + (first || newFoil ? ' fresh' : '') + '">' + rewardCard(rewards[24 + n - 1]) + '</div>'
      + (newFoil ? '<p class="g-note ok">V limitu a bez nápovědy: karta je teď v lesklé edici.</p>' : !st.foil[24 + n] ? '<p class="g-note">Lesklou edici získáš v limitu ' + v.par + ' tahů a bez nápovědy.</p>' : '')
      + '<div class="g-actions">' + (next ? '<button type="button" class="button primary" data-llevel="' + next.n + '">Další level ' + next.n + ' →</button>' : '<button type="button" class="button primary" data-llevel="' + n + '">Nová cedule</button>')
      + '<button type="button" class="button secondary" data-lhome>Sbírka a levely</button></div></div>';
    m.hidden = false; m.querySelector('button')?.focus({preventScroll:true});
  }, 1300);
}

function lClick(e) {
  const b = e.target.closest('button');
  if (!b || !lRoot.contains(b)) return;
  if (b.dataset.llevel) { lStart(+b.dataset.llevel); return; }
  if (b.hasAttribute('data-lhome')) { lView = {screen:'home'}; lHome(); lRoot.scrollIntoView({block:'start'}); return; }
  if (b.dataset.bulb !== undefined) { lTap(+b.dataset.bulb); return; }
  if (b.hasAttribute('data-lhint')) { lHint(); return; }
  if (b.dataset.zoom && !b.closest('.g-modal')) {
    const m = lRoot.querySelector('.g-modal');
    m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><div class="g-zoom">' + rewardCard(rewards[+b.dataset.zoom - 1]) + '</div><div class="g-actions"><button type="button" class="button secondary" data-lclose>Zavřít</button></div></div>';
    m.hidden = false; return;
  }
  if (b.hasAttribute('data-lclose')) { const m = lRoot.querySelector('.g-modal'); m.hidden = true; m.innerHTML = ''; }
}
