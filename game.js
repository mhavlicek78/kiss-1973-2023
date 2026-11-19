import { albums, covers } from './albums.js';
import { members } from './data.js';
import { photos } from './photos.js';

/* ===== KISS Pexeso: levely, odměny, kvíz, ukládání ===== */

const G_KEY = 'kiss-hra-v1';
const gEsc = (v = '') => String(v).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const gameLevels = [
  {n:1, pairs:3,  time:0,   name:'Zkušebna'},
  {n:2, pairs:4,  time:0,   name:'Klub v Queensu'},
  {n:3, pairs:6,  time:0,   name:'Hotter Than Hell'},
  {n:4, pairs:6,  time:75,  name:'Destroyer Tour'},
  {n:5, pairs:8,  time:95,  name:'Alive!'},
  {n:6, pairs:8,  time:75,  name:'Madison Square Garden'},
  {n:7, pairs:10, time:110, name:'Reunion'},
  {n:8, pairs:12, time:130, name:'End of the Road'}
];

const rarityLabel = {silver:'Stříbrná', gold:'Zlatá', platinum:'Platinová', diamond:'Diamantová', legend:'Legendární'};

const art = {
  tongue:'<path d="M24 8Q50 0 76 8Q84 46 70 80Q62 98 51 88Q50 87 49 88Q38 98 30 80Q16 46 24 8z"/><path class="ln2" d="M50 18Q47 50 50 80"/>',
  sticks:'<path d="M14 92 78 10l8 6-64 82z"/><path d="M86 92 22 10l-8 6 64 82z"/><circle cx="82" cy="12" r="7"/><circle cx="18" cy="12" r="7"/>',
  guitar:'<path d="M55 2h12l-1 9H56z"/><path d="M57 10h8v34h-8z"/><path d="M61 40c-15 0-22 8-20 17 1 5-7 7-7 15 0 14 12 24 27 24s27-10 27-24c0-8-8-10-7-15 2-9-5-17-20-17z"/><rect class="hole" x="51" y="58" width="20" height="6" rx="2"/><rect class="hole" x="51" y="72" width="20" height="6" rx="2"/>',
  boot:'<path d="M34 4h24v50l24 12c8 4 8 16-2 16H62v14H30V82h-4V4z"/><path class="ln2" d="M30 82h32M34 30h24"/>',
  drop:'<path d="M50 4C40 30 22 48 22 66a28 28 0 0 0 56 0C78 48 60 30 50 4z"/><path class="ln2" style="stroke:#fff8" d="M36 64c0 8 4 14 10 16"/>',
  flame:'<path d="M50 2c8 20 28 28 28 54a28 28 0 0 1-56 0c0-14 8-20 12-28 2 12 8 16 14 16-8-16-4-30 2-42z"/><path class="hole" d="M50 50c4 8 12 12 12 22a12 12 0 0 1-24 0c0-6 4-10 6-14 2 4 4 6 6 6z"/>',
  mic:'<circle cx="50" cy="26" r="20"/><path d="M42 44h16l-3 44h-10z"/><path class="ln2" d="M36 20h28M34 28h32M36 36h28"/>',
  drum:'<path d="M14 34h72v36c0 9-16 16-36 16S14 79 14 70z"/><ellipse class="hole" cx="50" cy="34" rx="36" ry="12"/><path class="ln2" d="M14 50l18 30M86 50 68 80M40 52l10 32M60 52 50 84"/><path d="M60 6 74 30l-4 2L56 8zM40 6 26 30l4 2L44 8z"/>',
  rocket:'<path d="M50 2c16 12 22 32 19 54l12 14-16 2-5 14H40l-5-14-16-2 12-14C28 34 34 14 50 2z"/><circle class="hole" cx="50" cy="40" r="9"/><path class="ln2" style="stroke:#ffb04acc;stroke-width:4" d="M44 92l-2 8M56 92l2 8M50 92v10"/>',
  shield:'<path d="M50 3 88 15v28c0 26-16 44-38 54C28 87 12 69 12 43V15z"/><polygon class="hole" points="50,22 56,40 75,40 60,51 66,69 50,58 34,69 40,51 25,40 44,40"/>',
  axe:'<path d="M54 4h9v92h-9z"/><path d="M63 10c24 4 32 20 32 36S87 76 63 82z"/><path class="ln2" d="M70 30c8 4 12 10 12 16"/>',
  pick:'<path d="M50 96C30 76 12 50 12 30 12 14 30 6 50 6s38 8 38 24c0 20-18 46-38 66z"/><polygon class="hole" points="50,24 54,36 67,36 57,44 61,57 50,49 39,57 43,44 33,36 46,36"/>',
  vinyl:'<circle cx="50" cy="50" r="46"/><circle class="ln2" style="stroke:#0006;stroke-width:1.5" cx="50" cy="50" r="36"/><circle class="ln2" style="stroke:#0006;stroke-width:1.5" cx="50" cy="50" r="28"/><circle class="hole" cx="50" cy="50" r="15"/><circle cx="50" cy="50" r="3"/>',
  amp:'<rect x="8" y="14" width="84" height="72" rx="6"/><rect class="hole" x="16" y="34" width="68" height="44" rx="3"/><circle class="hole" cx="24" cy="24" r="4"/><circle class="hole" cx="38" cy="24" r="4"/><circle class="hole" cx="52" cy="24" r="4"/><path class="ln2" style="stroke:#fff3" d="M20 46h60M20 56h60M20 66h60"/>',
  mask:'<path d="M4 38c12-16 32-18 46-6 14-12 34-10 46 6-4 24-24 32-36 22L50 52l-10 8C28 70 8 62 4 38z"/><ellipse class="hole" cx="30" cy="40" rx="10" ry="7"/><ellipse class="hole" cx="70" cy="40" rx="10" ry="7"/>',
  bulb:'<circle cx="50" cy="40" r="32"/><rect x="36" y="70" width="28" height="22" rx="4"/><path class="ln2" d="M36 77h28M36 85h28"/><path class="ln2" style="stroke:#fff9" d="M34 30c4-8 10-12 18-12"/>',
  broken:'<path d="M18 40a32 32 0 0 1 64 0c0 12-6 20-14 26H32C24 60 18 52 18 40z"/><path class="hole" d="M38 10l8 14-8 8 10 12-6 10 14-12-8-10 8-10-6-12z"/><rect x="36" y="70" width="28" height="22" rx="4"/><path class="ln2" d="M36 77h28M36 85h28"/>',
  spot:'<path d="M28 8h44l12 36H16z"/><ellipse class="hole" cx="50" cy="44" rx="34" ry="8"/><path d="M20 52h60L96 98H4z" style="opacity:.35"/><rect x="44" y="0" width="12" height="10"/>',
  rays:'<circle cx="50" cy="50" r="14"/><path class="ln2" style="stroke:#e9ebee;stroke-width:5;opacity:.9" d="M50 4v24M50 72v24M4 50h24M72 50h24M17 17l17 17M66 66l17 17M83 17 66 34M34 66 17 83"/>',
  board:'<rect x="4" y="16" width="92" height="68" rx="6"/><g class="hole"><circle cx="20" cy="32" r="7"/><circle cx="40" cy="32" r="7"/><circle cx="60" cy="32" r="7"/><circle cx="80" cy="32" r="7"/><circle cx="20" cy="52" r="7"/><circle cx="60" cy="52" r="7"/><circle cx="80" cy="52" r="7"/><circle cx="20" cy="70" r="7"/><circle cx="40" cy="70" r="7"/><circle cx="80" cy="70" r="7"/></g>',
  finale:'<use href="#sym-burst" x="22" y="0" width="56" height="56"/><use href="#sym-burst" x="0" y="44" width="44" height="44"/><use href="#sym-burst" x="56" y="44" width="44" height="44"/>',
  smoke:'<path class="ln2" style="stroke:#fff9;stroke-width:2.5" d="M58 0c-6-4 4-8-2-12"/>'
};

