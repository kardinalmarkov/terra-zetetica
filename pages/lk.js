// pages/lk.js
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Router from 'next/router'

export default function LK() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
  }, [])

  if (!data) {
    return <div>⏳ Загрузка...</div>
  }

  const { telegram, citizen, last_auth } = data
  const isCitizen = Boolean(citizen?.zetetic_id)

  const logout = () => {
    document.cookie = 'telegram_id=; path=/; max-age=0'
    Router.push('/')
  }

  return (
    <>
      <Head>
        <title>Личный кабинет | Terra Zetetica</title>
      </Head>

      <main className="wrapper">
        {/* Приветствие */}
        <h1>🙍‍♂️ Личный кабинет</h1>
        <p>Здравствуйте, {telegram.first_name} {telegram.last_name} 🇷🇺! Рады вас видеть.</p>
        <button onClick={logout}>Выйти</button>

        {/* Карточка Профиля */}
        <section className="card">
          <h2>🙏 Профиль</h2>
          <img src={telegram.photo_url} width={100} height={100} alt="Фото"/>
          <p><strong>ID:</strong> {telegram.id}</p>
          <p><strong>Имя:</strong> {telegram.first_name} {telegram.last_name}</p>
          <p><strong>Username:</strong> @{telegram.username}</p>
          <p><strong>Язык:</strong> {telegram.auth_date ? citizen?.lang || '—' : '—'}</p>
          <p>
            <strong>Статус:</strong>{' '}
            {isCitizen
              ? '✅ Гражданин Terra Zetetica'
              : '⚠️ Вы ещё не гражданин'}
          </p>
        </section>

        {/* Карточка Паспорт / Челлендж */}
        <section className="card">
          <h2>📜 Паспорт / 🏠 Челлендж</h2>
          {isCitizen ? (
            <>
              <p><strong>Z-ID:</strong> {citizen.zetetic_id}</p>
              <p><strong>IPFS:</strong> <a href={citizen.ipfs_url}>ссылка</a></p>
              <p><strong>Статус челленджа:</strong> {citizen.status || '—'}</p>
            </>
          ) : (
            <p>
              Чтобы получить Z-ID и доступ к паспорту, начните регистрацию:{' '}
              <a href="/apply">🧱 Стать гражданином</a>
            </p>
          )}
        </section>

        {/* Карточка Прогресса (пока пустая) */}
        {/* <section className="card">
          <h2>📈 Мой прогресс</h2>
          <p>Скоро появится трекер ежедневных заданий…</p>
        </section> */}
      </main>
    </>
  )
}
