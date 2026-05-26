// ============================================================
// pollen.js — laddar och presenterar svensk pollenprognos
// från Pollenrapporten.se (via daglig GitHub Action)
// ============================================================

let cache = null;
let loadPromise = null;

const LEVEL_LABEL = {
  0: "Ingen", 1: "Låg", 2: "Låg-måttlig", 3: "Måttlig",
  4: "Måttlig-hög", 5: "Hög", 6: "Mycket hög"
};
const LEVEL_COLOR = {
  0: "var(--ink-faint)",
  1: "#a3c884",
  2: "#cfb952",
  3: "#e0a830",
  4: "#d97a3d",
  5: "#b53737",
  6: "#7a1a1a"
};

// De mest relevanta pollentyperna för allergikere
const PRIORITY_ORDER = ["Björk", "Gräs", "Gråbo", "Ek", "Al", "Hassel", "Sälg och viden", "Bok", "Alm", "Malörtsambrosia"];

export async function loadPollen() {
  if (cache) return cache;
  if (loadPromise) return loadPromise;
  loadPromise = fetch("data/pollen.json", { cache: "no-cache" })
    .then(r => r.ok ? r.json() : null)
    .then(d => { cache = d; return d; })
    .catch(() => null);
  return loadPromise;
}

export function pollenForDate(data, date) {
  if (!data || data.offSeason || !data.days?.length) return null;
  const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
  // Hitta närmaste dag i prognosen
  const exact = data.days.find(d => d.date === key);
  if (exact) return exact;
  // Annars senaste tillgängliga om datumet ligger inom prognos-fönstret
  const sorted = [...data.days].sort((a,b) => a.date.localeCompare(b.date));
  if (key < sorted[0].date || key > sorted[sorted.length-1].date) return null;
  return sorted[sorted.length-1];
}

// Returnerar HTML för pollen-stripen i Säsongshjul-kortet
export function renderPollenStrip(data, date) {
  if (!data) {
    return `<div class="pollen-strip pollen-empty">Pollendata laddas inte än.</div>`;
  }
  if (data.offSeason) {
    return `<div class="pollen-strip pollen-empty">Utanför pollensäsong — Pollenrapporten publicerar mars–oktober.</div>`;
  }
  const day = pollenForDate(data, date);
  if (!day) {
    return `<div class="pollen-strip pollen-empty">Ingen prognos för detta datum (gäller ${data.forecastStart}–${data.forecastEnd}).</div>`;
  }

  const active = PRIORITY_ORDER
    .filter(name => day.values[name] !== undefined && day.values[name] > 0)
    .slice(0, 4)
    .map(name => {
      const lvl = day.values[name];
      return `<span class="pollen-pill" title="${name}: ${LEVEL_LABEL[lvl]} (nivå ${lvl}/6)">
        <span class="pollen-dot" style="background:${LEVEL_COLOR[lvl]}"></span>
        ${name}
        <span class="pollen-bars" aria-label="nivå ${lvl} av 6">${bars(lvl)}</span>
      </span>`;
    });

  if (!active.length) {
    return `<div class="pollen-strip pollen-empty">🌤 Idag är luften ren — alla pollensorter på nivå 0.</div>`;
  }

  return `
    <div class="pollen-strip">
      <div class="pollen-header">
        <span class="pollen-label">Pollen idag</span>
        <span class="pollen-region">${data.region}</span>
      </div>
      <div class="pollen-list">${active.join("")}</div>
    </div>
  `;
}

function bars(level) {
  let html = "";
  for (let i = 1; i <= 6; i++) {
    const active = i <= level;
    html += `<span class="bar ${active ? "on" : ""}" style="${active ? `background:${LEVEL_COLOR[level]}` : ""}"></span>`;
  }
  return html;
}

// Full prognos-tabell för djupdykning-modal
export function renderPollenFullForecast(data, date) {
  if (!data || data.offSeason || !data.days?.length) return "";

  const pollenNames = new Set();
  data.days.forEach(d => Object.keys(d.values).forEach(n => pollenNames.add(n)));
  const orderedNames = PRIORITY_ORDER.filter(n => pollenNames.has(n))
    .concat([...pollenNames].filter(n => !PRIORITY_ORDER.includes(n)));

  const header = `<tr><th></th>${data.days.map(d => `<th>${formatShortDate(d.date)}</th>`).join("")}</tr>`;

  const rows = orderedNames.map(name => {
    const cells = data.days.map(d => {
      const lvl = d.values[name] ?? 0;
      return `<td title="${LEVEL_LABEL[lvl]}" style="background:${lvl === 0 ? "transparent" : LEVEL_COLOR[lvl] + "33"};color:${lvl >= 4 ? LEVEL_COLOR[lvl] : "var(--ink)"};font-weight:${lvl >= 3 ? "700" : "500"}">${lvl}</td>`;
    }).join("");
    return `<tr><th>${name}</th>${cells}</tr>`;
  }).join("");

  return `
    <h3>Pollenprognos — ${data.region}</h3>
    ${data.text ? `<p style="font-style:italic;color:var(--ink-soft);line-height:1.55">${data.text.split("\r\n\r\n").map(p => `<span>${p}</span>`).join("<br/><br/>")}</p>` : ""}
    <table class="pollen-table">
      <thead>${header}</thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="dd-meta" style="margin-top:14px">Skala 0-6: ${Object.entries(LEVEL_LABEL).map(([n,l]) => `<span style="color:${LEVEL_COLOR[n]};font-weight:600">${n} ${l}</span>`).join(" · ")}</p>
    <p class="dd-meta">Källa: <a href="https://pollenrapporten.se/" target="_blank" rel="noopener">Pollenrapporten.se</a> (Naturhistoriska Riksmuseet) — uppdateras dagligen.</p>
  `;
}

function formatShortDate(iso) {
  const [, m, d] = iso.split("-");
  return `${parseInt(d)}/${parseInt(m)}`;
}
