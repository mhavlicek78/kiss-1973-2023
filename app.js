import { albums, types, musicPaths, covers } from './albums.js';
import { eras, members, sources } from './data.js';
import { photos } from './photos.js';
import { gamePage, mountGame } from './game.js';
import { quizPage, mountQuiz } from './quiz.js';
import { sudokuPage, mountSudoku } from './sudoku.js';
import { lightsPage, mountLights } from './lights.js';
import { mysteryPage, mountMystery } from './mystery.js';
import { timelinePage, mountTimeline } from './timeline.js';
import { nonogramPage, mountNonogram } from './nonogram.js';
import { rhythmPage, mountRhythm } from './rhythm.js';
import { czPage, czMount } from './cz.js';
import { rewards, rewardCard, getStore, connectStore, onStore, tiltCard, syncText, syncAvailable, syncCode, syncStatus, suggestCode, connectCode, disconnectCode } from './game.js';

const hubGames = [
  {href:'#/pexeso', name:'Pexeso', sym:'star', from:0, text:'Najdi dvojice karet a odpověz na otázku ke každé z nich. Osm levelů, některé s časovým limitem.'},
  {href:'#/kviz', name:'Kvíz', sym:'bat', from:8, text:'Osm turné po deseti otázkách. Čím dál, tím méně času na odpověď.'},
  {href:'#/ctyri-tvare', name:'Čtyři tváře', sym:'claw', from:16, text:'Sudoku se symboly masek. Každý symbol jednou v řádku, sloupci i bloku. Od levelu 4 přibude liška a ankh.'},
  {href:'#/cedule', name:'Světelná cedule', sym:'bolt', from:24, text:'Ťukni na žárovku a přepneš i sousední. Rozsviť celou ceduli, hvězdu, blesk i netopýra.'},
  {href:'#/zakulisi', name:'Backstage Mystery', sym:'burst', from:32, text:'Detektivní případy ze zákulisí. Z indicií zjisti, kdo co odnesl, kam a kdy. Někdy je to žertík samotné kapely.'},
  {href:'#/kariera', name:'Seřaď kariéru', sym:'star', from:40, text:'Alba, velké momenty, změny sestavy a turné. Přetáhni karty do správného pořadí od nejstaršího.'},
  {href:'#/masky', name:'Malované masky', sym:'bat', from:48, text:'Podle čísel vybarvuj mřížku, až se vynoří obrázek. Hvězda, netopýr, liška i Démonova maska.'},
  {href:'#/rytmus', name:'Peterův rytmus', sym:'claw', from:56, text:'Bicí zahrají rytmus a ty ho zopakuješ. Každé kolo o úder delší a rychlejší. Se zvukem.'}
];
/* ===== Znělka na úvodní stránce: pustí se při prvním ťuknutí (prohlížeče nedovolí dřív) ===== */
const INTRO_KEY = 'kiss-zvuk';
let introAudio = null, introBtn = null, introOnHome = false;
const introMuted = () => { try { return localStorage.getItem(INTRO_KEY) === 'off'; } catch { return false; } };
const introPlayed = () => { try { return sessionStorage.getItem('kiss-zvuk-hral') === '1'; } catch { return false; } };
function introUi() {
  if (!introBtn) {
    introBtn = document.createElement('button');
    introBtn.type = 'button';
    introBtn.className = 'intro-btn';
    introBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="ib-spk" d="M4 9h4l5-4v14l-5-4H4z"/><path class="ib-on" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/><path class="ib-off" d="M16.5 9.5l5 5m0-5-5 5"/></svg>';
    introBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (introMuted()) { try { localStorage.removeItem(INTRO_KEY); } catch {} introPlay(true); }
      else { try { localStorage.setItem(INTRO_KEY, 'off'); } catch {} introStop(); }
      introUi();
    });
    document.body.appendChild(introBtn);
  }
  const muted = introMuted(), playing = introAudio && !introAudio.paused;
  introBtn.hidden = !introOnHome && !playing;
  introBtn.classList.toggle('is-off', muted);
  introBtn.classList.toggle('is-playing', !!playing);
  introBtn.classList.toggle('is-waiting', !muted && !playing && !introPlayed());
  introBtn.setAttribute('aria-label', muted ? 'Zapnout znělku' : playing ? 'Vypnout znělku' : 'Znělka zapnutá, ťukni kamkoli');
  introBtn.title = introBtn.getAttribute('aria-label');
}
function introPlay(force) {
  if (introMuted() || (!force && introPlayed())) return;
  try { sessionStorage.setItem('kiss-zvuk-hral', '1'); } catch {}
  if (!introAudio) {
    introAudio = new Audio('assets/audio/znelka.mp3');
    introAudio.preload = 'auto';
    introAudio.addEventListener('ended', introUi);
    introAudio.addEventListener('pause', introUi);
    introAudio.addEventListener('playing', introUi);
  }
  introAudio.currentTime = 0;
  introAudio.volume = 0.9;
  introAudio.play().catch(() => { try { sessionStorage.removeItem('kiss-zvuk-hral'); } catch {} introUi(); });
}
function introStop() { if (introAudio) { introAudio.pause(); introAudio.currentTime = 0; } }
function introGesture(e) {
  if (!introOnHome || (introBtn && introBtn.contains(e.target))) return;
  introPlay(false);
}
let introHooked = false;
function introArm(onHome) {
  introOnHome = onHome;
  if (!introHooked) {
    introHooked = true;
    ['pointerup', 'touchend', 'keydown'].forEach((ev) => document.addEventListener(ev, introGesture, {passive:true}));
  }
  introUi();
}

