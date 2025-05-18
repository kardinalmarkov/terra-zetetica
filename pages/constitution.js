import Head from 'next/head';

export default function Constitution() {
  return (
    <main className="wrapper">
      <Head>
        <title>Конституция Terra Zetetica</title>
        <meta
          name="description"
          content="Ознакомьтесь с полным текстом Конституции Terra Zetetica"
        />
      </Head>

      <h1>Конституция Terra Zetetica</h1>
      <p style={{ marginBottom: '2rem', color: '#374151' }}>
        Здесь вы можете ознакомиться с полным текстом нашего основного закона.
      </p>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <a
          href="/constitution.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn primary"
        >
          📜 Скачать Конституцию Terra Zetetica (PDF, IPFS)
        </a>
      </div>
    </main>
  );
}
