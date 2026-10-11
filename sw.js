const VERSION = "avatar-magico-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./privacy.html",
  "./404.html",
  "./css/styles.css",
  "./js/app.js",
  "./js/state.js",
  "./js/draw.js",
  "./js/ui.js",
  "./js/speech.js",
  "./js/storage.js",
  "./js/photo.js",
  "./manifest.webmanifest",
  "./robots.txt",
  "./assets/icons/favicon.svg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/fonts/nunito-latin-400-normal.woff2",
  "./assets/fonts/nunito-latin-700-normal.woff2",
  "./assets/fonts/nunito-latin-800-normal.woff2",
  "./assets/fonts/fredoka-latin-700-normal.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== VERSION)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match("./index.html"));
    }),
  );
});
