// pages/challenge.js                                v3.8 • 24 Jun 2025
//
// • вернули DayMaterial и «📈»-линк
// • убрали не-существующий Challenge.module.css
// • submit() → { day:dayNo, note, saveOnly } + credentials:'include'
// • остальные правки минимальны (комментарии / мелкая типизация)
// ──────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { useRouter }           from 'next/router'
import Head                    from 'next/head'
import Link                    from 'next/link'
import DayMaterial             from '../components/DayMaterial'      // ← снова на месте
import useMe                   from '../utils/useMe'

/* ────────────────────────────── SSR ────────────────────────────── */
export async function getServerSideProps ({ query, req }) {
  const { tg, cid } = (await import('cookie')).parse(req.headers.cookie ?? '')
  if (!tg || !cid)
    return { redirect:{ destination:'/lk', permanent:false } }

  const dayNo = Math.min(Math.max(+query.day || 1, 1), 14)

  const { supabase } = await import('../lib/supabase')
  const [matR, rowsR, citR] = await Promise.all([
    supabase.from('daily_materials')
            .select('*').eq('day_no', dayNo).maybeSingle(),
    supabase.from('daily_progress')
            .select('day_no, watched_at, notes')
            .eq('citizen_id', cid),
    supabase.from('citizens')
            .select('challenge_started_at').eq('id', cid).single()
  ])

  const material = matR.data
  if (!material)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

  /* ── точка старта ── */
  let startedISO = citR.data?.challenge_started_at
  if (!startedISO) {
    const row1 = rowsR.data?.find(r => r.day_no === 1)
    startedISO = row1?.watched_at ?? null
  }

  /* ── какой день уже можно открывать ── */
  const hrs = startedISO ? (Date.now() - new Date(startedISO)) / 3.6e6 : 1e6
  const byTime = Math.floor(hrs / 24) + 1
  const byDone = (rowsR.data?.reduce(
                    (m, r) => r.watched_at ? Math.max(m, r.day_no) : m, 0) || 0) + 1
  const allowed = Math.min(byTime, byDone)
  const prevOk  = dayNo === 1 ||
                  rowsR.data?.some(r => r.day_no === dayNo - 1 && r.watched_at)

  if (dayNo > allowed || !prevOk)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

  const curRow = rowsR.data?.find(r => r.day_no === dayNo) || {}
  return {
    props:{
      dayNo,
      material : { ...material, notes: curRow.notes || '' },
      watched  : Boolean(curRow.watched_at),
      unlockIn : ((dayNo - 1) * 24 - hrs) * 3600    // сек до (N-1)·24 ч
    }
  }
}

/* ──────────────────────────── Client ──────────────────────────── */
export default function ChallengePage ({ dayNo, material, watched, unlockIn }) {
  const router           = useRouter()
  const { mutate }       = useMe()

  /* локальный state */
  const [isDone , setDone ] = useState(watched)
  const [note   , setNote ] = useState(material.notes)
  const [savedOk, setSaved] = useState(false)

  /* живой таймер (сек) */
  const [secLeft, setLeft]  = useState(Math.max(0, Math.floor(unlockIn)))
  useEffect(() => {
    if (secLeft <= 0) return
    const id = setInterval(() => setLeft(s => s - 1), 1000)
    return () => clearInterval(id)
  }, [secLeft])

  /* ресет при смене ?day= */
  useEffect(() => {
    setDone(watched); setNote(material.notes); setSaved(false)
  }, [router.asPath, watched, material.notes])

  /* 🎉 конфетти после дня 14 */
  useEffect(() => {
    if (isDone && dayNo === 14)
      import('canvas-confetti')
        .then(m => m.default({ particleCount: 200, spread: 80 }))
  }, [isDone, dayNo])

  /* ---------- submit ---------- */
  async function submit ({ saveOnly = false } = {}) {
    const res = await fetch('/api/challenge/mark', {
      method      : 'POST',
      headers     : { 'Content-Type':'application/json' },
      credentials : 'include',
      body        : JSON.stringify({
        day      : dayNo,
        note     : note.trim(),
        saveOnly
      })
    }).then(r => r.json())

    if (!res.ok) {
      alert('Ошибка: ' + (res.error || 'unknown'))
      if (res.error === 'not-auth') location.href = '/lk'
      return
    }

    if (!saveOnly) setDone(true)
    setSaved(true); setTimeout(() => setSaved(false), 1500)
    mutate()                      // ⚡ обновляем useMe / прогресс
  }

  /* ---------- UI ---------- */
  return (
    <main style={{ maxWidth: 900, margin:'0 auto', padding:'1rem' }}>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      {/* контент урока */}
      <DayMaterial material={material} />

      {/* индикатор 14-ти точек */}
      <div style={{ display:'flex', gap:6, margin:'22px 0' }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i}
                style={{
                  width:12, height:12, borderRadius:'50%',
                  background: i < dayNo - 1 || (i === dayNo - 1 && isDone)
                               ? '#28a745' : '#ccc'
                }}/>
        ))}
      </div>

      {/* заметка + кнопки */}
      <h3 style={{ margin:'26px 0 6px' }}>📝 Ваша заметка</h3>
      <textarea rows={4} maxLength={1000}
                style={{ width:'100%', marginBottom:10 }}
                value={note}
                onChange={e => setNote(e.target.value)}/>

      <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:26 }}>
        <button className="btn primary" onClick={() => submit({ saveOnly:true })}>
          💾 Сохранить заметку
        </button>
        {savedOk && <span style={{ color:'#28a745', fontWeight:600 }}>✔ сохранено</span>}

        {!isDone &&
          <button className="btn primary" onClick={() => submit()}>
            ✅ Я осознанно изучил
          </button>}
        {isDone &&
          <span style={{ color:'#28a745', fontWeight:600 }}>Материал пройден 🎉</span>}
      </div>

      {/* таймер до следующего дня */}
      {dayNo < 14 && !isDone && secLeft > 0 && (
        <p style={{ color:'#6c63ff' }}>
          ⏰ Следующий день станет доступен через&nbsp;
          <b>
            {Math.floor(secLeft/3600)} ч&nbsp;
            {Math.floor(secLeft/60)%60} мин&nbsp;
            {secLeft%60} с
          </b>
        </p>
      )}

      {/* навигация */}
      <nav style={{
        marginTop:30, display:'flex', justifyContent:'space-between', fontSize:18
      }}>
        <button className="btn-link" onClick={() => router.back()}>← Назад</button>
        <Link href="/lk?tab=progress" className="btn-link" scroll={false}>📈</Link>

        {dayNo < 14 && isDone && secLeft <= 0 &&
          <Link href={`/challenge?day=${dayNo+1}`} className="btn-link"
                scroll={false}>день {dayNo+1} →</Link>}
      </nav>

      {/* финальный баннер */}
      {dayNo === 14 && isDone && (
        <p style={{ marginTop:30, fontSize:18, color:'green' }}>
          🎉 Вы прошли все материалы!<br/>
          Перейдите в&nbsp;
          <Link href="/lk?tab=progress">личный кабинет</Link>,
          чтобы отправить доказательства «шара».
        </p>
      )}
    </main>
  )
}
