// ============================================================
// holidays.js — Svenska helgdagar (röda dagar) + flaggdagar
// ============================================================

import { easterSunday, addDays, ymd, pad, nthWeekdayOfMonth } from "./utils.js";

// Returnerar map: "YYYY-MM-DD" -> { name, type: "red"|"observed", flagDay?: true }
export function holidaysForYear(year) {
  const map = {};
  const add = (date, name, type = "red", flagDay = false) => {
    map[ymd(date)] = { name, type, flagDay };
  };

  // Fasta helgdagar
  add(new Date(year, 0, 1),  "Nyårsdagen", "red", true);
  add(new Date(year, 0, 6),  "Trettondedag jul");
  add(new Date(year, 4, 1),  "Första maj", "red", true);
  add(new Date(year, 5, 6),  "Sveriges nationaldag", "red", true);
  add(new Date(year, 11, 24), "Julafton", "red");
  add(new Date(year, 11, 25), "Juldagen", "red", true);
  add(new Date(year, 11, 26), "Annandag jul", "red");
  add(new Date(year, 11, 31), "Nyårsafton");

  // Påsk
  const easter = easterSunday(year);
  add(addDays(easter, -3),  "Skärtorsdagen", "observed");
  add(addDays(easter, -2),  "Långfredagen", "red");
  add(addDays(easter, -1),  "Påskafton", "observed");
  add(easter,                "Påskdagen", "red", true);
  add(addDays(easter, 1),    "Annandag påsk", "red");
  add(addDays(easter, 39),   "Kristi himmelsfärds dag", "red");
  add(addDays(easter, 49),   "Pingstdagen", "red", true);

  // Midsommar — fredag som infaller 19-25 juni; lördag 20-26 juni
  let midsummerEve = null;
  for (let d = 19; d <= 25; d++) {
    const candidate = new Date(year, 5, d);
    if (candidate.getDay() === 5) { midsummerEve = candidate; break; }
  }
  if (midsummerEve) {
    add(midsummerEve, "Midsommarafton", "red");
    add(addDays(midsummerEve, 1), "Midsommardagen", "red", true);
  }

  // Alla helgons dag — lördag mellan 31 oktober och 6 november
  for (let d = 31; d <= 36; d++) {
    const candidate = new Date(year, 9, d); // oktober + d (kan rulla över till nov)
    if (candidate.getDay() === 6) {
      add(candidate, "Alla helgons dag", "red");
      break;
    }
  }

  // Övriga flaggdagar (officiella ej röda)
  // Konungens namnsdag 28 jan
  add(new Date(year, 0, 28),  "Konungens namnsdag", "observed", true);
  // Kronprinsessans namnsdag 12 mars
  add(new Date(year, 2, 12),  "Kronprinsessans namnsdag", "observed", true);
  // Konungens födelsedag 30 april
  add(new Date(year, 3, 30),  "Konungens födelsedag", "observed", true);
  // Kronprinsessan Victorias födelsedag 14 juli
  add(new Date(year, 6, 14),  "Kronprinsessans födelsedag", "observed", true);
  // Drottningens namnsdag 8 augusti
  add(new Date(year, 7, 8),   "Drottningens namnsdag", "observed", true);
  // Den 30 nov — Gustaf Adolfsdagen / Karl XII:s dödsdag (flaggdag)
  add(new Date(year, 10, 6),  "Gustav Adolfsdagen", "observed", true);
  // Nobeldagen 10 dec
  add(new Date(year, 11, 10), "Nobeldagen", "observed", true);
  // Drottningens födelsedag 23 dec
  add(new Date(year, 11, 23), "Drottningens födelsedag", "observed", true);

  // FN-dagen 24 okt (allmän flaggning)
  add(new Date(year, 9, 24),  "FN-dagen", "observed", true);

  // Valdagar (vart 4:e år, andra söndagen i september; senaste val 2022)
  if (((year - 2022) % 4) === 0 && year >= 2022) {
    add(nthWeekdayOfMonth(year, 8, 6, 2), "Valdagen", "observed", true);
  }

  return map;
}

export function holidayInfo(date) {
  return holidaysForYear(date.getFullYear())[ymd(date)] || null;
}
