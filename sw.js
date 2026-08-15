/* ============================================================================
   code.isaiart.com — service worker
   Keeps the tools usable with no network. Bump CACHE on every deploy.
   ========================================================================= */

const CACHE = 'isa-v1';

/* Shipped with the site — precached on install. */
const SHELL = [
    '/',
    '/index.html',
    '/editor/',
    '/mobile/',
    '/archive/',
    '/404.html',
    '/assets/cassette.css',
    '/assets/cassette.js',
    '/assets/icon.svg',
    '/assets/icon-192.png',
    '/assets/icon-512.png',
    '/manifest.webmanifest',
    '/mobile/manifest.webmanifest'
];

/* Third-party origins worth keeping offline (fonts, CodeMirror, Prettier). */
const RUNTIME_HOSTS = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdnjs.cloudflare.com'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE)
            // addAll is atomic — one 404 would abort the whole install, so add
            // each entry independently and tolerate misses.
            .then((cache) => Promise.all(SHELL.map((url) => cache.add(url).catch(() => null))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);

    /* Pages: network first, so a deploy is picked up immediately; fall back to
       cache (then to the shell) when the network is gone. */
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE).then((c) => c.put(req, copy));
                    return res;
                })
                .catch(() => caches.match(req).then((hit) => hit || caches.match('/index.html')))
        );
        return;
    }

    const sameOrigin = url.origin === self.location.origin;
    const cacheable = sameOrigin || RUNTIME_HOSTS.indexOf(url.hostname) !== -1;
    if (!cacheable) return;

    /* Assets: serve from cache instantly, refresh in the background. */
    event.respondWith(
        caches.match(req).then((hit) => {
            const network = fetch(req)
                .then((res) => {
                    // Opaque cross-origin responses are still worth storing.
                    if (res && (res.ok || res.type === 'opaque')) {
                        const copy = res.clone();
                        caches.open(CACHE).then((c) => c.put(req, copy));
                    }
                    return res;
                })
                .catch(() => hit);
            return hit || network;
        })
    );
});
