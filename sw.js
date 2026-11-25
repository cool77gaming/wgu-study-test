/* Service worker for the WGU C190 mock OA.
 *
 * Purpose: let the page load with no connection, so a saved exam can always be resumed after a
 * dropped connection, a closed browser or a phone that killed the tab.
 *
 *  - App files (same origin): stale-while-revalidate. Loads instantly, works offline, and updates itself
 *    in the background (the new version is used on the next visit).
 *  - Neural-voice libraries (pinned, versioned URLs on jsDelivr / cdnjs): cache-first once fetched, so the
 *    voice can keep working offline after its first successful use. The voice *model* itself is cached by
 *    the voice library in the browser's private file storage and is not touched here.
 */
const VERSION = "v1";
const APP_CACHE = `c190-app-${VERSION}`;
const CDN_CACHE = `c190-cdn-${VERSION}`;
const APP_SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
const CDN_HOSTS = ["cdn.jsdelivr.net", "cdnjs.cloudflare.com"];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_CACHE);
    // Added one by one so a single missing file can never block the whole install.
    await Promise.all(APP_SHELL.map(url => cache.add(new Request(url, { cache: "reload" })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keep = new Set([APP_CACHE, CDN_CACHE]);
    for (const key of await caches.keys()) {
      if (key.startsWith("c190-") && !keep.has(key)) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) event.respondWith(appResponse(event, req));
  else if (CDN_HOSTS.includes(url.hostname)) event.respondWith(cdnResponse(req));
});

async function appResponse(event, req) {
  const cache = await caches.open(APP_CACHE);
  const isNav = req.mode === "navigate";
  const key = isNav ? "./index.html" : req;           // every page URL / query string maps to the one app page
  const cached = await cache.match(key, { ignoreSearch: true });
  const network = fetch(req.url, { cache: "no-cache" }).then(async res => {
    if (res && res.ok && res.type === "basic" && !res.redirected) await cache.put(key, res.clone());
    return res;
  });
  if (cached) {
    event.waitUntil(network.catch(() => {}));          // refresh in the background
    return cached;
  }
  try {
    return await network;
  } catch (err) {
    const fallback = isNav ? await cache.match("./index.html") : null;
    return fallback || new Response("You are offline and this file is not cached yet.", { status: 503, statusText: "Offline" });
  }
}

async function cdnResponse(req) {
  const cache = await caches.open(CDN_CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && res.ok && res.type !== "opaque") cache.put(req, res.clone()).catch(() => {});
  return res;
}
