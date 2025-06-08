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

  if (resp === null) return <p style={{ padding: 32 }}>⏳ Загрузка…</p>

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

  const { telegram: t, last_auth } = resp.body

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '1.5rem' }}>
      <Head><title>👤 Личный кабинет | Terra Zetetica</title></Head>

      <h1>👤 Личный кабинет</h1>

      {t.photo_url && (
        <img src={t.photo_url} alt="" width="96" height="96" style={{ borderRadius: '50%' }}/>
      )}
      <p><b>ID:</b> {t.id}</p>
      <p><b>Имя:</b> {t.first_name} {t.last_name || ''}</p>
      {t.username && <p><b>Username:</b> @{t.username}</p>}
      <p><b>Язык:</b> {t.language_code || '—'}</p>
      <p><b>Текущий вход:</b> {new Date(t.auth_date*1000).toLocaleString()}</p>
      {last_auth && last_auth !== t.auth_date && (
        <p><b>Последний вход:</b> {new Date(last_auth*1000).toLocaleString()}</p>
      )}
    </main>
  )
}
