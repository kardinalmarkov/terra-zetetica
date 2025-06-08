// pages/lk.js
// Личный кабинет + прогресс челленджа

import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { parse } from 'cookie'
import { supabase } from '../lib/supabase'
import ClipLoader from 'react-spinners/ClipLoader'      // npm i react-spinners

/* ───────── Tabs ───────── */
function Tabs ({ tabs, active, onChange }) {
  return (
    <nav style={{display:'flex',gap:12,marginBottom:18}}>
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

export default function LK ({ user }) {
  const router = useRouter()
  const [citizen,  setCitizen]  = useState()      // undefined → loading
  const [progress, setProgress] = useState(0)     // 0‒14
  const [tab,      setTab]      = useState('profile')

  /* ─── Запрос расширенной информации ─── */
  useEffect(() => {
    if (!user) return

    // 1) Гражданин
    supabase
      .from('citizens')
      .select('*')
      .eq('telegram_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error(error)
        setCitizen(data ?? null)
      })
  }, [user])

  /* ─── Запрашиваем прогресс, когда узнали citizen.id ─── */
  useEffect(() => {
    if (!citizen?.id) return

    supabase
      .from('daily_progress')
      .select('*', { head:true, count:'exact' })
      .eq('citizen_id', citizen.id)
      .then(({ count, error }) => {
        if (error) console.error(error)
        setProgress(count ?? 0)
      })
  }, [citizen])

  /* ─── Выход ─── */
  async function logout () {
    await fetch('/api/logout', { method:'POST' })
    router.replace('/')
  }

  /* ─── Красивый статус ─── */
  function renderStatus () {
    if (!citizen) return '✖ Гражданство не получено'
    if (citizen.status === 'valid') return '✅ Гражданин Terra Zetetica'
    return '❓ Гражданство в обработке'
  }

  /* ─── 0) Нет куки — Telegram-виджет ─── */
  if (!user) {
    return (
      <main style={{maxWidth:640,margin:'0 auto',padding:'2rem 1rem'}}>
        <h2>Авторизация</h2>
        <p>Войдите через Telegram:</p>
        <div dangerouslySetInnerHTML={{ __html: `
<script async src="https://telegram.org/js/telegram-widget.js?15"
        data-telegram-login="ZeteticID_bot"
        data-size="large"
        data-userpic="true"
        data-lang="ru"
        data-request-access="write"
        data-auth-url="/api/auth"></script>`}}
        />
      </main>
    )
  }

  /* ─── 1) Ждём Supabase ─── */
  if (citizen === undefined) {
    return (
      <main style={{padding:'2.5rem',textAlign:'center'}}>
        <ClipLoader color="#6c63ff" size={40}/>
      </main>
    )
  }

  /* ─── 2) Нормальный кабинет ─── */
  return (
    <>
      <Head><title>Личный кабинет • Terra Zetetica</title></Head>

      <main style={{maxWidth:820,margin:'0 auto',padding:'2rem 1rem'}}>
        <header style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
          <strong>Здравствуйте, {user.first_name} {user.last_name||''}! 🙌</strong>
          <button onClick={logout} style={{padding:'.35rem .9rem'}}>Выйти</button>
        </header>

        <Tabs active={tab} onChange={setTab} tabs={[
          { key:'profile',  label:'🙏 Профиль' },
          { key:'passport', label:'📜 Паспорт / 🏠 Челлендж' },
          { key:'progress', label:'📈 Прогресс' }
        ]}/>

        {/* ─── Профиль ─── */}
        {tab==='profile' && (
          <section>
            <img src={user.photo_url} alt="avatar"
                 width={120} height={120}
                 style={{borderRadius:8,objectFit:'cover'}} />
            <p>ID Telegram: <b>{user.id}</b></p>
            {user.username && <p>Username: <b>@{user.username}</b></p>}
            <p>{citizen ? 'Запись найдена в БД ✔️' : 'В БД записи нет ❌'}</p>
            <p><b>Статус:</b> {renderStatus()}</p>
          </section>
        )}

        {/* ─── Паспорт / Челлендж ─── */}
        {tab==='passport' && (
          <section>
            {citizen ? (
              <>
                <p>Z-ID: <b>{citizen.zetetic_id || '—'}</b></p>
                <p>IPFS-паспорт:&nbsp;
                  {citizen.ipfs_url
                    ? <a href={citizen.ipfs_url} target="_blank">ссылка</a>
                    : '—'}
                </p>
                <p>Статус челленджа: <b>{citizen.challenge_status}</b></p>
              </>
            ) : (
              <p>Сначала получите гражданство, чтобы участвовать в челлендже.</p>
            )}
          </section>
        )}

        {/* ─── Прогресс ─── */}
        {tab==='progress' && (
          <section>
            <p>Дней пройдено: <b>{progress}</b> / 14</p>
            <div style={{height:12,background:'#eee',borderRadius:6,maxWidth:400}}>
              <div style={{
                height:'100%',
                width:`${(progress/14)*100}%`,
                background:'#6c63ff',
                borderRadius:6
              }}/>
            </div>
            {progress===0 && <p style={{opacity:.6}}>Нажмите «Присоединиться» на странице «Дом за шар», чтобы начать.</p>}
          </section>
        )}
      </main>
    </>
  )
}

/* ─── SSR: читаем cookie (без редиректа) ─── */
export async function getServerSideProps ({ req }) {
  const { tg } = parse(req.headers.cookie || '')
  const user = tg ? JSON.parse(Buffer.from(tg,'base64').toString()) : null
  return { props:{ user } }
}
