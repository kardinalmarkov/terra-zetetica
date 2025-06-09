// pages/challenge.js
// ──────────────────────────────────────────────────────────────────────────────
// Основная страница 14-дневного челленджа: показывает материалы, вопросы и селектор дней.

import { parse } from 'cookie'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import DayPicker from '../components/DayPicker'
import { supabase } from '../lib/supabase'

export default function Challenge({ user, citizen, material, watched }) {
  const router = useRouter()
  const [done, setDone] = useState(watched)

  // Отправка ответа / отметки просмотра
  async function mark(reply = 'ok') {
    try {
      const res = await fetch('/api/challenge/watch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day: material.day_no, reply })
      })
      const json = await res.json()
      if (json.ok) setDone(true)
      else throw new Error(json.err || 'unknown error')
    } catch (err) {
      alert('Ошибка! Попробуйте ещё раз. ' + err.message)
    }
  }

  // Начало челленджа через fetch с обработкой ошибок
  async function startChallenge() {
    try {
      const res = await fetch('/api/challenge/start', { method: 'POST' })
      const json = await res.json()
      if (json.ok) router.replace('/challenge')
      else throw new Error(json.err || 'unknown error')
    } catch (err) {
      alert('Не удалось начать челлендж: ' + err.message)
    }
  }

  if (!user) {
    return <p style={{ padding: '2rem' }}>Сначала войдите через Telegram.</p>
  }
  if (!citizen) {
    return <p style={{ padding: '2rem' }}>Получите гражданство, чтобы участвовать.</p>
  }

  if (citizen.challenge_status !== 'active') {
    return (
      <main style={{ padding: '2rem' }}>
        <h2>Старт 14-дневного челленджа</h2>
        <button onClick={startChallenge} className="btn">🚀 Начать челлендж</button>
      </main>
    )
  }

  return (
    <>
      <Head>
        <title>День {material.day_no} • Челлендж</title>
      </Head>
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1rem' }}>
        <h2>День {material.day_no} / 14</h2>
        <h3>{material.title}</h3>

        {material.media_url && (
          /\.(jpe?g|png|webp|gif)$/i.test(material.media_url) ? (
            <img
              src={material.media_url}
              alt={material.title}
              style={{ maxWidth: '100%', borderRadius: 6 }}
            />
          ) : (
            <iframe
              src={material.media_url}
              width="100%"
              height="380"
              style={{ border: 0, borderRadius: 6 }}
              allowFullScreen
            />
          )
        )}

        <p style={{ marginTop: 16 }}>{material.description}</p>

        {!done && material.question && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              mark(e.target.reply.value)
            }}
          >
            <p style={{ fontWeight: 500 }}>{material.question}</p>
            <input
              name="reply"
              required
              style={{ padding: '.45rem .8rem', border: '1px solid #ccc', borderRadius: 6 }}
            />
            <button className="btn" style={{ marginLeft: 12 }}>
              Ответить
            </button>
          </form>
        )}

        {!done && !material.question && (
          <button className="btn" onClick={() => mark()}>
            ✔ Отметить просмотр
          </button>
        )}

        {done && <p style={{ color: 'green', marginTop: 16 }}>✔ Материал отмечен</p>}

        <div style={{ marginTop: 20 }}>
          <DayPicker
            maxDay={Math.min(material.day_no, 14)}
            currentDay={material.day_no}
            onChange={(n) => router.push('/challenge?day=' + n)}
          />
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps({ req, query }) {
  const { tg, cid } = parse(req.headers.cookie || '')
  const user = tg ? JSON.parse(Buffer.from(tg, 'base64').toString()) : null
  const { data: citizen } = cid
    ? await supabase.from('citizens').select('*').eq('id', cid).single()
    : { data: null }

  if (!citizen || citizen.challenge_status !== 'active') {
    return { props: { user, citizen: citizen || null, material: {}, watched: false } }
  }

  const { count } = await supabase
    .from('daily_progress')
    .select('*', { head: true, count: 'exact' })
    .eq('citizen_id', cid)

  const today = Math.min(count + 1, 14)
  const reqDay = Number(query.day)
  const dayNo = reqDay >= 1 && reqDay <= today ? reqDay : today

  const { data: material } = await supabase
    .from('daily_materials')
    .select('*')
    .eq('day_no', dayNo)
    .single()

  const { data: already } = await supabase
    .from('daily_progress')
    .select('id')
    .eq('citizen_id', cid)
    .eq('day_no', dayNo)
    .maybeSingle()

  return {
    props: {
      user,
      citizen,
      material,
      watched: !!already
    }
  }
}