export const rewards = [
  {no:1, name:'Stříbrný kocour', rarity:'silver', sym:'claw', who:'Catman', text:'Devět životů, jeden groove. Za první krok na pódium.'},
  {no:2, name:'Chromový netopýr', rarity:'silver', sym:'bat', who:'The Demon', text:'Vylétá ze tmy, když v klubu zhasnou světla.'},
  {no:3, name:'Zlatá hvězda', rarity:'gold', sym:'star', who:'Starchild', text:'Svítí nad každým refrénem, který zpívá celá hala.'},
  {no:4, name:'Zlatý kouřící Les Paul', rarity:'gold', art:'guitar', who:'Spaceman', text:'Sólo hraje dál, i když z kytary stoupá dým.'},
  {no:5, name:'Platinový jazyk', rarity:'platinum', art:'tongue', who:'The Demon', text:'Nejslavnější jazyk rocku. Zkus ho trumfnout.'},
  {no:6, name:'Platinové paličky', rarity:'platinum', art:'sticks', who:'Catman', text:'Rytmus, na kterém stojí celý Rock and Roll Over.'},
  {no:7, name:'Diamantový blesk', rarity:'diamond', sym:'bolt', who:'Spaceman', text:'Uhodí jednou za kariéru. Teď uhodil u tebe.'},
  {no:8, name:'Pekelná koruna', rarity:'legend', crown:true, who:'KISS', text:'Všechny čtyři tváře v jednom ohni. Ty jsi dostal to nejlepší.'},
  {no:9, name:'Stříbrné plošinovky', rarity:'silver', art:'boot', who:'KISS', text:'Dvacet centimetrů podpatku a pořád v rytmu.'},
  {no:10, name:'Kapka démonovy krve', rarity:'silver', art:'drop', who:'The Demon', text:'Stéká z úst přesně ve chvíli, kdy zhasnou světla.'},
  {no:11, name:'Zlatý ohnivý dech', rarity:'gold', art:'flame', who:'The Demon', text:'Petrolej, pochodeň a jeden nádech. Neopakovat doma.'},
  {no:12, name:'Zlatý mikrofon', rarity:'gold', art:'mic', who:'Starchild', text:'„Do you wanna hear some rock and roll?!“'},
  {no:13, name:'Platinová stoupající bicí', rarity:'platinum', art:'drum', who:'Catman', text:'Souprava, která vyjede nad pódium i s bubeníkem.'},
  {no:14, name:'Platinová raketa', rarity:'platinum', art:'rocket', who:'Spaceman', text:'Vystřelená přímo z kytary, mířící ke světlům haly.'},
  {no:15, name:'Diamantová netopýří křídla', rarity:'diamond', sym:'bat', who:'The Demon', text:'Kostým, se kterým vzlétl ke stropu při „God of Thunder“.'},
  {no:16, name:'Odznak KISS Army', rarity:'legend', art:'shield', who:'KISS Army', text:'Nejvěrnější armáda rocku. Teď nosíš její odznak.'},
  {no:17, name:'Stříbrná liška', rarity:'silver', sym:'fox', who:'The Fox', text:'Eric Carr přišel v roce 1980 a dal kapele nový rytmus.'},
  {no:18, name:'Stříbrný ankh', rarity:'silver', sym:'ankh', who:'Ankh Warrior', text:'Egyptský kříž na tváři Vinnieho Vincenta.'},
  {no:19, name:'Zlatá baskytara sekera', rarity:'gold', art:'axe', who:'The Demon', text:'Baskytara ve tvaru sekery. Kdo jiný by na ni hrál?'},
  {no:20, name:'Zlaté trsátko', rarity:'gold', art:'pick', who:'Starchild', text:'Letí do publika na konci každého koncertu.'},
  {no:21, name:'Platinová deska', rarity:'platinum', art:'vinyl', who:'KISS', text:'Za miliony prodaných nosičů. Pověs ji nad gramofon.'},
  {no:22, name:'Platinový aparát', rarity:'platinum', art:'amp', who:'KISS', text:'Zeď reproduktorů, která rozechvěje celou halu.'},
  {no:23, name:'Diamantová maska', rarity:'diamond', art:'mask', who:'KISS', text:'Tvář, kterou svět bez líčení neviděl až do roku 1983.'},
  {no:24, name:'Mistr čtyř tváří', rarity:'legend', crown:true, who:'KISS', text:'Každá tvář na svém místě. Logika hodná legendy.'},
  {no:25, name:'Stříbrná žárovka', rarity:'silver', art:'bulb', who:'Cedule', text:'První, která se rozsvítí. Bez ní není show.'},
  {no:26, name:'Rozbitá žárovka', rarity:'silver', art:'broken', who:'Cedule', text:'Prasklá při posledním přídavku. Suvenýr z pódia.'},
  {no:27, name:'Zlatý reflektor', rarity:'gold', art:'spot', who:'Cedule', text:'Hledá hvězdu večera. Dnes našel tebe.'},
  {no:28, name:'Zlatý neonový blesk', rarity:'gold', sym:'bolt', who:'Spaceman', text:'Bzučí, bliká a nikdy úplně nezhasne.'},
  {no:29, name:'Platinová pyrotechnika', rarity:'platinum', sym:'burst', who:'Cedule', text:'Výbuch přesně na první úder refrénu.'},
  {no:30, name:'Platinová laserová show', rarity:'platinum', art:'rays', who:'Cedule', text:'Paprsky, které protnou dým nad celou halou.'},
  {no:31, name:'Diamantová cedule', rarity:'diamond', art:'board', who:'Cedule', text:'Každá žárovka na svém místě. Rozsvítil jsi ji ty.'},
  {no:32, name:'Velké finále', rarity:'legend', art:'finale', who:'KISS', text:'Ohňostroj, konfety a „Rock and Roll All Nite“. Dobrou noc!'}
];

