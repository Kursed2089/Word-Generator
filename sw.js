const CACHE_NAME = 'word-explorer-v1';
const ASSETS = [
  './',
  './index.html'
];

// Installs and caches structural page files locally
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Clears obsolete site resource versions
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepts connection errors and serves local cached index structure instantly
self.addEventListener('fetch', (e) => {
  // Pass API requests to Ollama and Dictionary directly through
  if (e.request.url.includes('/api/generate') || e.request.url.includes('api.dictionaryapi.dev')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
