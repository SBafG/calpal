// ============================================================
// culture.js — Kultur & nöje på datumet
// ============================================================

import { mmdd, nthWeekdayOfMonth, lastWeekdayOfMonth, ymd } from "./utils.js";

const FIXED_CULTURE = {
  "01-13": { name: "Tjugondag Knut", category: "Tradition" },
  "02-14": { name: "Alla hjärtans dag (USA-import)", category: "Pop" },
  "03-04": { name: "Melodifestivalen — finalvecka (ungefär)", category: "TV" },
  "04-06": { name: "ABBA:s Eurovisionsseger 1974", category: "Musik" },
  "04-30": { name: "Valborg — eldar och körsång", category: "Tradition" },
  "05-09": { name: "Eurovision-finalvecka", category: "TV" },
  "05-30": { name: "Vasaloppets sommarpremiär (skidloppets jubileum)", category: "Sport" },
  "06-06": { name: "Sveriges nationaldag — kungafamiljens utdelning av flaggor", category: "Tradition" },
  "07-04": { name: "Almedalsveckan börjar (ungefär)", category: "Politik" },
  "09-26": { name: "Bokmässan i Göteborg (ungefär)", category: "Litteratur" },
  "12-10": { name: "Nobelprisutdelning i Stockholms konserthus", category: "Pris" },
  "12-13": { name: "Lucia-tåg över hela landet", category: "Tradition" }
};

export function cultureForDate(date) {
  return FIXED_CULTURE[mmdd(date)] || null;
}

// Större årligen återkommande events (för översikten)
export function bigEventsForYear(year) {
  return [
    { date: new Date(year, 11, 10), name: "Nobeldagen — prisutdelning" },
    { date: new Date(year, 4, getEurovisionWeekend(year)), name: "Eurovision Song Contest-finalen (ungefär)" },
    { date: new Date(year, 2, 1), name: "Vasaloppet — första söndagen i mars" }
  ];
}

function getEurovisionWeekend(year) {
  // Brukar vara andra lördagen i maj
  return nthWeekdayOfMonth(year, 4, 5, 2).getDate();
}
