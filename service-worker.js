// Minimal service worker v16 - NO CACHING
const CACHE_NAME = 'nous-v16-2025-11-03';

self.addEventListener('install', () => {
  console.log('SW: Installing v16');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW: Activating v16');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('SW: Deleting cache', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('SW: All caches cleared');
      return self.clients.claim();
    })
  );
});

// No fetch handler = browser handles all requests with zero overhead
