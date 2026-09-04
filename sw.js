// Service Worker para B+H Biblia
// Estrategia: descarga completa durante la instalacion

const CACHE_VERSION = 'biblia-v5.1.2';
const STATIC_CACHE = 'static-' + CACHE_VERSION;
const IMAGE_CACHE = 'images-' + CACHE_VERSION;
const DATA_CACHE = 'data-' + CACHE_VERSION;

const ALL_ASSETS = [
  // HTML
  '/',
  '/index.html',
  '/includes/acercade.html',
  '/includes/opciones.html',
  
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
  '/js/notificaciones.js',
  
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
  
  // JSON
  '/manifest.json',
  '/recursos/versiones/NVI.json',
  '/recursos/versiones/RV1960.json',
  
  // Fuentes
  '/recursos/fuentes/Montserrat-ExtraBold.ttf',
  '/recursos/fuentes/Montserrat-Regular.ttf',
  
  // Imagenes (8 archivos)
  '/recursos/imagenes/mh_512.png',
  '/recursos/imagenes/mh_512.svg',
  '/recursos/imagenes/colaboradores/logo_dexs_fita.png',
  '/recursos/imagenes/fondos/imagen1.webp',
  '/recursos/imagenes/fondos/imagen2.webp',
  '/recursos/imagenes/fondos/imagen3.webp',
  '/recursos/imagenes/fondos/imagen4.webp',
  '/recursos/imagenes/fondos/imagen5.webp',
  '/recursos/imagenes/fondos/imagen6.webp'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    (async function() {
      const cache = await caches.open(STATIC_CACHE);
      const imageCache = await caches.open(IMAGE_CACHE);
      const dataCache = await caches.open(DATA_CACHE);
      
      console.log('[SW] Iniciando descarga de ' + ALL_ASSETS.length + ' archivos...');
      
      let total = ALL_ASSETS.length;
      let completados = 0;
      let clientes = null;
      
      try {
        clientes = await self.clients.matchAll({
          includeUncontrolled: true,
          type: 'window'
        });
      } catch (_) {}
      
      for (let i = 0; i < ALL_ASSETS.length; i++) {
        let url = ALL_ASSETS[i];
        try {
          let response = await fetch(url);
          if (response && response.ok) {
            let responseClone = response.clone();
            
            if (url.match(/\.(webp|png|jpg|jpeg|gif|svg|ico)$/i)) {
              await imageCache.put(url, response);
            } else if (url.endsWith('.json')) {
              await dataCache.put(url, response);
            } else {
              await cache.put(url, response);
            }
            
            completados++;
            let percent = Math.round((completados / total) * 100);
            
            if (clientes && clientes.length > 0) {
              clientes.forEach(function(client) {
                try {
                  client.postMessage({
                    type: 'PROGRESS',
                    progress: percent,
                    loaded: completados,
                    total: total
                  });
                } catch (_) {}
              });
            }
            
            if (completados % 5 === 0 || completados === total) {
              console.log('[SW] ' + completados + '/' + total + ' (' + percent + '%)');
            }
          } else {
            console.warn('[SW] Fallo: ' + url + ' (status ' + (response ? response.status : 'sin respuesta') + ')');
          }
        } catch (error) {
          console.warn('[SW] Error en: ' + url, error);
        }
      }
      
      console.log('[SW] Descarga completa: ' + completados + '/' + total + ' archivos');
      
      if (clientes && clientes.length > 0) {
        clientes.forEach(function(client) {
          try {
            client.postMessage({
              type: 'INSTALL_COMPLETE',
              progress: 100,
              loaded: completados,
              total: total
            });
          } catch (_) {}
        });
      }
      
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(cacheNames) {
        return Promise.all(
          cacheNames
            .filter(function(name) {
              return name.indexOf('biblia-v') !== -1 && name !== STATIC_CACHE && name !== IMAGE_CACHE && name !== DATA_CACHE;
            })
            .map(function(name) {
              console.log('[SW] Eliminando caché antiguo: ' + name);
              return caches.delete(name);
            })
        );
      })
      .then(function() {
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(function(response) {
            if (response && response.ok) {
              let responseClone = response.clone();
              let cache = caches.open(STATIC_CACHE);
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