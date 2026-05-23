// HelloPepo Service Worker — Monetag + PWA Cache
const CACHE = 'helloPepo-v1';
const OFFLINE_ASSETS = ['/', '/index.html'];

// Monetag config
self.options = {
  "domain": "5gvci.com",
  "zoneId": 11046542
}
self.lary = ""
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw')

// Install
self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE).then(cache=>cache.addAll(OFFLINE_ASSETS).catch(()=>{}))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', e=>{
  if(e.request.method !== 'GET') return;
  if(e.request.url.includes('supabase.co')) return;
  e.respondWith(
    fetch(e.request).then(res=>{
      if(res && res.status===200){
        const clone=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request,clone));
      }
      return res;
    }).catch(()=>caches.match(e.request).then(cached=>{
      if(cached) return cached;
      if(e.request.mode==='navigate') return caches.match('/index.html');
    }))
  );
});
