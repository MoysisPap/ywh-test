const CACHE_NAME = "safety-map-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css", // Ensure you add your CSS file here
  "/script.js", // Add your JS file here
  "/manifest.json",
  "/source/icon-192x192.png",
  "/source/icon-512x512.png",
  "/source/desktop-screenshot.png",
  "/source/mobile-screenshot.png",
  "/source/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
