import { albums, covers } from './albums.js';
import { members } from './data.js';
import { rewards, rewardCard, getStore, saveStore, connectStore, syncMode, syncText, onStore, tiltCard } from './game.js';

/* ===== KISS Kvíz: 8 turné × 10 otázek, karty 9–16 ===== */

const qEsc = (v = '') => String(v).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const qShuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const qPick = (a) => a[Math.floor(Math.random() * a.length)];

export const tours = [
  {n:1, name:'Dressed to Kill Tour', time:20, need:6},
  {n:2, name:'Alive! Tour', time:18, need:6},
  {n:3, name:'Destroyer Tour', time:16, need:7},
  {n:4, name:'Love Gun Tour', time:15, need:7},
  {n:5, name:'Lick It Up Tour', time:13, need:7},
  {n:6, name:'Reunion Tour', time:12, need:8},
  {n:7, name:'Psycho Circus Tour', time:10, need:8},
  {n:8, name:'End of the Road Tour', time:9, need:9}
];
const Q_COUNT = 10;

const founders = members.slice(0, 4).map((m) => m.name);
const qFacts = [
  ['Ve kterém městě KISS vznikli?', 'New York', ['Los Angeles', 'Detroit', 'Chicago']],
  ['Kde KISS 2. 12. 2023 odehráli poslední koncert turné End of the Road?', 'Madison Square Garden', ['Wembley Stadium', 'Tiger Stadium', 'Cobo Hall']],
  ['Který člen původní sestavy na koncertech plival oheň?', 'Gene Simmons', founders.filter((n) => n !== 'Gene Simmons')],
  ['Kdo z původní čtveřice hrál na bicí?', 'Peter Criss', founders.filter((n) => n !== 'Peter Criss')],
  ['Kdo z původní čtveřice hrál sólovou kytaru?', 'Ace Frehley', founders.filter((n) => n !== 'Ace Frehley')],
  ['Kdo v roce 1980 nahradil Petera Crisse za bicími?', 'Eric Carr', ['Eric Singer', 'Vinnie Vincent', 'Bruce Kulick']],
  ['Kdo v roce 1982 převzal sólovou kytaru po Aceovi Frehleym?', 'Vinnie Vincent', ['Mark St. John', 'Bruce Kulick', 'Tommy Thayer']],
  ['Kdo nahrál kytary na albu Animalize?', 'Mark St. John', ['Bruce Kulick', 'Vinnie Vincent', 'Tommy Thayer']],
  ['Ve kterém roce se KISS poprvé veřejně ukázali bez masek?', '1983', ['1980', '1985', '1979']],
  ['Které album vyšlo jako první po odložení masek?', 'Lick It Up', ['Creatures of the Night', 'Animalize', 'Asylum']],
  ['Kolik sólových alb vydali členové KISS najednou v roce 1978?', '4', ['2', '3', '1']],
  ['Kdo produkoval album Destroyer?', 'Bob Ezrin', ['Eddie Kramer', 'Vini Poncia', 'Bruce Fairbairn']],
  ['Kterou postavu převzal Tommy Thayer?', 'Spaceman', ['Catman', 'Starchild', 'Fox']],
  ['Kterou postavu převzal Eric Singer?', 'Catman', ['Spaceman', 'Demon', 'Ankh Warrior']],
  ['Jak se jmenuje armáda fanoušků KISS?', 'KISS Army', ['KISS Nation', 'Demon Legion', 'Starchild Club']],
  ['Které koncertní album přineslo KISS v roce 1975 průlom?', 'Alive!', ['Alive II', 'Alive III', 'Dressed to Kill']],
  ['Ve kterém roce se původní sestava vrátila v maskách na pódium?', '1996', ['1992', '1999', '1994']],
  ['Co dělala kytara Aceho Frehleyho při sólech?', 'Kouřila a střílela rakety', ['Měnila barvy', 'Hrála sama', 'Hořela modrým plamenem']],
  ['Které akustické vystoupení v roce 1995 spojilo starou i novou sestavu?', 'MTV Unplugged', ['Live Aid', 'Monsters of Rock', 'Saturday Night Live']],
  ['Kdo hrál s KISS na sólovou kytaru v letech 1984–1996?', 'Bruce Kulick', ['Vinnie Vincent', 'Tommy Thayer', 'Mark St. John']]
];

