// components/Nav.js
// ──────────────────────────────────────────────────────────────────────────────
// Главное навигационное меню — десктоп и мобильная версия.
// Новое: подпункты «Конституция / FAQ / Дорожная карта / Материалы» перенесены
// в выпадающее подменю «Ещё… / More…». Добавлен слоган‑тэглайн.

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
    more:         locale === 'ru' ? 'Ещё…'               : 'More…',
    dom:          locale === 'ru' ? 'Дом'                : 'Dom',
    search:       locale === 'ru' ? 'Поиск'              : 'Search',
    contacts:     locale === 'ru' ? 'Контакты'           : 'Contacts',
    login:        locale === 'ru' ? 'Вход'               : 'Login',
    apply:        locale === 'ru' ? 'Стать гражданином'  : 'Become a citizen',
    tagline:      locale === 'ru'
                    ? 'Государство создано для человека, а не человек для государства'
                    : 'The state exists for humans, not humans for the state',
  }

  return (
    <header className={styles.bar}>
      {/* ——— Логотип ——— */}
      <div className={styles.logo}>
        <span className={styles.dot} />
        <strong>TERRA ZETETICA</strong>
      </div>

      {/* ——— Слоган (десктоп, скрыт на мобиле) ——— */}
      <span className={styles.tagline}>{t.tagline}</span>

      {/* ——— Burger для мобильных ——— */}
      <button className={styles.burger} onClick={toggleMenu} aria-label="Toggle menu">
        ☰
      </button>

      {/* ——— Десктоп‑меню ——— */}
      <nav className={styles.menu}>
        <Link href="/">{t.home}</Link>
        <Link href="/about">{t.about}</Link>
        <Link href="/news">{t.news}</Link>

        {/* ▼ Подменю «Ещё… / More…» */}
        <div className={styles.moreWrap}>
          <span className={styles.moreLabel}>{t.more}</span>
          <div className={styles.submenu}>
            <Link href="/constitution">{t.constitution}</Link>
            <Link href="/faq">{t.faq}</Link>
            <Link href="/roadmap">{t.roadmap}</Link>
            <Link href="/materials">📚 {t.materials}</Link>
          </div>
        </div>

        <Link href="/dom">🏰 {t.dom}</Link>
        <a
          href="https://zsearch.terra-zetetica.org"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.searchLink}
        >
          🔍
        </a>
        <Link href="/contacts">{t.contacts}</Link>
        <Link href="/lk" className={styles.login}>{t.login}</Link>
        <Link href="/apply" className={styles.cta}>{t.apply} ↗</Link>
        <LangSwitch />
      </nav>

      {/* ——— Mobile‑панель ——— */}
      <nav className={`${styles.mobile} ${menuOpen ? styles.open : ''}`}>        
        <Link href="/" onClick={closeMenu}>{t.home}</Link>
        <Link href="/about" onClick={closeMenu}>{t.about}</Link>
        <Link href="/news" onClick={closeMenu}>{t.news}</Link>
        {/* На мобиле оставляем все пункты открытыми, без подменю */}
        <Link href="/constitution" onClick={closeMenu}>{t.constitution}</Link>
        <Link href="/faq" onClick={closeMenu}>{t.faq}</Link>
        <Link href="/roadmap" onClick={closeMenu}>{t.roadmap}</Link>
        <Link href="/materials" onClick={closeMenu}>📚 {t.materials}</Link>
        <Link href="/dom" onClick={closeMenu}>🏰 {t.dom}</Link>
        <Link href="/contacts" onClick={closeMenu}>{t.contacts}</Link>
        <Link href="/lk" className={styles.login} onClick={closeMenu}>{t.login}</Link>
        <Link href="/apply" className={`${styles.cta} ${styles.mobile}`} onClick={closeMenu}>{t.apply} ↗</Link>
        <LangSwitch />
      </nav>
    </header>
  )
}
