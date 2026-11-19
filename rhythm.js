import { rewards, rewardCard, getStore, saveStore, connectStore, syncText, onStore, tiltCard } from './game.js';

/* ===== Peterův rytmus: zopakuj sekvenci úderů, karty 57–64 ===== */

const ryEsc = (v = '') => String(v).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ryPads = [
  {sym:'star', name:'Činel', tint:'#ff7ac0'},
  {sym:'bat', name:'Kopák', tint:'#ff4a2a'},
  {sym:'bolt', name:'Virbl', tint:'#8fc4ff'},
  {sym:'claw', name:'Tom', tint:'#4ee38a'}
];
export const ryLevels = [
  {n:1, name:'Zvukovka', target:4, gap:640},
  {n:2, name:'Rozehrávka', target:5, gap:600},
  {n:3, name:'Klubový groove', target:6, gap:560},
  {n:4, name:'Shout It Out Loud', target:7, gap:520},
  {n:5, name:'Rychlá ruka', target:8, gap:480},
  {n:6, name:'Sólo na bicí', target:9, gap:440},
  {n:7, name:'Catmanova smršť', target:10, gap:400},
  {n:8, name:'Velké finále', target:12, gap:360}
];
const RY_LIVES = 3;

/* ---------- zvuk: syntetizované bicí ---------- */
let ryCtx = null;
function ryAudio() {
  try {
    if (!ryCtx) ryCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (ryCtx.state === 'suspended') ryCtx.resume();
  } catch { ryCtx = null; }
  return ryCtx;
}
function ryNoise(ctx, dur) {
  const b = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = ctx.createBufferSource(); s.buffer = b; return s;
}
function ryHit(i) {
  const ctx = ryAudio(); if (!ctx) return;
  const t = ctx.currentTime, out = ctx.createGain(); out.gain.value = 0.8; out.connect(ctx.destination);
  if (i === 1) { // kopák
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.18);
    g.gain.setValueAtTime(1.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    o.connect(g).connect(out); o.start(t); o.stop(t + 0.36);
  } else if (i === 2) { // virbl
    const n = ryNoise(ctx, 0.25), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'highpass'; f.frequency.value = 1400;
    g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    n.connect(f).connect(g).connect(out); n.start(t);
    const o = ctx.createOscillator(), g2 = ctx.createGain(); o.frequency.value = 190;
    g2.gain.setValueAtTime(0.5, t); g2.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.connect(g2).connect(out); o.start(t); o.stop(t + 0.12);
  } else if (i === 3) { // tom
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(110, t + 0.3);
    g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    o.connect(g).connect(out); o.start(t); o.stop(t + 0.42);
  } else { // činel
    const n = ryNoise(ctx, 1.2), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'highpass'; f.frequency.value = 6000;
    g.gain.setValueAtTime(0.55, t); g.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
    n.connect(f).connect(g).connect(out); n.start(t);
  }
}
function ryBuzz() {
  const ctx = ryAudio(); if (!ctx) return;
  const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(110, t); o.frequency.linearRampToValueAtTime(70, t + 0.35);
  g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.42);
}

/* ---------- stránka ---------- */
let ryRoot = null, ryView = {screen:'home'}, ryHooked = false, ryTimers = [];
const ryDone = (n) => !!getStore().done[56 + n];
const ryClear = () => { ryTimers.forEach(clearTimeout); ryTimers = []; };
const ryLater = (fn, ms) => { ryTimers.push(setTimeout(() => { if (ryRoot && ryRoot.isConnected) fn(); else ryClear(); }, ms)); };

export function rhythmPage() { return '<div class="shell page rhythm-page" id="rhythm-root"></div>'; }

