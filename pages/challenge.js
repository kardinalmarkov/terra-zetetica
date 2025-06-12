// pages/challenge.js
// ──────────────────────────────────────────────────────────────────────────────
// Страница «День N» + тай-аут до открытия следующего дня + прогресс-бар
import { useEffect, useState } from 'react'
import { useRouter }            from 'next/router'
import Head                     from 'next/head'
import confetti                 from 'canvas-confetti'
import DayMaterial              from '../components/DayMaterial'
import { mutate }           from 'swr';
import { parse }            from 'cookie';
import { supabase }         from '../lib/supabase';
import Link                 from 'next/link';

// ⓘ из utils/useMe берём cid, чтобы не тащить его через getServerSideProps
import useMe from '../utils/useMe'

// ──────────────────────────────────────────────────────────────────────────────
export async function getServerSideProps({ req, query }) {
  const { cid } = parse(req.headers.cookie || '');
  if (!cid) return { redirect:{ destination:'/lk', permanent:false } };

  const day = Math.min(Math.max(+query.day || 1, 1), 14);

  const [{ data: material }, { data: prog }] = await Promise.all([
    supabase
      .from('daily_materials')
      .select('*')
      .eq('day_no', day)
      .single(),
    supabase
      .from('daily_progress')
      .select('notes')
      .match({ citizen_id: cid, day_no: day })
      .maybeSingle()
  ]);

  return {
    props: {
      dayNo   : day,
      material: material || {},
      watched : !!prog,
      notes   : prog?.notes || ''
    }
  };
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

  const [left,setLeft] = useState(null);
  useEffect(()=>{
    if(!material.unlock_at) return;
    const id = setInterval(()=>{
      setLeft(Math.max(0,new Date(material.unlock_at)-Date.now()));
    },1000);
    return ()=>clearInterval(id);
  },[material.unlock_at]);
  
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
