const original = 'Paul Stanley, Gene Simmons, Ace Frehley, Peter Criss';
const last = 'Paul Stanley, Gene Simmons, Tommy Thayer, Eric Singer';
const revenge = 'Paul Stanley, Gene Simmons, Bruce Kulick, Eric Singer';

function album(id, title, date, type, mediaId, context, trackText, extra = {}) {
  return {id,title,date,type,mediaId,context,tracks:trackText.split('|').filter(Boolean),...extra};
}
function studio(id,title,date,mediaId,context,tracks,extra) {
  return album(id,title,date,'studio',mediaId,context,tracks,extra);
}
function solo(id,title,mediaId,context,tracks,member) {
  return album(id,title,'1978-09-18','solo',mediaId,context,tracks,{member});
}
function live(id,title,date,mediaId,context,tracks,recorded,credits,extra) {
  return album(id,title,date,'live',mediaId,context,tracks,{recorded,credits,...extra});
}

export const albums = [
  studio('kiss','KISS','1974-02','1440823022','Syrový debut zachycuje písně, s nimiž kapela vyrostla z newyorských klubů. „Kissin’ Time“ přibylo až na dalším vydání.',
    'Strutter|Nothin’ to Lose|Firehouse|Cold Gin|Let Me Know|Deuce|Love Theme from KISS|100,000 Years|Black Diamond',{credits:original}),
  studio('hotter-than-hell','Hotter Than Hell','1974-10-22','1440831092','Druhé album zní temněji a syrověji. „Parasite“, „Watchin’ You“ a titulní skladba si našly trvalé místo na pódiu.',
    'Got to Choose|Parasite|Goin’ Blind|Hotter Than Hell|Let Me Go, Rock ’n’ Roll|All the Way|Watchin’ You|Mainline|Comin’ Home|Strange Ways',{credits:original}),
  studio('dressed-to-kill','Dressed to Kill','1975-03-19','1843771036','Třetí deska dala KISS jejich koncertní hymnu „Rock and Roll All Nite“, jejíž živá podoba později prolomila žebříčky.',
    'Room Service|Two Timer|Ladies in Waiting|Getaway|Rock Bottom|C’mon and Love Me|Anything for My Baby|She|Love Her All I Can|Rock and Roll All Nite',{credits:original}),
  live('alive','Alive!','1975-09-10','1853653621','Průlomové koncertní dvojalbum završilo první tři roky. Jeho nejznámějším singlem se stala živá verze „Rock and Roll All Nite“.',
    'Deuce|Strutter|Got to Choose|Hotter Than Hell|Firehouse|Nothin’ to Lose|C’mon and Love Me|Parasite|She|Watchin’ You|100,000 Years|Black Diamond|Rock Bottom|Cold Gin|Rock and Roll All Nite|Let Me Go, Rock ’n’ Roll','1975 · Detroit, Cleveland, Davenport a Wildwood; následné studiové úpravy',original),
  studio('destroyer','Destroyer','1976-03-15','1596798921','Bob Ezrin přinesl orchestr, sbor i zvukové scény. Vedle „Detroit Rock City“ a „God of Thunder“ se prosadila balada „Beth“.',
    'Detroit Rock City|King of the Night Time World|God of Thunder|Great Expectations|Flaming Youth|Sweet Pain|Shout It Out Loud|Beth|Do You Love Me',{credits:original,edition:'Původní LP končí skrytou zvukovou stopou, na pozdějších vydáních označovanou jako „Rock and Roll Party“.'}),
  studio('rock-and-roll-over','Rock and Roll Over','1976-11-11','6823406252','Přímější nahrávka s producentem Eddiem Kramerem. Kapela ji natáčela v divadle Star v Nanuetu.',
    'I Want You|Take Me|Calling Dr. Love|Ladies Room|Baby Driver|Love ’Em and Leave ’Em|Mr. Speed|See You in Your Dreams|Hard Luck Woman|Makin’ Love',{credits:original}),
  studio('love-gun','Love Gun','1977-06-17','1443210977','Titulní skladba se stala koncertní stálicí. V „Shock Me“ zpívá Ace Frehley poprvé hlavní vokál na albu KISS.',
    'I Stole Your Love|Christine Sixteen|Got Love for Sale|Shock Me|Tomorrow and Tonight|Love Gun|Hooligan|Almost Human|Plaster Caster|Then She Kissed Me',{credits:original}),
  live('alive-ii','Alive II','1977-10-24','1440856259','Koncertní materiál z vrcholného období sedmdesátých let doplňuje pět nových studiových skladeb na čtvrté straně.',
    'Detroit Rock City|King of the Night Time World|Ladies Room|Makin’ Love|Love Gun|Calling Dr. Love|Christine Sixteen|Shock Me|Hard Luck Woman|Tomorrow and Tonight|I Stole Your Love|Beth|God of Thunder|I Want You|Shout It Out Loud|All American Man|Rockin’ in the U.S.A.|Larger Than Life|Rocket Ride|Any Way You Want It','1977 · zejména The Forum v Inglewoodu; součástí alba jsou i studiové nahrávky',original,{edition:'Na několika studiových skladbách čtvrté strany hraje na kytaru Bob Kulick.'}),
  solo('paul-solo','Paul Stanley','1442856785','Melodický hard rock s velkými refrény. „Hold Me, Touch Me“ vybíhá směrem k popové baladě.',
    'Tonight You Belong to Me|Move On|Ain’t Quite Right|Wouldn’t You Like to Know Me?|Take Me Away (Together as One)|It’s Alright|Hold Me, Touch Me (Think of Me When We’re Apart)|Love in Chains|Goodbye','paul-stanley'),
  solo('gene-solo','Gene Simmons','1444099360','Gene střídá těžké riffy, melodický pop a orchestr. Uzavírá ji jeho verze „When You Wish Upon a Star“.',
    'Radioactive|Burning Up with Fever|See You Tonite|Tunnel of Love|True Confessions|Living in Sin|Always Near You / Nowhere to Hide|Man of 1,000 Faces|Mr. Make Believe|See You in Your Dreams|When You Wish Upon a Star','gene-simmons'),
  solo('ace-solo','Ace Frehley','1440854859','Kytarová deska nahraná s producentem Eddiem Kramerem. „New York Groove“ přinesl Aceovi výrazný sólový singl.',
    'Rip It Out|Speedin’ Back to My Baby|Snow Blind|Ozone|What’s on Your Mind?|New York Groove|I’m in Need of Love|Wiped-Out|Fractured Mirror','ace-frehley'),
  solo('peter-solo','Peter Criss','1442998954','Peter si na své sólovce udělal prostor pro soul, rhythm & blues a balady.',
    'I’m Gonna Love You|You Matter to Me|Tossin’ and Turnin’|Don’t You Let Me Down|That’s the Kind of Sugar Papa Likes|Easy Thing|Rock Me, Baby|Kiss the Girl Goodbye|Hooked on Rock ’n’ Roll|I Can’t Stop the Rain','peter-criss'),
  studio('dynasty','Dynasty','1979-05-23','1440861209','Největší mezinárodní hit desky staví na tanečním rytmu. Původní čtveřice je na obalu, ve studiu se obsazení měnilo.',
    'I Was Made for Lovin’ You|2,000 Man|Sure Know Something|Dirty Livin’|Charisma|Magic Touch|Hard Times|X-Ray Eyes|Save Your Love',{credits:'Paul Stanley, Gene Simmons a Ace Frehley. Bicí převážně Anton Fig, Peter Criss hraje na „Dirty Livin’“.'}),
  studio('unmasked','Unmasked','1980-05-20','1440819081','Melodičtější deska s komiksovým obalem. Přes název kapela v době vydání stále vystupovala s make-upem.',
    'Is That You?|Shandi|Talk to Me|Naked City|What Makes the World Go ’Round|Tomorrow|Two Sides of the Coin|She’s So European|Easy as It Seems|Torpedo Girl|You’re All That I Want',{credits:'Paul Stanley, Gene Simmons, Ace Frehley a bubeník Anton Fig. Peter Criss je na obalu.'}),
  studio('the-elder','Music from “The Elder”','1981-11-16','1442891537','Koncepční nahrávka s Bobem Ezrinem byla odbočkou k příběhovému a orchestrálnímu rocku. První studiové album s Ericem Carrem.',
    'The Oath|Fanfare|Just a Boy|Dark Light|Only You|Under the Rose|A World Without Heroes|Mr. Blackwell|Escape from the Island|Odyssey|I',{edition:'Pořadí amerického prvního vydání. Pozdější vydání skladby řadí jinak.'}),
  studio('creatures-of-the-night','Creatures of the Night','1982-10-13','1657014242','Tvrdý kytarový zvuk a výrazné bicí Erica Carra. „I Love It Loud“ i titulní skladba kapelu vrátily k těžšímu repertoáru.',
    'Creatures of the Night|Saint and Sinner|Keep Me Comin’|Rock and Roll Hell|Danger|I Love It Loud|I Still Love You|Killer|War Machine',{credits:'Paul Stanley, Gene Simmons a Eric Carr s hostujícími kytaristy včetně Vinnieho Vincenta. Ace Frehley je na původním obalu.'}),
  studio('lick-it-up','Lick It Up','1983-09-18','1440823733','První deska éry bez masek. Titulní skladba se stala koncertní stálicí.',
    'Exciter|Not for the Innocent|Lick It Up|Young and Wasted|Gimme More|All Hell’s Breakin’ Loose|A Million to One|Fits Like a Glove|Dance All Over Your Face|And on the 8th Day',{credits:'Paul Stanley, Gene Simmons, Eric Carr a Vinnie Vincent. Rick Derringer hostuje v „Exciter“.'}),
  studio('animalize','Animalize','1984-09-13','1442844700','„Heaven’s on Fire“ přinesla výrazný hit éry MTV. Hlavním sólovým kytaristou ve studiu byl Mark St. John.',
    'I’ve Had Enough (Into the Fire)|Heaven’s on Fire|Burn Bitch Burn|Get All You Can Take|Lonely Is the Hunter|Under the Gun|Thrills in the Night|While the City Sleeps|Murder in High-Heels',{credits:'Paul Stanley, Gene Simmons, Eric Carr a Mark St. John. Na desce hostuje i Bruce Kulick.'}),
  studio('asylum','Asylum','1985-09-16','1443275056','První celé studiové album s Brucem Kulickem coby členem. „Tears Are Falling“ patří k nejvýraznějším singlům desky.',
    'King of the Mountain|Any Way You Slice It|Who Wants to Be Lonely|Trial by Fire|I’m Alive|Love’s a Deadly Weapon|Tears Are Falling|Secretly Cruel|Radar for Love|Uh! All Night'),
  studio('crazy-nights','Crazy Nights','1987-09-18','1440819307','Producent Ron Nevison dal desce výrazný lesk osmdesátých let. Titulní skladba uspěla zejména v Británii.',
    'Crazy Crazy Nights|I’ll Fight Hell to Hold You|Bang Bang You|No, No, No|Hell or High Water|My Way|When Your Walls Come Down|Reason to Live|Good Girl Gone Bad|Turn On the Night|Thief in the Night'),
  studio('hot-in-the-shade','Hot in the Shade','1989-10-17','1442951646','Patnáct skladeb s rozmanitou produkcí. Baladu „Forever“ napsali Paul Stanley a Michael Bolton.',
    'Rise to It|Betrayed|Hide Your Heart|Prisoner of Love|Read My Body|Love’s a Slap in the Face|Forever|Silver Spoon|Cadillac Dreams|King of Hearts|The Street Giveth and the Street Taketh Away|You Love Me to Hate You|Somewhere Between Heaven and Hell|Little Caesar|Boomerang'),
  studio('revenge','Revenge','1992-05-19','1440852086','Návrat Boba Ezrina, ostřejší kytary a nástup Erica Singera. Závěrečné „Carr Jam 1981“ připomíná Erica Carra.',
    'Unholy|Take It Off|Tough Love|Spit|God Gave Rock ’n’ Roll to You II|Domino|Heart of Chrome|Thou Shalt Not|Every Time I Look at You|Paralyzed|I Just Wanna|Carr Jam 1981',{credits:revenge,edition:'Na „God Gave Rock ’n’ Roll to You II“ se Eric Carr podílel doprovodným zpěvem.'}),
  live('alive-iii','Alive III','1993-05-18','1443182230','Živý obraz kapely bez make-upu. Koncertní repertoár propojuje staré skladby s novinkami z Revenge.',
    'Creatures of the Night|Deuce|I Just Wanna|Unholy|Heaven’s on Fire|Watchin’ You|Domino|I Was Made for Lovin’ You|I Still Love You|Rock and Roll All Nite|Lick It Up|Forever|I Love It Loud|Detroit Rock City|God Gave Rock ’n’ Roll to You II|Star Spangled Banner','1992 · Cleveland, Detroit a Indianapolis',revenge,{edition:'Základní americké CD. „Take It Off“ přidávají některá zahraniční vydání a americký vinyl.'}),
  live('kiss-unplugged','KISS Unplugged','1996-03-12','1440821690','Akustický set pro MTV a veřejný předstupeň reunionu. Ace a Peter přicházejí až v závěru koncertu.',
    'Comin’ Home|Plaster Caster|Goin’ Blind|Do You Love Me|Domino|Sure Know Something|A World Without Heroes|Rock Bottom|See You Tonite|I Still Love You|Every Time I Look at You|2,000 Man|Beth|Nothin’ to Lose|Rock and Roll All Nite','9. 8. 1995 · Sony Music Studios, New York',revenge + '; Ace Frehley a Peter Criss v závěru.'),
  studio('carnival-of-souls','Carnival of Souls: The Final Sessions','1997-10-28','1444022672','Temnější, těžší nahrávka vznikla před reunionem, vydání ji následovalo až v roce 1997.',
    'Hate|Rain|Master & Slave|Childhood’s End|I Will Be There|Jungle|In My Head|It Never Goes Away|Seduction of the Innocent|I Confess|In the Mirror|I Walk Alone',{credits:revenge}),
  studio('psycho-circus','Psycho Circus','1998-09-22','1443712321','Studiové album návratového období, na jehož obalu se znovu potkávají všechny čtyři původní masky.',
    'Psycho Circus|Within|I Pledge Allegiance to the State of Rock & Roll|Into the Void|We Are One|You Wanted the Best|Raise Your Glasses|I Finally Found My Way|Dreamin’|Journey of 1,000 Years',{credits:'Původní členové na obalu. Na nahrávce hrají také Tommy Thayer, Kevin Valentine a další hosté.'}),
  live('alive-iv','KISS Symphony: Alive IV','2003-07-22','1440531876','Kapela střídá čistě rockový set, komornější část a rozsáhlý závěr s melbournským orchestrem.',
    'Deuce|Strutter|Let Me Go, Rock ’n’ Roll|Lick It Up|Calling Dr. Love|Psycho Circus|Beth|Forever|Goin’ Blind|Sure Know Something|Shandi|Detroit Rock City|King of the Night Time World|Do You Love Me|Shout It Out Loud|God of Thunder|Love Gun|Black Diamond|Great Expectations|I Was Made for Lovin’ You|Rock and Roll All Nite','28. 2. 2003 · Telstra Dome, Melbourne','Paul Stanley, Gene Simmons, Tommy Thayer, Peter Criss a Melbourne Symphony Orchestra'),
  live('millennium','Alive! The Millennium Concert','2006-11-21','1443786315','Silvestrovský koncert původní sestavy se dočkal vydání v boxu Alive! 1975–2000. Později získal také samostatný digitální záznam.',
    'Psycho Circus|Shout It Out Loud|Deuce|Heaven’s on Fire|Into the Void|Firehouse|Do You Love Me|Let Me Go, Rock ’n’ Roll|I Love It Loud|Lick It Up|100,000 Years|Love Gun|Black Diamond|Beth|Rock and Roll All Nite','31. 12. 1999 · BC Place, Vancouver',original,{edition:'Základní disk boxu z roku 2006. Digitální a obchodní varianty přidávají bonusové skladby.'}),
  studio('sonic-boom','Sonic Boom','2009-10-06','1665332452','První studiové album poslední sestavy. „Modern Day Delilah“ míří k přímočarému kytarovému zvuku.',
    'Modern Day Delilah|Russian Roulette|Never Enough|Yes I Know (Nobody’s Perfect)|Stand|Hot and Cold|All for the Glory|Danger Us|I’m an Animal|When Lightning Strikes|Say Yeah',{credits:last}),
  studio('monster','Monster','2012-10-09','1444044015','Poslední nové studiové album kapely. Na skladbách se podíleli všichni čtyři tehdejší členové jako interpreti.',
    'Hell or Hallelujah|Wall of Sound|Freak|Back to the Stone Age|Shout Mercy|Long Way Down|Eat Your Heart Out|The Devil Is Me|Outta This World|All for the Love of Rock & Roll|Take Me Down Below|Last Chance',{credits:last}),
].sort((a,b) => a.date.localeCompare(b.date));