let hubHooked = false;
function hubPage() { return '<div class="shell page hub-page" id="hub-root"></div>'; }
function hubSync() {
  if (!syncAvailable()) return '<p class="g-sync hub-synctext">' + syncText() + '</p>';
  const code = syncCode(), st = syncStatus();
  if (code) {
    const when = st.at ? new Date(st.at).toLocaleTimeString('cs-CZ', {hour:'2-digit', minute:'2-digit'}) : '';
    return '<section class="hub-sync is-on"><div><p class="eyebrow">Synchronizace zapnutá</p><p class="hub-code">' + code.replace(/[&<>"']/g, '') + '</p>'
      + '<p class="hub-state">' + (st.state === 'offline' ? 'Teď bez připojení. Pokrok se odešle, až bude internet.' : st.state === 'connecting' ? 'Propojuji…' : 'Synchronizováno' + (when ? ' v ' + when : '') + '. Stejný kód zadej na dalším zařízení.') + '</p></div>'
      + '<button type="button" class="button secondary" data-hsync-off>Odpojit toto zařízení</button></section>';
  }
  return '<section class="hub-sync"><p class="eyebrow">Synchronizace sbírky</p>'
    + '<p class="hub-lede">Zvol si vlastní kód sbírky a zadej ho na každém svém zařízení. Kdo má jiný kód, má vlastní sbírku. Kód si zapiš, bez něj sbírku na jiném zařízení neobnovíš.</p>'
    + '<form class="hub-form" data-hsync-form autocomplete="off"><label class="sr-only" for="hub-code">Kód sbírky</label>'
    + '<input id="hub-code" name="code" type="text" inputmode="text" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="demon-raketa-4271" required minlength="10">'
    + '<button type="button" class="button secondary" data-hsync-new>Vymyslet kód</button><button type="submit" class="button primary">Propojit</button></form>'
    + '<label class="hub-keep"><input type="checkbox" name="keep" checked data-hsync-keep> Přidat do sbírky i karty, které už mám na tomto zařízení</label>'
    + '<p class="hub-err" data-hsync-err role="alert"></p></section>';
}
function hubRender() {
  const root = document.getElementById('hub-root');
  if (!root) return;
  const typed = root.querySelector('#hub-code')?.value || '';
  if (root.querySelector('#hub-code') === document.activeElement) return;
  const st = getStore();
  const total = rewards.filter((r) => st.done[r.no]).length;
  root.innerHTML = '<header class="section-head"><p class="eyebrow">Hry</p><h1>Hry a sbírka karet</h1>'
    + '<p class="lede">' + hubGames.length + ' her, každá s osmi levely a osmi sběratelskými kartami. Celkem ' + total + ' z ' + rewards.length + ' karet ve sbírce.</p></header>'
    + hubSync()
    + '<div class="hub-grid">' + hubGames.map((g) => {
        const got = rewards.slice(g.from, g.from + 8).filter((r) => st.done[r.no]).length;
        return '<a class="hub-tile" href="' + g.href + '">' + sym(g.sym, 'hub-sym') + '<h2>' + g.name + '</h2><p>' + g.text + '</p>'
          + '<span class="hub-bar"><i style="width:' + (got / 8 * 100) + '%"></i></span><span class="hub-meta">' + got + ' / 8 karet <b aria-hidden="true">→</b></span></a>';
      }).join('') + '</div>'
    + '<h2 class="g-h2">Celá sbírka</h2><div class="g-collection">' + rewards.map((r) => rewardCard(r)).join('') + '</div><div class="g-modal" hidden></div>';
  const inp = root.querySelector('#hub-code'); if (inp && typed) inp.value = typed;
}
function mountHub() {
  const root = document.getElementById('hub-root');
  if (!root) return;
  root.addEventListener('pointermove', tiltCard);
  root.addEventListener('submit', async (e) => {
    const f = e.target.closest('[data-hsync-form]'); if (!f) return;
    e.preventDefault();
    const err = root.querySelector('[data-hsync-err]'), keep = root.querySelector('[data-hsync-keep]')?.checked !== false;
    const btn = f.querySelector('[type=submit]'); btn.disabled = true; err.textContent = ''; document.activeElement?.blur();
    try { await connectCode(f.querySelector('#hub-code').value, keep); hubRender(); }
    catch (x) { err.textContent = x.message || 'Propojení se nepovedlo. Zkus to znovu.'; btn.disabled = false; }
  });
  root.addEventListener('input', (e) => { if (e.target.id === 'hub-code') { const err = root.querySelector('[data-hsync-err]'); if (err) err.textContent = ''; } });
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-hsync-new')) { const i = root.querySelector('#hub-code'); i.value = suggestCode(); i.focus(); return; }
    if (b.hasAttribute('data-hsync-off')) {
      if (b.dataset.confirm) { disconnectCode(); hubRender(); return; }
      b.dataset.confirm = '1'; b.textContent = 'Opravdu odpojit? Karty z tohoto zařízení zmizí, v kódu zůstanou.'; return;
    }
    const m = root.querySelector('.g-modal');
    if (b.dataset.zoom && !b.closest('.g-modal')) {
      m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><div class="g-zoom">' + rewardCard(rewards[+b.dataset.zoom - 1]) + '</div><div class="g-actions"><button type="button" class="button secondary" data-hclose>Zavřít</button></div></div>';
      m.hidden = false;
    } else if (b.hasAttribute('data-hclose')) { m.hidden = true; m.innerHTML = ''; }
  });
  if (!hubHooked) { hubHooked = true; onStore(hubRender); }
  hubRender();
  connectStore();
}

const main = document.querySelector('main');
const founderList = members.slice(0, 4);
const albumById = new Map(albums.map((album) => [album.id, album]));
const profiles = new Map(founderList.map((member) => [member.id, member]));
const typeLabels = {studio:'Studiové album', live:'Živé album', solo:'Sólové album'};
const parentRoutes = {home:'#/', timeline:'#/casova-osa', members:'#/clenove', albums:'#/diskografie'};
const coverTones = ['#b45139','#b78e45','#627975','#a65b77','#b07546','#8a5f52','#5c6b9a'];
const viewedPhotos = new Map();
const scrollPositions = new Map();

const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const arrow = '<span class="arrow" aria-hidden="true">↗</span>';
const right = '<span aria-hidden="true">→</span>';
const up = '<span aria-hidden="true">↑</span>';
const back = (url, label) => '<a class="back" href="' + url + '"><span aria-hidden="true">←</span> ' + label + '</a>';

