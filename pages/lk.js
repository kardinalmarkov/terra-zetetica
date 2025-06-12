// pages/lk.js            v 2.9   — 15 Jun 2025
import Head          from 'next/head'
import Link          from 'next/link'
import { parse }     from 'cookie'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { supabase }  from '../lib/supabase'

export default function LK ({ user, citizen, progress, notesJSON }) {
  const router            = useRouter()
  const [tab, setTab]     = useState(router.query.tab || 'profile')
  const [notesMap,setMap] = useState(JSON.parse(notesJSON||'{}'))

  /* ——— переход между вкладками ——— */
  const switchTab = key=>{
    setTab(key)
    router.push(`/lk?tab=${key}`,undefined,{shallow:true})
  }

  /* ——— выход ——— */
  const logout = ()=>fetch('/api/logout',{method:'POST'}).then(()=>router.replace('/'))

  /* ——— нет Telegram-авторизации ——— */
  if (!user) return (
    <main style={{padding:'2rem',maxWidth:600,margin:'0 auto'}}>
      <h2>Авторизация</h2>
      <p>Войдите через Telegram:</p>
      <div dangerouslySetInnerHTML={{__html:`
<script async src="https://telegram.org/js/telegram-widget.js?15"
 data-telegram-login="ZeteticID_bot" data-size="large" data-userpic="true"
 data-lang="ru" data-request-access="write" data-auth-url="/api/auth"></script>`}}/>
    </main>
  )

  /* ——— динамическая подгрузка заметок (при открытии другой вкладки браузером) ——— */
  useEffect(()=>{
    if (!citizen?.id) return
    supabase                                     // ⚡ повторяем только при refocus/vis-change
      .from('daily_progress')                    //    чтобы не держать веб-сокет постоянно
      .select('day_no,notes')
      .eq('citizen_id',citizen.id)
      .then(({data})=>{
        const m={...notesMap}
        data?.forEach(r=>{ if(r.notes) m[r.day_no]=r.notes })
        setMap(m)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[router.asPath])                              // ⚡ а не [citizen] -> избавились от лишних вызовов

  /* ——— UI ——— */
  return (
    <>
      <Head><title>Личный кабинет • Terra Zetetica</title></Head>

      <main style={{maxWidth:860,margin:'2rem auto',padding:'0 1rem'}}>
        {/* шапка */}
        <header style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
          <strong>Здравствуйте, {user.first_name}!</strong>
          <button onClick={logout} className="btn-secondary">Выйти</button>
        </header>

        {/* вкладки */}
        <nav style={{display:'flex',gap:12,marginBottom:18}}>
          {[
            ['profile' ,'🙏 Профиль'],
            ['passport','📜 Паспорт / 🏠 Челлендж'],
            ['progress','📈 Прогресс']
          ].map(([k,l])=>(
            <button key={k} onClick={()=>switchTab(k)}
              style={{
                padding:'0.5rem 0.9rem',
                borderRadius:6,
                border: tab===k?'2px solid #6c63ff':'1px solid #ccc',
                background: tab===k?'#f0f0ff':'#fff'
              }}>{l}</button>
          ))}
        </nav>

        {/* ——— 1. ПРОФИЛЬ ——— */}
        {tab==='profile' && (
          <>
            <img src={user.photo_url} width={120} height={120} style={{borderRadius:8}}/>
            <p>ID Telegram: <b>{user.id}</b></p>
            {!!user.username && <p>Username: <b>@{user.username}</b></p>}
            <p><b>Запись в БД:</b> {citizen ? '✔️' : '❌'}</p>
            {citizen && (
              <p><b>Статус:</b> {citizen.status==='valid'
                  ? '✅ Гражданин'
                  : citizen.status==='guest' ? '👤 Гость' : '❓'}</p>
            )}
          </>
        )}

        {/* ——— 2. ПАСПОРТ/ЧЕЛЛЕНДЖ ——— */}
        {tab==='passport' && (
          <>
            {citizen ? (
              <>
                <p><strong>Z-ID:</strong> {citizen.zetetic_id||'—'}</p>

                {citizen.challenge_status==='inactive' && (
                  <button className="btn primary"
                          onClick={()=>fetch('/api/challenge/start',{method:'POST'})
                                       .then(()=>router.push('/challenge?day=1'))}>
                    🚀 Начать челлендж
                  </button>
                )}

                {citizen.challenge_status==='active'   && <p>⏳ Пройдено {progress}/14</p>}
                {citizen.challenge_status==='finished' && <p style={{color:'green'}}>🎉 Челлендж пройден!</p>}
              </>
            ):(
              <button className="btn primary"
                      onClick={()=>fetch('/api/challenge/start',{method:'POST'})
                                   .then(()=>router.push('/challenge?day=1'))}>
                🚀 Присоединиться к челленджу
              </button>
            )}
          </>
        )}

        {/* ——— 3. ПРОГРЕСС ——— */}
        {tab==='progress' && (
          <>
            <h2 style={{margin:'1rem 0'}}>🏠 Челлендж «Докажи шар»</h2>
            <p>Дней пройдено: <b>{progress}</b> / 14</p>
            <div style={{background:'#eee',height:12,borderRadius:6,maxWidth:400}}>
              <div style={{
                width:`${progress/14*100}%`,
                height:'100%',background:'#6c63ff',borderRadius:6
              }}/>
            </div>

            <button className="btn-link" style={{marginTop:12}}
                    onClick={()=>router.push(`/challenge?day=${Math.max(progress,1)}`)}>
              ↩️ К текущему дню
            </button>

            {progress>0 && (
              <>
                <h4 style={{marginTop:24}}>Заметки по дням</h4>
                <ul className="notes-list">
                  {Array.from({length:progress}).map((_,i)=>(
                    <li key={i}>
                      <button className="btn-link"
                              onClick={()=>router.push(`/challenge?day=${i+1}`)}>
                        День {i+1}
                      </button>{' '}
                      <i>{notesMap[i+1]||'— нет —'}</i>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </main>
    </>
  )
}

/* ────────────── SSR ────────────── */
export async function getServerSideProps({ req }){
  const { tg, cid } = parse(req.headers.cookie||'')
  const user = tg ? JSON.parse(Buffer.from(tg,'base64').toString()) : null

  /* без авторизации показываем только Telegram-логин */
  if (!cid) return { props:{ user, citizen:null, progress:0, notesJSON:'{}' } }

  /* читаем гражданина и прогресс */
  const [{ data: citizen, error:ce }, { data: prgs, error:pe }] = await Promise.all([
    supabase.from('citizens').select('*').eq('id',cid).maybeSingle(),
    supabase.from('daily_progress').select('day_no,notes').eq('citizen_id',cid)
  ])

  if (ce || pe){
    console.error('LK-SSR:',ce||pe)                  // ⚡ логируем для Vercel-logs
    return { props:{ user, citizen:null, progress:0, notesJSON:'{}' } }
  }

  const rows = Array.isArray(prgs) ? prgs : []
  const notes={}
  rows.forEach(r=>{ if(r.notes) notes[r.day_no]=r.notes })

  return {
    props:{
      user,
      citizen: citizen||null,
      progress: rows.length,
      notesJSON: JSON.stringify(notes)
    }
  }
}
