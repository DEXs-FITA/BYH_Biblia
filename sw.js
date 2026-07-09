// sw.js
const CACHE_NAME = 'biblia-v2.1';

// Lista de todos los recursos que se guardarán al instalar la app
const urlsToCache = [
  './',
  './index.html',
  './includes/header.html',
  './public/acerdade.html',
  './js/index.js',
  './js/acerdade.js',
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

// --- Evento install: almacenar todos los archivos en caché ---
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Abriendo caché y guardando recursos...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Forzar que el service worker se active inmediatamente
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Error durante la instalación de la caché:', error);
      })
  );
});

// --- Evento activate: limpiar cachés antiguas ---
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => {
              console.log('Borrando caché antigua:', key);
              return caches.delete(key);
            })
      );
    })
    .then(() => {
      // Tomar control de todas las pestañas abiertas inmediatamente
      return self.clients.claim();
    })
  );
});

// --- Estrategia "cache first" (primero caché, luego red) ---
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Si está en caché, lo devolvemos; si no, vamos a la red
        return cachedResponse || fetch(event.request);
      })
      // No usamos .catch aquí para dejar que el navegador maneje el error
      // cuando no hay caché ni red (mostrará su pantalla de "sin conexión").
  );
});