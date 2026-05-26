// ============================================================
// astronomy.js — Månfas, soluppgång/nedgång, dagsljus
// Default position: Stockholm (59.33°N, 18.07°E)
// ============================================================

const DEG = Math.PI / 180;

export const DEFAULT_LAT = 59.3293;
export const DEFAULT_LON = 18.0686;

// ----- MOON PHASE ----------------------------------------------
// Conway's algorithm + förbättring. Returnerar fas 0-7:
// 0 nymåne, 1 växande skära, 2 första kvarteret, 3 växande halvmåne,
// 4 fullmåne, 5 avtagande halvmåne, 6 sista kvarteret, 7 avtagande skära

const MOON_NAMES = [
  "Nymåne", "Växande skära", "Första kvarteret", "Växande halvmåne",
  "Fullmåne", "Avtagande halvmåne", "Sista kvarteret", "Avtagande skära"
];

const MOON_EMOJI = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];

// Julian day från en Date (UTC)
function julianDay(date) {
  const Y = date.getUTCFullYear();
  const M = date.getUTCMonth() + 1;
  const D = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60) / 24;
  const a = Math.floor((14 - M) / 12);
  const y = Y + 4800 - a;
  const m = M + 12 * a - 3;
  return D + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

// Beräknar månens "ålder" i dagar (0-29.53) och fas-index 0-7
export function moonPhase(date) {
  const synodicMonth = 29.530588853;
  const knownNewMoon = 2451550.1; // 6 jan 2000 UTC 18:14
  const jd = julianDay(date);
  let age = ((jd - knownNewMoon) % synodicMonth + synodicMonth) % synodicMonth;
  const fraction = age / synodicMonth;
  // 8 faser med vikt mot "kvartsdagar"
  // Använd centrerade trösklar runt 0, 0.25, 0.5, 0.75 med viss bredd
  const phases = [
    { idx: 0, center: 0.00, width: 0.04 },
    { idx: 2, center: 0.25, width: 0.04 },
    { idx: 4, center: 0.50, width: 0.04 },
    { idx: 6, center: 0.75, width: 0.04 }
  ];
  let phaseIdx;
  for (const p of phases) {
    const d = Math.min(Math.abs(fraction - p.center), 1 - Math.abs(fraction - p.center));
    if (d < p.width) { phaseIdx = p.idx; break; }
  }
  if (phaseIdx === undefined) {
    if (fraction < 0.25) phaseIdx = 1;
    else if (fraction < 0.5) phaseIdx = 3;
    else if (fraction < 0.75) phaseIdx = 5;
    else phaseIdx = 7;
  }
  return {
    age,
    fraction,
    idx: phaseIdx,
    name: MOON_NAMES[phaseIdx],
    emoji: MOON_EMOJI[phaseIdx],
    illumination: 0.5 * (1 - Math.cos(2 * Math.PI * fraction))
  };
}

// ----- SUN: soluppgång och solnedgång ----------------------------
// NOAA approximation — accurate within ~1 min för Sverige

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / 86400000);
}

export function sunTimes(date, lat = DEFAULT_LAT, lon = DEFAULT_LON) {
  const N = dayOfYear(date);
  const lngHourSun = lon / 15;

  const calc = (isSunrise) => {
    const t = N + ((isSunrise ? 6 : 18) - lngHourSun) / 24;
    const M = (0.9856 * t) - 3.289;
    let L = M + (1.916 * Math.sin(M * DEG)) + (0.020 * Math.sin(2 * M * DEG)) + 282.634;
    L = ((L % 360) + 360) % 360;
    let RA = Math.atan(0.91764 * Math.tan(L * DEG)) / DEG;
    RA = ((RA % 360) + 360) % 360;
    const Lquadrant  = Math.floor(L / 90) * 90;
    const RAquadrant = Math.floor(RA / 90) * 90;
    RA = RA + (Lquadrant - RAquadrant);
    RA = RA / 15;
    const sinDec = 0.39782 * Math.sin(L * DEG);
    const cosDec = Math.cos(Math.asin(sinDec));
    const zenith = 90.833;
    const cosH = (Math.cos(zenith * DEG) - (sinDec * Math.sin(lat * DEG))) /
                 (cosDec * Math.cos(lat * DEG));
    if (cosH > 1)  return null; // sun never rises
    if (cosH < -1) return null; // sun never sets
    let H = isSunrise ? 360 - (Math.acos(cosH) / DEG) : (Math.acos(cosH) / DEG);
    H = H / 15;
    const T = H + RA - (0.06571 * t) - 6.622;
    let UT = ((T - lngHourSun) % 24 + 24) % 24;
    // Konvertera UT → svensk lokaltid (sommartid hanteras automatiskt av Date)
    const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                Math.floor(UT), Math.round((UT - Math.floor(UT)) * 60)));
    return utc;
  };

  const sunrise = calc(true);
  const sunset  = calc(false);
  if (!sunrise || !sunset) {
    return { sunrise: null, sunset: null, daylight: null };
  }
  const daylight = sunset - sunrise; // ms
  return { sunrise, sunset, daylight };
}

export function daylightMinutes(date, lat, lon) {
  const t = sunTimes(date, lat, lon);
  if (!t.daylight) return null;
  return t.daylight / 60000;
}

export function dayLengthLabel(ms) {
  if (!ms) return "—";
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h} tim ${m} min`;
}

export function deltaLabel(deltaMin) {
  if (deltaMin == null) return "—";
  const sign = deltaMin >= 0 ? "+" : "−";
  const abs = Math.abs(deltaMin);
  const m = Math.floor(abs);
  const s = Math.round((abs - m) * 60);
  return `${sign}${m} min ${String(s).padStart(2,"0")} s`;
}
