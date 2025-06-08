// pages/lk.js
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { parse } from 'cookie'
import { supabase } from '../lib/supabase'

export default function Lk({ user }) {
  const router = useRouter()
  const [citizen, setCitizen] = useState(null)

  useEffect(() => {
    if (!user) return router.replace('/')
    supabase
      .from('citizens')
      .select('*')
      .eq('telegram_id', user.id)
      .single()
      .then(({ data }) => setCitizen(data))
  }, [user])

  const logout = async () => {
    await fetch('/api/logout')
    router.replace('/')
  }

  if (!user || !citizen) {
    return <main className="wrapper"><p>Загрузка...</p></main>
  }

  return (
    <>
      <Head><title>Личный кабинет | TZ</title></Head>
      <main className="wrapper">
        <button onClick={logout}>Выйти</button>
        <h1>👤 Личный кабинет</h1>
        <p>Здравствуйте, {user.first_name} {user.last_name}! 🇷🇺 Рады вас видеть.</p>

        <section><h2>🙏 Профиль</h2>
          <img src={user.photo_url} width="120" style={{borderRadius:8}} />
          <p>ID: {user.id}</p>
          <p>Телеграм имя: @{user.username || '—'}</p>
          <p>Вашу запись {citizen ? 'найдено в БД ✔️' : 'не найдено ❗'}</p>
          <p>
            Статус: {citizen.challenge_status === 'valid'
              ? '✅ Гражданин Terra Zetetica'
              : '❓ Не гражданин'}
          </p>
        </section>

        <section><h2>📜 Паспорт / 🏠 Челлендж</h2>
          <p>Z-ID: {citizen.zetetic_id || '—'}</p>
          <p>IPFS: {citizen.ipfs_url
            ? <a href={citizen.ipfs_url} target="_blank">ссылка</a>
            : '—'}</p>
          <p>Статус челленджа: {citizen.challenge_status}</p>
        </section>

        <section><h2>📈 Мой прогресс</h2>
          <p>Здесь будет отображаться ваш прогресс</p>
        </section>
      </main>
    </>
  )
}

export async function getServerSideProps({ req }) {
  const cookies = parse(req.headers.cookie || '')
  const tg = cookies.tg ? JSON.parse(Buffer.from(cookies.tg,'base64').toString()) : null
  return { props: { user: tg } }
}
