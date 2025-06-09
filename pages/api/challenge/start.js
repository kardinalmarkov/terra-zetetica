// pages/api/challenge/start.js
import { parse }    from 'cookie';
import { supabase } from '../../../lib/supabase';

export default async function handler (req, res) {
  const { tg } = parse(req.headers.cookie || '');
  if (!tg) return res.status(401).send('Not auth');

  const { id } = JSON.parse(Buffer.from(tg,'base64').toString());

  const fast = req.method === 'GET' && req.query.debug === 'fast';

  await supabase
    .from('citizens')
    .update({ challenge_status:'active' })
    .eq('telegram_id', id);

  if (fast) {
    const rows = Array.from({length:14},(_,i)=>({
      citizen_id : id,
      day_no     : i+1,
      answer     : 'debug-auto'
    }));
    await supabase.from('daily_progress').upsert(rows);
  }

  res.json({ ok:true, fast });
}
