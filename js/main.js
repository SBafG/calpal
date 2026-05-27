// ============================================================
// main.js — Cal·Pal (Skandinavisk modernism) entry point
// ============================================================

import { MONTHS_SV, WEEKDAYS_SV_LONG, mondayIndex, isoWeek } from "./utils.js";
import { getNameday } from "./namedays.js";
import { monthCitation } from "./almanackCitat.js";
import { renderCalendar } from "./calendar.js";
import { renderSidebar } from "./sidebar.js";
import { initModal, openCardDeepDive, setModalDate, openCounter, openSqueeze, openAbout, showModal } from "./modal.js";

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
    { label: "Idag", big: wd, sub: `${today.getDate()} ${MONTHS_SV[today.getMonth()]} · ${seasonLabel}`, accent: true, italic: true, action: "hero", title: "Om dagen" },
    { label: "Namnsdag", big: names[0] || "—", sub: names.length > 1 ? `· ${names.slice(1).join(", ")}` : "", accent: false, italic: false, action: "hero", title: "Om namnet" },
    { label: "Dag av året", big: String(doy), sub: `av ${daysInYear(today.getFullYear())}`, accent: false, italic: false, action: "history", title: "Tidsmaskinen" },
    { label: "Dagar kvar", big: String(left), sub: "till nyår", accent: false, italic: false, action: "counter", title: "Räknare & nedräkningar" }
  ];

  document.getElementById("todayStats").innerHTML = cards.map(c => `
    <button type="button" class="stat-card${c.accent ? " accent" : ""}${c.italic ? " italic" : ""}" data-action="${c.action}" title="${c.title}">
      <div class="stat-label">${c.label}</div>
      <div class="stat-big">${c.big}</div>
      ${c.sub ? `<div class="stat-sub">${c.sub}</div>` : ""}
    </button>
  `).join("");

  document.querySelectorAll("#todayStats .stat-card").forEach(el => {
    el.onclick = () => {
      const a = el.getAttribute("data-action");
      if (a === "counter") openCounter();
      else openCardDeepDive(a, today);
    };
  });
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
  const essay = document.getElementById("monthEssay");
  essay.classList.add("clickable");
  essay.setAttribute("data-detail", "almanack");

  // Sidopanel-block + månadens essä — klick + tangentbord
  document.querySelectorAll("[data-detail]").forEach(el => {
    const key = el.getAttribute("data-detail");
    const open = (e) => {
      if (e.target.closest("a")) return;
      openCardDeepDive(key, key === "almanack" ? displayMonth : today);
    };
    el.onclick = open;
    // Gör icke-knapp-element (divar) tangentbordsnåbara
    if (el.tagName !== "BUTTON") {
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.onkeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); }
      };
    }
  });
}

// ---------- Arkiv: hoppa till valfri månad/år ----------
function openArchive() {
  const y = displayMonth.getFullYear();
  const months = MONTHS_SV.map((m, i) =>
    `<button class="arch-month${i === displayMonth.getMonth() ? " current" : ""}" data-m="${i}">${m}</button>`
  ).join("");

  showModal(`
    <h2>Arkiv</h2>
    <p class="intro">Bläddra till valfri månad genom åren</p>
    <div class="arch-year">
      <button class="arch-nav" id="archPrevY" aria-label="Föregående år">‹</button>
      <span class="arch-year-label" id="archYearLabel">${y}</span>
      <button class="arch-nav" id="archNextY" aria-label="Nästa år">›</button>
    </div>
    <div class="arch-months" id="archMonths">${months}</div>
    <p class="dd-meta" style="margin-top:18px">Tips: ← och → bläddrar månad direkt i kalendern.</p>
  `);

  let pickYear = y;
  const label = document.getElementById("archYearLabel");
  document.getElementById("archPrevY").onclick = () => { pickYear--; label.textContent = pickYear; };
  document.getElementById("archNextY").onclick = () => { pickYear++; label.textContent = pickYear; };
  document.querySelectorAll(".arch-month").forEach(b => {
    b.onclick = () => {
      displayMonth = new Date(pickYear, Number(b.getAttribute("data-m")), 1);
      document.getElementById("modalClose").click();
      renderAll();
    };
  });
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
  document.getElementById("navArchive").onclick = (e) => { e.preventDefault(); openArchive(); };
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
