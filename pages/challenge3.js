// pages/challenge3.js — «железобетонный» вариант для самых старых браузеров
// ========================================================================
//  • без fetch: все вызовы через utils/sbRest.js (XMLHttpRequest)
//  • полифиллы (Promise/Array.from) подгружаются лениво
//  • onClick + onTouchEnd события
//  • offline‑очередь localStorage (можно убрать, но без неё офлайн‑тапы теряются)
// ------------------------------------------------------------------------
import { useEffect, useState } from 'react'
import Link                   from 'next/link'
import DayMaterial            from '../components/DayMaterial'

// лёгкий XHR‑клиент
import sb                     from '../utils/sbRest'

const ONE_DAY  = 86_400_000
const QUEUE    = 'tz_queue_v1'

export async function getServerSideProps({ query, req }) {
  const { parse } = await import('cookie')
  const { tg, cid } = parse(req.headers.cookie || '')
  if (!tg || !cid) return { redirect:{destination:'/lk',permanent:false} }

  const day = Math.min(Math.max(+query.day || 1,1),14)

  // контент + прогресс — на сервере можно через supabase-js (node.js ≠ старый)
  const { supabase } = await import('../lib/supabase')
  const [mat, prg] = await Promise.all([
    supabase.from('daily_materials').select('*').eq('day_no',day).single(),
    supabase.from('daily_progress').select('day_no,watched_at').eq('citizen_id',cid)
  ])

  const watched = prg.data?.some(r=>r.day_no===day && r.watched_at)
  return { props:{ day, material: mat.data||null, watched } }
}

/* ------------------------- Client ------------------------- */
export default function Challenge3({ day, material, watched }){
  const [note,setNote]   = useState('')
  const [ok,setOK]       = useState(watched)
  const [left,setLeft]   = useState(()=>{
    const st=+localStorage.getItem('tz_started')||Date.now();
    return Math.max(0, st + day*ONE_DAY - Date.now())
  })
  const [stat,setStat]   = useState('idle') // idle|saving|saved|queued|err

  /* polyfills */
  useEffect(()=>{
    (async()=>{
      if(typeof Promise==='undefined') await import('es6-promise/auto')
      if(!Array.from) await import('core-js/features/array/from')
    })()
  },[])

  /* таймер */
  useEffect(()=>{
    if(left<=0) return; const id=setInterval(()=>setLeft(l=>l>0?l-1000:0),1000);return()=>clearInterval(id)
  },[left])

  /* flush queue online */
  useEffect(()=>{ window.addEventListener('online',flushQ); return()=>window.removeEventListener('online',flushQ) },[])

  async function flushQ(){
    const q=JSON.parse(localStorage.getItem(QUEUE)||'[]'); if(!q.length) return;
    const rest=[]; for(const r of q) if(!(await sb.upsert('daily_progress',r))) rest.push(r);
    localStorage.setItem(QUEUE,JSON.stringify(rest)); if(!rest.length) setStat('saved')
  }

  async function handleDone(){
    if(stat==='saving') return; setStat('saving')
    const row={ citizen_id:+localStorage.cid, day_no:day, watched_at:new Date().toISOString(), notes:note }
    const ok=await sb.upsert('daily_progress',row)
    if(ok){ setOK(true); setStat('saved'); if(!localStorage.getItem('tz_started')) localStorage.tz_started=Date.now() }
    else { const q=JSON.parse(localStorage.getItem(QUEUE)||'[]'); q.push(row); localStorage.setItem(QUEUE,JSON.stringify(q)); setStat('queued') }
  }
  async function handleNote(){
    if(stat==='saving') return; setStat('saving')
    const ok=await sb.patchNote(day,note)
    setStat(ok?'saved':'err')
  }

  const h=Math.floor(left/3.6e6),m=Math.floor(left/6e4)%60,s=Math.floor(left/1e3)%60

  return (
    <main style={{maxWidth:820,margin:'0 auto',padding:20,fontFamily:'sans-serif'}}>
      <h1>День {day}</h1>
      {material ? <DayMaterial material={material}/> : <em>Нет контента</em>}

      <textarea rows={4} style={{width:'100%',marginTop:16}} value={note} onChange={e=>setNote(e.target.value)}/>

      <div style={{display:'flex',gap:12,marginTop:12}}>
        <button onClick={handleNote} onTouchEnd={e=>{e.preventDefault();handleNote()}}>💾 Сохранить</button>
        <button onClick={handleDone} onTouchEnd={e=>{e.preventDefault();handleDone()}} disabled={ok}>✅ Я осознанно изучил</button>
        {stat==='saved'&&'✓'}{stat==='queued'&&'В очереди ✓'}{stat==='saving'&&'…'}
      </div>

      {day<14 && (
        <p style={{marginTop:24}}>До следующего дня: {h}ч {m}м {s}с</p>
      )}

      <nav style={{marginTop:32,display:'flex',justifyContent:'space-between'}}>
        {day>1 && <Link href={`/challenge3?day=${day-1}`}>◀ День {day-1}</Link>}
        {day<14 && <Link href={`/challenge3?day=${day+1}`} style={{opacity:left>0?0.4:1,pointerEvents:left>0?'none':'auto'}}>День {day+1} ▶</Link>}
      </nav>
    </main>
  )
}
