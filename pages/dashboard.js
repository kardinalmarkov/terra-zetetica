// pages/dashboard.js
import { parse } from 'cookie'
import { createClient } from '@supabase/supabase-js'
import Head from 'next/head'

// — читаем из env
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
const ADMIN_ID     = Number(process.env.ADMIN_CID || '1')

// инициализируем “админский” клиент, который обходит RLS
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false }
})

export async function getServerSideProps({ req }) {
  // проверяем куку cid
  const { cid } = parse(req.headers.cookie || '')
  if (Number(cid) !== ADMIN_ID) {
    return { props: { allowed: false, citizens: [], answers: [] } }
  }

  // параллельно запрашиваем всех граждан и последние ответы
  const [
    { data: citizensData },
    { data: answersData }
  ] = await Promise.all([
    supabaseAdmin
      .from('citizens')
      // выбираем только нужные поля
      .select(`
        id,
        telegram_id,
        full_name,
        status,
        challenge_status
      `)
      .order('id', { ascending: true }),

    supabaseAdmin
      .from('daily_progress')
      .select(`
        id,
        citizen_id,
        day_no,
        answer,
        watched_at
      `)
      .order('watched_at', { ascending: false })
      .limit(50)
  ])

  return {
    props: {
      allowed:  true,
      // если по какой-то причине вернулось null — заменяем на пустой массив
      citizens: citizensData  ?? [],
      answers:  answersData   ?? []
    }
  }
}

export default function Dashboard({ allowed, citizens, answers }) {
  // если не админ — показываем отказ
  if (!allowed) {
    return (
      <main style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
        ⛔ Доступ запрещён
      </main>
    )
  }

  // рассчитываем метрики
  const total    = citizens.length
  const finished = citizens.filter(c => c.challenge_status === 'finished').length
  const avg      = total === 0
    ? '0.0'
    : ((answers.length / (total * 14)) * 100).toFixed(1)

  return (
    <main style={{ maxWidth: 960, margin: '2rem auto', fontSize: 14 }}>
      <Head>
        <title>Админ-дашборд | Terra Zetetica</title>
      </Head>

      <h2>Админ-дашборд</h2>
      <p>
        Всего граждан: <b>{total}</b>,&nbsp;
        завершили 14/14: <b>{finished}</b>,&nbsp;
        средний прогресс: <b>{avg}%</b>
      </p>

      <h3>Граждане</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Telegram ID</th>
            <th>Статус</th>
            <th>Челлендж</th>
            <th>✉️ Написать</th>
          </tr>
        </thead>
        <tbody>
          {citizens.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.full_name || '—'}</td>
              <td>{c.telegram_id}</td>
              <td>{c.status}</td>
              <td>{c.challenge_status}</td>
              <td>
                {c.telegram_id
                  // глубокая ссылка на Telegram: сначала по username (если есть), иначе по ID
                  ? (
                    <a
                      href={`tg://resolve?domain=${c.telegram_id}`}
                      title="Открыть в Telegram"
                    >
                      ✉️
                    </a>
                  )
                  : '—'
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Последние ответы</h3>
      <table className="table">
        <thead>
          <tr>
            <th>#citizen</th>
            <th>день</th>
            <th>ответ</th>
            <th>когда</th>
          </tr>
        </thead>
        <tbody>
          {answers.map(a => (
            <tr key={a.id}>
              <td>#{a.citizen_id}</td>
              <td>{a.day_no}</td>
              <td>{a.answer}</td>
              <td>{new Date(a.watched_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
