import Head from 'next/head'

export default function Constitution() {
  return (
    <>
      <Head>
        <title>Конституция Terra Zetetica</title>
      </Head>

        <h1>Конституция Terra Zetetica</h1>
        <p>Здесь вы можете ознакомиться с полным текстом нашего основного закона.</p>

        <a
          href="https://tomato-eligible-lizard-8.mypinata.cloud/ipfs/bafybeiexp532nzeuxwatndcnt2dhxphhb6ncfdwjulddjkppkie2zcgw5q"
          target="_blank"
          rel="noopener"
          className="btn primary"
          style={{ marginTop: '1rem' }}
        >
          📜 Скачать Конституцию Terra Zetetica (PDF, IPFS)
        </a>
    </>
  )
}
