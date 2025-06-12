// pages/api/challenge/mark.js
import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  const { cid, tg } = req.cookies;
  if (!cid || !tg) return res.status(401).json({ ok:false, error:'not-auth' });

  const { day, note = '', saveOnly = false } = req.body;

  // ищем существующую запись
  const { data: row } = await supabase
        .from('daily_progress')
        .select('id, watched_at')
        .match({ citizen_id: cid, day_no: day })
        .maybeSingle();

  if (!row) {
    // первый раз закрываем день
    await supabase.from('daily_progress').insert({
      citizen_id: cid,
      day_no    : day,
      watched_at: new Date(),             // фиксируем «момент прохождения»
      notes     : note.trim()
    });
  } else {
    // уже был – меняем ТОЛЬКО заметку
    await supabase.from('daily_progress')
      .update({ notes: note.trim() })
      .eq('id', row.id);
  }

  res.json({ ok:true });
}
