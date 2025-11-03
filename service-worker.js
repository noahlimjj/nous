const CACHE_NAME = 'nous-v9-PERSISTENCE-UPDATE-2025-11-03';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.js',
  '/style.css',
  '/tailwind-output.css',
  '/config.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Service Worker: Cache failed', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip caching for non-http(s) requests (chrome-extension, etc)
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Skip caching for POST/PUT/DELETE requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // Skip service worker for external resources (Firebase, fonts, etc.)
  // Let browser handle these directly for better performance
  const isExternal = url.origin !== self.location.origin;

  if (isExternal) {
    // Don't intercept external requests - let browser handle them
    return;
  }

  // CACHE-FIRST strategy for local files (instant loading)
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If we have it cached, return immediately
        if (cachedResponse) {
          // Update cache in background (stale-while-revalidate)
          fetch(event.request)
            .then((response) => {
              if (response && response.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, response.clone());
                });
              }
            })
            .catch(() => {
              // Ignore network errors when updating cache
            });

          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Cache successful responses
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          });
      })
      .catch(() => {
        // If everything fails, try cache one more time
        return caches.match(event.request);
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
