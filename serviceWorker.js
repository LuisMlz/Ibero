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

// self.addEventListener("fetch", fetchEvent => {
//   fetchEvent.respondWith(
//     caches.match(fetchEvent.request).then(res => {
//       return res || fetch(fetchEvent.request);
//     })
//   );
// });


self.addEventListener('fetch', function(event) {
  // Obtén la solicitud entrante
  const request = event.request;

  if (request.url.includes('/index')) {
    alert("no guardes")
    event.respondWith(fetch(request));
  } else {
    alert("guarda")
    event.respondWith(
      fetch(request).catch(function() {
        return caches.match(request);
      })
    );
  }
});