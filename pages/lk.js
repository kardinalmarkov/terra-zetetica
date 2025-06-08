// pages/lk.js
import { useEffect, useState } from 'react'

export default function LK() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.ok ? res.json() : null)
      .then(setUser)
  }, [])

  if (!user) return <p>⏳ Загрузка...</p>

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Добро пожаловать, {user.first_name}!</h1>
      <p>Ваш Telegram ID: {user.telegram_id}</p>
      {user.username && <p>Username: @{user.username}</p>}
    </div>
  )
}

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

          {user.zetetic_id ? (
            <>
              <p><strong>Z-ID:</strong> {user.zetetic_id}</p>
              <p><strong>Статус:</strong> {user.status || 'не установлен'}</p>
              <p><a href={user.ipfs_url}>🌀 Перейти к паспорту</a></p>
            </>
          ) : (
            <>
              <p>⚠️ Вы ещё не зарегистрированы как гражданин Terra Zetetica.</p>
              <p>🔹 Чтобы получить Z-ID и доступ к паспорту, начните регистрацию:</p>
              <a href="/apply" className="btn">🧱 Стать гражданином</a>
            </>
          )}
        </div>
      )}
    </main>
  )
}
