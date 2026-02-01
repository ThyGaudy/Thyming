// Service Worker pour Thyming PWA
const CACHE_NAME = 'thyming-v1';
const urlsToCache = [
  './manifest.json',
  './icon-512.png'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(() => {
        // Échec silencieux si pas de cache
      })
  );
});

// Récupération des ressources
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // On ne met PAS en cache le HTML pour qu'il se mette à jour
  if (requestUrl.pathname.endsWith('planning_arcade.html')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => {
        // En cas d'erreur, retourne l'app
        return fetch('./planning_arcade.html');
      })
  );
});

// Nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
