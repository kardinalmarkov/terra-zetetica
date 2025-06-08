// pages/lk.js
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Script from 'next/script'

export default function LK() {
  const [resp, setResp] = useState(null)

  useEffect(() => {
    fetch('/api/me')
      .then(async r => ({ ok: r.ok, body: r.ok ? await r.json() : null }))
      .then(setResp)
  }, [])

  // 1 — ждём ответ
  if (resp === null) return <p style={{ padding: 32 }}>⏳ Загрузка…</p>

  // 2 — не авторизован → виджет
  if (!resp.ok) {
    return (
      <div style={{ padding: 32 }}>
        <p>Пожалуйста, авторизуйтесь через Telegram:</p>
        <Script
          async
          src="https://telegram.org/js/telegram-widget.js?7"
          data-telegram-login="ZeteticID_bot"
          data-size="large"
          data-userpic="true"
          data-request-access="write"
          data-auth-url="https://www.terra-zetetica.org/api/auth"
        />
      </div>
    )
  }

  // 3 — данные есть
  const { telegram: t, last_auth } = resp.body

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '1.5rem' }}>
      <Head><title>👤 Личный кабинет | Terra Zetetica</title></Head>

      <h1>👤 Личный кабинет</h1>

      <h2>Данные из Telegram</h2>
      {t.photo_url && (
        <img src={t.photo_url} width={96} height={96} alt="" style={{ borderRadius: '50%' }}/>
      )}
      <p><strong>ID:</strong> {t.id}</p>
      <p><strong>Имя:</strong> {t.first_name} {t.last_name || ''}</p>
      {t.username && <p><strong>Username:</strong> @{t.username}</p>}
      <p><strong>Язык:</strong> {t.language_code || '—'}</p>
      <p><strong>Время текущего входа:</strong> {new Date(t.auth_date*1000).toLocaleString()}</p>

      {last_auth && last_auth !== t.auth_date && (
        <p><strong>Последний вход раньше:</strong> {new Date(last_auth*1000).toLocaleString()}</p>
      )}
    </main>
  )
}
