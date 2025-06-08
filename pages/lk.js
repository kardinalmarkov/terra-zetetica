// pages/lk.js
//
// 🔒 Личный кабинет Terra Zetetica
// ───────────────────────────────────────────────────────────────
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { parse } from 'cookie'
import { supabase } from '../lib/supabase'      // <projectRoot>/lib/supabase.js

/** Кнопочный Tab-навигация без сторонних библиотек */
function Tabs ({ tabs, active, onChange }) {
  return (
    <nav style={{display:'flex',gap:12,margin:'0 0 1.2rem'}}>
      {tabs.map(t => (
        <button key={t.key}
                onClick={() => onChange(t.key)}
                style={{
                  padding:'.45rem .9rem',
                  borderRadius:6,
                  border: active===t.key ? '2px solid #6c63ff' : '1px solid #ccc',
                  background: active===t.key ? '#f7f7ff' : '#fff',
                  cursor:'pointer'
                }}>
          {t.label}
        </button>
      ))}
    </nav>
  )
}

/** Микро-спиннер «…» */
function Dots () {
  return (
    <span style={{fontFamily:'monospace',letterSpacing:2}}>
      <span style={{animation:'blink 1s infinite'}}>.</span>
      <span style={{animation:'blink 1s .2s infinite'}}>.</span>
      <span style={{animation:'blink 1s .4s infinite'}}>.</span>
      <style jsx>{`@keyframes blink{0%,60%{opacity:0}100%{opacity:1}}`}</style>
    </span>
  )
}

export default function LK ({ user }) {
  const router           = useRouter()
  const [citizen,setCit] = useState()      // undefined -> ждём / null -> нет строки
  const [tab,setTab]     = useState('profile')

  /* ─── Если есть пользователь — ищем его в Supabase ─── */
  useEffect(() => {
    if (!user) return             // без авторизации просто покажем виджет
    supabase.from('citizens')
            .select('*')
            .eq('telegram_id', user.id)
            .maybeSingle()
            .then(({ data, error }) => {
              if (error) console.error(error)
              setCit(data ?? null)
            })
  }, [user])

  /* ─── Выход: убиваем cookie tg и на главную ─── */
  async function handleLogout () {
    await fetch('/api/logout', { method:'POST' })
    router.push('/')              // страница перезагрузится без куки
  }

  /* ─── Хелпер статусов ─── */
  const renderStatus = () => {
    if (!citizen)             return '✖ Гражданство не получено'
    if (citizen.status==='valid') return '✅ Гражданин Terra Zetetica'
    return '❓ Гражданство в обработке'
  }

  /* ─── 0) Нет куки → кнопка входа Telegram ─── */
  if (!user) {
    return (
      <main style={{maxWidth:640,margin:'0 auto',padding:'2rem 1rem'}}>
        <h2>Авторизация</h2>
        <p>Пожалуйста, войдите через Telegram:</p>
        <div
          dangerouslySetInnerHTML={{
            __html: `
<script async src="https://telegram.org/js/telegram-widget.js?15"
  data-telegram-login="ZeteticID_bot"
  data-size="large"
  data-userpic="true"
  data-lang="ru"
  data-auth-url="/api/auth"
  data-request-access="write"></script>`}}
        />
      </main>
    )
  }

  /* ─── 1) Авторизованы, но ещё ждём Supabase ─── */
  if (citizen === undefined) {
    return (
      <main style={{padding:'2.5rem',textAlign:'center'}}>
        <p>Загружаем ваши данные <Dots/></p>
      </main>
    )
  }

  /* ─── 2) Нормальный кабинет ─── */
  return (
    <>
      <Head><title>Личный кабинет • Terra Zetetica</title></Head>
      <main style={{maxWidth:820,margin:'0 auto',padding:'2rem 1rem',fontSize:'1.04rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
          <strong>Здравствуйте, {user.first_name} {user.last_name||''}! 🙌&nbsp;Рады вас видеть.</strong>
          <button onClick={handleLogout} style={{padding:'.35rem .9rem',cursor:'pointer'}}>Выйти</button>
        </div>

        <Tabs
          tabs={[
            {key:'profile',  label:'🙏 Профиль'},
            {key:'passport', label:'📜 Паспорт / 🏠 Челлендж'},
            {key:'progress', label:'📈 Прогресс'}
          ]}
          active={tab}
          onChange={setTab}
        />

        {/* ───────── Профиль ───────── */}
        {tab==='profile' && (
          <section>
            {/* Аватар с <img>, чтобы не возиться с remotePatterns */}
            <img src={user.photo_url}
                 alt="avatar"
                 width={120}
                 height={120}
                 style={{borderRadius:8,objectFit:'cover'}} />
            <p>ID Telegram: <b>{user.id}</b></p>
            <p>Телеграм имя: <b>@{user.username||'—'}</b></p>
            <p>{citizen ? 'Запись найдена в БД ✔️':'В БД записи нет ❌'}</p>
            <p>Статус: {renderStatus()}</p>
          </section>
        )}

        {/* ───────── Паспорт / Челлендж ───────── */}
        {tab==='passport' && (
          <section>
            {citizen ? (
              <>
                <p>Z-ID: <b>{citizen.zetetic_id || '—'}</b></p>
                <p>
                  IPFS-паспорт:&nbsp;
                  {citizen.ipfs_url
                    ? <a href={citizen.ipfs_url} target="_blank" rel="noopener noreferrer">ссылка</a>
                    : '—'}
                </p>
                <p>Статус челленджа: {citizen.challenge_status || '—'}</p>
              </>
            ) : (
              <>
                <p>У вас пока нет гражданства. Подать заявку можно здесь:</p>
                <a href="/apply"
                   style={{display:'inline-block',padding:'.5rem 1.1rem',
                           border:'1px solid #6c63ff',borderRadius:6,
                           color:'#6c63ff',textDecoration:'none'}}>Стать гражданином</a>
              </>
            )}
          </section>
        )}

        {/* ───────── Прогресс (плейсхолдер) ───────── */}
        {tab==='progress' && (
          <section>
            <p>Здесь будет отображаться ваш прогресс по заданиям.</p>
            <p style={{opacity:.55}}>Раздел в разработке.</p>
          </section>
        )}
      </main>
    </>
  )
}

/* ───────── SSR: достаём Telegram-cookie, но НЕ редиректим ───────── */
export async function getServerSideProps ({ req }) {
  const cookies = parse(req.headers.cookie || '')
  let user = null
  if (cookies.tg) {
    try {
      user = JSON.parse(Buffer.from(cookies.tg,'base64').toString())
    } catch {/* повреждённая кука — игнор */}
  }
  return { props:{ user } }
}
