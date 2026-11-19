import { rewards, rewardCard, getStore, saveStore, connectStore, syncMode, onStore, tiltCard } from './game.js';

/* ===== Čtyři tváře: sudoku se symboly masek, karty 17–24 ===== */

const sEsc = (v = '') => String(v).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sShuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const sSyms = [
  {id:'star', name:'Hvězda', tint:'#ff6fb4'},
  {id:'bat', name:'Netopýr', tint:'#ff4a2a'},
  {id:'bolt', name:'Blesk', tint:'#8fc4ff'},
  {id:'claw', name:'Drápy', tint:'#4ee38a'},
  {id:'fox', name:'Liška', tint:'#ff9a3c'},
  {id:'ankh', name:'Ankh', tint:'#f1c84a'}
];

export const sLevels = [
  {n:1, size:4, givens:10, name:'Zkouška zvuku'},
  {n:2, size:4, givens:8, name:'Šatna'},
  {n:3, size:4, givens:6, name:'Čtyři tváře'},
  {n:4, size:6, givens:24, name:'Přichází liška'},
  {n:5, size:6, givens:20, name:'Ankh Warrior'},
  {n:6, size:6, givens:17, name:'Šest tváří'},
  {n:7, size:6, givens:14, name:'Bez masek'},
  {n:8, size:6, givens:12, name:'Mistrovská hádanka'}
];

/* ---------- generátor a řešitel ---------- */
function sBox(size) { return size === 4 ? [2, 2] : [2, 3]; }
function sCanPlace(g, size, r, c, v) {
  const [bh, bw] = sBox(size);
  for (let i = 0; i < size; i++) if (g[r * size + i] === v || g[i * size + c] === v) return false;
  const br = r - r % bh, bc = c - c % bw;
  for (let y = br; y < br + bh; y++) for (let x = bc; x < bc + bw; x++) if (g[y * size + x] === v) return false;
  return true;
}
function sSolve(g, size, limit, random) {
  const i = g.indexOf(-1);
  if (i < 0) return 1;
  const r = Math.floor(i / size), c = i % size;
  let count = 0;
  const vals = random ? sShuffle([...Array(size).keys()]) : [...Array(size).keys()];
  for (const v of vals) {
    if (!sCanPlace(g, size, r, c, v)) continue;
    g[i] = v;
    count += sSolve(g, size, limit - count, random);
    if (count >= limit) { if (!random) g[i] = -1; return count; }
    g[i] = -1;
  }
  return count;
}
function sGenerate(size, givens) {
  const sol = Array(size * size).fill(-1);
  sSolve(sol, size, 1, true);
  const full = sol.slice();
  const puzzle = full.slice();
  let filled = size * size;
  for (const i of sShuffle([...Array(size * size).keys()])) {
    if (filled <= givens) break;
    const keep = puzzle[i];
    puzzle[i] = -1;
    if (sSolve(puzzle.slice(), size, 2, false) !== 1) puzzle[i] = keep; else filled--;
  }
  return {puzzle, solution:full};
}

/* ---------- vykreslení ---------- */
let sRoot = null, sView = {screen:'home'}, sTimer = null, sHooked = false;
const sDone = (n) => !!getStore().done[16 + n];

export function sudokuPage() { return '<div class="shell page sudoku-page" id="sudoku-root"></div>'; }

export function mountSudoku() {
  sRoot = document.getElementById('sudoku-root');
  if (!sRoot) return;
  sView = {screen:'home'};
  sRoot.addEventListener('click', sClick);
  sRoot.addEventListener('pointermove', tiltCard);
  if (!sHooked) { sHooked = true; onStore(() => { if (sRoot && sRoot.isConnected && sView.screen === 'home') sHome(); }); }
  sHome();
  connectStore();
}

function sGlyph(v, size) {
  const s = sSyms[v];
  return '<svg class="sd-glyph" viewBox="-6 -6 112 ' + (s.id === 'bat' ? 72 : 112) + '" style="--tint:' + s.tint + '" aria-hidden="true"><use href="#sym-' + s.id + '"/></svg>';
}

