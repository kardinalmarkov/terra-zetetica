// pages/challenge.js
// ──────────────────────────────────────────────────────────────────────────────
// Страница «День N» + тай-аут до открытия следующего дня + прогресс-бар
import { useEffect, useState } from 'react'
import { useRouter }            from 'next/router'
import Head                     from 'next/head'
import confetti                 from 'canvas-confetti'
import DayMaterial              from '../components/DayMaterial'

// ⓘ из utils/useMe берём cid, чтобы не тащить его через getServerSideProps
import useMe from '../utils/useMe'

// ──────────────────────────────────────────────────────────────────────────────
export async function getServerSideProps ({ query, req }) {
  const dayNo = Number(query.day ?? 1)
  const { supabase } = (await import('../lib/supabase.js'))
  const { parse }    = await import('cookie')
  const { tg }       = parse(req.headers.cookie || '')

  // если пользователь не залогинен – отправляем авторизоваться
  if (!tg) return { redirect:{ destination:'/lk', permanent:false } }

  // материал дня
  const { data: material } = await supabase
    .from('daily_materials')
    .select('*')
    .eq('day_no', dayNo)
    .single()

  /* если day открывается позже – пушим в ЛК */
  if (material.unlock_at && new Date(material.unlock_at) > Date.now())
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

  return { props:{ dayNo, material } }
}

// ──────────────────────────────────────────────────────────────────────────────
export default function ChallengePage ({ dayNo, material }) {
  const r                       = useRouter()
  const { data:{ citizen } = {} } = useMe()

  const [done, setDone]     = useState(false)
  const [note , setNote]    = useState('')
  const [left , setLeft]    = useState(null)          // ms до открытия d+1

  /* обратный счёт до следующего дня */
  useEffect(()=>{
    if (dayNo === 14) return          // для 14-го не нужен таймер
    const next = new Date(material.unlock_at)
    const id   = setInterval(()=>setLeft(Math.max(0, next - Date.now())),1000)
    return ()=>clearInterval(id)
  },[material.unlock_at, dayNo])

  /* фейерверк на 14-й */
  useEffect(()=>{
    if (dayNo===14 && done) confetti({ particleCount:200, spread:80 })
  },[dayNo,done])

  /* отметка «изучил» */
  async function mark () {
    const r = await fetch('/api/challenge/mark',{
      method :'POST',
      headers:{'Content-Type':'application/json'},
      body   :JSON.stringify({ day:dayNo, note })
    })
    const j = await r.json().catch(()=>({}))
    if (j.ok) setDone(true)
    else alert('Ошибка: '+(j.error||'unknown'))
  }

  /* если пользователь уже всё посмотрел – сразу done */
  useEffect(()=>{ if (material.watched) setDone(true) },[material.watched])

  // ─────────── render
  return (
    <main style={{margin:'0 auto',maxWidth:900,padding:'1rem'}}>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      <DayMaterial material={material}/>

      {/* прогресс-бар 14 кружков */}
      <ul className="dots">
        {Array.from({length:14}).map((_,i)=>(
          <li key={i} className={i<dayNo-1 ? 'done' : i===dayNo-1&&done ? 'done':'todo'}/>
        ))}
      </ul>

      {/* таймер до завтра */}
      {left!==null && !done && (
        <p style={{color:'#888',margin:'8px 0 24px'}}>
          Следующий день откроется через {Math.floor(left/3600000)} ч&nbsp;
          {Math.floor(left/60000)%60} мин
        </p>
      )}

      {!done && (
        <>
          <h3 style={{marginTop:32}}>💾 Сохранить заметку</h3>
          <textarea
            rows={4}
            maxLength={1000}
            value={note}
            onChange={e=>setNote(e.target.value)}
            style={{width:'100%',marginBottom:12}}
          />
          <button className="btn primary" onClick={mark}>
            ✔️ Я осознанно изучил материал
          </button>
        </>
      )}

      <style jsx>{`
        .dots{display:flex;gap:6px;list-style:none;padding:0;margin:24px 0}
        .dots li{width:12px;height:12px;border-radius:50%;background:#ccc}
        .dots li.done{background:#28a745}
        .dots li.todo{background:#ccc}
      `}</style>
    </main>
  )
}