export function mountRhythm() {
  ryRoot = document.getElementById('rhythm-root');
  if (!ryRoot) return;
  ryView = {screen:'home'};
  ryClear();
  ryRoot.addEventListener('click', ryClick);
  ryRoot.addEventListener('pointerdown', ryPadDown);
  ryRoot.addEventListener('pointermove', tiltCard);
  if (!ryHooked) { ryHooked = true; onStore(() => { if (ryRoot && ryRoot.isConnected && ryView.screen === 'home') ryHome(); }); }
  ryHome();
  connectStore();
}

function ryHome() {
  const st = getStore();
  const done = ryLevels.filter((l) => ryDone(l.n)).length;
  const next = ryLevels.find((l) => !ryDone(l.n));
  ryRoot.innerHTML = '<header class="section-head"><p class="eyebrow">Hra</p><h1>Peterův rytmus</h1>'
    + '<p class="lede">Bicí zahrají rytmus a ty ho zopakuješ ťukáním na bubny. Každé kolo přibude jeden úder a tempo se zrychluje. Máš tři paličky. Za každou chybu jednu ztratíš a rytmus zazní znovu. Level bez jediné chyby dává lesklou edici karty. Zapni si zvuk.</p></header>'
    + '<div class="g-stats"><div><b>' + done + '</b><span>z 8 karet</span></div><p class="g-sync">' + syncText() + '</p></div>'
    + '<div class="ry-start">' + (next ? '<button type="button" class="button primary" data-rylevel="' + next.n + '">' + (done ? 'Pokračovat: level ' + next.n : 'Začít bubnovat') + ' <span aria-hidden="true">→</span></button>' : '')
    + '<button type="button" class="button secondary" data-ryendless>Nekonečný rytmus' + (st.rmax ? ' · rekord ' + st.rmax : '') + '</button></div>'
    + '<h2 class="g-h2">Levely</h2><ol class="g-levels">' + ryLevels.map((l) => {
        const open = l.n === 1 || ryDone(l.n - 1) || ryDone(l.n);
        const b = st.rbest?.[l.n];
        return '<li><button type="button" class="g-level' + (ryDone(l.n) ? ' is-done' : '') + '"' + (open ? ' data-rylevel="' + l.n + '"' : ' disabled') + '>'
          + '<span class="g-ln">' + l.n + '</span><span class="g-lname">' + ryEsc(l.name) + '</span>'
          + '<span class="g-lmeta">' + l.target + ' úderů' + (b != null ? ' · nejméně chyb: ' + b : '') + '</span>'
          + '<span class="g-lstate">' + (ryDone(l.n) ? (st.foil[56 + l.n] ? '✦' : '✓') : open ? '▶' : '🔒') + '</span></button></li>';
      }).join('') + '</ol>'
    + '<h2 class="g-h2">Sbírka z rytmu</h2><div class="g-collection">' + rewards.slice(56, 64).map((r) => rewardCard(r)).join('') + '</div>'
    + '<div class="g-modal" hidden></div>';
}

function ryStart(n, endless) {
  ryClear();
  ryAudio();
  const level = endless ? {n:0, name:'Nekonečný rytmus', target:Infinity, gap:560} : ryLevels.find((l) => l.n === n);
  ryView = {screen:'play', level, endless:!!endless, seq:[], pos:0, lives:RY_LIVES, mistakes:0, state:'idle', over:false};
  ryRoot.innerHTML = '<div class="ry-play"><div class="g-bar"><button type="button" class="back g-back" data-ryhome>← Levely</button>'
    + '<h1 class="g-title">' + (endless ? 'Nekonečný rytmus' : 'Level ' + n + ' · ' + ryEsc(level.name)) + '</h1><div class="g-hud"><span data-ry="len"></span><span data-ry="lives"></span></div></div>'
    + '<p class="ry-status" data-ry="status" role="status">Připrav se…</p>'
    + '<div class="ry-pads">' + ryPads.map((p, i) => '<button type="button" class="ry-pad" data-pad="' + i + '" style="--tint:' + p.tint + '" aria-label="' + p.name + '">'
        + '<svg viewBox="-6 -6 112 ' + (p.sym === 'bat' ? 72 : 112) + '" aria-hidden="true"><use href="#sym-' + p.sym + '"/></svg><span>' + p.name + '</span></button>').join('') + '</div>'
    + '<div class="ry-progress"><i data-ry="bar"></i></div></div>'
    + '<div class="g-modal" hidden></div>';
  ryRoot.scrollIntoView({block:'start'});
  ryHud();
  ryLater(ryNextRound, 700);
}

