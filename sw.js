// Service Worker para B+H Biblia
// Estrategia de cache optimizada para PWA offline

const CACHE_VERSION = 'biblia-v4.5.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;
const DATA_CACHE = `data-${CACHE_VERSION}`;

// Archivos estáticos CRÍTICOS (se cachean en la instalación)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/index.css',
  '/css/globales/base.css',
  '/css/globales/header.css',
  '/css/globales/nav.css',
  '/js/index.js',
  '/js/estadoGlobal.js',
  '/js/imageLoader.js',
  '/js/progressBar.js',
  '/recursos/imagenes/mh_512.png',
  '/recursos/imagenes/mh_512.svg',
];

// Archivos CSS secundarios (se cachean después)
const CSS_ASSETS = [
  '/css/cuerpo/acercade.css',
  '/css/cuerpo/modal.css',
  '/css/cuerpo/modalgeneral.css',
  '/css/cuerpo/opciones.css',
  '/css/cuerpo/versos.css',
];

// Módulos JS (se cachean después)
const JS_MODULES = [
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
];

// Archivos de datos (version bíblicas)
const DATA_ASSETS = [
  '/recursos/versiones/NVI.json',
  '/recursos/versiones/RV1960.json',
];

// Fuentes
const FONT_ASSETS = [
  '/recursos/fuentes/Montserrat-ExtraBold.ttf',
  '/recursos/fuentes/Montserrat-Regular.ttf',
];

// Instalación - Cachear solo lo crítico
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      console.log('Cacheando archivos críticos...');
      
      // Cachear archivos estáticos con manejo de errores
      for (const url of STATIC_ASSETS) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
            console.log(`Cacheado: ${url}`);
          }
        } catch (error) {
          console.warn(`Falló: ${url}`);
        }
      }
      
      // Cachear archivos CSS en segundo plano
      setTimeout(async () => {
        const cssCache = await caches.open(STATIC_CACHE);
        for (const url of CSS_ASSETS) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cssCache.put(url, response);
            }
          } catch (error) {}
        }
      }, 1000);
      
      // Cachear módulos JS en segundo plano
      setTimeout(async () => {
        const jsCache = await caches.open(STATIC_CACHE);
        for (const url of JS_MODULES) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await jsCache.put(url, response);
            }
          } catch (error) {}
        }
      }, 2000);
      
      // Cachear fuentes en segundo plano
      setTimeout(async () => {
        const fontCache = await caches.open(STATIC_CACHE);
        for (const url of FONT_ASSETS) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await fontCache.put(url, response);
            }
          } catch (error) {}
        }
      }, 3000);
      
      await self.skipWaiting();
    })()
  );
});

// Activación - Limpiar caches viejos
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
              console.log(`Eliminando cache antiguo: ${name}`);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Interceptar peticiones con estrategias específicas
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // ==========================================
  // IMÁGENES (incluye fondos)
  // ==========================================
  if (url.pathname.match(/\.(webp|png|jpg|jpeg|gif|svg|ico)$/i)) {
    event.respondWith(handleImageRequest(event.request));
    return;
  }
  
  // ==========================================
  // ARCHIVOS JSON (versiones bíblicas)
  // ==========================================
  if (url.pathname.endsWith('.json')) {
    event.respondWith(handleDataRequest(event.request));
    return;
  }
  
  // ==========================================
  // ARCHIVOS HTML (includes)
  // ==========================================
  if (url.pathname.endsWith('.html') || url.pathname.includes('/includes/')) {
    event.respondWith(handleHtmlRequest(event.request));
    return;
  }
  
  // ==========================================
  // ARCHIVOS ESTÁTICOS (CSS, JS, fuentes)
  // ==========================================
  event.respondWith(handleStaticRequest(event.request));
});

// ==========================================
// MANEJADOR DE IMÁGENES
// ==========================================
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Devolver cache y actualizar en segundo plano
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          cache.put(request, response.clone());
        }
      })
      .catch(() => {});
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    console.warn('Error cargando imagen:', request.url);
  }
  
  // Fallback: imagen por defecto
  return new Response('', { status: 404 });
}

// ==========================================
// MANEJADOR DE DATOS (JSON - Versiones)
// ==========================================
async function handleDataRequest(request) {
  const cache = await caches.open(DATA_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Devolver cache y actualizar en segundo plano
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          cache.put(request, response.clone());
        }
      })
      .catch(() => {});
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    console.warn('Error cargando datos:', request.url);
  }
  
  return new Response(JSON.stringify({ error: 'Datos no disponibles offline' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

// ==========================================
// MANEJADOR DE HTML (includes)
// ==========================================
async function handleHtmlRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Actualizar en segundo plano
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          cache.put(request, response.clone());
        }
      })
      .catch(() => {});
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    console.warn('Error cargando HTML:', request.url);
  }
  
  return new Response('', { status: 404 });
}

// ==========================================
// MANEJADOR DE ARCHIVOS ESTÁTICOS
// ==========================================
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Actualizar en segundo plano
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          cache.put(request, response.clone());
        }
      })
      .catch(() => {});
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    console.warn('Error cargando archivo estático:', request.url);
  }
  
  return new Response('', { status: 404 });
}