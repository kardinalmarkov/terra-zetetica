// pages/dashboard.js
//
// Админ-дашборд (видит только cid == ADMIN_CID)
// ▸ читает ВСЕ строки citizens / daily_progress через service-role-key
// ▸ RLS можете оставлять включённым – service key её обходит

import { parse }          from 'cookie'
import Head               from 'next/head'
import { createClient }   from '@supabase/supabase-js'

// ⬇️ НЕ забудьте задать эти переменные в Vercel → Settings → Environment
const SUPABASE_URL   = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY    = process.env.SUPABASE_SERVICE_ROLE_KEY      // полно-правный ключ
const ADMIN_ID       = Number(process.env.ADMIN_CID || 1)         // id администратора

// админ-клиент (persistSession:false — токен в куки не кладётся)
const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth:{ persistSession:false } })

export async function getServerSideProps({ req })
{
  // ─── доступ только админу ──────────────────────────────────────────────
  const { cid } = parse(req.headers.cookie || '')
  if (Number(cid) !== ADMIN_ID) {
    return { props:{ allowed:false } }
  }

  // ─── читаем ВСЁ без фильтров (SERVICE_KEY обходит RLS) ─────────────────
  const [{ data: citizens = [], error: cErr },
         { data: answers  = [], error: aErr }] = await Promise.all([
           sb.from('citizens')
             .select('*')
             .order('id', { ascending:true }),

           sb.from('daily_progress')
             .select('*')
             .order('watched_at', { ascending:false })
             .limit(50)
         ])

  if (cErr || aErr) console.error('SB error:', cErr || aErr)

  return { props:{
    allowed  : true,
    citizens ,
    answers  ,
  }}
}

// ──────────────────────────────────────────────────────────────────────────
export default function Dashboard({ allowed, citizens = [], answers = [] })
{
  if (!allowed) {
    return <main style={{padding:'2rem',maxWidth:600,margin:'0 auto'}}>⛔ Доступ запрещён</main>
  }

  // метрики
  const total     = citizens.length
  const finished  = citizens.filter(c => c.challenge_status === 'finished').length
  const avgProg   = total === 0 ? 0 : (answers.length / (total*14) * 100).toFixed(1)

  return (
    <main style={{maxWidth:1040,margin:'2rem auto',fontSize:14}}>
      <Head><title>Админ-дашборд | Terra Zetetica</title></Head>

      <h1>Админ-дашборд</h1>
      <p>
        Всего граждан:&nbsp;<b>{total}</b>,&nbsp;
        завершили 14/14:&nbsp;<b>{finished}</b>,&nbsp;
        средний прогресс:&nbsp;<b>{avgProg}%</b>
      </p>

      {/* ───── таблица граждан ───── */}
      <h2>Граждане</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th><th>Имя</th><th>@username / TG ID</th>
            <th>Статус</th><th>Челлендж</th><th>✉️ Написать</th>
          </tr>
        </thead>
        <tbody>
          {citizens.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.full_name || '—'}</td>
              <td>{c.telegram_id || '—'}</td>
              <td>{c.status}</td>
              <td>{c.challenge_status}</td>
              <td>
                {c.telegram_id
                  ? <a
                      href={`tg://user?id=${c.telegram_id}`}
                      title="Открыть чат в Telegram">✉️</a>
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ───── последние ответы ───── */}
      <h2 style={{marginTop:40}}>Последние ответы</h2>
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

      <style jsx>{`
        .table { width:100%; border-collapse:collapse }
        .table th, .table td { padding:6px 8px; border:1px solid #ddd }
        .table th { background:#f6f6f6; text-align:left }
      `}</style>
    </main>
  )
}
