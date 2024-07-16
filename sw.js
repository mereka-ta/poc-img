self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open("poc-store")
      .then((cache) =>
        cache.addAll([
          "/poc-img/",
          "/poc-img/index.html",
          "/poc-img/index.js",
          "/poc-img/img/pwa-btn.png",
          "/poc-img/img/pwa-submit.png",
          "/poc-img/img/usform.png",
        ])
      )
  );
});

self.addEventListener("fetch", (e) => {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
