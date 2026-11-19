const CACHE = 'kiss-archive-v44';
const FILES = ['./', './index.html', './styles.css', './app.js', './data.js', './albums.js', './photos.js', './game.js', './quiz.js', './manifest.webmanifest', './assets/fonts/zalando-sans-expanded-latin-700-italic.woff2', './assets/fonts/zalando-sans-expanded-latin-ext-700-italic.woff2', './assets/kiss-logo.png', './assets/icon-32.png', './assets/icon-180.png', './assets/icon-192.png', './assets/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys
    .filter((key) => key.startsWith('kiss-archive-') && key !== CACHE)
    .map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith(fetch(event.request).then((response) => {
    if (response.ok) {
      const copy = response.clone();
      void caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    }
    return response;
  }).catch(async () => (await caches.match(event.request))
    || (event.request.mode === 'navigate' ? await caches.match('./index.html') : Response.error())));
});
