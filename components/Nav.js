// components/Nav.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from './Nav.module.css';
import LangSwitch from './LangSwitch';
// import { parse } from 'cookie';
// простейший парсер куки вместо npm-библиотеки
function parseCookie (name) {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))?.split('=')[1];
}

export default function Nav () {
  const { locale, asPath } = useRouter();
  const [menuOpen, setOpen] = useState(false);
  const [user, setUser]     = useState(null);     // { username, photo_url }

  /* ───── читаем cookie tg только на клиенте ───── */
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const raw = parseCookie('tg');
    if (raw)  setUser(JSON.parse(atob(raw)));

      try { setUser(JSON.parse(atob(c.tg))); } catch {/* ignore */}
    }
  }, []);

  const t = {
    home:         locale==='ru' ? 'Главная'        : 'Home',
    about:        locale==='ru' ? 'О государстве'  : 'About',
    news:         locale==='ru' ? 'Новости'        : 'News',
    constitution: locale==='ru' ? 'Конституция'    : 'Constitution',
    faq:          locale==='ru' ? 'Вопросы'        : 'FAQ',
    roadmap:      locale==='ru' ? 'Дорожная карта' : 'Roadmap',
    materials:    locale==='ru' ? 'Материалы'      : 'Materials',
    search:       locale==='ru' ? 'Поиск'          : 'Search',
    contacts:     locale==='ru' ? 'Контакты'       : 'Contacts',
    apply:        locale==='ru' ? 'Стать гражданином' : 'Become a citizen',
    login:        locale==='ru' ? 'Вход'           : 'Login'
  };

  /** пункт меню одинаковый для desktop / mobile */
  const Item = ({href,children,className}) =>
    <Link href={href} onClick={()=>setOpen(false)} className={className}>{children}</Link>;

  return (
    <header className={styles.bar}>
      <div className={styles.logo}>
        <span className={styles.dot} />
        <Link href="/" className={styles.brand}>TERRA ZETETICA</Link>
      </div>

      {/* desktop */}
      <nav className={styles.menu}>
        <Item href="/">{t.home}</Item>
        <Item href="/about">{t.about}</Item>
        <Item href="/news">{t.news}</Item>
        <Item href="/constitution">{t.constitution}</Item>
        <Item href="/faq">{t.faq}</Item>
        <Item href="/roadmap">{t.roadmap}</Item>
        <Item href="/materials">📚</Item>
        <a href="https://zsearch.terra-zetetica.org" target="_blank"
           rel="noopener noreferrer" className={styles.searchLink}>🔍 {t.search}</a>
        <Item href="/contacts">{t.contacts}</Item>
        <Item href="/apply" className={styles.cta}>{t.apply} ↗</Item>

        {/* Аватар / Вход */}
        {user
          ? <Link href="/lk" className={styles.avatarWrap}>
              {user.photo_url
                ? <img src={user.photo_url} alt="me" className={styles.avatar}/>
                : <span className={styles.noAvatar}>👤</span>}
            </Link>
          : <Item href="/lk" className={styles.login}>{t.login}</Item>}
        <LangSwitch />
      </nav>

      {/* mobile hamburger */}
      <button onClick={()=>setOpen(!menuOpen)} className={styles.burger}>☰</button>

      {/* mobile panel */}
      <nav className={`${styles.mobile} ${menuOpen?styles.open:''}`}>
        <Item href="/">{t.home}</Item>
        <Item href="/about">{t.about}</Item>
        <Item href="/news">{t.news}</Item>
        <Item href="/constitution">{t.constitution}</Item>
        <Item href="/faq">{t.faq}</Item>
        <Item href="/roadmap">{t.roadmap}</Item>
        <Item href="/materials">📚 {t.materials}</Item>
        <a href="https://zsearch.terra-zetetica.org"
           target="_blank" rel="noopener noreferrer"
           onClick={()=>setOpen(false)} className={styles.searchLink}>🔍 {t.search}</a>
        <Item href="/contacts">{t.contacts}</Item>
        <Item href="/apply" className={styles.cta}>{t.apply} ↗</Item>
        {user
          ? <Item href="/lk">👤 {user.username || 'LK'}</Item>
          : <Item href="/lk">{t.login}</Item>}
        <LangSwitch />
      </nav>
    </header>
  );
}
