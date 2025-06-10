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
  const [tab, setTab] = useState(router.query.tab || 'profile')

  useEffect(() => {
    if (router.query.tab) setTab(router.query.tab)
  }, [router.query.tab])

  const switchTab = key => {
    setTab(key)
    router.push(`/lk?tab=${key}`, undefined, { shallow: true })
  }

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.replace('/')
  }

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

  useEffect(() => {
    supabase
      .from('citizens')
      .select('*')
      .eq('telegram_id', user.id)
      .maybeSingle()
      .then(({ data }) => setCitizen(data))
  }, [user])

  useEffect(() => {
    if (!citizen?.id) return
    supabase
      .from('daily_progress')
      .select('*', { count:'exact' })
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

  return (
    <>
      <Head><title>Личный кабинет • Terra Zetetica</title></Head>
      <main style={{ maxWidth:800, margin:'2rem auto', padding:'0 1rem' }}>
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
              onClick={() => switchTab(t.key)}
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

      {tab === 'passport' && (
        <section>
          {/* Если пользователь в БД */}
          {citizen ? (
            <>
              <p>
                <strong>Z-ID:</strong>&nbsp;
                {citizen.zetetic_id || '—'}
              </p>
              <p>
                <strong>IPFS:</strong>&nbsp;
                {citizen.ipfs_url
                  ? <a href={citizen.ipfs_url} target="_blank" rel="noreferrer">ссылка</a>
                  : '—'
                }
              </p>

              {/* Для неактивных граждан — кнопка старта */}
              {citizen.challenge_status === 'inactive' && (
                <button
                  onClick={() =>
                    fetch('/api/challenge/start', { method:'POST' })
                      .then(()=>router.push('/challenge?day=1'))
                  }
                  className="btn primary"
                >
                  🚀 Начать челлендж
                </button>
              )}

              {/* Для активных граждан — статус участия */}
              {citizen.challenge_status === 'active' && (
                <p style={{ marginTop:16, color:'#007bff' }}>
                  🏠 Вы участвуете в акции&nbsp;
                  <Link href="/dom"><a style={{textDecoration:'underline'}}>«Дом за доказательство шара»</a></Link>.<br/>
                  Прогресс — {progress}/14&nbsp;дней
                </p>
              )}

              {/* Для завершивших — поздравление */}
              {citizen.challenge_status === 'finished' && (
                <p style={{ marginTop:16, color:'green' }}>
                  🎉 Вы успешно прошли челлендж и можете подать доказательство «шара»!
                </p>
              )}
            </>
          ) : (
            /* Если пользователь авторизован, но ещё нет записи в БД */
            <button
              onClick={() =>
                fetch('/api/challenge/start', { method:'POST' })
                  .then(()=>router.push('/challenge?day=1'))
              }
              className="btn primary"
            >
              🚀 Присоединиться к челленджу
            </button>
          )}
        </section>
      )}


        {tab==='progress' && (
          <section>
            <p>Дней пройдено: <b>{progress}</b> / 14</p>
            <div style={{ background:'#eee', height:12, borderRadius:6, maxWidth:400 }}>
              <div style={{
                width:`${(progress/14)*100}%`, height:'100%', background:'#6c63ff', borderRadius:6
              }}/>
            </div>



            {progress > 0 ? (
              <button
                onClick={()=>router.push(`/challenge?day=${progress}`)}
                className="btn-link"
              >
                ↩️ Пересмотреть текущий день
              </button>
            ) : (
              <p style={{ opacity:0.7, marginTop:12 }}>
                Для старта нажмите «Начать челлендж»
              </p>
            )}

            {progress>0 && (

              <div style={{ marginTop:24 }}>
                <h4>Заметки по дням</h4>
                <ul>
                  {Array.from({ length: progress }).map((_, i) => (
                    <li key={i}>
                      <button
                        onClick={()=>router.push(`/challenge?day=${i+1}`)}
                        className="btn-link"
                      >
                        День {i+1}
                      </button>{' '}

                      <i>{notesMap[i+1] || '– нет –'}</i>
                    </li>
                  ))}
                </ul>
              </div>
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
