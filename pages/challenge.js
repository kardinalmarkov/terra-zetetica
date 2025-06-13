// pages/challenge.js                    v3.4 • 19 Jun 2025
//
// ▸ Доступ: previousDayClosed  &&  hoursFromStart ≥ (dayNo-1)*24
// ▸ 14-й день поздравляет + конфетти, ведёт в ЛК
// ▸ Клиент: «обратный» таймер до разблокировки (если день ещё закрыт)
//

import { useState, useEffect } from 'react'
import { useRouter }          from 'next/router'
import Head                   from 'next/head'
import Link                   from 'next/link'
import DayMaterial            from '../components/DayMaterial'
import useMe                  from '../utils/useMe'

/* ---------- SSR ---------- */
export async function getServerSideProps({ query, req }) {
  const { tg, cid } = (await import('cookie')).parse(req.headers.cookie ?? '')
  if (!tg || !cid)
    return { redirect:{ destination:'/lk', permanent:false } }

  const day = Math.min(Math.max(+query.day || 1, 1), 14)

  const { supabase } = await import('../lib/supabase')
  const [matR, rowsR, citR] = await Promise.all([
    supabase.from('daily_materials')
            .select('*').eq('day_no',day).maybeSingle(),
    supabase.from('daily_progress')
            .select('day_no,watched_at,notes')
            .eq('citizen_id',cid),
    supabase.from('citizens')
            .select('challenge_started_at').eq('id',cid).single()
  ])

  const material = matR.data
  if (!material)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

  /* 1. дата старта (нужна для тайм-аута) */
  let startISO = citR.data?.challenge_started_at
  if (!startISO) {
    const row1 = rowsR.data?.find(r=>r.day_no===1)
    startISO = row1?.watched_at || null
  }

  /* 2. вычисляем ограничения */
  const hours = startISO ? (Date.now()-new Date(startISO))/3.6e6 : 1e6
  const byTime = Math.floor(hours/24)+1        // ≥ N*24 ч
  const last   = rowsR.data?.reduce((m,r)=>r.watched_at?Math.max(m,r.day_no):m,0) || 0
  const byDone = last+1
  const allowedDay = Math.min(byTime, byDone)
  const prevClosed = day===1 || rowsR.data?.some(r=>r.day_no===day-1 && r.watched_at)

  if (day>allowedDay || !prevClosed)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

  const curRow = rowsR.data?.find(r=>r.day_no===day) || {}
  return {
    props:{
      dayNo   : day,
      material: { ...material, notes: curRow.notes||'' },
      watched : Boolean(curRow.watched_at),
      unlockIn: ((day-1)*24 - hours) * 3600 // секунды до N-го дня (для таймера)
    }
  }
}

/* ---------- Client ---------- */
export default function ChallengePage({ dayNo, material, watched, unlockIn }) {
  const router           = useRouter()
  const { mutate }       = useMe()
  const [isDone,setDone] = useState(watched)
  const [note,setNote]   = useState(material.notes)
  const [saved,setSaved] = useState(false)

  /* живой таймер до открытия */
  const [secLeft,setLeft] = useState(Math.max(0,Math.floor(unlockIn)))
  useEffect(()=>{
    if(secLeft<=0) return
    const t = setInterval(()=>setLeft(s=>s-1),1000)
    return ()=>clearInterval(t)
  },[secLeft])

  /* сбрасываем стейт, когда ?day=… меняется */
  useEffect(()=>{
    setDone(watched); setNote(material.notes); setSaved(false)
  },[router.asPath, watched, material.notes])

  /* конфетти 🎉 после 14-го дня */
  useEffect(()=>{
    if(isDone && dayNo===14)
      import('canvas-confetti')
        .then(m=>m.default({particleCount:200,spread:80}))
  },[isDone,dayNo])

  async function submit(saveOnly=false){
    const r = await fetch('/api/challenge/mark',{
      method :'POST',
      headers:{'Content-Type':'application/json'},
      body   : JSON.stringify({ day:dayNo, note, saveOnly })
    }).then(r=>r.json())

    if(r.ok){
      if(!saveOnly) setDone(true)
      setSaved(true); setTimeout(()=>setSaved(false),1500)
      mutate()
    } else alert('Ошибка: '+(r.error||'unknown'))
  }

  /* --- UI ---------------------------------------------------------------- */
  return (
    <main style={{maxWidth:900,margin:'0 auto',padding:'1rem'}}>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      <DayMaterial material={material}/>

      {/* прогресс-бар из 14 точек */}
      <div style={{display:'flex',gap:6,margin:'22px 0'}}>
        {Array.from({length:14}).map((_,i)=>(
          <span key={i}
                style={{
                  width:12,height:12,borderRadius:'50%',
                  background: i<dayNo-1 || (i===dayNo-1&&isDone)
                               ? '#28a745' : '#ccc'
                }}/>
        ))}
      </div>

      {/* заметка */}
      <h3 style={{margin:'26px 0 6px'}}>📝 Ваша заметка</h3>
      <textarea rows={4} maxLength={1000}
                style={{width:'100%',marginBottom:10}}
                value={note} onChange={e=>setNote(e.target.value)}/>

      <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
        <button className="btn primary" onClick={()=>submit(true)}>
          💾 Сохранить заметку
        </button>
        {saved && <span style={{color:'#28a745',fontWeight:600}}>✔ сохранено</span>}

        {!isDone &&
          <button className="btn primary" onClick={()=>submit(false)}>
            ✅ Я осознанно изучил
          </button>}
      </div>

      {/* если ещё рано — показываем «таймер» */}
      {dayNo<14 && !isDone && secLeft>0 && (
        <p style={{marginTop:18,color:'#6c63ff'}}>
          ⏰ Следующий день станет доступен через&nbsp;
          <b>{Math.floor(secLeft/3600)} ч&nbsp;
             {Math.floor(secLeft/60)%60} мин&nbsp;
             {secLeft%60} сек</b>
        </p>
      )}

      {/* навигация */}
      <nav style={{
        marginTop:34,display:'flex',
        justifyContent:'space-between',fontSize:18}}>
        <button className="btn-link" onClick={()=>router.back()}>← Назад</button>
        <Link href="/lk?tab=progress" className="btn-link" scroll={false}>📈</Link>
        {dayNo<14 && isDone &&
          <Link href={`/challenge?day=${dayNo+1}`} className="btn-link"
                scroll={false}>день {dayNo+1} →</Link>}
      </nav>

      {/* поздравление после 14-го */}
      {dayNo===14 && isDone && (
        <p style={{marginTop:30,fontSize:18,color:'green'}}>
          🎉 Вы прошли все материалы!<br/>
          Перейдите в&nbsp;
          <Link href="/lk?tab=progress"><a>личный кабинет</a></Link>,
          чтобы отправить доказательства «шара».
        </p>
      )}
    </main>
  )
}
