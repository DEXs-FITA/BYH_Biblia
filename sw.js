const CACHE_NAME = 'biblia-v4.1.0';

const urlsToCache = [
  '/',
  '/css/cuerpo/acercade.css',
  '/css/cuerpo/modal.css',
  '/css/cuerpo/modalgeneral.css',
  '/css/cuerpo/opciones.css',
  '/css/cuerpo/versos.css',
  '/css/globales/base.css',
  '/css/globales/header.css',
  '/css/globales/nav.css',
  '/css/index.css',
  '/includes/acercade.html',
  '/includes/header.html',
  '/includes/opciones.html',
  '/index.html',
  '/js/estadoGlobal.js',
  '/js/index.js',
  '/js/modulesBiblia/atajos.js',
  '/js/modulesBiblia/cargador.js',
  '/js/modulesBiblia/lectorListas.js',
  '/js/modulesBiblia/modal.js',
  '/js/modulesBiblia/modalGeneral.js',
  '/js/modulesBiblia/navegador.js',
  '/js/modulesBiblia/renderizador.js',
  '/js/nav/acercade.js',
  '/js/nav/botones.js',
  '/js/nav/opciones.js',
  '/listar.py',
  '/manifest.json',
  '/recursos/fuentes/Montserrat-ExtraBold.ttf',
  '/recursos/fuentes/Montserrat-Regular.ttf',
  '/recursos/imagenes/colaboradores/logo_dexs_fita.png',
  '/recursos/imagenes/fondos/imagen1.webp',
  '/recursos/imagenes/fondos/imagen2.webp',
  '/recursos/imagenes/fondos/imagen3.webp',
  '/recursos/imagenes/fondos/imagen4.webp',
  '/recursos/imagenes/fondos/imagen5.webp',
  '/recursos/imagenes/fondos/imagen6.webp',
  '/recursos/imagenes/mh_512.png',
  '/recursos/imagenes/mh_512.svg',
  '/recursos/versiones/NVI.json',
  '/recursos/versiones/RV1960.json',
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
