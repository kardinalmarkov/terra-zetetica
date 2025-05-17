import '../styles/globals.css'
import { appWithTranslation } from 'next-i18next'
import Nav from '../components/Nav'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Nav />
      <Component {...pageProps} />
    </>
  )
}

export default appWithTranslation(MyApp)
