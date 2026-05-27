// ============================================================
// calendar.js — editorial månadsgrid (Skandinavisk modernism)
// ============================================================

import { monthGridDays, isoWeek, sameDay, ymd, mondayIndex } from "./utils.js";
import { getNameday } from "./namedays.js";
import { holidaysForYear } from "./holidays.js";
import { squeezeDaysForYear } from "./squeezeDays.js";

const WD = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

export function renderCalendar(container, displayMonth, today, onDayClick) {
  const year = displayMonth.getFullYear();
  const holidays = holidaysForYear(year);
  const klamSet = new Set(squeezeDaysForYear(year).map(s => ymd(s.date)));
  const days = monthGridDays(displayMonth);

  // Weekday header
  let html = `<div class="cal-weekhead"><div></div>`;
  WD.forEach((w, i) => {
    html += `<div class="wd${i >= 5 ? " weekend" : ""}">${w}</div>`;
  });
  html += `</div>`;

  // 6 weeks
  for (let row = 0; row < 6; row++) {
    const weekDays = days.slice(row * 7, row * 7 + 7);
    const weekNum = isoWeek(weekDays[0]);
    html += `<div class="cal-week"><div class="cal-weeknum">${weekNum}</div>`;
    weekDays.forEach(d => { html += dayCell(d, displayMonth, today, holidays, klamSet); });
    html += `</div>`;
  }
  html += `<div class="cal-grid-close"></div>`;

  container.innerHTML = html;

  // Wire day clicks
  container.querySelectorAll(".day").forEach(el => {
    el.onclick = () => {
      const iso = el.getAttribute("data-date");
      const [y, m, dd] = iso.split("-").map(Number);
      onDayClick(new Date(y, m - 1, dd));
    };
  });
}

function dayCell(date, displayMonth, today, holidays, klamSet) {
  const inMonth = date.getMonth() === displayMonth.getMonth();
  const key = ymd(date);
  const hol = holidays[key];
  const isRedHoliday = hol && hol.type === "red";
  const isToday = sameDay(date, today);
  const isKlam = klamSet.has(key) && inMonth;
  const names = getNameday(date);

  const classes = ["day"];
  if (!inMonth) classes.push("muted");
  if (isRedHoliday) classes.push("holiday");
  if (isToday) classes.push("today");

  let flags = "";
  if (isToday) flags = `<span class="day-idag">idag</span>`;
  else if (isRedHoliday) flags = `<span class="day-dot"></span>`;
  else if (isKlam) flags = `<span class="day-klam">kläm</span>`;

  // Helgdagsnamn (kort) — visa bara om röd dag eller flaggdag med namn
  const holidayName = hol ? `<div class="day-holiday-name">${shorten(hol.name)}</div>` : "";

  return `
    <button class="${classes.join(" ")}" data-date="${key}" type="button">
      <div class="day-top">
        <span class="day-num">${date.getDate()}</span>
        <span class="day-flags">${flags}</span>
      </div>
      ${names.length ? `<div class="day-name">${names.join(", ")}</div>` : ""}
      ${holidayName}
    </button>
  `;
}

function shorten(name) {
  if (name.length <= 22) return name;
  return name.slice(0, 21) + "…";
}