const cardSource = (no) => no <= 8 ? 'Dokonči level ' + no + ' pexesa' : no <= 16 ? 'Dokonči turné ' + (no - 8) : no <= 24 ? 'Vyřeš level ' + (no - 16) + ' Čtyř tváří' : 'Rozsviť level ' + (no - 24) + ' cedule';

/* ---------- ukládání: účet Claude, jinak tento prohlížeč ---------- */
let gState = {done:{}, foil:{}, best:{}, qbest:{}, sbest:{}, lbest:{}, got:{}};
const gListeners = [];
export const onStore = (fn) => gListeners.push(fn);
export const getStore = () => gState;
export const saveStore = () => gPersist();
export const connectStore = () => gConnect();
export const syncMode = () => gSync;
let gRemote = null;
let gSync = 'local';
let gWriting = Promise.resolve();
let gConnecting = null;

function gLoadLocal() { try { return JSON.parse(localStorage.getItem(G_KEY)) || null; } catch { return null; } }
function gSaveLocal() { try { localStorage.setItem(G_KEY, JSON.stringify(gState)); } catch {} }
function gMerge(a, b) {
  const out = {done:{...a.done}, foil:{...a.foil}, best:{...a.best}, qbest:{...(a.qbest || {})}};
  for (const key of ['sbest', 'lbest']) { out[key] = {...(a[key] || {})}; for (const k in (b?.[key] || {})) { const x = b[key][k]; if (typeof x === 'number' && (out[key][k] == null || x < out[key][k])) out[key][k] = x; } }
  for (const k in (b?.qbest || {})) { const x = b.qbest[k]; if (x && (!out.qbest[k] || x.score > out.qbest[k].score)) out.qbest[k] = {score:x.score, correct:x.correct}; }
  out.got = {...(a.got || {})};
  for (const k in (b?.got || {})) { const x = b.got[k]; if (typeof x === 'number' && (out.got[k] == null || x < out.got[k])) out.got[k] = x; }
  for (const k in (b?.done || {})) if (b.done[k]) out.done[k] = true;
  for (const k in (b?.foil || {})) if (b.foil[k]) out.foil[k] = true;
  for (const k in (b?.best || {})) {
    const x = b.best[k], y = out.best[k];
    if (x && (!y || x.moves < y.moves || (x.moves === y.moves && x.secs < y.secs))) out.best[k] = {moves:x.moves, secs:x.secs};
  }
  return out;
}
const local = gLoadLocal();
if (local) gState = gMerge(gState, local);
gStamp();

