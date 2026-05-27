// ============================================================
// fetch-nasa-apod.js — hämtar NASA Astronomy Picture of the Day
// API-nyckel läses från NASA_API_KEY env (GitHub Secret)
// ============================================================

import { writeFile, mkdir } from "fs/promises";

const KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const API = `https://api.nasa.gov/planetary/apod?api_key=${KEY}`;

async function main() {
  const res = await fetch(API, {
    headers: { "User-Agent": "CalPal/1.0 (https://github.com/SBafG/calpal)" }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  // Behåll bara fält vi vill visa — håll storleken liten
  const slim = {
    fetchedAt: new Date().toISOString(),
    date: data.date,
    title: data.title,
    explanation: data.explanation,
    mediaType: data.media_type,
    url: data.url,
    hdurl: data.hdurl || null,
    copyright: data.copyright || null,
    source: "https://apod.nasa.gov/apod/"
  };

  await mkdir("data", { recursive: true });
  await writeFile("data/nasa-apod.json", JSON.stringify(slim, null, 2));
  console.log(`Skrev NASA APOD för ${slim.date}: ${slim.title}`);
}

main().catch(err => {
  console.error("Fel:", err.message);
  process.exit(1);
});
