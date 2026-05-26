// ============================================================
// modal.js — modaler för räknare, klämdagar, om
// ============================================================

import { lifeStats, formatNumber, formatDateSv, upcomingMilestones } from "./counters.js";
import { squeezeDaysForYear, formatSqueezeDay, strategyFor } from "./squeezeDays.js";
import { holidaysForYear, holidayInfo } from "./holidays.js";
import { getNameday } from "./namedays.js";
import { nameInfo } from "./namedayInfo.js";
import { historyForDate } from "./history.js";
import { birthsForDate, deathsForDate } from "./famousBirthdays.js";
import { themesForDate } from "./themedays.js";
import { bondeForDate } from "./bondepraktikan.js";
import { wordForDate } from "./wordOfDay.js";
import { moonPhase, sunTimes, dayLengthLabel } from "./astronomy.js";
import { seasonsActive, categoryColor } from "./seasonal.js";
import { formatLongDate, isoWeek, MONTHS_SV, WEEKDAYS_SV_LONG, mondayIndex } from "./utils.js";

const modal = () => document.getElementById("modal");
const modalBody = () => document.getElementById("modalBody");

let currentDate = new Date();

export function initModal() {
  document.getElementById("modalClose").addEventListener("click", closeModal);
  modal().addEventListener("click", (e) => {
    if (e.target === modal()) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  document.getElementById("counterBtn").addEventListener("click", openCounter);
  document.getElementById("squeezeBtn").addEventListener("click", openSqueeze);
  document.getElementById("aboutBtn").addEventListener("click", openAbout);
}

export function setModalDate(date) {
  currentDate = date;
}

// Öppna djupdykning för ett specifikt kort
export function openCardDeepDive(detailKey, date) {
  currentDate = date;
  switch (detailKey) {
    case "hero":      return openHeroDeepDive(date);
    case "history":   return openTimemachineDeepDive(date);
    case "moon":      return openSunMoonDeepDive(date);
    case "season":    return openSeasonDeepDive(date);
    case "bonde":     return openBondeDeepDive(date);
    case "word":      return openWordDeepDive(date);
  }
}

function openModal(html) {
  modalBody().innerHTML = html;
  modal().hidden = false;
}

function closeModal() {
  modal().hidden = true;
}

// ============================================================
// Djupdykningar — klickbara kort i sidopanelen
// ============================================================

// ---------- Hero: Om dagen ----------
function openHeroDeepDive(date) {
  const names = getNameday(date);
  const hol = holidayInfo(date);
  const themes = themesForDate(date);
  const births = birthsForDate(date);
  const deaths = deathsForDate(date);
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(),0,0)) / 86400000);
  const daysInYr = ((date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) || date.getFullYear() % 400 === 0) ? 366 : 365;

  let nameSection = "";
  if (names.length) {
    const nameBlocks = names.map(n => {
      const info = nameInfo(n);
      if (!info) {
        return `<div class="dd-name">
          <h4>${n}</h4>
          <p class="dd-meta">Etymologi och berömda namnsdagsbärare saknas — bidra gärna på <a href="https://github.com/SBafG/calpal" target="_blank">GitHub</a>.</p>
        </div>`;
      }
      const famous = info.famous?.length
        ? `<ul class="dd-list">${info.famous.map(f => `<li>${f}</li>`).join("")}</ul>`
        : "";
      return `<div class="dd-name">
        <h4>${n}</h4>
        <p class="dd-meta"><strong>Ursprung:</strong> ${info.origin}<br/><strong>Betydelse:</strong> ${info.meaning}</p>
        ${famous ? `<p class="dd-sub-label">Kända bärare:</p>${famous}` : ""}
      </div>`;
    }).join("");
    nameSection = `<h3>Namnsdag</h3>${nameBlocks}`;
  }

  let badges = "";
  if (hol) badges += `<span class="badge ${hol.type === 'red' ? 'red' : ''}"><span class="dot"></span>${hol.name}</span>`;
  if (hol && hol.flagDay) badges += `<span class="badge blue"><span class="dot"></span>Flaggdag</span>`;
  themes.forEach(t => badges += `<span class="badge gold"><span class="dot"></span>${t.name}</span>`);

  const personSection = (births.length || deaths.length) ? `
    <h3>Personer på detta datum</h3>
    ${births.length ? `<p class="dd-sub-label">Födda denna dag:</p>
      <ul class="dd-list">${births.map(p => `<li><strong>${p.year}</strong> · ${p.name} — <em>${p.role}</em></li>`).join("")}</ul>` : ""}
    ${deaths.length ? `<p class="dd-sub-label">Avled denna dag:</p>
      <ul class="dd-list">${deaths.map(p => `<li><strong>${p.year}</strong> · ${p.name} — <em>${p.role}</em></li>`).join("")}</ul>` : ""}
  ` : "";

  openModal(`
    <h2>${formatLongDate(date)}</h2>
    <p class="intro">Dag ${dayOfYear} av ${daysInYr} · vecka ${isoWeek(date)} · ${daysInYr - dayOfYear} dagar kvar av året</p>
    ${badges ? `<div class="badges" style="margin-bottom:16px">${badges}</div>` : ""}
    ${nameSection}
    ${personSection}
  `);
}

