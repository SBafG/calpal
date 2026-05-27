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
