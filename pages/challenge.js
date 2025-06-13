// pages/challenge.js
//
// ▸ Доступ к-дню = (предыдущий закрыт) && (прошло ≥ N × 24 ч от challenge_started_at)
// ▸ Если день недоступен → SSR-редирект в ЛК с query ?wait=секунд
// ▸ На клиенте показывается живой таймер «⏰ 00:23:51:08»
// ▸ Кнопка «Я осознанно изучил…» создаёт запись только один раз
// ▸ Сохранение заметки доступно в любой момент
//

import Head               from 'next/head'
import Link               from 'next/link'
import { parse }          from 'cookie'
import { useState,
         useEffect }      from 'react'
import { useRouter }      from 'next/router'
import { supabase }       from '../lib/supabase'

/* ───────────────────────────────── CLIENT ─────────────────────────────── */
export default function Challenge({ dayNo, material, watched, waitSec }) {

  /* локальное состояние -------------------------------------------------- */
  const [note,   setNote]   = useState(material.notes ?? '')
  const [isDone, setDone]   = useState(watched)     // материал отмечен?
  const [saved,  setSaved]  = useState(false)       // галочка-подтверждение
  const [left,   setLeft]   = useState(waitSec||0)  // секунд до разлока

  const router = useRouter()

  /* live-countdown ------------------------------------------------------- */
  useEffect(() => {
    if (!left) return
    const t = setInterval(() => setLeft(s => Math.max(0, s - 1)), 1_000)
    return () => clearInterval(t)
  }, [left])

  /* POST /api/challenge/mark  ------------------------------------------- */
  async function submit({ saveOnly = false } = {}) {
    const r = await fetch('/api/challenge/mark', {
      method : 'POST',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify({ day: dayNo, note, saveOnly })
    }).then(r => r.json())

    if (!r.ok) { alert('Ошибка: ' + (r.error || 'unknown')); return }

    /* маленькая «зелёная галочка» на 1.8 сек */
    setSaved(true); setTimeout(() => setSaved(false), 1_800)

    if (!saveOnly) {               // клик «изучил»
      setDone(true)
      /* перезагружаем страницу, чтобы пересчитать next-day / таймер */
      router.replace(router.asPath)
    }
  }

  /* ────────────────── UI ────────────────── */
  return (
    <>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      <main style={{ maxWidth:860, margin:'2rem auto', padding:'0 1rem' }}>

        {/* ---------- содержание урока ---------- */}
        <h2>{material.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: material.content_md||'' }} />

        {/* ---------- «бублик» прогресса ---------- */}
        <div style={{ margin:'18px 0' }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i}
              style={{
                display       : 'inline-block',
                width         : 10,
                height        : 10,
                borderRadius  : '50%',
                marginRight   : 4,
                background    : i < dayNo
                               ? (i < dayNo-1 ? '#28a745' : '#198754')
                               : '#ccc'
              }}
            />
          ))}
        </div>

        {/* ---------- заметка пользователя ---------- */}
        <h3>📝 Ваша заметка</h3>
        <textarea
          rows={4}
          maxLength={1_000}
          style={{ width:'100%', marginBottom:12 }}
          value={note}
          onChange={e => setNote(e.target.value)}
        />

        {/* кнопка «Сохранить заметку» */}
        <button className="btn primary" onClick={() => submit({ saveOnly:true })}>
          💾 Сохранить&nbsp;заметку
        </button>
        {saved && <span style={{ color:'#28a745', fontWeight:600, marginLeft:6 }}>✔️</span>}

        {/* чек-бокс «Материал изучен» */}
        {!isDone ? (
          <button className="btn primary" style={{ marginLeft:14 }} onClick={() => submit()}>
            ✔️ Я осознанно изучил материал
          </button>
        ) : (
          <span style={{ color:'#28a745', marginLeft:14, fontWeight:600 }}>
            Материал изучен
          </span>
        )}

        {/* ---------- навигация ---------- */}
        <div style={{ marginTop:26 }}>
          <Link href="/lk?tab=progress" className="btn-link">← Назад</Link>

          {/* next-day появляется ТОЛЬКО если текущий закрыт */}
          {dayNo < 14 && isDone &&
            <Link href={`/challenge?day=${dayNo + 1}`} scroll={false}
                  className="btn-link" style={{ float:'right' }}>
              день {dayNo + 1} →
            </Link>}
        </div>

        {/* финальный баннер после 14 дня */}
        {dayNo === 14 && isDone && (
          <p style={{ marginTop:32, fontSize:18, color:'green' }}>
            🎉 Все материалы пройдены!<br/>
            Перейдите в&nbsp;<Link href="/lk?tab=progress">Личный кабинет</Link>,
            чтобы отправить доказательства «шара».
          </p>
        )}

        {/* таймер ожидания */}
        {left > 0 && (
          <p style={{ marginTop:32, fontSize:18, color:'#dc3545' }}>
            ⏰ Следующий день откроется через&nbsp;
            {String(Math.floor(left / 3_600)).padStart(2,'0')}:
            {String(Math.floor(left / 60 % 60)).padStart(2,'0')}:
            {String(left % 60).padStart(2,'0')}
          </p>
        )}
      </main>
    </>
  )
}

/* ───────────────────────────────── SERVER (SSR) ───────────────────────── */
export async function getServerSideProps({ query, req }) {
  const { tg, cid } = parse(req.headers.cookie || '')
  if (!tg || !cid)
    return { redirect:{ destination:'/lk', permanent:false } }

  const dayNo = Math.min(Math.max(+query.day || 1, 1), 14)

  /* citizen нужен для challenge_started_at */
  const [
    { data: citizen },
    { data: material },
    { data: prev },
    { data: cur }
  ] = await Promise.all([
    supabase.from('citizens')
            .select('challenge_started_at').eq('id', cid).maybeSingle(),

    supabase.from('daily_materials')
            .select('*').eq('day_no', dayNo).maybeSingle(),

    /* проверяем, закрыт ли предыдущий день */
    supabase.from('daily_progress')
            .select('watched_at')
            .match({ citizen_id: cid, day_no: dayNo - 1 })
            .maybeSingle(),

    /* текущее прохождение/заметка */
    supabase.from('daily_progress')
            .select('notes')
            .match({ citizen_id: cid, day_no: dayNo })
            .maybeSingle()
  ])

  /* 1) материала нет → в ЛК */
  if (!material)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

  /* 2) вычисляем, какой день МОЖНО открыть по тайм-ауту */
  const startedAt = citizen?.challenge_started_at
  const allowDay  = startedAt
        ? 1 + Math.floor((Date.now() - new Date(startedAt)) / 86_400_000)
        : 1                                // fallback — только день 1

  const tooEarly  = dayNo > allowDay
  const prevMiss  = dayNo > 1 && !prev   // предыдущий не закрыт

  if (tooEarly || prevMiss) {
    /* сколько ждать до разлока? */
    const waitSec = tooEarly
      ? Math.max(0,
          Math.ceil((new Date(startedAt).getTime() + allowDay * 86_400_000 - Date.now()) / 1_000))
      : 0

    return {
      redirect:{
        destination:`/lk?tab=progress&wait=${waitSec}`,
        permanent  : false
      }
    }
  }

  return {
    props:{
      dayNo,
      material : { ...material, notes: cur?.notes || '' },
      watched  : !!cur,
      waitSec  : 0
    }
  }
}
