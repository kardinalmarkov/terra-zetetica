// Страница «День N»
import { useState, useEffect } from 'react'
import { useRouter }           from 'next/router'
import Head                    from 'next/head'
import confetti                from 'canvas-confetti'
import DayMaterial             from '../components/DayMaterial'
import useMe                   from '../utils/useMe'

// ───────────── сервер ─────────────
export async function getServerSideProps ({ query, req }) {
  const dayNo = Math.min(Math.max(+query.day || 1, 1), 14)
  const { tg, cid } = (await import('cookie')).parse(req.headers.cookie ?? '')
  if (!tg || !cid) return { redirect:{ destination:'/lk', permanent:false } }

  const { supabase } = await import('../lib/supabase')

  /* материал дня + заметка пользователя (если была) */
  const [matRsp, noteRsp] = await Promise.all([
    supabase.from('daily_materials')
            .select('*').eq('day_no', dayNo).single(),
    supabase.from('daily_progress')
            .select('notes').match({ citizen_id:cid, day_no:dayNo }).maybeSingle()
  ])
  const material = { ...matRsp.data, note: noteRsp.data?.notes || '' }

  /* если день ещё закрыт – отправляем в Прогресс */
  if (material.unlock_at && new Date(material.unlock_at) > Date.now()) {
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }
  }
  return { props:{ dayNo, material } }
}

// ───────────── клиент ─────────────
export default function ChallengePage({ dayNo, material }) {
  const router              = useRouter()
  const { data }            = useMe()                     // { citizen }
  const [watched, setWatch] = useState(Boolean(material.note))
  const [note, setNote]     = useState(material.note)
  const [timeLeft, setLeft] = useState(null)              // мс до открытия N+1

  /* обратный счёт */
  useEffect(() => {
    if (dayNo === 14 || !material.unlock_at) return
    const id = setInterval(() => {
      setLeft(Math.max(0, new Date(material.unlock_at) - Date.now()))
    }, 1000)
    return () => clearInterval(id)
  }, [dayNo, material.unlock_at])

  /* салют на 14-м дне */
  useEffect(() => {
    if (dayNo === 14 && watched) confetti({ particleCount:200, spread:80 })
  }, [dayNo, watched])

  /* отметка «изучил» + сохранение заметки */
  async function handleDone () {
    const res = await fetch('/api/challenge/mark', {
      method :'POST',
      headers:{ 'Content-Type':'application/json' },
      body   : JSON.stringify({ day: dayNo, note })
    }).then(r => r.json())
    if (res.ok) setWatch(true)
    else alert('Ошибка сервера: ' + (res.error || 'unknown'))
  }

  /* переход к следующему дню */
  function gotoNext () { router.push(`/challenge?day=${dayNo+1}`) }

  // ───────────── UI ─────────────
  return (
    <main style={{margin:'0 auto',maxWidth:900,padding:'1rem'}}>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      <DayMaterial material={material}/>

      {/* прогресс-бар */}
      <ul className="dots">
        {Array.from({length:14}).map((_,i)=>(
          <li key={i}
              className={i < dayNo-1             ? 'done'
                        : i === dayNo-1 && watched ? 'done'
                        : 'todo'}
          />
        ))}
      </ul>

      {/* таймер до N+1 */}
      {timeLeft!==null && !watched && (
        <p style={{color:'#888',margin:'6px 0 22px'}}>
          🔒 Следующий день откроется через&nbsp;
          {Math.floor(timeLeft/3600000)} ч&nbsp;
          {Math.floor(timeLeft/60000)%60} мин
        </p>
      )}

      {/* заметки – всегда показываем поле, даже после отметки */}
      <h3 style={{marginTop:32}}>💾 Заметка</h3>
      <textarea
        rows={4}
        maxLength={1000}
        style={{width:'100%',marginBottom:12}}
        value={note}
        onChange={e=>setNote(e.target.value)}
      />

      {!watched && (
        <button className="btn primary" onClick={handleDone}>
          ✔️ Я осознанно изучил материал
        </button>
      )}

      {/* навигация */}
      <p style={{marginTop:28}}>
        <button className="btn-link" onClick={()=>router.push('/lk?tab=progress')}>
          ← к Прогрессу
        </button>
        {dayNo<14 && watched && timeLeft===0 && (
          <> | <button className="btn-link" onClick={gotoNext}>→ день {dayNo+1}</button></>
        )}
      </p>

      <style jsx>{`
        .dots{display:flex;gap:6px;list-style:none;padding:0;margin:24px 0}
        .dots li{width:12px;height:12px;border-radius:50%;background:#ccc}
        .dots li.done{background:#28a745}
      `}</style>
    </main>
  )
}
