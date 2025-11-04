// Minimal, bulletproof service worker - NO CACHING to avoid errors
const CACHE_NAME = 'nous-v12-NOCACHE-2025-11-03';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clear ALL old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// NO fetch interception - let everything go through normally
self.addEventListener('fetch', (event) => {
  return;
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
