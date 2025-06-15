// pages/_app.js                                v3.9 • 15 Jun 2025
//
//  +   встраиваем <meta name="app-version">
//  +   выводим версию в консоль при монтировании
//-----------------------------------------------------------------

import Head                    from 'next/head'
import '../styles/globals.css'
import { appWithTranslation }  from 'next-i18next'
import Nav                     from '../components/Nav'
import Footer                  from '../components/Footer'
import { APP_VERSION }         from '../utils/version'   // ← NEW

function MyApp({ Component, pageProps }) {

  /* —--- один раз при монтировании выводим версию в консоль —--- */
  if (typeof window !== 'undefined')
    // eslint-disable-next-line no-console
    console.log('%cTerra Zetetica v' + APP_VERSION,
                'color:#6c63ff;font-weight:bold')

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.webp" type="image/webp" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        {/* ⇣ вот здесь — номер текущей сборки */}
        <meta name="app-version" content={APP_VERSION} />

        <title>Terra Zetetica</title>
      </Head>

      <Nav />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}

export default appWithTranslation(MyApp)
