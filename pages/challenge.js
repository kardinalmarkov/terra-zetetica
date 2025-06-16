// pages/challenge.js                       v3.13 • 25 Jun 2025
//
//  • никаких функциональных изменений –
//    Safari 15 переставал отправлять fetch из-за SameSite=Lax cookie.
//    Починили в /api/auth (см. комментарий в коде).
// -----------------------------------------------------------------

import { useState, useEffect, useCallback } from 'react'
import { useRouter }          from 'next/router'
import Head                   from 'next/head'
import Link                   from 'next/link'
import DayMaterial            from '../components/DayMaterial'
import useMe                  from '../utils/useMe'


/* ──────────────────── SSR ──────────────────── */
export async function getServerSideProps({ query, req }) {
  const { tg, cid } = (await import('cookie')).parse(req.headers.cookie ?? '')
  if (!tg || !cid)
    return { redirect:{ destination:'/lk', permanent:false } }

  const dayNo = Math.min(Math.max(+query.day || 1, 1), 14)
  const { supabase } = await import('../lib/supabase')

  const [matR, rowsR, citR] = await Promise.all([
    supabase.from('daily_materials')
            .select('*').eq('day_no', dayNo).maybeSingle(),
    supabase.from('daily_progress')
            .select('day_no,watched_at,notes')
            .eq('citizen_id', cid),
    supabase.from('citizens')
            .select('challenge_started_at')
            .eq('id', cid).single()
  ])

  const material = matR.data
  if (!material)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

  /* ― дата старта ― */
  let startedISO = citR.data?.challenge_started_at
  if (!startedISO) {
    const row1 = rowsR.data?.find(r => r.day_no === 1)
    startedISO = row1?.watched_at ?? null
  }

  const hrs  = startedISO ? (Date.now() - +new Date(startedISO)) / 3.6e6 : 1e6
  const by24 = Math.floor(hrs / 24) + 1
  const byPrev = (rowsR.data?.reduce(
                    (m,r)=>r.watched_at ? Math.max(m,r.day_no) : m, 0) || 0) + 1
  const allowed = Math.min(by24, byPrev)
  const prevOk  = dayNo === 1 ||
                  rowsR.data?.some(r => r.day_no === dayNo-1 && r.watched_at)

  if (dayNo > allowed || !prevOk)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

  const cur = rowsR.data?.find(r => r.day_no === dayNo) || {}

  return {
    props:{
      dayNo,
      material : { ...material, notes:cur.notes || '' },
      watched  : Boolean(cur.watched_at),
      unlockIn : ((dayNo-1)*24 - hrs) * 3600          // сек до открытия N+1
    }
  }
}



