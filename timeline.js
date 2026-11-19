import { albums, covers } from './albums.js';
import { rewards, rewardCard, getStore, saveStore, connectStore, syncText, onStore, tiltCard } from './game.js';

/* ===== Seřaď kariéru: chronologie alb, momentů, sestavy a turné, karty 41–48 ===== */

const tlEsc = (v = '') => String(v).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tlFmt = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');

const tlTypes = {
  album:{label:'Album', sym:'star'},
  moment:{label:'Moment', sym:'burst'},
  member:{label:'Sestava', sym:'claw'},
  tour:{label:'Turné', sym:'bolt'}
};
// Alba z diskografie (bez sólovek, které vyšly v jeden den) + ručně ověřené momenty, změny sestavy a turné
const tlItems = [
  ...albums.filter((a) => a.type !== 'solo').map((a) => ({id:'a-' + a.id, type:'album', title:a.title, year:+String(a.date || a.year).slice(0, 4), img:covers[a.id] || ''})),
  {id:'m-first', type:'moment', title:'První koncert v Queensu', year:1973},
  {id:'m-solo', type:'moment', title:'Čtyři sólová alba vyjdou v jeden den', year:1978},
  {id:'m-mtv', type:'moment', title:'Kapela se poprvé ukáže bez masek (MTV)', year:1983},
  {id:'m-unplugged', type:'moment', title:'Natáčení MTV Unplugged s původní sestavou jako hosty', year:1995},
  {id:'m-tiger', type:'moment', title:'Reunion v maskách na Tiger Stadium v Detroitu', year:1996},
  {id:'m-hof', type:'moment', title:'Uvedení do Rock & Roll Hall of Fame', year:2014},
  {id:'m-final', type:'moment', title:'Poslední koncert v Madison Square Garden', year:2023},
  {id:'p-carr', type:'member', title:'Za bicí usedá Eric Carr (The Fox)', year:1980},
  {id:'p-vinnie', type:'member', title:'Sólovou kytaru přebírá Vinnie Vincent', year:1982},
  {id:'p-kulick', type:'member', title:'Do kapely přichází Bruce Kulick', year:1984},
  {id:'p-singer', type:'member', title:'Za bicí poprvé usedá Eric Singer', year:1991},
  {id:'p-thayer', type:'member', title:'Spacemana hraje Tommy Thayer', year:2002},
  {id:'t-destroyer', type:'tour', title:'Destroyer Tour', year:1976},
  {id:'t-lovegun', type:'tour', title:'Love Gun Tour', year:1977},
  {id:'t-dynasty', type:'tour', title:'Dynasty Tour', year:1979},
  {id:'t-creatures', type:'tour', title:'Creatures of the Night Tour', year:1982},
  {id:'t-shade', type:'tour', title:'Hot in the Shade Tour', year:1990},
  {id:'t-revenge', type:'tour', title:'Revenge Tour', year:1992},
  {id:'t-psycho', type:'tour', title:'Psycho Circus Tour', year:1998},
  {id:'t-farewell', type:'tour', title:'Farewell Tour', year:2000},
  {id:'t-sonic', type:'tour', title:'Sonic Boom Over Europe Tour', year:2010},
  {id:'t-eotr', type:'tour', title:'End of the Road World Tour', year:2019}
];

export const tlLevels = [
  {n:1, name:'Zkouška paměti', count:4, gap:5, limit:0, other:2},
  {n:2, name:'Klubová léta', count:5, gap:4, limit:0, other:2},
  {n:3, name:'Turné po Americe', count:5, gap:3, limit:0, other:3},
  {n:4, name:'Bez masek', count:6, gap:2, limit:0, other:3},
  {n:5, name:'Proti času', count:6, gap:2, limit:75, other:4},
  {n:6, name:'Rok po roce', count:7, gap:1, limit:0, other:4},
  {n:7, name:'Krátká paměť', count:7, gap:1, limit:70, other:5},
  {n:8, name:'Kronikář', count:8, gap:1, limit:90, other:6}
];

function tlShuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function tlDeal(level) {
  for (let tries = 0; tries < 400; tries++) {
    const pool = tlShuffle(tlItems.slice());
    const pick = [];
    const others = pool.filter((x) => x.type !== 'album'), albs = pool.filter((x) => x.type === 'album');
    const take = (src, k) => { for (const x of src) { if (pick.length >= level.count || k <= 0) break; if (pick.every((p) => Math.abs(p.year - x.year) >= level.gap)) { pick.push(x); k--; } } };
    take(others, level.other);
    take(albs, level.count - pick.length);
    take(others, level.count - pick.length);
    if (pick.length === level.count) { let order; do { order = tlShuffle(pick.slice()); } while (order.every((x, i, arr) => i === 0 || arr[i - 1].year < x.year)); return order; }
  }
  return tlShuffle(tlItems.slice(0, level.count));
}

