// pages/dashboard.js
import { parse }    from 'cookie'
import { supabase } from '../lib/supabase'

const ADMIN_ID = Number(process.env.ADMIN_CID || '1')

export async function getServerSideProps({ req }) {
  const { cid } = parse(req.headers.cookie||'')
  if (Number(cid) !== ADMIN_ID) {
    // отключаем RLS-проверки, но возвращаем пустые списки
    return { props:{ allowed:false, citizens:[], answers:[] } }
  }

  const { data: citizens = [] } = await supabase
    .from('citizens')
    .select('id, full_name, username, status, challenge_status, telegram_id')
    .order('id', { ascending:true })

  const { data: answers = [] } = await supabase
    .from('daily_progress')
    .select('id, citizen_id, day_no, answer, watched_at')
    .order('watched_at', { ascending:false })
    .limit(50)

  return { props:{ allowed:true, citizens, answers } }
}

export default function Dashboard({ allowed, citizens, answers }) {
  if (!allowed) {
    return <main style={{padding:'2rem'}}>⛔ Доступ запрещён</main>
  }

  const total  = citizens.length
  const done14 = citizens.filter(c => c.challenge_status === 'finished').length
  const avg    = total ? ((answers.length/(total*14))*100).toFixed(1) : '0.0'

  return (
    <main style={{ maxWidth:960, margin:'2rem auto', fontSize:14 }}>
      <h2>Админ-дашборд</h2>
      <p>
        Всего граждан: <b>{total}</b>, завершили 14/14: <b>{done14}</b>, средний прогресс: <b>{avg}%</b>
      </p>

      <h3>Граждане</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th><th>Имя</th><th>@username</th><th>Статус</th><th>Челлендж</th><th>✉️</th>
          </tr>
        </thead>
        <tbody>
          {citizens.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.full_name||'—'}</td>
              <td>{c.username ? '@'+c.username : '—'}</td>
              <td>{c.status}</td>
              <td>{c.challenge_status}</td>
              <td>
                {c.username
                  ? <a href={`https://t.me/${c.username.replace('@','')}`} target="_blank" rel="noreferrer">✉️</a>
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
          <tr><th>#citizen</th><th>день</th><th>ответ</th><th>когда</th></tr>
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
