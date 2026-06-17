const CACHE_NAME = 'squatmate-v3'; // Incremented to v3 to break old mobile caches
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// The install event fires when the browser detects a new service worker file
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // Forces the waiting service worker to become active immediately
});

// The activate event is the perfect place to clean up old, outdated caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Removing old cache tier:', key);
            return caches.delete(key); // Deletes squatmate-v2 and squatmate-v1
          }
        })
      );
    }).then(() => self.clients.claim()) // Forces the new worker to take control of all open tabs
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