// ---------- Tidsmaskinen: Historia ----------
function openTimemachineDeepDive(date) {
  const events = historyForDate(date);
  const births = birthsForDate(date);
  const deaths = deathsForDate(date);

  if (!events.length && !births.length && !deaths.length) {
    openModal(`
      <h2>Tidsmaskinen</h2>
      <p class="intro">${formatLongDate(date)}</p>
      <p>Inget historiskt registrerat för denna dag ännu. Bidra gärna på <a href="https://github.com/SBafG/calpal" target="_blank">GitHub</a>.</p>
    `);
    return;
  }

  const eventsHtml = events.length
    ? `<ul class="dd-events">${events.map(e => `<li><strong>${e.year}</strong> · ${e.text}</li>`).join("")}</ul>`
    : "";

  const birthsHtml = births.length
    ? `<h3>Födda denna dag</h3>
       <ul class="dd-list">${births.map(p => `<li><strong>${p.year}</strong> · ${p.name} — <em>${p.role}</em></li>`).join("")}</ul>` : "";

  const deathsHtml = deaths.length
    ? `<h3>Avled denna dag</h3>
       <ul class="dd-list">${deaths.map(p => `<li><strong>${p.year}</strong> · ${p.name} — <em>${p.role}</em></li>`).join("")}</ul>` : "";

  openModal(`
    <h2>Tidsmaskinen</h2>
    <p class="intro">${formatLongDate(date)} genom historien</p>
    ${events.length ? `<h3>Händelser</h3>${eventsHtml}` : ""}
    ${birthsHtml}
    ${deathsHtml}
  `);
}

