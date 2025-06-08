// pages/lk.js – v1.1  (фикс компиляции + кнопка "/dom")
import { useEffect, useState } from 'react'
import Head from 'next/head'

export default function LK() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/me')
      .then(async (res) => ({
        ok: res.ok,
        body: res.ok ? await res.json() : null
      }))
      .then(setData)
  }, [])

  // пока не получили ответ
  if (data === null) {
    return <p style={{ padding: 32 }}>⏳ Загрузка…</p>
  }

  // если не авторизован — показываем виджет Telegram Login
  if (!data.ok) {
    return (
      <div style={{ padding: 32 }}>
        <p>Пожалуйста, авторизуйтесь через Telegram:</p>
        <div
          className="telegram-login"
          dangerouslySetInnerHTML={{
            __html: `
              <script async src="https://telegram.org/js/telegram-widget.js?7"
                      data-telegram-login="ZeteticID_bot"
                      data-size="large"
                      data-userpic="true"
                      data-auth-url="/api/auth"
                      data-request-access="write"></script>
            `
          }}
        />
      </div>
    )
  }

  // если авторизован — выводим все поля из Telegram
  const { telegram: t } = data.body

  return (
    <main className="wrapper" style={{ maxWidth: 640, margin: '0 auto', padding: '1.5rem' }}>
      <Head>
        <title>👤 Личный кабинет | Terra Zetetica</title>
      </Head>

      <h1>👤 Личный кабинет</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Данные из Telegram</h2>
        {t.photo_url && (
          <img
            src={t.photo_url}
            width={96}
            height={96}
            alt={`${t.first_name} avatar`}
            style={{ borderRadius: '50%', marginBottom: '.5rem' }}
          />
        )}
        <p><strong>ID:</strong> {t.id}</p>
        <p><strong>Имя:</strong> {t.first_name} {t.last_name || ''}</p>
        {t.username && <p><strong>Username:</strong> @{t.username}</p>}
        <p><strong>Язык интерфейса:</strong> {t.language_code || '—'}</p>
        <p><strong>Auth date:</strong> {new Date(t.auth_date * 1000).toLocaleString()}</p>
      </section>
    </main>
  )
}
