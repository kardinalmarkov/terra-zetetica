// pages/challenge.js
import { useState, useEffect } from 'react'
import { useRouter }           from 'next/router'
import Head                    from 'next/head'
import confetti                from 'canvas-confetti'
import DayMaterial             from '../components/DayMaterial'
import { parse }               from 'cookie'
import { supabase }            from '../lib/supabase'

export async function getServerSideProps({ req, query }) {
  const { cid } = parse(req.headers.cookie||'')
  if (!cid) return { redirect:{ destination:'/lk', permanent:false } }

  const day = Math.min(Math.max(+query.day||1,1),14)

  const [{ data: mat }, { data: prg }] = await Promise.all([
    supabase.from('daily_materials').select('*').eq('day_no',day).single(),
    supabase.from('daily_progress' ).select('notes').match({ citizen_id:cid, day_no:day }).maybeSingle()
  ])

  return { props:{
    dayNo   : day,
    material: mat || {},
    watched : !!prg,
    notes   : prg?.notes || ''
  }}
}

export default function Page({ dayNo, material, watched, notes }) {
  const router          = useRouter()
  const [done ,setDone ]= useState(watched)
  const [note ,setNote ]= useState(notes)
  const [left ,setLeft ]= useState(0)           // ⟵ одно объявление!

  /* таймер до unlock следующего дня */
  useEffect(()=>{
    if (!material.unlock_at) return
    const id = setInterval(()=>setLeft(
      Math.max(0, new Date(material.unlock_at)-Date.now())
    ),1000)
    return ()=>clearInterval(id)
  },[material.unlock_at])

  useEffect(()=>{ if (dayNo===14 && done) confetti({particleCount:180}) },[dayNo,done])

  async function mark(){
    const r = await fetch('/api/challenge/mark',{
      method :'POST',
      headers:{'Content-Type':'application/json'},
      body   : JSON.stringify({ dayNo, notes:note })
    })
    const j = await r.json().catch(()=>({}))
    if (j.ok) setDone(true)
    else      alert('Ошибка: '+(j.error||'server'))
  }

  return (
    <main style={{margin:'0 auto',maxWidth:880,padding:'1rem'}}>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      <DayMaterial material={material}/>

      {/* зелёные точки */}
      <ol className="dots">{Array.from({length:14}).map((_,i)=>(
        <li key={i} className={ i<dayNo-1 || (i===dayNo-1 && done) ? 'on':'off'}/>
      ))}</ol>

      {/* закрыт -> таймер */}
      {left>0 && (
        <p style={{margin:'12px 0 24px',color:'#666'}}>
          🔒 День {dayNo+1} откроется через&nbsp;
          {Math.floor(left/3600000)} ч {Math.floor(left/60000)%60} мин
        </p>
      )}

      {/* форма заметок доступна ВСЕГДА */}
      <h3>💾 Заметка к дню {dayNo}</h3>
      <textarea
        rows={4}
        maxLength={1000}
        value={note}
        onChange={e=>setNote(e.target.value)}
        style={{width:'100%',marginBottom:12}}
      />

      {!done
        ? <button className="btn primary" onClick={mark}>✔️ Я осознанно изучил материал</button>
        : <button className="btn secondary" onClick={mark}>💾 Обновить заметку</button>
      }

      {/* переход дальше */}
      {done && left===0 && dayNo<14 && (
        <button
          style={{marginTop:24}}
          className="btn secondary"
          onClick={()=>router.push(`/challenge?day=${dayNo+1}`)}
        >➡️ День {dayNo+1}</button>
      )}

      <style jsx>{`
        .dots{display:flex;gap:6px;list-style:none;padding:0;margin:24px 0}
        .dots li{width:12px;height:12px;border-radius:50%;background:#ccc}
        .dots li.on{background:#3baf4a}
      `}</style>
    </main>
  )
}
