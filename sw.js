// 1. CHANGE THIS VERSION NUMBER TO TRIGGER AN UPDATE
// When you update your code on GitHub, change 'v1' to 'v2', then 'v3', etc.
const CACHE_NAME = 'refocus-v2'; 

const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  // Add your CSS or JS files here if you have them, e.g.:
  // './style.css',
  // './app.js'
];

// INSTALL EVENT
self.addEventListener('install', (e) => {
  // Force this new service worker to become the active one immediately
  self.skipWaiting(); 

  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// ACTIVATE EVENT (New!)
// This runs after the service worker is installed. It cleans up old caches.
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        // If the cache key doesn't match the current CACHE_NAME, delete it.
        if (key !== CACHE_NAME) {
          console.log('Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  // Tell the active service worker to take control of the page immediately.
  self.clients.claim(); 
});

// FETCH EVENT
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

