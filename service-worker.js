const CACHE_NAME = "safety-map-cache-v1";
const urlsToCache = [
  "/ywh-test/",
  "/ywh-test/index.html",
  "/ywh-test/style.css",
  "/ywh-test/script.js",
  "/ywh-test/manifest.json",
  "/ywh-test/source/icon-192x192.png",
  "/ywh-test/source/icon-512x512.png",
  "/ywh-test/source/desktop-screenshot.png",
  "/ywh-test/source/mobile-screenshot.png",
  "/ywh-test/source/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Failed to cache:", error);
      });
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
