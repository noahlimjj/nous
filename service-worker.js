// Minimal service worker v15
const CACHE_NAME = 'nous-v15-2025-11-03';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Don't intercept any requests
self.addEventListener('fetch', () => {
  return;
});
