// Service Worker pour Thyming PWA
const CACHE_NAME = 'thyming-v1';
const urlsToCache = [
  './planning_arcade.html',
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
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourne le cache si disponible, sinon fetch
        return response || fetch(event.request);
      })
      .catch(() => {
        // En cas d'erreur, retourne l'app
        return caches.match('./planning_arcade.html');
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
