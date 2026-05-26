// ============================================================
// bondepraktikan.js — gamla svenska väderspomar
// Från Bondepraktikan och andra svenska almanack-traditioner
// ============================================================

// Kopplade till specifika datum/namnsdagar
export const BONDE_FIXED = {
  "01-13": "Tjugondag Knut — Är det vinter på Knut, blir det vår på Henrik (19/1).",
  "01-19": "Henriksmäss — Solens första riktiga rop till våren. Är det milt på Henrik, blir det kallt på Mattias.",
  "01-25": "Pålsmässa — 'Pål med skägg ger vår i kvägg.' Klart väder ger god skörd, dimma ger pest.",
  "02-02": "Kyndelsmässodagen — 'Är vädret på Kyndelsmäss vackert och klart, så blir det en lång och hård vinter snart.'",
  "02-22": "Pia — Far Pia om natten, vi få bättre väder än vi vänta.",
  "02-24": "Mattiasdagen — 'Sankt Mattias kastar het sten i sjön' — isen börjar smälta.",
  "03-12": "Gregorius — 'Gregorius gick på isen, Knut gick av' — isen släpper.",
  "03-21": "Vårdagjämning — Lika lång dag och natt. 'Solen vänder, vintern ändar.'",
  "03-25": "Marie bebådelsedag (Vårfrudagen) — 'Vårfrudagens väder visar sommaren.'",
  "04-14": "Tiburtius — 'Tiburtius öppnar marken, gladlynt blickar bonden över åkern.' Trana kommer.",
  "04-23": "Sankt Göran — Är det soligt på Göran kommer en bra skörd. Regnar det, blir hösten våt.",
  "05-01": "Valborgsmäss — 'Regn på Valborg ger torr sommar.'",
  "05-15": "Sofia — 'Sofia kommer med våta fötter' — försenad regnperiod väntar.",
  "05-25": "Urban — 'Urban med solen, en god skörd ur jorden.'",
  "06-08": "Medardus (jämför med svensk variant) — 'Regnar det på Medardus, regnar det fyrtio dagar till.'",
  "06-13": "Aina — Höskörden börjar enligt gammal sed om vädret är torrt.",
  "06-24": "Midsommardagens regn — 'Midsommarregn ger råg och brödbrist.'",
  "07-13": "Joel — 'Regnar det på Joel, regnar det till skörden.'",
  "07-20": "Margareta — 'Margaretas regn är ärtbönders fasa.'",
  "07-25": "Jakob — Jakobsdagen visar hösten. 'Klart på Jakob, full lada hos bonde.'",
  "08-10": "Lars — 'Larsmäss med åska — pellejönsen far.'",
  "08-24": "Bartolomeus — 'Slår Bartolomei skägg in i jorden, slår vintern hårt.'",
  "09-21": "Matteus — 'Är Matteus klar, så blir hösten lugn och underbar.'",
  "09-29": "Mikaelsmäss — 'Mikaeli med torr fot, julafton med vita kläder.'",
  "10-18": "Lukas — 'Är det varmt på Lukas, blir december kall.'",
  "10-28": "Simon — 'Simons skägg är vinterns brudgum.'",
  "11-01": "Allhelgona — 'Allhelgonas väder råder fram till jul.'",
  "11-11": "Mårten — 'Mårtens vind blåser hela vintern.'",
  "11-25": "Katarina — 'Katarina med snö, julen blir blöt.'",
  "12-04": "Barbara — Barbarakvistarna sätts i vatten — blommar de till jul blir det god vår.",
  "12-13": "Lucia — 'Lucia natten lång, december dagen kort.'",
  "12-21": "Tomas — 'Tomas drar dagen ur säcken' — solståndet, dagarna ljusnar.",
  "12-25": "Juldagen — 'Vit jul ger grön påsk.'"
};

// Allmänna säsongs-spomar (när inget specifikt finns på datumet)
const GENERAL = {
  jan: [
    "Januari sol gör bonden glad — men januarisnö värmer kornet i jorden.",
    "Varm januari, kall april.",
    "'Frusen januari, fyllda spannmålsbodar' — Bondepraktikan."
  ],
  feb: [
    "Februaridimma ger sommarregn.",
    "Är det blött i februari, blir det torrt i juni.",
    "Februarisol och marskyla skadar mer än vad de gagnar."
  ],
  mar: [
    "Mars som ett lamm — april som ett lejon.",
    "Marstorka gör bonden ledsen.",
    "Hörs vårens första lärka i mars blir det god säd."
  ],
  apr: [
    "April gör som han vill — och bonden får finna sig.",
    "April-regn ger maj-blommor.",
    "Åska i april skrämmer bara den okunnige."
  ],
  may: [
    "Kall maj ger fyllda lador.",
    "Majregn på rötter värd guld.",
    "'Den som glömmer maj — får aldrig juni.'"
  ],
  jun: [
    "Junisol gör hö av gräs.",
    "Junimåne i full storlek — sätt på krattan.",
    "Blir det åska på midsommar, är man försiktig med sjön."
  ],
  jul: [
    "Julitorka skördar hela hagen.",
    "Är juli våt och kall, blir hösten varm.",
    "'Krusbär på Maria Magdalena — höstens första bär.'"
  ],
  aug: [
    "Augusti-dimma — fyllda fat på höskullen.",
    "Är augusti het, blir vintern oviss.",
    "'Lars i lågan, hösten i tågan.'"
  ],
  sep: [
    "September-måne gyllene — torr höst.",
    "Är september varm, blir oktober dyster.",
    "'Mikaelsmoln visar vintern.'"
  ],
  okt: [
    "Oktobergrönt ger lång vinter.",
    "Är det surt i oktober, blir det skarpt i januari.",
    "'Allhelgonatöväder — påsktorka.'"
  ],
  nov: [
    "Novemberdimma — julgranen torr.",
    "Snö i november stannar till mars.",
    "'Mårtensvind är hela vinterns gud.'"
  ],
  dec: [
    "Decembersol i Sverige — sällsynt välsignelse.",
    "Är december mild, blir mars hård.",
    "'Tomas i mörker, Stefan i ljus.'"
  ]
};

const MONTH_KEYS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","okt","nov","dec"];

export function bondeForDate(date) {
  const key = `${String(date.getMonth() + 1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
  if (BONDE_FIXED[key]) return { text: BONDE_FIXED[key], specific: true };
  const monthArr = GENERAL[MONTH_KEYS[date.getMonth()]];
  if (!monthArr) return null;
  const dayIdx = date.getDate() % monthArr.length;
  return { text: monthArr[dayIdx], specific: false };
}
