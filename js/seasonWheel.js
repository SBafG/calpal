// ============================================================
// seasonWheel.js — kompakt säsongshjul vid sidan av legend
// ============================================================

import { SEASONS, categoryColor, seasonsActive } from "./seasonal.js";
import { ICONS } from "./icons.js";
import { loadPollen, renderPollenStrip } from "./pollen.js";

const CATEGORIES = ["svamp","bär","jakt","pollen","fågel"];
const CAT_RADII = {
  "jakt":   { inner: 84, outer: 100 },
  "svamp":  { inner: 66, outer: 82 },
  "bär":    { inner: 48, outer: 64 },
  "pollen": { inner: 32, outer: 46 },
  "fågel":  { inner: 21, outer: 30 }
};

// Bygg själva SVG-grafiken — återanvänds av kort och modal
export function buildWheelSVG(date) {
  const cx = 100, cy = 100, r = 100;
  const arcs = [];

  // Gruppera per kategori — varje art får en egen delbana inom kategorins ring
  // så att överlappande arter (t.ex. flera jaktsäsonger) inte döljer varandra.
  const byCat = {};
  for (const s of SEASONS) { (byCat[s.category] ||= []).push(s); }

  for (const cat of CATEGORIES) {
    const list = byCat[cat];
    if (!list) continue;
    const band = CAT_RADII[cat] || { inner: 50, outer: 60 };
    const n = list.length;
    const laneH = (band.outer - band.inner) / n;
    const gap = n > 1 ? 0.9 : 0;

    list.forEach((s, i) => {
      const rIn = band.inner + i * laneH + gap / 2;
      const rOut = band.inner + (i + 1) * laneH - gap / 2;
      const start = dayOfYearFrom(s.start[0], s.start[1]);
      const end = dayOfYearFrom(s.end[0], s.end[1]);
      const title = `${s.name} · ${capitalize(s.category)} · ${rangeLabel(s)}`;
      const col = categoryColor(cat);

      if (start <= end) {
        arcs.push(arc(cx, cy, rIn, rOut, start, end, col, title));
      } else {
        arcs.push(arc(cx, cy, rIn, rOut, start, 365, col, title));
        arcs.push(arc(cx, cy, rIn, rOut, 0, end, col, title));
      }
    });
  }

  const today = (date - new Date(date.getFullYear(), 0, 1)) / 86400000;
  const todayAngle = dayToAngle(today);
  const tx = cx + Math.cos(todayAngle) * (r + 4);
  const ty = cy + Math.sin(todayAngle) * (r + 4);
  const lineX2 = cx + Math.cos(todayAngle) * 22;
  const lineY2 = cy + Math.sin(todayAngle) * 22;

  const MONTH_ABBR = ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
  const MONTH_FULL = ["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"];
  const monthLabels = [];
  for (let m = 0; m < 12; m++) {
    const ang = dayToAngle(dayOfYearFrom(m + 1, 1) + 15);
    const lx = cx + Math.cos(ang) * (r + 14);
    const ly = cy + Math.sin(ang) * (r + 14) + 2.5;
    monthLabels.push(`<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="7.5" fill="#a0907d" font-weight="600"><title>${MONTH_FULL[m]}</title>${MONTH_ABBR[m]}</text>`);
  }

  return `<svg class="wheel-svg" viewBox="-28 -28 256 256">
    ${arcs.join("\n")}
    <circle cx="${cx}" cy="${cy}" r="16" fill="#faf5e9" stroke="#e3dac7"/>
    <text x="${cx}" y="${cy - 1}" text-anchor="middle" font-size="8" fill="#a0907d" font-weight="600">DAG</text>
    <text x="${cx}" y="${cy + 10}" text-anchor="middle" font-size="12" fill="#271c14" font-weight="700">${Math.round(today)}</text>
    ${monthLabels.join("\n")}
    <line x1="${lineX2}" y1="${lineY2}" x2="${tx}" y2="${ty}" stroke="#271c14" stroke-width="2"/>
    <circle cx="${tx}" cy="${ty}" r="4" fill="#a87233" stroke="#fffdf8" stroke-width="2"/>
  </svg>`;
}

const CAT_DESC = {
  svamp: "kantarell, karl johan m.fl.",
  bär: "smultron, blåbär, lingon, hjortron",
  jakt: "älg, hare",
  pollen: "björk, gräs, gråbo",
  fågel: "tranor, storkar, svalor"
};

export function buildWheelLegend() {
  return `<div class="wheel-legend">
    ${CATEGORIES.map(c => `
      <span class="wl-item" title="${capitalize(c)}: ${CAT_DESC[c] || ""}">
        <span class="wl-swatch" style="background:${categoryColor(c)}"></span>
        <span class="wl-text"><span class="wl-name">${capitalize(c)}</span><span class="wl-desc">${CAT_DESC[c] || ""}</span></span>
      </span>
    `).join("")}
  </div>`;
}

export function renderSeasonWheel(container, date) {
  const active = seasonsActive(date);
  const activeNames = active.map(s => s.name).slice(0, 4);

  container.className = "card clickable";
  container.setAttribute("data-detail", "season");
  container.setAttribute("title", "Mer om säsongerna");
  container.innerHTML = `
    <span class="expand-hint" aria-hidden="true">+</span>
    <div class="card-head">
      <span class="card-icon green">${ICONS.leaf}</span>
      <h4 class="card-title">Säsongshjulet</h4>
    </div>
    <div class="wheel-row">
      ${buildWheelSVG(date)}
      <div class="wheel-side">
        ${buildWheelLegend()}
        ${active.length ? `
          <div class="wheel-now">
            <strong>Just nu:</strong> ${activeNames.join(", ")}${active.length > 4 ? "…" : ""}
          </div>` : ""}
      </div>
    </div>
    <div id="pollenStrip"></div>
  `;

  // Lazy-load pollendata och rendera asynkront
  loadPollen().then(pollenData => {
    const strip = container.querySelector("#pollenStrip");
    if (strip) strip.outerHTML = renderPollenStrip(pollenData, date);
  });
}

function dayOfYearFrom(m, d) {
  return (new Date(2024, m - 1, d) - new Date(2024, 0, 1)) / 86400000;
}

function dayToAngle(day) {
  return (day / 366) * 2 * Math.PI - Math.PI / 2;
}

function arc(cx, cy, rIn, rOut, startDay, endDay, color, title) {
  const a0 = dayToAngle(startDay);
  const a1 = dayToAngle(endDay);
  const large = (a1 - a0) > Math.PI ? 1 : 0;
  const x0o = cx + Math.cos(a0) * rOut, y0o = cy + Math.sin(a0) * rOut;
  const x1o = cx + Math.cos(a1) * rOut, y1o = cy + Math.sin(a1) * rOut;
  const x1i = cx + Math.cos(a1) * rIn,  y1i = cy + Math.sin(a1) * rIn;
  const x0i = cx + Math.cos(a0) * rIn,  y0i = cy + Math.sin(a0) * rIn;
  const titleEl = title ? `<title>${title}</title>` : "";
  return `<path class="wheel-arc" d="M ${x0o} ${y0o}
                  A ${rOut} ${rOut} 0 ${large} 1 ${x1o} ${y1o}
                  L ${x1i} ${y1i}
                  A ${rIn} ${rIn} 0 ${large} 0 ${x0i} ${y0i} Z"
                  fill="${color}" opacity="0.8">${titleEl}</path>`;
}

const MON_ABBR = ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
function rangeLabel(s) {
  return `${s.start[1]} ${MON_ABBR[s.start[0]-1]}–${s.end[1]} ${MON_ABBR[s.end[0]-1]}`;
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
