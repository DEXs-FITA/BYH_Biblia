// sw.js
const CACHE_NAME = 'biblia-v2.1';

// Lista de recursos a cachear
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

// Evento install: cachea los recursos e identifica fallos
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('Iniciando cacheo de recursos...');
      
      let archivosExitosos = 0;
      let archivosFallidos = [];
      
      for (const url of urlsToCache) {
        try {
          const response = await fetch(url);
          if (response && response.ok) {
            await cache.put(url, response);
            console.log('Exito: ' + url);
            archivosExitosos++;
          } else {
            console.error('Error ' + (response?.status || 'desconocido') + ': ' + url);
            archivosFallidos.push(url);
          }
        } catch (error) {
          console.error('Error al cargar: ' + url, error);
          archivosFallidos.push(url);
        }
      }
      
      console.log('Resumen: ' + archivosExitosos + ' archivos cacheados, ' + archivosFallidos.length + ' fallaron');
      
      if (archivosFallidos.length > 0) {
        console.error('Archivos que fallaron:');
        archivosFallidos.forEach(url => console.error('  - ' + url));
      } else {
        console.log('Todos los archivos se cachearon correctamente');
      }
      
      await self.skipWaiting();
    })()
  );
});

// Evento activate: limpia cachés antiguos y toma control
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys => {
        return Promise.all(
          keys.filter(key => key !== CACHE_NAME)
              .map(key => {
                console.log('Eliminando cache antiguo: ' + key);
                return caches.delete(key);
              })
        );
      }),
      self.clients.claim()
    ]).then(() => {
      console.log('Service Worker activado y controlando las pestañas');
    })
  );
});

// Evento fetch: primero busca en cache, luego en red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).catch(() => {
          // Si es una pagina HTML y falla, intenta mostrar index.html
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./index.html');
          }
          return new Response('Recurso no disponible', { status: 503 });
        });
      })
  );
});
