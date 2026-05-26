// ============================================================
// practical.js — Praktiskt & ekonomi: lönedag, klockomställning, deklaration
// ============================================================

import { ymd, lastWeekdayOfMonth, mondayIndex } from "./utils.js";

// Lönedag = 25:e i månaden, om den är lördag/söndag → fredagen innan
export function paydayFor(year, month) {
  let d = new Date(year, month, 25);
  while (mondayIndex(d) >= 5) d = new Date(year, month, d.getDate() - 1);
  return d;
}

// Klockomställning
export function dstChanges(year) {
  return {
    summerStart: lastWeekdayOfMonth(year, 2, 6), // sista söndagen i mars
    summerEnd: lastWeekdayOfMonth(year, 9, 6)    // sista söndagen i oktober
  };
}

// Deklaration — pappersinlämning brukar vara 2 maj, e-tjänst 30 april
export function declarationDeadline(year) {
  return new Date(year, 4, 2); // 2 maj
}

// Skatteåterbäring första utbetalning — ungefär första veckan i juni för dem med digital deklaration
export function earlyTaxReturn(year) {
  return new Date(year, 5, 8); // 8 juni cirka
}

// Praktiska saker som inträffar på exakt detta datum
export function practicalForDate(date) {
  const items = [];
  const year = date.getFullYear();

  if (ymd(date) === ymd(paydayFor(year, date.getMonth()))) {
    items.push({ tag: "Lönedag", text: "Den 25:e — eller närmaste vardag före om 25:e är helg." });
  }

  const dst = dstChanges(year);
  if (ymd(date) === ymd(dst.summerStart)) {
    items.push({ tag: "Sommartid börjar", text: "Klockan ställs fram en timme: 02:00 → 03:00." });
  }
  if (ymd(date) === ymd(dst.summerEnd)) {
    items.push({ tag: "Sommartid slutar", text: "Klockan ställs tillbaka: 03:00 → 02:00." });
  }

  if (ymd(date) === ymd(declarationDeadline(year))) {
    items.push({ tag: "Deklaration", text: "Senaste dag för inkomstdeklaration." });
  }

  if (ymd(date) === ymd(earlyTaxReturn(year))) {
    items.push({ tag: "Skatteåterbäring", text: "Tidig utbetalning för dem som deklarerat digitalt." });
  }

  return items;
}
