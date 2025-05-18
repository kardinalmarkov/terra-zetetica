import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import styles from './Nav.module.css'
import LangSwitch from './LangSwitch'

export default function Nav() {
  const { locale } = useRouter()
  const t = {
    home: locale === 'ru' ? 'Главная' : 'Home',
    about: locale === 'ru' ? 'О государстве' : 'About',
    news: locale === 'ru' ? 'Новости' : 'News',
    constitution: locale === 'ru' ? 'Конституция' : 'Constitution',
    faq:          locale === 'ru' ? 'FAQ'              : 'FAQ',
    roadmap:      locale === 'ru' ? 'Дорожная карта'   : 'Roadmap',
    contacts: locale === 'ru' ? 'Контакты' : 'Contacts',
    apply: locale === 'ru' ? 'Стать гражданином' : 'Become a citizen'
  }

  return (
    <motion.header
      className={styles.bar}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.logo}>
        <span className={styles.mark} />
        <strong>TERRA ZETETICA</strong>
      </div>
      <nav className={styles.menu}>
        <Link href="/">{t.home}</Link>
        <Link href="/about">{t.about}</Link>
        <Link href="/news">{t.news}</Link>
        <Link href="/constitution">{t.constitution}</Link>
        <Link href="/faq">{t('common:FAQ')}</Link>
        <Link href="/roadmap">{t('common:Roadmap')}</Link>
        <Link href="/contacts">{t.contacts}</Link>
        <LangSwitch />
      </nav>
      <Link className={styles.cta} href="/apply">
        {t.apply} ↗
      </Link>
    </motion.header>
  )
}
