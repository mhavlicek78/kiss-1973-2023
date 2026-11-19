import { rewards, rewardCard, getStore, saveStore, connectStore, syncText, onStore, tiltCard } from './game.js';

/* ===== Backstage Mystery: logické případy ze zákulisí, karty 33–40 ===== */

const mCases = [{"n": 1, "title": "Paličky na útěku", "item": "Peterovy paličky", "story": "Půl hodiny před koncertem Peter zjistí, že mu zmizely paličky. Bez nich se „Detroit Rock City“ hrát nedá. V zákulisí se mezitím mihli tři lidé, každý v jiné místnosti a v jiný čas.", "found": "Paličky se nakonec našly ve skladu.", "roles": ["roadie", "zvukařka", "Démon"], "cats": [["Kdo", ["Tony", "Mia", "Gene"]], ["Kde", ["Šatna", "Sklad", "Jeviště"]], ["Kdy", ["19:00", "19:15", "19:30"]]], "sol": [[0, 1, 1], [1, 2, 0], [2, 0, 2]], "clues": ["Mia byla v zákulisí první. Někdo přece musí zkontrolovat mikrofony.", "Gene na jeviště nešel. Zkoušel si v zrcadle jazyk.", "Ve skladu byl někdo dřív, než kdokoli vešel do šatny.", "Tony na jevišti nebyl. Bicí mu prý „nic neudělaly“.", "Gene dorazil až po Tonym."], "culprit": 0, "punch": "Tony odnesl paličky v 19:15 do skladu a omotal je izolepou, aby Peterovi neklouzaly. Peter je dostal zpátky lepší, než byly. Poděkovat ale zapomněl."}, {"n": 2, "title": "Dračí boty", "item": "Geneovy boty", "story": "Gene stojí v šatně v ponožkách a řve tak, že se třesou zrcadla. Jeho dračí plošinovky jsou pryč. Svědci jsou tři a každý byl jinde a jindy.", "found": "Boty se našly v lednici na cateringu.", "roles": ["Starchild", "fotografka", "kostymérka"], "cats": [["Kdo", ["Paul", "Linda", "Rita"]], ["Kde", ["Šatna", "Catering", "Výtah"]], ["Kdy", ["20:00", "20:10", "20:20"]]], "sol": [[0, 1, 1], [1, 2, 2], [2, 0, 0]], "clues": ["Linda dorazila až po Paulovi.", "Kdo jel výtahem, jel jako poslední.", "Rita nebyla na cateringu. Na catering kostymérky nechodí, protože „tam všechno umastí“.", "Paul nepřišel první. Hvězdy chodí pozdě."], "culprit": 0, "punch": "Paul schoval Geneovy boty v 20:10 do lednice na cateringu, prý „aby se Démon trochu zchladil“. Gene se mu pomstí. A s úroky."}, {"n": 3, "title": "Kytara, která odešla sama", "item": "Aceův Les Paul", "story": "Dvě hodiny před koncertem zmizí Aceův kouřící Les Paul. Ace zuří a Gene mezitím v cateringu vyjídá koblihy. Mezi 18:00 a 19:30 se v zákulisí pohybovali čtyři lidé, každý v jiné místnosti a v jiný čas.", "found": "Kytara se objevila ve skladu.", "roles": ["technik", "fotografka", "roadie", "manažer"], "cats": [["Kdo", ["Bob", "Linda", "Tony", "Hank"]], ["Kde", ["Šatna", "Sklad", "Catering", "Jeviště"]], ["Kdy", ["18:00", "18:30", "19:00", "19:30"]]], "sol": [[0, 1, 1], [1, 3, 3], [2, 0, 0], [3, 2, 2]], "clues": ["Tony byl v zákulisí první, ještě než si kdokoli stihl nalít kafe.", "Ve skladu byl někdo přesně o půl hodiny dřív, než jiný člověk dorazil na catering.", "Linda nefotila v šatně ani na cateringu. Tvrdí, že tam „není světlo“.", "Hank přišel až po Bobovi. Jako vždycky.", "Kdo šel na jeviště, šel jako úplně poslední.", "Bob se cateringu vyhýbá. Prý drží dietu."], "culprit": 0, "punch": "Bob odnesl kytaru v 18:30 do skladu vyměnit struny. Zapomněl to komukoli říct, a Ace má teď o jeden důvod víc odpálit pyrotechniku."}, {"n": 4, "title": "Ukradená hvězda", "item": "Paulova šablona hvězdy", "story": "Paul sedí v maskérně a místo hvězdy má kolem oka zatím jen nervózní tik. Šablona, podle které se hvězda maluje, zmizela. Čtyři lidé, čtyři místa, čtyři časy. A Ace se podezřele culí.", "found": "Šablona se našla v autobusu, přilepená na volantu.", "roles": ["Spaceman", "osvětlovač", "řidič autobusu", "maskérka"], "cats": [["Kdo", ["Ace", "Sam", "Joe", "Jana"]], ["Kde", ["Maskérna", "Autobus", "Jeviště", "Chodba"]], ["Kdy", ["17:00", "17:20", "17:40", "18:00"]]], "sol": [[0, 1, 2], [1, 2, 3], [2, 3, 1], [3, 0, 0]], "clues": ["Jana přišla dřív než Joe.", "Kdo byl na chodbě, přišel hned po tom, kdo byl v maskérně.", "Sam nastavoval světla až jako poslední.", "Ace nebyl na jevišti ani na chodbě.", "Ace se objevil až po Joeovi.", "Kdo byl v maskérně, začínal jako první."], "culprit": 0, "punch": "Ace odnesl šablonu v 17:40 do autobusu a přilepil ji Joeovi na volant s nápisem „Ace was here“. Paul si hvězdu namaloval z hlavy. Prý je hezčí než kdy předtím."}, {"n": 5, "title": "Liška utekla", "item": "Ericova liščí maska", "story": "Eric Carr se chystá na pódium a sahá po masce lišky. Háček je prázdný. Někdo tvrdí, že liška „prostě utekla do lesa“. Ty víš, že lesy v aréně nejsou.", "found": "Maska se našla na parkovišti, na kapotě autobusu.", "roles": ["zvukařka", "manažer", "roadie", "kostymérka"], "cats": [["Kdo", ["Mia", "Hank", "Tony", "Rita"]], ["Kde", ["Šatna", "Sklad", "Catering", "Parkoviště"]], ["Kdy", ["21:00", "21:15", "21:30", "21:45"]]], "sol": [[0, 1, 0], [1, 2, 1], [2, 0, 3], [3, 3, 2]], "clues": ["Rita nešla do šatny ani do skladu.", "Na catering přišel někdo hned po tom, kdo byl ve skladu.", "Tony byl poslední. Zase přišel pozdě.", "Hank byl buď na cateringu, nebo na parkovišti.", "Mia přišla dřív než Hank a Hank dřív než Rita."], "culprit": 3, "punch": "Rita odnesla masku v 21:30 na parkoviště, protože na čerstvém vzduchu líp schne nový lak na liščích vousech. Eric vyběhl na pódium jen o minutu později a nikdo nic nepoznal."}, {"n": 6, "title": "Ankh ve výtahu", "item": "Vinnieho ankh", "story": "Vinnie Vincent si nemůže namalovat egyptský ankh, protože mu zmizela zlatá šablona. Gene tvrdí, že nic neví, a tváří se nevinně. U Démona dost neobvyklý výraz.", "found": "Šablona jezdila celou dobu nahoru a dolů ve výtahu.", "roles": ["Démon", "fotografka", "řidič autobusu", "osvětlovač"], "cats": [["Kdo", ["Gene", "Linda", "Joe", "Sam"]], ["Kde", ["Maskérna", "Výtah", "Jeviště", "Šatna"]], ["Kdy", ["18:00", "18:15", "18:30", "18:45"]]], "sol": [[0, 1, 2], [1, 2, 0], [2, 3, 1], [3, 0, 3]], "clues": ["Linda fotila jako první, ale ne v maskérně ani v šatně.", "Sam přišel až po Geneovi.", "Kdo byl v šatně, byl tam dřív než ten ve výtahu.", "Joe nebyl v maskérně ani ve výtahu.", "V maskérně byl někdo jako úplně poslední."], "culprit": 0, "punch": "Gene v 18:30 nechal šablonu ve výtahu a zmáčkl všechna patra. Vinnie ji chytil až napotřetí. Démon prý jen „testoval výtah“."}, {"n": 7, "title": "Oheň, nebo limonáda?", "item": "Geneova lahev pódiového ohně", "story": "Gene se chystá chrlit oheň. Před koncertem si přičichne k lahvi a zbledne pod líčidlem: místo paliva je v ní citronová limonáda. Každý ze čtyř podezřelých byl jinde, jindy a nesl jiné zavazadlo.", "found": "Prázdná lahev od paliva se našla v červené tašce.", "roles": ["Catman", "technik", "kostymérka", "osvětlovač"], "cats": [["Kdo", ["Peter", "Bob", "Rita", "Sam"]], ["Kde", ["Sklad", "Šatna", "Catering", "Jeviště"]], ["Kdy", ["19:00", "19:20", "19:40", "20:00"]], ["Zavazadlo", ["Stříbrný kufr", "Černá bedna", "Červená taška", "Batoh"]]], "sol": [[0, 3, 2, 2], [1, 0, 0, 1], [2, 1, 1, 3], [3, 2, 3, 0]], "clues": ["Bob byl první a táhl něco těžkého, rozhodně ne batoh.", "Kdo nesl stříbrný kufr, přišel jako poslední.", "Na jeviště šel někdo hned po tom, kdo byl v šatně.", "Sam byl na cateringu. Kdo by se divil.", "Ten s černou bednou byl ve skladu.", "Peter nenesl batoh ani stříbrný kufr.", "Rita přišla dřív než Peter.", "Bob do šatny nešel."], "culprit": 0, "punch": "Peter v 19:40 vyměnil palivo za limonádu a odnesl prázdnou lahev v červené tašce na jeviště. Gene si všiml včas a místo ohně si dal osvěžující doušek. Catman se smál až do přídavku."}, {"n": 8, "title": "Kdo ukradl setlist?", "item": "setlist koncertu", "story": "Patnáct minut do začátku a nikdo neví, co se bude hrát. Setlist, papír s pořadím písní, je pryč. Paul navrhuje hrát „Rock and Roll All Nite“ čtrnáctkrát za sebou. Než se to stane, najdi pachatele.", "found": "Setlist se našel v krabici od pizzy.", "roles": ["manažer", "fotografka", "roadie", "řidič autobusu"], "cats": [["Kdo", ["Hank", "Linda", "Tony", "Joe"]], ["Kde", ["Šatna", "Sklad", "Autobus", "Jeviště"]], ["Kdy", ["20:00", "20:15", "20:30", "20:45"]], ["Zavazadlo", ["Stříbrný kufr", "Futrál", "Krabice od pizzy", "Batoh"]]], "sol": [[0, 0, 0, 0], [1, 3, 3, 3], [2, 1, 1, 1], [3, 2, 2, 2]], "clues": ["Hank přišel jako první, jako správný manažer. A krabici od pizzy rozhodně neměl.", "Kdo nesl futrál, byl ve skladu.", "Do autobusu přišel někdo hned po tom, kdo byl ve skladu.", "Ten s batohem byl v zákulisí poslední.", "Tony nesl futrál.", "Joe nebyl na jevišti a nenesl batoh.", "Na jeviště šel někdo jako úplně poslední."], "culprit": 3, "punch": "Joe si v 20:30 odnesl setlist v krabici od pizzy do autobusu. Na zadní straně si chtěl zapsat cestu do dalšího města. Kapela hrála podle mastných otisků prstů a byl to nejlepší koncert turné."}];