function gStamp() {
  gState.got = gState.got || {};
  for (const k in gState.done) if (gState.done[k] && gState.got[k] == null) gState.got[k] = Date.now();
}
function gPersist() {
  gStamp();
  gSaveLocal();
  if (!gRemote) return;
  const body = JSON.parse(JSON.stringify(gState));
  gWriting = gWriting.then(() => gRemote.set(body)).catch(() => {});
}

function gConnect() {
  if (gConnecting) return gConnecting;
  gConnecting = (async () => {
    if (!window.claude || typeof window.claude.use !== 'function') return;
    const timeout = new Promise((r) => setTimeout(() => r(null), 10000));
    const work = (async () => {
      const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      if (!db || !user) return null;
      const id = await user.id();
      if (!id) return null;
      const ref = db.doc('data/users/' + id + '/kiss-hra');
      const snap = await ref.get();
      return {ref, data:snap.exists ? snap.data() : null};
    })().catch(() => null);
    const res = await Promise.race([work, timeout]);
    if (!res) return;
    gRemote = res.ref;
    gSync = 'cloud';
    const remoteOnly = JSON.stringify(gMerge({done:{}, foil:{}, best:{}, qbest:{}, sbest:{}, lbest:{}, got:{}}, res.data || {}));
    gState = gMerge(gState, res.data || {});
    if (!res.data || JSON.stringify(gState) !== remoteOnly) gPersist();
    else gSaveLocal();
    if (gView.screen === 'home') gRefresh();
    gListeners.forEach((fn) => { try { fn(); } catch {} });
  })();
  return gConnecting;
}

/* ---------- vykreslení ---------- */
let gRoot = null;
let gView = {screen:'home'};
let gTimer = null;

function symSvg(name) {
  const h = name === 'bat' ? 72 : 112;
  return '<svg class="sym sym-' + name + '" viewBox="-6 -6 112 ' + h + '" aria-hidden="true"><use class="sym-shadow" href="#sym-' + name + '"/><use class="sym-face" href="#sym-' + name + '"/><use class="sym-dots" href="#sym-' + name + '"/></svg>';
}

function cardArt(r) {
  if (r.crown) return '<div class="rc-crown">' + ['star','bat','bolt','claw'].map((n) => '<svg class="rc-glyph" viewBox="-6 -6 112 ' + (n === 'bat' ? 72 : 112) + '"><use href="#sym-' + n + '"/></svg>').join('') + '</div>';
  if (r.sym) return '<svg class="rc-glyph" viewBox="-6 -6 112 ' + (r.sym === 'bat' ? 72 : 112) + '"><use href="#sym-' + r.sym + '"/></svg>';
  return '<svg class="rc-glyph" viewBox="0 0 100 100">' + art[r.art] + (r.art === 'guitar' ? art.smoke : '') + '</svg>';
}

