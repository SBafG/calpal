// ============================================================
// utils.js — datum-, tid- och formaterings-hjälpare
// ============================================================

export const MONTHS_SV = [
  "januari","februari","mars","april","maj","juni",
  "juli","augusti","september","oktober","november","december"
];

export const WEEKDAYS_SV_SHORT = ["mån","tis","ons","tor","fre","lör","sön"];
export const WEEKDAYS_SV_LONG = [
  "måndag","tisdag","onsdag","torsdag","fredag","lördag","söndag"
];

export function pad(n) { return String(n).padStart(2, "0"); }

export function ymd(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function mmdd(date) {
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

// ISO 8601 veckonummer (måndag som veckostart)
export function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}

// Gauss algoritm för västerländsk påsk (söndagen)
export function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// Måndag-baserat veckodagsindex (0 = mån, 6 = sön)
export function mondayIndex(date) {
  return (date.getDay() + 6) % 7;
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

// Generera ett 6x7 grid med dagar för månadsvyn, måndag som första dag
export function monthGridDays(date) {
  const first = startOfMonth(date);
  const offset = mondayIndex(first);
  const start = addDays(first, -offset);
  const cells = [];
  for (let i = 0; i < 42; i++) cells.push(addDays(start, i));
  return cells;
}

export function formatLongDate(date) {
  return `${WEEKDAYS_SV_LONG[mondayIndex(date)]} ${date.getDate()} ${MONTHS_SV[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function daysBetween(a, b) {
  const ms = b - a;
  return Math.round(ms / 86400000);
}

// Hämta n:te förekomsten av en viss veckodag i en månad. weekday: 0=mån..6=sön
export function nthWeekdayOfMonth(year, month, weekday, n) {
  const first = new Date(year, month, 1);
  const firstWd = mondayIndex(first);
  const day = 1 + ((weekday - firstWd + 7) % 7) + (n - 1) * 7;
  return new Date(year, month, day);
}

// Sista förekomsten av en veckodag i en månad
export function lastWeekdayOfMonth(year, month, weekday) {
  const last = endOfMonth(new Date(year, month, 1));
  const lastWd = mondayIndex(last);
  const day = last.getDate() - ((lastWd - weekday + 7) % 7);
  return new Date(year, month, day);
}

// Deterministic pseudo-random från en sträng (för att variera "dagens X" stabilt)
export function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function pickFromArray(arr, seed) {
  if (!arr || arr.length === 0) return null;
  return arr[hashStr(seed) % arr.length];
}
