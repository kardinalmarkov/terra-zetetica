// pages/dashboard.js
import { parse }    from 'cookie'
import { supabase } from '../lib/supabase'

/**
 * По умолчанию ADMIN_CID = 1.
 * Установите переменную окружения ADMIN_CID = <ваш cid администратора>,
 * чтобы отмечать в куки действительно админа.
 */
const ADMIN_ID = Number(process.env.ADMIN_CID || '1')

export async function getServerSideProps({ req }) {
  // Читаем куки из запроса
  const { cid } = parse(req.headers.cookie || '')
  const isAdmin = Number(cid) === ADMIN_ID

  // Если это не админ, возвращаем флаг доступа false и пустые списки
  if (!isAdmin) {
    return {
      props: {
        allowed: false,
        citizens: [],  // безопасно — это всегда массив
        answers: []    // всегда массив
      }
    }
  }

  // Если админ, запрашиваем данные из Supabase
  const { data: citizensData, error: citizensError } = await supabase
    .from('citizens')
    .select('id, full_name, username, status, challenge_status, telegram_id')
    .order('id', { ascending: true })

  const { data: answersData, error: answersError } = await supabase
    .from('daily_progress')
    .select('id, citizen_id, day_no, answer, watched_at')
    .order('watched_at', { ascending: false })
    .limit(50)

  // Supabase может вернуть data: null, поэтому приводим к массиву
  const citizens = citizensData || []
  const answers  = answersData  || []

  return {
    props: {
      allowed:  true,
      citizens,
      answers
    }
  }
}

export default function Dashboard({ allowed, citizens, answers }) {
  // Если доступа нет — показываем простое сообщение
  if (!allowed) {
    return (
      <main style={{ padding: '2rem', maxWidth: 600, margin: '0 auto', fontSize: 16 }}>
        ⛔ Доступ запрещён
      </main>
    )
  }

  // Вычисляем статистику
  const totalCitizens = citizens.length
  const finishedCount = citizens.filter(c => c.challenge_status === 'finished').length
  // Считаем средний прогресс: ответов / (граждан * 14 дней) * 100
  const avgProgress = totalCitizens === 0
    ? '0.0'
    : ((answers.length / (totalCitizens * 14)) * 100).toFixed(1)

  return (
    <main style={{ maxWidth: 960, margin: '2rem auto', fontSize: 14 }}>
      <h2>Админ-дашборд</h2>
      <p>
        Всего граждан: <b>{totalCitizens}</b>,&nbsp;
        завершили 14/14: <b>{finishedCount}</b>,&nbsp;
        средний прогресс: <b>{avgProgress}%</b>
      </p>

      <h3>Граждане</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>@username</th>
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
              <td>{c.username ? '@' + c.username : '—'}</td>
              <td>{c.status}</td>
              <td>{c.challenge_status}</td>
              <td>
                {c.username
                  ? (
                    <a
                      href={`https://t.me/${c.username.replace('@','')}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ✉️
                    </a>
                  ) : '—'
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
