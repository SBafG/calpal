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
  const start = new Date(2024, 10, 1);   // 2024-11-01
  const end = new Date(2027, 10, 1);     // 2027-11-01
  const maxMil = 4500;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const totalDays = (end - start) / 86400000;
  const daysIn = Math.max(0, Math.min(totalDays, (today - start) / 86400000));
  const recommended = Math.round(maxMil * (daysIn / totalDays));

  const milEl = document.getElementById("esMil");
  const todayEl = document.getElementById("esToday");
  const tableEl = document.getElementById("esTable");
  if (!milEl) return;

  milEl.textContent = recommended.toLocaleString("sv-SE").replace(/,/g, " ");

  const months = ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
  todayEl.textContent = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

  // Mini-tabell: 2 dagar före och 2 dagar efter
  const rows = [];
  for (let i = -2; i <= 2; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const days = (d - start) / 86400000;
    if (days < 0 || days > totalDays) continue;
    const mil = Math.round(maxMil * (days / totalDays));
    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    const isNow = i === 0 ? "now" : "";
    rows.push(`<tr class="${isNow}"><td>${dateStr}</td><td>${mil.toLocaleString("sv-SE").replace(/,/g," ")}</td></tr>`);
  }
  tableEl.innerHTML = rows.join("");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
