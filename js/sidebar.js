// ============================================================
// sidebar.js — editorial sidopanel (sol/måne, pollen, bonde, ord, säsong)
// ============================================================

import { sunTimes, daylightMinutes, dayLengthLabel, deltaLabel, moonPhase } from "./astronomy.js";
import { addDays, formatTime, MONTHS_SV, WEEKDAYS_SV_LONG, mondayIndex } from "./utils.js";
import { bondeForDate } from "./bondepraktikan.js";
import { wordForDate } from "./wordOfDay.js";
import { loadPollen, pollenForDate } from "./pollen.js";

const POLLEN_PRIORITY = ["Björk", "Gräs", "Gråbo", "Ek", "Al", "Hassel", "Sälg och viden"];
const SEV = ["ingen", "låg", "låg-måttlig", "måttlig", "måttlig-hög", "hög", "mycket hög"];

export function renderSidebar(container, today, seasonLabel, seasonSub) {
  const wd = WEEKDAYS_SV_LONG[mondayIndex(today)];
  const ctx = `${wd} ${today.getDate()} ${MONTHS_SV[today.getMonth()]}`;
  container.innerHTML = `
    <div class="side-today" aria-label="Sidopanelen gäller idag">Idag <span>·</span> ${ctx}</div>
    <div class="side-block clickable" data-detail="moon">${sunMoonBlock(today)}</div>
    <div class="side-block clickable" data-detail="season" id="pollenBlock">${pollenBlock(null)}</div>
    <div class="side-block side-bonde clickable" data-detail="bonde">${bondeBlock(today)}</div>
    <div class="side-block clickable side-ord" data-detail="word">${ordBlock(today)}</div>
    <div class="side-block clickable" data-detail="season">${seasonBlock(today, seasonLabel, seasonSub)}</div>
  `;

  // Lazy-load pollen
  loadPollen().then(data => {
    const el = container.querySelector("#pollenBlock");
    if (el) el.innerHTML = pollenBlock(pollenForDate(data, today), data);
  });
}

function sunMoonBlock(today) {
  const t = sunTimes(today);
  const todayMin = daylightMinutes(today);
  const yMin = daylightMinutes(addDays(today, -1));
  const delta = (todayMin != null && yMin != null) ? deltaLabel(todayMin - yMin) : "";
  const moon = moonPhase(today);

  // Sun arc position
  const now = new Date();
  let frac = 0.5;
  if (t.sunrise && t.sunset) {
    frac = Math.max(0, Math.min(1, (now - t.sunrise) / (t.sunset - t.sunrise)));
  }
  const sunX = 14 + 252 * frac;
  const sunY = 78 - Math.sin(frac * Math.PI) * 70;

  return `
    <div class="side-head">Solhöjd</div>
    <svg class="sun-arc-svg" viewBox="0 0 280 92" role="img" aria-label="Solens båge över dygnet, soluppgång ${t.sunrise ? formatTime(t.sunrise) : "—"} till solnedgång ${t.sunset ? formatTime(t.sunset) : "—"}">
      <line x1="0" y1="78" x2="280" y2="78" stroke="var(--cp-ink)" stroke-width="0.7"/>
      <path d="M14 78 Q 140 -10 266 78" stroke="var(--cp-ink)" stroke-width="0.5" fill="none"/>
      <circle cx="${sunX.toFixed(1)}" cy="${sunY.toFixed(1)}" r="6" fill="var(--cp-accent)"/>
      <text x="14" y="90" font-size="10" fill="var(--cp-ink-2)">${t.sunrise ? formatTime(t.sunrise) : "—"}</text>
      <text x="266" y="90" font-size="10" fill="var(--cp-ink-2)" text-anchor="end">${t.sunset ? formatTime(t.sunset) : "—"}</text>
    </svg>
    <div class="sun-row">
      <div>
        <div class="daylabel">Dagsljus</div>
        <div class="dayval">${dayLengthLabel(t.daylight)}</div>
      </div>
      <div class="daydelta">${delta}</div>
    </div>
    <div class="moon-row">
      <span style="font-size:30px;line-height:1">${moon.emoji}</span>
      <div style="flex:1">
        <div class="moon-phase-name">${moon.name}</div>
        <div class="moon-lit">${Math.round(moon.illumination * 100)} % belyst</div>
      </div>
    </div>
  `;
}

function pollenBlock(day, data) {
  let body;
  if (!data) {
    body = `<div class="pollen-empty">Laddar pollenprognos…</div>`;
  } else if (data.offSeason) {
    body = `<div class="pollen-empty">Utanför pollensäsong — Pollenrapporten publicerar mars–oktober.</div>`;
  } else if (!day) {
    body = `<div class="pollen-empty">Ingen prognos för datumet.</div>`;
  } else {
    const active = POLLEN_PRIORITY.filter(n => day.values[n] !== undefined);
    body = active.slice(0, 5).map(name => {
      const lvl = day.values[name];
      const bars = [1,2,3,4].map(i => {
        const filled = i <= Math.ceil(lvl * 4 / 6);
        return `<div class="b${filled ? " on" : ""}"></div>`;
      }).join("");
      return `<div class="pollen-entry">
        <div><div class="pollen-name">${name}</div><div class="pollen-bars">${bars}</div></div>
        <div class="pollen-sev">${SEV[lvl] || "—"}</div>
      </div>`;
    }).join("");
    if (!active.length) body = `<div class="pollen-empty">Luften är ren idag.</div>`;
  }
  const loc = data && !data.offSeason ? `<span class="side-loc">${data.region}</span>` : "";
  return `<div class="side-head-row"><div class="side-head">Pollen</div>${loc}</div>${body}`;
}

function bondeBlock(today) {
  const b = bondeForDate(today);
  return `
    <div class="side-head accent">Bondepraktikan</div>
    <p class="bonde-quote">"${b ? b.text : "—"}"</p>
  `;
}

function ordBlock(today) {
  const w = wordForDate(today);
  return `
    <div class="side-head">Dagens svenska ord</div>
    <div class="ord-word">${w.word}</div>
    <div class="ord-def">${w.def}</div>
  `;
}

function seasonBlock(today, seasonLabel, seasonSub) {
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(),0,0)) / 86400000);
  const frac = dayOfYear / 365;
  const ang = frac * 2 * Math.PI - Math.PI / 2;
  const x = 36 + Math.cos(ang) * 32;
  const y = 36 + Math.sin(ang) * 32;
  const large = frac > 0.5 ? 1 : 0;
  return `
    <div class="side-head">Säsong</div>
    <div class="side-season-row">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="32" fill="none" stroke="var(--cp-rule)" stroke-width="1"/>
        <path d="M 36 4 A 32 32 0 ${large} 1 ${x.toFixed(1)} ${y.toFixed(1)}" stroke="var(--cp-accent)" stroke-width="2" fill="none"/>
        <circle cx="36" cy="36" r="2" fill="var(--cp-ink)"/>
      </svg>
      <div>
        <div class="side-season-label">${seasonLabel}</div>
        <div class="side-season-sub">${seasonSub}</div>
      </div>
    </div>
  `;
}
