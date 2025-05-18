import Head from 'next/head'

export default function Constitution() {
  return (
    <>
      <Head>
        <title>Конституция | Terra Zetetica</title>
      </Head>

      <main className="wrapper" style={{ paddingTop: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Конституция Terra Zetetica
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#374151' }}>
          Здесь вы можете ознакомиться с полным текстом нашего основного закона.
        </p>
        <div style={{ textAlign: 'center' }}>
          <a
            href="/constitution.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn primary"
            style={{ padding: '0.75rem 1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          >
            📜 Скачать Конституцию Terra Zetetica (PDF, IPFS)
          </a>
        </div>
      </main>
    </>
  )
}
