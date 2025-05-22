import Head from 'next/head'
import '../styles/globals.css'
import { appWithTranslation } from 'next-i18next'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.webp" type="image/webp" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Terra Zetetica</title>
      </Head>
      <Nav />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}

export default appWithTranslation(MyApp)
