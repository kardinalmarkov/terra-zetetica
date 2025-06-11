// pages/dashboard.js
import Head          from 'next/head'
import { parse }     from 'cookie'
import { useState }  from 'react'
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.SUPABASE_SERVICE_KEY   // service-role
const ADMIN  = Number(process.env.ADMIN_CID || 1)

const sb = createClient(SB_URL, SB_KEY, { auth:{ persistSession:false } })

export async function getServerSideProps({ req }) {
  const { cid } = parse(req.headers.cookie||'')
  if (+cid !== ADMIN) return { props:{ allowed:false } }

  const [citRes, ansRes, fbRes] = await Promise.all([
    sb.from('citizens').select('*').order('timestamp', { ascending:false }),
    sb.from('daily_progress').select('*').order('watched_at', { ascending:false }).limit(50),
    sb.from('feedback').select('*').order('created_at', { ascending:false }).limit(50)
  ])

  return {
    props:{
      allowed : true,
      citizens: citRes.data ?? [],
      answers : ansRes.data ?? [],
      feedback: fbRes.data ?? []
    }
  }
}

export default function Dashboard({ allowed, citizens, answers, feedback }) {
  if (!allowed) return <main style={{padding:'2rem'}}>⛔ Доступ запрещён</main>

  /* state для фильтра */
  const [flt, setFlt] = useState('')

  const shown = citizens.filter(c =>
    (c.username||'').toLowerCase().includes(flt) ||
    String(c.telegram_id).includes(flt)           ||
    (c.full_name||'').toLowerCase().includes(flt)
  )

  const total    = citizens.length
  const finished = citizens.filter(c=>c.challenge_status==='finished').length
  const avg      = ((answers.length / (total*14||1))*100).toFixed(1)

  return (
    <main style={{maxWidth:1150,margin:'2rem auto',fontSize:14}}>
      <Head><title>Админ‐дашборд • Terra Zetetica</title></Head>

      <h1>Админ-дашборд</h1>
      <p>Всего: <b>{total}</b> • 14/14: <b>{finished}</b> • ср. прогресс: <b>{avg}%</b></p>

      {/* ─ поиск ─ */}
      <input
        value={flt}
        onChange={e=>setFlt(e.target.value.toLowerCase())}
        placeholder="фильтр @username / id …"
        style={{margin:'12px 0',padding:'6px 8px',width:260}}
      />

      {/* ─ граждане ─ */}
      <table className="tbl">
        <thead>
          <tr>
            <th>ID</th><th>Reg</th><th>Ава</th><th>Имя</th>
            <th>@user / TG ID</th><th>Статус</th><th>Чел.</th><th>✉</th>
          </tr>
        </thead>
        <tbody>
          {shown.map(c=>(
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{new Date(c.timestamp).toLocaleDateString()}</td>
              <td>{
                c.photo_url
                  ? <img src={c.photo_url} width={32} height={32} style={{borderRadius:4}}/>
                  : '—'
              }</td>
              <td>{c.full_name||'—'}</td>
              <td>{c.username ? '@'+c.username : c.telegram_id}</td>
              <td>{c.status}</td>
              <td>{c.challenge_status}</td>
              <td>{
                c.telegram_id && <a href={`tg://user?id=${c.telegram_id}`}>✉️</a>
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


      {/* ─ feedback и ответы я не менял ─ */}

      <style jsx>{`
        .tbl{width:100%;border-collapse:collapse}
        .tbl th,.tbl td{padding:6px 8px;border:1px solid #ddd}
        .tbl th{background:#fafafa;text-align:left}
      `}</style>
    </main>
  )
}
