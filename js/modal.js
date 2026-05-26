// ============================================================
// modal.js — modaler för räknare, klämdagar, om
// ============================================================

import { lifeStats, formatNumber, formatDateSv, upcomingMilestones } from "./counters.js";
import { squeezeDaysForYear, formatSqueezeDay, strategyFor } from "./squeezeDays.js";
import { holidaysForYear } from "./holidays.js";

const modal = () => document.getElementById("modal");
const modalBody = () => document.getElementById("modalBody");

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

function openModal(html) {
  modalBody().innerHTML = html;
  modal().hidden = false;
}

function closeModal() {
  modal().hidden = true;
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
    <p>CalPal är en svensk kalender med själ — byggd för att uppmärksamma både det vardagliga och det vackra i Sveriges almanackatraditioner.</p>

    <h3>Vad finns här?</h3>
    <p><strong>Grund:</strong> månadskalender med ISO-veckonummer, helgdagar (röda dagar), namnsdagar, flaggdagar och temadagar.</p>
    <p><strong>Astronomi:</strong> månfas, soluppgång, solnedgång, dagsljus och hur det förändras dag för dag.</p>
    <p><strong>Säsong:</strong> svampar, bär, jakt, pollen och fågelflytt — visualiserat i ett årshjul.</p>
    <p><strong>Historia & kultur:</strong> "På denna dag" i svensk och världshistoria; mattradition, Nobel, Eurovision, Vasalopp.</p>
    <p><strong>Det unika:</strong> Bondepraktikans väderspomar, gamla almanack-citat, dagens bortglömda svenska ord, hjärtslagsräknare, klämdagar med semesterstrategier.</p>

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
