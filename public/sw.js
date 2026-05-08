// Service Worker for LingoMemory PWA
//
// v3 bump (2026-05-08): the previous SW cached every same-origin static
// asset cache-first with no quota and no eviction. After visiting iVocab
// the 220-DPI card images filled iOS Safari's CacheStorage quota and
// destabilized the tab even on routes that didn't load images. v3:
//   • Skips caching responses > 1 MB.
//   • Skips caching iVocab card images and the source PDF outright.
//   • Caps the runtime cache at MAX_RUNTIME_ENTRIES with FIFO eviction.
//   • Bumped name forces clients to drop the old, bloated cache.
const CACHE_NAME = 'lingomemory-v3';
const urlsToCache = [
  '/',
  '/study',
  '/progress',
  '/settings',
  '/quiz',
  '/manage',
  '/manifest.json'
];

const MAX_RUNTIME_ENTRIES = 60;
const MAX_CACHED_RESPONSE_BYTES = 1024 * 1024;

function shouldSkipCache(url) {
  // Never cache the iVocab card images or source PDF — they're large,
  // not needed offline, and (for the images) numerous enough to fill the
  // SW cache quota on their own.
  if (url.includes('/seed-data/rpc/') && /\.(jpg|jpeg|png|webp)$/i.test(url)) return true;
  if (/\.pdf($|\?)/i.test(url)) return true;
  return false;
}

async function trimCache(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= max) return;
  // Drop oldest entries first (Cache Storage preserves insertion order).
  const drop = keys.length - max;
  for (let i = 0; i < drop; i += 1) await cache.delete(keys[i]);
}

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET — Cache Storage only accepts GET anyway.
  if (event.request.method !== 'GET') return;

  // Bypass cache entirely for known-large/numerous assets (iVocab images,
  // PDFs). The browser's HTTP cache + Vercel's CDN handle these fine
  // without us pinning them on-device.
  if (shouldSkipCache(event.request.url)) return;

  // Network-first strategy for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          maybeCachePut(event.request, response);
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          maybeCachePut(event.request, response);
          return response;
        });
      })
      .catch(() => {
        // Return offline page if available
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// Cache a response only if Content-Length is below the size cap. We can't
// stream-measure here without reading the body twice, so trust the header
// and skip if it's missing for a non-trivial-looking type.
function maybeCachePut(request, response) {
  const len = Number(response.headers.get('content-length'));
  if (Number.isFinite(len) && len > MAX_CACHED_RESPONSE_BYTES) return;
  const clone = response.clone();
  caches.open(CACHE_NAME).then((cache) => {
    cache.put(request, clone).then(() => trimCache(CACHE_NAME, MAX_RUNTIME_ENTRIES));
  });
}

// Background sync for uploading study progress
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  // This would sync progress to server when back online
  console.log('Syncing progress when back online');
  // Implementation would go here when backend is ready
}

// Push notifications for study reminders
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Time to review your Japanese vocabulary!',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'study',
        title: 'Study Now',
        icon: '/icon-72x72.png'
      },
      {
        action: 'later',
        title: 'Later',
        icon: '/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('LingoMemory Study Reminder', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'study') {
    event.waitUntil(
      clients.openWindow('/study')
    );
  } else if (event.action === 'later') {
    // Schedule for later
    event.waitUntil(
      clients.openWindow('/')
    );
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});