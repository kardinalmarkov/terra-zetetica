// pages/dashboard.js
//
// Админ-дашборд (виден только cid === ADMIN_ID).
// ▸ SERVICE_KEY обходит RLS, поэтому можно чтение без ограничений.

import Head               from 'next/head'
import { parse }          from 'cookie'
import { createClient }   from '@supabase/supabase-js'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_KEY      // service-role key
const ADMIN_ID      = Number(process.env.ADMIN_CID || 1)    // id администратора

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession:false }
})

export async function getServerSideProps({ req }) {
  /* ─ 0. доступ только админу ─────────────────────────────────────────── */
  const { cid } = parse(req.headers.cookie||'')
  if (Number(cid) !== ADMIN_ID) return { props:{ allowed:false } }

  /* ─ 1. грузим данные параллельно ─────────────────────────────────────── */
  const [
    { data: citizens = [], error: cErr },
    { data: answers  = [], error: aErr },
    { data: feedback = [], error: fErr }
  ] = await Promise.all([
    sb.from('citizens')
      .select('*')
      .order('id'),

    sb.from('daily_progress')
      .select('*')
      .order('watched_at', { ascending:false })
      .limit(50),

    sb.from('feedback')
      .select('*')
      .order('created_at', { ascending:false })
      .limit(50)
  ])

  if (cErr||aErr||fErr) console.error('SB error:', cErr||aErr||fErr)

  return { props:{ allowed:true, citizens, answers, feedback } }
}

/* ──────────────────────────────────────────────────────────────────────── */
export default function Dashboard({ allowed, citizens=[], answers=[], feedback=[] }) {
  if (!allowed) return <main style={{padding:'2rem'}}>⛔ Доступ запрещён</main>

  const total    = citizens.length
  const finished = citizens.filter(c=>c.challenge_status==='finished').length
  const avgProg  = total ? ((answers.length/(total*14))*100).toFixed(1) : 0

  return (
    <main style={{maxWidth:1100,margin:'2rem auto',fontSize:14}}>
      <Head><title>Админ-дашборд • Terra Zetetica</title></Head>

      <h1>Админ-дашборд</h1>
      <p>
        Всего граждан: <b>{total}</b>,&nbsp;
        14/14: <b>{finished}</b>,&nbsp;
        средний прогресс: <b>{avgProg}%</b>
      </p>

      {/* ─ граждане ─ */}
      <h2>Граждане</h2>
      <table className="tbl">
        <thead>
          <tr>
            <th>ID</th><th>Аватар</th><th>Имя</th>
            <th>@username / TG ID</th><th>Статус</th><th>Челлендж</th><th>✉</th>
          </tr>
        </thead>
        <tbody>
          {citizens.map(c=>(
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{
                c.photo_url
                  ? <img src={c.photo_url} width={32} height={32} style={{borderRadius:4}}/>
                  : '—'
              }</td>
              <td>{c.full_name||'—'}</td>
              <td>{
                c.username ? '@'+c.username : c.telegram_id
              }</td>
              <td>{c.status}</td>
              <td>{c.challenge_status}</td>
              <td>{
                c.telegram_id
                  ? <a href={`tg://user?id=${c.telegram_id}`} title="Открыть чат">✉️</a>
                  : '—'
              }</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ─ ответы ─ */}
      <h2 style={{marginTop:40}}>Последние ответы</h2>
      <table className="tbl">
        <thead><tr><th>#cid</th><th>день</th><th>когда</th></tr></thead>
        <tbody>
          {answers.map(a=>(
            <tr key={a.id}>
              <td>#{a.citizen_id}</td>
              <td>{a.day_no}</td>
              <td>{new Date(a.watched_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ─ feedback ─ */}
      <h2 style={{marginTop:40}}>Feedback</h2>
      <table className="tbl">
        <thead><tr><th>ID</th><th>#cid</th><th>Текст</th><th>Когда</th></tr></thead>
        <tbody>
          {feedback.map(f=>(
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>#{f.citizen_id}</td>
              <td>{f.text}</td>
              <td>{new Date(f.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .tbl{width:100%;border-collapse:collapse}
        .tbl th,.tbl td{padding:6px 8px;border:1px solid #ddd}
        .tbl th{background:#f8f8f8;text-align:left}
      `}</style>
      
      <input id="flt" placeholder="фильтр…" style="margin:14px 0;padding:4px">
      <script>
      document.getElementById('flt').oninput=e=>{
        const v=e.target.value.toLowerCase()
        document.querySelectorAll('tbody tr').forEach(tr=>{
          tr.style.display = tr.innerText.toLowerCase().includes(v) ? '' : 'none'
        })
      }
      </script>


    </main>
  )
}
