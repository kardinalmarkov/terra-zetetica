import Head from 'next/head'

export default function News() {
  return (
    <>
      <Head>
        <title>Новости | Terra Zetetica</title>
      </Head>
        className="wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Новости</h1>
        <p>Скоро здесь появятся анонсы и отчёты о наших проектах.</p>
    </>
  )
}
