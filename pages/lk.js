// pages/lk.js
import Head        from 'next/head'
import Link        from 'next/link'
import { parse }   from 'cookie'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import ClipLoader  from 'react-spinners/ClipLoader'
import DayPicker   from '../components/DayPicker'
import { supabase } from '../lib/supabase'

function Tabs({ tabs, active, onChange }) {
  return (
    <nav style={{display:'flex', gap:12, marginBottom:18}}>
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={()=>onChange(t.key)}
          style={{
            padding:'.5rem .9rem',
            borderRadius:6,
            border: active===t.key ? '2px solid #6c63ff' : '1px solid #ccc',
            background: active===t.key ? '#f0f0ff' : '#fff',
            cursor:'pointer'
          }}>
          {t.label}
        </button>
      ))}
    </nav>
  )
}

export default function LK({ user }) {
  const router = useRouter()
  const [citizen, setCitizen]   = useState()
  const [progress, setProgress] = useState(0)
  const [notesMap, setNotesMap] = useState({})
  const [tab, setTab]           = useState('profile')

  // выход
  async function logout() {
    await fetch('/api/logout', { method:'POST' })
    router.replace('/')
  }

  // 0) если нет tg-cookie — Telegram-виджет
  if (!user) {
    return (
      <main style={{padding:'2rem', maxWidth:600,margin:'0 auto'}}>
        <h2>Авторизация</h2>
        <p>Войдите через Telegram:</p>
        <div dangerouslySetInnerHTML={{__html:`
<script async src="https://telegram.org/js/telegram-widget.js?15"
        data-telegram-login="ZeteticID_bot"
        data-size="large"
        data-userpic="true"
        data-lang="ru"
        data-request-access="write"
        data-auth-url="/api/auth"></script>`}}/>
      </main>
    )
  }

  // 1) получаем запись citizen
  useEffect(()=>{
    supabase
      .from('citizens')
      .select('*').eq('telegram_id', user.id).maybeSingle()
      .then(({ data }) => setCitizen(data ?? null))
  },[user])

  // 2) прогресс
  useEffect(()=>{
    if (!citizen?.id) return
    supabase
      .from('daily_progress')
      .select('*',{ head:true, count:'exact' })
      .eq('citizen_id', citizen.id)
      .then(({ count }) => setProgress(count||0))
  },[citizen])

  // 3) заметки по дням
  useEffect(()=>{
    if (!citizen?.id) return
    supabase
      .from('daily_progress')
      .select('day_no,notes')
      .eq('citizen_id', citizen.id)
      .then(({ data })=>{
        const m = {}
        data.forEach(r=> { if (r.notes) m[r.day_no] = r.notes })
        setNotesMap(m)
      })
  },[citizen])

  // статус гражданства
  function renderStatus() {
    if (!citizen)               return '✖ Гражданство не получено'
    if (citizen.status==='valid') return '✅ Гражданин Terra Zetetica'
    return '❓ В обработке'
  }

  // 1) ждём Supabase
  if (citizen === undefined) {
    return <main style={{padding:'2rem', textAlign:'center'}}><ClipLoader size={40} color="#6c63ff"/></main>
  }

  // 2) основной UI
  return (
    <>
      <Head><title>Личный кабинет • Terra Zetetica</title></Head>
      <main style={{maxWidth:800, margin:'0 auto', padding:'2rem'}}>

        <header style={{display:'flex', justifyContent:'space-between', marginBottom:20}}>
          <strong>Здравствуйте, {user.first_name}!</strong>
          <button onClick={logout} className="btn-secondary">Выйти</button>
        </header>

        <Tabs
          active={tab}
          onChange={setTab}
          tabs={[
            {key:'profile',  label:'🙏 Профиль'},
            {key:'passport', label:'📜 Паспорт / 🏠 Челлендж'},
            {key:'progress', label:'📈 Прогресс'},
          ]}
        />

        {tab==='profile' && (
          <section>
            <img src={user.photo_url} alt="avatar" width={120} height={120} style={{borderRadius:8}}/>
            <p>ID Telegram: <b>{user.id}</b></p>
            {user.username && <p>Username: <b>@{user.username}</b></p>}
            <p><b>Запись в БД:</b> {citizen ? '✔️ есть' : '❌ нет'}</p>
            <p><b>Статус:</b> {renderStatus()}</p>
          </section>
        )}

        {tab==='passport' && (
          <section>
            {citizen
              ? <>
                  <p>Z-ID: <b>{citizen.zetetic_id||'—'}</b></p>
                  <p>IPFS Passport: {citizen.ipfs_url
                    ? <a href={citizen.ipfs_url} target="_blank">ссылка</a>
                    : '—'}
                  </p>
                  <p>Challenge: <b>{citizen.challenge_status||'—'}</b></p>
                </>
              : <p>Сначала зарегистрируйтесь, чтобы участвовать.</p>
            }
          </section>
        )}

        {tab==='progress' && (
          <section>
            <p>Дней пройдено: <b>{progress}</b> / 14</p>
            <div style={{background:'#eee',height:12, borderRadius:6, maxWidth:400}}>
              <div style={{
                width:`${(progress/14)*100}%`,
                height:'100%',
                background:'#6c63ff',
                borderRadius:6
              }}/>
            </div>

            {progress===0 && (
              <p style={{opacity:0.7, marginTop:12}}>
                Нажмите <Link href="/dom">«Присоединиться»</Link>, чтобы стартовать.
              </p>
            )}

            {progress>0 && (
              <>
                <p style={{marginTop:12}}>
                  ↩️ <Link href={`/challenge?day=${progress}`}>Пересмотреть день {progress}</Link>
                </p>
                <DayPicker
                  currentDay={progress}
                  maxDay={progress}
                  onChange={n=>router.push(`/challenge?day=${n}`)}
                />
              </>
            )}

            {progress>0 && (
              <section style={{marginTop:24}}>
                <h4>Заметки по дням</h4>
                <ul>
                  {Array.from({length:progress}).map((_,i)=>(
                    <li key={i}>
                      День {i+1}: <i>{notesMap[i+1]||'– нет –'}</i>
                    </li>
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
  const { tg } = parse(req.headers.cookie||'')
  const user = tg ? JSON.parse(Buffer.from(tg,'base64').toString()) : null
  return { props:{ user } }
}
