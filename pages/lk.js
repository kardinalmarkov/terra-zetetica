// pages/lk.js – v1.1  (фикс компиляции + кнопка "/dom")
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function LK () {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/me').then(r => r.ok && r.json()).then(setData)
  }, [])

  if (!data) return <p style={{ padding: 32 }}>⏳ Загрузка…</p>

  const { telegram: t, citizen: c } = data

  return (
    <main className='wrapper'>
      <Head><title>👤 Личный кабинет | Terra Zetetica</title></Head>
      <h1>👤 Личный кабинет</h1>

      <section>
        <h2>Данные из Telegram</h2>
        {t.photo_url && <img src={t.photo_url} width={96} height={96} alt='' />}
        <p><strong>ID:</strong> {t.id}</p>
        <p><strong>Имя:</strong> {t.first_name} {t.last_name || ''}</p>
        {t.username && <p><strong>Username:</strong> @{t.username}</p>}
        <p><strong>Auth date:</strong> {new Date(t.auth_date * 1000).toLocaleString()}</p>
      </section>

      {c ? (
        <section>
          <h2>Статус гражданина</h2>
          <p><strong>Полное имя:</strong> {c.full_name}</p>
          <p><strong>Z-ID:</strong> {c.zetetic_id}</p>
          <p><strong>Статус:</strong> {c.status}</p>
          <p><a href={c.ipfs_url}>🌀 Паспорт (IPFS)</a></p>
        </section>
      ) : (
        <section>
          <h2>🕊 Вы ещё не гражданин</h2>
          <p>Чтобы получить Z-ID, начните <Link href='/apply'>регистрацию</Link>.</p>
        </section>
      )}

      {/* Кнопка /dom, как просили */}
      <hr />
      <Link href='/dom' className='btn'>🏛 /DOM</Link>

      <style jsx>{`
        .wrapper { max-width: 640px; margin: 0 auto; padding: 1.5rem; }
        img { border-radius: 50%; margin-bottom: .5rem; }
        section { margin-bottom: 2rem; }
        .btn { display: inline-block; margin-top: 1rem; padding: .5rem 1rem;
               background:#6c63ff;color:#fff;border-radius:6px;text-decoration:none }
      `}</style>
    </main>
  )
}