function dateLabel(value) {
  const [year, month, day] = value.split('-');
  if (!month) return year;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day || '1')));
  return new Intl.DateTimeFormat('cs', {
    year:'numeric', month: day ? 'numeric' : 'long', day: day ? 'numeric' : undefined, timeZone:'UTC'
  }).format(date);
}

function sectionHead(label, title, description = '') {
  return '<div class="section-head"><p class="eyebrow">' + label + '</p><h1>' + title + '</h1>'
    + (description ? '<p class="intro">' + description + '</p>' : '') + '</div>';
}

function sourceLinks(keys) {
  return '<ul class="source-links">' + keys.map((key) => {
    const [label, url] = sources[key];
    return '<li><a href="' + url + '" target="_blank" rel="noopener noreferrer">' + esc(label) + ' ' + arrow + '</a></li>';
  }).join('') + '</ul>';
}

function picture(id, eager = false) {
  const photo = photos[id];
  if (!photo) return '';
  return '<img class="photo-img" src="' + esc(photo.src) + '"'
    + ' alt="' + esc(photo.title) + '" loading="' + (eager ? 'eager' : 'lazy')
    + '" decoding="' + (eager ? 'auto" fetchpriority="high' : 'async')
    + '" style="object-position:' + esc(photo.position || '50% 40%') + '">';
}

