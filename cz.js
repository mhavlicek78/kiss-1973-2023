/* ===== KISS v Česku: všechny koncerty 1996–2023 ===== */

const czEsc = (v = '') => String(v).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const czOrig = 'Stanley · Simmons · Frehley · Criss';
const czLate = 'Stanley · Simmons · Thayer · Singer';
const czMonths = ['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'];

export const czConcerts = [
  {date:'1996-12-14', date2:'1996-12-15', city:'Praha', venue:'Sportovní hala, Výstaviště', tour:'Alive/Worldwide Tour', lineup:czOrig, orig:true, support:'The Verve Pipe',
   text:'Úplně první koncerty KISS v Česku, hned dva večery po sobě. Původní čtveřice v maskách přivezla reunion turné, které se v roce 1996 stalo nejvýdělečnějším turné roku. Vstupenka v předprodeji stála 599 Kč.',
   media:[{src:'assets/cz/1996-plakat.jpg', cap:'Plakát Interkoncerts: „v původní sestavě, původní image“', kind:'Plakát'}]},
  {date:'1997-06-07', city:'Praha', venue:'Fotbalový stadion Juliska', tour:'Alive/Worldwide Tour', lineup:czOrig, orig:true, support:'Waltari, Satisfucktion',
   text:'Původní sestava se do Prahy vrátila už po půl roce, tentokrát pod širým nebem. Na vstupence stálo „Once Just Wasn’t Enough“ (jednou to nestačilo) a místo na stání vyšlo v předprodeji na 450 + 50 Kč.',
   media:[{src:'assets/cz/1997-vstupenka.jpg', cap:'Vstupenka na stání, 7. 6. 1997 od 19 h', kind:'Vstupenka'}]},
  {date:'1999-03-18', city:'Praha', venue:'Sportovní hala, Výstaviště', tour:'Psycho Circus Tour', lineup:czOrig, orig:true,
   text:'Třetí návštěva původní sestavy, tentokrát s turné k albu Psycho Circus. Show doprovázela trojrozměrná videoprojekce, v Česku vůbec poprvé, takže se koukalo přes 3D brýle. Vstupenka v předprodeji stála 750 Kč.',
   media:[{src:'assets/cz/1999-vstupenka.jpg', cap:'Vstupenka „Psycho-Circus in 3D“, 18. 3. 1999 ve 20 h', kind:'Vstupenka'}]},
  {date:'2008-06-06', city:'Praha', venue:'Sazka Arena (dnes O2 arena)', tour:'Alive 35 World Tour', lineup:czLate,
   text:'Oslava 35 let kapely, poprvé v Česku s Tommym Thayerem a Ericem Singerem. Hrálo se pro zhruba 15 000 diváků a každý koncert turné se natáčel a vycházel jako limitovaná edice na CD.'},
  {date:'2010-05-21', city:'Ostrava', venue:'ČEZ Aréna', tour:'Sonic Boom Over Europe Tour', lineup:czLate,
   text:'Jediný koncert KISS v Ostravě, vyprodaný. Po skončení nad pódiem ještě dlouho svítil nápis KISS LOVES YOU OSTRAVA.'},
  {date:'2010-05-23', city:'Praha', venue:'O2 arena', tour:'Sonic Boom Over Europe Tour', lineup:czLate,
   text:'O dva dny později vyprodaná O2 arena. Turné k albu Sonic Boom, prvnímu studiovému albu kapely po jedenácti letech.'},
  {date:'2013-06-14', city:'Praha', venue:'O2 arena', tour:'Monster World Tour', lineup:czLate,
   text:'Turné k albu Monster. Nad pódiem se vznášel obří světélkující pavouk s ohňostroji.'},
  {date:'2015-06-08', city:'Praha', venue:'O2 arena', tour:'40th Anniversary World Tour', lineup:czLate, support:'The Dead Daisies',
   text:'Oslava 40 let kapely, s plnou arénou a pyrotechnikou.'},
  {date:'2017-05-20', city:'Brno', venue:'Výstaviště BVV', tour:'Kissworld Tour', lineup:czLate,
   text:'Jediný koncert KISS v Brně. Turné tehdy Prahu vynechalo a kapela se na něm vrátila ke kostýmům z éry Creatures of the Night.'},
  {date:'2019-06-19', city:'Praha', venue:'Eden Aréna (stadion Slavie)', tour:'End of the Road World Tour', lineup:czLate, support:'ZZ Top, BSP',
   text:'Rozlučkové turné pod širým nebem v rámci přehlídky Prague Rocks. Před KISS hráli ZZ Top a čeští BSP.',
   media:[{src:'assets/cz/2019-meet-greet.jpg', cap:'Meet & Greet s kapelou před koncertem', kind:'Fotka'},{src:'assets/cz/2019-plakat.jpg', cap:'Plakát Prague Rocks 2019', kind:'Plakát'}]},
  {date:'2022-07-13', city:'Praha', venue:'O2 arena', tour:'End of the Road World Tour', lineup:czLate, support:'The Last Internationale',
   text:'Koncert byl kvůli covidu dvakrát odložen, z 1. 7. 2020 a 10. 7. 2021. Přišlo asi 15 000 lidí a na konci nad scénou zazářil nápis KISS LOVES YOU PRAHA v národních barvách.',
   media:[{src:'assets/cz/2022-plakat.jpg', cap:'Plakát koncertu 13. 7. 2022', kind:'Plakát'}]},
  {date:'2023-06-10', city:'Praha', venue:'O2 arena', tour:'End of the Road World Tour', lineup:czLate, support:'Dirty Honey', last:true,
   text:'Poslední koncert KISS v Česku. Praha zahajovala evropskou část rozlučkového turné. O necelého půl roku později kapela skončila v Madison Square Garden.',
   media:[{src:'assets/cz/2023-zacatek.jpg', cap:'Začátek show: zářící logo a laserová světla', kind:'Fotka'},
          {src:'assets/cz/2023-paul-video.mp4', poster:'assets/cz/2023-paul-video.jpg', cap:'Paul Stanley na velkoplošné obrazovce', kind:'Video'},
          {src:'assets/cz/2023-gene-video.mp4', poster:'assets/cz/2023-gene-video.jpg', cap:'Démon v plamenech', kind:'Video'},
          {src:'assets/cz/2023-paul.jpg', cap:'Paul na obrazovce nad publikem', kind:'Fotka'},
          {src:'assets/cz/2023-ohnostroj-video.mp4', poster:'assets/cz/2023-ohnostroj-video.jpg', cap:'Finále s pyrotechnikou', kind:'Video'},
          {src:'assets/cz/2023-loves-prague.jpg', cap:'KISS LOVES YOU PRAGUE v barvách české vlajky', kind:'Fotka'},
          {src:'assets/cz/2023-plakat.jpg', cap:'Plakát koncertu 10. 6. 2023', kind:'Plakát'}]}
];

