// ============================================================
// squeezeDays.js — Klämdags-radar
// Identifierar arbetsdagar som ligger mellan helgdagar/helger
// och föreslår semesterstrategier.
// ============================================================

import { holidaysForYear } from "./holidays.js";
import { addDays, ymd, mondayIndex, MONTHS_SV } from "./utils.js";

// En vardag är "klämdag" om den ligger mellan två lediga (helgdag/helg)
export function squeezeDaysForYear(year) {
  const holidays = holidaysForYear(year);
  const result = [];

  const isOff = (date) => {
    const wd = mondayIndex(date);
    if (wd >= 5) return true; // lö/sö
    const h = holidays[ymd(date)];
    return h && h.type === "red";
  };

  let d = new Date(year, 0, 1);
  while (d.getFullYear() === year) {
    const wd = mondayIndex(d);
    const isWorkday = wd <= 4;
    const hh = holidays[ymd(d)];
    const isRed = hh && hh.type === "red";

    if (isWorkday && !isRed) {
      const before = addDays(d, -1);
      const after = addDays(d, 1);
      if (isOff(before) && isOff(after)) {
        result.push({
          date: new Date(d),
          before: before,
          after: after,
          context: contextFor(before, after, holidays)
        });
      }
    }
    d = addDays(d, 1);
  }

  return result;
}

function contextFor(before, after, holidays) {
  const beforeH = holidays[ymd(before)];
  const afterH = holidays[ymd(after)];
  const parts = [];
  if (beforeH) parts.push(beforeH.name);
  else parts.push(mondayIndex(before) >= 5 ? "helg" : "—");
  parts.push("→ kläm →");
  if (afterH) parts.push(afterH.name);
  else parts.push(mondayIndex(after) >= 5 ? "helg" : "—");
  return parts.join(" ");
}

// Beräknar längsta sammanhängande ledighet om man tar X semesterdagar runt klämdagen
export function strategyFor(squeeze, holidays) {
  // Hitta längsta perioden av "inte arbete" om man tar klämdagen ledig + alla andra klämdagar i en bubbla
  const isOff = (date) => {
    const wd = mondayIndex(date);
    if (wd >= 5) return true;
    const h = holidays[ymd(date)];
    return h && h.type === "red";
  };

  // Räkna framåt och bakåt från klämdagen som ledig
  let totalDays = 1; // klämdagen själv
  let semesterDays = 1; // klämdagen är vi själva tar
  let cursor = addDays(squeeze.date, -1);
  while (isOff(cursor)) { totalDays++; cursor = addDays(cursor, -1); }
  // Försök ta nästa vardag också om den ligger mellan
  cursor = addDays(squeeze.date, 1);
  while (isOff(cursor)) { totalDays++; cursor = addDays(cursor, 1); }
  return { totalDays, semesterDays };
}

export function formatSqueezeDay(squeeze) {
  const d = squeeze.date;
  const dayName = ["mån","tis","ons","tor","fre"][mondayIndex(d)];
  return `${dayName} ${d.getDate()} ${MONTHS_SV[d.getMonth()]}`;
}
