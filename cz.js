/* ===== KISS v Česku: všechny koncerty 1996–2023 ===== */

const czEsc = (v = '') => String(v).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const czOrig = 'Stanley · Simmons · Frehley · Criss';
const czLate = 'Stanley · Simmons · Thayer · Singer';
const czMonths = ['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'];

export const czConcerts = [
  {date:'1996-12-14', date2:'1996-12-15', city:'Praha', venue:'Sportovní hala, Výstaviště', tour:'Alive/Worldwide Tour', lineup:czOrig, orig:true, support:'The Verve Pipe',
   text:'Úplně první koncerty KISS v Česku, hned dva večery po sobě. Původní čtveřice v maskách přivezla reunion turné, které se v roce 1996 stalo nejvýdělečnějším turné roku.'},
  {date:'1999-03-18', city:'Praha', venue:'Sportovní hala, Výstaviště', tour:'Psycho Circus Tour', lineup:czOrig, orig:true,
   text:'Druhá návštěva původní sestavy, tentokrát s turné k albu Psycho Circus.'},
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
   text:'Rozlučkové turné pod širým nebem v rámci přehlídky Prague Rocks. Před KISS hráli ZZ Top a čeští BSP.'},
  {date:'2022-07-13', city:'Praha', venue:'O2 arena', tour:'End of the Road World Tour', lineup:czLate,
   text:'Koncert byl kvůli covidu dvakrát odložen, z 1. 7. 2020 a 10. 7. 2021. Přišlo asi 15 000 lidí a na konci nad scénou zazářil nápis KISS LOVES YOU PRAHA v národních barvách.'},
  {date:'2023-06-10', city:'Praha', venue:'O2 arena', tour:'End of the Road World Tour', lineup:czLate, support:'Dirty Honey', last:true,
   text:'Poslední koncert KISS v Česku. Praha zahajovala evropskou část rozlučkového turné. O necelého půl roku později kapela skončila v Madison Square Garden.'}
];

const czFmt = (iso, iso2) => {
  const [y, m, d] = iso.split('-').map(Number);
  if (iso2) { const d2 = +iso2.split('-')[2]; return d + '. a ' + d2 + '. ' + czMonths[m - 1] + ' ' + y; }
  return d + '. ' + czMonths[m - 1] + ' ' + y;
};

export function czPage() {
  const shows = czConcerts.reduce((n, c) => n + (c.date2 ? 2 : 1), 0);
  const cities = [...new Set(czConcerts.map((c) => c.city))];
  const count = (city) => czConcerts.filter((c) => c.city === city).reduce((n, c) => n + (c.date2 ? 2 : 1), 0);
  return '<div class="shell page cz-page">'
    + '<header class="section-head"><p class="eyebrow">KISS v Česku</p><h1>Koncerty v Česku</h1>'
    + '<p class="lede">Od prvního reunion koncertu na pražském Výstavišti v prosinci 1996 až po rozlučku v O2 areně v červnu 2023. Všechny koncerty KISS v Česku na jednom místě.</p></header>'
    + '<div class="cz-stats"><div><b>' + shows + '</b><span>koncertů</span></div><div><b>' + cities.length + '</b><span>města</span></div><div><b>27</b><span>let</span></div></div>'
    + '<p class="cz-cities">' + cities.map((c) => '<span>' + czEsc(c) + ' <b>' + count(c) + '×</b></span>').join('') + '</p>'
    + '<ol class="cz-list">' + czConcerts.map((c) => {
        const [y, m, d] = c.date.split('-').map(Number);
        return '<li class="cz-ticket' + (c.orig ? ' is-orig' : '') + (c.city !== 'Praha' ? ' is-away' : '') + (c.last ? ' is-last' : '') + '">'
          + '<div class="cz-stub"><span class="cz-day">' + d + (c.date2 ? '.–' + +c.date2.split('-')[2] : '') + '.</span><span class="cz-mon">' + czMonths[m - 1] + '</span><span class="cz-year">' + y + '</span></div>'
          + '<div class="cz-body"><p class="cz-city">' + czEsc(c.city) + (c.last ? ' <em>poslední koncert v Česku</em>' : '') + '</p>'
          + '<h2>' + czEsc(c.venue) + '</h2>'
          + '<p class="cz-tour">' + czEsc(c.tour) + '</p>'
          + '<p class="cz-text">' + czEsc(c.text) + '</p>'
          + '<dl class="cz-facts"><div><dt>Datum</dt><dd>' + czFmt(c.date, c.date2) + '</dd></div><div><dt>Sestava</dt><dd>' + czEsc(c.lineup) + (c.orig ? ' <small>původní čtveřice</small>' : '') + '</dd></div>'
          + (c.support ? '<div><dt>Předskokan</dt><dd>' + czEsc(c.support) + '</dd></div>' : '') + '</dl></div></li>';
      }).join('') + '</ol>'
    + '<p class="cz-note">Prameny: ČT24, Deník, Novinky.cz, E15, Echo24, Expats.cz a archivy turné. Fotky z koncertů sem rád doplním, pokud máš vlastní.</p>'
    + '</div>';
}
