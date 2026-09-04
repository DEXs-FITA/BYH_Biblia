// Service Worker para B+H Biblia
// Estrategia: descarga completa durante la instalación

const CACHE_VERSION = 'biblia-v5.0.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;
const DATA_CACHE = `data-${CACHE_VERSION}`;

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
  
  // JS - Módulos Biblia
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
  
  // JSON (versiones bíblicas)
  '/recursos/versiones/NVI.json',
  '/recursos/versiones/RV1960.json',
  
  // Fuentes
  '/recursos/fuentes/Montserrat-ExtraBold.ttf',
  '/recursos/fuentes/Montserrat-Regular.ttf',
  
  // Imágenes (todas)
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
// INSTALACIÓN - DESCARGAR TODO
// ==========================================

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      const imageCache = await caches.open(IMAGE_CACHE);
      const dataCache = await caches.open(DATA_CACHE);
      
      console.log('📦 Descargando todos los archivos...');
      
      // Descargar todos los archivos con barra de progreso
      const total = ALL_ASSETS.length;
      let completados = 0;
      
      for (const url of ALL_ASSETS) {
        try {
          const response = await fetch(url);
          if (response && response.ok) {
            // Determinar qué cache usar según el tipo de archivo
            if (url.match(/\.(webp|png|jpg|jpeg|gif|svg|ico)$/i)) {
              await imageCache.put(url, response);
            } else if (url.endsWith('.json')) {
              await dataCache.put(url, response);
            } else {
              await cache.put(url, response);
            }
            completados++;
            console.log(`✅ ${completados}/${total}: ${url}`);
            
            // Notificar progreso (para la barra)
            const percent = Math.round((completados / total) * 100);
            self.clients.matchAll().then(clients => {
              clients.forEach(client => {
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
          console.warn(`⚠️ Falló: ${url}`, error);
        }
      }
      
      console.log(`🎉 Descarga completa: ${completados}/${total} archivos`);
      await self.skipWaiting();
    })()
  );
});

// ==========================================
// ACTIVACIÓN
// ==========================================

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return !name.includes('biblia-v');
            })
            .map((name) => {
              console.log(`🗑️ Eliminando cache antiguo: ${name}`);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// ==========================================
// INTERCEPTAR PETICIONES
// ==========================================

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Estrategia: Cache First para todo
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          // Actualizar en segundo plano (stale-while-revalidate)
          fetch(event.request)
            .then((freshResponse) => {
              if (freshResponse && freshResponse.ok) {
                const cache = caches.open('static-biblia-v5.0.0');
                cache.then((c) => c.put(event.request, freshResponse.clone()));
              }
            })
            .catch(() => {});
          return response;
        }
        
        // Si no está en cache, descargar
        return fetch(event.request)
          .then((response) => {
            if (response && response.ok) {
              const cache = caches.open('static-biblia-v5.0.0');
              cache.then((c) => c.put(event.request, response.clone()));
              return response;
            }
            return response;
          });
      })
      .catch(() => {
        return new Response('', { status: 404 });
      })
  );
});
