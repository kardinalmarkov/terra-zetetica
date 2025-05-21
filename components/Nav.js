// components/Nav.js
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from './Nav.module.css'
import LangSwitch from './LangSwitch'

export default function Nav() {
  const { locale } = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const t = {
    home:         locale === 'ru' ? 'Главная'        : 'Home',
    about:        locale === 'ru' ? 'О государстве'  : 'About',
    news:         locale === 'ru' ? 'Новости'        : 'News',
    constitution: locale === 'ru' ? 'Конституция'    : 'Constitution',
    faq:          locale === 'ru' ? 'FAQ'            : 'FAQ',
    roadmap:      locale === 'ru' ? 'Дорожная карта' : 'Roadmap',
    materials:    locale === 'ru' ? 'Материалы'      : 'Materials',
    contacts:     locale === 'ru' ? 'Контакты'       : 'Contacts',
    apply:        locale === 'ru' ? 'Стать гражданином' : 'Become a citizen',
  }

  return (
    <header className={styles.bar}>
      <div className={styles.logo}>
        <span className={styles.mark} />
        <strong>TERRA ZETETICA</strong>
      </div>

      <button
        className={styles.hamburger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Открыть меню"
      >
        ☰
      </button>

      <nav className={styles.menu}>
        <Link href="/">{t.home}</Link>
        <Link href="/about">{t.about}</Link>
        <Link href="/news">{t.news}</Link>
        <Link href="/constitution">{t.constitution}</Link>
        <Link href="/faq">{t.faq}</Link>
        <Link href="/roadmap">{t.roadmap}</Link>
        <Link href="/materials">📚 {t.materials}</Link>
        <Link href="/contacts">{t.contacts}</Link>
        <LangSwitch />
      </nav>

      {/* Мобильное меню */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
        <Link href="/" onClick={() => setIsOpen(false)}>{t.home}</Link>
        <Link href="/about" onClick={() => setIsOpen(false)}>{t.about}</Link>
        <Link href="/constitution" onClick={() => setIsOpen(false)}>{t.constitution}</Link>
        <Link href="/faq" onClick={() => setIsOpen(false)}>{t.faq}</Link>
        <Link href="/roadmap" onClick={() => setIsOpen(false)}>{t.roadmap}</Link>
        <Link href="/materials" onClick={() => setIsOpen(false)}>📚 {t.materials}</Link>
        <Link href="/contacts" onClick={() => setIsOpen(false)}>{t.contacts}</Link>
        <LangSwitch />
      </div>

      <Link className={styles.cta} href="/apply">
        {t.apply} ↗
      </Link>
    </header>
  )
}
