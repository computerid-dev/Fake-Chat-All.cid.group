/* =========================================================
   Fake Chat [all] — by Computer[ID]•GROUP
   sw.js — Service Worker: bikin aplikasi bisa jalan 100% offline.
   ========================================================= */

const CACHE_VERSION = 'cid-fakechat-v1';
const CORE_CACHE = `${CACHE_VERSION}-core`;

const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './script.js',
  './manifest.json',
  './offline.html',
  './full-screen_banner_install_vapk.html',
  './images/icons/icon-192.png',
  './images/icons/icon-512.png',
  './images/icons/icon-180.png',
  './images/icons/favicon-32.png',
];

/* Install: precache seluruh app shell supaya bisa dibuka tanpa internet */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

/* Activate: bersihkan cache versi lama */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key.startsWith('cid-fakechat-') && key !== CORE_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

/* Fetch: cache-first untuk app shell, fallback offline.html untuk navigasi */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // biarkan request pihak ketiga apa adanya

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((networkRes) => {
          // simpan salinan ke cache supaya makin lengkap offline-nya
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CORE_CACHE).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        })
        .catch(() => {
          if (req.mode === 'navigate') {
            return caches.match('./offline.html');
          }
          return caches.match('./index.html');
        });
    })
  );
});
