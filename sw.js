/* ============================================================================
   code.isaiart.com — service worker
   Keeps the editor usable with no network. Bump CACHE on every deploy.
   ========================================================================= */

const CACHE = 'code-v4';

/* Shipped with the site — precached on install. */
const SHELL = [
    '/',
    '/index.html',
    '/editor/',
    '/mobile/',
    '/404.html',
    '/assets/icon.svg',
    '/assets/icon-180.png',
    '/assets/icon-192.png',
    '/assets/icon-512.png',
    '/assets/icon-maskable-512.png',
    '/manifest.webmanifest',
    '/mobile/manifest.webmanifest'
];

/* The editor's libraries, also precached so the full editor (not just the
   start screen) works on the first offline visit. Keep in step with CM_CSS,
   CM_JS and PRETTIER in index.html. */
const CM = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/';
const LIBS = [
    'codemirror.min.css', 'addon/dialog/dialog.css', 'addon/fold/foldgutter.css', 'addon/hint/show-hint.css',
    'codemirror.min.js', 'mode/xml/xml.min.js', 'mode/javascript/javascript.min.js', 'mode/css/css.min.js',
    'mode/htmlmixed/htmlmixed.min.js', 'addon/search/searchcursor.js', 'addon/dialog/dialog.js',
    'addon/search/search.js', 'addon/edit/closebrackets.js', 'addon/edit/closetag.js',
    'addon/edit/matchbrackets.js', 'addon/edit/matchtags.js', 'addon/fold/xml-fold.js',
    'addon/fold/foldcode.js', 'addon/fold/foldgutter.js', 'addon/fold/brace-fold.js',
    'addon/comment/comment.js', 'addon/selection/active-line.js', 'addon/hint/show-hint.js',
    'addon/hint/xml-hint.js', 'addon/hint/html-hint.js'
].map((f) => CM + f).concat(
    ['standalone.js', 'parser-html.js', 'parser-postcss.js', 'parser-babel.js']
        .map((f) => 'https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.8/' + f)
);

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
            .then((cache) => Promise.all(SHELL.concat(LIBS).map((url) => cache.add(url).catch(() => null))))
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
                .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('/index.html')))
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
