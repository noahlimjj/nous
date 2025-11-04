// Minimal, bulletproof service worker - NO CACHING to avoid errors
const CACHE_NAME = 'nous-v11-NOCACHE-2025-11-03';

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing (no cache)');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating');
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
// This prevents ALL service worker errors
self.addEventListener('fetch', (event) => {
  // Do nothing - let browser handle all requests
  return;
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
