// ============================================================
// wikiOnThisDay.js — hämtar "on this day" från Wikipedia REST API
// CORS-vänligt, ingen nyckel behövs
// ============================================================

const API = "https://en.wikipedia.org/api/rest_v1/feed/onthisday";
const cache = new Map();

async function fetchSection(type, month, day) {
  const key = `${type}-${month}-${day}`;
  if (cache.has(key)) return cache.get(key);
  try {
    const url = `${API}/${type}/${month}/${day}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const items = data[type] || data.events || data.births || data.deaths || [];
    cache.set(key, items);
    return items;
  } catch {
    return [];
  }
}

export async function fetchOnThisDay(date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  // Fetcha events, births, deaths parallellt
  const [events, births, deaths] = await Promise.all([
    fetchSection("events", mm, dd),
    fetchSection("births", mm, dd),
    fetchSection("deaths", mm, dd)
  ]);

  return {
    events: events.slice(0, 12).map(e => ({
      year: e.year,
      text: e.text,
      title: e.pages?.[0]?.title?.replace(/_/g, " "),
      url: e.pages?.[0]?.content_urls?.desktop?.page,
      image: e.pages?.[0]?.thumbnail?.source
    })),
    births: births.slice(0, 8).map(p => ({
      year: p.year,
      text: p.text,
      title: p.pages?.[0]?.title?.replace(/_/g, " "),
      url: p.pages?.[0]?.content_urls?.desktop?.page,
      image: p.pages?.[0]?.thumbnail?.source
    })),
    deaths: deaths.slice(0, 6).map(p => ({
      year: p.year,
      text: p.text,
      title: p.pages?.[0]?.title?.replace(/_/g, " "),
      url: p.pages?.[0]?.content_urls?.desktop?.page,
      image: p.pages?.[0]?.thumbnail?.source
    }))
  };
}