function ryHud() {
  const v = ryView;
  const len = ryRoot.querySelector('[data-ry="len"]'); if (len) len.textContent = 'Délka: ' + v.seq.length + (v.endless ? '' : ' / ' + v.level.target);
  const lives = ryRoot.querySelector('[data-ry="lives"]'); if (lives) lives.textContent = 'Paličky: ' + v.lives + ' / ' + RY_LIVES;
  const bar = ryRoot.querySelector('[data-ry="bar"]'); if (bar && !v.endless) bar.style.width = (Math.min(1, (v.seq.length - 1) / v.level.target) * 100) + '%';
}
function ryStatus(t, cls) { const e = ryRoot.querySelector('[data-ry="status"]'); if (e) { e.textContent = t; e.className = 'ry-status' + (cls ? ' ' + cls : ''); } }
function ryFlash(i, dur = 260) {
  const el = ryRoot.querySelector('[data-pad="' + i + '"]'); if (!el) return;
  el.classList.add('hit'); ryLater(() => el.classList.remove('hit'), dur);
}

function ryNextRound() {
  const v = ryView; if (v.over) return;
  v.seq.push(Math.floor(Math.random() * 4));
  ryPlay();
}
function ryPlay() {
  const v = ryView;
  v.state = 'listen'; v.pos = 0;
  ryRoot.querySelector('.ry-pads')?.classList.add('listen');
  ryStatus('Poslouchej…');
  ryHud();
  const gap = Math.max(260, v.endless ? 600 - v.seq.length * 14 : v.level.gap);
  v.seq.forEach((p, k) => ryLater(() => { ryHit(p); ryFlash(p, gap * 0.55); }, 450 + k * gap));
  ryLater(() => { v.state = 'play'; ryRoot.querySelector('.ry-pads')?.classList.remove('listen'); ryStatus('Tvoje řada!', 'ok'); }, 450 + v.seq.length * gap);
}

function ryPadDown(e) {
  const pad = e.target.closest('.ry-pad');
  if (!pad || ryView.screen !== 'play') return;
  e.preventDefault();
  const v = ryView, i = +pad.dataset.pad;
  ryAudio();
  ryHit(i); ryFlash(i, 160);
  if (v.state !== 'play' || v.over) return;
  if (i !== v.seq[v.pos]) {
    v.mistakes++; v.lives--;
    ryBuzz();
    pad.classList.add('miss'); ryLater(() => pad.classList.remove('miss'), 400);
    ryHud();
    if (v.lives <= 0) { v.state = 'idle'; ryEnd(false); return; }
    v.state = 'idle';
    ryStatus('Vedle! Rytmus zazní znovu.', 'bad');
    ryLater(ryPlay, 1100);
    return;
  }
  v.pos++;
  if (v.pos < v.seq.length) return;
  v.state = 'idle';
  if (!v.endless && v.seq.length >= v.level.target) { ryHud(); ryEnd(true); return; }
  ryStatus('Přesně tak! Ještě jeden úder navíc…', 'ok');
  ryLater(ryNextRound, 800);
}