const cardRoman = (n) => [['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]].reduce((s, [k, v]) => { while (n >= v) { s += k; n -= v; } return s; }, '');
const cardOrigin = (no) => no <= 8 ? 'Pexeso · level ' + no : no <= 16 ? 'Kvíz · turné ' + (no - 8) : no <= 24 ? 'Čtyři tváře · level ' + (no - 16) : 'Světelná cedule · level ' + (no - 24);
const cardDate = (t) => { const d = new Date(t || Date.now()); return d.getDate() + '. ' + (d.getMonth() + 1) + '. ' + d.getFullYear(); };
const cardNo = (no) => 'No. ' + String(no).padStart(2, '0') + ' / 32';

export function rewardCard(r, opts = {}) {
  const owned = opts.force || gState.done[r.no];
  const foil = owned && gState.foil[r.no];
  if (!owned) {
    return '<div class="rcard locked' + (r.rarity === 'legend' ? ' tarot' : '') + '"><div class="rc-face rc-front"><div class="rc-inner"><span class="rc-q">?</span><p class="rc-lock">' + cardSource(r.no) + '</p><p class="rc-no">' + cardNo(r.no) + '</p></div></div></div>';
  }
  const legend = r.rarity === 'legend';
  const printed = cardDate(gState.got?.[r.no]);
  const front = legend
    ? '<i class="rc-corner c1"></i><i class="rc-corner c2"></i><i class="rc-corner c3"></i><i class="rc-corner c4"></i>'
      + '<p class="rc-roman">' + cardRoman(r.no) + '</p>'
      + '<div class="rc-arch"><div class="rc-art">' + cardArt(r) + '</div><span class="rc-fire"></span></div>'
      + '<p class="rc-orn">✦ ✦ ✦</p><h3 class="rc-name rc-banner">' + gEsc(r.name) + '</h3>'
      + '<p class="rc-no">' + rarityLabel[r.rarity] + ' · ' + cardNo(r.no) + '</p><p class="rc-print">Vytištěno ' + printed + '</p>'
    : '<i class="rc-rivet a"></i><i class="rc-rivet b"></i><i class="rc-rivet c"></i><i class="rc-rivet d"></i>'
      + '<div class="rc-top"><span>' + rarityLabel[r.rarity] + '</span><span>' + gEsc(r.who) + '</span></div>'
      + '<span class="rc-rays"></span><div class="rc-art">' + cardArt(r) + '</div>'
      + '<div class="rc-plate"><h3 class="rc-name">' + gEsc(r.name) + '</h3></div>'
      + '<p class="rc-no">' + cardNo(r.no) + '</p><p class="rc-print">Vytištěno ' + printed + '</p><i class="rc-gem"></i>';
  const back = '<div class="rc-binner"><p class="rc-bhead">KISS 1973–2023</p><p class="rc-bsub">Sběratelská karta</p>'
    + '<div class="rc-medal"><span>' + String(r.no).padStart(2, '0') + '</span></div>'
    + '<h3 class="rc-bname">' + gEsc(r.name) + '</h3><p class="rc-story">' + gEsc(r.text) + '</p>'
    + '<dl class="rc-facts"><div><dt>Získáno</dt><dd>' + printed + '</dd></div><div><dt>Ze hry</dt><dd>' + cardOrigin(r.no) + '</dd></div>'
    + '<div><dt>Vzácnost</dt><dd>' + rarityLabel[r.rarity] + '</dd></div><div><dt>Edice</dt><dd>' + (foil ? 'Lesklá' : 'Standardní') + '</dd></div></dl>'
    + '<p class="rc-bfoot">' + cardNo(r.no) + '</p></div>';
  return '<button type="button" class="rcard r-' + r.rarity + (legend ? ' tarot' : ' relic') + (foil ? ' foil' : '') + '" data-zoom="' + r.no + '" aria-label="' + gEsc(r.name) + ', ' + rarityLabel[r.rarity] + ' karta' + (foil ? ', lesklá edice' : '') + '">'
    + '<div class="rc-flip"><div class="rc-face rc-front"><div class="rc-inner">' + front + (foil ? '<span class="rc-ribbon">Lesklá edice</span>' : '') + '</div><span class="rc-holo"></span><span class="rc-shine"></span></div>'
    + '<div class="rc-face rc-back">' + back + '</div></div></button>';
}

/* otočení karty ve zvětšení, přeskočení rozbalení, náklon telefonu */
let gOrient = false, gOrientFrame = 0;
function gOrientStart() {
  if (gOrient || typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return;
  gOrient = true;
  const root = document.documentElement;
  const listen = () => window.addEventListener('deviceorientation', (e) => {
    if (e.gamma == null || gOrientFrame) return;
    gOrientFrame = requestAnimationFrame(() => {
      gOrientFrame = 0;
      const x = Math.max(-1, Math.min(1, e.gamma / 30)), y = Math.max(-1, Math.min(1, ((e.beta || 45) - 45) / 30));
      root.style.setProperty('--ox', (50 + x * 50).toFixed(1) + '%');
      root.style.setProperty('--oy', (50 + y * 50).toFixed(1) + '%');
      root.style.setProperty('--orx', (-y * 10).toFixed(1) + 'deg');
      root.style.setProperty('--ory', (x * 12).toFixed(1) + 'deg');
      root.classList.add('has-tilt');
    });
  });
  try {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') DeviceOrientationEvent.requestPermission().then((s) => { if (s === 'granted') listen(); }).catch(() => {});
    else listen();
  } catch {}
}
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const reveal = e.target.closest('.g-reveal.fresh');
    if (reveal) { reveal.classList.remove('fresh'); reveal.classList.add('opened'); return; }
    const c = e.target.closest('.g-modal .rcard:not(.locked)');
    if (c) { gOrientStart(); c.classList.toggle('flipped'); }
  });
  document.addEventListener('pointerdown', (e) => { if (e.target.closest && e.target.closest('.rcard')) gOrientStart(); }, {passive:true});
}