function qBuild() {
  const studio = albums.filter((a) => a.type === 'studio' || a.type === 'solo');
  const count = new Map();
  for (const a of studio) for (const t of a.tracks) count.set(t, (count.get(t) || 0) + 1);
  const trackPool = studio.flatMap((a) => a.tracks.filter((t) => count.get(t) === 1).map((t) => ({t, a})));
  const withCover = albums.filter((a) => covers[a.id]);
  const chars = members.filter((m) => m.character && !m.character.includes(' od ')).map((m) => ({c:m.character, n:m.name}));
  const gens = {
    track() {
      const {t, a} = qPick(trackPool);
      const wrong = qShuffle(studio.filter((x) => x.id !== a.id)).slice(0, 3).map((x) => x.title);
      return {q:'Na kterém albu je skladba „' + t + '“?', a:a.title, w:wrong};
    },
    year() {
      const a = qPick(albums), y = a.date.slice(0, 4);
      return {q:'Ve kterém roce vyšlo album ' + a.title + '?', a:y, w:qShuffle([...new Set(albums.map((x) => x.date.slice(0, 4)))].filter((x) => x !== y)).slice(0, 3)};
    },
    cover() {
      const a = qPick(withCover);
      return {q:'Které album má tento obal?', img:covers[a.id], a:a.title, w:qShuffle(withCover.filter((x) => x.id !== a.id)).slice(0, 3).map((x) => x.title)};
    },
    singer() {
      const m = qPick(members.slice(0, 4));
      return {q:'Kdo zpívá hlavní vokál ve skladbě „' + qPick(m.tracks) + '“?', a:m.name, w:founders.filter((n) => n !== m.name)};
    },
    earlier() {
      const studios = albums.filter((a) => a.type === 'studio');
      let a = qPick(studios), b = qPick(studios);
      while (b.date.slice(0, 4) === a.date.slice(0, 4)) b = qPick(studios);
      const first = a.date < b.date ? a : b;
      return {q:'Které album vyšlo dřív?', a:first.title, w:[(first === a ? b : a).title], two:true};
    },
    character() {
      const x = qPick(chars);
      return {q:'Kdo jako první představoval postavu ' + x.c + '?', a:x.n, w:qShuffle(chars.filter((y) => y.n !== x.n)).slice(0, 3).map((y) => y.n)};
    }
  };
  const list = [];
  const seen = new Set();
  const add = (item) => { if (item && !seen.has(item.q) && item.w.length) { seen.add(item.q); list.push(item); } };
  qShuffle([...qFacts]).slice(0, 3).forEach(([q, a, w]) => add({q, a, w:qShuffle([...w]).slice(0, 3)}));
  const kinds = Object.keys(gens);
  let guard = 0;
  while (list.length < Q_COUNT && guard++ < 200) add(gens[qPick(kinds)]());
  return qShuffle(list).map((x) => ({...x, options:qShuffle([x.a, ...x.w])}));
}

/* ---------- stav a vykreslení ---------- */
let qRoot = null;
let qView = {screen:'home'};
let qTimer = null;
let qHooked = false;

export function quizPage() { return '<div class="shell page quiz-page" id="quiz-root"></div>'; }

export function mountQuiz() {
  qRoot = document.getElementById('quiz-root');
  if (!qRoot) return;
  qView = {screen:'home'};
  qRoot.addEventListener('click', qClick);
  qRoot.addEventListener('pointermove', tiltCard);
  if (!qHooked) { qHooked = true; onStore(() => { if (qRoot && qRoot.isConnected && qView.screen === 'home') qHome(); }); }
  qHome();
  connectStore();
}

const tourDone = (n) => !!getStore().done[8 + n];

