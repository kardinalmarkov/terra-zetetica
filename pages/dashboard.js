// pages/dashboard.js
import { parse } from 'cookie'
import { supabase } from '../lib/supabase'

const ADMIN_ID = 1         // citizens.id админа

/* ───────── SSR ───────── */
export async function getServerSideProps ({ req }) {
  const { cid } = parse(req.headers.cookie||'')
  const allowed = Number(cid) === ADMIN_ID

  if (!allowed) return { props:{ allowed:false } }

  const { data:citizens } = await supabase.from('citizens').select('*').order('id')
  const { data:answers  } = await supabase.from('last_answers').select('*')

  return { props:{ allowed:true, citizens, answers } }
}


/* ───────── страница ───────── */
export default function Dashboard ({ allowed, citizens=[], answers=[] }) {
  if (!allowed) return <p style={{padding:'2rem'}}>⛔ Access denied</p>

  const total = citizens.length
  const done14 = citizens.filter(c=>c.challenge_status==='finished').length

  return (
    <main style={{maxWidth:960,margin:'2rem auto',fontSize:14}}>
      <h2>Админ-дашборд</h2>
    <p>Всего граждан: <b>{total}</b>, завершили 14/14: <b>{done14}</b></p>


// фрагмент таблицы citizens в pages/dashboard.js
<tbody>
 {citizens.map(c => (
   <tr key={c.id}>
     <td>{c.id}</td>
     <td>{c.username || '—'}</td>
     <td>{c.status}</td>
     <td>{c.challenge_status}</td>
     <td>
       {c.username &&
         <a href={`https://t.me/${c.username.replace('@','')}`}
            target="_blank" rel="noopener noreferrer">✉️</a>}
     </td>
   </tr>
 ))}
</tbody>


      <h3>Граждане</h3>
      <table border={1} cellPadding={4}><tbody>
        {citizens.map(c=>(
          <tr key={c.id}>
            <td>{c.id}</td><td>{c.full_name}</td>
            <td>{c.username && '@'+c.username}</td>
            <td>{c.status}</td><td>{c.challenge_status}</td>
          </tr>
        ))}
      </tbody></table>

      <h3 style={{marginTop:32}}>Последние ответы</h3>
      <table border={1} cellPadding={4}><tbody>
        {answers.map(a=>(
          <tr key={a.id}>
            <td>citizen #{a.citizen_id}</td>
            <td>день {a.day_no}</td>
            <td>{a.answer}</td>
            <td>{new Date(a.watched_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody></table>
    </main>
  )
}