const mEsc = (v = '') => String(v).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mFmt = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
let mRoot = null, mView = {screen:'home'}, mHooked = false, mTimer = null;
const mDone = (n) => !!getStore().done[32 + n];

export function mysteryPage() { return '<div class="shell page mystery-page" id="mystery-root"></div>'; }

export function mountMystery() {
  mRoot = document.getElementById('mystery-root');
  if (!mRoot) return;
  mView = {screen:'home'};
  mRoot.addEventListener('click', mClick);
  mRoot.addEventListener('pointermove', tiltCard);
  if (!mHooked) { mHooked = true; onStore(() => { if (mRoot && mRoot.isConnected && mView.screen === 'home') mHome(); }); }
  mHome();
  connectStore();
}

function mHome() {
  const st = getStore();
  const done = mCases.filter((c) => mDone(c.n)).length;
  const next = mCases.find((c) => !mDone(c.n));
  mRoot.innerHTML = '<header class="section-head"><p class="eyebrow">Hra</p><h1>Backstage Mystery</h1>'
    + '<p class="lede">V zákulisí se pořád něco ztrácí. Přečti si případ, projdi indicie a v tabulce vylučuj možnosti, dokud nezjistíš, kdo byl kde a kdy. Případ vyřešený bez nápovědy a bez chybného tipu dává lesklou edici karty.</p></header>'
    + '<div class="g-stats"><div><b>' + done + '</b><span>z 8 karet</span></div><p class="g-sync">' + syncText() + '</p></div>'
    + (next ? '<button type="button" class="button primary" data-mcase="' + next.n + '">' + (done ? 'Další případ: ' + next.n : 'Otevřít první případ') + ' <span aria-hidden="true">→</span></button>'
            : '<p class="g-all">Všech osm případů vyřešeno. Zákulisí před tebou nemá tajemství.</p>')
    + '<h2 class="g-h2">Případy</h2><ol class="g-levels">' + mCases.map((c) => {
        const open = c.n === 1 || mDone(c.n - 1) || mDone(c.n);
        const b = st.mbest?.[c.n];
        const size = c.cats[0][1].length + ' podezřelí' + (c.cats.length > 3 ? ' · zavazadla' : '');
        return '<li><button type="button" class="g-level' + (mDone(c.n) ? ' is-done' : '') + '"' + (open ? ' data-mcase="' + c.n + '"' : ' disabled') + '>'
          + '<span class="g-ln">' + c.n + '</span><span class="g-lname">' + mEsc(c.title) + '</span>'
          + '<span class="g-lmeta">' + size + (b != null ? ' · rekord ' + mFmt(b) : '') + '</span>'
          + '<span class="g-lstate">' + (mDone(c.n) ? (st.foil[32 + c.n] ? '✦' : '✓') : open ? '▶' : '🔒') + '</span></button></li>';
      }).join('') + '</ol>'
    + '<h2 class="g-h2">Sbírka ze zákulisí</h2><div class="g-collection">' + rewards.slice(32, 40).map((r) => rewardCard(r)).join('') + '</div>'
    + '<div class="g-modal" hidden></div>';
}

