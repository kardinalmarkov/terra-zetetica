// pages/lk.js            v2.9 • 18 Jun 2025
// ▸ вкладки: profile / passport / progress
// ▸ динамическая подгрузка заметок при смене URL
// ▸ после 14/14 появляется форма «💬 Обратная связь»
// ▸ кнопка ↩ К текущему дню ведёт туда, где пользователь сейчас

import Head          from 'next/head'
import Link          from 'next/link'
import { parse }     from 'cookie'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { supabase }  from '../lib/supabase'

export default function LK({ user, citizen, progress, notesJSON }) {
  const router            = useRouter()
  const [tab, setTab]     = useState(router.query.tab || 'profile')
  const [notesMap, setMap] = useState(JSON.parse(notesJSON || '{}'))

  /* -------- helpers -------- */
  const switchTab = k => {
    setTab(k)
    router.push(`/lk?tab=${k}`, undefined, { shallow: true })
  }
  const logout = () =>
    fetch('/api/logout', { method: 'POST' }).then(() => router.replace('/'))

  /* -------- guard: not authorised -------- */
  if (!user) return (
    <main style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
      <h2>Авторизация</h2>
      <p>Войдите через Telegram:</p>
      <div dangerouslySetInnerHTML={{ __html: `
<script async src="https://telegram.org/js/telegram-widget.js?15"
 data-telegram-login="ZeteticID_bot" data-size="large" data-userpic="true"
 data-lang="ru" data-request-access="write" data-auth-url="/api/auth"></script>` }} />
    </main>
  )

  /* -------- lazily refresh notes when URL changes -------- */
  useEffect(() => {
    if (!citizen?.id) return
    supabase
      .from('daily_progress')
      .select('day_no,notes')
      .eq('citizen_id', citizen.id)
      .then(({ data }) => {
        const m = { ...notesMap }
        data?.forEach(r => { if (r.notes) m[r.day_no] = r.notes })
        setMap(m)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  /* -------- UI -------- */
  return (
    <>
      <Head><title>Личный кабинет • Terra Zetetica</title></Head>

      <main style={{ maxWidth: 880, margin: '2rem auto', padding: '0 1rem' }}>
        {/* header */}
        <header style={{
          display: 'flex', justifyContent: 'space-between', marginBottom: 20
        }}>
          <strong>Здравствуйте, {user.first_name}!</strong>
          <button onClick={logout} className="btn-secondary">Выйти</button>
        </header>

        {/* tabs */}
        <nav style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
          {[
            ['profile',  '🙏 Профиль'],
            ['passport', '📜 Паспорт / 🏠 Челлендж'],
            ['progress', '📈 Прогресс']
          ].map(([k, l]) => (
            <button key={k} onClick={() => switchTab(k)}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: 6,
                border: tab === k ? '2px solid #6c63ff' : '1px solid #ccc',
                background: tab === k ? '#f0f0ff' : '#fff'
              }}>{l}</button>
          ))}
        </nav>

        {/* -------- 1. Profile -------- */}
        {tab === 'profile' && (
          <>
            <img src={user.photo_url} width={120} height={120}
                 style={{ borderRadius: 8 }} />
            <p>ID Telegram: <b>{user.id}</b></p>
            {!!user.username && <p>Username: <b>@{user.username}</b></p>}
            {citizen && (
              <p><b>Статус:</b> {citizen.status === 'valid'
                  ? '✅ Гражданин'
                  : citizen.status === 'guest'
                    ? '👤 Гость' : '❓'}
              </p>
            )}
          </>
        )}

        {/* -------- 2. Passport / Challenge -------- */}
        {tab === 'passport' && (
          <>
            {citizen ? (
              <>
                <p><strong>Z-ID:</strong> {citizen.zetetic_id || '—'}</p>

                {citizen.challenge_status === 'inactive' && (
                  <button className="btn primary"
                          onClick={() => fetch('/api/challenge/start',
                                                { method: 'POST' })
                                         .then(() => router.push('/challenge?day=1'))}>
                    🚀 Начать челлендж
                  </button>
                )}

                {citizen.challenge_status === 'active' && (
                  <p>⏳ Пройдено {progress} / 14</p>
                )}

                {citizen.challenge_status === 'finished' && (
                  <p style={{ color: 'green' }}>
                    🎉 Челлендж пройден — ждём ваших доказательств!
                  </p>
                )}
              </>
            ) : (
              <button className="btn primary"
                      onClick={() => fetch('/api/challenge/start',
                                            { method: 'POST' })
                                   .then(() => router.push('/challenge?day=1'))}>
                🚀 Присоединиться к челленджу
              </button>
            )}
          </>
        )}

        {/* -------- 3. Progress -------- */}
        {tab === 'progress' && (
          <>
            <h2 style={{ margin: '1rem 0' }}>🏠 Челлендж «Докажи шар»</h2>

            <p>Дней пройдено: <b>{progress}</b> / 14</p>
            <div style={{ background: '#eee', height: 12, borderRadius: 6, maxWidth: 400 }}>
              <div style={{
                width: `${progress / 14 * 100}%`,
                height: '100%', background: '#6c63ff', borderRadius: 6
              }} />
            </div>

            <button className="btn-link" style={{ marginTop: 12 }}
                    onClick={() => router.push(`/challenge?day=${Math.max(progress, 1)}`)}>
              ↩ К текущему дню
            </button>

            {/* форма обратной связи после 14/14 */}
            {progress === 14 && (
              <form onSubmit={async e => {
                      e.preventDefault()
                      const txt = e.target.fb.value.trim()
                      if (!txt) return
                      const r  = await fetch('/api/feedback', {
                        method : 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body   : JSON.stringify({ text: txt })
                      }).then(r => r.json())
                      if (r.ok) { alert('Спасибо!'); e.target.reset() }
                    }}
                    style={{ marginTop: 32, maxWidth: 500 }}>
                <h4>💬 Доказательства шара / обратная связь</h4>
                <textarea name="fb" rows={4} maxLength={1000}
                          style={{ width: '100%', marginBottom: 8 }} />
                <button className="btn primary">Отправить</button>
              </form>
            )}

            {/* заметки */}
            {progress > 0 && (
              <>
                <h4 style={{ marginTop: 24 }}>Заметки по дням</h4>
                <ul className="notes-list">
                  {Array.from({ length: progress }).map((_, i) => (
                    <li key={i}>
                      <button className="btn-link"
                              onClick={() => router.push(`/challenge?day=${i + 1}`)}>
                        День {i + 1}
                      </button>{' '}
                      <i>{notesMap[i + 1] || '— нет —'}</i>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </main>
    </>
  )
}

/* ----------------------- SSR ----------------------- */
export async function getServerSideProps({ req }) {
  const { tg, cid } = parse(req.headers.cookie || '')
  const user = tg ? JSON.parse(Buffer.from(tg, 'base64').toString()) : null

  if (!cid)
    return { props: { user, citizen: null, progress: 0, notesJSON: '{}' } }

  const [{ data: citizen }, { data: prgs }] = await Promise.all([
    supabase.from('citizens')
            .select('*').eq('id', cid).maybeSingle(),
    supabase.from('daily_progress')
            .select('day_no,notes').eq('citizen_id', cid)
  ])

  const rows  = Array.isArray(prgs) ? prgs : []
  const notes = {}
  rows.forEach(r => { if (r.notes) notes[r.day_no] = r.notes })

  return {
    props: {
      user,
      citizen: citizen || null,
      progress: rows.length,
      notesJSON: JSON.stringify(notes)
    }
  }
}
