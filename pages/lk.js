// pages/lk.js
//
// v 3.2 • 19 Jun 2025
//
// ───────────────────────────  ОБЩЕЕ  ───────────────────────────
// • 3 вкладки: profile / passport / progress
// • profile   – Телеграм-данные + даты start/finish челленджа
// • passport  – кнопка «начать», либо статус ⏳ / 🎉
// • progress  – индикатор 14 дней, форма feedback после 14/14,
//               список заметок с быстрыми ссылками
// • заметки тянем «лениво» на клиенте → не нагружаем SSR
// • куки: tg (payload TG) + cid (id гражданина)
// • зависимости:      npm i cookie
//                     npm i @supabase/supabase-js
// ────────────────────────────────────────────────────────────────

import Head                   from 'next/head'
import Link                   from 'next/link'
import { parse }              from 'cookie'
import { useRouter }          from 'next/router'
import { useState, useEffect } from 'react'
import { supabase }           from '../lib/supabase'

/* ───────────────────────────  КОМПОНЕНТ  ─────────────────────────── */
export default function LK ({ user, citizen, progress, notesJSON }) {

  /* локальный стейт вкладки и заметок */
  const router            = useRouter()
  const [tab , setTab ]   = useState(router.query.tab || 'profile')
  const [notes,setNotes ] = useState(JSON.parse(notesJSON || '{}'))

  /* «мягкое» переключение вкладок */
  const switchTab = key => {
    setTab(key)
    router.push(`/lk?tab=${key}`, undefined, { shallow:true })
  }

  /* выход */
  const logout = () =>
    fetch('/api/logout', { method:'POST' }).then(()=>router.replace('/'))

  /* ─────────────  GUARD: гость без авторизации  ───────────── */
  if (!user) {
    return (
      <main style={{padding:'2rem',maxWidth:600,margin:'0 auto'}}>
        <h2>Авторизация</h2>
        <p>Войдите через Telegram:</p>
        <div dangerouslySetInnerHTML={{ __html: `
<script async src="https://telegram.org/js/telegram-widget.js?15"
 data-telegram-login="ZeteticID_bot" data-size="large" data-userpic="true"
 data-lang="ru" data-request-access="write" data-auth-url="/api/auth"></script>` }} />
      </main>
    )
  }

  /* ─────────────  лениво подкачиваем заметки  ───────────── */
  useEffect(() => {
    if (!citizen?.id) return
    supabase
      .from('daily_progress')
      .select('day_no,notes')
      .eq('citizen_id', citizen.id)
      .then(({ data }) => {
        const map = { ...notes }
        data?.forEach(r => { if (r.notes) map[r.day_no] = r.notes })
        setNotes(map)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])               // при смене URL / вкладки

  /* ───────────────────────────  UI  ─────────────────────────── */
  return (
    <>
      <Head><title>Личный кабинет • Terra Zetetica</title></Head>

      <main style={{maxWidth:920,margin:'2rem auto',padding:'0 1rem'}}>

        {/* ===== Header ===== */}
        <header style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
          <strong>Здравствуйте, {user.first_name}!</strong>
          <button className="btn-secondary" onClick={logout}>Выйти</button>
        </header>

        {/* ===== Tabs ===== */}
        <nav style={{display:'flex',gap:12,marginBottom:18}}>
          {[
            ['profile' , '🙏 Профиль'],
            ['passport', '📜 Паспорт / 🏠 Челлендж'],
            ['progress', '📈 Прогресс']
          ].map(([k,label]) => (
            <button key={k} onClick={()=>switchTab(k)}
              style={{
                padding:'0.5rem 0.9rem',
                borderRadius:6,
                border     : tab===k ? '2px solid #6c63ff' : '1px solid #ccc',
                background : tab===k ? '#f0f0ff'           : '#fff'
              }}>{label}</button>
          ))}
        </nav>

        {/* ────────────────── 1. PROFILE ────────────────── */}
        {tab==='profile' && (
          <>
            <img src={user.photo_url} width={120} height={120}
                 style={{borderRadius:8}}/>
            <p>ID Telegram: <b>{user.id}</b></p>
            {user.username && <p>Username: <b>@{user.username}</b></p>}

            {citizen && (
              <>
                <p><b>Статус:</b>{' '}
                  {citizen.status==='valid' ? '✅ Гражданин'
                   : citizen.status==='guest' ? '👤 Гость'
                   : '❓'}
                </p>
                {citizen.challenge_started_at &&
                  <p>Челлендж начат:&nbsp;
                    {new Date(citizen.challenge_started_at)
                     .toLocaleString('ru-RU')}
                  </p>}
                {citizen.challenge_finished_at &&
                  <p>Челлендж окончен:&nbsp;
                    {new Date(citizen.challenge_finished_at)
                     .toLocaleString('ru-RU')}
                  </p>}
              </>
            )}
          </>
        )}

        {/* ───────────── 2. PASSPORT / CHALLENGE ───────────── */}
        {tab==='passport' && (
          <>
            {citizen ? (
              <>
                <p><strong>Z-ID:</strong> {citizen.zetetic_id||'—'}</p>

                {citizen.challenge_status==='inactive' && (
                  <button className="btn primary"
                          onClick={() =>
                            fetch('/api/challenge/start',{method:'POST'})
                              .then(()=>router.push('/challenge?day=1'))}>
                    🚀 Начать челлендж
                  </button>
                )}

                {citizen.challenge_status==='active'   &&
                  <p>⏳ Пройдено {progress}/14</p>}

                {citizen.challenge_status==='finished' &&
                  <p style={{color:'green'}}>
                    🎉 Челлендж пройден — ждём ваших доказательств!
                  </p>}
              </>
            ) : (
              <button className="btn primary"
                      onClick={() =>
                        fetch('/api/challenge/start',{method:'POST'})
                          .then(()=>router.push('/challenge?day=1'))}>
                🚀 Присоединиться к челленджу
              </button>
            )}
          </>
        )}

        {/* ────────────────── 3. PROGRESS ────────────────── */}
        {tab==='progress' && (
          <>
            <h2 style={{margin:'1rem 0'}}>
              <Link href="/dom">🏠 Челлендж «Докажи шар»</Link>
            </h2>

            {/* прогресс-бар */}
            <p>Дней пройдено: <b>{progress}</b> / 14</p>
            <div style={{background:'#eee',height:12,borderRadius:6,maxWidth:400}}>
              <div style={{
                width:`${progress/14*100}%`,
                height:'100%',background:'#6c63ff',borderRadius:6
              }}/>
            </div>

            {/* быстрый переход */}
            <button className="btn-link" style={{marginTop:12}}
                    onClick={()=>router.push(`/challenge?day=${Math.max(progress,1)}`)}>
              ↩ К текущему дню
            </button>

            {/* форма feedback после 14/14 */}
            {progress===14 && (
              <form onSubmit={async e=>{
                       e.preventDefault()
                       const txt=e.target.fb.value.trim()
                       if(!txt)return
                       const ok=await fetch('/api/feedback',{
                         method:'POST',
                         headers:{'Content-Type':'application/json'},
                         body:JSON.stringify({text:txt})
                       }).then(r=>r.json())
                       if(ok){ alert('Спасибо!'); e.target.reset() }
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
                      <i>{notes[i+1] || '— нет —'}</i>
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

/* ───────────────────────  SERVER-SIDE  ─────────────────────── */
export async function getServerSideProps ({ req }) {
  const { tg, cid } = parse(req.headers.cookie || '')
  const user = tg ? JSON.parse(Buffer.from(tg,'base64').toString()) : null

  /* гость: ничего лишнего не тянем */
  if (!cid)
    return { props:{ user, citizen:null, progress:0, notesJSON:'{}' } }

  /* параллельно читаем citizen + его заметки */
  const [{ data: citizen }, { data: prgs }] = await Promise.all([
    supabase.from('citizens').select('*').eq('id',cid).maybeSingle(),
    supabase.from('daily_progress').select('day_no,notes').eq('citizen_id',cid)
  ])

  const notes={}
  ;(prgs||[]).forEach(r=>{ if(r.notes) notes[r.day_no]=r.notes })

  return {
    props:{
      user,
      citizen : citizen||null,
      progress: (prgs||[]).length,
      notesJSON: JSON.stringify(notes)
    }
  }
}
