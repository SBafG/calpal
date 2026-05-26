// ============================================================
// calendar.js — månadsvy med veckonummer, prickar för indikatorer
// ============================================================

import {
  MONTHS_SV, WEEKDAYS_SV_SHORT, monthGridDays, isoWeek, sameDay, ymd, mondayIndex
} from "./utils.js";
import { getNameday } from "./namedays.js";
import { holidaysForYear } from "./holidays.js";
import { themesForDate } from "./themedays.js";
import { historyForDate } from "./history.js";

const grid = () => document.getElementById("calendarGrid");
const label = () => document.getElementById("monthLabel");

let currentMonth = new Date();
currentMonth.setDate(1);

let selectedDate = new Date();
let onSelectCallback = null;

export function initCalendar(onSelect) {
  onSelectCallback = onSelect;
  document.getElementById("prevMonth").addEventListener("click", () => navigate(-1));
  document.getElementById("nextMonth").addEventListener("click", () => navigate(1));
  document.getElementById("todayBtn").addEventListener("click", () => {
    currentMonth = new Date();
    currentMonth.setDate(1);
    selectedDate = new Date();
    render();
  });
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea")) return;
    if (e.key === "ArrowLeft")  navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
    if (e.key === "t" || e.key === "T") {
      currentMonth = new Date(); currentMonth.setDate(1);
      selectedDate = new Date();
      render();
    }
  });
  render();
}

function navigate(delta) {
  currentMonth.setMonth(currentMonth.getMonth() + delta);
  render();
}

export function getSelectedDate() { return selectedDate; }
export function getCurrentMonth() { return currentMonth; }
export function setSelectedDate(d) {
  selectedDate = new Date(d);
  currentMonth = new Date(d.getFullYear(), d.getMonth(), 1);
  render();
}

function render() {
  label().textContent = `${MONTHS_SV[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  const g = grid();
  g.innerHTML = "";

  // Header
  const wnHead = document.createElement("div");
  wnHead.className = "wn-head";
  wnHead.textContent = "v";
  g.appendChild(wnHead);

  WEEKDAYS_SV_SHORT.forEach(wd => {
    const h = document.createElement("div");
    h.className = "wd-head";
    h.textContent = wd;
    g.appendChild(h);
  });

  const days = monthGridDays(currentMonth);
  const holidays = holidaysForYear(currentMonth.getFullYear());
  const todayDate = new Date();

  for (let row = 0; row < 6; row++) {
    const weekDays = days.slice(row * 7, row * 7 + 7);
    const monday = weekDays[0];

    const wnCell = document.createElement("div");
    wnCell.className = "weeknum";
    wnCell.textContent = isoWeek(monday);
    g.appendChild(wnCell);

    weekDays.forEach(d => {
      const cell = renderDayCell(d, todayDate, holidays);
      g.appendChild(cell);
    });
  }

  if (onSelectCallback) onSelectCallback(selectedDate, currentMonth);
}

function renderDayCell(date, today, holidays) {
  const cell = document.createElement("button");
  cell.className = "day";
  cell.type = "button";

  const inMonth = date.getMonth() === currentMonth.getMonth();
  if (!inMonth) cell.classList.add("muted");

  const wd = mondayIndex(date);
  if (wd >= 5) cell.classList.add("weekend");

  const key = ymd(date);
  const hol = holidays[key];
  if (hol && hol.type === "red") cell.classList.add("holiday");

  if (sameDay(date, today)) cell.classList.add("today");
  if (sameDay(date, selectedDate)) cell.classList.add("selected");

  // Datumnummer
  const num = document.createElement("div");
  num.className = "num";
  num.textContent = date.getDate();
  cell.appendChild(num);

  // Namnsdag (textbaserad — alltid synlig)
  const names = getNameday(date);
  if (names.length) {
    const nd = document.createElement("div");
    nd.className = "nameday";
    nd.textContent = names.join(", ");
    cell.appendChild(nd);
  }

  // Flagga uppe i högra hörnet
  if (hol && hol.flagDay) {
    const flag = document.createElement("div");
    flag.className = "flag-mark";
    cell.appendChild(flag);
  }

  // Indikatorprickar längst ner
  const dots = buildDots(date, hol);
  if (dots.length) {
    const dotWrap = document.createElement("div");
    dotWrap.className = "dots";
    dots.forEach(d => {
      const el = document.createElement("span");
      el.className = `dot ${d.color}`;
      dotWrap.appendChild(el);
    });
    cell.appendChild(dotWrap);
  }

  // Title-tooltip med all info för dagen
  cell.title = buildTooltip(date, hol);

  cell.addEventListener("click", () => {
    selectedDate = date;
    render();
    if (onSelectCallback) onSelectCallback(selectedDate, currentMonth);
  });

  return cell;
}

function buildDots(date, hol) {
  const dots = [];
  if (hol && hol.type === "red") dots.push({ color: "red" });
  // Tema-dag → guld
  const themes = themesForDate(date);
  if (themes.length) dots.push({ color: "gold" });
  // Historia → lila om mer än 1 händelse
  const history = historyForDate(date);
  if (history.length > 0) dots.push({ color: "purple" });
  return dots.slice(0, 3); // max 3 prickar
}

function buildTooltip(date, hol) {
  const parts = [];
  const names = getNameday(date);
  if (names.length) parts.push("Namnsdag: " + names.join(", "));
  if (hol) parts.push(hol.name + (hol.type === "red" ? " (röd dag)" : "") + (hol.flagDay ? " · flaggdag" : ""));
  const themes = themesForDate(date);
  themes.forEach(t => parts.push(t.name));
  return parts.join("\n");
}
