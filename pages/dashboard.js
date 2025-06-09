// pages/dashboard.js
import { supabase } from '../lib/supabase';
import { parse }    from 'cookie';

const ADMINS = [1199933222];    // ← ваши telegram-id

export async function getServerSideProps({ req }) {
  const { tg } = parse(req.headers.cookie || '');
  let uid = null;
  if (tg) { try{ uid = JSON.parse(Buffer.from(tg,'base64').toString()).id }catch{} }

  if (!ADMINS.includes(uid)){
    return { props:{ allowed:false } };
  }

  const { data:citizens=[] } = await supabase
        .from('citizens')
        .select('id,full_name,username,status,challenge_status');

  const { data:answers=[] }  = await supabase
        .from('daily_progress')
        .select('citizen_id,day_no,answer,watched_at')
        .order('watched_at',{ascending:false})
        .limit(40);

  return { props:{ allowed:true, citizens, answers } };
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