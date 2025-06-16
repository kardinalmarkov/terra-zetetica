// pages/challenge1.js  • offline‑friendly version of the 14‑day challenge page
// ---------------------------------------------------------------------------
// Goals
//  1. 100 % надёжная кнопка «✅ Я осознанно…» даже при временных сетевых
//     сбоях, старых мобильных браузерах, отсутствии Cookies и оффлайне.
//  2. Мгновенный отклик UI (optimistic UI) + фоновая повторная отправка.
//  3. Никаких лишних запросов — очередь хранится локально (localStorage).
//  4. Код максимально повторяет «/challenge», чтобы не ломать логику SSR.
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback } from 'react'
import { useRouter }           from 'next/router'
import Head                    from 'next/head'
import Link                    from 'next/link'
import DayMaterial             from '../components/DayMaterial'
import useMe                   from '../utils/useMe'

/* --------------- constants & helpers --------------- */
const LS_KEY = 'tz_pending_marks_v1'          // очередь «неотправленных» POST‑ов

const readQueue   = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]')
const writeQueue  = q  => localStorage.setItem(LS_KEY, JSON.stringify(q))
const pushToQueue = rec => { const q = readQueue(); q.push(rec); writeQueue(q) }

async function flushQueue () {
  const queue = readQueue()
  if (!queue.length) return

  const rest = []
  for (const rec of queue) {
    try {
      const ok = await fetch('/api/challenge/mark', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rec)
      }).then(r => r.ok)
      if (!ok) rest.push(rec)      // не удалось — остаётся в очереди
    } catch { rest.push(rec) }
  }
  writeQueue(rest)
}

/* -------------------- SSR -------------------- */
// Вытаскиваем готовую server‑side логику из существующей страницы
export { getServerSideProps } from './challenge'

/* ------------------ Component ----------------- */
export default function Challenge1Page ({ dayNo, material, watched, unlockIn }) {

  const router     = useRouter()
  const { mutate } = useMe()

  const [note  , setNote ] = useState(material.notes)
  const [isDone, setDone ] = useState(watched)
  const [state , setState] = useState('idle')           // idle | saving | saved
  const [secLeft, setLeft ] = useState(Math.max(0, Math.floor(unlockIn)))

  /* --- flush queue once on mount + при восстановлении сети/табов --- */
  useEffect(() => {
    flushQueue()
    const onOnline = () => flushQueue()
    window.addEventListener('online', onOnline)
    document.addEventListener('visibilitychange', onOnline)
    return () => {
      window.removeEventListener('online', onOnline)
      document.removeEventListener('visibilitychange', onOnline)
    }
  }, [])

  /* --- таймер открытия следующего дня --- */
  useEffect(() => {
    if (secLeft <= 0) return
    const id = setInterval(() => setLeft(s => s - 1), 1_000)
    return () => clearInterval(id)
  }, [secLeft])

  /* --- сброс стейта при переходах между ?day= --- */
  useEffect(() => { setDone(watched); setNote(material.notes); setState('idle') },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [router.asPath, watched, material.notes])

  /* --- мини‑конфетти на 14‑м дне --- */
  useEffect(() => {
    if (isDone && dayNo === 14)
      import('canvas-confetti').then(m => m.default({ particleCount: 180, spread: 70 }))
  }, [isDone, dayNo])

  /* ----------- POST /api/challenge/mark ----------- */
  const postMark = useCallback(async ({ saveOnly }) => {
    if (state === 'saving') return
    setState('saving')

    const payload = { day: dayNo, note: note.trim(), saveOnly }

    const trySend = async () => {
      try {
        const rsp = await fetch('/api/challenge/mark', {
          method: 'POST', credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        return rsp.ok && (await rsp.json()).ok
      } catch { return false }
    }

    const ok = await trySend()

    if (!ok) {
      // ¯\\_(ツ)_/¯  Сеть недоступна / cookie пропали — кладём в офф‑очередь
      pushToQueue(payload)
    }

    // optimistic UI
    if (!saveOnly) setDone(true)
    if (navigator.vibrate) navigator.vibrate(40)
    setState('saved'); setTimeout(() => setState('idle'), 1200)
    mutate()
  }, [dayNo, note, state, mutate])

  const handleSave = e => { e.preventDefault(); postMark({ saveOnly:true  }) }
  const handleDone = e => { e.preventDefault(); postMark({ saveOnly:false }) }

  /* ------------------- markup ------------------- */
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
                  background: i<dayNo-1 || (i===dayNo-1 && isDone) ? '#28a745':'#ccc'
                }}/>
        ))}
      </div>

      {/* заметка + кнопки */}
      <h3 style={{ margin:'26px 0 6px' }}>📝 Ваша заметка</h3>
      <textarea rows={4} maxLength={1000}
                style={{ width:'100%', marginBottom:10 }}
                value={note} onChange={e => setNote(e.target.value)} />

      <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:26 }}>
        {/* SAVE */}
        <button type="button" className="btn primary"
                onClick={handleSave} onPointerUp={handleSave}>
          {state === 'saving' ? '💾 сохраняю…' : '💾 Сохранить заметку'}
        </button>

        {/* DONE */}
        {!isDone && (
          <button type="button" className="btn primary"
                  onClick={handleDone} onPointerUp={handleDone}>
            ✅ Я осознанно изучил
          </button>
        )}

        {isDone && <span style={{ color:'#28a745', fontWeight:600 }}>Материал пройден 🎉</span>}
        {state === 'saved' && <span style={{ color:'#28a745', fontWeight:600, marginLeft:6 }}>✔</span>}
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
      <nav style={{ marginTop:30, display:'flex', justifyContent:'space-between', fontSize:18 }}>
        <button type="button" className="btn-link" onClick={() => router.back()}>← Назад</button>
        <Link href="/lk?tab=progress" className="btn-link" scroll={false}>📈</Link>
        {dayNo < 14 && isDone && secLeft <= 0 &&
          <Link href={`/challenge1?day=${dayNo+1}`} className="btn-link" scroll={false}>
            день {dayNo+1} →
          </Link>}
      </nav>

      {dayNo === 14 && isDone && (
        <p style={{ marginTop:30, fontSize:18, color:'green' }}>
          🎉 Вы прошли все материалы! Перейдите в&nbsp;
          <Link href="/lk?tab=progress">личный&nbsp;кабинет</Link>, чтобы отправить доказательства «шара».
        </p>
      )}
    </main>
  )
}
