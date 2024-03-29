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

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});
