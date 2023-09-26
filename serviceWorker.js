const staticVCard = "vcard-v1";
const assets = [
  "./",
  "./js/app.js",
  "./vcard.html",
  "./css/style.css",
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticVCard).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
      caches.match(event.request).then(function(response) {
          // Si la solicitud es para la página de inicio de sesión, ve a la red en lugar de la caché
          if (event.request.url.includes('/index.html')) {
              return fetch(event.request);
          }

          // Si la solicitud está en la caché, sirve la respuesta desde la caché
          if (response) {
              return response;
          }

          // Si la solicitud no está en la caché, ve a la red
          return fetch(event.request);
      })
  );
});