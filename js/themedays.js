// ============================================================
// themedays.js — Temadagar (icke-röda, inofficiella & officiella teman)
// ============================================================

import { easterSunday, addDays, mmdd, nthWeekdayOfMonth, lastWeekdayOfMonth, ymd } from "./utils.js";

// Fasta temadagar — månadsdag (MM-DD)
export const FIXED_THEMES = {
  "01-13": [{ name: "Tjugondag Knut", desc: "Då dansas julen ut." }],
  "01-29": [{ name: "Pusselns dag" }],
  "02-04": [{ name: "Världscancerdagen" }],
  "02-09": [{ name: "Pizzans dag" }],
  "02-11": [{ name: "Internationella dagen för flickor och kvinnor i vetenskap" }],
  "02-14": [{ name: "Alla hjärtans dag", desc: "Importerad amerikansk tradition från 1990-talet." }],
  "02-20": [{ name: "Världsdagen för social rättvisa" }],
  "03-04": [{ name: "Kanelbullens dag (även 4 okt)" }],
  "03-08": [{ name: "Internationella kvinnodagen" }],
  "03-14": [{ name: "Pi-dagen", desc: "3/14 ≈ π." }],
  "03-20": [{ name: "Internationella lyckodagen" }],
  "03-21": [{ name: "Internationella dagen mot rasism" }],
  "03-22": [{ name: "Världsvattendagen" }],
  "04-01": [{ name: "April april", desc: "Skämtarnas högtid sedan 1500-talet." }],
  "04-07": [{ name: "Världshälsodagen" }],
  "04-22": [{ name: "Earth Day — internationella moder jord-dagen" }],
  "04-23": [{ name: "Världsbokdagen" }],
  "05-01": [{ name: "Arbetarrörelsens dag" }],
  "05-08": [{ name: "Röda korsets dag" }],
  "05-09": [{ name: "Europadagen" }],
  "05-12": [{ name: "Sjuksköterskornas dag" }],
  "05-15": [{ name: "Internationella familjens dag" }],
  "05-17": [{ name: "Internationella dagen mot homo-, bi- och transfobi" }],
  "05-29": [{ name: "Världsdagen mot tobak" }],
  "05-31": [{ name: "Världsdagen mot tobak (WHO)" }],
  "06-04": [{ name: "Tårtans dag" }],
  "06-05": [{ name: "Världsmiljödagen" }],
  "06-08": [{ name: "Världshavsdagen" }],
  "06-23": [{ name: "FN:s dag för offentligt anställda" }],
  "07-07": [{ name: "Chokladens dag" }],
  "07-30": [{ name: "Internationella vänskapsdagen" }],
  "08-04": [{ name: "Surströmmingspremiären", desc: "Tredje torsdagen i augusti enligt traditionen." }],
  "08-09": [{ name: "Bokens dag" }],
  "08-19": [{ name: "Världsfotodagen" }],
  "09-08": [{ name: "Internationella läskunnighetsdagen" }],
  "09-21": [{ name: "Internationella fredsdagen" }],
  "09-27": [{ name: "Världsturismdagen" }],
  "09-29": [{ name: "Kaffets dag" }],
  "10-01": [{ name: "Internationella äldredagen" }],
  "10-04": [{ name: "Kanelbullens dag", desc: "Instiftad av Kaeth Gardestedt 1999 för Hembakningsrådet." }],
  "10-05": [{ name: "Lärarnas dag" }],
  "10-10": [{ name: "Världsdagen för psykisk hälsa" }],
  "10-16": [{ name: "Världshungerdagen" }],
  "10-24": [{ name: "FN-dagen" }],
  "11-06": [{ name: "Gustav Adolfsdagen", desc: "Gustav II Adolf stupade vid Lützen 1632. Bakelsen 'Gustav Adolfsbakelse' äts." }],
  "11-11": [{ name: "Mårtensafton", desc: "Skånsk tradition med gås, svartsoppa och äppelkaka." }],
  "11-13": [{ name: "Vänlighetens dag" }],
  "11-19": [{ name: "Internationella herrdagen" }],
  "11-20": [{ name: "Internationella barndagen" }],
  "11-25": [{ name: "Internationella dagen mot mäns våld mot kvinnor" }],
  "12-01": [{ name: "Världsaidsdagen" }],
  "12-03": [{ name: "Internationella funktionshindrades dag" }],
  "12-04": [{ name: "Barbara-dagen", desc: "På denna dag sätts en kvist från fruktträd i vatten — den ska blomma till jul." }],
  "12-10": [{ name: "Mänskliga rättigheternas dag" }],
  "12-13": [{ name: "Luciadagen", desc: "Sedan medeltiden årets längsta natt enligt gamla kalendern." }],
  "12-23": [{ name: "Lillejulafton" }]
};

