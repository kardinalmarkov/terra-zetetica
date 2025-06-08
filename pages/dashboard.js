// pages/dashboard.js
import { supabase } from '../lib/supabase';
import { parse } from 'cookie';

const ADMINS = [1199933222, 555666777]; // ← ваши ID

export async function getServerSideProps ({ req }) {
  const { tg } = parse(req.headers.cookie || '');
  let authId = null;
  if (tg) {
    try { authId = JSON.parse(Buffer.from(tg,'base64').toString()).id; } catch {}
  }

  if (authId !== ADMIN_ID) {
    return { props:{ allowed:false } };
  }

  const citizens = await supabase.from('citizens').select('id, full_name, username, status, challenge_status');
  const answers  = await supabase.rpc('last_answers');           // ← см. below

  return { props:{
    allowed : true,
    citizens: citizens.data || [],
    answers : answers.data  || []
  }};
}

export default function Dashboard ({ allowed, citizens, answers }) {
  if (!allowed) return <main style={{padding:'2rem'}}>⛔ Access denied</main>;

  return (
    <main style={{padding:'2rem'}}>
      <h1>Dashboard</h1>

      <h2>Citizens ({citizens.length})</h2>
      <table border={1} cellPadding={6}>
        <thead><tr>
          <th>ID</th><th>Name</th><th>User</th><th>Status</th><th>Challenge</th>
        </tr></thead>
        <tbody>
          {citizens.map(c=>(
            <tr key={c.id}>
              <td>{c.id}</td><td>{c.full_name}</td><td>@{c.username}</td>
              <td>{c.status}</td><td>{c.challenge_status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{marginTop:32}}>Latest answers</h2>
      <table border={1} cellPadding={6}>
        <thead><tr>
          <th>Day</th><th>Citizen</th><th>Answer</th><th>When</th>
        </tr></thead>
        <tbody>
          {answers.map(a=>(
            <tr key={a.id}>
              <td>{a.day_no}</td>
              <td>{a.citizen_id}</td>
              <td>{a.answer}</td>
              <td>{new Date(a.watched_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
