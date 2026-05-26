// ============================================================
// main.js — CalPal entry point
// ============================================================

import { initCalendar, getSelectedDate } from "./calendar.js";
import { renderHero, renderDayDetail } from "./dayDetail.js";
import { renderDaylightBarometer } from "./daylightBarometer.js";
import { renderSeasonWheel } from "./seasonWheel.js";
import { monthCitation } from "./almanackCitat.js";
import { initModal } from "./modal.js";

function onDateSelected(date) {
  renderHero(document.getElementById("dayHero"), date);
  renderDaylightBarometer(document.getElementById("daylightBarometer"), date);
  renderSeasonWheel(document.getElementById("seasonWheel"), date);
  renderDayDetail(document.getElementById("dayDetail"), date);
  renderMonthCitation(date);
}

function renderMonthCitation(date) {
  const cit = monthCitation(date);
  const el = document.getElementById("monthCitation");
  el.innerHTML = `
    "${cit.text}"
    <span class="source">${cit.source}</span>
  `;
}

function boot() {
  initCalendar(onDateSelected);
  initModal();
  onDateSelected(getSelectedDate());
  renderEkeronShowcase();
}

// Räknar dynamiskt ut dagens "lagom-mil" för exempel-leasingen
// (1 nov 2024 → 1 nov 2027, 4500 mil totalt)
function renderEkeronShowcase() {
  const milEl = document.getElementById("esMil");
  if (!milEl) return;

  const start = new Date(2024, 10, 1);
  const end = new Date(2027, 10, 1);
  const maxMil = 4500;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const totalDays = (end - start) / 86400000;
  const daysIn = Math.max(0, Math.min(totalDays, (today - start) / 86400000));
  const recommended = Math.round(maxMil * (daysIn / totalDays));

  milEl.textContent = recommended.toLocaleString("sv-SE").replace(/,/g, " ");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
