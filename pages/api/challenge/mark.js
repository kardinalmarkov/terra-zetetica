// pages/api/challenge/mark.js           v 1.5
// • watched_at пишется ОДИН раз (при первом закрытии дня)
// • заметку можно редактировать сколько угодно
// • если day === 14  →  challenge_finished_at + статус 'finished'
// ------------------------------------------------------------

import { parse }     from 'cookie';
import { supabase }  from '../../../lib/supabase.js';

export default async function handler(req, res) {
  /* ─ 1. METHOD ─────────────────────────────────────────── */
  if (req.method !== 'POST')
    return res.status(405).json({ ok:false, error:'method-not-allowed' });

  /* ─ 2. AUTH ───────────────────────────────────────────── */
  const { cid, tg } = parse(req.headers.cookie ?? '');
  if (!cid || !tg)
    return res.status(401).json({ ok:false, error:'not-auth' });

  /* ─ 3. PAYLOAD ────────────────────────────────────────── */
  const { day, note = '', saveOnly = false } = req.body;
  if (!Number.isInteger(day) || day < 1 || day > 14)
    return res.status(400).json({ ok:false, error:'bad-day' });

  /* ─ 4. EXISTING ROW? ─────────────────────────────────── */
  const { data: row, error } = await supabase
    .from('daily_progress')
    .select('id, watched_at')
    .match({ citizen_id: cid, day_no: day })
    .maybeSingle();

  if (error)
    return res.status(500).json({ ok:false, error:error.message });

  /* ─ 5. INSERT / UPDATE ───────────────────────────────── */
  if (!row) {
    // первый раз заходим на этот день
    const { error: e1 } = await supabase
      .from('daily_progress')
      .insert({
        citizen_id : cid,
        day_no     : day,
        watched_at : saveOnly ? null : new Date(), // таймер ставим только при «Я изучил»
        notes      : note.trim() || null
      });
    if (e1) return res.status(500).json({ ok:false, error:e1.message });

  } else {
    // день уже существует -> обновляем только notes
    const { error: e2 } = await supabase
      .from('daily_progress')
      .update({ notes: note.trim() || null })
      .eq('id', row.id);
    if (e2) return res.status(500).json({ ok:false, error:e2.message });

    /* если первый раз нажали "Я изучил" (watched_at ещё NULL) */
    if (!row.watched_at && !saveOnly) {
      await supabase
        .from('daily_progress')
        .update({ watched_at: new Date() })
        .eq('id', row.id);
    }
  }

  /* ─ 6. FINISH on day 14 ──────────────────────────────── */
  if (day === 14 && !saveOnly) {
    await supabase
      .from('citizens')
      .update({
        challenge_finished_at: new Date(),
        challenge_status     : 'finished'
      })
      .eq('id', cid);
  }

  res.json({ ok:true });
}
