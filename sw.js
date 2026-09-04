// Service Worker para B+H Biblia
// Estrategia: descarga completa durante la instalacion

const CACHE_VERSION = 'biblia-v5.0.0';
const STATIC_CACHE = 'static-' + CACHE_VERSION;
const IMAGE_CACHE = 'images-' + CACHE_VERSION;
const DATA_CACHE = 'data-' + CACHE_VERSION;

// ==========================================
// TODOS LOS ARCHIVOS (descarga completa)
// ==========================================

const ALL_ASSETS = [
  // HTML
  '/',
  '/index.html',
  '/manifest.json',
  
  // CSS
  '/css/index.css',
  '/css/globales/base.css',
  '/css/globales/header.css',
  '/css/globales/nav.css',
  '/css/cuerpo/acercade.css',
  '/css/cuerpo/modal.css',
  '/css/cuerpo/modalgeneral.css',
  '/css/cuerpo/opciones.css',
  '/css/cuerpo/versos.css',
  
  // JS - Principal
  '/js/index.js',
  '/js/estadoGlobal.js',
  '/js/imageLoader.js',
  '/js/progressBar.js',
  
  // JS - Modulos Biblia
  '/js/modulesBiblia/atajos.js',
  '/js/modulesBiblia/cargador.js',
  '/js/modulesBiblia/lectorListas.js',
  '/js/modulesBiblia/modal.js',
  '/js/modulesBiblia/modalGeneral.js',
  '/js/modulesBiblia/navegador.js',
  '/js/modulesBiblia/renderizador.js',
  
  // JS - Nav
  '/js/nav/acercade.js',
  '/js/nav/botones.js',
  '/js/nav/opciones.js',
  
  // JSON (versiones biblicas)
  '/recursos/versiones/NVI.json',
  '/recursos/versiones/RV1960.json',
  
  // Fuentes
  '/recursos/fuentes/Montserrat-ExtraBold.ttf',
  '/recursos/fuentes/Montserrat-Regular.ttf',
  
  // Imagenes (todas)
  '/recursos/imagenes/mh_512.png',
  '/recursos/imagenes/mh_512.svg',
  '/recursos/imagenes/colaboradores/logo_dexs_fita.png',
  '/recursos/imagenes/fondos/imagen1.webp',
  '/recursos/imagenes/fondos/imagen2.webp',
  '/recursos/imagenes/fondos/imagen3.webp',
  '/recursos/imagenes/fondos/imagen4.webp',
  '/recursos/imagenes/fondos/imagen5.webp',
  '/recursos/imagenes/fondos/imagen6.webp',
];

// ==========================================
// INSTALACION - DESCARGAR TODO
// ==========================================

self.addEventListener('install', function(event) {
  event.waitUntil(
    (async function() {
      var cache = await caches.open(STATIC_CACHE);
      var imageCache = await caches.open(IMAGE_CACHE);
      var dataCache = await caches.open(DATA_CACHE);
      
      console.log('Descargando todos los archivos...');
      
      var total = ALL_ASSETS.length;
      var completados = 0;
      
      for (var i = 0; i < ALL_ASSETS.length; i++) {
        var url = ALL_ASSETS[i];
        try {
          var response = await fetch(url);
          if (response && response.ok) {
            var responseClone = response.clone();
            
            if (url.match(/\.(webp|png|jpg|jpeg|gif|svg|ico)$/i)) {
              await imageCache.put(url, response);
            } else if (url.endsWith('.json')) {
              await dataCache.put(url, response);
            } else {
              await cache.put(url, response);
            }
            
            completados++;
            console.log(completados + '/' + total + ': ' + url);
            
            var percent = Math.round((completados / total) * 100);
            self.clients.matchAll().then(function(clients) {
              clients.forEach(function(client) {
                client.postMessage({
                  type: 'PROGRESS',
                  progress: percent,
                  loaded: completados,
                  total: total
                });
              });
            });
          }
        } catch (error) {
          console.warn('Fallo: ' + url, error);
        }
      }
      
      console.log('Descarga completa: ' + completados + '/' + total + ' archivos');
      await self.skipWaiting();
    })()
  );
});

// ==========================================
// ACTIVACION
// ==========================================

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(cacheNames) {
        return Promise.all(
          cacheNames
            .filter(function(name) {
              return name.indexOf('biblia-v') === -1;
            })
            .map(function(name) {
              console.log('Eliminando cache antiguo: ' + name);
              return caches.delete(name);
            })
        );
      })
      .then(function() {
        return self.clients.claim();
      })
  );
});

// ==========================================
// INTERCEPTAR PETICIONES
// ==========================================

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          var responseClone = response.clone();
          
          fetch(event.request)
            .then(function(freshResponse) {
              if (freshResponse && freshResponse.ok) {
                var cache = caches.open(STATIC_CACHE);
                cache.then(function(c) {
                  c.put(event.request, freshResponse);
                });
              }
            })
            .catch(function() {});
          
          return responseClone;
        }
        
        return fetch(event.request)
          .then(function(response) {
            if (response && response.ok) {
              var responseClone = response.clone();
              var cache = caches.open(STATIC_CACHE);
              cache.then(function(c) {
                c.put(event.request, responseClone);
              });
              return response;
            }
            return response;
          });
      })
      .catch(function() {
        return new Response('', { status: 404 });
      })
  );
});
