// ============================================================
// daylightBarometer.js — kompakt visualisering av dagens ljus
// ============================================================

import { sunTimes, daylightMinutes, dayLengthLabel, deltaLabel } from "./astronomy.js";
import { addDays, formatTime, sameDay } from "./utils.js";
import { ICONS } from "./icons.js";

export function renderDaylightBarometer(container, date) {
  const t = sunTimes(date);
  const today = daylightMinutes(date);
  const yesterday = daylightMinutes(addDays(date, -1));
  const delta = (today != null && yesterday != null) ? today - yesterday : null;
  const isToday = sameDay(date, new Date());

  container.className = "card";
  container.innerHTML = `
    <div class="card-head">
      <span class="card-icon gold">${ICONS.sun}</span>
      <h4 class="card-title">Sol & ljus</h4>
    </div>
    <svg class="daylight-svg" viewBox="0 0 200 110" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dayGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#f1e3c4" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#d4a342" stop-opacity="0.55"/>
        </linearGradient>
      </defs>
      ${buildArc(t, isToday)}
      <line x1="0" y1="100" x2="200" y2="100" stroke="#e3dac7" stroke-width="1"/>
    </svg>
    <div class="daylight-times">
      <div class="col">
        <div class="big">${t.sunrise ? formatTime(t.sunrise) : "—"}</div>
        <div class="label">Soluppgång</div>
      </div>
      <div class="col">
        <div class="big">${t.sunset ? formatTime(t.sunset) : "—"}</div>
        <div class="label">Solnedgång</div>
      </div>
    </div>
    <div class="daylight-delta">
      <div>Dagsljus <strong>${dayLengthLabel(t.daylight)}</strong></div>
      <div class="delta ${delta != null && delta < 0 ? "neg" : ""}">${delta != null ? deltaLabel(delta) : ""}</div>
    </div>
  `;
}

function buildArc(t, isToday) {
  if (!t.sunrise || !t.sunset) {
    return `<text x="100" y="60" text-anchor="middle" fill="#94a3b8" font-size="11">Saknar tider</text>`;
  }
  const sunX = sunPosX(t, isToday);
  const sunY = sunPosY(t, isToday);
  return `
    <path d="M 10 100 A 90 80 0 0 1 190 100"
          fill="url(#dayGrad)" stroke="#d4a342" stroke-width="2"/>
    <circle cx="${sunX}" cy="${sunY}" r="6" fill="#d4a342" stroke="#fffdf8" stroke-width="2"/>
  `;
}

function sunPosX(t, isToday) {
  if (!isToday) return 100; // middag-position för icke-idag-dagar
  const now = new Date();
  const total = t.sunset - t.sunrise;
  const since = now - t.sunrise;
  let frac = since / total;
  if (now < t.sunrise) frac = 0;
  if (now > t.sunset) frac = 1;
  frac = Math.max(0, Math.min(1, frac));
  return 10 + frac * 180;
}
function sunPosY(t, isToday) {
  if (!isToday) return 20; // toppen för icke-idag
  const now = new Date();
  const total = t.sunset - t.sunrise;
  const since = now - t.sunrise;
  let frac = since / total;
  if (now < t.sunrise) frac = 0;
  if (now > t.sunset) frac = 1;
  frac = Math.max(0, Math.min(1, frac));
  return 100 - Math.sin(Math.PI * frac) * 80;
}
