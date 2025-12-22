// Phase 2: Full offline support with smart caching
// Version 18 - Enhanced offline capabilities
const CACHE_VERSION = 'nous-v18-phase2-2025-11-06';
const CACHE_NAME = CACHE_VERSION;

// Core app shell - MUST be cached for offline
const APP_SHELL_FILES = [
  '/index.html',
  '/index.js',
  '/manifest.json'
];

// Install: Pre-cache app shell
self.addEventListener('install', (event) => {
  console.log('[SW Phase 2] Installing v18...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW Phase 2] Caching app shell files');
        return cache.addAll(APP_SHELL_FILES);
      })
      .then(() => {
        console.log('[SW Phase 2] App shell cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch(err => {
        console.error('[SW Phase 2] Failed to cache:', err);
        return self.skipWaiting(); // Continue even if caching fails
      })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW Phase 2] Activating v18...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW Phase 2] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW Phase 2] Old caches cleared, taking control');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch: Smart caching strategy with offline support
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const request = event.request;

  // RULE 1: NEVER cache non-GET requests
  if (request.method !== 'GET') {
    console.log('[SW Phase 2] Skipping non-GET:', request.method, url.pathname);
    return;
  }

  // RULE 2: NEVER cache Firebase or external API requests
  if (url.hostname.includes('firebase') ||
      url.hostname.includes('googleapis') ||
      url.hostname.includes('firestore') ||
      url.hostname !== self.location.hostname) {
    console.log('[SW Phase 2] Skipping external:', url.hostname);
    return;
  }

  // RULE 3: NEVER cache config.js
  if (url.pathname.includes('config.js')) {
    console.log('[SW Phase 2] Skipping config.js');
    return;
  }

  // RULE 4: Handle navigation requests (for offline support)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Network success - cache the page
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Network failed - serve from cache
          console.log('[SW Phase 2] Network failed, serving from cache');

          // Try to get cached index.html
          let cachedResponse = await caches.match('/index.html');

          if (!cachedResponse) {
            // Try root
            cachedResponse = await caches.match('/');
          }

          if (!cachedResponse) {
            // Try the request URL itself
            cachedResponse = await caches.match(request.url);
          }

          if (cachedResponse) {
            console.log('[SW Phase 2] ✓ Serving cached page offline');
            return cachedResponse;
          }

          // Last resort: create a simple offline page
          console.log('[SW Phase 2] ⚠️ No cache found, creating offline fallback');
          return new Response(
            `<!DOCTYPE html>
            <html>
            <head>
              <title>Offline - Nous</title>
              <style>
                body {
                  font-family: system-ui, -apple-system, sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  background: #f8f9fa;
                }
                .container {
                  text-align: center;
                  padding: 40px;
                  background: white;
                  border-radius: 8px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                h1 { color: #5d6b86; }
                p { color: #6c757d; }
                button {
                  margin-top: 20px;
                  padding: 12px 24px;
                  background: #5d6b86;
                  color: white;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 16px;
                }
                button:hover { background: #4a5568; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>📴 You're Offline</h1>
                <p>Please check your internet connection.</p>
                <p>Once you're back online, reload to continue.</p>
                <button onclick="window.location.reload()">Try Again</button>
              </div>
            </body>
            </html>`,
            {
              headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-cache'
              }
            }
          );
        })
    );
    return;
  }

  // RULE 5: For app shell files - cache first, update in background
  if (APP_SHELL_FILES.some(file => url.pathname === file || url.pathname.endsWith(file))) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            console.log('[SW Phase 2] Serving from cache:', url.pathname);

            // Update cache in background (stale-while-revalidate)
            fetch(request)
              .then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                  caches.open(CACHE_NAME).then(cache => {
                    cache.put(request, networkResponse);
                    console.log('[SW Phase 2] Background update complete:', url.pathname);
                  });
                }
              })
              .catch(() => {
                // Silently fail background updates
              });

            return cachedResponse;
          }

          // Not in cache - fetch from network and cache it
          console.log('[SW Phase 2] Fetching from network:', url.pathname);
          return fetch(request)
            .then(networkResponse => {
              if (networkResponse && networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(request, responseClone);
                });
              }
              return networkResponse;
            })
            .catch(error => {
              console.error('[SW Phase 2] Network fetch failed:', url.pathname);
              throw error;
            });
        })
    );
    return;
  }

  // RULE 6: For everything else - network only (don't cache)
  // This includes images, icons, etc. that may change
  console.log('[SW Phase 2] Network only:', url.pathname);
  // Don't call event.respondWith - let browser handle normally
});

// Message handler for cache management
self.addEventListener('message', (event) => {
  console.log('[SW Phase 2] Received message:', event.data);

  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('[SW Phase 2] Cache cleared by request');
      })
    );
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

console.log('[SW Phase 2] Service worker v18 loaded and ready');
