// pages/lk.js
import Head          from 'next/head'
import Link          from 'next/link'
import { parse }     from 'cookie'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import ClipLoader    from 'react-spinners/ClipLoader'
import { supabase }  from '../lib/supabase'

export default function LK({ user }) {
  const router = useRouter()
  const [citizen, setCitizen] = useState(null)
  const [progress, setProgress] = useState(0)
  const [notesMap, setNotesMap] = useState({})
  const [tab, setTab] = useState('profile')

  // Синхронизация таба с ?tab=
  useEffect(() => {
    if (router.query.tab) setTab(router.query.tab)
  }, [router.query.tab])

  const switchTab = key => {
    setTab(key)
    router.push(`/lk?tab=${key}`, undefined, { shallow: true })
  }

  // Выход
  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.replace('/')
  }

  // Если не авторизован — Telegram-виджет
  if (!user) {
    return (
      <main style={{ padding:'2rem', maxWidth:600, margin:'0 auto' }}>
        <h2>Авторизация</h2>
        <p>Войдите через Telegram:</p>
        <div dangerouslySetInnerHTML={{ __html: `
<script async src="https://telegram.org/js/telegram-widget.js?15"
  data-telegram-login="ZeteticID_bot"
  data-size="large"
  data-userpic="true"
  data-lang="ru"
  data-request-access="write"
  data-auth-url="/api/auth"></script>` }} />
      </main>
    )
  }

  // Загружаем запись о гражданине
  useEffect(() => {
    supabase
      .from('citizens')
      .select('*')
      .eq('telegram_id', user.id)
      .maybeSingle()
      .then(({ data }) => setCitizen(data))
  }, [user])

  // Загружаем прогресс и заметки
  useEffect(() => {
    if (!citizen?.id) return
    supabase
      .from('daily_progress')
      .select('*', { head:true, count:'exact' })
      .eq('citizen_id', citizen.id)
      .then(({ count }) => setProgress(count || 0))

    supabase
      .from('daily_progress')
      .select('day_no, notes')
      .eq('citizen_id', citizen.id)
      .then(({ data }) => {
        const m = {}
        data.forEach(r => { if (r.notes) m[r.day_no] = r.notes })
        setNotesMap(m)
      })
  }, [citizen])

  // Рендер кнопки «🚀 Начать челлендж» для неграждан
  const renderPassport = () => {
    if (citizen?.status === 'valid') {
      return (
        <>
          <p>Z-ID: <b>{citizen.zetetic_id || '—'}</b></p>
          <p>IPFS: {citizen.ipfs_url
            ? <a href={citizen.ipfs_url} target="_blank" rel="noreferrer">ссылка</a>
            : '—'}
          </p>
        </>
      )
    }
    return (
      <button onClick={()=>router.push('/challenge')} className="btn btn-primary">
        🚀 Начать челлендж
      </button>
    )
  }

  return (
    <>
      <Head><title>Личный кабинет • Terra Zetetica</title></Head>
      <main style={{ maxWidth:800, margin:'0 auto', padding:'2rem' }}>
        <header style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
          <strong>Здравствуйте, {user.first_name}!</strong>
          <button onClick={logout} className="btn-secondary">Выйти</button>
        </header>

        <nav style={{ display:'flex', gap:12, marginBottom:18 }}>
          {[
            { key:'profile',  label:'🙏 Профиль' },
            { key:'passport', label:'📜 Паспорт / 🏠 Челлендж' },
            { key:'progress', label:'📈 Прогресс' }
          ].map(t => (
            <button
              key={t.key}
              onClick={()=>switchTab(t.key)}
              style={{
                padding:'0.5rem 0.9rem',
                borderRadius:6,
                border: tab===t.key ? '2px solid #6c63ff' : '1px solid #ccc',
                background: tab===t.key ? '#f0f0ff' : '#fff',
                cursor:'pointer'
              }}
            >{t.label}</button>
          ))}
        </nav>

        {tab==='profile' && (
          <section>
            <img src={user.photo_url} alt="" width={120} height={120} style={{ borderRadius:8 }}/>
            <p>ID Telegram: <b>{user.id}</b></p>
            {user.username && <p>Username: <b>@{user.username}</b></p>}
            <p><b>Запись в БД:</b> {citizen ? '✔️ есть' : '❌ нет'}</p>
            <p><b>Статус:</b> {citizen?.status==='valid' ? '✅ Гражданин' : '❓ Не гражданин'}</p>
          </section>
        )}

        {tab==='passport' && <section>{renderPassport()}</section>}

        {tab==='progress' && (
          <section>
            <p>Дней пройдено: <b>{progress}</b> / 14</p>
            <div style={{ background:'#eee', height:12, borderRadius:6, maxWidth:400 }}>
              <div style={{
                width:`${(progress/14)*100}%`, height:'100%', background:'#6c63ff', borderRadius:6
              }}/>
            </div>

            {progress > 0 ? (
              <>
                <Link href={`/challenge?day=${progress}`}>↩️ Пересмотреть текущий день</Link>
              </>
            ) : (
              <p style={{ opacity:0.7, marginTop:12 }}>
                Для старта нажмите <Link href="/dom">«Присоединиться»</Link>
              </p>
            )}

            {progress>0 && (
              <section style={{ marginTop:24 }}>
                <h4>Заметки по дням</h4>
                <ul>
                  {Array.from({ length: progress }).map((_, i) => (
                    <li key={i}>День {i+1}: <i>{notesMap[i+1] || '– нет –'}</i></li>
                  ))}
                </ul>
              </section>
            )}
          </section>
        )}
      </main>
    </>
  )
}

export async function getServerSideProps({ req }) {
  const { tg } = parse(req.headers.cookie || '')
  const user    = tg ? JSON.parse(Buffer.from(tg,'base64').toString()) : null
  return { props: { user } }
}
