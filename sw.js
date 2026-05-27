// ============================================================
// sw.js — Cal·Pal service worker (offline + installbar)
// HTML & data: network-first. Statiska resurser: stale-while-revalidate.
// ============================================================

const VERSION = "calpal-v1";
const SHELL = ["./", "./index.html", "./css/tokens.css", "./css/style.css", "./manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  let url;
  try { url = new URL(req.url); } catch { return; }
  // Låt externa anrop (Wikipedia, NASA-bilder) gå direkt till nätet
  if (url.origin !== self.location.origin) return;

  const putInCache = (r) => {
    if (r && r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return r;
  };

  // HTML / navigering: network-first med cache-fallback
  if (req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith("/")) {
    e.respondWith(
      fetch(req).then(putInCache).catch(() => caches.match(req).then(m => m || caches.match("./index.html")))
    );
    return;
  }

  // Datafiler (pollen, NASA): network-first
  if (url.pathname.includes("/data/")) {
    e.respondWith(fetch(req).then(putInCache).catch(() => caches.match(req)));
    return;
  }

  // Statiskt (js, css, bilder): stale-while-revalidate
  e.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req).then(putInCache).catch(() => cached);
      return cached || net;
    })
  );
});
