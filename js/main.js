// ============================================================
// main.js — CalPal entry point
// ============================================================

import { initCalendar, getSelectedDate } from "./calendar.js";
import { renderHero, renderDayDetail } from "./dayDetail.js";
import { renderDaylightBarometer } from "./daylightBarometer.js";
import { renderSeasonWheel } from "./seasonWheel.js";
import { monthCitation } from "./almanackCitat.js";
import { initModal, openCardDeepDive, setModalDate } from "./modal.js";

function onDateSelected(date, displayMonth) {
  const month = displayMonth || date;
  renderHero(document.getElementById("dayHero"), date);
  renderDaylightBarometer(document.getElementById("daylightBarometer"), date);
  renderSeasonWheel(document.getElementById("seasonWheel"), date);
  renderDayDetail(document.getElementById("dayDetail"), date);
  renderMonthCitation(month);
  setModalDate(date);
  wireCardClicks(date, month);
}

function wireCardClicks(date, month) {
  document.querySelectorAll("[data-detail]").forEach(el => {
    // onclick (ej addEventListener) så handlers inte ackumuleras på
    // element som lever kvar mellan renderingar (t.ex. månadscitatet)
    el.onclick = (e) => {
      if (e.target.closest("a, button:not(.day)")) return;
      const key = el.getAttribute("data-detail");
      // Almanach-citatet följer visad månad, inte vald dag
      const target = key === "almanack" ? month : date;
      openCardDeepDive(key, target);
    };
  });
}

function renderMonthCitation(date) {
  const cit = monthCitation(date);
  const el = document.getElementById("monthCitation");
  el.classList.add("clickable");
  el.setAttribute("data-detail", "almanack");
  el.setAttribute("title", "Klicka för mer ur almanackatraditionen");
  el.innerHTML = `
    <span class="expand-hint" aria-hidden="true">+</span>
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
