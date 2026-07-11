const CACHE_NAME = 'biblia-v2.1';

const urlsToCache = [
  './',
  './index.html',
  './includes/header.html',
  './acercade.html',
  './js/index.js',
  './js/acercade.js',
  './js/nav/botones.js',
  './js/modulesBiblia/modal.js',
  './js/modulesBiblia/atajos.js',
  './js/modulesBiblia/lectorListas.js',
  './css/index.css',
  './css/acercade.css',
  './css/cuerpo/versos.css',
  './css/cuerpo/modal.css',
  './css/globales/nav.css',
  './css/globales/header.css',
  './css/globales/base.css',
  './recursos/imagenes/bh_logo.svg',
  './recursos/imagenes/bh_logo_192.png',
  './recursos/imagenes/bh_logo_512.png',
  './recursos/imagenes/colaboradores/logo_dexs_fita.png',
  './recursos/versiones/NVI.json',
  './recursos/versiones/RV1960.json',
  './recursos/fuentes/Montserrat-Regular.ttf',
  './recursos/fuentes/Montserrat-ExtraBold.ttf'
];

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const url of urlsToCache) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (error) {
          console.warn('Falló:', url);
        }
      }
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