function sHome() {
  const st = getStore();
  const done = sLevels.filter((l) => sDone(l.n)).length;
  const next = sLevels.find((l) => !sDone(l.n));
  const fmt = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  sRoot.innerHTML = '<header class="section-head"><p class="eyebrow">Hra</p><h1>Čtyři tváře</h1>'
    + '<p class="lede">Doplň symboly masek tak, aby v každém řádku, sloupci a orámovaném bloku byl každý právě jednou. Od levelu 4 se k původní čtveřici přidá liška Erica Carra a ankh Vinnieho Vincenta. Vyřešený level odemkne kartu, vyřešený bez nápovědy její lesklou edici.</p></header>'
    + '<div class="g-stats"><div><b>' + done + '</b><span>z 8 karet</span></div>'
    + '<p class="g-sync">' + (syncMode() === 'cloud' ? 'Sbírka se ukládá do tvého účtu a je stejná na všech zařízeních.' : 'Sbírka se ukládá v tomto prohlížeči.') + '</p></div>'
    + (next ? '<button type="button" class="button primary" data-slevel="' + next.n + '">' + (done ? 'Pokračovat: level ' + next.n : 'Začít hrát') + ' <span aria-hidden="true">→</span></button>'
            : '<p class="g-all">Všech osm hádanek vyřešeno. Každá nová hra vygeneruje jinou mřížku.</p>')
    + '<h2 class="g-h2">Levely</h2><ol class="g-levels">' + sLevels.map((l) => {
        const open = l.n === 1 || sDone(l.n - 1) || sDone(l.n);
        const b = st.sbest[l.n];
        return '<li><button type="button" class="g-level' + (sDone(l.n) ? ' is-done' : '') + '"' + (open ? ' data-slevel="' + l.n + '"' : ' disabled') + '>'
          + '<span class="g-ln">' + l.n + '</span><span class="g-lname">' + sEsc(l.name) + '</span>'
          + '<span class="g-lmeta">' + l.size + ' × ' + l.size + (b != null ? ' · rekord ' + fmt(b) : '') + '</span>'
          + '<span class="g-lstate">' + (sDone(l.n) ? (st.foil[16 + l.n] ? '✦' : '✓') : open ? '▶' : '🔒') + '</span></button></li>';
      }).join('') + '</ol>'
    + '<h2 class="g-h2">Sbírka ze Čtyř tváří</h2><div class="g-collection">' + rewards.slice(16, 24).map((r) => rewardCard(r)).join('') + '</div>'
    + '<div class="g-modal" hidden></div>';
}

function sStart(n) {
  const level = sLevels.find((l) => l.n === n);
  const {puzzle, solution} = sGenerate(level.size, level.givens);
  sView = {screen:'play', level, size:level.size, given:puzzle.map((v) => v >= 0), grid:puzzle.slice(), solution, sel:puzzle.indexOf(-1), hints:0, t0:Date.now(), over:false};
  const size = level.size;
  sRoot.innerHTML = '<div class="sd-play"><div class="g-bar"><button type="button" class="back g-back" data-shome>← Levely</button>'
    + '<h1 class="g-title">Level ' + n + ' · ' + sEsc(level.name) + '</h1><div class="g-hud"><span data-s="time"></span><span data-s="left"></span></div></div>'
    + '<div class="sd-grid s' + size + '" style="--n:' + size + '">' + puzzle.map((_, i) => '<button type="button" class="sd-cell" data-cell="' + i + '"></button>').join('') + '</div>'
    + '<div class="sd-pad s' + size + '">' + sSyms.slice(0, size).map((s, v) => '<button type="button" class="sd-key" data-sym="' + v + '" aria-label="' + s.name + '">' + sGlyph(v) + '</button>').join('')
    + '<button type="button" class="sd-key sd-erase" data-sym="-1" aria-label="Smazat">✕</button></div>'
    + '<div class="sd-tools"><button type="button" class="button secondary" data-shint>Nápověda</button><span class="sd-note">Ťukni na políčko, pak na symbol.</span></div></div>'
    + '<div class="g-modal" hidden></div>';
  sRoot.scrollIntoView({block:'start'});
  sRender();
  clearInterval(sTimer);
  sTimer = setInterval(sTick, 500);
  sTick();
}

function sConflicts() {
  const {grid, size} = sView, [bh, bw] = sBox(size), bad = new Set();
  for (let i = 0; i < grid.length; i++) {
    const v = grid[i]; if (v < 0) continue;
    const r = Math.floor(i / size), c = i % size;
    for (let j = 0; j < grid.length; j++) {
      if (j === i || grid[j] !== v) continue;
      const r2 = Math.floor(j / size), c2 = j % size;
      if (r === r2 || c === c2 || (Math.floor(r / bh) === Math.floor(r2 / bh) && Math.floor(c / bw) === Math.floor(c2 / bw))) { bad.add(i); bad.add(j); }
    }
  }
  return bad;
}

function sRender() {
  const v = sView, [bh, bw] = sBox(v.size), bad = sConflicts();
  const sr = Math.floor(v.sel / v.size), sc = v.sel % v.size;
  sRoot.querySelectorAll('.sd-cell').forEach((el) => {
    const i = +el.dataset.cell, r = Math.floor(i / v.size), c = i % v.size, val = v.grid[i];
    el.innerHTML = val >= 0 ? sGlyph(val) : '';
    el.className = 'sd-cell' + (v.given[i] ? ' given' : '') + (i === v.sel ? ' sel' : '')
      + (v.sel >= 0 && (r === sr || c === sc || (Math.floor(r / bh) === Math.floor(sr / bh) && Math.floor(c / bw) === Math.floor(sc / bw))) ? ' peer' : '')
      + (bad.has(i) ? ' bad' : '') + (c % bw === bw - 1 && c < v.size - 1 ? ' br' : '') + (r % bh === bh - 1 && r < v.size - 1 ? ' bb' : '')
      + (val >= 0 && v.sel >= 0 && val === v.grid[v.sel] ? ' same' : '');
    el.setAttribute('aria-label', 'Řádek ' + (r + 1) + ', sloupec ' + (c + 1) + (val >= 0 ? ', ' + sSyms[val].name : ', prázdné'));
  });
  const left = v.grid.filter((x) => x < 0).length;
  const e = sRoot.querySelector('[data-s="left"]'); if (e) e.textContent = 'Zbývá: ' + left;
}

