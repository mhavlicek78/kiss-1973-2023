import { rewards, rewardCard, getStore, saveStore, connectStore, syncText, onStore, tiltCard } from './game.js';

/* ===== Malované masky: obrázková logická hra (nonogram), karty 49–56 ===== */

const ngPics = [{"name": "Hvězda Starchilda", "key": "star", "rows": ["...#...", "...#...", "#######", ".#####.", "..###..", ".##.##.", "##...##"]}, {"name": "Démonův netopýr", "key": "bat", "rows": ["##......##", "###.##.###", "##########", ".########.", "..##..##..", "...#..#..."]}, {"name": "Spacemanův blesk", "key": "bolt", "rows": ["....###.", "...###..", "..###...", ".######.", "...###..", "..###...", ".###....", ".##....."]}, {"name": "Vinnieho ankh", "key": "ankh", "rows": ["..####..", ".##..##.", ".#....#.", ".##..##.", "..####..", "########", "########", "...##...", "...##...", "...##..."]}, {"name": "Catmanovy drápy", "key": "claw", "rows": ["#..#..#..", "##.##.##.", ".##.##.##", ".##.##.##", "..#..#..#", "..##.##.#", "...#..#..", "...##.##.", "....#..#."]}, {"name": "Liška Erica Carra", "key": "fox", "rows": ["#........#", "##......##", "###....###", "##########", "#.##..##.#", "##########", ".########.", "..######..", "...####...", "....##...."]}, {"name": "Kytara Les Paul", "key": "guitar", "rows": ["....##....", "....##....", "....##....", "....##....", "....##....", "..######..", ".########.", "..######..", ".###..###.", "##########", "##########", ".########."]}, {"name": "Démonova maska", "key": "mask", "rows": ["............", ".##......##.", "####....####", "#####..#####", "##.##..##.##", "############", ".##########.", "..###..###..", "...######...", "....####...."]}];
const ngTint = {star:'#ff7ac0', bat:'#ff4a2a', bolt:'#8fc4ff', ankh:'#f1c84a', claw:'#4ee38a', fox:'#ff9a3c', guitar:'#ffd36a', mask:'#e9ebee'};

const ngEsc = (v = '') => String(v).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ngFmt = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
function ngClues(line) { const out = []; let run = 0; for (const c of line) { if (c) run++; else if (run) { out.push(run); run = 0; } } if (run) out.push(run); return out.length ? out : [0]; }

let ngRoot = null, ngView = {screen:'home'}, ngHooked = false, ngTimer = null, ngPaint = null;
const ngDone = (n) => !!getStore().done[48 + n];

export function nonogramPage() { return '<div class="shell page nonogram-page" id="nonogram-root"></div>'; }

export function mountNonogram() {
  ngRoot = document.getElementById('nonogram-root');
  if (!ngRoot) return;
  ngView = {screen:'home'};
  ngRoot.addEventListener('click', ngClick);
  ngRoot.addEventListener('pointermove', tiltCard);
  if (!ngHooked) { ngHooked = true; onStore(() => { if (ngRoot && ngRoot.isConnected && ngView.screen === 'home') ngHome(); }); }
  ngHome();
  connectStore();
}