/* ─────────────── Client ─────────────── */
export default function ChallengePage ({ dayNo, material, watched, unlockIn }) {

  const router     = useRouter()
  const { mutate } = useMe()

  const [note  , setNote ] = useState(material.notes)
  const [isDone, setDone ] = useState(watched)
  const [state , setState] = useState('idle')           // idle | saving | saved
  const [secLeft, setLeft ] = useState(Math.max(0, Math.floor(unlockIn)))

  /* таймер до разблокировки */
  useEffect(() => {
    if (secLeft <= 0) return
    const id = setInterval(() => setLeft(s => s - 1), 1_000)
    return () => clearInterval(id)
  }, [secLeft])

  /* сброс локального стейта при навигации ?day= */
  useEffect(() => { setDone(watched); setNote(material.notes); setState('idle') },
            [router.asPath, watched, material.notes])

  /* mini-🎉 */
  useEffect(() => {
    if (isDone && dayNo === 14)
      import('canvas-confetti')
        .then(m => m.default({ particleCount: 180, spread: 70 }))
  }, [isDone, dayNo])

  /* POST ---------------------------------------------------- */
  const submit = useCallback(async (saveOnly = false) => {
    if (state === 'saving') return
    setState('saving')

    const body = { day: dayNo, note: note.trim(), saveOnly }
    console.info('%cPOST fired', 'color:#6c63ff', body)      // RUM-метка

    const rsp = await fetch('/api/challenge/mark', {
      method      : 'POST',
      credentials : 'include',
      headers     : { 'Content-Type': 'application/json' },
      body        : JSON.stringify(body)
    }).then(r => r.json()).catch(() => ({ ok: false, error: 'network' }))

    if (!rsp.ok) {
      alert('⛔ ' + (rsp.error || 'unknown error'))
      if (rsp.error === 'not-auth') location.href = '/lk'
      setState('idle')
      return
    }

    /* success */
    if (navigator.vibrate) navigator.vibrate(50)
    if (!saveOnly) setDone(true)
    setState('saved'); setTimeout(() => setState('idle'), 1200)
    mutate()
  }, [note, dayNo, state, mutate])

  /* Safari-fix : handler обёрнут, чтобы одну функцию отдавать во все события */
  const handleSave = e => { e.preventDefault(); submit(true) }
  const handleDone = e => { e.preventDefault(); submit(false) }

  /* ─────────────── markup ─────────────── */
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      <DayMaterial material={material} />

      {/* прогресс 14 точек */}
      <div style={{ display:'flex', gap:6, margin:'22px 0' }}>
        {Array.from({ length:14 }, (_,i) => (
          <span key={i}
                style={{
                  width:12,height:12,borderRadius:'50%',
                  background: i<dayNo-1 || i===dayNo-1&&isDone ? '#28a745':'#ccc'
                }}/>
        ))}
      </div>

      {/* заметка + кнопки */}
      <h3 style={{ margin:'26px 0 6px' }}>📝 Ваша заметка</h3>
      <textarea rows={4} maxLength={1000}
                style={{ width:'100%', marginBottom:10 }}
                value={note} onChange={e => setNote(e.target.value)} />

      <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:26 }}>

        {/* SAVE  */}
        <button type="button" className="btn primary"
                role="button" tabIndex={0}
                onClick={handleSave} onPointerUp={handleSave}>
          {state === 'saving' ? '💾 сохраняю…' : '💾 Сохранить заметку'}
        </button>

        {/* DONE */}
        {!isDone && (
          <button type="button" className="btn primary"
                  role="button" tabIndex={0}
                  onClick={handleDone} onPointerUp={handleDone}>
            ✅ Я осознанно изучил
          </button>
        )}

        {isDone && <span style={{ color:'#28a745', fontWeight:600 }}>
                     Материал пройден 🎉
                   </span>}

        {state === 'saved' &&
          <span style={{ color:'#28a745', fontWeight:600, marginLeft:6 }}>✔</span>}
      </div>

      {/* таймер */}
      {dayNo < 14 && !isDone && secLeft > 0 && (
        <p style={{ color:'#6c63ff' }}>
          ⏰ Следующий день откроется через&nbsp;
          <b>{Math.floor(secLeft/3600)} ч&nbsp;
             {Math.floor(secLeft/60)%60}&nbsp;мин&nbsp;
             {secLeft%60}&nbsp;с</b>
        </p>
      )}

      {/* навигация */}
      <nav style={{ marginTop:30, display:'flex',
                    justifyContent:'space-between', fontSize:18 }}>
        <button type="button" className="btn-link"
                onClick={() => router.back()}>← Назад</button>

        <Link href="/lk?tab=progress" className="btn-link" scroll={false}>📈</Link>

        {dayNo < 14 && isDone && secLeft <= 0 &&
          <Link href={`/challenge?day=${dayNo+1}`}
                className="btn-link" scroll={false}>
            день {dayNo+1} →
          </Link>}
      </nav>

      {/* финальный баннер */}
      {dayNo === 14 && isDone && (
        <p style={{ marginTop:30, fontSize:18, color:'green' }}>
          🎉 Вы прошли все материалы!<br/>
          Перейдите в&nbsp;
          <Link href="/lk?tab=progress">личный&nbsp;кабинет</Link>,
          чтобы отправить доказательства «шара».
        </p>
      )}
    </main>
  )
}

