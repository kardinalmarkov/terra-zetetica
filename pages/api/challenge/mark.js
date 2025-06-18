// pages/api/challenge/mark.js  v2.3  21 Jun 2025
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ ok:false, error:'method-not-allowed' });

  const { cid, tg } = req.cookies;
  if (!cid || !tg)
    return res.status(401).json({ ok:false, error:'not-auth' });

  const { day, note = '', saveOnly = false } = req.body;
  if (!day || day < 1 || day > 14)
    return res.status(400).json({ ok:false, error:'bad-day' });

  /* ищем строку прогресса ------------------------------------------------- */
  const { data: row, error: e0 } = await supabase
        .from('daily_progress')
        .select('id, watched_at')
        .match({ citizen_id: cid, day_no: day })
        .maybeSingle();
  if (e0) return res.status(500).json({ ok:false, error:e0.message });

  /* INSERT или UPDATE ----------------------------------------------------- */
  if (!row) {
    // ← первая фиксация дня
    const { error: e1 } = await supabase.from('daily_progress').insert({
      citizen_id: cid,
      day_no    : day,
      watched_at: saveOnly ? null : new Date(),   // saveOnly → заметка без закрытия
      notes     : note.trim()
    });
    if (e1) return res.status(500).json({ ok:false, error:e1.message });
  } else {
    const patch = { notes: note.trim() };
    if (!row.watched_at && !saveOnly) patch.watched_at = new Date();
    const { error: e2 } = await supabase
          .from('daily_progress')
          .update(patch).eq('id', row.id);
    if (e2) return res.status(500).json({ ok:false, error:e2.message });
  }

  /* закрываем челлендж после 14-го --------------------------------------- */
  if (day === 14 && !saveOnly) {
    await supabase.from('citizens').update({
      challenge_finished_at: new Date(),
      challenge_status     : 'finished'
    }).eq('id', cid);
  }

  res.json({ ok:true });
}