const czFmt = (iso, iso2) => {
  const [y, m, d] = iso.split('-').map(Number);
  if (iso2) { const d2 = +iso2.split('-')[2]; return d + '. a ' + d2 + '. ' + czMonths[m - 1] + ' ' + y; }
  return d + '. ' + czMonths[m - 1] + ' ' + y;
};

export function czPage() {
  const shows = czConcerts.reduce((n, c) => n + (c.date2 ? 2 : 1), 0);
  const cities = [...new Set(czConcerts.map((c) => c.city))];
  const seen = czConcerts.filter((c) => c.city !== 'Ostrava').reduce((n, c) => n + (c.date2 ? 2 : 1), 0);
  const count = (city) => czConcerts.filter((c) => c.city === city).reduce((n, c) => n + (c.date2 ? 2 : 1), 0);
  return '<div class="shell page cz-page">'
    + '<header class="section-head"><p class="eyebrow">KISS v Česku</p><h1>Koncerty v Česku</h1>'
    + '<p class="lede">Od prvního reunion koncertu na pražském Výstavišti v prosinci 1996 až po rozlučku v O2 areně v červnu 2023. Všechny koncerty KISS v Česku na jednom místě.</p></header>'
    + '<div class="cz-stats"><div><b>' + shows + '</b><span>koncertů</span></div><div><b>' + cities.length + '</b><span>města</span></div><div><b>27</b><span>let</span></div><div class="cz-seen"><b>' + seen + '</b><span>jsem viděl</span></div></div>'
    + '<p class="cz-cities">' + cities.map((c) => '<span>' + czEsc(c) + ' <b>' + count(c) + '×</b></span>').join('') + '</p>'
    + '<ol class="cz-list">' + czConcerts.map((c, i) => {
        const [y, m, d] = c.date.split('-').map(Number);
        const was = c.city !== 'Ostrava';
        return '<li class="cz-ticket' + (was ? ' was-there' : '') + (c.orig ? ' is-orig' : '') + (c.city !== 'Praha' ? ' is-away' : '') + (c.last ? ' is-last' : '') + '">'
          + '<div class="cz-stub"><span class="cz-day">' + d + (c.date2 ? '.–' + +c.date2.split('-')[2] : '') + '.</span><span class="cz-mon">' + czMonths[m - 1] + '</span><span class="cz-year">' + y + '</span></div>'
          + (was ? '<span class="cz-stamp" aria-label="Byl jsem tam">Byl jsem<br>tam</span>' : '')
          + '<div class="cz-body"><p class="cz-city">' + czEsc(c.city) + (c.last ? ' <em>poslední koncert v Česku</em>' : '') + '</p>'
          + '<h2>' + czEsc(c.venue) + '</h2>'
          + '<p class="cz-tour">' + czEsc(c.tour) + '</p>'
          + '<p class="cz-text">' + czEsc(c.text) + '</p>'
          + '<dl class="cz-facts"><div><dt>Datum</dt><dd>' + czFmt(c.date, c.date2) + '</dd></div><div><dt>Sestava</dt><dd>' + czEsc(c.lineup) + (c.orig ? ' <small>původní čtveřice</small>' : '') + '</dd></div>'
          + (c.support ? '<div><dt>' + (c.support.includes(',') ? 'Předskokani' : 'Předskokan') + '</dt><dd>' + czEsc(c.support) + '</dd></div>' : '') + '</dl>'
          + (c.media ? '<div class="cz-gallery">' + c.media.map((m, k) => '<button type="button" class="cz-thumb' + (m.poster ? ' is-video' : '') + '" data-cz="' + i + '-' + k + '" aria-label="' + czEsc(m.kind + ': ' + m.cap) + '">'
              + '<img src="' + (m.poster || m.src) + '" alt="" loading="lazy"><span>' + czEsc(m.kind) + '</span></button>').join('') + '</div>' : '')
          + '</div></li>';
      }).join('') + '</ol>'
    + '<div class="cz-lightbox" hidden role="dialog" aria-modal="true" aria-label="Galerie"></div>'
    + '<p class="cz-note">Prameny: ČT24, Deník, Novinky.cz, E15, Echo24, Expats.cz a archivy turné. Vstupenky, plakáty, fotky a videa jsou z Martinova archivu.</p>'
    + '</div>';
}

