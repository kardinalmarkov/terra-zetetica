// pages/challenge.js                                   v3.8 • 24 Jun 2025
//
//  • bug-fix: submit() отправляет правильные поля { day: dayNo, note }
//  • убрана привязка к Challenge.module.css → файл больше не обязателен
//  • импорт DayMaterial оставлен (если компонента нет — закомментируйте)
//  • живой таймер рассчитывается от citizens.challenge_started_at
//
import { useState, useEffect } from 'react'
import { useRouter }          from 'next/router'
import Head                   from 'next/head'
import Link                   from 'next/link'

// ↓ если компонента нет, просто закомментируйте – разметка будет без него
import DayMaterial            from '../components/DayMaterial'

/* ──────────────────────────────── SSR ──────────────────────────────── */
export async function getServerSideProps ({ query, req }) {
  const { tg, cid } = (await import('cookie')).parse(req.headers.cookie ?? '')
  if (!tg || !cid)
    return { redirect:{ destination:'/lk', permanent:false } }

  const dayNo = Math.min(Math.max(+query.day || 1, 1), 14)
  const { supabase } = await import('../lib/supabase')

  const [{ data:mat }, { data:row }, { data:cit }] = await Promise.all([
    supabase.from('daily_materials')
            .select('*').eq('day_no', dayNo).maybeSingle(),
    supabase.from('daily_progress')
            .select('day_no,watched_at,notes')
            .match({ citizen_id:cid, day_no:dayNo }).maybeSingle(),
    supabase.from('citizens')
            .select('challenge_started_at').eq('id', cid).maybeSingle()
  ])

  if (!mat)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

  /* ----------- доступ к дню: «предыдущий закрыт» + «прошло N×24ч» ---------- */
  if (dayNo > 1) {
    const { data:prev } = await supabase
      .from('daily_progress')
      .select('watched_at')
      .match({ citizen_id:cid, day_no:dayNo-1 })
      .maybeSingle()
    if (!prev?.watched_at)
      return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

    const startedAt = cit?.challenge_started_at
      ? new Date(cit.challenge_started_at)
      : new Date(prev.watched_at)               // fallback: время 1-го дня
    const unlockAt  = +startedAt + (dayNo-1)*86_400_000
    if (Date.now() < unlockAt)
      return { redirect:{ destination:'/lk?tab=progress', permanent:false } }
  }

  return {
    props:{
      dayNo,
      material: { ...mat, notes: row?.notes ?? '' },
      watched : Boolean(row?.watched_at),
      startedAtUTC: cit?.challenge_started_at ?? null
    }
  }
}

/* ─────────────────────────── Client Component ───────────────────────── */
export default function ChallengePage ({ dayNo, material, watched,
                                         startedAtUTC }) {

  const router                 = useRouter()
  const [note,  setNote ]      = useState(material.notes)
  const [saved, setSaved]      = useState(false)
  const [isDone,setDone ]      = useState(watched)
  const [leftMs,setLeftMs]     = useState(null)      // millis → следующий день

  /* live-timer до разблокировки */
  useEffect(() => {
    if (!startedAtUTC) return
    const next = +new Date(startedAtUTC) + dayNo*86_400_000   // (dayNo is 0-based)
    const tick = () => setLeftMs(Math.max(0, next - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [dayNo, startedAtUTC])

  /* отсылаем на бек-энд ----------------------------------------------------- */
  async function submit ({ saveOnly = false } = {}) {
    const res = await fetch('/api/challenge/mark', {
      method :'POST',
      headers:{ 'Content-Type':'application/json' },
      body   : JSON.stringify({
        day  : dayNo,
        note : note.trim(),
        saveOnly
      })
    }).then(r => r.json())

    if (!res.ok)            { alert('Ошибка: '+res.error); return }
    if (!saveOnly) setDone(true)
    setSaved(true); setTimeout(()=>setSaved(false),1500)
    router.replace(router.asPath, undefined, { scroll:false })
  }

  /* ──────────────────────────── UI ──────────────────────────── */
  return (
    <>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>
      <main style={{maxWidth:900,margin:'0 auto',padding:'1rem'}}>

        {/* Контент дня */}
        {typeof DayMaterial==='function'
          ? <DayMaterial material={material}/>
          : <article dangerouslySetInnerHTML={{__html:material.html}} />}

        {/* Заметка */}
        <h3 style={{margin:'24px 0 6px'}}>📝 Ваша заметка</h3>
        <textarea rows={4} style={{width:'100%'}}
                  value={note} onChange={e=>setNote(e.target.value)} />

        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:10}}>
          <button className="btn primary"
                  onClick={()=>submit({saveOnly:true})}>
            💾 Сохранить заметку
          </button>
          {saved && <span style={{color:'#28a745'}}>✔ сохранено</span>}

          {!isDone &&
            <button className="btn success" onClick={()=>submit()}>
              ✅ Я осознанно изучил
            </button>}
        </div>

        {/* Навигация */}
        <nav style={{
          marginTop:32,display:'flex',justifyContent:'space-between',
          fontSize:18,flexWrap:'wrap',gap:10}}>

          {dayNo>1 &&
            <Link href={`/challenge?day=${dayNo-1}`} scroll={false}
                  className="btn-link">← день {dayNo-1}</Link>}

          {/* след. день / таймер */}
          {dayNo<14 && isDone &&
            (leftMs>0
              ? <span style={{color:'#6c63ff'}}>
                  ⏰ {new Date(leftMs).toISOString().substr(11,8)}
                </span>
              : <Link href={`/challenge?day=${dayNo+1}`} scroll={false}
                      className="btn-link">день {dayNo+1} →</Link>)}

          {dayNo===14 && isDone &&
            <p style={{marginTop:10,color:'green'}}>
              🎉 Вы прошли все материалы! Перейдите в&nbsp;
              <Link href="/lk?tab=progress">личный кабинет</Link>.
            </p>}
        </nav>
      </main>
    </>
  )
}
