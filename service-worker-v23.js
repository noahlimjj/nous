// Service Worker v22 - Improved manifest.json handling and mobile PWA support
// Fixed: Don't fail installation if manifest.json caching fails
const CACHE_VERSION = 'nous-v23-2025-12-24';
const CACHE_NAME = CACHE_VERSION;

// Critical files for offline functionality
// NOTE: manifest.json is NOT critical for offline app functionality
// It's only needed for installation, so we cache it separately
const CRITICAL_FILES = [
  '/index.html',
  '/index.js'
];

// Optional files that enhance experience but aren't critical
const OPTIONAL_FILES = [
  '/manifest.json',
  '/style.css',
  '/offline-handler.js',
  '/offline-timer-manager.js'
];

// Install: Pre-cache critical files
self.addEventListener('install', (event) => {
  console.log('[SW v22] Installing...');

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Cache critical files - must succeed
      try {
        console.log('[SW v22] Caching critical files...');
        await cache.addAll(CRITICAL_FILES);
        console.log('[SW v22] ✓ Critical files cached');
      } catch (error) {
        console.error('[SW v22] ✗ Failed to cache critical files:', error);
        // Don't throw - allow SW to install anyway
      }

      // Cache optional files - failures are OK
      for (const file of OPTIONAL_FILES) {
        try {
          const response = await fetch(file);
          if (response.ok) {
            await cache.put(file, response);
            console.log(`[SW v22] ✓ Cached optional file: ${file}`);
          } else {
            console.warn(`[SW v22] ⚠ Could not cache ${file}: HTTP ${response.status}`);
          }
        } catch (error) {
          console.warn(`[SW v22] ⚠ Failed to cache ${file}:`, error.message);
          // Continue with installation even if optional files fail
        }
      }

      console.log('[SW v22] Installation complete, activating...');
      return self.skipWaiting();
    })()
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW v22] Activating...');

  event.waitUntil(
    (async () => {
      // Delete old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW v22] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );

      console.log('[SW v22] ✓ Activated and taking control');
      return self.clients.claim();
    })()
  );
});

// Fetch: Smart caching strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (Firebase, Google APIs, etc.)
  if (url.hostname !== self.location.hostname) {
    return;
  }

  // Skip config.js - always fetch fresh
  if (url.pathname.includes('config.js')) {
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try network first
          const networkResponse = await fetch(request);

          // Cache successful responses
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
          }

          return networkResponse;
        } catch (error) {
          // Network failed - try cache
          console.log('[SW v22] Network failed, trying cache');

          // Try cached responses in order of preference
          const cachedResponse =
            await caches.match('/index.html') ||
            await caches.match('/') ||
            await caches.match(request);

          if (cachedResponse) {
            console.log('[SW v22] ✓ Serving from cache offline');
            return cachedResponse;
          }

          // Last resort: offline fallback page
          console.log('[SW v22] ⚠ No cache available, showing offline page');
          return new Response(
            createOfflinePage(),
            {
              headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-cache'
              }
            }
          );
        }
      })()
    );
    return;
  }

  // Handle app resources - cache first with network fallback
  const isCriticalFile = CRITICAL_FILES.some(file => url.pathname === file || url.pathname.endsWith(file));
  const isOptionalFile = OPTIONAL_FILES.some(file => url.pathname === file || url.pathname.endsWith(file));

  if (isCriticalFile || isOptionalFile) {
    event.respondWith(
      (async () => {
        // Try cache first
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
          // Update cache in background
          fetch(request)
            .then(networkResponse => {
              if (networkResponse && networkResponse.ok) {
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(request, networkResponse);
                });
              }
            })
            .catch(() => {
              // Silently fail background updates
            });

          return cachedResponse;
        }

        // Not in cache - fetch from network
        try {
          const networkResponse = await fetch(request);

          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
          }

          return networkResponse;
        } catch (error) {
          console.error('[SW v22] Failed to fetch:', url.pathname);
          throw error;
        }
      })()
    );
    return;
  }

  // Everything else - network only (images, icons, etc.)
  // Don't intercept - let browser handle normally
});

// Message handler
self.addEventListener('message', (event) => {
  console.log('[SW v22] Received message:', event.data);

  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('[SW v22] Cache cleared');
      })
    );
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_VERSION,
      timestamp: new Date().toISOString()
    });
  }
});

// Helper function to create offline fallback page
function createOfflinePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - Nous</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica', 'Arial', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .container {
      text-align: center;
      padding: 48px 32px;
      background: white;
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 400px;
      width: 100%;
    }
    .icon {
      font-size: 64px;
      margin-bottom: 24px;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(0.95); }
    }
    h1 {
      color: #2d3748;
      font-size: 28px;
      margin-bottom: 16px;
      font-weight: 600;
    }
    p {
      color: #718096;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 12px;
    }
    button {
      margin-top: 32px;
      padding: 16px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      width: 100%;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
    button:active {
      transform: translateY(0);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📴</div>
    <h1>You're Offline</h1>
    <p>Please check your internet connection.</p>
    <p>Once you're back online, reload to continue using Nous.</p>
    <button onclick="window.location.reload()">Try Again</button>
  </div>
</body>
</html>`;
}

console.log('[SW v22] Service worker loaded and ready');
console.log('[SW v22] Cache version:', CACHE_VERSION);
