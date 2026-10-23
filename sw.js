// Service worker بسيط: بيخلّي التطبيق قابل للتثبيت، وبيحفظ نسخة من الصفحة للفتح السريع.
// الصفحة والأسعار بتتحدّث من النت أولاً دايمًا، والنسخة المحفوظة بتستخدم لو مفيش نت.
const CACHE='zamany-v1';
self.addEventListener('install',e=>{ self.skipWaiting(); });
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||!r.url.startsWith(self.location.origin)) return;
  e.respondWith(fetch(r).then(res=>{
    if(res&&res.ok){ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(r,cp)); }
    return res;
  }).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('./index.html'):undefined))));
});
