// pages/challenge.js              v3.3 • 19 Jun 2025
//
// ▸ День доступен, ЕСЛИ:
//
//     previousDayClosed  &&              // день N-1 изучён
//     hoursFromStart ≥ (dayNo-1)*24      // от старта прошло ≥ 24 ч * (N-1)
//
// ▸ watched_at пишется один раз (см. /api/challenge/mark.js)
// ▸ После дня-14 поздравляем и ведём в ЛК
//

import { useState, useEffect } from 'react'
import { useRouter }          from 'next/router'
import Head                   from 'next/head'
import Link                   from 'next/link'
import DayMaterial            from '../components/DayMaterial'
import useMe                  from '../utils/useMe'

/* ---------------- SSR ---------------- */
export async function getServerSideProps({ query, req }) {
  const { tg, cid } = (await import('cookie')).parse(req.headers.cookie ?? '')
  if (!tg || !cid)
    return { redirect:{ destination:'/lk', permanent:false } }

  const day = Math.min(Math.max(+query.day || 1, 1), 14)
  const { supabase } = await import('../lib/supabase')

  /* ① материал + ② текущая строка прогресса + ③ все строки + ④ дата старта */
  const [matRsp, curRsp, allRsp, citRsp] = await Promise.all([
    supabase.from('daily_materials')
            .select('*').eq('day_no', day).maybeSingle(),
    supabase.from('daily_progress')
            .select('notes,watched_at')
            .match({ citizen_id:cid, day_no:day }).maybeSingle(),
    supabase.from('daily_progress')
            .select('day_no,watched_at')
            .eq('citizen_id',cid),
    supabase.from('citizens')
            .select('challenge_started_at')
            .eq('id',cid).single()
  ])

  const mat      = matRsp.data
  const prg      = curRsp.data
  const allRows  = allRsp.data || []
  const startISO = citRsp.data?.challenge_started_at
                || allRows.find(r => r.day_no === 1)?.watched_at
                || null                                           // если null → нет лимита времени

  /* ---- нет материала → в ЛК ---- */
  if (!mat)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

  /* ---- высчитываем «день, разрешённый по времени» ---- */
  let byTime = 14   // если старт не найден — время не ограничивает
  if (startISO) {
    const hours = (Date.now() - new Date(startISO)) / 3.6e6      // милли-→часы
    byTime      = Math.floor(hours / 24) + 1                     // 1-й день доступен сразу
  }

  /* ---- «день, разрешённый по прогрессу» ---- */
  const lastClosed = allRows.reduce((m,r)=> r.watched_at ? Math.max(m,r.day_no) : m, 0)
  const byDone     = lastClosed + 1

  /* ---- итог: МИНИМУМ из двух правил ---- */
  const allowedDay = Math.min(byTime, byDone)

  /* ---- Допусловие: предыдущий день должен быть закрыт ---- */
  const prevClosed = day === 1 ||
        allRows.some(r => r.day_no === day-1 && r.watched_at)

  if (day > allowedDay || !prevClosed)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

  return {
    props:{
      dayNo   : day,
      material: { ...mat, notes: prg?.notes ?? '' },
      watched : Boolean(prg?.watched_at)
    }
  }
}

/* ---------------- CSR ---------------- */
export default function ChallengePage({ dayNo, material, watched }) {
  const router             = useRouter()
  const { mutate }         = useMe()                 // обновляет /api/me
  const [isDone,setDone]   = useState(watched)
  const [note,setNote]     = useState(material.notes)
  const [savedOK,setSaved] = useState(false)

  /* сбрасываем state при смене ?day=… */
  useEffect(()=>{
    setDone(watched); setNote(material.notes); setSaved(false)
    // eslint-disable-next-line
  },[router.asPath])

  /* конфетти на финише */
  useEffect(()=>{
    if(isDone && dayNo===14)
      import('canvas-confetti')
        .then(m=>m.default({particleCount:200,spread:80}))
  },[isDone,dayNo])

  async function submit(opts={saveOnly:false}){
    const r = await fetch('/api/challenge/mark',{
      method :'POST',
      headers:{'Content-Type':'application/json'},
      body   : JSON.stringify({ day:dayNo, note, ...opts })
    }).then(r=>r.json())

    if(r.ok){
      if(!opts.saveOnly) setDone(true)
      setSaved(true); setTimeout(()=>setSaved(false),2000)
      mutate()                               // перерисуем ЛК
    }else alert('Ошибка: '+(r.error||'unknown'))
  }

  return (
    <main style={{maxWidth:900,margin:'0 auto',padding:'1rem'}}>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      <DayMaterial material={material}/>

      {/* кружочки прогресса */}
      <div style={{display:'flex',gap:6,margin:'22px 0'}}>
        {Array.from({length:14}).map((_,i)=>(
          <span key={i} style={{
            width:12,height:12,borderRadius:'50%',
            background:
              i<dayNo-1 || (i===dayNo-1&&isDone)?'#28a745':'#ccc'
          }}/>
        ))}
      </div>

      {/* заметка */}
      <h3 style={{margin:'26px 0 6px'}}>📝 Ваша заметка</h3>
      <textarea rows={4} maxLength={1000}
                style={{width:'100%',marginBottom:10}}
                value={note} onChange={e=>setNote(e.target.value)}/>

      <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
        <button className="btn primary"
                onClick={()=>submit({saveOnly:true})}>
          💾 Сохранить заметку
        </button>
        {savedOK && <span style={{color:'#28a745',fontWeight:600}}>✔️ сохранено</span>}

        {!isDone &&
          <button className="btn primary" onClick={()=>submit()}>
            ✅ Материал изучен
          </button>}
      </div>

      {/* навигация */}
      <nav style={{
        marginTop:34,display:'flex',justifyContent:'space-between',fontSize:18}}>
        <button className="btn-link" onClick={()=>router.back()}>← Назад</button>
        <Link href="/lk?tab=progress" className="btn-link" scroll={false}>📈</Link>
        {dayNo<14 && isDone &&
          <Link href={`/challenge?day=${dayNo+1}`} className="btn-link" scroll={false}>
            день {dayNo+1} →
          </Link>}
      </nav>

      {dayNo===14 && isDone && (
        <p style={{marginTop:30,fontSize:18,color:'green'}}>
          🎉 Поздравляем — вы прошли все материалы!<br/>
          Перейдите в&nbsp;
          <Link href="/lk?tab=progress"><a>личный&nbsp;кабинет</a></Link>,
          чтобы отправить доказательства «шара».
        </p>
      )}
    </main>
  )
}
