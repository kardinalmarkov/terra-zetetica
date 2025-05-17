import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Terra Zetetica</title>
        <meta name="description" content="Welcome to Terra Zetetica" />
      </Head>
      <main style={{ padding: "4rem", textAlign: "center" }}>
        <h1>Terra Zetetica</h1>
        <p>Veritas Supra Omnia</p>
        <a href="/passport">🛂 Получить Паспорт</a>
      </main>
    </>
  );
}