export function gamePage() {
  return '<div class="shell page game-page" id="game-root"></div>';
}

export function mountGame() {
  gRoot = document.getElementById('game-root');
  if (!gRoot) return;
  gView = {screen:'home'};
  gRoot.addEventListener('click', gClick);
  gRoot.addEventListener('pointermove', gTilt);
  gRoot.addEventListener('pointerleave', gTiltReset, true);
  gRefresh();
  gConnect();
}

function gRefresh() {
  if (!gRoot || !gRoot.isConnected) return;
  if (gView.screen === 'home') gRoot.innerHTML = gHome();
  else if (gView.screen === 'play') gRenderPlay();
}

function nextLevel() {
  for (const l of gameLevels) if (!gState.done[l.n]) return l.n;
  return null;
}

function gHome() {
  const doneCount = gameLevels.filter((l) => gState.done[l.n]).length;
  const foilCount = gameLevels.filter((l) => gState.foil[l.n]).length;
  const nl = nextLevel();
  return '<header class="section-head"><p class="eyebrow">Hra</p><h1>Pexeso</h1>'
    + '<p class="lede">Najdi dvojice obalů a tváří. Každý level odemkne sběratelskou kartu a správná odpověď na bonusovou otázku z ní udělá lesklou edici.</p></header>'
    + '<div class="g-stats"><div><b>' + doneCount + '</b><span>z 8 karet</span></div><div><b>' + foilCount + '</b><span>lesklých edic</span></div>'
    + '<p class="g-sync">' + (gSync === 'cloud' ? 'Sbírka se ukládá do tvého účtu a je stejná na všech zařízeních.' : 'Sbírka se ukládá v tomto prohlížeči.') + '</p></div>'
    + (nl ? '<button type="button" class="button primary g-go" data-play="' + nl + '">' + (doneCount ? 'Pokračovat: level ' + nl : 'Začít hrát') + ' <span aria-hidden="true">→</span></button>'
          : '<p class="g-all">Máš všech osm karet. Legenda! Levely můžeš hrát znovu a sbírat lesklé edice.</p>')
    + '<h2 class="g-h2">Levely</h2><ol class="g-levels">' + gameLevels.map((l) => {
        const open = l.n === 1 || gState.done[l.n - 1] || gState.done[l.n];
        const b = gState.best[l.n];
        return '<li><button type="button" class="g-level' + (gState.done[l.n] ? ' is-done' : '') + '"' + (open ? ' data-play="' + l.n + '"' : ' disabled') + '>'
          + '<span class="g-ln">' + l.n + '</span><span class="g-lname">' + gEsc(l.name) + '</span>'
          + '<span class="g-lmeta">' + l.pairs + ' dvojic' + (l.time ? ' · ' + l.time + ' s' : '') + (b ? ' · nejlépe ' + b.moves + ' tahů' : '') + '</span>'
          + '<span class="g-lstate">' + (gState.done[l.n] ? (gState.foil[l.n] ? '✦' : '✓') : open ? '▶' : '🔒') + '</span></button></li>';
      }).join('') + '</ol>'
    + '<h2 class="g-h2">Sbírka z pexesa</h2><div class="g-collection">' + rewards.slice(0, 8).map((r) => rewardCard(r)).join('') + '</div>'
    + '<div class="g-modal" hidden></div>';
}

/* ---------- pexeso ---------- */
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function facePool() {
  const pool = albums.filter((a) => covers[a.id]).map((a) => ({key:'a-' + a.id, src:covers[a.id], label:a.title}));
  for (const m of members.slice(0, 4)) {
    if (photos[m.masked]) pool.push({key:'m-' + m.id, src:photos[m.masked].src, label:m.character});
  }
  return pool;
}

function gStart(n) {
  const level = gameLevels.find((l) => l.n === n);
  const faces = shuffle(facePool()).slice(0, level.pairs);
  const deck = shuffle(faces.flatMap((f) => [{...f, uid:f.key + '-1'}, {...f, uid:f.key + '-2'}]));
  gView = {screen:'play', level, deck, open:[], matched:new Set(), moves:0, start:Date.now(), left:level.time, lock:false, over:false};
  clearInterval(gTimer);
  gRoot.innerHTML = gPlayShell();
  gRenderPlay();
  gTimer = setInterval(gTick, 250);
  gRoot.scrollIntoView({block:'start'});
}