function ngHome() {
  const st = getStore();
  const done = ngPics.filter((_, i) => ngDone(i + 1)).length;
  const nextI = ngPics.findIndex((_, i) => !ngDone(i + 1));
  ngRoot.innerHTML = '<header class="section-head"><p class="eyebrow">Hra</p><h1>Malované masky</h1>'
    + '<p class="lede">Čísla u řádků a sloupců říkají, kolik políček za sebou je vybarvených. Podle nich vybarvuj a vylučuj, až se z mřížky vynoří obrázek. Prstem můžeš malovat tahem přes víc políček. Obrázek dokončený bez nápovědy dává lesklou edici karty.</p></header>'
    + '<div class="g-stats"><div><b>' + done + '</b><span>z 8 karet</span></div><p class="g-sync">' + syncText() + '</p></div>'
    + (nextI >= 0 ? '<button type="button" class="button primary" data-nglevel="' + (nextI + 1) + '">' + (done ? 'Další obraz: ' + (nextI + 1) : 'Začít malovat') + ' <span aria-hidden="true">→</span></button>'
                  : '<p class="g-all">Všech osm obrazů namalováno.</p>')
    + '<h2 class="g-h2">Obrazy</h2><ol class="g-levels">' + ngPics.map((p, i) => {
        const n = i + 1, open = n === 1 || ngDone(n - 1) || ngDone(n), d = ngDone(n), b = st.ngbest?.[n];
        return '<li><button type="button" class="g-level' + (d ? ' is-done' : '') + '"' + (open ? ' data-nglevel="' + n + '"' : ' disabled') + '>'
          + '<span class="g-ln">' + n + '</span><span class="g-lname">' + (d ? ngEsc(p.name) : 'Tajný obraz') + '</span>'
          + '<span class="g-lmeta">' + p.rows[0].length + ' × ' + p.rows.length + (b != null ? ' · rekord ' + ngFmt(b) : '') + '</span>'
          + '<span class="g-lstate">' + (d ? (st.foil[48 + n] ? '✦' : '✓') : open ? '▶' : '🔒') + '</span></button></li>';
      }).join('') + '</ol>'
    + '<h2 class="g-h2">Sbírka z malovaných masek</h2><div class="g-collection">' + rewards.slice(48, 56).map((r) => rewardCard(r)).join('') + '</div>'
    + '<div class="g-modal" hidden></div>';
}

function ngStart(n) {
  const p = ngPics[n - 1];
  const sol = p.rows.map((r) => [...r].map((c) => (c === '#' ? 1 : 0)));
  const H = sol.length, W = sol[0].length;
  const rc = sol.map(ngClues), cc = [...Array(W)].map((_, x) => ngClues(sol.map((r) => r[x])));
  ngView = {screen:'play', n, p, sol, H, W, rc, cc, g:sol.map((r) => r.map(() => 0)), mode:1, hints:0, t0:Date.now(), over:false};
  const maxR = Math.max(...rc.map((c) => c.length)), maxC = Math.max(...cc.map((c) => c.length));
  ngRoot.innerHTML = '<div class="ng-play"><div class="g-bar"><button type="button" class="back g-back" data-nghome>← Obrazy</button>'
    + '<h1 class="g-title">Obraz ' + n + ' · ' + W + ' × ' + H + '</h1><div class="g-hud"><span data-ng="time"></span><span data-ng="hints"></span></div></div>'
    + '<div class="ng-modes" role="radiogroup" aria-label="Režim"><button type="button" class="ng-mode" data-ngmode="1" role="radio">■ Vybarvit</button><button type="button" class="ng-mode" data-ngmode="2" role="radio">✕ Vyloučit</button></div>'
    + '<div class="ng-wrap"><div class="ng-board" style="--w:' + W + ';--h:' + H + ';--rc:' + maxR + ';--cc:' + maxC + ';--tint:' + (ngTint[p.key] || '#fff') + '">'
    + '<div class="ng-corner"></div>'
    + cc.map((c, x) => '<div class="ng-cc' + ((x + 1) % 5 === 0 && x < W - 1 ? ' b5' : '') + '" data-cc="' + x + '">' + c.map((v) => '<span>' + v + '</span>').join('') + '</div>').join('')
    + sol.map((row, y) => '<div class="ng-rc' + ((y + 1) % 5 === 0 && y < H - 1 ? ' b5' : '') + '" data-rc="' + y + '">' + rc[y].map((v) => '<span>' + v + '</span>').join('') + '</div>'
        + row.map((_, x) => '<button type="button" class="ng-cell' + ((x + 1) % 5 === 0 && x < W - 1 ? ' r5' : '') + ((y + 1) % 5 === 0 && y < H - 1 ? ' d5' : '') + '" data-x="' + x + '" data-y="' + y + '" aria-label="Řádek ' + (y + 1) + ', sloupec ' + (x + 1) + '"></button>').join('')).join('')
    + '</div></div>'
    + '<p class="m-msg" data-ng="msg" role="status"></p>'
    + '<div class="sd-tools"><button type="button" class="button secondary" data-nghint>Nápověda</button><button type="button" class="button secondary" data-ngreset>Vymazat</button></div></div>'
    + '<div class="g-modal" hidden></div>';
  const board = ngRoot.querySelector('.ng-board');
  board.addEventListener('pointerdown', ngDown);
  ngRoot.scrollIntoView({block:'start'});
  ngRender();
  clearInterval(ngTimer); ngTimer = setInterval(ngTick, 1000); ngTick();
}