let tlRoot = null, tlView = {screen:'home'}, tlHooked = false, tlTimer = null, tlDrag = null;
const tlDone = (n) => !!getStore().done[40 + n];

export function timelinePage() { return '<div class="shell page timeline-page" id="timeline-root"></div>'; }

export function mountTimeline() {
  tlRoot = document.getElementById('timeline-root');
  if (!tlRoot) return;
  tlView = {screen:'home'};
  tlRoot.addEventListener('click', tlClick);
  tlRoot.addEventListener('pointermove', tiltCard);
  tlRoot.addEventListener('pointerdown', tlDown);
  if (!tlHooked) { tlHooked = true; onStore(() => { if (tlRoot && tlRoot.isConnected && tlView.screen === 'home') tlHome(); }); }
  tlHome();
  connectStore();
}

function tlHome() {
  const st = getStore();
  const done = tlLevels.filter((l) => tlDone(l.n)).length;
  const next = tlLevels.find((l) => !tlDone(l.n));
  tlRoot.innerHTML = '<header class="section-head"><p class="eyebrow">Hra</p><h1>Seřaď kariéru</h1>'
    + '<p class="lede">Alba, velké momenty, změny v sestavě i turné. Přetáhni karty do pořadí od nejstaršího po nejnovější. Na kontrolu máš tři pokusy a správně umístěné karty po kontrole zůstanou na místě. Kdo to trefí napoprvé, získá lesklou edici karty.</p></header>'
    + '<div class="g-stats"><div><b>' + done + '</b><span>z 8 karet</span></div><p class="g-sync">' + syncText() + '</p></div>'
    + (next ? '<button type="button" class="button primary" data-tllevel="' + next.n + '">' + (done ? 'Pokračovat: level ' + next.n : 'Začít řadit') + ' <span aria-hidden="true">→</span></button>'
            : '<p class="g-all">Všech osm levelů hotovo. Každá hra rozdá jiné karty, takže se můžeš vracet.</p>')
    + '<h2 class="g-h2">Levely</h2><ol class="g-levels">' + tlLevels.map((l) => {
        const open = l.n === 1 || tlDone(l.n - 1) || tlDone(l.n);
        const b = st.kbest?.[l.n];
        return '<li><button type="button" class="g-level' + (tlDone(l.n) ? ' is-done' : '') + '"' + (open ? ' data-tllevel="' + l.n + '"' : ' disabled') + '>'
          + '<span class="g-ln">' + l.n + '</span><span class="g-lname">' + tlEsc(l.name) + '</span>'
          + '<span class="g-lmeta">' + l.count + ' karet' + (l.limit ? ' · ' + l.limit + ' s' : '') + (b != null ? ' · nejlépe na ' + b + '. pokus' : '') + '</span>'
          + '<span class="g-lstate">' + (tlDone(l.n) ? (st.foil[40 + l.n] ? '✦' : '✓') : open ? '▶' : '🔒') + '</span></button></li>';
      }).join('') + '</ol>'
    + '<h2 class="g-h2">Sbírka z kariéry</h2><div class="g-collection">' + rewards.slice(40, 48).map((r) => rewardCard(r)).join('') + '</div>'
    + '<div class="g-modal" hidden></div>';
}

function tlIcon(it) {
  if (it.img) return '<img class="tl-img" src="' + it.img + '" alt="" loading="lazy">';
  const s = tlTypes[it.type].sym;
  return '<span class="tl-ico t-' + it.type + '"><svg viewBox="-6 -6 112 ' + (s === 'bat' ? 72 : 112) + '" aria-hidden="true"><use href="#sym-' + s + '"/></svg></span>';
}

function tlStart(n) {
  const level = tlLevels.find((l) => l.n === n);
  const order = tlDeal(level);
  tlView = {screen:'play', level, order, locked:{}, attempt:0, t0:Date.now(), over:false};
  tlRoot.innerHTML = '<div class="tl-play"><div class="g-bar"><button type="button" class="back g-back" data-tlhome>← Levely</button>'
    + '<h1 class="g-title">Level ' + n + ' · ' + tlEsc(level.name) + '</h1><div class="g-hud"><span data-tl="time"></span><span data-tl="att"></span></div></div>'
    + '<p class="tl-hint">Nahoře nejstarší, dole nejnovější. Kartu přetáhni, nebo posuň šipkami.</p>'
    + '<div class="tl-axis"><span>dříve</span><ol class="tl-list"></ol><span>později</span></div>'
    + '<p class="m-msg" data-tl="msg" role="status"></p>'
    + '<div class="sd-tools"><button type="button" class="button primary" data-tlcheck>Zkontrolovat pořadí</button></div></div>'
    + '<div class="g-modal" hidden></div>';
  tlRoot.scrollIntoView({block:'start'});
  tlRender();
  clearInterval(tlTimer); tlTimer = setInterval(tlTick, 500); tlTick();
}

