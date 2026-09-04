/* Service worker : coque hors ligne.
   L'app doit rester consultable dans la médina, où la 4G tombe régulièrement. */
const VERSION = "marrakech-v1";
const COQUE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/style.css",
  "./assets/app.js",
  "./assets/data.js",
  "./assets/icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => Promise.allSettled(COQUE.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Tuiles de carte, photos, polices : cache d'abord, réseau ensuite, sans bloquer.
  const cacheable = /basemaps\.cartocdn\.com|upload\.wikimedia\.org|fonts\.(googleapis|gstatic)\.com/.test(url.host);
  if (cacheable) {
    e.respondWith(
      caches.open(VERSION + "-media").then(async c => {
        const hit = await c.match(req);
        const net = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  // Coque de l'app : réseau d'abord pour rester à jour, cache en secours.
  e.respondWith(
    fetch(req)
      .then(r => {
        const copie = r.clone();
        caches.open(VERSION).then(c => c.put(req, copie)).catch(() => {});
        return r;
      })
      .catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});