function ngRender() {
  const v = ngView;
  ngRoot.querySelectorAll('.ng-cell').forEach((el) => {
    const s = v.g[+el.dataset.y][+el.dataset.x];
    el.classList.toggle('on', s === 1); el.classList.toggle('x', s === 2);
  });
  for (let y = 0; y < v.H; y++) ngRoot.querySelector('[data-rc="' + y + '"]').classList.toggle('done', ngClues(v.g[y].map((s) => s === 1)).join() === v.rc[y].join());
  for (let x = 0; x < v.W; x++) ngRoot.querySelector('[data-cc="' + x + '"]').classList.toggle('done', ngClues(v.g.map((r) => r[x] === 1)).join() === v.cc[x].join());
  ngRoot.querySelectorAll('[data-ngmode]').forEach((b) => { const on = +b.dataset.ngmode === v.mode; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
  const h = ngRoot.querySelector('[data-ng="hints"]'); if (h) h.textContent = 'Nápovědy: ' + v.hints;
}

function ngTick() {
  if (!ngRoot || !ngRoot.isConnected || ngView.screen !== 'play') { clearInterval(ngTimer); return; }
  if (ngView.over) return;
  const e = ngRoot.querySelector('[data-ng="time"]'); if (e) e.textContent = 'Čas: ' + ngFmt(Math.floor((Date.now() - ngView.t0) / 1000));
}

/* malování tahem: první políčko určí, co se maluje, a tah mění jen políčka ve stejném stavu */
function ngDown(e) {
  const cell = e.target.closest('.ng-cell');
  if (!cell || ngView.over) return;
  e.preventDefault();
  const v = ngView, x = +cell.dataset.x, y = +cell.dataset.y, cur = v.g[y][x];
  const target = cur === v.mode ? 0 : v.mode;
  ngPaint = {from:cur, to:target, axis:null, x0:x, y0:y};
  ngSet(x, y);
  const board = cell.closest('.ng-board');
  board.setPointerCapture(e.pointerId);
  board.addEventListener('pointermove', ngMovePaint);
  board.addEventListener('pointerup', ngUpPaint, {once:true});
  board.addEventListener('pointercancel', ngUpPaint, {once:true});
}
function ngMovePaint(e) {
  if (!ngPaint) return;
  const el = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('.ng-cell');
  if (!el) return;
  let x = +el.dataset.x, y = +el.dataset.y;
  if (!ngPaint.axis && (x !== ngPaint.x0 || y !== ngPaint.y0)) ngPaint.axis = x !== ngPaint.x0 ? 'x' : 'y';
  if (ngPaint.axis === 'x') y = ngPaint.y0; else if (ngPaint.axis === 'y') x = ngPaint.x0;
  ngSet(x, y);
}
function ngUpPaint(e) {
  const board = e.currentTarget;
  board.removeEventListener('pointermove', ngMovePaint);
  ngPaint = null;
  ngCheck();
}
function ngSet(x, y) {
  const v = ngView;
  if (v.g[y][x] !== ngPaint.from) return;
  v.g[y][x] = ngPaint.to;
  ngRender();
}

function ngMsg(t, cls) { const e = ngRoot.querySelector('[data-ng="msg"]'); if (e) { e.textContent = t; e.className = 'm-msg' + (cls ? ' ' + cls : ''); } }

function ngCheck() {
  const v = ngView;
  for (let y = 0; y < v.H; y++) for (let x = 0; x < v.W; x++) if ((v.g[y][x] === 1) !== (v.sol[y][x] === 1)) return;
  ngWin();
}

function ngHint() {
  const v = ngView; if (v.over) return;
  const wrong = [], missing = [];
  for (let y = 0; y < v.H; y++) for (let x = 0; x < v.W; x++) {
    if (v.g[y][x] === 1 && !v.sol[y][x]) wrong.push([x, y]);
    else if (v.g[y][x] === 2 && v.sol[y][x]) wrong.push([x, y]);
    else if (v.g[y][x] !== 1 && v.sol[y][x]) missing.push([x, y]);
  }
  const pick = wrong.length ? wrong[0] : missing[Math.floor(Math.random() * missing.length)];
  if (!pick) return;
  const [x, y] = pick;
  v.hints++;
  v.g[y][x] = v.sol[y][x] ? 1 : 2;
  ngRender();
  const el = ngRoot.querySelector('.ng-cell[data-x="' + x + '"][data-y="' + y + '"]');
  el?.classList.remove('hinted'); void el?.offsetWidth; el?.classList.add('hinted');
  ngMsg(wrong.length ? 'Tohle políčko jsi měl špatně, opraveno.' : 'Nápověda doplnila jedno políčko.', wrong.length ? 'bad' : 'ok');
  ngCheck();
}

function ngWin() {
  const v = ngView, n = v.n; v.over = true; clearInterval(ngTimer);
  const secs = Math.round((Date.now() - v.t0) / 1000), st = getStore();
  const first = !st.done[48 + n];
  const clean = v.hints === 0;
  const newFoil = clean && !st.foil[48 + n];
  st.done[48 + n] = true;
  if (clean) st.foil[48 + n] = true;
  st.ngbest = st.ngbest || {};
  const rec = st.ngbest[n] == null || secs < st.ngbest[n];
  if (rec) st.ngbest[n] = secs;
  saveStore();
  for (let y = 0; y < v.H; y++) for (let x = 0; x < v.W; x++) if (v.g[y][x] === 2) v.g[y][x] = 0;
  ngRender();
  const board = ngRoot.querySelector('.ng-board');
  board.classList.add('solved');
  ngRoot.querySelectorAll('.ng-cell.on').forEach((el) => el.style.setProperty('--d', ((+el.dataset.x + +el.dataset.y) * 35) + 'ms'));
  const next = ngPics[n];
  setTimeout(() => {
    const m = ngRoot.querySelector('.g-modal');
    m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><p class="eyebrow">Obraz ' + n + ' · ' + ngFmt(secs) + (rec ? ' · rekord' : '') + '</p>'
      + '<h2>' + ngEsc(v.p.name) + '</h2>'
      + '<div class="g-reveal' + (first || newFoil ? ' fresh' : '') + '">' + rewardCard(rewards[48 + n - 1]) + '</div>'
      + (newFoil ? '<p class="g-note ok">Bez nápovědy: karta je v lesklé edici.</p>' : !st.foil[48 + n] ? '<p class="g-note">Namaluj obraz bez nápovědy a získáš lesklou edici.</p>' : '')
      + '<div class="g-actions">' + (next ? '<button type="button" class="button primary" data-nglevel="' + (n + 1) + '">Další obraz ' + (n + 1) + ' →</button>' : '')
      + '<button type="button" class="button secondary" data-nghome>Obrazy a sbírka</button></div></div>';
    m.hidden = false; m.querySelector('button')?.focus({preventScroll:true});
  }, 1900);
}

function ngClick(e) {
  const b = e.target.closest('button');
  if (!b || !ngRoot.contains(b)) return;
  if (b.dataset.nglevel) { ngStart(+b.dataset.nglevel); return; }
  if (b.hasAttribute('data-nghome')) { clearInterval(ngTimer); ngView = {screen:'home'}; ngHome(); ngRoot.scrollIntoView({block:'start'}); return; }
  if (b.dataset.ngmode) { ngView.mode = +b.dataset.ngmode; ngRender(); return; }
  if (b.hasAttribute('data-nghint')) { ngHint(); return; }
  if (b.hasAttribute('data-ngreset')) {
    if (b.dataset.confirm) { ngView.g = ngView.g.map((r) => r.map(() => 0)); delete b.dataset.confirm; b.textContent = 'Vymazat'; ngMsg(''); ngRender(); }
    else { b.dataset.confirm = '1'; b.textContent = 'Opravdu vymazat?'; }
    return;
  }
  if (b.dataset.zoom && !b.closest('.g-modal')) {
    const m = ngRoot.querySelector('.g-modal');
    m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><div class="g-zoom">' + rewardCard(rewards[+b.dataset.zoom - 1]) + '</div><div class="g-actions"><button type="button" class="button secondary" data-ngclose>Zavřít</button></div></div>';
    m.hidden = false; return;
  }
  if (b.hasAttribute('data-ngclose')) { const m = ngRoot.querySelector('.g-modal'); m.hidden = true; m.innerHTML = ''; }
}