function tlRender() {
  const v = tlView, list = tlRoot.querySelector('.tl-list');
  list.innerHTML = v.order.map((it, i) => {
    const lock = v.locked[it.id];
    return '<li class="tl-card' + (lock ? ' locked' : '') + (v.wrong?.[it.id] ? ' wrong' : '') + '" data-id="' + it.id + '">'
      + tlIcon(it)
      + '<span class="tl-text"><small>' + tlTypes[it.type].label + '</small>' + tlEsc(it.title) + '</span>'
      + (lock ? '<span class="tl-year">' + it.year + '</span>'
              : '<span class="tl-moves"><button type="button" data-tlup="' + i + '" aria-label="Posunout výš"' + (i === 0 ? ' disabled' : '') + '>▲</button><button type="button" data-tldown="' + i + '" aria-label="Posunout níž"' + (i === v.order.length - 1 ? ' disabled' : '') + '>▼</button></span>')
      + '</li>';
  }).join('');
  const a = tlRoot.querySelector('[data-tl="att"]'); if (a) a.textContent = 'Pokus ' + Math.min(v.attempt + 1, 3) + ' / 3';
}

function tlTick() {
  if (!tlRoot || !tlRoot.isConnected || tlView.screen !== 'play') { clearInterval(tlTimer); return; }
  const v = tlView; if (v.over) return;
  const s = Math.floor((Date.now() - v.t0) / 1000);
  const e = tlRoot.querySelector('[data-tl="time"]');
  if (v.level.limit) {
    const left = Math.max(0, v.level.limit - s);
    if (e) { e.textContent = 'Zbývá: ' + tlFmt(left); e.classList.toggle('warn', left <= 10); }
    if (left === 0) tlEnd(false, 'Čas vypršel.');
  } else if (e) e.textContent = 'Čas: ' + tlFmt(s);
}

function tlMove(i, d) {
  const o = tlView.order, j = i + d;
  if (j < 0 || j >= o.length || tlView.locked[o[i].id] || tlView.locked[o[j].id]) return;
  [o[i], o[j]] = [o[j], o[i]];
  tlView.wrong = null;
  tlRender();
}

/* přetahování prstem nebo myší */
function tlDown(e) {
  const card = e.target.closest('.tl-card');
  if (!card || e.target.closest('button') || card.classList.contains('locked') || tlView.over) return;
  const list = card.parentElement;
  tlDrag = {card, list, y0:e.clientY, top0:card.offsetTop, moved:false, id:e.pointerId};
  card.setPointerCapture(e.pointerId);
  card.addEventListener('pointermove', tlMoveDrag);
  card.addEventListener('pointerup', tlUp);
  card.addEventListener('pointercancel', tlUp);
}
function tlMoveDrag(e) {
  const d = tlDrag; if (!d) return;
  const dy = e.clientY - d.y0;
  if (!d.moved && Math.abs(dy) < 4) return;
  if (!d.moved) { d.moved = true; d.card.classList.add('dragging'); }
  const want = d.top0 + dy, mid = want + d.card.offsetHeight / 2;
  const prev = d.card.previousElementSibling, next = d.card.nextElementSibling;
  if (next && !next.classList.contains('locked') && mid > next.offsetTop + next.offsetHeight / 2) d.list.insertBefore(next, d.card);
  else if (prev && !prev.classList.contains('locked') && mid < prev.offsetTop + prev.offsetHeight / 2) d.list.insertBefore(d.card, prev);
  d.card.style.transform = 'translateY(' + (want - d.card.offsetTop) + 'px)';
}
function tlUp() {
  const d = tlDrag; if (!d) return;
  tlDrag = null;
  d.card.removeEventListener('pointermove', tlMoveDrag);
  d.card.removeEventListener('pointerup', tlUp);
  d.card.removeEventListener('pointercancel', tlUp);
  d.card.style.transform = '';
  d.card.classList.remove('dragging');
  if (!d.moved) return;
  const ids = [...d.list.children].map((li) => li.dataset.id);
  tlView.order = ids.map((id) => tlView.order.find((x) => x.id === id));
  tlView.wrong = null;
  tlRender();
}

function tlMsg(t, cls) { const e = tlRoot.querySelector('[data-tl="msg"]'); if (e) { e.textContent = t; e.className = 'm-msg' + (cls ? ' ' + cls : ''); } }