/* ---------- případ ---------- */
function mPairs(k) { const out = []; for (let a = 0; a < k; a++) for (let b = a + 1; b < k; b++) out.push([a, b]); return out; }
function mTruth(c, a, i, b, j) { return c.sol.some((row) => row[a] === i && row[b] === j); }
const mKey = (a, b, i, j) => a + '-' + b + '-' + i + '-' + j;

function mStart(n) {
  const c = mCases.find((x) => x.n === n);
  mView = {screen:'play', c, marks:{}, used:{}, hints:0, mistakes:0, t0:Date.now(), over:false, wrongShown:false};
  const k = c.cats.length, short = (s) => s;
  const grids = mPairs(k).map(([a, b]) => {
    const A = c.cats[a], B = c.cats[b];
    return '<section class="mg-sub"><p class="mg-title">' + mEsc(A[0]) + ' × ' + mEsc(B[0]) + '</p><table class="mg-grid" data-a="' + a + '" data-b="' + b + '"><thead><tr><th></th>'
      + B[1].map((x) => '<th scope="col">' + mEsc(short(x)) + '</th>').join('') + '</tr></thead><tbody>'
      + A[1].map((x, i) => '<tr><th scope="row">' + mEsc(x) + (a === 0 ? '<small>' + mEsc(c.roles[i]) + '</small>' : '') + '</th>'
          + B[1].map((y, j) => '<td><button type="button" class="mg-cell" data-cell="' + mKey(a, b, i, j) + '" aria-label="' + mEsc(x + ' a ' + y) + '"></button></td>').join('') + '</tr>').join('')
      + '</tbody></table></section>';
  }).join('');
  mRoot.innerHTML = '<div class="m-play"><div class="g-bar"><button type="button" class="back g-back" data-mhome>← Případy</button>'
    + '<h1 class="g-title">Případ ' + n + ' · ' + mEsc(c.title) + '</h1><div class="g-hud"><span data-m="time"></span><span data-m="hints"></span></div></div>'
    + '<article class="m-case"><p class="m-item">Ztratilo se: <b>' + mEsc(c.item) + '</b></p><p class="m-story">' + mEsc(c.story) + '</p>'
    + '<p class="m-found">' + mEsc(c.found) + ' Zjisti, kdo byl kde a kdy, a pachatel se ukáže sám.</p></article>'
    + '<h2 class="g-h2">Indicie <small>ťuknutím si indicii odškrtneš</small></h2><ol class="m-clues">' + c.clues.map((t, i) => '<li><button type="button" data-clue="' + i + '">' + mEsc(t) + '</button></li>').join('') + '</ol>'
    + '<h2 class="g-h2">Tabulka <small>1× ťuknutí ✕ vyloučit · 2× ● potvrdit · 3× vymazat</small></h2>'
    + '<div class="m-grids k' + k + '">' + grids + '</div>'
    + '<p class="m-msg" data-m="msg" role="status"></p>'
    + '<div class="sd-tools"><button type="button" class="button secondary" data-mhint>Nápověda</button><button type="button" class="button secondary" data-mreset>Vymazat tabulku</button></div></div>'
    + '<div class="g-modal" hidden></div>';
  mRoot.scrollIntoView({block:'start'});
  mRender();
  clearInterval(mTimer); mTimer = setInterval(mTick, 1000); mTick();
}

