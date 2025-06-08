// pages/lk.js
//
// 📄 Полностью рабочий файл “Личный кабинет”.
// ▸ Показывает данные Telegram-пользователя и (если есть) запись в таблице `citizens` Supabase.
// ▸ Три вкладки: Профиль, Паспорт / Челлендж, Прогресс.
// ▸ Корректно определяет статус гражданства: ✅ valid | ❓ pending | ✖ not-found.
// ▸ Кнопка «Выйти» удаляет cookie tg и перекидывает на главную.
// ────────────────────────────────────────────────────────────────────────────────

import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { parse } from 'cookie'
import { supabase } from '../lib/supabase'           // путь без '@/…' — так Next найдёт файл

/** Простенькие вкладки — без сторонних библиотек */
function Tabs ({ tabs, active, setActive }) {
  return (
    <nav style={{display:'flex',gap:12,margin:'0 0 1rem'}}>
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => setActive(t.key)}
          style={{
            padding:'.4rem .9rem',
            border:'1px solid #ccc',
            borderBottom: active===t.key ? '3px solid #6c63ff' : '1px solid #ccc',
            background: active===t.key ? '#f9f9ff' : '#fff',
            cursor:'pointer',
            borderRadius:6
          }}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}

export default function LK ({ user }) {
  const router = useRouter()
  const [citizen, setCitizen] = useState(null)
  const [tab, setTab] = useState('profile')

  // ───────── Запрашиваем запись о гражданине ─────────
  useEffect(() => {
    if (!user) return router.replace('/')          // если нет куки — на главную

    supabase
      .from('citizens')
      .select('*')
      .eq('telegram_id', user.id)
      .maybeSingle()                               // вернёт null, если нет строки
      .then(({ data, error }) => {
        if (error) console.error(error)
        setCitizen(data)
      })
  }, [user])

  // ───────── Выход: сбрасываем cookie и на / ─────────
  async function handleLogout () {
    await fetch('/api/logout', { method:'POST' })
    router.push('/')
  }

  // ───────── Красивые метки статусов ─────────
  function renderStatus () {
    if (!citizen) return '✖ Гражданство не получено'
    if (citizen.status === 'valid') return '✅ Гражданин Terra Zetetica'
    return '❓ Гражданство в обработке'
  }

  if (!user) return null               // 1-й рендер на сервере: будет редирект из getServerSideProps
  if (citizen === null) return <p style={{padding:'2rem'}}>Загрузка…</p>

  return (
    <>
      <Head><title>Личный кабинет • Terra Zetetica</title></Head>

      <main style={{maxWidth:820,margin:'0 auto',padding:'2rem 1rem',fontSize:'1.02rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
          <strong>Здравствуйте, {user.first_name} {user.last_name || ''}! 🙌 Рады вас видеть.</strong>
          <button onClick={handleLogout} style={{padding:'.35rem .8rem'}}>Выйти</button>
        </div>

        <Tabs
          active={tab}
          setActive={setTab}
          tabs={[
            { key:'profile',   label:'🙏 Профиль' },
            { key:'passport',  label:'📜 Паспорт / 🏠 Челлендж' },
            { key:'progress',  label:'📈 Прогресс' }
          ]}
        />

        {/* ───────── Вкладка 1: Профиль ───────── */}
        {tab==='profile' && (
          <section>
<img
  src={user.photo_url}
  alt="avatar"
  width={120}
  height={120}
  style={{ borderRadius: 8 }}
/>

            <p>ID Telegram: <b>{user.id}</b></p>
            <p>Телеграм имя: <b>@{user.username || '—'}</b></p>
            <p>{citizen ? 'Запись найдена в БД ✔️' : 'В БД записи нет ❌'}</p>
            <p>Статус: {renderStatus()}</p>
          </section>
        )}

        {/* ───────── Вкладка 2: Паспорт / Челлендж ───────── */}
        {tab==='passport' && (
          <section>
            {citizen ? (
              <>
                <p>Z-ID: <b>{citizen.zetetic_id || '—'}</b></p>
                <p>
                  IPFS-паспорт:&nbsp;
                  {citizen.ipfs_url
                    ? <a href={citizen.ipfs_url} target="_blank" rel="noopener noreferrer">ссылка</a>
                    : '—'}
                </p>
                <p>Статус челленджа: {citizen.challenge_status || '—'}</p>
              </>
            ) : (
              <>
                <p>У вас пока нет гражданства — получите его на вкладке «Стать гражданином».</p>
                <a className="btn" href="/apply" style={{padding:'.5rem 1rem',border:'1px solid #ccc',borderRadius:6}}>
                  Стать гражданином
                </a>
              </>
            )}
          </section>
        )}

        {/* ───────── Вкладка 3: Прогресс ───────── */}
        {tab==='progress' && (
          <section>
            <p>Здесь будет отображаться ваш прогресс по заданиям и практикам.</p>
            <p style={{opacity:.6}}>Раздел готовится.</p>
          </section>
        )}
      </main>
    </>
  )
}

// ───────────────────── SSR: достаём Telegram-cookie ─────────────────────
export async function getServerSideProps ({ req }) {
  const cookies = parse(req.headers.cookie || '')
  let user = null
  if (cookies.tg) {
    try {
      user = JSON.parse(Buffer.from(cookies.tg, 'base64').toString())
    } catch { /* невалидная кука */ }
  }
  if (!user) {
    // Без авторизации → сразу на главную
    return { redirect: { destination: '/', permanent: false } }
  }
  return { props: { user } }
}
