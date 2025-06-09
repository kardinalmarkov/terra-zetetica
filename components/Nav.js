// components/Nav.js
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import LangSwitch from './LangSwitch'
import styles from './Nav.module.css'

/* ─── утилита ─── */
const getCookie = k =>
  typeof document === 'undefined'
    ? null
    : document.cookie.split('; ')
        .find(p => p.startsWith(k + '='))?.split('=')[1] ?? null

export default function Nav () {
  const { locale } = useRouter()
  const [menuOpen, setMenu] = useState(false)
  const [isAuth,  setAuth]  = useState(undefined)   // undefined → SSR, null → гость, true → вошёл

  /* читаем cookie только на клиенте */
  useEffect(() => {
    setAuth(!!getCookie('tg'))              // «tg» ставится /api/auth; домен *.terra-zetetica.org
  }, [])

  const T = {
    home:  locale === 'ru' ? 'Главная'         : 'Home',
    about: locale === 'ru' ? 'О государстве'   : 'About',
    news:  locale === 'ru' ? 'Новости'         : 'News',
    const: locale === 'ru' ? 'Конституция'     : 'Constitution',
    faq:   locale === 'ru' ? 'Вопросы'         : 'FAQ',
    roadmap: locale === 'ru' ? 'Дорожная карта': 'Roadmap',
    contacts:locale === 'ru' ? 'Контакты'      : 'Contacts',
    apply: locale === 'ru' ? 'Стать гражданином' : 'Become a citizen',
    login: locale === 'ru' ? 'Вход' : 'Login'
  }

  const Item = ({ href, children, className }) =>
    <Link href={href} onClick={() => setMenu(false)}
          className={className}>{children}</Link>

  return (
    <header className={styles.bar}>
      {/* Логотип */}
      <div className={styles.logo}>
        <span className={styles.dot}/>
        <Link href="/" className={styles.brand}>TERRA&nbsp;ZETETICA</Link>
      </div>

      {/* Десктоп-меню */}
      <nav className={styles.menu}>
        <Item href="/">{T.home}</Item>
        <Item href="/about">{T.about}</Item>
        <Item href="/news">{T.news}</Item>
        <Item href="/constitution">{T.const}</Item>
        <Item href="/faq">{T.faq}</Item>
        <Item href="/roadmap">{T.roadmap}</Item>
        <Item href="/contacts">{T.contacts}</Item>
        <Item href="/apply" className={styles.cta}>{T.apply}&nbsp;↗</Item>

        {/* аватар или «Вход» */}
        {isAuth === undefined ? null
          : isAuth
              ? <Link href="/lk" className={styles.avatarWrap}><span className={styles.noAvatar}>👤</span></Link>
              : <Item href="/lk" className={styles.login}>{T.login}</Item>}

        <LangSwitch/>
      </nav>

      {/* Бургер */}
      <button onClick={() => setMenu(!menuOpen)} className={styles.burger}>☰</button>

      {/* Мобайл-панель */}
      <nav className={`${styles.mobile} ${menuOpen ? styles.open : ''}`}>
        <Item href="/">{T.home}</Item>
        <Item href="/about">{T.about}</Item>
        <Item href="/news">{T.news}</Item>
        <Item href="/constitution">{T.const}</Item>
        <Item href="/faq">{T.faq}</Item>
        <Item href="/roadmap">{T.roadmap}</Item>
        <Item href="/contacts">{T.contacts}</Item>
        <Item href="/apply" className={styles.cta}>{T.apply}&nbsp;↗</Item>
        {isAuth ? <Item href="/lk">👤 LK</Item> : <Item href="/lk">{T.login}</Item>}
        <LangSwitch/>
      </nav>
    </header>
  )
}
