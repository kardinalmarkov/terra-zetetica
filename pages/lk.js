// pages/lk.js
import { useEffect, useState } from 'react'
import Head from 'next/head'

export default function LK() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null))
  }, [])

  return (
    <main className="wrapper">
      <Head>
        <title>👤 Личный кабинет | Terra Zetetica</title>
      </Head>
      <h1>👤 Личный кабинет</h1>

      {!user && (
        <div>
          <p>Пожалуйста, авторизуйтесь через Telegram:</p>
          <div
            className="telegram-login"
            dangerouslySetInnerHTML={{
              __html: `
                <script async src="https://telegram.org/js/telegram-widget.js?7"
                  data-telegram-login="ZeteticID_bot"
                  data-size="large"
                  data-userpic="true"
                  data-request-access="write"
                  data-auth-url="/api/auth"
                  data-lang="ru"></script>
              `,
            }}
          ></div>
        </div>
      )}

      {user && (
        <div>
          <p><strong>Имя:</strong> {user.full_name}</p>
          <p><strong>Z-ID:</strong> {user.zetetic_id}</p>
          <p><strong>Статус:</strong> {user.status || 'не установлен'}</p>
          <p><a href={user.ipfs_url}>🌀 Перейти к паспорту</a></p>
        </div>
      )}
    </main>
  )
}