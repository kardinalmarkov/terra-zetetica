import Head from 'next/head';

export default function Constitution() {
  return (
    <>
      <Head>
        <title>Конституция | Terra Zetetica</title>
      </Head>
      <main className="wrapper" style={{ paddingTop: '1rem' }}>
        <h1>Конституция Terra Zetetica</h1>
        <p style={{ marginBottom: '1.5rem' }}>
          Полный текст Конституции доступен по ссылке:
        </p>
        <a
          className="btn primary"
          href="https://tomato-eligible-lizard-8.mypinata.cloud/ipfs/bafybeiexp532nzeuxwatndcnt2dhxphhb6ncfdwjulddjkppkie2zcgw5q"
          target="_blank"
          rel="noopener noreferrer"
        >
          📜 Открыть в IPFS
        </a>
      </main>
    </>
  );
}
