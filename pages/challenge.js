// pages/challenge.js
// v3.0 • 18 Jun 2025
//
// ──────────────────────────────────────────────────────────────
//  • day N открывается, когда прошло ≥ (N-1)×24 часов c момента
//    challenge_started_at (ставится в /api/challenge/start)
//  • предыдущий день должен быть отмечен «изучен» (иначе редирект)
//  • фикс build-ошибки (✔️ и «unterminated string»)
// ──────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { useRouter }          from 'next/router'
import Head                   from 'next/head'
import Link                   from 'next/link'
import DayMaterial            from '../components/DayMaterial'
import useMe                  from '../utils/useMe'

/* ─────────────  SSR  ───────────── */
export async function getServerSideProps ({ query, req }) {
  const { tg, cid } = (await import('cookie')).parse(req.headers.cookie ?? '')
  if (!tg || !cid)
    return { redirect:{ destination:'/lk', permanent:false } }

  const day = Math.min(Math.max(+query.day || 1, 1), 14)
  const { supabase } = await import('../lib/supabase')

  /* читаем материал и строку прогресса пользователя  */
  const [{ data: mat }, { data: prg }] = await Promise.all([
    supabase.from('daily_materials')
            .select('*').eq('day_no', day).maybeSingle(),
    supabase.from('daily_progress')
            .select('notes, watched_at')
            .match({ citizen_id: cid, day_no: day })
            .maybeSingle()
  ])

  if (!mat)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

  /* когда пользователь стартовал челлендж */
  const { data: citizen } = await supabase
    .from('citizens')
    .select('challenge_started_at')
    .eq('id', cid)
    .single()

  const started = citizen?.challenge_started_at
        ? new Date(citizen.challenge_started_at)
        : new Date()            // fallback — не должен случаться

  const hoursGone = (Date.now() - started.getTime()) / 3.6e6
  const allowedDay = Math.floor(hoursGone / 24) + 1          // 1-based

  if (day > allowedDay)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

  /* плюс проверяем, что предыдущий день реально закрыт */
  if (day > 1 && !prg?.watched_at) {
    const { data: prev } = await supabase
      .from('daily_progress')
      .select('watched_at')
      .match({ citizen_id: cid, day_no: day - 1 })
      .maybeSingle()

    if (!prev)
      return { redirect:{ destination:'/lk?tab=progress', permanent:false } }
  }

  return {
    props:{
      dayNo   : day,
      material: { ...mat, notes: prg?.notes ?? '' },
      watched : Boolean(prg)
    }
  }
}

/* ─────────────  CSR  ───────────── */
export default function ChallengePage ({ dayNo, material, watched }) {
  const router       = useRouter()
  const { mutate }   = useMe()

  const [isDone,setDone] = useState(watched)
  const [note,setNote  ] = useState(material.notes)
  const [saved,setSaved ] = useState(false)

  /* при смене дня синхронизируем state */
  useEffect(()=>{
    setDone(watched)
    setNote(material.notes)
    setSaved(false)
  },[router.asPath])           //eslint-disable-line react-hooks/exhaustive-deps

  /* confetti – только в браузере и только после 14 дня */
  useEffect(()=>{
    if (isDone && dayNo===14){
      import('canvas-confetti').then(({default:confetti})=>
        confetti({particleCount:180,spread:70}))
    }
  },[isDone,dayNo])

  async function submit({saveOnly=false}={}) {
    const r = await fetch('/api/challenge/mark',{
      method :'POST',
      headers:{'Content-Type':'application/json'},
      body   : JSON.stringify({ day:dayNo, note, saveOnly })
    }).then(r=>r.json())

    if (r.ok){
      if (!saveOnly) setDone(true)
      setSaved(true); setTimeout(()=>setSaved(false),2000)
      mutate()                         // обновим /api/me
    } else alert('Ошибка: '+(r.error||'unknown'))
  }

  return (
    <main style={{maxWidth:900,margin:'0 auto',padding:'1rem'}}>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      <DayMaterial material={material}/>

      {/* индикаторы 1-14 */}
      <div style={{display:'flex',gap:6,margin:'22px 0 6px'}}>
        {Array.from({length:14}).map((_,i)=>(
          <span key={i}
            style={{
              width:12,height:12,borderRadius:'50%',
              background:
                i<dayNo-1 || (i===dayNo-1&&isDone)?'#28a745':'#ccc'
            }}/>
        ))}
      </div>

      {/* заметка */}
      <h3 style={{margin:'26px 0 6px'}}>📝 Ваша заметка</h3>
      <textarea rows={4} maxLength={1000}
        value={note}
        onChange={e=>setNote(e.target.value)}
        style={{width:'100%',marginBottom:10}}
      />

      <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
        <button className="btn primary"
                onClick={()=>submit({saveOnly:true})}>
          💾 Сохранить заметку
        </button>
        {saved && <span style={{color:'#28a745',fontWeight:600}}>✔️ сохранено</span>}

        {!isDone &&
          <button className="btn primary" onClick={()=>submit()}>
            ✅ Материал изучен
          </button>}
      </div>

      {/* навигация */}
      <nav style={{marginTop:34,display:'flex',
                   justifyContent:'space-between',fontSize:18}}>
        <button className="btn-link" onClick={()=>router.back()}>← Назад</button>

        <Link href="/lk?tab=progress" className="btn-link" scroll={false}>📈</Link>

        {dayNo<14 && isDone &&
          <Link href={`/challenge?day=${dayNo+1}`} className="btn-link" scroll={false}>
            день {dayNo+1} →
          </Link>}
      </nav>
    </main>
  )
}
