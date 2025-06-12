// pages/challenge.js  —  v2.4 (12 Jun 2025)
/*
  ▸ фикс «watched»  – раньше день считался непройденным,
    если заметка была пустая → появлялась лишняя кнопка + таймер 0 ч 0 мин
  ▸ добавлена отдельная кнопка «💾 Сохранить заметку»
  ▸ таймер теперь рисуем только если left > 0
  ▸ навигация: «← Назад» и иконка «📈 Прогресс»
  ▸ progress-dots красятся по факту записи в daily_progress,
    а не по наличию заметки
*/

import { useState, useEffect } from 'react'
import { useRouter }           from 'next/router'
import Head                    from 'next/head'
import confetti                from 'canvas-confetti'
import DayMaterial             from '../components/DayMaterial'
import useMe                   from '../utils/useMe'

/* ─────────────  SSR  ───────────── */
export async function getServerSideProps ({ query, req }) {
  const { tg, cid } = (await import('cookie')).parse(req.headers.cookie ?? '')
  if (!tg || !cid) return { redirect:{ destination:'/lk', permanent:false } }

  const day = Math.min(Math.max(+query.day || 1, 1), 14)
  const { supabase } = await import('../lib/supabase')

  // материал + факт наличия строки progress (заметка может быть пустая)
  const [{ data: mat }, { data: prg }] = await Promise.all([
    supabase.from('daily_materials').select('*').eq('day_no', day).single(),
    supabase.from('daily_progress' ).select('notes').match({ citizen_id:cid, day_no:day }).maybeSingle()
  ])

  // если день ещё заперт → в ЛК
  if (mat.unlock_at && new Date(mat.unlock_at) > Date.now())
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

  return {
    props:{
      dayNo   : day,
      material: {
        ...mat,
        notes : prg?.notes ?? '',   // строка заметки (может быть '')
      },
      watched : Boolean(prg)        // ← ключевая правка
    }
  }
}

/* ─────────────  CSR  ───────────── */
export default function ChallengePage ({ dayNo, material, watched: watchedSSR }) {

  const router        = useRouter()
  const { mutate }    = useMe()          // обновляем /api/me после отметки
  const [watched,setW]= useState(watchedSSR)
  const [note,   setN]= useState(material.notes)
  const [left,   setL]= useState(null)   // мс до открытия N+1

  /* таймер до N+1 */
  useEffect(()=>{
    if (watched || dayNo===14 || !material.unlock_at) return
    const t = setInterval(()=> {
      const ms = new Date(material.unlock_at) - Date.now()
      setL(ms>0 ? ms : 0)
    },1000)
    return ()=>clearInterval(t)
  },[watched, dayNo, material.unlock_at])

  /* салют на финальном дне */
  useEffect(()=>{ if (watched && dayNo===14) confetti({particleCount:200,spread:80}) },
             [watched, dayNo])

  /* POST /mark — отметка + заметка */
  async function handleDone (saveOnly=false) {
    const r = await fetch('/api/challenge/mark',{
      method :'POST',
      headers:{'Content-Type':'application/json'},
      body   : JSON.stringify({ day:dayNo, note })
    }).then(r=>r.json())

    if (r.ok){
      if (!saveOnly) setW(true)
      mutate()                   // подтягиваем прогресс-бар в ЛК
    } else alert('Ошибка: '+(r.error||'unknown'))
  }

  const fmt = ms => {
    const h = Math.floor(ms/3.6e6)
    const m = Math.floor(ms/6e4)%60
    return `${h} ч ${m} мин`
  }

  /* ─────────────  JSX  ───────────── */
  return (
    <main style={{maxWidth:900,margin:'0 auto',padding:'1rem'}}>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      <DayMaterial material={material}/>

      {/* 14 точек */}
      <div className="progress-wrapper" style={{margin:'20px 0 8px'}}>
        {Array.from({length:14}).map((_,i)=>(
          <span key={i}
                style={{
                  width:12,height:12,borderRadius:'50%',
                  background: i < dayNo-1 || (i===dayNo-1&&watched)
                               ? '#28a745' : '#c4c4c4'
                }}/>
        ))}
      </div>

      {/* таймер, только если реально > 0 мс */}
      {!watched && left>0 && (
        <p style={{color:'#666',fontSize:15,marginBottom:16}}>
          ⏰ Следующий день откроется через&nbsp;<b>{fmt(left)}</b>
        </p>
      )}

      {/* заметка */}
      <h3 style={{margin:'24px 0 6px'}}>💾 Ваша заметка</h3>
      <textarea rows={4}
                maxLength={1000}
                value={note}
                onChange={e=>setN(e.target.value)}
                style={{width:'100%',marginBottom:10}}/>

      {/* кнопки под заметкой */}
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        <button className="btn primary"
                onClick={()=>handleDone(true)}>💾 Сохранить заметку</button>

        {!watched
          ? <button className="btn primary"
                    onClick={()=>handleDone(false)}>
              ✔️ Я осознанно изучил материал
            </button>
          : <span style={{alignSelf:'center',color:'#28a745',fontWeight:600}}>
              ✅ Материал изучен
            </span>}
      </div>

      {/* навигация снизу */}
      <nav style={{marginTop:32,fontSize:18,display:'flex',
                  justifyContent:'space-between',alignItems:'center'}}>
        <button className="btn-link"
                onClick={()=>router.back()}>← Назад</button>

        <button className="btn-link"
                onClick={()=>router.push('/lk?tab=progress')} title="Прогресс">
          📈 
        </button>

        {dayNo<14 && watched && (!left||left<=0) && (
          <button className="btn-link"
                  onClick={()=>router.push(`/challenge?day=${dayNo+1}`)}>
            день {dayNo+1} →
          </button>
        )}
      </nav>
    </main>
  )
}
