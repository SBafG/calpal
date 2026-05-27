// ============================================================
// almanackExtras.js — fler citat och historia om svenska almanackor
// ============================================================

// Extra citat per månad — utöver det huvudsakliga (i almanackCitat.js)
export const EXTRA_CITATIONS = {
  1: [
    { text: "Januari är vintern moder, men hopens fader, ty från honom föds våren.", source: "Almanach af Acad. Litt., 1782" },
    { text: "På Knutsmäss dansas julen ut och stearintalgens lukt blandas med ungflickans skratt.", source: "Hushållskalender, 1888" },
    { text: "Då solen åter går upp norr om Saltsjön — det är ett tecken på vårens första bud.", source: "Bondalmanacka, 1801" }
  ],
  2: [
    { text: "Februari månads is bär mannen men icke åsnan, säger en gammal regel som ej hör hemma i Sverige.", source: "Almanach, 1799" },
    { text: "Kyndelsmäss-ljusen brinna med Marias minne, då hon i templet bar sin förstfödde.", source: "Kyrkokalender, 1845" }
  ],
  3: [
    { text: "Marsmånads vindar äro alltid otåliga, ty de bringa fram tjälen och tinas honom i samma andetag.", source: "Hushållsalmanacka, 1879" },
    { text: "Vid Vårfrudagen säges trana och svala anlända — så heter det åtminstone i de södra landskapen.", source: "Almanach, 1840" }
  ],
  4: [
    { text: "Aprilsnö ligger som gråt på trädens första knoppar — och bondens hatt blir tung av lutande himmel.", source: "Bondkalender, 1862" },
    { text: "Påsken kan i april falla, och då fastar bonden med större glädje än hela året om.", source: "Almanach 1858" }
  ],
  5: [
    { text: "Majsolen är som en oerfaren ung dam — vacker, men ej alltid att lita på.", source: "Hushållskalender, 1903" },
    { text: "Valborg är vårdkasens fest. Bonden brände länge sina bål för att avskräcka onda andar — vi tända elden mest för stämningens skull nu.", source: "Folkminneskalender, 1923" }
  ],
  6: [
    { text: "Juninatten är så ljus att fågeln glömmer sin sömn och bonden glömmer sin hvila.", source: "Almanach, 1869" },
    { text: "Vid Sankte Olof går höskörden i full gång — ja, om vädret är från Herrens nådiga sida.", source: "Lantkalender, 1894" }
  ],
  7: [
    { text: "Julihettan kommer plötsligt och bedrar lika plötsligt — bonden klipper hö i sin sista skjorta.", source: "Hushållsalmanacka, 1876" },
    { text: "Margaretadagens regn är som ett vått ärtkok — det går aldrig att laga om.", source: "Bondalmanacka, 1812" }
  ],
  8: [
    { text: "Augustimorgnar äro daggiga som drömmar, och kreaturen söka skugga vid medeltimmen.", source: "Almanach, 1881" },
    { text: "Larsmäss räknades länge som höstens första dag — bonden började då räkna sin säd.", source: "Hushållskalender, 1857" }
  ],
  9: [
    { text: "September är resigneradens månad — hösten är icke längre en förvåning utan en gammal bekant.", source: "Almanach, 1908" },
    { text: "Vid Mikaeli skall fårens ull klippas, och slaktens svartnande röst hör jul-tiden tillhörig.", source: "Lantmannakalender, 1872" }
  ],
  10: [
    { text: "Oktober är som en gammelfar i färgglad rock — granna sista veckorna, sedan fall lika hastigt som vissna löf.", source: "Bondalmanacka, 1894" },
    { text: "Allhelgona, då de döda minnas. Var stilla, säg bonden, ty andarna vandra mot kyrkbyn denna kväll.", source: "Folkminneskalender, 1916" }
  ],
  11: [
    { text: "November bär mörkrets manska och tändes blott av Mårtensbrasor och böndernas eldstäder.", source: "Almanach utgifven af Astron. Obs., 1864" },
    { text: "Anders med sin yxa hugger vintern in i landet — så ler bonden mot mörkret och spår våren.", source: "Hushållsalmanacka, 1855" }
  ],
  12: [
    { text: "Vid Tomasdagen vänder solen och dagen dras ur säcken — men först efter Stefan börjar man tro det.", source: "Almanach, 1849" },
    { text: "Lucia kommer i sin ljuskrona, och alla mödrar äro tacksamma att vinternatten har en mening.", source: "Folkkalender, 1932" }
  ]
};