function sTick() {
  if (!sRoot || !sRoot.isConnected || sView.screen !== 'play') { clearInterval(sTimer); return; }
  if (sView.over) return;
  const s = Math.floor((Date.now() - sView.t0) / 1000);
  const e = sRoot.querySelector('[data-s="time"]'); if (e) e.textContent = 'Čas: ' + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

function sPlace(val) {
  const v = sView;
  if (v.over || v.sel < 0 || v.given[v.sel]) return;
  v.grid[v.sel] = val;
  sRender();
  if (val >= 0) {
    const cell = sRoot.querySelector('[data-cell="' + v.sel + '"]'); cell?.classList.add('pop');
  }
  if (!v.grid.includes(-1) && sConflicts().size === 0) sWin();
}

function sHint() {
  const v = sView;
  if (v.over) return;
  const wrong = v.grid.findIndex((x, i) => x >= 0 && !v.given[i] && x !== v.solution[i]);
  let i = wrong >= 0 ? wrong : (v.sel >= 0 && v.grid[v.sel] < 0 ? v.sel : v.grid.indexOf(-1));
  if (i < 0) return;
  v.hints++;
  v.grid[i] = v.solution[i]; v.given[i] = true; v.sel = i;
  sRender();
  sRoot.querySelector('[data-cell="' + i + '"]')?.classList.add('hinted');
  if (!v.grid.includes(-1) && sConflicts().size === 0) sWin();
}

function sWin() {
  const v = sView; v.over = true; clearInterval(sTimer);
  const n = v.level.n, secs = Math.round((Date.now() - v.t0) / 1000), st = getStore();
  const first = !st.done[16 + n];
  const newFoil = v.hints === 0 && !st.foil[16 + n];
  st.done[16 + n] = true;
  if (v.hints === 0) st.foil[16 + n] = true;
  const rec = st.sbest[n] == null || secs < st.sbest[n];
  if (rec) st.sbest[n] = secs;
  saveStore();
  sRoot.querySelector('.sd-grid')?.classList.add('solved');
  const next = sLevels.find((l) => l.n === n + 1);
  setTimeout(() => {
    const m = sRoot.querySelector('.g-modal');
    m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><p class="eyebrow">Level ' + n + ' vyřešen · ' + Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0') + (rec ? ' · rekord' : '') + '</p>'
      + '<h2>' + (first ? 'Nová karta ve sbírce!' : 'Hádanka vyřešena') + '</h2>'
      + '<div class="g-reveal' + (first || newFoil ? ' fresh' : '') + '">' + rewardCard(rewards[16 + n - 1]) + '</div>'
      + (newFoil ? '<p class="g-note ok">Bez nápovědy: karta je teď v lesklé edici.</p>' : v.hints ? '<p class="g-note">Vyřeš level bez nápovědy a získáš lesklou edici.</p>' : '')
      + '<div class="g-actions">' + (next ? '<button type="button" class="button primary" data-slevel="' + next.n + '">Další level ' + next.n + ' →</button>' : '<button type="button" class="button primary" data-slevel="' + n + '">Nová hádanka</button>')
      + '<button type="button" class="button secondary" data-shome>Sbírka a levely</button></div></div>';
    m.hidden = false; m.querySelector('button')?.focus({preventScroll:true});
  }, 700);
}

function sClick(e) {
  const b = e.target.closest('button');
  if (!b || !sRoot.contains(b)) return;
  if (b.dataset.slevel) { sStart(+b.dataset.slevel); return; }
  if (b.hasAttribute('data-shome')) { clearInterval(sTimer); sView = {screen:'home'}; sHome(); sRoot.scrollIntoView({block:'start'}); return; }
  if (b.dataset.cell !== undefined) { sView.sel = +b.dataset.cell; sRender(); return; }
  if (b.dataset.sym !== undefined) { sPlace(+b.dataset.sym); return; }
  if (b.hasAttribute('data-shint')) { sHint(); return; }
  if (b.dataset.zoom && !b.closest('.g-modal')) {
    const m = sRoot.querySelector('.g-modal');
    m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><div class="g-zoom">' + rewardCard(rewards[+b.dataset.zoom - 1]) + '</div><div class="g-actions"><button type="button" class="button secondary" data-sclose>Zavřít</button></div></div>';
    m.hidden = false; return;
  }
  if (b.hasAttribute('data-sclose')) { const m = sRoot.querySelector('.g-modal'); m.hidden = true; m.innerHTML = ''; }
}
