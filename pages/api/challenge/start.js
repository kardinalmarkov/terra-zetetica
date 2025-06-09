// pages/api/challenge/start.js
import { parse }    from 'cookie';
import { supabase } from '../../../lib/supabase';

export default async function handler (req, res) {
  const { tg , cid } = parse(req.headers.cookie || '');
  if (!tg || !cid) return res.status(401).send('Not auth');

  const fast = req.method==='GET' && req.query.debug==='fast';

  await supabase                                    // активируем челлендж
    .from('citizens')
    .update({ challenge_status:'active' })
    .eq('id', cid);

  if (fast) {                                      // 14 строк одним апсертом
    const rows = Array.from({length:14}, (_,i)=>({
      citizen_id : Number(cid),
      day_no     : i+1,
      answer     : 'debug'      // пометка
    }));
    await supabase.from('daily_progress').upsert(rows);
  }

  res.json({ ok:true, fast });
}