function mTick() {
  if (!mRoot || !mRoot.isConnected || mView.screen !== 'play') { clearInterval(mTimer); return; }
  if (mView.over) return;
  const e = mRoot.querySelector('[data-m="time"]'); if (e) e.textContent = 'Čas: ' + mFmt(Math.floor((Date.now() - mView.t0) / 1000));
}

function mRender() {
  const v = mView, c = v.c, n = c.cats[0][1].length;
  mRoot.querySelectorAll('.mg-cell').forEach((el) => {
    const [a, b, i, j] = el.dataset.cell.split('-').map(Number);
    const m = v.marks[el.dataset.cell] || 0;
    let auto = false;
    if (!m) for (let x = 0; x < n; x++) { if (x !== j && v.marks[mKey(a, b, i, x)] === 2) auto = true; if (x !== i && v.marks[mKey(a, b, x, j)] === 2) auto = true; }
    el.className = 'mg-cell' + (m === 2 ? ' dot' : m === 1 ? ' no' : auto ? ' auto' : '');
    el.textContent = m === 2 ? '●' : (m === 1 || auto) ? '✕' : '';
  });
  mRoot.querySelectorAll('[data-clue]').forEach((el) => el.classList.toggle('used', !!v.used[el.dataset.clue]));
  const h = mRoot.querySelector('[data-m="hints"]'); if (h) h.textContent = 'Nápovědy: ' + v.hints;
}