function qHome() {
  const s = getStore();
  const done = tours.filter((t) => tourDone(t.n)).length;
  const next = tours.find((t) => !tourDone(t.n));
  qRoot.innerHTML = '<header class="section-head"><p class="eyebrow">Hra</p><h1>Kvíz</h1>'
    + '<p class="lede">Osm turné, na každém deset otázek o KISS. Odpovídej rychle, čas na otázku se s každým turné zkracuje. Když dáš dost správných odpovědí, získáš novou kartu, a za všech deset správně její lesklou edici.</p></header>'
    + '<div class="g-stats"><div><b>' + done + '</b><span>z 8 karet</span></div>'
    + '<p class="g-sync">' + syncText() + '</p></div>'
    + (next ? '<button type="button" class="button primary q-go" data-tour="' + next.n + '">' + (done ? 'Pokračovat: ' : 'Vyrazit na ') + qEsc(next.name) + ' <span aria-hidden="true">→</span></button>'
            : '<p class="g-all">Projel jsi všech osm turné. Turné můžeš hrát znovu a překonávat své skóre.</p>')
    + '<h2 class="g-h2">Turné</h2><ol class="q-tours">' + tours.map((t) => {
        const open = t.n === 1 || tourDone(t.n - 1) || tourDone(t.n);
        const b = s.qbest[t.n];
        return '<li><button type="button" class="q-tour' + (tourDone(t.n) ? ' is-done' : '') + '"' + (open ? ' data-tour="' + t.n + '"' : ' disabled') + '>'
          + '<span class="g-ln">' + t.n + '</span><span class="g-lname">' + qEsc(t.name) + '</span>'
          + '<span class="g-lmeta">' + t.time + ' s na otázku · potřebuješ ' + t.need + '/10' + (b ? ' · rekord ' + b.score : '') + '</span>'
          + '<span class="g-lstate">' + (tourDone(t.n) ? '✓' : open ? '▶' : '🔒') + '</span></button></li>';
      }).join('') + '</ol>'
    + '<h2 class="g-h2">Sbírka z kvízu</h2><div class="g-collection">' + rewards.slice(8, 16).map((r) => rewardCard(r)).join('') + '</div>'
    + '<div class="g-modal" hidden></div>';
}

function qStart(n) {
  const tour = tours.find((t) => t.n === n);
  qView = {screen:'play', tour, list:qBuild(), i:0, score:0, correct:0, streak:0, best:0, locked:false};
  qRoot.innerHTML = '<div class="q-play"><div class="q-head"><button type="button" class="back g-back" data-qhome>← Turné</button><span class="q-tname">' + qEsc(tour.name) + '</span></div>'
    + '<div class="q-meta"><span data-q="prog"></span><span data-q="streak"></span><span data-q="score"></span></div>'
    + '<div class="q-timer"><i data-q="bar"></i></div><div class="q-stage" aria-live="polite"></div></div><div class="g-modal" hidden></div>';
  qRoot.scrollIntoView({block:'start'});
  qShow();
}

function qShow() {
  const v = qView, item = v.list[v.i];
  v.locked = false; v.t0 = Date.now();
  const set = (k, t) => { const e = qRoot.querySelector('[data-q="' + k + '"]'); if (e) e.textContent = t; };
  set('prog', 'Otázka ' + (v.i + 1) + ' / ' + v.list.length);
  set('score', v.score + ' b.');
  set('streak', v.streak >= 2 ? 'Série ×' + v.streak : '');
  qRoot.querySelector('.q-stage').innerHTML = '<div class="q-card">' + (item.img ? '<img class="q-img" src="' + item.img + '" alt="Obal alba">' : '')
    + '<p class="q-text">' + qEsc(item.q) + '</p><div class="q-opts' + (item.two ? ' two' : '') + '">'
    + item.options.map((o, k) => '<button type="button" class="q-opt" data-opt="' + k + '"><span class="q-key">' + 'ABCD'[k] + '</span>' + qEsc(o) + '</button>').join('') + '</div></div>';
  clearInterval(qTimer);
  qTimer = setInterval(qTick, 80);
  qTick();
}

function qTick() {
  if (!qRoot || !qRoot.isConnected || qView.screen !== 'play') { clearInterval(qTimer); return; }
  if (qView.locked) return;
  const left = Math.max(0, 1 - (Date.now() - qView.t0) / (qView.tour.time * 1000));
  const bar = qRoot.querySelector('[data-q="bar"]');
  if (bar) { bar.style.transform = 'scaleX(' + left + ')'; bar.classList.toggle('low', left < 0.3); }
  if (left <= 0) qAnswer(-1);
}

