/*
 * FreeTechPath service worker. Deliberately small:
 *  - build files (/_next/static) and images never change under the same name,
 *    so they are served from the cache after the first visit;
 *  - pages always come from the network, so learners never see a stale site;
 *    with no connection they get a friendly offline page instead of an error;
 *  - audio, video and anything that is not a plain GET is left alone.
 */
const CACHE = 'ftp-static-v1'
const OFFLINE = '/offline.html'

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll([OFFLINE, '/pwa/icon-192.png'])))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET' || req.headers.has('range')) return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match(OFFLINE)))
    return
  }

  const cacheable = url.pathname.startsWith('/_next/static/') || /^\/(art|brand|cert|pwa)\//.test(url.pathname)
  if (!cacheable) return
  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok && res.status === 200) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(req, copy))
          }
          return res
        }),
    ),
  )
})