export const types = [
  ['all','Všechna alba'], ['studio','Studiová'], ['live','Živá'], ['solo','Sólo 1978']
];

export const musicPaths = {
  "1440531876": "/us/album/symphony-alive-iv-live/1440531876",
  "1440819081": "/us/album/unmasked/1440819081",
  "1440819307": "/us/album/crazy-nights/1440819307",
  "1440823022": "/us/album/kiss/1440823022",
  "1440823733": "/us/album/lick-it-up/1440823733",
  "1440831092": "/us/album/hotter-than-hell/1440831092",
  "1440852086": "/us/album/revenge/1440852086",
  "1440854859": "/us/album/kiss-ace-frehley/1440854859",
  "1440856259": "/us/album/alive-ii/1440856259",
  "1440861209": "/us/album/dynasty/1440861209",
  "1442844700": "/us/album/animalize/1442844700",
  "1442856785": "/us/album/kiss-paul-stanley/1442856785",
  "1442891537": "/us/album/music-from-the-elder/1442891537",
  "1442951646": "/us/album/hot-in-the-shade/1442951646",
  "1442998954": "/us/album/kiss-peter-criss/1442998954",
  "1443182230": "/us/album/alive-iii/1443182230",
  "1443210977": "/us/album/love-gun-deluxe-edition/1443210977",
  "1443275056": "/us/album/asylum/1443275056",
  "1443712321": "/us/album/psycho-circus/1443712321",
  "1443786315": "/us/album/alive-the-millennium-concert/1443786315",
  "1444022672": "/us/album/carnival-of-souls-the-final-sessions/1444022672",
  "1440821690": "/us/album/mtv-unplugged-live/1440821690",
  "1444044015": "/us/album/monster-bonus-track-version/1444044015",
  "1444099360": "/us/album/kiss-gene-simmons/1444099360",
  "1596798921": "/us/album/destroyer-45th-anniversary-remastered/1596798921",
  "1657014242": "/us/album/creatures-of-the-night/1657014242",
  "1665332452": "/us/album/sonic-boom/1665332452",
  "1843771036": "/us/album/dressed-to-kill-2025-remaster/1843771036",
  "1853653621": "/us/album/alive-live-1975-2025-remaster/1853653621",
  "6823406252": "/us/album/rock-and-roll-over-2026-remaster/6823406252"
};

