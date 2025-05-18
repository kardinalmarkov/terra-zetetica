import Head from 'next/head';

export default function Constitution() {
  return (
    <>
      <Head>
        <title>Конституция Terra Zetetica</title>
        <meta name="description" content="Ознакомьтесь с полным текстом Конституции Terra Zetetica" />
      </Head>
      <main style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '1rem',
          textAlign: 'center',
          color: '#111827',
        }}>
          Конституция Terra Zetetica
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: '#374151',
          marginBottom: '2rem',
          textAlign: 'center',
          lineHeight: 1.6,
        }}>
          Здесь вы можете ознакомиться с полным текстом нашего основного закона.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <a
            href="/constitution.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#facc15',
              color: '#111827',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            📜 Скачать Конституцию Terra Zetetica (PDF, IPFS)
          </a>
        </div>
      </main>
    </>
  );
}