function credit(id) {
  const item = photos[id];
  if (!item || /^dodal /.test(item.author || '')) return '';
  const label = esc(item.title) + ' · ' + esc(item.author);
  const source = item.page ? '<a href="' + esc(item.page) + '" target="_blank" rel="noopener noreferrer">' + label + '</a>' : '<span>' + label + '</span>';
  return item.licenseUrl ? source + ' <span aria-hidden="true"> / </span><a href="'
    + esc(item.licenseUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(item.license) + '</a>' : source;
}

function photoFrame(id, layout = 'landscape', eager = false) {
  return '<figure class="photo photo-' + layout + (photos[id]?.context ? ' photo-context' : '') + '"><div class="photo-frame">' + picture(id,eager)
    + '</div>' + (credit(id) ? '<figcaption>' + credit(id) + '</figcaption>' : '') + '</figure>';
}

function currentPhoto(member) {
  const mode = viewedPhotos.get(member.id) || (member.masked && photos[member.masked] ? 'masked' : 'plain');
  return {mode, id:member[mode]};
}

function photoControls(member, active) {
  if (!photos[member.masked] || !photos[member.plain]) return '';
  return '<div class="toggle" aria-label="Fotografie — ' + esc(member.name) + '">'
    + [['masked','S maskou'],['plain','Bez masky']].map(([mode,label]) =>
      '<button type="button" data-person="' + member.id + '" data-mode="' + mode
      + '" aria-pressed="' + (mode === active) + '">' + label + '</button>').join('')
    + '</div>';
}

function memberPhoto(member, isProfile = false) {
  const {mode,id} = currentPhoto(member);
  return '<div data-photo-panel="' + member.id + '" data-layout="' + (isProfile ? 'profile' : 'portrait') + '">'
    + photoFrame(id,isProfile ? 'profile' : 'portrait',isProfile) + photoControls(member,mode) + '</div>';
}

const emblems = { 'paul-stanley':'star', 'gene-simmons':'bat', 'ace-frehley':'bolt', 'peter-criss':'claw' };

function sym(name, cls = '') {
  return '<svg class="sym sym-' + name + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false">'
    + '<use class="sym-shadow" href="#sym-' + name + '"/><use class="sym-face" href="#sym-' + name + '"/><use class="sym-dots" href="#sym-' + name + '"/></svg>';
}

function founderCard(member, showProfileDetails) {
  return '<article class="founder-card" style="--person:' + member.accent + '">'
    + (emblems[member.id] ? sym(emblems[member.id],'emblem') : '')
    + (showProfileDetails ? memberPhoto(member) : photoFrame(member.solo,'sleeve'))
    + '<div class="founder-meta"><p class="character">' + member.character + '</p>'
    + '<h3><a href="#/clenove/' + member.id + '">' + member.name + right + '</a></h3>'
    + (showProfileDetails ? facts(member) : '') + '</div></article>';
}

function facts(member) {
  return '<dl class="facts"><div><dt>Role</dt><dd>' + member.role + '</dd></div>'
    + '<div><dt>V KISS</dt><dd>' + member.years + '</dd></div>'
    + '<div><dt>Narození</dt><dd>' + dateLabel(member.born) + '</dd></div>'
    + (member.died ? '<div><dt>Úmrtí</dt><dd>' + dateLabel(member.died) + '</dd></div>' : '') + '</dl>';
}

function stageScene() {
  const sparks = Array.from({length:22}, (_, i) => '<i style="--x:' + ((i * 37) % 100) + '%;--d:' + (3 + (i % 5) * .8).toFixed(1)
    + 's;--t:' + (-(i * .67) % 5).toFixed(2) + 's;--s:' + (2 + (i % 3)) + 'px"></i>').join('');
  const floaters = [['star','f1'],['bat','f2'],['burst','f3'],['claw','f4'],['star','f5'],['bolt','f6'],['star','f7'],['burst','f8']]
    .map(([n, c]) => sym(n, 'floater ' + c)).join('');
  return '<div class="stage-scene" aria-hidden="true"><span class="speedlines"></span><span class="halftone"></span><span class="backlight"></span>' + floaters
    + '<span class="sheen"></span><span class="beam beam-1"></span><span class="beam beam-2"></span><span class="beam beam-3"></span><span class="beam beam-4"></span>'
    + '<span class="smoke smoke-back"></span><span class="strobe"></span><span class="fog-mid"></span>'
    + '<span class="sparks">' + sparks + '</span></div>';
}

function ghost(name, place = '') {
  return '<span class="ghost ghost-' + name + (place ? ' ' + place : '') + '" aria-hidden="true"></span>';
}

function home() {
  return '<section class="hero stage" aria-labelledby="home-title">' + stageScene() + '<div class="shell hero-layout">'
    + '<div class="marquee" role="img" aria-label="KISS">'
    + '<img class="marquee-steel" src="assets/logo/steel.webp" width="1590" height="738" alt="" fetchpriority="high">'
    + '<img class="marquee-bulbs bulbs-base" src="assets/logo/bulbs-base.webp" width="1590" height="738" alt="">'
    + '<img class="marquee-bulbs bulbs-f1" src="assets/logo/bulbs-f1.webp" width="1590" height="738" alt="">'
    + '<img class="marquee-bulbs bulbs-f2" src="assets/logo/bulbs-f2.webp" width="1590" height="738" alt="">'
    + '<img class="marquee-bulbs bulbs-f3" src="assets/logo/bulbs-f3.webp" width="1590" height="738" alt=""></div>'
    + '<div class="apparitions" aria-hidden="true"><span class="fog-back"></span>'
    + ['gene','ace','paul','peter'].map((n, i) => '<span class="apparition app-' + n + '" style="--i:' + i + '"></span>').join('')
    + [[0,'bat',0,54,130,-10],[0,'bat',44,66,80,12],[0,'bat',4,84,56,-18],
       [1,'bolt',90,52,100,14],[1,'burst',47,74,84,-8],[1,'bolt',91,84,50,-20],
       [2,'star',16,58,100,-12],[2,'star',63,66,64,16],[2,'star',18,86,46,8],
       [3,'claw',83,56,100,10],[3,'claw',36,70,74,-14],[3,'star',84,86,42,6]]
      .map(([i, n, x, y, w, r]) => sym(n, 'app-sym').replace('<svg ', '<svg style="--i:' + i + ';--x:' + x + '%;--y:' + y + '%;--w:' + w + 'px;--r:' + r + 'deg" ')).join('')
    + '<span class="fog-front"></span><span class="fog-front fog-front-2"></span></div>'
    + '<div class="hero-content">'
    + '<p class="eyebrow hero-years">1973—2023</p>'
    + '<h1 id="home-title" class="hero-line"><span>You wanted the best,</span> <span>you got the best!</span></h1>'
    + '<p class="hero-intro">Od prvního koncertu v Queensu po poslední večer End of the Road.</p>'
    + '<a class="button primary" href="#/casova-osa">Projít kariéru ' + right + '</a>'
    + '</div></div>'
    + '<span class="hero-fog" aria-hidden="true"></span></section>'
    + '<section class="shell home-section"><div class="section-row"><div><h2>' + sym('star','inline') + 'Original Line-up</h2></div>'
    + '</div><div class="founder-grid">'
    + founderList.map((member) => founderCard(member,false)).join('') + '</div></section>'
    + '<section class="shell home-section"><div class="section-row"><h2>' + sym('bolt','inline') + 'Éry kapely</h2><a class="quiet" href="#/casova-osa">Celá historie ' + right + '</a></div>'
    + '<div class="era-grid">' + eras.map((era) => '<article class="era-card"><div class="photo-frame">' + picture(era.photo)
      + '</div><a href="#/casova-osa/' + era.id + '"><span class="era-years">' + era.years + '</span><strong>' + era.title + '</strong>' + right + '</a>'
      + (credit(era.photo) ? '<div class="era-card-credit">' + credit(era.photo) + '</div>' : '') + '</article>').join('') + '</div></section>'
    + '<section class="shell album-callout">' + ghost('paul','ghost-callout') + '<span class="callout-vinyl" aria-hidden="true"><i></i></span><div><p class="eyebrow">Diskografie</p><h2>Od KISS po Monster</h2>'
    + '<p>Studiová alba, koncertní nahrávky a čtyři sólovky z roku 1978.</p></div>'
    + '<a class="button secondary" href="#/diskografie">Procházet alba ' + right + '</a></section>';
}

function timeline(active) {
  return '<div class="shell page"><div id="zacatek">' + sectionHead('1973—2023','Časová osa',
    'Od klubových začátků přes roky bez masek a reunion až po digitální premiéru v Madison Square Garden.') + '</div>'
    + '<nav class="era-jump" aria-label="Přeskočit na éru">' + eras.map((era) =>
    '<a href="#/casova-osa/' + era.id + '"' + (active === era.id ? ' aria-current="location"' : '')
    + '><span>' + era.years + '</span>' + era.short + '</a>').join('') + '</nav>'
    + eras.map((era) => '<section id="era-' + era.id + '" class="chapter"><div class="chapter-header">'
      + photoFrame(era.photo) + '<div><p class="eyebrow">' + era.years + '</p><h2 tabindex="-1">' + era.title + '</h2><p>' + esc(era.intro)
      + '</p><p class="lineup"><strong>Sestavy</strong><br>' + esc(era.lineup) + '</p></div></div>'
      + '<ol class="milestones">' + era.events.filter((event) => !event.media).map((event) => '<li'
        + '><a href="#/milnik/' + event.id + '"><span class="event-date">' + event.date + '</span>'
        + '<span><strong>' + esc(event.title) + '</strong><small>' + esc(event.summary) + '</small></span>'
        + (event.media ? '<span class="milestone-action">Klip a poslech ' + right + '</span>' : arrow) + '</a></li>').join('')
      + '</ol>' + era.events.filter((event) => event.media).map(avatarFeature).join('') + '<a class="to-top quiet" href="#/casova-osa" data-top>Na začátek osy ' + up + '</a></section>').join('') + '</div>';
}

function avatarFeature(event) {
  return '<section class="avatar-feature"><figure class="avatar-photo"><img src="assets/photos/avatars.jpg" alt="Digitální avataři KISS: Spaceman, Starchild, Démon s křídly a Catman" loading="lazy"></figure>'
    + '<div><p class="eyebrow">' + event.date + ' · Madison Square Garden</p><h2>' + esc(event.title) + '</h2>'
    + '<p>' + esc(event.summary) + ' Vytvořilo je studio Industrial Light & Magic podle pohybů a výrazů samotných hudebníků.</p>'
    + '<a class="listen-cta" href="#/milnik/' + event.id + '">'
    + '<span class="listen-ico" aria-hidden="true"><svg viewBox="0 0 100 100"><defs><radialGradient id="pl-g" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#fafbfc"/><stop offset=".35" stop-color="#b9bdc4"/><stop offset=".6" stop-color="#5d6168"/><stop offset=".8" stop-color="#c9ccd1"/><stop offset="1" stop-color="#3a3c40"/></radialGradient></defs><circle cx="50" cy="50" r="48" fill="url(#pl-g)"/><circle cx="50" cy="50" r="40" fill="#141416" stroke="#e9ebee" stroke-width="1.5"/><path d="M41 32l28 18-28 18z" fill="url(#pl-g)"/><path d="M18 30a40 40 0 0 1 22-16" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/></svg></span>'
    + '<span class="listen-txt"><small>Oficiální klip a skladba z premiéry</small>Klip a poslech</span><span class="listen-arrow" aria-hidden="true">→</span></a></div></section>';
}

function eventImage(image) {
  return '<figure class="photo photo-landscape event-photo"><div class="photo-frame"><img class="photo-img" src="' + image.src + '" alt="' + esc(image.alt) + '" loading="lazy"></div><figcaption>Rané klubové vystoupení, 1973</figcaption></figure>';
}

function eventPage(era, event) {
  const roster = members.filter((member) => era.lineup.includes(member.name) || event.detail.includes(member.name));
  return '<div class="shell page article-page">' + back('#/casova-osa/' + era.id,'Zpět na časovou osu')
    + sectionHead(event.date,esc(event.title),esc(event.summary))
    + (event.media ? avatarMedia(event.media) : '') + '<div class="article-grid">'
    + '<div><p class="article-copy">' + esc(event.detail) + '</p>'
    + (knownAlbums(event.albums).length ? '<h2>Alba z této kapitoly</h2>' + albumLinks(event.albums) : '')
    + '<h2>Zdroje</h2>' + sourceLinks(event.sources) + '</div><aside>'
    + (event.media ? '' : event.image ? eventImage(event.image) : photoFrame(era.photo)) + '<p class="lineup"><strong>' + era.title + '</strong><br>' + esc(era.lineup) + '</p>'
    + '<h2>Členové v této éře</h2><ul class="text-links">' + roster.map((member) =>
      '<li><a href="#/clenove/' + member.id + '">' + member.name + right + '</a></li>').join('')
    + '</ul></aside></div></div>';
}

function playerToggle({id, embed, title, show, hide, kind, buttonClass = 'quiet player-toggle'}) {
  return '<button class="' + buttonClass + '" type="button" data-player="' + esc(embed)
    + '" data-player-title="' + esc(title) + '" data-player-show="' + esc(show) + '" data-player-hide="' + esc(hide)
    + '" data-player-kind="' + kind + '" aria-expanded="false" aria-controls="' + id + '">' + esc(show) + '</button>';
}

function avatarMedia({video, song}) {
  const canEmbedVideo = /^https?:$/.test(location.protocol);
  const videoToggle = canEmbedVideo ? playerToggle({
    id:'avatar-video', embed:video.embed, title:video.title,
    show:'Přehrát klip', hide:'Skrýt klip', kind:'video', buttonClass:'button primary'
  }) : '';
  const songToggle = playerToggle({
    id:'avatar-song', embed:song.embed, title:song.title + ' · Apple Music',
    show:'Pustit ukázku', hide:'Skrýt přehrávač', kind:'audio', buttonClass:'button secondary'
  });
  return '<div class="avatar-media"><section class="media-card"><p class="eyebrow">Oficiální klip</p>'
    + '<h2>A New Era Begins</h2><div class="media-actions">' + videoToggle
    + '<a class="' + (canEmbedVideo ? 'quiet' : 'button primary') + '" href="' + esc(video.watch)
    + '" target="_blank" rel="noopener noreferrer">Přehrát na YouTube ' + arrow + '</a></div>'
    + '<div id="avatar-video" class="video-player"></div></section>'
    + '<section class="media-card"><p class="eyebrow">Skladba z premiéry</p><h2>' + esc(song.title)
    + '</h2><div class="media-actions">' + songToggle + '<a class="quiet" href="' + esc(song.listen)
    + '" target="_blank" rel="noopener noreferrer">Otevřít v Apple Music ' + arrow + '</a></div>'
    + '<div id="avatar-song" class="audio-player"></div></section></div>';
}

function knownAlbums(ids = []) {
  return ids.filter((id) => albumById.has(id));
}

function albumLinks(ids) {
  return '<ul class="text-links">' + knownAlbums(ids).map((id) => {
    const album = albumById.get(id);
    return '<li><a href="#/album/' + id + '">' + esc(album.title) + '<span>' + album.date.slice(0,4) + ' ' + right + '</span></a></li>';
  }).join('') + '</ul>';
}

function memberList() {
  return '<div class="shell page">' + sectionHead('Sestavy KISS','Členové','Všech deset členů kapely, jejich role a roky na pódiu.')
    + '<section><div class="section-row"><h2>Původní čtveřice</h2></div><div class="founder-grid roster-founders">'
    + founderList.map((member) => founderCard(member,true)).join('') + '</div></section>'
    + '<section class="other-members"><h2>Další členové</h2><div class="other-grid">' + members.slice(4).map((member) =>
      '<article class="other-card" id="roster-' + member.id + '">' + memberPhoto(member)
      + '<div class="other-content"><h3 tabindex="-1">' + member.name + '</h3>' + (member.character ? '<p class="character">' + member.character + '</p>' : '')
      + facts(member) + '<p class="member-note">' + esc(member.intro) + '</p></div></article>').join('') + '</div></section>'
    + '<div class="content-sources">' + sourceLinks(['hall','lineup','bio','ace']) + '</div></div>';
}

function persona(id) {
  const r = (i, m, o = 0) => ((i * 37 + o * 11) % m);
  const dots = (n, cls, fn) => Array.from({length:n}, (_, i) => '<i class="' + cls + '" style="' + fn(i) + '"></i>').join('');
  const scenes = {
    'paul-stanley': dots(46,'glint',(i) => '--x:' + r(i,100) + '%;--y:' + r(i,100,7) + '%;--s:' + (2 + i % 4) + 'px;--d:' + (2 + i % 5 * .7).toFixed(1) + 's;--t:' + (-(i * .43) % 4).toFixed(2) + 's')
      + '<span class="glam-rays"></span><span class="big-star">' + sym('star') + '</span>'
      + [[6,18,90,-12],[88,26,70,14],[12,70,54,8],[80,78,96,-6],[48,8,40,20],[60,58,34,-16]].map(([x,y,w,rt],i) => sym('star','pfloat').replace('<svg ','<svg style="--x:' + x + '%;--y:' + y + '%;--w:' + w + 'px;--r:' + rt + 'deg;--t:' + (9 + i * 2) + 's" ')).join(''),
    'gene-simmons': '<span class="blood-drips"></span>' + [0,1,2].map((i) => '<span class="blood-drop" style="--x:' + [14,47,83][i] + '%;--dl:' + (-i * 2.4) + 's"></span>').join('') + '<span class="hellfire"></span><span class="hellglow"></span><span class="demon-eyes"><i></i><i></i></span>'
      + dots(34,'ember',(i) => '--x:' + r(i,100) + '%;--d:' + (5 + i % 6).toFixed(1) + 's;--t:' + (-(i * .61) % 6).toFixed(2) + 's;--s:' + (2 + i % 4) + 'px;--dx:' + (i % 2 ? '' : '-') + (20 + i % 5 * 12) + 'px')
      + [0,1,2,3,4].map((i) => sym('bat','batfly').replace('<svg ','<svg style="--y:' + (8 + i * 15) + '%;--w:' + (60 + (i * 23) % 70) + 'px;--t:' + (14 + i * 3) + 's;--dl:' + (-i * 4.3).toFixed(1) + 's" ')).join(''),
    'ace-frehley': '<span class="stars stars-1"></span><span class="stars stars-2"></span><span class="stars stars-3"></span><span class="nebula"></span>'
      + '<span class="planet"><span class="ring"></span></span>' + [0,1,2].map((i) => '<span class="comet" style="--y:' + (10 + i * 22) + '%;--t:' + (7 + i * 3) + 's;--dl:' + (-i * 2.7) + 's"></span>').join('')
      + [[8,24,70,14],[86,62,90,-10],[14,74,44,-18]].map(([x,y,w,rt],i) => sym('bolt','pfloat').replace('<svg ','<svg style="--x:' + x + '%;--y:' + y + '%;--w:' + w + 'px;--r:' + rt + 'deg;--t:' + (10 + i * 3) + 's" ')).join(''),
    'peter-criss': '<span class="jungle"></span><span class="jungle-fog"></span>'
      + [[8,22,1],[82,14,.8],[90,52,1.1],[4,62,.7],[70,82,.9],[30,88,.6]].map(([x,y,sc],i) => '<span class="cat-eyes" style="--x:' + x + '%;--y:' + y + '%;--sc:' + sc + ';--t:' + (6 + i * 1.7).toFixed(1) + 's;--dl:' + (-i * 2.3).toFixed(1) + 's"><i></i><i></i></span>').join('')
      + [0,1].map((i) => '<span class="slash slash-' + i + '"><i></i><i></i><i></i></span>').join('')
  };
  return scenes[id] ? '<div class="persona persona-' + id + '" aria-hidden="true">' + scenes[id] + '</div>' : '';
}

function memberPage(member) {
  return persona(member.id) + '<div class="shell page profile" style="--person:' + member.accent + '">' + back(parentRoutes.members,'Zpět na členy')
    + '<div class="profile-top">' + memberPhoto(member,true) + '<div class="profile-copy">' + (emblems[member.id] ? sym(emblems[member.id],'profile-emblem') : '')
    + sectionHead(member.character,member.name,esc(member.intro)) + facts(member)
    + '<a class="button secondary" href="#/album/' + member.solo + '">Sólové album z roku 1978 ' + right + '</a></div></div>'
    + '<div class="article-grid profile-article"><div>' + member.details.map(([title,description]) =>
      '<section><h2>' + esc(title) + '</h2><p class="article-copy">' + esc(description) + '</p></section>').join('')
    + '</div><aside><h2>Skladby, které zpívá</h2><ol class="tracklist">' + member.tracks.map((track) => '<li>' + esc(track) + '</li>').join('')
    + '</ol><h2>Nejúspěšnější alba</h2>' + albumLinks(member.related) + '</aside></div></div>';
}

function safeType(type) {
  return types.some(([id]) => id === type) ? type : 'all';
}

function albumList(filter) {
  const selected = albums.filter((album) => filter === 'all' || album.type === filter);
  return '<div class="shell page">' + sectionHead('Oficiální alba','Diskografie',
    'Studiová alba, živé nahrávky a čtyři sólovky z roku 1978.')
    + '<nav class="filters" aria-label="Filtrovat podle typu alba">' + types.map(([id,label]) =>
      '<a href="#/diskografie' + (id === 'all' ? '' : '?typ=' + id) + '"' + (filter === id ? ' aria-current="true"' : '')
      + '>' + label + ' <span>' + (id === 'all' ? albums.length : albums.filter((album) => album.type === id).length) + '</span></a>').join('')
    + '</nav><div class="album-grid">' + selected.map((album) =>
      '<article class="album-card"><a aria-label="' + esc(album.title) + '" href="#/album/' + album.id + '?z=' + filter + '">'
      + record(album) + '<div class="album-card-meta"><div><h2>' + esc(album.title) + '</h2><p>' + album.date.slice(0,4) + ' · '
      + typeLabels[album.type] + '</p></div>' + arrow + '</div></a></article>').join('') + '</div></div>';
}

function record(album, detail = false) {
  if (covers[album.id]) {
    return '<div class="record has-cover"><div class="record-grooves" aria-hidden="true"></div><img class="cover-img" src="' + covers[album.id] + '"'
      + ' width="800" height="800" alt="' + (detail ? 'Obal alba ' + esc(album.title) : '') + '" loading="' + (detail ? 'eager' : 'lazy') + '" decoding="async"></div>';
  }
  const tone = coverTones[albums.indexOf(album) % coverTones.length];
  const variant = album.type === 'solo' ? profiles.get(album.member).accent : tone;
  return '<div class="record" style="--sleeve:' + variant + '" aria-hidden="true"><div class="record-grooves"></div>'
    + '<span class="record-name">' + esc(album.title) + '</span><span class="record-date">' + album.date.slice(0,4) + '</span></div>';
}

function albumPage(album, filter) {
  const musicPath = musicPaths[album.mediaId];
  const links = musicPath
    ? {listen:'https://music.apple.com' + musicPath, embed:'https://embed.music.apple.com' + musicPath}
    : {listen:'https://www.qobuz.com/us-en/album/mtv-unplugged-kiss/0060254706479'};
  const date = dateLabel(album.date);
  return '<div class="shell page article-page' + (covers[album.id] ? ' has-cover-bg" style="--cover:url(\'' + covers[album.id] + '\')' : '') + '">' + back(parentRoutes.albums + (filter === 'all' ? '' : '?typ=' + filter),'Zpět na diskografii')
    + '<div class="album-top">' + record(album,true) + '<div>' + sectionHead(typeLabels[album.type],esc(album.title),esc(album.context))
    + '<dl class="facts album-facts"><div><dt>První vydání</dt><dd>' + date + '</dd></div>'
    + (album.recorded ? '<div><dt>Nahráno</dt><dd>' + esc(album.recorded) + '</dd></div>' : '')
    + (album.credits ? '<div><dt>Line-up</dt><dd>' + esc(album.credits) + '</dd></div>' : '') + '</dl>'
    + (album.member ? '<a class="quiet" href="#/clenove/' + album.member + '">Profil: ' + profiles.get(album.member).name + ' ' + right + '</a>' : '')
    + '</div></div><div class="article-grid album-details"><section><h2>Skladby</h2>'
    + '<ol class="tracklist">' + album.tracks.map((track) => '<li>' + esc(track) + '</li>').join('') + '</ol>'
    + (album.edition ? '<p class="edition">' + esc(album.edition) + '</p>' : '')
    + '</section><aside><a class="listen-cta" href="' + links.listen + '" target="_blank" rel="noopener noreferrer">'
    + '<span class="listen-ico" aria-hidden="true"><svg viewBox="0 0 100 100"><defs><radialGradient id="lp-g" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#fafbfc"/><stop offset=".35" stop-color="#b9bdc4"/><stop offset=".6" stop-color="#5d6168"/><stop offset=".8" stop-color="#c9ccd1"/><stop offset="1" stop-color="#3a3c40"/></radialGradient></defs><circle cx="50" cy="50" r="48" fill="url(#lp-g)"/><g fill="none" stroke="#0007" stroke-width=".8"><circle cx="50" cy="50" r="42"/><circle cx="50" cy="50" r="37"/><circle cx="50" cy="50" r="32"/><circle cx="50" cy="50" r="27"/></g><path d="M18 30a40 40 0 0 1 22-16" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/><circle cx="50" cy="50" r="17" fill="#141416" stroke="#e9ebee" stroke-width="1.5"/><circle cx="50" cy="50" r="12" fill="none" stroke="#8d9096" stroke-width=".8"/><circle cx="50" cy="50" r="3.2" fill="#e9ebee"/></svg></span>'
    + '<span class="listen-txt"><small>Pusť si album</small>' + (musicPath ? 'Poslechnout v Apple Music' : 'Poslechnout na Qobuz') + '</span>'
    + '<span class="listen-arrow" aria-hidden="true">↗</span></a>'
    + '<h2>Zdroje</h2>' + sourceLinks(['discs','catalog']) + '</aside></div></div>';
}

function about() {
  return '<div class="shell page article-page">' + sectionHead('','O projektu a zdroje',
    'Nezávislý český fanouškovský průvodce kapelou KISS.') + '<div class="article-grid"><div>'
    + '<h2>Rozsah archivu</h2><p class="article-copy">Časová osa končí finále turné End of the Road a premiérou digitálních avatarů v Madison Square Garden. KISS Kruise: Landlocked proběhl v roce 2025.</p>'
    + '<p class="article-copy">Diskografie obsahuje 20 studiových alb, sedm koncertních alb a čtyři sólová alba z roku 1978. Karty v mřížce jsou navržené pro tento web. Originální obaly zpřístupňují odkazy a přehrávače hudebních služeb.</p>'
    + '<h2>Přidání na plochu iPhonu</h2><ol class="instructions"><li>Otevři adresu aplikace v Safari.</li>'
    + '<li>Otevři Sdílet a zvol Přidat na plochu.</li><li>Pokud Safari nabídne volbu Otevřít jako webovou aplikaci, zapni ji a klepni na Přidat.</li></ol>'
    + '<h2>Fotografie a obaly alb</h2><p class="article-copy">Popisky odkazují na fotografie, jejich autory a údaje o licenci, pokud je zdroj uvádí. Portréty na čtyřech obalech sólových alb z roku 1978 ilustroval Eraldo Carugati.</p>'
    + '<ul class="source-links">' + Object.keys(photos).filter((id) => credit(id)).map((id) => '<li>' + credit(id) + '</li>').join('') + '</ul>'
    + '</div><aside><h2>Historické a hudební zdroje</h2>' + sourceLinks(Object.keys(sources)) + '</aside></div></div>';
}

function route() {
  const hash = location.hash || '#/';
  const [path, query = ''] = hash.slice(1).split('?');
  const [group, id] = path.split('/').filter(Boolean);
  const params = new URLSearchParams(query);
  switch (group) {
    case undefined: return {section:'home', html:home(), title:'KISS 1973–2023'};
    case 'casova-osa': return {section:'timeline', html:timeline(id), title:'Časová osa', jump:id ? 'era-' + id : null};
    case 'clenove': {
      const profile = profiles.get(id);
      if (profile) return {section:'members', member:profile.id, html:memberPage(profile), title:profile.name};
      return {section:'members', html:memberList(), title:'Členové', jump:id ? 'roster-' + id : null};
    }
    case 'diskografie': return {section:'albums', html:albumList(safeType(params.get('typ'))), title:'Diskografie'};
    case 'album': {
      const album = albumById.get(id);
      if (album) return {section:'albums', html:albumPage(album,safeType(params.get('z'))), title:album.title};
      break;
    }
    case 'milnik':
      for (const era of eras) {
        const event = era.events.find((item) => item.id === id);
        if (event) return {section:'timeline', html:eventPage(era,event), title:event.title};
      }
      break;
    case 'zdroje': return {section:'about', html:about(), title:'O projektu a zdroje'};
    case 'hra':
    case 'pexeso': return {section:'game', html:gamePage(), title:'Pexeso', mount:mountGame};
    case 'kviz': return {section:'quiz', html:quizPage(), title:'Kvíz', mount:mountQuiz};
    case 'ctyri-tvare': return {section:'sudoku', html:sudokuPage(), title:'Čtyři tváře', mount:mountSudoku};
    case 'cedule': return {section:'lights', html:lightsPage(), title:'Světelná cedule', mount:mountLights};
    case 'zakulisi': return {section:'mystery', html:mysteryPage(), title:'Backstage Mystery', mount:mountMystery};
    case 'kariera': return {section:'timeline', html:timelinePage(), title:'Seřaď kariéru', mount:mountTimeline};
    case 'masky': return {section:'nonogram', html:nonogramPage(), title:'Malované masky', mount:mountNonogram};
    case 'rytmus': return {section:'rhythm', html:rhythmPage(), title:'Peterův rytmus', mount:mountRhythm};
    case 'cesko': return {section:'cz', html:czPage(), title:'KISS v Česku', mount:czMount};
    case 'hry': return {section:'games', html:hubPage(), title:'Hry', mount:mountHub};
  }
  return {section:'', title:'Stránka nenalezena', html:'<div class="shell page">' + sectionHead('KISS','Stránka nenalezena') + back('#/','Zpět na úvod') + '</div>'};
}

let activeHash = null;
let loadCounter = 0;
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

function render(isFirst = false) {
  const next = location.hash || '#/';
  if (activeHash) scrollPositions.set(activeHash,window.scrollY);
  const page = route();
  const renderId = ++loadCounter;
  activeHash = next;
  document.title = page.section === 'home' ? page.title : page.title + ' — KISS 1973–2023';
  main.innerHTML = page.html;
  main.dataset.section = page.section || 'none';
  introArm(page.section === 'home');
  main.dataset.member = page.member || '';
  if (page.mount) page.mount();
  const navSection = ['game', 'quiz', 'sudoku', 'lights', 'mystery', 'timeline', 'nonogram', 'rhythm', 'games'].includes(page.section) ? 'games' : page.section;
  for (const item of document.querySelectorAll('.header nav [data-section]')) {
    if (item.dataset.section === navSection) item.setAttribute('aria-current','page');
    else item.removeAttribute('aria-current');
  }
  requestAnimationFrame(() => {
    if (renderId !== loadCounter) return;
    const target = page.jump && document.getElementById(page.jump);
    const restored = scrollPositions.get(next);
    if (target && restored === undefined) {
      target.scrollIntoView({block:'start'});
      if (!isFirst) target.querySelector('h2, h3')?.focus({preventScroll:true});
    } else {
      window.scrollTo({top:restored ?? 0,behavior:'auto'});
      if (!isFirst) main.focus({preventScroll:true});
    }
  });
}

document.querySelector('.skip').addEventListener('click', (event) => {
  event.preventDefault();
  main.focus();
});
main.addEventListener('click',(event) => {
  if (event.target.closest('[data-top]')) {
    event.preventDefault();
    scrollPositions.delete(parentRoutes.timeline);
    if (location.hash === parentRoutes.timeline) window.scrollTo(0,0);
    else location.hash = parentRoutes.timeline.slice(1);
    return;
  }
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.person) {
    const member = members.find((item) => item.id === button.dataset.person);
    const panel = button.closest('[data-photo-panel]');
    viewedPhotos.set(member.id,button.dataset.mode);
    panel.outerHTML = memberPhoto(member,panel.dataset.layout === 'profile');
    main.querySelector('[data-person="' + member.id + '"][data-mode="' + button.dataset.mode + '"]')?.focus({preventScroll:true});
  } else if (button.dataset.player) {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded',String(!open));
    button.textContent = open ? button.dataset.playerShow : button.dataset.playerHide;
    panel.replaceChildren();
    if (!open) {
      const frame = document.createElement('iframe');
      frame.title = button.dataset.playerTitle;
      frame.src = button.dataset.player;
      if (button.dataset.playerKind === 'video') {
        frame.referrerPolicy = 'strict-origin-when-cross-origin';
        frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        frame.allowFullscreen = true;
      } else {
        frame.height = '175';
        frame.allow = 'autoplay *; encrypted-media *';
        frame.setAttribute('sandbox','allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation');
      }
      panel.append(frame);
    }
  }
});
main.addEventListener('error',(event) => {
  const item = event.target;
  if (!item.matches?.('img.photo-img')) return;
  item.closest('.photo-frame')?.classList.add('photo-unavailable');
},true);
addEventListener('hashchange', () => { document.startViewTransition ? document.startViewTransition(() => render()) : render(); });
render(true);

if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

