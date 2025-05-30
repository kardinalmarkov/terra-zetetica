// components/Nav.js
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from './Nav.module.css'
import LangSwitch from './LangSwitch'

export default function Nav() {
  const { locale } = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => setMenuOpen(false)

  const t = {
    home:         locale === 'ru' ? 'Главная'        : 'Home',
    about:        locale === 'ru' ? 'О государстве'  : 'About',
    news:         locale === 'ru' ? 'Новости'        : 'News', // 🆕
    constitution: locale === 'ru' ? 'Конституция'    : 'Constitution',
    faq:          locale === 'ru' ? 'Вопросы'        : 'FAQ',
    roadmap:      locale === 'ru' ? 'Дорожная карта' : 'Roadmap',
    materials:    locale === 'ru' ? 'Материалы'      : 'Materials',
    search:       locale === 'ru' ? 'Поиск'          : 'Search',
    contacts:     locale === 'ru' ? 'Контакты'       : 'Contacts',
    apply:        locale === 'ru' ? 'Стать гражданином' : 'Become a citizen',
  }

  return (
    <header className={styles.bar}>
      <div className={styles.logo}>
        <span className={styles.mark} />
        <strong>TERRA ZETETICA</strong>
      </div>

      <button className={styles.hamburger} onClick={toggleMenu}>☰</button>

      {/* Меню для десктопа */}
      <nav className={styles.menu}>
        <Link href="/">{t.home}</Link>
        <Link href="/about">{t.about}</Link>
        <Link href="/news">{t.news}</Link>
        <Link href="/constitution">{t.constitution}</Link>
        <Link href="/faq">{t.faq}</Link>
        <Link href="/roadmap">{t.roadmap}</Link>
        <Link href="/materials">📚</Link>
        <a href="https://zsearch.terra-zetetica.org" target="_blank" rel="noopener noreferrer" className={styles.searchLink}>🔍 {t.search}</a>
        <Link href="/contacts">{t.contacts}</Link>
        <Link className={styles.cta} href="/apply">{t.apply} ↗</Link>
        <LangSwitch />
      </nav>

      {/* Мобильное меню */}
      <nav className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        <Link href="/" onClick={closeMenu}>{t.home}</Link>
        <Link href="/about" onClick={closeMenu}>{t.about}</Link>
        <Link href="/news" onClick={closeMenu}>{t.news}</Link>
        <Link href="/constitution" onClick={closeMenu}>{t.constitution}</Link>
        <Link href="/faq" onClick={closeMenu}>{t.faq}</Link>
        <Link href="/roadmap" onClick={closeMenu}>{t.roadmap}</Link>
        <Link href="/materials" onClick={closeMenu}>📚 {t.materials}</Link>
        <a href="https://zsearch.terra-zetetica.org" onClick={closeMenu} target="_blank" rel="noopener noreferrer" className={styles.searchLink}>🔍 {t.search}</a>
        <Link href="/contacts" onClick={closeMenu}>{t.contacts}</Link>
        <Link className={styles.cta} href="/apply" onClick={closeMenu}>{t.apply} ↗</Link>
        <LangSwitch />
      </nav>
    </header>
  )
}
