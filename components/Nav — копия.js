// components/Nav.js
// ──────────────────────────────────────────────────────────────────────────────
// Главное навигационное меню — десктоп и мобильная версия с гамбургером.
// Включает вкладки: Главная, О государстве, Новости, Конституция, Вопросы,
// Дорожная карта, Материалы, Поиск (внешний), Контакты, Вход, Стать гражданином.

import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from './Nav.module.css'
import LangSwitch from './LangSwitch'

export default function Nav() {
  const { locale } = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu  = () => setMenuOpen(false)

  const t = {
    home:         locale === 'ru' ? 'Главная'            : 'Home',
    about:        locale === 'ru' ? 'О государстве'      : 'About',
    news:         locale === 'ru' ? 'Новости'            : 'News',
    constitution: locale === 'ru' ? 'Конституция'        : 'Constitution',
    faq:          locale === 'ru' ? 'Вопросы'            : 'FAQ',
    roadmap:      locale === 'ru' ? 'Дорожная карта'     : 'Roadmap',
    materials:    locale === 'ru' ? 'Материалы'          : 'Materials',
    dom:          locale === 'ru' ? 'Дом'                : 'Dom',
    search:       locale === 'ru' ? 'Поиск'              : 'Search',
    contacts:     locale === 'ru' ? 'Контакты'           : 'Contacts',
    login:        locale === 'ru' ? 'Вход'               : 'Login',
    apply:        locale === 'ru' ? 'Стать гражданином'  : 'Become a citizen',
  }

  return (
    <header className={styles.bar}>
      <div className={styles.logo}>
        <span className={styles.dot} />
        <strong>TERRA ZETETICA</strong>
      </div>

      {/* кнопка-гамбургер для мобильных */}
      <button className={styles.burger} onClick={toggleMenu} aria-label="Toggle menu">
        ☰
      </button>

      {/* Меню для десктопа */}
      <nav className={styles.menu}>
        <Link href="/">{t.home}</Link>
        <Link href="/about">{t.about}</Link>
        <Link href="/news">{t.news}</Link>
        <Link href="/constitution">{t.constitution}</Link>
        <Link href="/faq">{t.faq}</Link>
        <Link href="/roadmap">{t.roadmap}</Link>
        <Link href="/materials">📚 {t.materials}</Link>
        <Link href="/dom">🏰 {t.dom}</Link>
        <a
          href="https://zsearch.terra-zetetica.org"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.searchLink}
        >
          🔍 {t.search}
        </a>
        <Link href="/contacts">{t.contacts}</Link>

        {/* ссылка на вход/личный кабинет */}
        <Link href="/lk" className={styles.login}>{t.login}</Link>

        {/* основная кнопка призыва */}
        <Link href="/apply" className={styles.cta}>{t.apply} ↗</Link>

        <LangSwitch />
      </nav>

      {/* Мобильная панель меню */}
      <nav className={`${styles.mobile} ${menuOpen ? styles.open : ''}`}>        
        <Link href="/" onClick={closeMenu}>{t.home}</Link>
        <Link href="/about" onClick={closeMenu}>{t.about}</Link>
        <Link href="/news" onClick={closeMenu}>{t.news}</Link>
        <Link href="/constitution" onClick={closeMenu}>{t.constitution}</Link>
        <Link href="/faq" onClick={closeMenu}>{t.faq}</Link>
        <Link href="/roadmap" onClick={closeMenu}>{t.roadmap}</Link>
        <Link href="/materials" onClick={closeMenu}>📚 {t.materials}</Link>
        <Link href="/dom" onClick={closeMenu}>🏰 {t.dom}</Link>
        <a
          href="https://zsearch.terra-zetetica.org"
          onClick={closeMenu}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.searchLink}
        >
          🔍 {t.search}
        </a>
        <Link href="/contacts" onClick={closeMenu}>{t.contacts}</Link>
        <Link href="/lk" className={styles.login} onClick={closeMenu}>{t.login}</Link>
        <Link href="/apply" className={`${styles.cta} ${styles.mobile}`} onClick={closeMenu}>{t.apply} ↗</Link>
        <LangSwitch />
      </nav>
    </header>
  )
}