// ---------- Sol & Måne ----------
function openSunMoonDeepDive(date) {
  const moon = moonPhase(date);
  const t = sunTimes(date);
  const upStr = t.sunrise ? `${String(t.sunrise.getHours()).padStart(2,"0")}:${String(t.sunrise.getMinutes()).padStart(2,"0")}` : "—";
  const downStr = t.sunset ? `${String(t.sunset.getHours()).padStart(2,"0")}:${String(t.sunset.getMinutes()).padStart(2,"0")}` : "—";

  // Beräkna nästa fullmåne och nymåne
  let nextFull = null, nextNew = null;
  for (let i = 1; i <= 31; i++) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i);
    const m = moonPhase(d);
    if (!nextFull && m.idx === 4) nextFull = d;
    if (!nextNew && m.idx === 0) nextNew = d;
    if (nextFull && nextNew) break;
  }

  openModal(`
    <h2>Sol & måne</h2>
    <p class="intro">${formatLongDate(date)} · för Stockholm</p>

    <h3>Solen</h3>
    <p><strong>Soluppgång:</strong> ${upStr} &nbsp;·&nbsp; <strong>Solnedgång:</strong> ${downStr}</p>
    <p><strong>Dagsljus:</strong> ${dayLengthLabel(t.daylight)}</p>
    <p class="dd-meta">Beräknat med NOAA-algoritmen för latitud 59,33°N (Stockholm). För andra orter varierar tiderna ±15-30 min.</p>

    <h3>Månen</h3>
    <p><span style="font-size:34px">${moon.emoji}</span> <strong>${moon.name}</strong> · ${Math.round(moon.illumination * 100)} % belyst · ${moon.age.toFixed(1)} dagar in i den 29,5-dagars månadcykeln.</p>
    ${nextFull ? `<p><strong>Nästa fullmåne:</strong> ${formatLongDate(nextFull)}</p>` : ""}
    ${nextNew ? `<p><strong>Nästa nymåne:</strong> ${formatLongDate(nextNew)}</p>` : ""}
    <p class="dd-meta">Månfaserna beräknas med synodisk månad (29,53 dagar) räknat från känd referensnymåne 6 jan 2000.</p>
  `);
}

// ---------- Säsongshjulet ----------
function openSeasonDeepDive(date) {
  const active = seasonsActive(date);
  const grouped = {};
  active.forEach(s => {
    grouped[s.category] = grouped[s.category] || [];
    grouped[s.category].push(s);
  });

  const sections = Object.entries(grouped).map(([cat, items]) => `
    <h3 style="color:${categoryColor(cat)};text-transform:capitalize">${cat}</h3>
    <ul class="dd-list">
      ${items.map(s => `<li><strong>${s.name}</strong> — ${s.info || "&nbsp;"}<br/><span class="dd-meta">Säsong: ${dateRange(s.start, s.end)}</span></li>`).join("")}
    </ul>
  `).join("");

  openModal(`
    <h2>Säsongshjulet</h2>
    <p class="intro">${formatLongDate(date)}</p>
    ${active.length
      ? `<p>Just nu är följande säsonger igång:</p>${sections}`
      : `<p>Ingen specifik svensk säsong är aktiv just nu — vinterns vila eller mellan blomningar.</p>`}
    <p class="dd-meta" style="margin-top:18px">Säsongerna är ungefärliga och baserade på normalår i Mellansverige. Norr om Dalälven brukar de skifta 1-2 veckor senare; söder om Skåne lika mycket tidigare.</p>
  `);
}

function dateRange(start, end) {
  return `${start[1]} ${MONTHS_SV[start[0]-1]} – ${end[1]} ${MONTHS_SV[end[0]-1]}`;
}

// ---------- Bondepraktikan ----------
function openBondeDeepDive(date) {
  const b = bondeForDate(date);
  openModal(`
    <h2>Bondepraktikan</h2>
    <p class="intro">${formatLongDate(date)}</p>
    ${b ? `<blockquote style="font-family:var(--font-serif);font-style:italic;font-size:18px;line-height:1.6;color:var(--ink);border-left:3px solid var(--gold);padding-left:18px;margin:18px 0">"${b.text}"</blockquote>` : ""}

    <h3>Om Bondepraktikan</h3>
    <p>Bondepraktikan är en svensk almanackalmanack med rötter från 1662, full av väderspomar, jordbruksråd och tideräkningar. Boken byggde på äldre tysk lore som var spridd i hela Europa under medeltiden, men förankrade reglerna i svensk klimat och namnsdagstradition.</p>
    <p>Spomarna är inte vetenskap — men de bevarar århundraden av bonderfarenhet. I många fall är reglerna förvånansvärt träffsäkra för svenska normalår, troligen eftersom de bygger på faktiska väderstatistiska samband.</p>

    <p class="dd-meta">"Bondepraktikan" trycktes första gången av Henrich Keyser i Stockholm 1662 och kom i nya upplagor ända fram till 1900-talet. Den var länge nästan obligatorisk i bondhushållen.</p>
  `);
}