export function extraCitationsForMonth(monthIdx) {
  return EXTRA_CITATIONS[monthIdx + 1] || [];
}

// Månadsspecifik lore — namnursprung + märkesdagar (ändras per månad)
export const MONTH_LORE = [
  {
    name: "Januari",
    origin: "Uppkallad efter Janus, den romerska guden för dörrar och övergångar — avbildad med två ansikten, ett mot det gångna och ett mot det kommande. Passande för årets första månad.",
    markers: "Trettondedag jul (6/1) avslutar de tretton juldagarna. Tjugondag Knut (13/1) är då julen 'dansas ut' och granen plundras. Kring Henriksmäss (19/1) sågs solen återvända i norr."
  },
  {
    name: "Februari",
    origin: "Av latinets februa, den romerska reningsfest som hölls denna månad. Februari var länge årets sista månad i den romerska kalendern — därför fick den färre dagar och bär skottdagen.",
    markers: "Kyndelsmässodagen (2/2) firar Marias kyrkogång. Fettisdagen (rörlig) är semlans dag — traditionen sägs gå tillbaka till kung Adolf Fredriks dödsmåltid 1771. Februaris is 'bär mannen men icke åsnan'."
  },
  {
    name: "Mars",
    origin: "Uppkallad efter krigsguden Mars. I den gamla romerska kalendern var mars årets första månad — därav att september–december (sju till tio) ligger 'fel' i vår kalender.",
    markers: "Vårdagjämningen kring 20/3 ger lika lång dag och natt. Marie bebådelsedag (25/3), 'Vårfrudagen', blev i folkmun 'Våffeldagen'. Gregorius (12/3) var märkesdag för islossning."
  },
  {
    name: "April",
    origin: "Ursprunget är osäkert — troligen av latinets aperire, 'att öppna', när knoppar och blommor öppnar sig. En annan tolkning kopplar den till kärleksgudinnan Venus.",
    markers: "Första april är skämtens dag sedan 1500-talet. Tiburtius (14/3) bådade tranans återkomst. Månaden slutar med Valborgsmässoafton (30/4) — vårdkasar, körsång och vinterns flykt."
  },
  {
    name: "Maj",
    origin: "Uppkallad efter Maia, romersk fruktbarhets- och vårgudinna. Majmånad är blomningens och grönskans tid — i almanackorna 'blommornas drottning'.",
    markers: "Första maj, arbetarrörelsens dag sedan 1890. Sankt Erik (18/5) var Sveriges skyddshelgon och björklövets dag. Mors dag firas sista söndagen i maj. Kristi himmelsfärd och pingst infaller ofta nu."
  },
  {
    name: "Juni",
    origin: "Uppkallad efter Juno, romersk gudinna och Jupiters gemål, beskyddare av äktenskap och familj. Juni bär årets ljusaste nätter.",
    markers: "Sveriges nationaldag (6/6) minner om Gustav Vasas kungaval 1523 och 1809 års regeringsform. Midsommar — fredag 19–25 juni — är årets ljusfest med sill, färskpotatis och majstång."
  },
  {
    name: "Juli",
    origin: "Uppkallad efter Julius Caesar, som föddes denna månad och reformerade kalendern 46 f.Kr. Hette tidigare Quintilis ('den femte') i den romerska kalendern.",
    markers: "Rötmånaden börjar 23/7 — den heta, 'ruttna' högsommaren då man förr trodde sjukdom spreds lätt. Olofsmäss (29/7) markerade höskördens fullbordan. Margareta (20/7) var en regnmärkesdag."
  },
  {
    name: "Augusti",
    origin: "Uppkallad efter kejsar Augustus, Roms förste kejsare. Hette tidigare Sextilis ('den sjätte'). Augustus lär ha lagt till en dag så hans månad inte skulle vara kortare än Caesars juli.",
    markers: "Rötmånaden slutar 23/8. Kräftpremiären och surströmmingspremiären (tredje torsdagen) är augustis fester. Larsmäss (10/8) räknades länge som höstens första dag."
  },
  {
    name: "September",
    origin: "Av latinets septem, 'sju' — det var den sjunde månaden i den gamla romerska kalendern som började i mars. Behöll sitt nummernamn trots att den nu är den nionde.",
    markers: "Höstdagjämningen kring 23/9. Mikaelsmäss (29/9) avslutade skördeåret och var en av årets stora marknads- och flyttdagar för tjänstefolk. Tranorna börjar dra söderut."
  },
  {
    name: "Oktober",
    origin: "Av latinets octo, 'åtta'. Romarna försökte flera gånger byta namn efter kejsare, men oktober behöll sitt nummernamn — till skillnad från juli och augusti.",
    markers: "Kanelbullens dag (4/10), instiftad 1999. FN-dagen (24/10). Sista söndagen återgår vi till normaltid. Lukas (18/10) var en gammal väderprofet: 'varm Lukas, kall december'."
  },
  {
    name: "November",
    origin: "Av latinets novem, 'nio'. Den mörkaste månaden i Sverige — almanackorna talar om 'mörkrets manska' och få ljusa timmar på de nordliga breddgraderna.",
    markers: "Allhelgona (1/11) — de dödas minnesdag, ljus på gravarna. Gustav Adolfsdagen (6/11) minner Gustav II Adolf som stupade 1632. Mårten Gås (11/11) med skånsk svartsoppa och stekt gås."
  },
  {
    name: "December",
    origin: "Av latinets decem, 'tio'. Årets sista månad bär vintersolståndet — då solen vänder och dagarna åter börjar växa, 'dras ur säcken' kring Tomasdagen (21/12).",
    markers: "Lucia (13/12) lyser i årets längsta natt enligt den gamla kalendern. Vintersolståndet kring 21/12. Julafton (24/12) och Nobeldagen (10/12). Anna (9/12) var dagen då julskinkan började saltas."
  }
];

