// pages/api/challenge/mark.js                 v2.1 • 20 Jun 2025
//
// POST /api/challenge/mark   { day, note?, saveOnly? }
// ────────────────────────────────────────────────────────────────
// • watched_at — только первый раз, иначе не трогаем (тайм-ауты!)
// • заметку можно изменять сколько угодно (saveOnly:true)
// • на 14-м дне → challenge_finished_at + status='finished'
//
// NB: статус 'guest' / 'valid' не меняем – админ решает сам
//----------------------------------------------------------------

import { parse }    from 'cookie'
import { supabase } from '../../../lib/supabase'

export default async function handler (req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ ok:false, error:'method-not-allowed' })

  const { cid } = parse(req.headers.cookie ?? '')
  if (!cid) return res.status(401).json({ ok:false, error:'not-auth' })

  const { day, note = '', saveOnly = false } = req.body
  if (!Number.isInteger(day) || day < 1 || day > 14)
    return res.status(400).json({ ok:false, error:'bad-day' })

  /* 1.  есть ли запись? */
  const { data: row, error:e0 } = await supabase
    .from('daily_progress')
    .select('id, watched_at')
    .match({ citizen_id:cid, day_no:day })
    .maybeSingle()
  if (e0) return res.status(500).json({ ok:false, error:e0.message })

  /* 2.  insert (первый визит) */
  if (!row) {
    const { error } = await supabase.from('daily_progress').insert({
      citizen_id: cid,
      day_no    : day,
      watched_at: saveOnly ? null : new Date(),
      notes     : note.trim() || null
    })
    if (error) return res.status(500).json({ ok:false, error:error.message })

  /* 3.  update (заметка +/- watched_at) */
  } else {
    if (note.trim()) {
      const { error } = await supabase
        .from('daily_progress')
        .update({ notes: note.trim() })
        .eq('id', row.id)
      if (error) return res.status(500).json({ ok:false, error:error.message })
    }
    if (!row.watched_at && !saveOnly) {
      const { error } = await supabase
        .from('daily_progress')
        .update({ watched_at:new Date() })
        .eq('id', row.id)
      if (error) return res.status(500).json({ ok:false, error:error.message })
    }
  }

  /* 4.  завершаем челлендж на 14-м дне */
  if (day === 14 && !saveOnly) {
    await supabase
      .from('citizens')
      .update({
        challenge_finished_at: new Date(),
        challenge_status     : 'finished'
      })
      .eq('id', cid)
  }

  res.json({ ok:true })
}
