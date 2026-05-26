// ============================================================
// fetch-pollen.js
// Hämtar pollenprognos från Pollenrapporten.se (Naturhistoriska
// Riksmuseet, Palynologiska laboratoriet) och sparar som
// data/pollen.json. Körs dagligen via GitHub Action.
// ============================================================

import { writeFile, mkdir } from "fs/promises";

const REGION_NAME = process.env.POLLEN_REGION || "Stockholm";
const API = "https://api.pollenrapporten.se/v1";

async function main() {
  // 1. Hämta lista över pollentyper
  const typesData = await fetchJson(`${API}/pollen-types`);
  const typeMap = Object.fromEntries(
    typesData.items.map(t => [t.id, { name: t.name, hasForecasts: t.hasForecasts }])
  );

  // 2. Hitta regionens ID
  const regionsData = await fetchJson(`${API}/regions`);
  const region = regionsData.items.find(r => r.name === REGION_NAME);
  if (!region) throw new Error(`Region '${REGION_NAME}' hittades inte`);

  // 3. Hämta aktuell prognos
  const forecastData = await fetchJson(
    `${API}/forecasts?region_id=${region.id}&current=true`
  );

  const forecast = forecastData.items[0];

  // Off-säsong: API:t returnerar isEndOfSeason eller tom lista
  const offSeason = !forecast || forecast.isEndOfSeason;

  // 4. Gruppera nivåer per datum
  const byDate = {};
  if (forecast && forecast.levelSeries) {
    for (const entry of forecast.levelSeries) {
      const date = entry.time.split("T")[0];
      const typeInfo = typeMap[entry.pollenId];
      // Hoppa över typer som inte har prognos (svampar etc.)
      if (!typeInfo || !typeInfo.hasForecasts) continue;
      byDate[date] = byDate[date] || {};
      byDate[date][typeInfo.name] = entry.level;
    }
  }

  const days = Object.entries(byDate)
    .map(([date, values]) => ({ date, values }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const output = {
    fetchedAt: new Date().toISOString(),
    region: REGION_NAME,
    offSeason,
    forecastStart: forecast?.startDate || null,
    forecastEnd: forecast?.endDate || null,
    text: forecast?.text || null,
    days,
    source: "https://pollenrapporten.se/ (Naturhistoriska Riksmuseet)",
    levels: {
      0: "Ingen",
      1: "Låg",
      2: "Låg-måttlig",
      3: "Måttlig",
      4: "Måttlig-hög",
      5: "Hög",
      6: "Hög-mycket hög"
    }
  };

  await mkdir("data", { recursive: true });
  await writeFile("data/pollen.json", JSON.stringify(output, null, 2));
  console.log(
    `Skrev pollenprognos för ${REGION_NAME}: ${days.length} dagar` +
    (offSeason ? " (utanför säsong)" : "")
  );
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "CalPal/1.0 (https://github.com/SBafG/calpal)" }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} för ${url}`);
  return res.json();
}

main().catch(err => {
  console.error("Fel vid hämtning:", err.message);
  process.exit(1);
});
