// ============================================================
// main.js — CalPal entry point
// ============================================================

import { initCalendar, getSelectedDate } from "./calendar.js";
import { renderHero, renderDayDetail } from "./dayDetail.js";
import { renderDaylightBarometer } from "./daylightBarometer.js";
import { renderSeasonWheel } from "./seasonWheel.js";
import { monthCitation } from "./almanackCitat.js";
import { initModal, openCardDeepDive, setModalDate } from "./modal.js";

function onDateSelected(date) {
  renderHero(document.getElementById("dayHero"), date);
  renderDaylightBarometer(document.getElementById("daylightBarometer"), date);
  renderSeasonWheel(document.getElementById("seasonWheel"), date);
  renderDayDetail(document.getElementById("dayDetail"), date);
  renderMonthCitation(date);
  setModalDate(date);
  wireCardClicks(date);
}

function wireCardClicks(date) {
  document.querySelectorAll("[data-detail]").forEach(el => {
    el.addEventListener("click", (e) => {
      // Ignorera om klick var på annan klickbar element (a, button) inom kortet
      if (e.target.closest("a, button:not(.day)")) return;
      const key = el.getAttribute("data-detail");
      openCardDeepDive(key, date);
    });
  });
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
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
