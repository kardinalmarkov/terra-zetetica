// pages/challenge.js
//
// Страница одного дня челленджа: только отметка прочитанного и сохранение заметки.
// Убираем все вопросы/ответы — пользователь кликает «✔️ Я осознанно изучил материал»
// и при желании оставляет свои заметки.

import Head             from 'next/head'
import { parse }        from 'cookie'
import { supabase }     from '../lib/supabase'
import DayMaterial     from '../components/DayMaterial'
import { useState, useEffect } from 'react'
import confetti         from 'canvas-confetti'
import { useRouter }    from 'next/router'
import Link             from 'next/link'

export default function ChallengePage({ dayNo, material, watched, notes }) {
  const router = useRouter()
  const [done, setDone]     = useState(watched)
  const [myNote, setMyNote] = useState(notes || '')

  // при смене дня сбрасываем заметку в state
  useEffect(() => {
    setDone(watched)
    setMyNote(notes || '')
  }, [watched, notes, dayNo])

  // конфетти на финальном дне после отметки
  useEffect(() => {
    if (dayNo === 14 && done) {
      confetti({ particleCount: 200, spread: 80 })
    }
  }, [done, dayNo])

  // отмечаем день как прочитанный
  async function markRead() {
    const res = await fetch('/api/challenge/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dayNo, notes: myNote })
    })
    const json = await res.json()
    if (json.ok) setDone(true)
    else alert('Ошибка сохранения отметки: ' + (json.error || 'unknown'))
  }

  return (
    <>
      <Head>
        <title>День {dayNo} из 14 • Терра Zetetica</title>
      </Head>
      <main style={{ maxWidth: 720, margin: '2rem auto', padding: '0 1rem' }}>
        <h1>День {dayNo} / 14</h1>

        <DayMaterial material={material} />

        {/* Кнопка отметки прочитанного */}
        {!done ? (
          <button
            onClick={markRead}
            style={{
              background: '#28a745',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: 6,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            ✔️ Я осознанно изучил материал этого дня
          </button>
        ) : (
          <p style={{ color: '#28a745', fontWeight: 'bold' }}>
            ✔️ Материал отмечен
          </p>
        )}

        {/* Форма заметок */}
        {done && (
          <div style={{ marginTop: 24 }}>
            <textarea
              value={myNote}
              onChange={e => setMyNote(e.target.value)}
              placeholder="Ваши заметки…"
              rows={5}
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 4,
                border: '1px solid #ccc',
                fontSize: 14,
              }}
            />
            <button
              onClick={markRead}
              style={{
                marginTop: 8,
                background: '#007bff',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              💾 Сохранить заметку
            </button>
          </div>
        )}

        {/* Навигация: назад и следующий день */}
        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <button onClick={() => router.back()} style={{ cursor: 'pointer' }}>
            ← Назад
          </button>
          {dayNo < 14 && (
            <Link href={`/challenge?day=${dayNo + 1}`}>
              <a>➡️ Перейти к дню {dayNo + 1}</a>
            </Link>
          )}
          {dayNo === 14 && (
            <Link href="/lk?tab=progress">
              <a>📈 Мой прогресс</a>
            </Link>
          )}
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps({ req, query }) {
  // достаём cid из куки
  const { cid } = parse(req.headers.cookie || '')
  if (!cid) {
    // если нет cid — в личный кабинет (где будет авторизация)
    return { redirect: { destination: '/lk', permanent: false } }
  }

  const day = Number(query.day) || 1

  // берём содержимое материала (HTML)
  const { data: mat } = await supabase
    .from('daily_materials')
    .select('content_html')
    .eq('day_no', day)
    .single()

  // проверяем, отмечен ли этот день у пользователя
  const { data: prog } = await supabase
    .from('daily_progress')
    .select('id, notes')
    .eq('citizen_id', cid)
    .eq('day_no', day)
    .maybeSingle()

  return {
    props: {
      dayNo:   day,
      material: mat || { content_html: '<p>Материал не найден.</p>' },
      watched:  Boolean(prog),
      notes:    prog?.notes || '',
    }
  }
}
