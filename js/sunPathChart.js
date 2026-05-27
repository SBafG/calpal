// ============================================================
// sunPathChart.js — visualiserar solens väg över dygnet
// + daglängdsgraf över hela månaden
// ============================================================

import { sunTimes, daylightMinutes } from "./astronomy.js";

// SOLENS VÄG ÖVER DYGNET
// 280x140 SVG, horisont vid y=120
export function buildSunPathSVG(date) {
  const W = 320, H = 160;
  const horizonY = 130;
  const sky = horizonY;
  const t = sunTimes(date);
  if (!t.sunrise || !t.sunset) {
    return `<svg viewBox="0 0 ${W} ${H}"><text x="${W/2}" y="${H/2}" text-anchor="middle" fill="#a0907d">Sol upp/ner saknas</text></svg>`;
  }

  // Bygg gradient för himlen från natt → gryning → dag → skymning → natt
  // X-positioner: 0=midnight, sunrise, noon, sunset, midnight
  const sunriseX = timeToX(t.sunrise, W);
  const sunsetX = timeToX(t.sunset, W);
  const noonX = (sunriseX + sunsetX) / 2;
  const daylightWidth = sunsetX - sunriseX;

  // Krympa lite för att lämna marginaler
  const arc = `M ${sunriseX} ${horizonY}
               Q ${noonX} ${horizonY - 110} ${sunsetX} ${horizonY}`;

  // Nuvarande solposition om dagen är idag
  const now = new Date();
  const isToday = now.toDateString() === date.toDateString();
  let sunMarker = "";
  if (isToday) {
    const nowFrac = (now - t.sunrise) / (t.sunset - t.sunrise);
    if (nowFrac >= 0 && nowFrac <= 1) {
      const x = sunriseX + nowFrac * daylightWidth;
      // Parabel y = h - sin(pi*frac)*h_max
      const y = horizonY - Math.sin(Math.PI * nowFrac) * 110;
      sunMarker = `
        <circle cx="${x}" cy="${y}" r="8" fill="#fbbf24" stroke="#fff" stroke-width="2"/>
        <line x1="${x}" y1="${y}" x2="${x}" y2="${horizonY}" stroke="#fbbf24" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5"/>
      `;
    }
  }

  // Tidsetiketter
  const timeLabels = [
    { x: sunriseX, label: formatTime(t.sunrise), text: "uppgång" },
    { x: noonX, label: formatTime(new Date(t.sunrise.getTime() + (t.sunset - t.sunrise) / 2)), text: "middag" },
    { x: sunsetX, label: formatTime(t.sunset), text: "nedgång" }
  ];

  // Twilight-band (skymning/gryning) — ungefär 30 min före soluppgång och efter solnedgång
  const twilightOffset = 18; // pixlar för cirka 30 min vid maj
  const dawnX = sunriseX - twilightOffset;
  const duskX = sunsetX + twilightOffset;

  return `
  <svg class="sun-path-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#dbeafe" stop-opacity="0.55"/>
        <stop offset="60%" stop-color="#fef9c3" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#fef3c7" stop-opacity="0.1"/>
      </linearGradient>
      <linearGradient id="twilightGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.85"/>
        <stop offset="35%" stop-color="#4a5b8a" stop-opacity="0.55"/>
        <stop offset="48%" stop-color="#fcd34d" stop-opacity="0.25"/>
        <stop offset="50%" stop-color="#fef3c7" stop-opacity="0"/>
        <stop offset="52%" stop-color="#fcd34d" stop-opacity="0.25"/>
        <stop offset="65%" stop-color="#4a5b8a" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0.85"/>
      </linearGradient>
    </defs>

    <!-- Natthimmel-band till vänster och höger -->
    <rect x="0" y="0" width="${dawnX}" height="${horizonY}" fill="#1e3a8a" opacity="0.18"/>
    <rect x="${duskX}" y="0" width="${W - duskX}" height="${horizonY}" fill="#1e3a8a" opacity="0.18"/>

    <!-- Gryning/skymning övergångar -->
    <rect x="${dawnX}" y="0" width="${sunriseX - dawnX}" height="${horizonY}" fill="#fcd34d" opacity="0.18"/>
    <rect x="${sunsetX}" y="0" width="${duskX - sunsetX}" height="${horizonY}" fill="#fcd34d" opacity="0.18"/>

    <!-- Dagsljus-band -->
    <rect x="${sunriseX}" y="0" width="${daylightWidth}" height="${horizonY}" fill="url(#skyGrad)"/>

    <!-- Solens väg (båge) -->
    <path d="${arc}" stroke="#d4a342" stroke-width="2" fill="none" stroke-dasharray="3 3" opacity="0.6"/>

    <!-- Horisontlinje -->
    <line x1="0" y1="${horizonY}" x2="${W}" y2="${horizonY}" stroke="#a87233" stroke-width="1.5"/>

    <!-- Tidsetiketter -->
    ${timeLabels.map(t => `
      <line x1="${t.x}" y1="${horizonY}" x2="${t.x}" y2="${horizonY + 4}" stroke="#a87233" stroke-width="1"/>
      <text x="${t.x}" y="${horizonY + 14}" text-anchor="middle" font-size="10" fill="#5b4d3f" font-weight="600">${t.label}</text>
      <text x="${t.x}" y="${horizonY + 26}" text-anchor="middle" font-size="9" fill="#a0907d">${t.text}</text>
    `).join("")}

    ${sunMarker}
  </svg>
  `;
}

