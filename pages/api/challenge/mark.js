// pages/api/challenge/mark.js
// v1.1 • 17 Jun 2025
//
//  ▸ защита тайм-аутов: watched_at ставится ТОЛЬКО при первом сохранении
//  ▸ upsert → «одно из двух»: либо insert c датой, либо update без даты
//

import { supabase } from '../../lib/supabase'   // ← два уровня вверх из /pages/api/*

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ ok: false, error: 'method-not-allowed' });

  const { cid, tg } = req.cookies;
  if (!cid || !tg)
    return res.status(401).json({ ok: false, error: 'not-auth' });

  const { day, note = '' } = req.body;
  if (!day || day < 1 || day > 14)
    return res.status(400).json({ ok: false, error: 'bad-day' });

  /* ---- ищем существующую строку ----------------------------------- */
  const { data: row, error } = await supabase
    .from('daily_progress')
    .select('id')
    .match({ citizen_id: cid, day_no: day })
    .maybeSingle();

  if (error) return res.status(500).json({ ok: false, error: error.message });

  if (!row) {
    // ⇢ первый проход дня – создаём новую строку + фиксируем время
    const { error: e } = await supabase.from('daily_progress').insert({
      citizen_id: cid,
      day_no:     day,
      watched_at: new Date(),          // ❗ фиксируем “вчера/сегодня”
      notes:      note.trim()
    });
    if (e) return res.status(500).json({ ok: false, error: e.message });
  } else {
    // ⇢ день уже закрыт – обновляем ТОЛЬКО заметку
    const { error: e } = await supabase
      .from('daily_progress')
      .update({ notes: note.trim() })
      .eq('id', row.id);
    if (e) return res.status(500).json({ ok: false, error: e.message });
  }

  res.json({ ok: true });
}
