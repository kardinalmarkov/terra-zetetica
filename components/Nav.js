// components/Nav.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './Nav.module.css';
import LangSwitch from './LangSwitch';

export default function Nav() {
  const { locale } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const t = {
    home:         locale === 'ru' ? 'Главная'         : 'Home',
    about:        locale === 'ru' ? 'О государстве'   : 'About',
    constitution: locale === 'ru' ? 'Конституция'     : 'Constitution',
    faq:          locale === 'ru' ? 'Вопросы'         : 'FAQ',
    roadmap:      locale === 'ru' ? 'Дорожная карта'  : 'Roadmap',
    contacts:     locale === 'ru' ? 'Контакты'        : 'Contacts',
    apply:        locale === 'ru' ? 'Стать гражданином' : 'Become a citizen',
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className={styles.bar}>
      <div className={styles.logo}>
        <span className={styles.mark} />
        <strong>TERRA ZETETICA</strong>
      </div>

      {/* Гамбургер */}
      <button className={styles.hamburger} onClick={toggleMenu}>☰</button>

      {/* Десктоп-меню */}
      <nav className={styles.menu}>
        <Link href="/">{t.home}</Link>
        <Link href="/about">{t.about}</Link>
        <Link href="/constitution">{t.constitution}</Link>
        <Link href="/faq">{t.faq}</Link>
        <Link href="/roadmap">{t.roadmap}</Link>
        <Link href="/materials">📚</Link>
        <Link href="/contacts">{t.contacts}</Link>
        <LangSwitch />
      </nav>

      {/* Мобильное меню */}
      <nav className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        <Link href="/" onClick={toggleMenu}>{t.home}</Link>
        <Link href="/about" onClick={toggleMenu}>{t.about}</Link>
        <Link href="/constitution" onClick={toggleMenu}>{t.constitution}</Link>
        <Link href="/faq" onClick={toggleMenu}>{t.faq}</Link>
        <Link href="/roadmap" onClick={toggleMenu}>{t.roadmap}</Link>
        <Link href="/materials" onClick={toggleMenu}>📚</Link>
        <Link href="/contacts" onClick={toggleMenu}>{t.contacts}</Link>
        <LangSwitch />
      </nav>

      <Link className={styles.cta} href="/apply">{t.apply} ↗</Link>
    </header>
  );
}
