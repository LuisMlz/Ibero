const staticVCard = "vcard-v1";
const assets = [
  "./",
  "./js/login.js",
  "./index.html",
  "./css/loginStyle.css",
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
    console.log("no guardes")
    event.respondWith(fetch(request));
  } else {
    console.log("guarda")
    event.respondWith(
      fetch(request).catch(function() {
        return caches.match(request);
      })
    );
  }
});