// pages/dom1.js
import Head from 'next/head'
import Link from 'next/link'

export default function Dom1() {
  return (
    <>
      <Head>
        <title>🏠 Дом за шар — тестовая страница</title>

        {/* Favicon / домик-иконка  */}
        <link rel="icon" type="image/png" href="/dom.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/dom.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/dom.png" />

        {/* Open Graph для Telegram / FB */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://www.terra-zetetica.org/dom1" />
        <meta property="og:title"       content="Докажи шар — получи дом • Terra Zetetica" />
        <meta property="og:description" content="Тестовая страница: проверяем отображение новой домик‑фавиконки." />
        <meta property="og:image"       content="https://www.terra-zetetica.org/dom.png" />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="Докажи шар — получи дом • Terra Zetetica" />
        <meta name="twitter:description" content="Тестовая страница: проверяем отображение новой домик‑фавиконки." />
        <meta name="twitter:image"       content="https://www.terra-zetetica.org/dom.png" />
      </Head>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>🏠 Тестовая страница Dom1</h1>
        <p>
          Если всё настроено верно, в вкладке браузера и при шаринге ссылки будет виден
          жёлтый домик (<code>dom.png</code>).
        </p>
        <Link href="/dom">← Вернуться к основной странице челленджа</Link>
      </main>
    </>
  )
}
