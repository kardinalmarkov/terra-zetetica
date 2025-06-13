// pages/challenge.js            v3.2 • 18 Jun 2025
//
// ▸ минимальное из двух правил разблокировки
//     ① «с момента старта + 24 ч»
//     ② «предыдущий день закрыт»
// ▸ watched_at фиксируется только однажды (см. /api/challenge/mark.js)
// ▸ после «Материал изучен» показываем навигацию к следующему дню
// ▸ на 14-м дне поздравляем и ведём в ЛК (↗ вкладка progress)

import { useState, useEffect } from 'react'
import { useRouter }          from 'next/router'
import Head                   from 'next/head'
import Link                   from 'next/link'
import DayMaterial            from '../components/DayMaterial'
import useMe                  from '../utils/useMe'

/* ----------------------- SSR ----------------------- */
export async function getServerSideProps({ query, req }) {
  const { tg, cid } = (await import('cookie')).parse(req.headers.cookie ?? '')
  if (!tg || !cid)
    return { redirect: { destination: '/lk', permanent: false } }

  const day = Math.min(Math.max(+query.day || 1, 1), 14)
  const { supabase } = await import('../lib/supabase')

  /* материал + заметка/просмотр + весь прогресс пользователя */
  const [matRsp, curRsp, allRsp, citRsp] = await Promise.all([
    supabase.from('daily_materials')
            .select('*')
            .eq('day_no', day)
            .maybeSingle(),

    supabase.from('daily_progress')
            .select('notes, watched_at')
            .match({ citizen_id: cid, day_no: day })
            .maybeSingle(),

    supabase.from('daily_progress')
            .select('day_no, watched_at')
            .eq('citizen_id', cid),

    supabase.from('citizens')
            .select('challenge_started_at')
            .eq('id', cid)
            .single()
  ])

  const mat   = matRsp.data
  const prg   = curRsp.data
  const all   = allRsp.data || []
  const start = citRsp.data?.challenge_started_at
             || all.find(r => r.day_no === 1)?.watched_at
             || null                                // может быть null

  if (!mat)
    return { redirect: { destination: '/lk?tab=progress', permanent: false } }

  /* ---- вычисляем разрешённый максимум дня ---- */
  const elapsedHours = start ? (Date.now() - new Date(start)) / 3.6e6 : 0
  const byTime       = start ? Math.floor(elapsedHours / 24) + 1 : 1
  const lastDone     = all.reduce((m, r) =>
                      r.watched_at ? Math.max(m, r.day_no) : m, 0)
  const byDone       = lastDone + 1
  const allowedDay   = Math.max(byTime, byDone)

  if (day > allowedDay ||
      (day > 1 && !all.find(r => r.day_no === day - 1 && r.watched_at)))
    return { redirect: { destination: '/lk?tab=progress', permanent: false } }

  return {
    props: {
      dayNo   : day,
      material: { ...mat, notes: prg?.notes ?? '' },
      watched : Boolean(prg?.watched_at)
    }
  }
}

/* ----------------------- CSR ----------------------- */
export default function ChallengePage({ dayNo, material, watched }) {
  const router           = useRouter()
  const { mutate }       = useMe()                 // для обновления /api/me
  const [isDone,setDone] = useState(watched)
  const [note,setNote]   = useState(material.notes)
  const [saved,setSaved] = useState(false)

  /* синхронизация на смену URL */
  useEffect(() => {
    setDone(watched)
    setNote(material.notes)
    setSaved(false)
  }, [router.asPath])                             // eslint-disable-line

  /* конфетти при финале */
  useEffect(() => {
    if (isDone && dayNo === 14)
      import('canvas-confetti')
        .then(m => m.default({ particleCount: 180, spread: 70 }))
  }, [isDone, dayNo])

  /* POST → /api/challenge/mark */
  async function submit({ saveOnly = false } = {}) {
    const r = await fetch('/api/challenge/mark', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ day: dayNo, note, saveOnly })
    }).then(r => r.json())

    if (r.ok) {
      if (!saveOnly) setDone(true)
      setSaved(true); setTimeout(() => setSaved(false), 2000)
      mutate()                                     // перерисуем ЛК
    } else alert('Ошибка: ' + (r.error || 'unknown'))
  }

  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '1rem' }}>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      <DayMaterial material={material} />

      {/* 14 кружков */}
      <div style={{ display: 'flex', gap: 6, margin: '22px 0' }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} style={{
            width: 12, height: 12, borderRadius: '50%',
            background:
              i < dayNo - 1 || (i === dayNo - 1 && isDone) ? '#28a745' : '#ccc'
          }} />
        ))}
      </div>

      {/* заметка */}
      <h3 style={{ margin: '26px 0 6px' }}>📝 Ваша заметка</h3>
      <textarea rows={4} maxLength={1000}
        style={{ width: '100%', marginBottom: 10 }}
        value={note}
        onChange={e => setNote(e.target.value)}
      />

      {/* кнопки */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <button className="btn primary"
                onClick={() => submit({ saveOnly: true })}>
          💾 Сохранить заметку
        </button>
        {saved && <span style={{ color: '#28a745', fontWeight: 600 }}>✔️ сохранено</span>}

        {!isDone && (
          <button className="btn primary" onClick={() => submit()}>
            ✅ Материал изучен
          </button>
        )}
      </div>

      {/* навигация снизу */}
      <nav style={{
        marginTop: 34, display: 'flex',
        justifyContent: 'space-between', fontSize: 18
      }}>
        <button className="btn-link" onClick={() => router.back()}>← Назад</button>

        <Link href="/lk?tab=progress" className="btn-link" scroll={false}>📈</Link>

        {dayNo < 14 && isDone && (
          <Link href={`/challenge?day=${dayNo + 1}`}
                className="btn-link" scroll={false}>
            день {dayNo + 1} →
          </Link>
        )}
      </nav>

      {/* финальный блок */}
      {dayNo === 14 && isDone && (
        <p style={{ marginTop: 26, fontSize: 18, color: 'green' }}>
          🎉 Вы прошли все материалы!&nbsp;
          Перейдите в&nbsp;
          <Link href="/lk?tab=progress"><a>личный&nbsp;кабинет</a></Link>,<br />
          чтобы отправить доказательства «шара».
        </p>
      )}
    </main>
  )
}
