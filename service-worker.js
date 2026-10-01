const CACHE_NAME = "nos-v2";

const FILES_TO_CACHE = [
    "/",
    "/login.html",
    "/index.html",
    "/historia.html",
    "/fotos.html",
    "/mensagens.html",
    "/musicas.html",
    "/filmes.html",
    "/dates.html",
    "/manifest.json",
    "/style/global.css",
    "/script/app.js",
    "/script/data.js"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});