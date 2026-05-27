// ============================================================
// nasaApod.js — laddar NASA Astronomy Picture of the Day
// (uppdateras dagligen via GitHub Action)
// ============================================================

let cache = null;
let loadPromise = null;

export async function loadApod() {
  if (cache) return cache;
  if (loadPromise) return loadPromise;
  loadPromise = fetch("data/nasa-apod.json", { cache: "no-cache" })
    .then(r => r.ok ? r.json() : null)
    .then(d => { cache = d; return d; })
    .catch(() => null);
  return loadPromise;
}

export function renderApod(data) {
  if (!data) return "";

  const media = data.mediaType === "image"
    ? `<img class="apod-img" src="${data.url}" alt="${escapeAttr(data.title)}" loading="lazy"/>`
    : `<a href="${data.url}" target="_blank" rel="noopener" class="apod-video-link">Se dagens astronomivideo på NASA →</a>`;

  // Korta ner förklaringen till rimlig längd
  let exp = data.explanation || "";
  if (exp.length > 320) exp = exp.slice(0, 317).trim() + "…";

  return `
    <div class="apod">
      <div class="apod-media">${media}</div>
      <div class="apod-body">
        <div class="apod-title">${data.title}</div>
        <p class="apod-exp">${exp}</p>
        <a class="apod-link" href="https://apod.nasa.gov/apod/" target="_blank" rel="noopener">NASA Astronomy Picture of the Day →</a>
        ${data.copyright ? `<div class="apod-credit">© ${data.copyright.trim()}</div>` : ""}
      </div>
    </div>
  `;
}

function escapeAttr(s) {
  return (s || "").replace(/"/g, "&quot;");
}