// ---------- Dagens ord ----------
function openWordDeepDive(date) {
  const w = wordForDate(date);
  openModal(`
    <h2>Dagens svenska ord</h2>
    <p class="intro">${formatLongDate(date)}</p>
    <div style="text-align:center;padding:24px 0">
      <div style="font-family:var(--font-serif);font-size:48px;font-weight:700;color:var(--ink);letter-spacing:-1px">${w.word}</div>
    </div>
    <h3>Betydelse</h3>
    <p>${w.def}</p>

    <h3>Om vårt språkarv</h3>
    <p>Många svenska ord har trillat ur vardagsspråket de senaste 100 åren — vissa för att tekniken förändrats, andra för att vi börjat säga något annat. CalPal lyfter ett bortglömt ord per dag för att hålla språkminnet vid liv.</p>
    <p class="dd-meta">Källor: Svenska Akademiens ordbok, dialektordböcker, äldre almanackor och bondalmanackor från 1800-1900-talet.</p>
  `);
}

// ---------- Counter (hjärtslag + nedräkningar) ----------
function openCounter() {
  const stored = localStorage.getItem("calpal:birth");
  openModal(`
    <h2>Räknare & milstolpar</h2>
    <p>Ange din födelsedag så räknar vi ut din livsstatistik och visar nedräkning till nästa milstolpe.</p>
    <label class="label">Födelsedatum</label>
    <input type="date" id="birthInput" value="${stored || ""}" max="${new Date().toISOString().split("T")[0]}" />
    <button class="btn-primary" id="calcBtn">Räkna ut</button>
    <div id="lifeStatsOut"></div>

    <h3>Nedräkning till nästa fester</h3>
    <div id="milestonesOut"></div>
  `);
  document.getElementById("calcBtn").addEventListener("click", recalcLifeStats);
  if (stored) recalcLifeStats();
  renderMilestones();
}

function recalcLifeStats() {
  const v = document.getElementById("birthInput").value;
  if (!v) return;
  localStorage.setItem("calpal:birth", v);
  const birth = new Date(v);
  const stats = lifeStats(birth);
  if (!stats) {
    document.getElementById("lifeStatsOut").innerHTML = `<p>Datumet ligger i framtiden — du finns inte än!</p>`;
    return;
  }
  const next = stats.nextRoundDay;
  document.getElementById("lifeStatsOut").innerHTML = `
    <div class="hb-grid">
      <div class="hb-stat"><span class="num">${formatNumber(stats.heartbeats)}</span><span class="label">Hjärtslag</span></div>
      <div class="hb-stat"><span class="num">${formatNumber(stats.days)}</span><span class="label">Dagar levt</span></div>
      <div class="hb-stat"><span class="num">${formatNumber(stats.weeks)}</span><span class="label">Veckor</span></div>
      <div class="hb-stat"><span class="num">${formatNumber(stats.breaths)}</span><span class="label">Andetag</span></div>
      <div class="hb-stat"><span class="num">${stats.years}</span><span class="label">År</span></div>
      <div class="hb-stat"><span class="num">${formatNumber(stats.smiles)}</span><span class="label">Antagna leenden</span></div>
    </div>
    ${next ? `<p style="margin-top:16px;color:var(--ink-soft)">
        Nästa milstolpe: <strong style="color:var(--accent)">${formatNumber(next.value)} dagar levt</strong>
        — ${next.daysAway} dagar kvar (${formatDateSv(next.date)}).
      </p>` : ""}
    <p style="font-size:12px;color:var(--ink-faint);margin-top:8px">
      Beräkningar utgår från 75 hjärtslag/min och 16 andetag/min — medeltal för vuxen.
    </p>
  `;
}

