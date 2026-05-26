// ============================================================
// seasonWheel.js — kompakt säsongshjul vid sidan av legend
// ============================================================

import { SEASONS, categoryColor, seasonsActive } from "./seasonal.js";
import { ICONS } from "./icons.js";

const CATEGORIES = ["svamp","bär","jakt","pollen","fågel"];
const CAT_RADII = {
  "svamp":  { inner: 72, outer: 84 },
  "bär":    { inner: 58, outer: 70 },
  "pollen": { inner: 44, outer: 56 },
  "fågel":  { inner: 30, outer: 42 },
  "jakt":   { inner: 86, outer: 98 }
};

export function renderSeasonWheel(container, date) {
  const cx = 100, cy = 100, r = 100;
  const arcs = [];

  for (const s of SEASONS) {
    const start = dayOfYearFrom(s.start[0], s.start[1]);
    const end = dayOfYearFrom(s.end[0], s.end[1]);
    const rad = CAT_RADII[s.category] || { inner: 50, outer: 60 };

    if (start <= end) {
      arcs.push(arc(cx, cy, rad.inner, rad.outer, start, end, categoryColor(s.category)));
    } else {
      arcs.push(arc(cx, cy, rad.inner, rad.outer, start, 365, categoryColor(s.category)));
      arcs.push(arc(cx, cy, rad.inner, rad.outer, 0, end, categoryColor(s.category)));
    }
  }

  const today = (date - new Date(date.getFullYear(), 0, 1)) / 86400000;
  const todayAngle = dayToAngle(today);
  const tx = cx + Math.cos(todayAngle) * (r + 4);
  const ty = cy + Math.sin(todayAngle) * (r + 4);
  const lineX2 = cx + Math.cos(todayAngle) * 22;
  const lineY2 = cy + Math.sin(todayAngle) * 22;

  const monthLabels = [];
  for (let m = 0; m < 12; m++) {
    const ang = dayToAngle(dayOfYearFrom(m + 1, 1) + 15);
    const lx = cx + Math.cos(ang) * (r + 11);
    const ly = cy + Math.sin(ang) * (r + 11) + 3;
    const lbl = ["J","F","M","A","M","J","J","A","S","O","N","D"][m];
    monthLabels.push(`<text x="${lx}" y="${ly}" text-anchor="middle" font-size="8" fill="#a0907d" font-weight="600">${lbl}</text>`);
  }

  const active = seasonsActive(date);
  const activeNames = active.map(s => s.name).slice(0, 4);

  container.className = "card";
  container.innerHTML = `
    <div class="card-head">
      <span class="card-icon green">${ICONS.leaf}</span>
      <h4 class="card-title">Säsongshjulet</h4>
    </div>
    <div class="wheel-row">
      <svg class="wheel-svg" viewBox="0 0 220 220">
        ${arcs.join("\n")}
        <circle cx="${cx}" cy="${cy}" r="16" fill="#faf5e9" stroke="#e3dac7"/>
        <text x="${cx}" y="${cy - 1}" text-anchor="middle" font-size="8" fill="#a0907d" font-weight="600">DAG</text>
        <text x="${cx}" y="${cy + 10}" text-anchor="middle" font-size="12" fill="#271c14" font-weight="700">${Math.round(today)}</text>
        ${monthLabels.join("\n")}
        <line x1="${lineX2}" y1="${lineY2}" x2="${tx}" y2="${ty}" stroke="#271c14" stroke-width="2"/>
        <circle cx="${tx}" cy="${ty}" r="4" fill="#a87233" stroke="#fffdf8" stroke-width="2"/>
      </svg>
      <div class="wheel-side">
        <div class="wheel-legend">
          ${CATEGORIES.map(c => `
            <span style="color:${categoryColor(c)}">
              <span class="swatch" style="background:${categoryColor(c)}"></span>
              ${capitalize(c)}
            </span>
          `).join("")}
        </div>
        ${active.length ? `
          <div class="wheel-now">
            <strong>Just nu:</strong> ${activeNames.join(", ")}${active.length > 4 ? "…" : ""}
          </div>` : ""}
      </div>
    </div>
  `;
}

function dayOfYearFrom(m, d) {
  return (new Date(2024, m - 1, d) - new Date(2024, 0, 1)) / 86400000;
}

function dayToAngle(day) {
  return (day / 366) * 2 * Math.PI - Math.PI / 2;
}

function arc(cx, cy, rIn, rOut, startDay, endDay, color) {
  const a0 = dayToAngle(startDay);
  const a1 = dayToAngle(endDay);
  const large = (a1 - a0) > Math.PI ? 1 : 0;
  const x0o = cx + Math.cos(a0) * rOut, y0o = cy + Math.sin(a0) * rOut;
  const x1o = cx + Math.cos(a1) * rOut, y1o = cy + Math.sin(a1) * rOut;
  const x1i = cx + Math.cos(a1) * rIn,  y1i = cy + Math.sin(a1) * rIn;
  const x0i = cx + Math.cos(a0) * rIn,  y0i = cy + Math.sin(a0) * rIn;
  return `<path d="M ${x0o} ${y0o}
                  A ${rOut} ${rOut} 0 ${large} 1 ${x1o} ${y1o}
                  L ${x1i} ${y1i}
                  A ${rIn} ${rIn} 0 ${large} 0 ${x0i} ${y0i} Z"
                  fill="${color}" opacity="0.75"/>`;
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