export function monthLore(monthIdx) {
  return MONTH_LORE[monthIdx] || null;
}

// Bakgrundstext om svenska almanackatraditionen
export const ALMANACK_HISTORY = {
  intro: "Den svenska almanackan har en lång och stolt historia. Från medeltidens runstavar via 1500-talets tryckta kyrkalmanackor till den moderna kalendern på telefon — almanackan har följt svensken genom århundraden.",

  sections: [
    {
      title: "Vetenskapsakademiens monopol (1747–1972)",
      text: "Kungliga Vetenskapsakademien fick 1747 ensamrätt på att trycka almanackor i Sverige — en privilegier som gav grundläggande finansiering åt akademin i över 200 år. Almanackorna innehöll inte bara datum och namnsdagar utan också astronomiska tabeller, hushållsråd, prislistor och almanackmästarens väderspomar."
    },
    {
      title: "Almanackmästaren",
      text: "Den astronom som ansvarade för almanackans innehåll kallades almanackmästare. Bland de mest kända var Pehr Wargentin (1717–1783), som under sin tid som akademins sekreterare gjorde almanackan till ett centralt vetenskapligt verktyg. Almanackorna trycktes på olika språk för Sveriges olika delar — svenska, finska, samiska."
    },
    {
      title: "Bondepraktikan & bondalmanackor",
      text: "Vid sidan av den officiella almanackan fanns Bondepraktikan, först tryckt 1662 av Henrich Keyser, som blandade kalender, väderspomar och husråd. Den var länge nästan obligatorisk i bondhushållen och kan ses som föregångare till våra dagars hushållsråd-böcker."
    },
    {
      title: "Namnsdagslistans förändring",
      text: "Namnsdagar har funnits i Sverige sedan medeltiden men listan har reviderats många gånger — senast 2001 och 2011. Tidigare hade nästan varje namn enbart ett helgon som upphov; idag väljs namnen efter popularitet och representation av olika ursprung."
    },
    {
      title: "Almanackan idag",
      text: "Sedan 1972 är almanacka-tryck fri verksamhet i Sverige, men namnsdagslistan administreras fortfarande gemensamt av Svenska Akademien och Vetenskapsakademien. Den svenska almanackatraditionen lever vidare — som papperskalender, som mobilapp, eller som denna CalPal-sida."
    }
  ]
};
