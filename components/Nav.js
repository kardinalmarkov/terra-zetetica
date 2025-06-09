// components/Nav.js
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import styles from './Nav.module.css'
import LangSwitch from './LangSwitch'

/* лёгкий парсер одной cookie */
const getCookie = name =>
  typeof document==='undefined'
    ? null
    : document.cookie
        .split('; ')
        .find(r => r.startsWith(name+'='))?.split('=')[1] ?? null

export default function Nav () {
  const { locale }   = useRouter()
  const [menu,setMenu] = useState(false)
  const [user,setUser] = useState(null)            // { username, photo_url }

  /* читаем tg-cookie только на клиенте */
  useEffect(() => {
    if (getCookie('cid')) setUser({})  /* факт входа достаточно */
  }, [])

  const T = {                                     // короткие подписи
    home : locale==='ru' ? 'Главная' : 'Home',
    about: locale==='ru' ? 'О государстве' : 'About',
    news : locale==='ru' ? 'Новости' : 'News',
    constitution: locale==='ru' ? 'Конституция':'Constitution',
    faq  : locale==='ru' ? 'Вопросы' : 'FAQ',
    roadmap:      locale==='ru' ? 'Дорожная карта' : 'Roadmap',
    contacts:     locale==='ru' ? 'Контакты'       : 'Contacts',
    apply:        locale==='ru' ? 'Стать гражданином' : 'Become a citizen',
    login:        locale==='ru' ? 'Вход' : 'Login'
  }

  const Item = ({href,children,className}) =>
    <Link href={href} onClick={()=>setMenu(false)} className={className}>{children}</Link>

  return (
    <header className={styles.bar}>
      <div className={styles.logo}>
        <span className={styles.dot}/><Link href="/" className={styles.brand}>TERRA ZETETICA</Link>
      </div>

      {/* desktop */}
      <nav className={styles.menu}>
        <Item href="/">{T.home}</Item>
        <Item href="/about">{T.about}</Item>
        <Item href="/news">{T.news}</Item>
        <Item href="/constitution">{T.constitution}</Item>
        <Item href="/faq">{T.faq}</Item>
        <Item href="/roadmap">{T.roadmap}</Item>
        <Item href="/contacts">{T.contacts}</Item>
        <Item href="/apply" className={styles.cta}>{T.apply} ↗</Item>

        {/* avatar / login */}
        {user
          ? <Link href="/lk" className={styles.avatarWrap}>
              {user.photo_url
                ? <img src={user.photo_url} alt="me" className={styles.avatar}/>
                : <span className={styles.noAvatar}>👤</span>}
            </Link>
          : <Item href="/lk" className={styles.login}>{T.login}</Item>}
        <LangSwitch/>
      </nav>

      {/* burger + mobile panel */}
      <button onClick={()=>setMenu(!menu)} className={styles.burger}>☰</button>
      <nav className={`${styles.mobile} ${menu?styles.open:''}`}>
        {/* пункты те же */}
        <Item href="/">{T.home}</Item>
        <Item href="/about">{T.about}</Item>
        <Item href="/news">{T.news}</Item>
        <Item href="/constitution">{T.constitution}</Item>
        <Item href="/faq">{T.faq}</Item>
        <Item href="/roadmap">{T.roadmap}</Item>
        <Item href="/contacts">{T.contacts}</Item>
        <Item href="/apply" className={styles.cta}>{T.apply} ↗</Item>
        {user
          ? <Item href="/lk">👤 {user.username||'LK'}</Item>
          : <Item href="/lk">{T.login}</Item>}
        <LangSwitch/>
      </nav>
    </header>
  )
}
