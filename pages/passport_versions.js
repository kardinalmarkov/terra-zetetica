import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function PassportVersions() {
  const { t } = useTranslation('passport_versions')

  return (
    <>
      <Head>
        <title>{t('title')}</title>
      </Head>
      <main className="wrapper">
        <h1>{t('header')}</h1>
        <ul>
          <li>{t('v1')}</li>
          <li>{t('v2')}</li>
          <li>{t('v3')}</li>
        </ul>
      </main>
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'passport_versions']))
    }
  }
}