function tlCheck() {
  const v = tlView; if (v.over) return;
  const sorted = v.order.slice().sort((a, b) => a.year - b.year);
  v.attempt++;
  v.wrong = {};
  let ok = 0;
  v.order.forEach((it, i) => { if (sorted[i].id === it.id) { v.locked[it.id] = true; ok++; } else v.wrong[it.id] = true; });
  tlRender();
  if (ok === v.order.length) { tlEnd(true); return; }
  if (v.attempt >= 3) { tlEnd(false, 'Tři pokusy jsou pryč.'); return; }
  tlMsg('Správně ' + ok + ' z ' + v.order.length + '. Zelené karty zůstanou, ostatní přeskládej. ' + (3 - v.attempt === 1 ? 'Zbývá poslední pokus.' : 'Zbývají ' + (3 - v.attempt) + ' pokusy.'), ok ? 'ok' : 'bad');
}

function tlEnd(won, why) {
  const v = tlView; v.over = true; clearInterval(tlTimer);
  const n = v.level.n, st = getStore();
  const sorted = v.order.slice().sort((a, b) => a.year - b.year);
  if (!won) {
    v.order = sorted; v.order.forEach((it) => { v.locked[it.id] = true; }); v.wrong = null; tlRender();
    const m = tlRoot.querySelector('.g-modal');
    m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><p class="eyebrow">Level ' + n + '</p><h2>' + tlEsc(why) + '</h2>'
      + '<p class="g-note">Správné pořadí vidíš v seznamu. Další hra rozdá jiné karty.</p>'
      + '<div class="g-actions"><button type="button" class="button primary" data-tllevel="' + n + '">Zkusit znovu</button><button type="button" class="button secondary" data-tlclose>Prohlédnout pořadí</button></div></div>';
    m.hidden = false; return;
  }
  const first = !st.done[40 + n];
  const clean = v.attempt === 1;
  const newFoil = clean && !st.foil[40 + n];
  st.done[40 + n] = true;
  if (clean) st.foil[40 + n] = true;
  st.kbest = st.kbest || {};
  if (st.kbest[n] == null || v.attempt < st.kbest[n]) st.kbest[n] = v.attempt;
  saveStore();
  tlRoot.querySelector('.tl-list')?.classList.add('solved');
  const next = tlLevels.find((l) => l.n === n + 1);
  setTimeout(() => {
    const m = tlRoot.querySelector('.g-modal');
    m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><p class="eyebrow">Level ' + n + ' · ' + v.attempt + '. pokus</p>'
      + '<h2>' + (first ? 'Kariéra seřazena! Nová karta' : 'Kariéra seřazena!') + '</h2>'
      + '<div class="g-reveal' + (first || newFoil ? ' fresh' : '') + '">' + rewardCard(rewards[40 + n - 1]) + '</div>'
      + (newFoil ? '<p class="g-note ok">Napoprvé: karta je v lesklé edici.</p>' : !st.foil[40 + n] ? '<p class="g-note">Seřaď kariéru napoprvé a získáš lesklou edici.</p>' : '')
      + '<div class="g-actions">' + (next ? '<button type="button" class="button primary" data-tllevel="' + next.n + '">Další level ' + next.n + ' →</button>' : '<button type="button" class="button primary" data-tllevel="' + n + '">Nové karty</button>')
      + '<button type="button" class="button secondary" data-tlhome>Sbírka a levely</button></div></div>';
    m.hidden = false; m.querySelector('button')?.focus({preventScroll:true});
  }, 900);
}

function tlClick(e) {
  const b = e.target.closest('button');
  if (!b || !tlRoot.contains(b)) return;
  if (b.dataset.tllevel) { tlStart(+b.dataset.tllevel); return; }
  if (b.hasAttribute('data-tlhome')) { clearInterval(tlTimer); tlView = {screen:'home'}; tlHome(); tlRoot.scrollIntoView({block:'start'}); return; }
  if (b.dataset.tlup !== undefined) { tlMove(+b.dataset.tlup, -1); return; }
  if (b.dataset.tldown !== undefined) { tlMove(+b.dataset.tldown, 1); return; }
  if (b.hasAttribute('data-tlcheck')) { tlCheck(); return; }
  if (b.hasAttribute('data-tlclose')) { const m = tlRoot.querySelector('.g-modal'); m.hidden = true; m.innerHTML = ''; return; }
  if (b.dataset.zoom && !b.closest('.g-modal')) {
    const m = tlRoot.querySelector('.g-modal');
    m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><div class="g-zoom">' + rewardCard(rewards[+b.dataset.zoom - 1]) + '</div><div class="g-actions"><button type="button" class="button secondary" data-tlclose>Zavřít</button></div></div>';
    m.hidden = false;
  }
}
