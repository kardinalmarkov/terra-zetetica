// pages/clear-cache.js                       v1.1 • 15 Jun 2025
//
// Очистка Service-Worker CacheStorage + local/sessionStorage.
// Всё выполняется ТОЛЬКО в браузере; при SSR возвращается пустая заглушка.

import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ClearCache() {

  useEffect(() => {
    /*  ——— выполняется один раз после монтирования (только в браузере) ——— */
    (async () => {
      // CacheStorage (если поддерживается)
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }

      // Web Storage
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch { /* Safari private / quota exceeded — молча игнорируем */ }

      // небольшая пауза, чтобы глаза не дёрнули,
      // затем перезагружаем текущую страницу
      setTimeout(() => location.replace('/'), 500);
    })();
  }, []);

  return (
    <>
      <Head><title>Очистка кэша… • Terra Zetetica</title></Head>
      <main style={{maxWidth:480,margin:'6rem auto',textAlign:'center'}}>
        <h1>🧹 Очищаем кэш…</h1>
        <p>Подождите пару секунд, страница перезагрузится автоматически.</p>
        <p style={{marginTop:32,fontSize:14}}>
          Если этого не случилось,&nbsp;
          <Link href="/">нажмите сюда</Link>.
        </p>
      </main>
    </>
  );
}