/* galerie: velký náhled, šipky, přejetí prstem, Esc */
let czLb = null, czCur = null, czX0 = null;
function czOpen(ci, mi) {
  const c = czConcerts[ci], m = c.media[mi];
  czCur = [ci, mi];
  const media = m.poster
    ? '<video src="' + m.src + '" poster="' + m.poster + '" autoplay loop muted playsinline></video>'
    : '<img src="' + m.src + '" alt="' + czEsc(m.cap) + '">';
  czLb.innerHTML = '<div class="cz-lb-inner"><button type="button" class="cz-lb-close" data-czclose aria-label="Zavřít">✕</button>'
    + '<figure>' + media + '<figcaption><b>' + czEsc(c.city) + ' · ' + czFmt(c.date, c.date2) + '</b>' + czEsc(m.cap) + '</figcaption></figure>'
    + (c.media.length > 1 ? '<button type="button" class="cz-lb-nav prev" data-czstep="-1" aria-label="Předchozí">‹</button><button type="button" class="cz-lb-nav next" data-czstep="1" aria-label="Další">›</button><p class="cz-lb-count">' + (mi + 1) + ' / ' + c.media.length + '</p>' : '')
    + '</div>';
  czLb.hidden = false;
  document.documentElement.classList.add('cz-lock');
}
function czClose() { if (!czLb) return; czLb.hidden = true; czLb.innerHTML = ''; czCur = null; document.documentElement.classList.remove('cz-lock'); }
function czStep(d) { if (!czCur) return; const n = czConcerts[czCur[0]].media.length; czOpen(czCur[0], (czCur[1] + d + n) % n); }
export function czMount() {
  const root = document.querySelector('.cz-page'); if (!root) return;
  document.querySelectorAll('body > .cz-lightbox').forEach((el) => el.remove());
  czLb = root.querySelector('.cz-lightbox');
  document.body.appendChild(czLb);
  czLb.addEventListener('click', (e) => {
    const st = e.target.closest('[data-czstep]'); if (st) { czStep(+st.dataset.czstep); return; }
    if (e.target.closest('[data-czclose]') || e.target === czLb || e.target.classList.contains('cz-lb-inner')) czClose();
  });
  root.addEventListener('click', (e) => {
    const t = e.target.closest('[data-cz]');
    if (t) { const [ci, mi] = t.dataset.cz.split('-').map(Number); czOpen(ci, mi); return; }
    const st = e.target.closest('[data-czstep]'); if (st) { czStep(+st.dataset.czstep); return; }
    if (e.target.closest('[data-czclose]') || e.target === czLb || e.target.classList.contains('cz-lb-inner')) czClose();
  });
  czLb.addEventListener('pointerdown', (e) => { czX0 = e.clientX; });
  czLb.addEventListener('pointerup', (e) => { if (czX0 != null && Math.abs(e.clientX - czX0) > 50) czStep(e.clientX < czX0 ? 1 : -1); czX0 = null; });
}
if (typeof document !== 'undefined') document.addEventListener('keydown', (e) => {
  if (!czCur) return;
  if (e.key === 'Escape') czClose(); else if (e.key === 'ArrowRight') czStep(1); else if (e.key === 'ArrowLeft') czStep(-1);
});
window.addEventListener?.('hashchange', czClose);