function mMsg(t, cls) { const e = mRoot.querySelector('[data-m="msg"]'); if (e) { e.textContent = t; e.className = 'm-msg' + (cls ? ' ' + cls : ''); } }

function mCheck() {
  const v = mView, c = v.c, k = c.cats.length, n = c.cats[0][1].length;
  let complete = true, correct = true;
  for (let b = 1; b < k; b++) {
    const seen = new Set();
    for (let i = 0; i < n; i++) {
      const dots = [];
      for (let j = 0; j < n; j++) if (v.marks[mKey(0, b, i, j)] === 2) dots.push(j);
      if (dots.length !== 1 || seen.has(dots[0])) { complete = false; break; }
      seen.add(dots[0]);
      if (!mTruth(c, 0, i, b, dots[0])) correct = false;
    }
    if (!complete) break;
  }
  if (!complete) { v.wrongShown = false; return; }
  if (correct) { mWin(); return; }
  if (!v.wrongShown) { v.wrongShown = true; v.mistakes++; mMsg('Tabulka je vyplněná, ale něco nesedí. Projdi indicie znovu, některé ● jsou špatně.', 'bad'); }
}

function mTap(key) {
  const v = mView; if (v.over) return;
  const cur = v.marks[key] || 0;
  const nx = (cur + 1) % 3;
  if (nx) v.marks[key] = nx; else delete v.marks[key];
  mMsg('');
  mRender();
  mCheck();
}

function mHint() {
  const v = mView, c = v.c, k = c.cats.length, n = c.cats[0][1].length;
  if (v.over) return;
  for (const [a, b] of mPairs(k)) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const key = mKey(a, b, i, j), m = v.marks[key], t = mTruth(c, a, i, b, j);
    if ((m === 2 && !t) || (m === 1 && t)) {
      v.hints++; delete v.marks[key]; mRender();
      const el = mRoot.querySelector('[data-cell="' + key + '"]'); el?.classList.add('hint-bad'); el?.scrollIntoView({block:'center', behavior:'smooth'});
      mMsg('Tady máš chybu: ' + c.cats[a][1][i] + ' a ' + c.cats[b][1][j] + (t ? ' k sobě patří.' : ' k sobě nepatří.'), 'bad');
      return;
    }
  }
  for (let b = 1; b < k; b++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const key = mKey(0, b, i, j);
    if (mTruth(c, 0, i, b, j) && v.marks[key] !== 2) {
      v.hints++; v.marks[key] = 2; mRender();
      const el = mRoot.querySelector('[data-cell="' + key + '"]'); el?.classList.add('hint-ok'); el?.scrollIntoView({block:'center', behavior:'smooth'});
      mMsg('Nápověda: ' + c.cats[0][1][i] + ' → ' + c.cats[b][1][j] + '.', 'ok');
      mCheck();
      return;
    }
  }
}

