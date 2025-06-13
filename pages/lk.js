// pages/lk.js                                             v3.3 • 19 Jun 2025
//
// • добавлены даты start / finish в «Прогресс»
// • живой таймер до разблокировки следующего дня
// • если осталось ≤ 0 сек — линк «к следующему дню» становится кликабельным
//--------------------------------------------------------------------------

import Head from 'next/head'
import Link from 'next/link'
import { parse } from 'cookie'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function LK ({ user, citizen, progress, notesJSON }) {
  const router            = useRouter()
  const [tab , setTab]    = useState(router.query.tab || 'profile')
  const [notes,setNotes ] = useState(JSON.parse(notesJSON||'{}'))
  const [msLeft,setLeft ] = useState(null)         // ⏰ таймер

  /* ── лёгкая навигация ── */
  const switchTab = k=>{
    setTab(k)
    router.push(`/lk?tab=${k}`,undefined,{shallow:true})
  }
  const logout = ()=> fetch('/api/logout',{method:'POST'}).then(()=>router.replace('/'))

  /* ── догружаем заметки (клиент) ── */
  useEffect(()=>{
    if(!citizen?.id) return
    supabase.from('daily_progress')
      .select('day_no,notes').eq('citizen_id',citizen.id)
      .then(({data})=>{
        const m={...notes}; data?.forEach(r=>{if(r.notes)m[r.day_no]=r.notes})
        setNotes(m)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[router.asPath])

  /* ── таймер до следующего дня ── */
  useEffect(()=>{
    if(!citizen?.challenge_started_at || progress>=14) return
    const base = new Date(citizen.challenge_started_at).getTime()
    const next = base + progress*24*3600*1000         // progress — число уже закрытых дней
    const tick = ()=>{
      const ms = next - Date.now()
      setLeft(ms>0?ms:0)
    }
    tick()
    const id = setInterval(tick,1000)
    return ()=>clearInterval(id)
  },[citizen?.challenge_started_at,progress])

  /* ── guard — неавторизован ── */
  if(!user) return (
    <main style={{padding:'2rem',maxWidth:600,margin:'0 auto'}}>
      <h2>Авторизация</h2>
      <p>Войдите через Telegram:</p>
      <div dangerouslySetInnerHTML={{__html:`
<script async src="https://telegram.org/js/telegram-widget.js?15"
 data-telegram-login="ZeteticID_bot" data-size="large" data-userpic="true"
 data-lang="ru" data-request-access="write" data-auth-url="/api/auth"></script>`}}/>
    </main>
  )

  /* ───────────────────────── UI ───────────────────────── */
  return (
    <>
      <Head><title>Личный кабинет • Terra Zetetica</title></Head>
      <main style={{maxWidth:920,margin:'2rem auto',padding:'0 1rem'}}>

        {/* Header */}
        <header style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
          <strong>Здравствуйте, {user.first_name}!</strong>
          <button onClick={logout} className="btn-secondary">Выйти</button>
        </header>

        {/* Tabs */}
        <nav style={{display:'flex',gap:12,marginBottom:18}}>
          {[
            ['profile' ,'🙏 Профиль'],
            ['passport','📜 Паспорт / 🏠 Челлендж'],
            ['progress','📈 Прогресс'],
          ].map(([k,l])=>(
            <button key={k} onClick={()=>switchTab(k)}
              style={{
                padding:'0.5rem 0.9rem',
                borderRadius:6,
                border     : tab===k?'2px solid #6c63ff':'1px solid #ccc',
                background : tab===k?'#f0f0ff':'#fff'
              }}>{l}</button>
          ))}
        </nav>

        {/* PROFILE */}
        {tab==='profile' && (
          <>
            <img src={user.photo_url} width={120} height={120} style={{borderRadius:8}}/>
            <p>ID Telegram: <b>{user.id}</b></p>
            {user.username && <p>Username: <b>@{user.username}</b></p>}

            {citizen && (
              <>
                <p><b>Статус:</b>&nbsp;
                  {citizen.status==='valid' ? '✅ Гражданин'
                   : citizen.status==='guest' ? '👤 Гость'
                   : '❓'}
                </p>
                {citizen.challenge_started_at &&
                  <p>🚀 Старт челленджа:&nbsp;
                    {new Date(citizen.challenge_started_at).toLocaleString('ru-RU')}
                  </p>}
                {citizen.challenge_finished_at &&
                  <p>🏁 Завершён:&nbsp;
                    {new Date(citizen.challenge_finished_at).toLocaleString('ru-RU')}
                  </p>}
              </>
            )}
          </>
        )}

        {/* PASSPORT / CHALLENGE */}
        {tab==='passport' && (
          <>
            {citizen && citizen.zetetic_id &&
              <p><strong>Z-ID:</strong> {citizen.zetetic_id}</p>}

            {/* кнопка теперь показывается ТОЛЬКО если status='inactive' */}
            {citizen?.challenge_status==='inactive' && (
              <button className="btn primary"
                      onClick={()=>fetch('/api/challenge/start',{method:'POST'})
                                   .then(()=>router.push('/challenge?day=1'))}>
                🚀 Начать челлендж
              </button>
            )}

            {citizen?.challenge_status==='active'   &&
              <p>⏳ Пройдено {progress}/14</p>}

            {citizen?.challenge_status==='finished' &&
              <p style={{color:'green'}}>🎉 Челлендж пройден — ждём ваших доказательств!</p>}
          </>
        )}


        {/* PROGRESS */}
        {tab==='progress' && (
          <>
            <h2 style={{margin:'1rem 0'}}>
              <Link href="/dom">🏠 Челлендж «Докажи шар»</Link>
            </h2>

            {/* дата старта */}
            {citizen?.challenge_started_at &&
              <p style={{margin:'6px 0',fontSize:14}}>
                🚀 Старт:&nbsp;
                {new Date(citizen.challenge_started_at).toLocaleString('ru-RU')}
              </p>}

            {/* таймер, если нужен */}
            {(msLeft!==null && msLeft>0) && (
              <p style={{margin:'6px 0',fontSize:14,color:'#d9534f'}}>
                ⏰ До следующего дня:&nbsp;
                {new Date(msLeft).toISOString().substr(11,8)}
              </p>
            )}

            {/* progress-bar */}
            <p>Дней пройдено: <b>{progress}</b> / 14</p>
            <div style={{background:'#eee',height:12,borderRadius:6,maxWidth:400}}>
              <div style={{
                width:`${progress/14*100}%`,height:'100%',
                background:'#6c63ff',borderRadius:6
              }}/>
            </div>

            {/* “к текущему дню” / “следующий” */}
            <div style={{margin:'12px 0'}}>
              {progress>0 &&
                <button className="btn-link"
                        onClick={()=>router.push(`/challenge?day=${progress}`)}>
                  ↩ К текущему дню
                </button>}
              {' '}
              {progress<14 && msLeft<=0 &&
                <button className="btn-link"
                        onClick={()=>router.push(`/challenge?day=${progress+1}`)}>
                  ⇢ День {progress+1}
                </button>}
            </div>

            {/* feedback после 14/14 */}
            {progress===14 && (
              <form onSubmit={async e=>{
                       e.preventDefault()
                       const txt=e.target.fb.value.trim()
                       if(!txt)return
                       const ok=await fetch('/api/feedback',{
                         method:'POST',headers:{'Content-Type':'application/json'},
                         body:JSON.stringify({text:txt})}).then(r=>r.ok)
                       if(ok){alert('Спасибо!');e.target.reset()}
                     }}
                    style={{marginTop:32,maxWidth:500}}>
                <h4>💬 Доказательства шара / обратная связь</h4>
                <textarea name="fb" rows={4} maxLength={1000}
                          style={{width:'100%',marginBottom:8}}/>
                <button className="btn primary">Отправить</button>
              </form>
            )}

            {/* заметки */}
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
                      <i>{notes[i+1]||'— нет —'}</i>
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

/* ─────────────  SERVER-SIDE  (SSR)  ───────────── */
export async function getServerSideProps ({ req }) {
  const { tg, cid } = parse(req.headers.cookie||'')
  const user = tg ? JSON.parse(Buffer.from(tg,'base64').toString()) : null

  if(!cid)
    return { props:{ user, citizen:null, progress:0, notesJSON:'{}' } }

  const [{ data: citizen },{ data: prgs }] = await Promise.all([
    supabase.from('citizens').select('*, challenge_started_at, challenge_finished_at').eq('id',cid).maybeSingle(),
    supabase.from('daily_progress').select('day_no,notes').eq('citizen_id',cid)
  ])

  const notes={}
  ;(prgs||[]).forEach(r=>{if(r.notes)notes[r.day_no]=r.notes})

  return {
    props:{
      user,
      citizen : citizen||null,
      progress: (prgs||[]).length,
      notesJSON: JSON.stringify(notes)
    }
  }
}
