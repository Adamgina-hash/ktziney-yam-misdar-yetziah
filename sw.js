const CACHE_NAME = 'master-os-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html'
];

// שלב 1: התקנה - הורדת האפליקציה לזיכרון של הטלפון
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// שלב 2: בקשת רשת - אם אין אינטרנט, תמשוך מהזיכרון
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // אם מצאנו את זה בזיכרון של הטלפון, נחזיר את זה מיד
      if (response) {
        return response;
      }
      // אם לא, ננסה להביא מהאינטרנט (מ-Netlify)
      return fetch(event.request).catch(() => {
        // אם אין אינטרנט (השרת נפל או אין קליטה), נציג את המסך הראשי ששמור בזיכרון
        return caches.match('/index.html');
      });
    })
  );
});

// שלב 3: עדכון - ניקוי זיכרון ישן כשאתה מעדכן קוד ב-GitHub
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