function gPlayShell() {
  const l = gView.level;
  const cols = l.pairs * 2 <= 6 ? 3 : l.pairs * 2 <= 12 ? 4 : l.pairs * 2 <= 16 ? 4 : l.pairs * 2 <= 20 ? 5 : 6;
  return '<div class="g-bar"><button type="button" class="back g-back" data-home>← Levely</button>'
    + '<h1 class="g-title">Level ' + l.n + ' · ' + gEsc(l.name) + '</h1>'
    + '<div class="g-hud"><span data-hud="moves"></span><span data-hud="pairs"></span><span data-hud="time"></span></div></div>'
    + '<div class="g-board" style="--cols:' + cols + ';--mcols:' + Math.min(cols, 4) + '">' + gView.deck.map((c, i) =>
        '<button type="button" class="g-card" data-i="' + i + '" aria-label="Karta ' + (i + 1) + '"><span class="g-face g-back-face"><svg viewBox="-6 -6 112 112" aria-hidden="true"><use href="#sym-star"/></svg></span>'
        + '<span class="g-face g-front"><img src="' + c.src + '" alt="" draggable="false"></span></button>').join('') + '</div>'
    + '<div class="g-modal" hidden></div>';
}

function gRenderPlay() {
  const v = gView;
  if (!gRoot.querySelector('.g-board')) { gRoot.innerHTML = gPlayShell(); }
  gRoot.querySelectorAll('.g-card').forEach((el) => {
    const i = +el.dataset.i, c = v.deck[i];
    const up = v.open.includes(i) || v.matched.has(c.key);
    el.classList.toggle('up', up);
    el.classList.toggle('matched', v.matched.has(c.key));
    el.setAttribute('aria-label', up ? c.label : 'Karta ' + (i + 1));
  });
  gHud();
}

function gHud() {
  const v = gView;
  const set = (k, t) => { const e = gRoot.querySelector('[data-hud="' + k + '"]'); if (e) e.textContent = t; };
  set('moves', 'Tahy: ' + v.moves);
  set('pairs', 'Dvojice: ' + v.matched.size + ' / ' + v.level.pairs);
  const secs = Math.floor((Date.now() - v.start) / 1000);
  set('time', v.level.time ? 'Zbývá: ' + Math.max(0, v.level.time - secs) + ' s' : 'Čas: ' + secs + ' s');
  const t = gRoot.querySelector('[data-hud="time"]');
  if (t) t.classList.toggle('warn', !!v.level.time && v.level.time - secs <= 10);
}

function gTick() {
  if (!gRoot || !gRoot.isConnected || gView.screen !== 'play') { clearInterval(gTimer); return; }
  if (gView.over) return;
  gHud();
  const secs = (Date.now() - gView.start) / 1000;
  if (gView.level.time && secs >= gView.level.time) gLose();
}

function gFlip(i) {
  const v = gView;
  if (v.lock || v.over) return;
  const c = v.deck[i];
  if (v.matched.has(c.key) || v.open.includes(i)) return;
  v.open.push(i);
  gRenderPlay();
  if (v.open.length < 2) return;
  v.moves++;
  const [a, b] = v.open.map((k) => v.deck[k]);
  if (a.key === b.key) {
    v.matched.add(a.key); v.open = []; gRenderPlay();
    if (v.matched.size === v.level.pairs) setTimeout(gWin, 500);
  } else {
    v.lock = true;
    setTimeout(() => { v.open = []; v.lock = false; if (gRoot.isConnected && gView === v) gRenderPlay(); }, 850);
  }
  gHud();
}

function gModal(html) {
  const m = gRoot.querySelector('.g-modal');
  m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true">' + html + '</div>';
  m.hidden = false;
  m.querySelector('button')?.focus({preventScroll:true});
}

function gLose() {
  gView.over = true; clearInterval(gTimer);
  gModal('<p class="eyebrow">Konec času</p><h2>Světla zhasla dřív než ty</h2><p>Našel jsi ' + gView.matched.size + ' z ' + gView.level.pairs + ' dvojic. Zkus to znovu, publikum čeká.</p>'
    + '<div class="g-actions"><button type="button" class="button primary" data-play="' + gView.level.n + '">Hrát znovu</button><button type="button" class="button secondary" data-home>Zpět na levely</button></div>');
}

function gWin() {
  const v = gView; v.over = true; clearInterval(gTimer);
  const n = v.level.n, secs = Math.round((Date.now() - v.start) / 1000);
  const first = !gState.done[n];
  gState.done[n] = true;
  const b = gState.best[n];
  if (!b || v.moves < b.moves || (v.moves === b.moves && secs < b.secs)) gState.best[n] = {moves:v.moves, secs};
  gPersist();
  const r = rewards[n - 1];
  v.quiz = gMakeQuiz();
  gModal('<p class="eyebrow">Level ' + n + ' dokončen · ' + v.moves + ' tahů · ' + secs + ' s</p>'
    + '<h2>' + (first ? 'Nová karta ve sbírce!' : 'Karta už je tvoje') + '</h2>'
    + '<div class="g-reveal' + (first ? ' fresh' : '') + '">' + rewardCard(r) + '</div>'
    + (gState.foil[n] ? '<p class="g-note">Lesklou edici už máš.</p>' + gWinActions(n)
       : '<div class="g-quiz"><p class="g-qlabel">Bonusová otázka · správně = lesklá edice</p>' + gQuizHtml(v.quiz) + '</div>'));
}

