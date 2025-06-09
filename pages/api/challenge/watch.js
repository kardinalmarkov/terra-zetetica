// pages/api/challenge/watch.js
import { supabase } from '../../../lib/supabase';
import { parse }    from 'cookie';

export default async function handler (req, res) {
  if (req.method !== 'POST') return res.json({ ok:false, err:'method' });

  const { tg , cid } = parse(req.headers.cookie || '');
  if (!tg || !cid)     return res.json({ ok:false, err:'auth' });

  const { day, reply='' } = req.body;
  if (!day)             return res.json({ ok:false, err:'bad day' });

  // просто upsert без проверки ответа
  await supabase.from('daily_progress').upsert({
    citizen_id : Number(cid),
    day_no     : Number(day),
    answer     : reply
  });

  if (+day === 14) {
    await supabase
      .from('citizens')
      .update({ challenge_status:'finished' })
      .eq('id', cid);
  }

  res.json({ ok:true });
