// pages/dashboard.js  (полная версия)
import Head from 'next/head'
import { parse } from 'cookie'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY      // service-role
const ADMIN_CID = Number(process.env.ADMIN_CID || 1)

const sb = createClient(SUPA_URL, SUPA_KEY, { auth: { persistSession: false } })

export async function getServerSideProps({ req }) {
  const { cid } = parse(req.headers.cookie || '')
  if (+cid !== ADMIN_CID) return { props: { allowed: false } }

  const [cit, ans, fb] = await Promise.all([
    sb.from('citizens').select('*').order('timestamp', { ascending: false }),
    sb.from('daily_progress').select('citizen_id,day_no,watched_at').order('watched_at', { ascending: false }).limit(50),
    sb.from('feedback').select('*').order('created_at', { ascending: false }).limit(50)
  ])

  return { props: { allowed: true, citizens: cit.data, answers: ans.data, feedback: fb.data } }
}

export default function Dashboard({ allowed, citizens = [], answers = [], feedback = [] }) {
  if (!allowed) return <main className="wrapper">⛔ Access denied</main>

  /* ─ фильтр + пагинация ─ */
  const [flt, setFlt] = useState('')
  const [page, setPage] = useState(0)
  const pageSize = 10

  const filtered = citizens.filter(c =>
    (`${c.username ?? ''}${c.telegram_id}${c.full_name ?? ''}${c.id}`)
      .toLowerCase().includes(flt)
  )
  const shown = filtered.slice(page * pageSize, (page + 1) * pageSize)

  const finished = citizens.filter(c => c.challenge_status === 'finished').length
  const avg = (answers.length / (citizens.length * 14 || 1) * 100).toFixed(1)

  return (
    <main style={{ maxWidth: 1150, margin: '2rem auto', fontSize: 14 }}>
      <Head><title>Dashboard • Terra Zetetica</title></Head>

      <h1>Админ-дашборд</h1>
      <p>Всего: <b>{citizens.length}</b> • 14/14: <b>{finished}</b> • ср. прогресс: <b>{avg}%</b></p>

      <input
        value={flt}
        onChange={e => { setFlt(e.target.value.toLowerCase()); setPage(0) }}
        placeholder="фильтр @username / id…"
        style={{ margin: '12px 0', padding: 6, width: 260 }}
      />

      {/* — граждане — */}
      <table className="tbl">
        <thead><tr>
          <th>ID</th><th>Reg</th><th>Ава</th><th>Имя</th>
          <th>@user / TG ID</th><th>Статус</th><th>Чел.</th><th>✉</th>
        </tr></thead>
        <tbody>
          {shown.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{new Date(c.timestamp).toLocaleDateString()}</td>
              <td>{
                c.photo_url
                  ? <img src={c.photo_url} width={28} height={28} style={{ borderRadius: 4 }} />
                  : '—'
              }</td>
              <td>{c.full_name || '—'}</td>
              <td>{c.username ? '@' + c.username : c.telegram_id}</td>
              <td>{c.status}</td>
              <td>{c.challenge_status}</td>
              <td>{c.telegram_id && <a href={`tg://user?id=${c.telegram_id}`}>✉️</a>}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* пагинация */}
      <div style={{ margin: '8px 0' }}>
        {Array.from({ length: Math.ceil(filtered.length / pageSize) }).map((_, i) => (
          <button key={i}
            onClick={() => setPage(i)}
            style={{ marginRight: 4, background: i === page ? '#007bff' : '#eee', color: i === page ? '#fff' : '#000' }}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* — feedback — */}
      <h2 style={{ marginTop: 36 }}>Feedback</h2>
      <table className="tbl">
        <thead><tr><th>ID</th><th>#cid</th><th>Текст</th><th>Когда</th></tr></thead>
        <tbody>
          {feedback.map(f => (
            <tr key={f.id}>
              <td>{f.id}</td><td>#{f.citizen_id}</td><td>{f.text}</td>
              <td>{new Date(f.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .tbl{width:100%;border-collapse:collapse;margin-top:8px}
        .tbl th,.tbl td{border:1px solid #ddd;padding:6px 8px}
        .tbl th{background:#fafafa}
      `}</style>
    </main>
  )
}
