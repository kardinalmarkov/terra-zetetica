// pages/challenge.js
// ──────────────────────────────────────────────────────────────────────────────
// Страница 14‑дневного челленджа. Исправлено:
//   • добавлен импорт Link (исправляет ReferenceError: Link is not defined)
//   • убрано watchedNote → notes (берём из daily_progress при SSR)
//   • теперь /api/challenge/start вызывается из кнопки StartChallenge
//   • код очищен от лишних переменных, типизация DayPicker.

import { parse } from 'cookie'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import DayPicker from '../components/DayPicker'
import { supabase } from '../lib/supabase'
import ReactMarkdown from 'react-markdown'
import { useEffect } from 'react'
import remarkGfm from 'remark-gfm'     // для поддержки таблиц, списков, task-листов


export default function Challenge ({ user, citizen, material, watched, notes }) {
  const router = useRouter()
  const [done,   setDone]  = useState(watched)
  const [myNote, setNote]  = useState(notes || '')

  useEffect(() => {
    setNote(notes || '')
  }, [notes])

  // обновляем state при смене дня
  // useEffect(() => setNote(notes || ''), [notes])

  /* ───────── mark / watch ───────── */
  async function mark (reply='ok') {
    try {
      const res  = await fetch('/api/challenge/watch', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ day: material.day_no, reply })
      })
      const json = await res.json()
      if (json.ok) setDone(true)
      else throw new Error(json.err || 'unknown')
    } catch (err) {
      alert('Ошибка: '+err.message)
    }
  }

  /* ───────── note save ───────── */
  async function saveNote () {
    try {
      const res  = await fetch('/api/challenge/note', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ day: material.day_no, note: myNote })
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.err||'unknown')
      alert('Сохранено!')
    } catch (e) { alert('Не сохранено: '+e.message) }
  }

  /* ───────── start (исп у неграждан) ───────── */
  async function startChallenge() {
    const res  = await fetch('/api/challenge/start', { method:'POST' })
    const json = await res.json()
    if (json.ok) router.replace('/challenge')
    else alert('Ошибка старта: '+(json.err||'unknown'))
  }

  /* ───────── guards ───────── */
  if (!user)     return <p style={{padding:'2rem'}}>Сначала войдите через Telegram.</p>
  if (!citizen)  return <p style={{padding:'2rem'}}>Получите гражданство, чтобы участвовать.</p>

  if (citizen.challenge_status !== 'active') {
    return (
      <main style={{padding:'2rem'}}>
        <h2>Старт 14‑дневного челленджа</h2>
        <button onClick={startChallenge} className="btn">🚀 Начать челлендж</button>
      </main>)
  }

  /* ───────── UI ───────── */
  return (
    <>
      <Head><title>День {material.day_no} • Челлендж</title></Head>

      <main style={{maxWidth:760,margin:'0 auto',padding:'2rem 1rem'}}>
        <h2>День {material.day_no} / 14</h2>
        <h3>{material.title}</h3>

        {/* media (одно) */}
        {material.media_url && ( /\.(jpe?g|png|webp|gif)$/i.test(material.media_url)
          ? <img src={material.media_url} style={{maxWidth:'100%',borderRadius:6}}/>
          : <iframe src={material.media_url} width="100%" height="380" allowFullScreen
                    style={{border:0,borderRadius:6}}/> )}


<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  className="markdown-body"
>
  {material.description}
</ReactMarkdown>


{material.question && !done && (
  <form onSubmit={e=>{e.preventDefault(); mark(e.target.reply.value)}}>
    <p style={{fontWeight:500}}>{material.question}</p>
    <input name="reply" required/>
    <button>Ответить</button>
  </form>
)}
        {/* вопрос / просмотр */}
        {!done && material.question && (
          <form onSubmit={e=>{e.preventDefault(); mark(e.target.reply.value)}}>
            <p style={{fontWeight:500}}>{material.question}</p>
            <input name="reply" required style={{padding:'.45rem .8rem',border:'1px solid #ccc',borderRadius:6}}/>
            <button className="btn" style={{marginLeft:12}}>Ответить</button>
          </form>) }

        {!done && !material.question && (
          <button className="btn" onClick={()=>mark()}>✔ Отметить просмотр</button> ) }

        {done && <p style={{color:'green',marginTop:16}}>✔ Материал отмечен</p>}

        {/* след / daypicker */}
        {done && material.day_no < 14 && (
          <Link href={`/challenge?day=${material.day_no+1}`} className="btn" style={{marginTop:16}}>
            ➡️ Перейти к дню {material.day_no+1}
          </Link>) }

        <div style={{marginTop:20}}>
          <DayPicker maxDay={Math.min(material.day_no,14)} currentDay={material.day_no}
                     onChange={n=>router.push('/challenge?day='+n)}/>
        </div>

        {/* back / progress */}
        <div style={{marginTop:32,display:'flex',gap:12}}>
          <button onClick={()=>router.back()}>← Назад</button>
          <Link href="/lk?tab=progress" className="btn-secondary">📈 К прогрессу</Link>
        </div>

        {/* заметки */}
        {done && (<form style={{marginTop:32}} onSubmit={e=>{e.preventDefault(); saveNote()}}>
          <textarea rows={4} value={myNote} onChange={e=>setNote(e.target.value)}
                    placeholder="Ваши наблюдения…" style={{width:'100%',padding:8}}/>
          <button className="btn" style={{marginTop:8}}>💾 Сохранить заметку</button>
        </form>)}

      </main>
    </>
  )
}

/* ───────── SSR ───────── */
export async function getServerSideProps ({ req, query }) {
  const { tg, cid } = parse(req.headers.cookie||'')
  const user = tg ? JSON.parse(Buffer.from(tg,'base64').toString()) : null
  const { data:citizen } = cid ? await supabase.from('citizens').select('*').eq('id',cid).single() : {data:null}

  if (!citizen || citizen.challenge_status !== 'active') {
    return { props:{ user, citizen:citizen||null, material:{}, watched:false, notes:null } }
  }

  const { count } = await supabase.from('daily_progress').select('*',{head:true,count:'exact'}).eq('citizen_id',cid)
  const today   = Math.min(count+1,14)
  const reqDay  = Number(query.day)
  const dayNo   = reqDay>=1 && reqDay<=today ? reqDay : today

  const { data:material } = await supabase.from('daily_materials').select('*').eq('day_no',dayNo).single()
  const { data:progress  } = await supabase.from('daily_progress').select('*').eq('citizen_id',cid).eq('day_no',dayNo).maybeSingle()

  return {
    props:{ user, citizen, material, watched:!!progress, notes:progress?.notes||null }
  }
}
