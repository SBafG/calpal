// ============================================================
// counters.js — Personliga räknare
// Hjärtslag + dagar levt + nedräkning till julgrupp av högtider
// ============================================================

import { daysBetween, addDays, MONTHS_SV } from "./utils.js";
import { holidaysForYear } from "./holidays.js";

// Nedräknings-mål för "året runt"
export function upcomingMilestones(today) {
  const list = [];
  const year = today.getFullYear();
  const next = year + 1;

  const stockMilestones = (y) => [
    { name: "Midsommarafton", date: findMidsummerEve(y) },
    { name: "Kanelbullens dag", date: new Date(y, 9, 4) },
    { name: "Halloween", date: new Date(y, 9, 31) },
    { name: "1:a advent", date: firstAdvent(y) },
    { name: "Lucia", date: new Date(y, 11, 13) },
    { name: "Julafton", date: new Date(y, 11, 24) },
    { name: "Nyårsafton", date: new Date(y, 11, 31) },
    { name: "Alla hjärtans dag", date: new Date(y, 1, 14) },
    { name: "Valborg", date: new Date(y, 3, 30) },
    { name: "Nationaldagen", date: new Date(y, 5, 6) },
  ];

  for (const m of stockMilestones(year)) list.push(m);
  for (const m of stockMilestones(next)) list.push(m);

  return list
    .filter(m => m.date >= today)
    .sort((a, b) => a.date - b.date)
    .slice(0, 8)
    .map(m => ({
      name: m.name,
      date: m.date,
      days: daysBetween(today, m.date)
    }));
}

function findMidsummerEve(year) {
  for (let d = 19; d <= 25; d++) {
    const c = new Date(year, 5, d);
    if (c.getDay() === 5) return c;
  }
  return new Date(year, 5, 21);
}

function firstAdvent(year) {
  // Söndagen mellan 27 nov och 3 dec
  for (let d = 27; d <= 33; d++) {
    const c = new Date(year, 10, d);
    if (c.getDay() === 0) return c;
  }
  return new Date(year, 11, 1);
}

// Beräknar livsstatistik från födelsedatum
const HEART_RATE = 75; // slag/min genomsnitt
const BREATH_RATE = 16; // andetag/min

export function lifeStats(birthDate, now = new Date()) {
  const ms = now - birthDate;
  if (ms < 0) return null;
  const days = ms / 86400000;
  const minutes = ms / 60000;

  return {
    days: Math.floor(days),
    weeks: Math.floor(days / 7),
    months: yearsAndMonths(birthDate, now).months + yearsAndMonths(birthDate, now).years * 12,
    years: yearsAndMonths(birthDate, now).years,
    heartbeats: Math.floor(minutes * HEART_RATE),
    breaths: Math.floor(minutes * BREATH_RATE),
    nextRoundDay: nextRoundDayMilestone(days, birthDate),
    sleeps: Math.floor(days), // ungefärligt
    smiles: Math.floor(days * 9) // medelmänniska ler ~9 ggr/dag
  };
}

function yearsAndMonths(birth, now) {
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (now.getDate() < birth.getDate()) months -= 1;
  if (months < 0) { years -= 1; months += 12; }
  return { years, months };
}

function nextRoundDayMilestone(currentDays, birth) {
  const rounds = [1000, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 50000];
  const target = rounds.find(r => r > currentDays);
  if (!target) return null;
  const targetDate = addDays(birth, target);
  return { value: target, date: targetDate, daysAway: Math.ceil(target - currentDays) };
}

export function formatNumber(n) {
  return n.toLocaleString("sv-SE").replace(/,/g, " ");
}

export function formatDateSv(date) {
  return `${date.getDate()} ${MONTHS_SV[date.getMonth()]} ${date.getFullYear()}`;
}