function renderMilestones() {
  const list = upcomingMilestones(new Date());
  document.getElementById("milestonesOut").innerHTML = list.map(m => `
    <div class="history-entry" style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <strong>${m.name}</strong>
        <div class="sub">${formatDateSv(m.date)}</div>
      </div>
      <div style="font-family:var(--font-serif);font-size:22px;color:var(--accent);">
        ${m.days} <span style="font-size:11px;color:var(--ink-faint);">dag${m.days === 1 ? "" : "ar"}</span>
      </div>
    </div>
  `).join("");
}

// ---------- Klämdags-radar ----------
function openSqueeze() {
  const year = new Date().getFullYear();
  const next = year + 1;
  const sq1 = squeezeDaysForYear(year);
  const sq2 = squeezeDaysForYear(next);
  const holidays1 = holidaysForYear(year);
  const holidays2 = holidaysForYear(next);

  const renderList = (sqs, hols, y) => {
    if (!sqs.length) return `<p>Inga klämdagar identifierade för ${y}.</p>`;
    return `<ul class="squeeze-list">${sqs.map(s => {
      const strat = strategyFor(s, hols);
      return `<li class="squeeze-item">
        <div class="title">${formatSqueezeDay(s)}</div>
        <div class="sub">${s.context}</div>
        <div class="strategy">Ta ${strat.semesterDays} semesterdag → ${strat.totalDays} dagar ledigt totalt</div>
      </li>`;
    }).join("")}</ul>`;
  };

  openModal(`
    <h2>Klämdags-radar</h2>
    <p>Vardagar inklämda mellan röda dagar eller helger — perfekta att lägga semester på.</p>
    <h3>${year}</h3>
    ${renderList(sq1, holidays1, year)}
    <h3>${next}</h3>
    ${renderList(sq2, holidays2, next)}
  `);
}

// ---------- Om CalPal ----------
function openAbout() {
  openModal(`
    <h2>Om CalPal</h2>
    <p class="intro">En svensk kalender med själ — byggd för att uppmärksamma både det vardagliga och det vackra i Sveriges almanackatraditioner.</p>

    <h3>Vad finns här?</h3>
    <p><strong>Grund:</strong> månadskalender med ISO-veckonummer, helgdagar (röda dagar), namnsdagar, flaggdagar och temadagar.</p>
    <p><strong>Astronomi:</strong> månfas, soluppgång, solnedgång, dagsljus och hur det förändras dag för dag.</p>
    <p><strong>Säsong:</strong> svampar, bär, jakt, pollen och fågelflytt — visualiserat i ett årshjul.</p>
    <p><strong>Historia & kultur:</strong> "På denna dag" i svensk och världshistoria; mattradition, Nobel, Eurovision, Vasalopp.</p>
    <p><strong>Det unika:</strong> Bondepraktikans väderspomar, gamla almanack-citat, dagens bortglömda svenska ord, hjärtslagsräknare, klämdagar med semesterstrategier.</p>

    <div class="ekeron-card">
      <div class="ek-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 7v5l3 2"/>
        </svg>
      </div>
      <div>
        <h4>Ekeron — mil-koll för leasingbil</h4>
        <p>När du leasar en bil får du en max körsträcka för perioden. Ekeron räknar ut <em>hur många mil du borde ha kört idag</em> för att ligga i fas mot återlämningsdagen — så du slipper otrevliga straffavgifter när bilen ska lämnas tillbaka.</p>
        <a class="ek-link" href="https://ekeron.com/" target="_blank" rel="noopener">
          Räkna på ekeron.com
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>

    <h3>Bygd för GitHub Pages</h3>
    <p>Hela CalPal är ren HTML/CSS/JS utan beroenden. Push till en GitHub-repo, aktivera Pages, klar.</p>

    <h3>Tangentbord</h3>
    <p>
      <span class="tag">←</span> föregående månad ·
      <span class="tag">→</span> nästa månad ·
      <span class="tag">T</span> hoppa till idag ·
      <span class="tag">Esc</span> stäng dialog
    </p>

    <p style="margin-top:24px;font-style:italic;color:var(--ink-faint)">
      "Tomas drar dagen ur säcken." — gammal svensk almanackvisdom
    </p>
  `);
}
