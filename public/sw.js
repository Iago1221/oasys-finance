const CACHE_NAME = 'oasys-erp-v2';
const ASSETS = ['./', 'index.html', 'manifest.json'];

function isApiRequest(url) {
  return url.pathname.includes('/api/');
}

function isSameOriginAsset(request) {
  if (request.method !== 'GET') return false;
  const url = new URL(request.url);
  if (isApiRequest(url)) return false;
  if (url.origin !== self.location.origin) return false;
  return ASSETS.some((asset) => url.pathname.endsWith(asset.replace('./', '')) || url.pathname === '/');
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (isApiRequest(url)) {
    return;
  }

  if (!isSameOriginAsset(event.request)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached ?? fetch(event.request)),
  );
});
