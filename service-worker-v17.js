// Phase 1: Minimal caching - ONLY static app shell
// Version 17 - Safe, incremental offline support
const CACHE_VERSION = 'nous-v17-phase1-2025-11-06';
const CACHE_NAME = CACHE_VERSION;

// ONLY cache these critical static files
const APP_SHELL_FILES = [
  '/index.html',
  '/index.js',
  '/manifest.json'
  // Note: NOT caching config.js - it can change
  // Note: NOT caching Firebase URLs - always network
];

// Install: Pre-cache app shell
self.addEventListener('install', (event) => {
  console.log('[SW Phase 1] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW Phase 1] Caching app shell');
        // Use addAll which is atomic - either all succeed or all fail
        return cache.addAll(APP_SHELL_FILES);
      })
      .then(() => {
        console.log('[SW Phase 1] App shell cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch(err => {
        console.error('[SW Phase 1] Failed to cache app shell:', err);
        // Don't block installation if caching fails
        return self.skipWaiting();
      })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW Phase 1] Activating...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        // Delete old cache versions
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW Phase 1] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW Phase 1] Old caches cleared');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch: Network-first strategy with careful rules
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // RULE 1: NEVER cache non-GET requests (POST, PUT, DELETE)
  if (event.request.method !== 'GET') {
    console.log('[SW Phase 1] Skipping non-GET:', event.request.method, url.pathname);
    return; // Let browser handle it normally
  }

  // RULE 2: NEVER cache Firebase or external API requests
  if (url.hostname.includes('firebase') ||
      url.hostname.includes('googleapis') ||
      url.hostname.includes('firestore') ||
      url.hostname !== self.location.hostname) {
    console.log('[SW Phase 1] Skipping external URL:', url.hostname);
    return; // Let browser handle it normally
  }

  // RULE 3: NEVER cache config.js (it can change per environment)
  if (url.pathname.includes('config.js')) {
    console.log('[SW Phase 1] Skipping config.js - must be fresh');
    return; // Let browser handle it normally
  }

  // RULE 4: For app shell files - try cache first, then network
  if (APP_SHELL_FILES.some(file => url.pathname === file || url.pathname.endsWith(file))) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            console.log('[SW Phase 1] Serving from cache:', url.pathname);
            // Return cached version, but update cache in background
            fetch(event.request)
              .then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                  caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse);
                  });
                }
              })
              .catch(err => console.log('[SW Phase 1] Background update failed:', err));

            return cachedResponse;
          }

          // Not in cache, fetch from network
          console.log('[SW Phase 1] Not in cache, fetching:', url.pathname);
          return fetch(event.request)
            .then(networkResponse => {
              // Cache successful responses
              if (networkResponse && networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, responseClone);
                });
              }
              return networkResponse;
            });
        })
        .catch(err => {
          console.error('[SW Phase 1] Fetch failed:', url.pathname, err);
          // If both cache and network fail, we're truly offline
          throw err;
        })
    );
    return;
  }

  // RULE 5: For everything else, just use network (don't cache)
  console.log('[SW Phase 1] Network only:', url.pathname);
  // Don't call event.respondWith - let browser handle normally
});

// Message handler for manual cache clearing (debugging)
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('[SW Phase 1] Cache cleared by user request');
      })
    );
  }
});

console.log('[SW Phase 1] Service worker loaded');
