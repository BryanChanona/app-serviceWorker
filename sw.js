//Aqui vamos a implementar la cache, instalando..., activando.., sync, push notification
const CACHE_NAME = "cache-v1"

const PRECACHE_URLS = [
    "index.html", "styles.css", "server.js"
]
//Estado de instalación del service worker.
self.addEventListener("install", (event) => {
    console.log("Service worker instalando...");
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log("Service Worker: Cache abierto");
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('Service Worker: Todos los archivos cacheados');

                return self.skipWaiting(); // Forzar la activación inmediata 
            })
            .catch((error) => {
                console.error("Error al instalar: ", error);
            })
    )
});

//Estado de activación del service worker. 
self.addEventListener("activate", (event) => {
    console.log("Service worker: Activandose");
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Eliminando cache antiguo:', cacheName);
                            return caches.delete(cacheName)
                        }
                    })
                )
            })
            .then(() => {
                console.log("Service worker activado correctamente");
                return self.clients.claim();
            })
            .catch((error) => {
                console.error('Service Worker: Error durante la activación:', error);
            })


    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});