function gWinActions(n) {
  const nl = gameLevels.find((l) => l.n === n + 1);
  return '<div class="g-actions">' + (nl ? '<button type="button" class="button primary" data-play="' + nl.n + '">Další level ' + nl.n + ' →</button>' : '')
    + '<button type="button" class="button secondary" data-home>Sbírka a levely</button></div>';
}

/* ---------- kvíz ---------- */
function gMakeQuiz() {
  const founders = members.slice(0, 4);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const kind = pick(['year', 'singer', 'cover']);
  if (kind === 'singer') {
    const m = pick(founders.filter((f) => f.tracks && f.tracks.length));
    const t = pick(m.tracks);
    return {q:'Kdo zpívá hlavní vokál ve skladbě „' + t + '“?', options:shuffle(founders.map((f) => f.name)), answer:m.name};
  }
  const pool = albums.filter((a) => covers[a.id]);
  const a = pick(pool);
  if (kind === 'cover') {
    const others = shuffle(pool.filter((x) => x.id !== a.id)).slice(0, 3).map((x) => x.title);
    return {q:'Které album má tento obal?', img:covers[a.id], options:shuffle([a.title, ...others]), answer:a.title};
  }
  const y = a.date.slice(0, 4);
  const years = shuffle([...new Set(albums.map((x) => x.date.slice(0, 4)).filter((x) => x !== y))]).slice(0, 3);
  return {q:'V kterém roce vyšlo album ' + a.title + '?', options:shuffle([y, ...years]), answer:y};
}

function gQuizHtml(q) {
  return (q.img ? '<img class="g-qimg" src="' + q.img + '" alt="Obal alba">' : '') + '<p class="g-q">' + gEsc(q.q) + '</p>'
    + '<div class="g-opts">' + q.options.map((o) => '<button type="button" class="g-opt" data-answer="' + gEsc(o) + '">' + gEsc(o) + '</button>').join('') + '</div>';
}

function gAnswer(btn) {
  const v = gView, q = v.quiz, n = v.level.n;
  if (!q || q.done) return;
  q.done = true;
  const ok = btn.dataset.answer === q.answer;
  gRoot.querySelectorAll('.g-opt').forEach((b) => {
    b.disabled = true;
    if (b.dataset.answer === q.answer) b.classList.add('right');
    else if (b === btn) b.classList.add('wrong');
  });
  if (ok) { gState.foil[n] = true; gPersist(); }
  const reveal = gRoot.querySelector('.g-reveal');
  if (reveal) reveal.innerHTML = rewardCard(rewards[n - 1]);
  const quiz = gRoot.querySelector('.g-quiz');
  quiz.insertAdjacentHTML('beforeend', '<p class="g-note ' + (ok ? 'ok' : 'no') + '">' + (ok ? 'Správně! Karta je teď v lesklé edici.' : 'Vedle. Správně je „' + gEsc(q.answer) + '“. Lesklou edici můžeš získat při dalším hraní tohoto levelu.') + '</p>' + gWinActions(n));
}

/* ---------- interakce ---------- */
function gClick(e) {
  const t = e.target.closest('button');
  if (!t || !gRoot.contains(t)) return;
  if (t.dataset.play) { gStart(+t.dataset.play); return; }
  if (t.hasAttribute('data-home')) { clearInterval(gTimer); gView = {screen:'home'}; gRefresh(); gRoot.scrollIntoView({block:'start'}); return; }
  if (t.dataset.i !== undefined && t.classList.contains('g-card')) { gFlip(+t.dataset.i); return; }
  if (t.dataset.answer !== undefined) { gAnswer(t); return; }
  if (t.dataset.zoom && !t.closest('.g-modal')) {
    const r = rewards[+t.dataset.zoom - 1];
    gModal('<div class="g-zoom">' + rewardCard(r) + '</div><div class="g-actions"><button type="button" class="button secondary" data-close>Zavřít</button></div>');
    return;
  }
  if (t.hasAttribute('data-close')) { const m = gRoot.querySelector('.g-modal'); m.hidden = true; m.innerHTML = ''; }
}

export function tiltCard(e) { gTilt(e); }
function gTilt(e) {
  const c = e.target.closest('.rcard:not(.locked)');
  if (!c) return;
  const r = c.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  c.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
  c.style.setProperty('--my', (y * 100).toFixed(1) + '%');
  c.style.setProperty('--rx', ((0.5 - y) * 14).toFixed(2) + 'deg');
  c.style.setProperty('--ry', ((x - 0.5) * 16).toFixed(2) + 'deg');
}
function gTiltReset(e) {
  const c = e.target.closest && e.target.closest('.rcard');
  if (c && e.target === c) { c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); }
}
