// Service worker minimal — face site-ul instalabil (PWA) și cache-uiește
// resursele de bază pentru încărcare rapidă. Nu gestionează încă push
// notifications (asta necesită Firebase Cloud Messaging + un backend
// care sa declanseze trimiterea, vezi notele din README).

const CACHE_NAME = 'insula-iubirii-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // network-first pentru firestore/firebase, cache-first pentru restul
  if (event.request.url.includes('firestore') || event.request.url.includes('googleapis')) return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