function qAnswer(k) {
  const v = qView;
  if (v.locked) return;
  v.locked = true; clearInterval(qTimer);
  const item = v.list[v.i];
  const ok = k >= 0 && item.options[k] === item.a;
  const left = Math.max(0, 1 - (Date.now() - v.t0) / (v.tour.time * 1000));
  if (ok) { v.correct++; v.streak++; v.best = Math.max(v.best, v.streak); v.score += 100 + Math.round(left * 100) + (v.streak >= 3 ? 25 : 0); }
  else { v.streak = 0; try { navigator.vibrate && navigator.vibrate(80); } catch {} }
  qRoot.querySelectorAll('.q-opt').forEach((b) => {
    b.disabled = true;
    const o = item.options[+b.dataset.opt];
    if (o === item.a) b.classList.add('right'); else if (+b.dataset.opt === k) b.classList.add('wrong');
  });
  const card = qRoot.querySelector('.q-card');
  card.classList.add(ok ? 'flash-ok' : 'flash-no');
  if (k < 0) card.insertAdjacentHTML('beforeend', '<p class="q-out">Čas vypršel</p>');
  setTimeout(() => {
    if (!qRoot.isConnected || qView !== v) return;
    v.i++;
    if (v.i < v.list.length) qShow(); else qFinish();
  }, ok ? 750 : 1400);
}

function qFinish() {
  const v = qView, t = v.tour, s = getStore();
  const pass = v.correct >= t.need;
  const first = pass && !tourDone(t.n);
  const prev = s.qbest[t.n];
  let changed = false;
  if (!prev || v.score > prev.score) { s.qbest[t.n] = {score:v.score, correct:v.correct}; changed = true; }
  if (pass && !s.done[8 + t.n]) { s.done[8 + t.n] = true; changed = true; }
  const perfect = v.correct === v.list.length;
  const newFoil = perfect && !s.foil[8 + t.n];
  if (newFoil) { s.foil[8 + t.n] = true; changed = true; }
  if (changed) saveStore();
  const r = rewards[8 + t.n - 1];
  const nextT = tours.find((x) => x.n === t.n + 1);
  const m = qRoot.querySelector('.g-modal');
  m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><p class="eyebrow">' + qEsc(t.name) + ' · ' + v.correct + ' / 10 správně</p>'
    + '<h2>' + (perfect ? 'Dokonalé turné!' : pass ? (first ? 'Nová karta ve sbírce!' : 'Turné zvládnuto') : 'Publikum chce přídavek') + '</h2>'
    + '<p class="q-final"><b>' + v.score + '</b> bodů' + (prev && v.score > prev.score ? ' · nový rekord' : '') + (v.best >= 3 ? ' · nejdelší série ' + v.best : '') + '</p>'
    + (pass ? '<div class="g-reveal' + (first || newFoil ? ' fresh' : '') + '">' + rewardCard(r) + '</div>' + (newFoil ? '<p class="g-note ok">Všech deset správně: karta je teď v lesklé edici.</p>' : (!s.foil[8 + t.n] ? '<p class="g-note">Za 10/10 získáš lesklou edici.</p>' : ''))
            : '<p>Na kartu potřebuješ aspoň ' + t.need + ' správných odpovědí. Zkus to znovu.</p>')
    + '<div class="g-actions">' + (pass && nextT ? '<button type="button" class="button primary" data-tour="' + nextT.n + '">' + qEsc(nextT.name) + ' →</button>' : '<button type="button" class="button primary" data-tour="' + t.n + '">Hrát znovu</button>')
    + '<button type="button" class="button secondary" data-qhome>Turné a sbírka</button></div></div>';
  m.hidden = false;
  m.querySelector('button')?.focus({preventScroll:true});
}

function qClick(e) {
  const b = e.target.closest('button');
  if (!b || !qRoot.contains(b)) return;
  if (b.dataset.tour) { qStart(+b.dataset.tour); return; }
  if (b.hasAttribute('data-qhome')) { clearInterval(qTimer); qView = {screen:'home'}; qHome(); qRoot.scrollIntoView({block:'start'}); return; }
  if (b.dataset.opt !== undefined) { qAnswer(+b.dataset.opt); return; }
  if (b.dataset.zoom && !b.closest('.g-modal')) {
    const m = qRoot.querySelector('.g-modal');
    m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><div class="g-zoom">' + rewardCard(rewards[+b.dataset.zoom - 1]) + '</div><div class="g-actions"><button type="button" class="button secondary" data-qclose>Zavřít</button></div></div>';
    m.hidden = false; return;
  }
  if (b.hasAttribute('data-qclose')) { const m = qRoot.querySelector('.g-modal'); m.hidden = true; m.innerHTML = ''; }
}
