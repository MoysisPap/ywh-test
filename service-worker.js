// Combined Service Worker

const CACHE_NAME = "combined-cache-v1";
const OFFLINE_PAGE = "offline.html"; // Replace with your offline fallback page

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
  OFFLINE_PAGE, // Ensure offline page is cached
];

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

// Cache the offline page and specified resources during installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Failed to cache:", error);
      });
    })
  );
});

// Activate event for cache management
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

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Network with cache fallback for navigation requests
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;
          if (preloadResp) return preloadResp;

          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          const cache = await caches.open(CACHE_NAME);
          return cache.match(OFFLINE_PAGE);
        }
      })()
    );
  } else {
    // Fallback to cache for other requests
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
