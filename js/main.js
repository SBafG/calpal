// ============================================================
// main.js — Cal·Pal (Skandinavisk modernism) entry point
// ============================================================

import { MONTHS_SV, WEEKDAYS_SV_LONG, mondayIndex, isoWeek } from "./utils.js";
import { getNameday } from "./namedays.js";
import { monthCitation } from "./almanackCitat.js";
import { renderCalendar } from "./calendar.js";
import { renderSidebar } from "./sidebar.js";
import { initModal, openCardDeepDive, setModalDate, openCounter, openSqueeze, openAbout } from "./modal.js";

const today = new Date();
let displayMonth = new Date(today.getFullYear(), today.getMonth(), 1);

const SEASON = {
  var:    { label: "Vår",    sub: "Tranorna dansar, björken slår ut.", poem: "Tjälen släpper och näktergalen stämmer upp i försommarnatten." },
  sommar: { label: "Sommar", sub: "Ljusa nätter, bär i skogen.",       poem: "Höet bärgas och solen vill knappt gå ner över sjöarna." },
  host:   { label: "Höst",   sub: "Tranorna drar, svampen myllrar.",   poem: "Löven brinner i koppar och guld innan mörkret tar vid." },
  vinter: { label: "Vinter", sub: "Stjärnljus och tystnad.",           poem: "Året vänder vid solståndet — dagen dras sakta ur säcken." }
};

function seasonKey(monthIdx) {
  if (monthIdx === 11 || monthIdx <= 1) return "vinter";
  if (monthIdx <= 4) return "var";
  if (monthIdx <= 7) return "sommar";
  return "host";
}

function toRoman(n) {
  const map = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
  let r = "";
  for (const [v, s] of map) { while (n >= v) { r += s; n -= v; } }
  return r;
}

function dayOfYear(d) {
  return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
}
function daysInYear(y) {
  return ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) ? 366 : 365;
}

function renderAll() {
  const sk = seasonKey(displayMonth.getMonth());
  document.documentElement.setAttribute("data-season", sk);

  renderTopStrip();
  renderMasthead(sk);
  renderTodayStats();
  renderMonthHeader();
  renderCalendar(document.getElementById("calendarGrid"), displayMonth, today, onDayClick);
  renderMonthEssay();
  renderSidebar(document.getElementById("sidebar"), today, SEASON[seasonKey(today.getMonth())].label, SEASON[seasonKey(today.getMonth())].sub);
  setModalDate(today);
  wireDeepDives();
}

function renderTopStrip() {
  const wd = WEEKDAYS_SV_LONG[mondayIndex(today)];
  document.getElementById("topstripDate").textContent =
    `${wd} ${today.getDate()} ${MONTHS_SV[today.getMonth()]} ${today.getFullYear()} · v. ${isoWeek(today)} · Stockholm`;
}

function renderMasthead(sk) {
  document.getElementById("editionMeta").textContent =
    `Nummer ${toRoman(dayOfYear(today))} · ${SEASON[sk].label}`;
}

function renderTodayStats() {
  const names = getNameday(today);
  const doy = dayOfYear(today);
  const left = daysInYear(today.getFullYear()) - doy;
  const wd = WEEKDAYS_SV_LONG[mondayIndex(today)];
  const seasonLabel = SEASON[seasonKey(today.getMonth())].label.toLowerCase();

  const cards = [
    { label: "Idag", big: wd, sub: `${today.getDate()} ${MONTHS_SV[today.getMonth()]} · ${seasonLabel}`, accent: true, italic: true },
    { label: "Namnsdag", big: names[0] || "—", sub: names.length > 1 ? `· ${names.slice(1).join(", ")}` : "", accent: false, italic: false },
    { label: "Dag av året", big: String(doy), sub: `av ${daysInYear(today.getFullYear())}`, accent: false, italic: false },
    { label: "Dagar kvar", big: String(left), sub: "till nyår", accent: false, italic: false }
  ];

  document.getElementById("todayStats").innerHTML = cards.map(c => `
    <div class="stat-card${c.accent ? " accent" : ""}${c.italic ? " italic" : ""}">
      <div class="stat-label">${c.label}</div>
      <div class="stat-big">${c.big}</div>
      ${c.sub ? `<div class="stat-sub">${c.sub}</div>` : ""}
    </div>
  `).join("");
}

function renderMonthHeader() {
  document.getElementById("monthName").textContent = MONTHS_SV[displayMonth.getMonth()];
  const prev = (displayMonth.getMonth() + 11) % 12;
  const next = (displayMonth.getMonth() + 1) % 12;
  document.getElementById("monthNavLabel").textContent = `← ${MONTHS_SV[prev]} / ${MONTHS_SV[next]} →`;
  document.getElementById("seasonPoem").textContent = SEASON[seasonKey(displayMonth.getMonth())].poem;
}

function renderMonthEssay() {
  const cit = monthCitation(displayMonth);
  document.getElementById("monthEssay").innerHTML = `
    <div>
      <div class="eyebrow accent">Månadens essä</div>
      <div class="essay-source">${cit.source}</div>
    </div>
    <p class="essay-quote">${highlight(cit.text)}</p>
  `;
}

// Kursivera/accentera ett nyckelord i citatet för editorial känsla
function highlight(text) {
  const words = ["koningadrottning", "vårdkasarna", "Sankt", "midsommar", "Tomas", "solen", "höskörden", "Valborg"];
  for (const w of words) {
    const idx = text.toLowerCase().indexOf(w.toLowerCase());
    if (idx >= 0) {
      return text.slice(0, idx) + `<em>${text.slice(idx, idx + w.length)}</em>` + text.slice(idx + w.length);
    }
  }
  return text;
}

function onDayClick(date) {
  openCardDeepDive("hero", date);
}

function wireDeepDives() {
  // Sidopanel-block + månadens essä
  document.querySelectorAll("[data-detail]").forEach(el => {
    el.onclick = (e) => {
      if (e.target.closest("a")) return;
      const key = el.getAttribute("data-detail");
      const target = key === "almanack" ? displayMonth : today;
      openCardDeepDive(key, target);
    };
  });
  const essay = document.getElementById("monthEssay");
  essay.classList.add("clickable");
  essay.setAttribute("data-detail", "almanack");
  essay.onclick = () => openCardDeepDive("almanack", displayMonth);
}

function navigate(delta) {
  displayMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + delta, 1);
  renderAll();
}

function boot() {
  initModal();

  document.getElementById("prevMonth").onclick = () => navigate(-1);
  document.getElementById("nextMonth").onclick = () => navigate(1);

  document.getElementById("navToday").onclick = (e) => {
    e.preventDefault();
    displayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    renderAll();
  };
  document.getElementById("navCounter").onclick = (e) => { e.preventDefault(); openCounter(); };
  document.getElementById("navSqueeze").onclick = (e) => { e.preventDefault(); openSqueeze(); };
  document.getElementById("navAbout").onclick = (e) => { e.preventDefault(); openAbout(); };

  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea")) return;
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  });

  renderAll();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
