// Legacy service worker v16 - deprecated, use service-worker-v18.js instead
// This file clears old caches and does nothing else
// The registration code in index.html will handle upgrading to v18

const CACHE_NAME = 'nous-v16-2025-11-03-deprecated';

self.addEventListener('install', () => {
  console.log('[SW v16] Installing (deprecated - use v18)');
  self.skipWaiting();
});

self.addEventListener('activate', async (event) => {
  console.log('[SW v16] Activating (deprecated - will be replaced by v18)');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== 'nous-v18-phase2-2025-11-06') {
            console.log('[SW v16] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW v16] Old caches cleared (keeping v18 cache)');
      return self.clients.claim();
    })
  );
});

// No fetch handler - browser handles all requests
console.log('[SW v16] Loaded - will be replaced by v18 on next page load');
