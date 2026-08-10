// ============================================================
// calendar.js — editorial månadsgrid (Skandinavisk modernism)
// ============================================================

import { monthGridDays, isoWeek, sameDay, ymd, mondayIndex, MONTHS_SV, WEEKDAYS_SV_LONG } from "./utils.js";
import { getNameday } from "./namedays.js";
import { holidaysForYear } from "./holidays.js";
import { squeezeDaysForYear } from "./squeezeDays.js";

const WD = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

// Svenska flaggan — 16:10 med korsarmarna på 5:2:9 respektive 4:2:4.
// Storleken sätts av anroparens klass, inte här.
export function swedishFlag(className) {
  return `<svg class="${className}" viewBox="0 0 16 10" aria-hidden="true" focusable="false">` +
    `<rect width="16" height="10" fill="#006aa7"/>` +
    `<rect x="5" width="2" height="10" fill="#fecc02"/>` +
    `<rect y="4" width="16" height="2" fill="#fecc02"/></svg>`;
}

const FLAG_SVG = swedishFlag("day-flag");

export function renderCalendar(container, displayMonth, today, onDayClick) {
  const year = displayMonth.getFullYear();
  const days = monthGridDays(displayMonth);

  // Rutnätet spänner över årsskiftet i januari och december, så slå ihop
  // angränsande år — annars saknar de överhängande cellerna helgdagsdata.
  const years = [year - 1, year, year + 1];
  const holidays = Object.assign({}, ...years.map(y => holidaysForYear(y)));
  const klamSet = new Set(years.flatMap(y => squeezeDaysForYear(y)).map(s => ymd(s.date)));

  // Weekday header
  let html = `<div class="cal-weekhead" role="row"><div></div>`;
  WD.forEach((w, i) => {
    html += `<div class="wd${i >= 5 ? " weekend" : ""}" role="columnheader">${w}</div>`;
  });
  html += `</div>`;

  // 6 weeks
  for (let row = 0; row < 6; row++) {
    const weekDays = days.slice(row * 7, row * 7 + 7);
    const weekNum = isoWeek(weekDays[0]);
    html += `<div class="cal-week" role="row"><div class="cal-weeknum" aria-label="Vecka ${weekNum}">${weekNum}</div>`;
    weekDays.forEach(d => { html += dayCell(d, displayMonth, today, holidays, klamSet); });
    html += `</div>`;
  }
  html += `<div class="cal-grid-close"></div>`;

  container.setAttribute("role", "grid");
  container.setAttribute("aria-label", `Kalender ${MONTHS_SV[displayMonth.getMonth()]} ${displayMonth.getFullYear()}`);
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
  const isFlagDay = !!(hol && hol.flagDay);
  const names = getNameday(date);

  const classes = ["day"];
  if (!inMonth) classes.push("muted");
  if (isRedHoliday) classes.push("holiday");
  if (isToday) classes.push("today");

  // ARIA-etikett som beskriver hela dagen
  const ariaParts = [
    WEEKDAYS_SV_LONG[mondayIndex(date)],
    `${date.getDate()} ${MONTHS_SV[date.getMonth()]}`,
    names.length ? `namnsdag ${names.join(", ")}` : "",
    hol ? hol.name : "",
    isFlagDay ? "allmän flaggdag" : "",
    isToday ? "idag" : ""
  ].filter(Boolean);
  const aria = ariaParts.join(", ");

  // Flaggan är en egen signal vid sidan av röd dag — 6 juni är båda.
  let flags = isFlagDay ? FLAG_SVG : "";
  if (isToday) flags += `<span class="day-idag">idag</span>`;
  else if (isRedHoliday) flags += `<span class="day-dot"></span>`;
  else if (isKlam) flags += `<span class="day-klam">kläm</span>`;

  // Helgdagsnamn (kort) — visa bara om röd dag eller flaggdag med namn
  const holidayName = hol ? `<div class="day-holiday-name">${shorten(hol.name)}</div>` : "";

  return `
    <button class="${classes.join(" ")}" data-date="${key}" type="button" role="gridcell" aria-label="${aria}">
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
