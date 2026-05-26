// ============================================================
// dayDetail.js — Sidopanelens innehåll
// Exports: renderHero (separat top-block), renderDayDetail (content cards)
// ============================================================

import { MONTHS_SV, WEEKDAYS_SV_LONG, mondayIndex, sameDay, isoWeek } from "./utils.js";
import { getNameday } from "./namedays.js";
import { holidayInfo } from "./holidays.js";
import { themesForDate } from "./themedays.js";
import { moonPhase } from "./astronomy.js";
import { bondeForDate } from "./bondepraktikan.js";
import { foodForDate } from "./food.js";
import { cultureForDate } from "./culture.js";
import { practicalForDate } from "./practical.js";
import { historyForDate } from "./history.js";
import { wordForDate } from "./wordOfDay.js";
import { ICONS } from "./icons.js";

// ============================================================
// HERO — översta blocket, alltid synligt
// ============================================================
export function renderHero(container, date) {
  const today = sameDay(date, new Date());
  const wd = WEEKDAYS_SV_LONG[mondayIndex(date)];
  const day = date.getDate();
  const month = MONTHS_SV[date.getMonth()];
  const year = date.getFullYear();

  const names = getNameday(date);
  const hol = holidayInfo(date);
  const themes = themesForDate(date);

  const badges = [];
  if (hol && hol.type === "red") {
    badges.push(`<span class="badge red"><span class="dot"></span>${hol.name}</span>`);
  } else if (hol) {
    badges.push(`<span class="badge"><span class="dot"></span>${hol.name}</span>`);
  }
  if (hol && hol.flagDay) {
    badges.push(`<span class="badge blue"><span class="dot"></span>Flaggdag</span>`);
  }
  themes.slice(0, 2).forEach(t => {
    badges.push(`<span class="badge gold"><span class="dot"></span>${t.name}</span>`);
  });

  const dayOfYear = Math.floor((date - new Date(date.getFullYear(),0,0)) / 86400000);
  const daysInYr = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
  const daysLeftYr = daysInYr - dayOfYear;

  container.innerHTML = `
    <div class="day-hero clickable ${today ? "is-today" : ""}" data-detail="hero" title="Klicka för djupdykning om dagen">
      <span class="expand-hint" aria-hidden="true">+</span>
      <p class="weekday">${wd}</p>
      <h2 class="date">${day} <span class="month">${month} ${year}</span></h2>
      ${names.length ? `
        <p class="nameday-big">
          <span class="label">Namnsdag</span>
          ${names.join(" · ")}
        </p>
      ` : ""}
      ${badges.length ? `<div class="badges">${badges.join("")}</div>` : ""}
      <div class="stats">
        <div class="stat"><div class="num">v ${isoWeek(date)}</div><div class="label">Vecka</div></div>
        <div class="stat"><div class="num">${dayOfYear}</div><div class="label">Dag av året</div></div>
        <div class="stat"><div class="num">${daysLeftYr}</div><div class="label">Dagar kvar</div></div>
      </div>
    </div>
  `;
}

// ============================================================
// CONTENT CARDS — kommer efter widgets
// ============================================================
export function renderDayDetail(container, date) {
  const parts = [];
  parts.push(renderHistory(date));
  parts.push(renderFood(date));
  parts.push(renderCulture(date));
  parts.push(renderPractical(date));
  parts.push(renderBonde(date));
  parts.push(renderWord(date));
  container.innerHTML = parts.filter(Boolean).join("");
}

function renderHistory(date) {
  const list = historyForDate(date);
  if (!list.length) return "";
  return `
    <div class="card clickable" data-detail="history" title="Öppna Tidsmaskinen">
      <span class="expand-hint" aria-hidden="true">+</span>
      <div class="card-head">
        <span class="card-icon">${ICONS.scroll}</span>
        <h4 class="card-title">På denna dag</h4>
      </div>
      <div class="history-list">
        ${list.slice(0, 3).map(h => `
          <div class="history-item">
            <span class="year">${h.year}</span>
            <span class="text">${h.text}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderFood(date) {
  const food = foodForDate(date);
  if (!food) return "";
  return `
    <div class="card">
      <div class="card-head">
        <span class="card-icon red">${ICONS.utensils}</span>
        <h4 class="card-title">På tallriken</h4>
      </div>
      <div class="card-body">
        <p><strong>${food.dish}</strong></p>
        <p class="sub">${food.desc}</p>
      </div>
    </div>
  `;
}

function renderCulture(date) {
  const c = cultureForDate(date);
  if (!c) return "";
  return `
    <div class="card">
      <div class="card-head">
        <span class="card-icon purple">${ICONS.film}</span>
        <h4 class="card-title">Kultur & nöje</h4>
      </div>
      <div class="card-body">
        <p><strong>${c.name}</strong></p>
        <p class="sub">${c.category}</p>
      </div>
    </div>
  `;
}

function renderPractical(date) {
  const items = practicalForDate(date);
  if (!items.length) return "";
  const list = items.map(i =>
    `<p><strong>${i.tag}</strong><span class="sub">${i.text}</span></p>`
  ).join("");
  return `
    <div class="card">
      <div class="card-head">
        <span class="card-icon gold">${ICONS.briefcase}</span>
        <h4 class="card-title">Praktiskt</h4>
      </div>
      <div class="card-body">${list}</div>
    </div>
  `;
}

function renderBonde(date) {
  const b = bondeForDate(date);
  if (!b) return "";
  return `
    <div class="card clickable" data-detail="bonde" title="Mer om Bondepraktikan">
      <span class="expand-hint" aria-hidden="true">+</span>
      <div class="card-head">
        <span class="card-icon">${ICONS.cloud}</span>
        <h4 class="card-title">Bondepraktikan säger</h4>
      </div>
      <div class="bonde-quote">"${b.text}"</div>
    </div>
  `;
}

function renderWord(date) {
  const w = wordForDate(date);
  return `
    <div class="card word-card clickable" data-detail="word" title="Mer om svenska arvord">
      <span class="expand-hint" aria-hidden="true">+</span>
      <div class="card-head">
        <span class="card-icon">${ICONS.feather}</span>
        <h4 class="card-title">Dagens svenska ord</h4>
      </div>
      <span class="word">${w.word}</span>
      <div class="def">${w.def}</div>
    </div>
  `;
}