// Obaly dodané Martinem Havlíčkem (zdroj: kissonline.com/music), 800 × 800 px, složka covers.
export const covers = {
  'kiss':'assets/covers/kiss.jpg',
  'hotter-than-hell':'assets/covers/hotter-than-hell.jpg',
  'dressed-to-kill':'assets/covers/dressed-to-kill.jpg',
  'alive':'assets/covers/alive.jpg',
  'destroyer':'assets/covers/destroyer.jpg',
  'rock-and-roll-over':'assets/covers/rock-and-roll-over.jpg',
  'love-gun':'assets/covers/love-gun.jpg',
  'alive-ii':'assets/covers/alive-ii.jpg',
  'paul-solo':'assets/covers/paul-solo.jpg',
  'gene-solo':'assets/covers/gene-solo.jpg',
  'ace-solo':'assets/covers/ace-solo.jpg',
  'peter-solo':'assets/covers/peter-solo.jpg',
  'dynasty':'assets/covers/dynasty.jpg',
  'unmasked':'assets/covers/unmasked.jpg',
  'the-elder':'assets/covers/the-elder.jpg',
  'creatures-of-the-night':'assets/covers/creatures-of-the-night.jpg',
  'lick-it-up':'assets/covers/lick-it-up.jpg',
  'animalize':'assets/covers/animalize.jpg',
  'asylum':'assets/covers/asylum.jpg',
  'crazy-nights':'assets/covers/crazy-nights.jpg',
  'hot-in-the-shade':'assets/covers/hot-in-the-shade.jpg',
  'revenge':'assets/covers/revenge.jpg',
  'alive-iii':'assets/covers/alive-iii.jpg',
  'kiss-unplugged':'assets/covers/kiss-unplugged.jpg',
  'carnival-of-souls':'assets/covers/carnival-of-souls.jpg',
  'psycho-circus':'assets/covers/psycho-circus.jpg',
  'alive-iv':'assets/covers/alive-iv.jpg',
  'millennium':'assets/covers/millennium.jpg',
  'sonic-boom':'assets/covers/sonic-boom.jpg',
  'monster':'assets/covers/monster.jpg',
};
