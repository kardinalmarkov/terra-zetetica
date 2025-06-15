// /clear-cache
caches.keys().then(keys => keys.forEach(k => caches.delete(k)))
localStorage.clear(); sessionStorage.clear();
location.reload(true);
