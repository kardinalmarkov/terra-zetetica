// pages/dashboard.js
import { supabase } from '../lib/supabase';
import { parse }    from 'cookie';

const ADMINS = [1199933222];    // ← ваши telegram-id
const ADMIN_ID = 1          // ваш citizens.id



export async function getServerSideProps({ req }) {
  const { cid } = parse(req.headers.cookie||'')
  if (Number(cid)!==ADMIN_ID) return { props:{ denied:true } }

  const { data:last } = await supabase.from('last_answers').select('*')
  return { props:{ last } }
}

export default function Dash({ denied, last=[] }) {
  if (denied) return <p style={{padding:'2rem'}}>⛔ Access denied</p>
  return (
    <table style={{width:'100%',padding:'1rem'}}>
      <thead><tr><th>ID</th><th>Day</th><th>Answer</th><th>When</th></tr></thead>
      <tbody>
        {last.map(r=>(
          <tr key={r.id}>
            <td>{r.citizen_id}</td><td>{r.day_no}</td>
            <td>{r.answer}</td><td>{new Date(r.watched_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}


export default function Dashboard({ allowed, citizens=[], answers=[] }){
  if (!allowed) return <p style={{padding:'2rem'}}>⛔ Access denied</p>;

  return (
    <main style={{maxWidth:960,margin:'2rem auto',fontSize:14}}>
      <h2>Админ-дашборд</h2>

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
          <tr key={`${a.citizen_id}-${a.day_no}`}>
            <td>#{a.citizen_id}</td><td>день {a.day_no}</td>
            <td>{a.answer}</td><td>{new Date(a.watched_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody></table>
    </main>
  );
}