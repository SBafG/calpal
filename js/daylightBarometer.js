// ============================================================
// daylightBarometer.js — Sol & Måne i ett kompakt kort
// ============================================================

import { sunTimes, daylightMinutes, dayLengthLabel, deltaLabel, moonPhase } from "./astronomy.js";
import { addDays, formatTime, sameDay } from "./utils.js";
import { ICONS } from "./icons.js";

export function renderDaylightBarometer(container, date) {
  const t = sunTimes(date);
  const today = daylightMinutes(date);
  const yesterday = daylightMinutes(addDays(date, -1));
  const delta = (today != null && yesterday != null) ? today - yesterday : null;
  const isToday = sameDay(date, new Date());
  const moon = moonPhase(date);

  container.className = "card clickable";
  container.setAttribute("data-detail", "moon");
  container.setAttribute("title", "Mer om sol & måne");
  container.innerHTML = `
    <span class="expand-hint" aria-hidden="true">+</span>
    <div class="card-head">
      <span class="card-icon gold">${ICONS.sun}</span>
      <h4 class="card-title">Sol & måne</h4>
    </div>
    <div class="suns-row">
      <div class="sun-pane">
        <svg class="daylight-svg" viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dayGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="#f1e3c4" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="#d4a342" stop-opacity="0.6"/>
            </linearGradient>
          </defs>
          ${buildArc(t, isToday)}
          <line x1="0" y1="84" x2="200" y2="84" stroke="#e3dac7" stroke-width="1"/>
        </svg>
        <div class="daylight-times">
          <div class="col"><div class="big">${t.sunrise ? formatTime(t.sunrise) : "—"}</div><div class="label">Upp</div></div>
          <div class="col"><div class="big">${t.sunset ? formatTime(t.sunset) : "—"}</div><div class="label">Ner</div></div>
        </div>
      </div>
      <div class="moon-pane">
        <span class="moon-emoji-big">${moon.emoji}</span>
        <div class="phase-name">${moon.name}</div>
        <div class="phase-sub">${Math.round(moon.illumination * 100)} % belyst</div>
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
    return `<text x="100" y="48" text-anchor="middle" fill="#a0907d" font-size="10">Saknar tider</text>`;
  }
  const sunX = sunPosX(t, isToday);
  const sunY = sunPosY(t, isToday);
  return `
    <path d="M 10 84 A 78 70 0 0 1 190 84"
          fill="url(#dayGrad)" stroke="#d4a342" stroke-width="1.6"/>
    <circle cx="${sunX}" cy="${sunY}" r="5" fill="#d4a342" stroke="#fffdf8" stroke-width="1.8"/>
  `;
}

function sunPosX(t, isToday) {
  if (!isToday) return 100;
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
  if (!isToday) return 16;
  const now = new Date();
  const total = t.sunset - t.sunrise;
  const since = now - t.sunrise;
  let frac = since / total;
  if (now < t.sunrise) frac = 0;
  if (now > t.sunset) frac = 1;
  frac = Math.max(0, Math.min(1, frac));
  return 84 - Math.sin(Math.PI * frac) * 70;
}
