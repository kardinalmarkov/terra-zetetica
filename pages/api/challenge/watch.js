// pages/api/challenge/watch.js
import { supabase } from '../../../lib/supabase';
import { parse }    from 'cookie';

export default async function handler (req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { tg , cid } = parse(req.headers.cookie || '');
  if (!tg || !cid)     return res.status(401).end();

  const { day, reply='' } = req.body;          // reply сохраняем «как есть»
  if (!day) return res.status(400).end();

  await supabase                               // фиксируем прогресс
    .from('daily_progress')
    .upsert({
      citizen_id : Number(cid),
      day_no     : Number(day),
      answer     : reply
    });

  if (+day === 14) {                           // финиш челленджа
    await supabase
      .from('citizens')
      .update({ challenge_status:'finished' })
      .eq('id', cid);
  }

  res.json({ ok:true });
}