// Beräknade temadagar (varierar med år)
export function calculatedThemes(year) {
  const map = {};

  // Mors dag — sista söndagen i maj
  const morsDag = lastWeekdayOfMonth(year, 4, 6);
  map[ymd(morsDag)] = (map[ymd(morsDag)] || []).concat([{
    name: "Mors dag",
    desc: "Sista söndagen i maj. Cellofan, blommor, frukost på sängen."
  }]);

  // Fars dag — andra söndagen i november
  const farsDag = nthWeekdayOfMonth(year, 10, 6, 2);
  map[ymd(farsDag)] = (map[ymd(farsDag)] || []).concat([{
    name: "Fars dag",
    desc: "Andra söndagen i november — svensk variant, instiftad 1931."
  }]);

  // Mor- och farsdagens svenska tradition
  // Fettisdagen — 47 dagar före påsk (tisdagen)
  const easter = easterSunday(year);
  const fettisdagen = addDays(easter, -47);
  map[ymd(fettisdagen)] = (map[ymd(fettisdagen)] || []).concat([{
    name: "Fettisdagen",
    desc: "Dagen för semlan. Tisdagen efter fastlagssöndagen, 47 dagar före påsk."
  }]);

  const fastlagssondagen = addDays(easter, -49);
  map[ymd(fastlagssondagen)] = (map[ymd(fastlagssondagen)] || []).concat([{
    name: "Fastlagssöndagen"
  }]);

  // Valborgsmässoafton 30 april
  map[`${year}-04-30`] = (map[`${year}-04-30`] || []).concat([{
    name: "Valborgsmässoafton",
    desc: "Vårens ankomst firas med eldar och körsång."
  }]);

  // Surströmmingspremiär — tredje torsdagen i augusti
  const ssp = nthWeekdayOfMonth(year, 7, 3, 3);
  map[ymd(ssp)] = (map[ymd(ssp)] || []).concat([{
    name: "Surströmmingspremiär",
    desc: "Tredje torsdagen i augusti, enligt en gammal förordning från 1700-talet."
  }]);

  // Astronomisk vår/sommar/höst/vinter (ungefär)
  map[`${year}-03-20`] = (map[`${year}-03-20`] || []).concat([{ name: "Vårdagjämning" }]);
  map[`${year}-06-21`] = (map[`${year}-06-21`] || []).concat([{ name: "Sommarsolstånd" }]);
  map[`${year}-09-23`] = (map[`${year}-09-23`] || []).concat([{ name: "Höstdagjämning" }]);
  map[`${year}-12-21`] = (map[`${year}-12-21`] || []).concat([{ name: "Vintersolstånd" }]);

  // Klockomställning
  // Sista söndagen i mars — sommartid börjar
  const dstStart = lastWeekdayOfMonth(year, 2, 6);
  map[ymd(dstStart)] = (map[ymd(dstStart)] || []).concat([{
    name: "Sommartid börjar",
    desc: "Klockan ställs fram en timme klockan 02:00 → 03:00."
  }]);

  // Sista söndagen i oktober — vintertid (normaltid) återgår
  const dstEnd = lastWeekdayOfMonth(year, 9, 6);
  map[ymd(dstEnd)] = (map[ymd(dstEnd)] || []).concat([{
    name: "Sommartid slutar",
    desc: "Klockan ställs tillbaka en timme klockan 03:00 → 02:00."
  }]);

  return map;
}

export function themesForDate(date) {
  const themes = [];
  const fixed = FIXED_THEMES[mmdd(date)];
  if (fixed) themes.push(...fixed);
  const calc = calculatedThemes(date.getFullYear())[ymd(date)];
  if (calc) themes.push(...calc);
  return themes;
}