function ryEnd(won) {
  const v = ryView; v.over = true; ryClear();
  const st = getStore(), m = ryRoot.querySelector('.g-modal');
  if (v.endless) {
    const score = v.seq.length - 1;
    const rec = score > (st.rmax || 0);
    if (rec) { st.rmax = score; saveStore(); }
    m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><p class="eyebrow">Nekonečný rytmus</p><h2>' + score + ' úderů v řadě</h2>'
      + '<p class="g-note' + (rec ? ' ok' : '') + '">' + (rec ? 'Nový rekord!' : 'Rekord: ' + (st.rmax || 0)) + '</p>'
      + '<div class="g-actions"><button type="button" class="button primary" data-ryendless>Znovu</button><button type="button" class="button secondary" data-ryhome>Levely a sbírka</button></div></div>';
    m.hidden = false; return;
  }
  const n = v.level.n;
  if (!won) {
    m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><p class="eyebrow">Level ' + n + '</p><h2>Došly paličky</h2>'
      + '<p class="g-note">Dostal ses na ' + (v.seq.length - 1) + ' z ' + v.level.target + ' úderů. Další pokus bude mít jiný rytmus.</p>'
      + '<div class="g-actions"><button type="button" class="button primary" data-rylevel="' + n + '">Zkusit znovu</button><button type="button" class="button secondary" data-ryhome>Levely</button></div></div>';
    m.hidden = false; return;
  }
  const first = !st.done[56 + n];
  const clean = v.mistakes === 0;
  const newFoil = clean && !st.foil[56 + n];
  st.done[56 + n] = true;
  if (clean) st.foil[56 + n] = true;
  st.rbest = st.rbest || {};
  if (st.rbest[n] == null || v.mistakes < st.rbest[n]) st.rbest[n] = v.mistakes;
  saveStore();
  ryStatus('Rytmus sedí!', 'ok');
  ryRoot.querySelector('.ry-pads')?.classList.add('solved');
  [0, 1, 2, 3, 1, 2, 0].forEach((p, k) => ryLater(() => { ryHit(p); ryFlash(p, 120); }, k * 110));
  const next = ryLevels.find((l) => l.n === n + 1);
  ryLater(() => {
    m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><p class="eyebrow">Level ' + n + ' · ' + (clean ? 'bez chyby' : v.mistakes + (v.mistakes === 1 ? ' chyba' : ' chyby')) + '</p>'
      + '<h2>' + (first ? 'Rytmus sedí! Nová karta' : 'Rytmus sedí!') + '</h2>'
      + '<div class="g-reveal' + (first || newFoil ? ' fresh' : '') + '">' + rewardCard(rewards[56 + n - 1]) + '</div>'
      + (newFoil ? '<p class="g-note ok">Bez jediné chyby: karta je v lesklé edici.</p>' : !st.foil[56 + n] ? '<p class="g-note">Zahraj level bez chyby a získáš lesklou edici.</p>' : '')
      + '<div class="g-actions">' + (next ? '<button type="button" class="button primary" data-rylevel="' + next.n + '">Další level ' + next.n + ' →</button>' : '<button type="button" class="button primary" data-ryendless>Nekonečný rytmus</button>')
      + '<button type="button" class="button secondary" data-ryhome>Sbírka a levely</button></div></div>';
    m.hidden = false; m.querySelector('button')?.focus({preventScroll:true});
  }, 1100);
}

function ryClick(e) {
  const b = e.target.closest('button');
  if (!b || !ryRoot.contains(b) || b.classList.contains('ry-pad')) return;
  if (b.dataset.rylevel) { ryStart(+b.dataset.rylevel); return; }
  if (b.hasAttribute('data-ryendless')) { ryStart(0, true); return; }
  if (b.hasAttribute('data-ryhome')) { ryClear(); ryView = {screen:'home'}; ryHome(); ryRoot.scrollIntoView({block:'start'}); return; }
  if (b.dataset.zoom && !b.closest('.g-modal')) {
    const m = ryRoot.querySelector('.g-modal');
    m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><div class="g-zoom">' + rewardCard(rewards[+b.dataset.zoom - 1]) + '</div><div class="g-actions"><button type="button" class="button secondary" data-ryclose>Zavřít</button></div></div>';
    m.hidden = false; return;
  }
  if (b.hasAttribute('data-ryclose')) { const m = ryRoot.querySelector('.g-modal'); m.hidden = true; m.innerHTML = ''; }
}