// MÅNADSGRAF AV DAGLJUS
export function buildDaylightMonthChart(date) {
  const W = 320, H = 100;
  const monthDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const points = [];
  let minMin = Infinity, maxMin = -Infinity;

  for (let d = 1; d <= monthDays; d++) {
    const day = new Date(date.getFullYear(), date.getMonth(), d);
    const min = daylightMinutes(day);
    if (min == null) continue;
    points.push({ day: d, min });
    if (min < minMin) minMin = min;
    if (min > maxMin) maxMin = min;
  }
  if (!points.length) return "";

  // Skala — extra vänstermarginal för tim-etiketter
  const padL = 44, padX = 12, padY = 14;
  const innerW = W - padL - padX;
  const innerH = H - padY * 2;
  const range = Math.max(maxMin - minMin, 30);

  const xFor = (d) => padL + ((d - 1) / (monthDays - 1)) * innerW;
  const yFor = (m) => padY + innerH - ((m - minMin) / range) * innerH;

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(p.day).toFixed(1)} ${yFor(p.min).toFixed(1)}`).join(" ");

  // Highlight idag
  const todayPoint = points.find(p => p.day === date.getDate());
  let todayMarker = "";
  if (todayPoint) {
    const x = xFor(todayPoint.day);
    const y = yFor(todayPoint.min);
    todayMarker = `
      <line x1="${x}" y1="${padY}" x2="${x}" y2="${H - padY}" stroke="#0c2244" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.4"/>
      <circle cx="${x}" cy="${y}" r="4.5" fill="#d4a342" stroke="#fff" stroke-width="2"/>
    `;
  }

  // Area under kurvan
  const areaPath = path + ` L ${xFor(points[points.length-1].day).toFixed(1)} ${(H - padY).toFixed(1)} L ${xFor(points[0].day).toFixed(1)} ${(H - padY).toFixed(1)} Z`;

  // Etiketter min/max
  const fmt = (m) => `${Math.floor(m / 60)} t ${String(Math.round(m % 60)).padStart(2,"0")}`;

  return `
  <svg class="daylight-month-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dlMonthGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#d4a342" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#d4a342" stop-opacity="0.04"/>
      </linearGradient>
    </defs>
    <path d="${areaPath}" fill="url(#dlMonthGrad)"/>
    <path d="${path}" stroke="#d4a342" stroke-width="1.6" fill="none"/>
    ${todayMarker}
    <text x="${padL - 6}" y="${padY + 4}" font-size="9.5" fill="#a0907d" text-anchor="end">${fmt(maxMin)}</text>
    <text x="${padL - 6}" y="${H - padY + 3}" font-size="9.5" fill="#a0907d" text-anchor="end">${fmt(minMin)}</text>
    <text x="${padL}" y="${H - 2}" font-size="9" fill="#a0907d">1</text>
    <text x="${W - padX}" y="${H - 2}" font-size="9" fill="#a0907d" text-anchor="end">${monthDays}</text>
  </svg>
  `;
}

function timeToX(d, W) {
  const totalMin = d.getHours() * 60 + d.getMinutes();
  return (totalMin / 1440) * W;
}

function formatTime(d) {
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}
