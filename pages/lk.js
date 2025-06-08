// pages/lk.js – v1.1  (фикс компиляции + кнопка "/dom")
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function LK() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setUser(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main className="wrapper" style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <Head>
        <title>👤 Личный кабинет | Terra Zetetica</title>
      </Head>

      <h1>👤 Личный кабинет</h1>

      {/*  кнопка /dom */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/dom" className="btn" legacyBehavior>
          <a className="btn">🏠 /dom — Челлендж</a>
        </Link>
      </div>

      {/*  Состояние загрузки  */}
      {loading && <p>⏳ Загрузка…</p>}

      {/*  Без cookie / неавторизован  */}
      {!loading && !user && (
        <>
          <p>Пожалуйста, авторизуйтесь через Telegram:</p>
          <div
            dangerouslySetInnerHTML={{
              __html: `
              <script async src="https://telegram.org/js/telegram-widget.js?7"
                      data-telegram-login="ZeteticID_bot"
                      data-size="large"
                      data-userpic="true"
                      data-request-access="write"
                      data-auth-url="/api/auth"
                      data-lang="ru"></script>`
            }}
          />
        </>
      )}

      {/*  Авторизованный пользователь  */}
      {user && (
        <div>
          <p>
            <strong>Имя:</strong> {user.first_name || user.full_name || '—'}
          </p>
          <p>
            <strong>Telegram ID:</strong> {user.telegram_id}
          </p>
          {user.username && (
            <p>
              <strong>Username:</strong> @{user.username}
            </p>
          )}
        </div>
      )}
    </main>
  )
}