function mWin() {
  const v = mView, c = v.c, n = c.n; v.over = true; clearInterval(mTimer);
  const secs = Math.round((Date.now() - v.t0) / 1000), st = getStore();
  const first = !st.done[32 + n];
  const clean = v.hints === 0 && v.mistakes === 0;
  const newFoil = clean && !st.foil[32 + n];
  st.done[32 + n] = true;
  if (clean) st.foil[32 + n] = true;
  st.mbest = st.mbest || {};
  const rec = st.mbest[n] == null || secs < st.mbest[n];
  if (rec) st.mbest[n] = secs;
  saveStore();
  mRoot.querySelector('.m-grids')?.classList.add('solved');
  const row = c.sol.find((r) => r[0] === c.culprit);
  const next = mCases.find((x) => x.n === n + 1);
  setTimeout(() => {
    const m = mRoot.querySelector('.g-modal');
    m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><p class="eyebrow">Případ ' + n + ' vyřešen · ' + mFmt(secs) + (rec ? ' · rekord' : '') + '</p>'
      + '<h2>Pachatel: ' + mEsc(c.cats[0][1][c.culprit]) + '</h2>'
      + '<p class="m-verdict">' + mEsc(c.cats[1][1][row[1]]) + ' · ' + mEsc(c.cats[2][1][row[2]]) + (row[3] != null ? ' · ' + mEsc(c.cats[3][1][row[3]]) : '') + '</p>'
      + '<p class="m-punch">' + mEsc(c.punch) + '</p>'
      + '<div class="g-reveal' + (first || newFoil ? ' fresh' : '') + '">' + rewardCard(rewards[32 + n - 1]) + '</div>'
      + (newFoil ? '<p class="g-note ok">Bez nápovědy a bez chyby: karta je v lesklé edici.</p>' : !st.foil[32 + n] ? '<p class="g-note">Vyřeš případ bez nápovědy a bez chybného tipu a získáš lesklou edici.</p>' : '')
      + '<div class="g-actions">' + (next ? '<button type="button" class="button primary" data-mcase="' + next.n + '">Další případ ' + next.n + ' →</button>' : '')
      + '<button type="button" class="button secondary" data-mhome>Případy a sbírka</button></div></div>';
    m.hidden = false; m.querySelector('button')?.focus({preventScroll:true});
  }, 900);
}

function mClick(e) {
  const b = e.target.closest('button');
  if (!b || !mRoot.contains(b)) return;
  if (b.dataset.mcase) { mStart(+b.dataset.mcase); return; }
  if (b.hasAttribute('data-mhome')) { clearInterval(mTimer); mView = {screen:'home'}; mHome(); mRoot.scrollIntoView({block:'start'}); return; }
  if (b.dataset.cell) { mTap(b.dataset.cell); return; }
  if (b.dataset.clue !== undefined) { mView.used[b.dataset.clue] = !mView.used[b.dataset.clue]; mRender(); return; }
  if (b.hasAttribute('data-mhint')) { mHint(); return; }
  if (b.hasAttribute('data-mreset')) {
    if (b.dataset.confirm) { mView.marks = {}; delete b.dataset.confirm; b.textContent = 'Vymazat tabulku'; mMsg(''); mRender(); }
    else { b.dataset.confirm = '1'; b.textContent = 'Opravdu vymazat?'; }
    return;
  }
  if (b.dataset.zoom && !b.closest('.g-modal')) {
    const m = mRoot.querySelector('.g-modal');
    m.innerHTML = '<div class="g-dialog" role="dialog" aria-modal="true"><div class="g-zoom">' + rewardCard(rewards[+b.dataset.zoom - 1]) + '</div><div class="g-actions"><button type="button" class="button secondary" data-mclose>Zavřít</button></div></div>';
    m.hidden = false; return;
  }
  if (b.hasAttribute('data-mclose')) { const m = mRoot.querySelector('.g-modal'); m.hidden = true; m.innerHTML = ''; }
}
