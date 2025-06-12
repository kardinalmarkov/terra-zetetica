// pages/challenge.js
//
// Страница «День N» ─ пользовательский шаг 14-дневного челленджа.
//  ✅  ▸   видно таймер до N+1, но ТОЛЬКО пока текущий день не помечен как «изучен»
//  ✅  ▸   после отметки — кнопка исчезает, выводим “Материал изучен”
//  ✅  ▸   навигация: «← Назад» (к списку прогресса) + «→ день N+1»
//  ✅  ▸   поле заметки всегда видно (гость тоже может писать, maxLength=1000)
//  ✅  ▸   прогресс-бар из 14 точек
//  ✅  ▸   салют confetti на 14-м дне

import { useState, useEffect } from 'react'
import { useRouter }           from 'next/router'
import Head                    from 'next/head'
import confetti                from 'canvas-confetti'
import DayMaterial             from '../components/DayMaterial'
import useMe                   from '../utils/useMe'

/* ─────────────  SSR  ───────────── */
export async function getServerSideProps({ query, req }) {
  const { tg, cid } = (await import('cookie')).parse(req.headers.cookie ?? '')
  if (!tg || !cid) return { redirect:{ destination:'/lk', permanent:false } }

  const dayNo = Math.min(Math.max(+query.day || 1, 1), 14)
  const { supabase } = await import('../lib/supabase')

  /** берём материал дня и существующую заметку пользователя одновременно */
  const [{ data: mat }, { data: prg }] = await Promise.all([
    supabase.from('daily_materials').select('*').eq('day_no', dayNo).single(),
    supabase.from('daily_progress').select('notes')
            .match({ citizen_id: cid, day_no: dayNo }).maybeSingle()
  ])

  const material = { ...mat, note: prg?.notes || '' }

  // если день ещё «заперт» (unlock_at в будущем) — в Прогресс
  if (material.unlock_at && new Date(material.unlock_at) > Date.now()) {
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }
  }
  return { props:{ dayNo, material } }
}

/* ─────────────  CSR  ───────────── */
export default function ChallengePage({ dayNo, material }) {
  const router              = useRouter()
  const { mutate }          = useMe()           // пригодится позже, чтобы /api/me «обновился»
  const [watched, setWatch] = useState(Boolean(material.note))
  const [note,    setNote ] = useState(material.note)
  const [left,    setLeft ] = useState(null)    // мс до открытия следующего дня

  /* таймер запускаем только пока день не отмечен как изученный */
  useEffect(() => {
    if (watched || dayNo === 14 || !material.unlock_at) return
    const id = setInterval(
      () => setLeft(Math.max(0, new Date(material.unlock_at) - Date.now())),
      1000
    )
    return () => clearInterval(id)
  }, [watched, dayNo, material.unlock_at])

  /* салют по завершении всего курса */
  useEffect(() => {
    if (watched && dayNo === 14) confetti({ particleCount:200, spread:80 })
  }, [watched, dayNo])

  /** отметка «изучено» + сохранение заметки */
  async function handleDone() {
    const r = await fetch('/api/challenge/mark', {
      method :'POST',
      headers:{'Content-Type':'application/json'},
      body   : JSON.stringify({ day: dayNo, note })
    }).then(r=>r.json())

    if (r.ok) {
      setWatch(true)
      mutate()                    // обновить /api/me → прогресс-бар в ЛК синхронен
    } else alert('Ошибка сервера: '+(r.error||'unknown'))
  }

  /* helper – часы/минуты */
  const fmt = ms => {
    const h = Math.floor(ms/3600000)
    const m = Math.floor(ms/60000)%60
    return `${h} ч ${m} мин`
  }

  /* ─────────────  UI  ───────────── */
  return (
    <main style={{maxWidth:900,margin:'0 auto',padding:'1rem'}}>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      {/* собственно контент дня */}
      <DayMaterial material={material}/>

      {/* прогресс-бар */}
      <ul className="dots">
        {Array.from({length:14}).map((_,i)=>(
          <li key={i}
              className={i<dayNo-1 || (i===dayNo-1 && watched) ? 'done' : 'todo'}/>
        ))}
      </ul>

      {/* таймер до следующего дня – пока не нажали «изучил» */}
      {left!==null && !watched && (
        <p style={{color:'#666',margin:'6px 0 24px',fontSize:15}}>
          ⏰&nbsp;Следующий день откроется через&nbsp;<b>{fmt(left)}</b>
        </p>
      )}

      {/* заметка – поле доступно ВСЕГДА, даже гостю */}
      <h3 style={{marginTop:28}}>💾 Ваша заметка</h3>
      <textarea
        rows={4}
        maxLength={1000}
        style={{width:'100%',marginBottom:12}}
        value={note}
        onChange={e=>setNote(e.target.value)}
      />

      {/* если ещё не отмечен – кнопка, иначе надпись */}
      {!watched
        ? <button className="btn primary" onClick={handleDone}>
            ✔️ Я осознанно изучил материал
          </button>
        : <p style={{marginTop:8,color:'#28a745',fontWeight:600}}>
            ✅ Материал изучен
          </p>}

      {/* навигация снизу */}
      <nav style={{marginTop:32,fontSize:18,display:'flex',justifyContent:'space-between'}}>
        <button className="btn-link"
                onClick={()=>router.push('/lk?tab=progress')}>← Назад</button>

        {dayNo<14 && watched && (!left || left<=0) && (
          <button className="btn-link"
                  onClick={()=>router.push(`/challenge?day=${dayNo+1}`)}>
            день {dayNo+1} →
          </button>
        )}
      </nav>

      {/* точечки */}
      <style jsx>{`
        .dots{display:flex;gap:6px;list-style:none;padding:0;margin:26px 0 8px;justify-content:center}
        .dots li{width:12px;height:12px;border-radius:50%;background:#ccc}
        .dots li.done{background:#28a745}
      `}</style>
    </main>
  )
}
