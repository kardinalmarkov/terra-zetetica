// pages/api/challenge/mark.js               v1.4 • 20 Jun 2025
//
// POST { day:int (1-14), note?:string, saveOnly?:boolean }
//
// • watched_at записывается только при ПЕРВОМ вызове для дня
// • challenge_finished_at + статус “finished” — когда day === 14
//

import { supabase } from '../../../lib/supabase'
import { parse }    from 'cookie'

export default async function handler (req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ ok:false, error:'method-not-allowed' })

  /* 1. auth ----------------------------------------------------------- */
  const { cid, tg } = parse(req.headers.cookie || '')
  if (!cid || !tg)
    return res.status(401).json({ ok:false, error:'not-auth' })

  /* 2. payload -------------------------------------------------------- */
  const { day, note = '' } = req.body
  if (!day || day < 1 || day > 14)
    return res.status(400).json({ ok:false, error:'bad-day' })

  /* 3. progress row --------------------------------------------------- */
  const { data: row, error } = await supabase
    .from('daily_progress')
    .select('id, watched_at')
    .match({ citizen_id: cid, day_no: day })
    .maybeSingle()

  if (error)
    return res.status(500).json({ ok:false, error:error.message })

  /* 4. insert / update ------------------------------------------------ */
  if (!row) {
    // первый заход на этот день
    const { error: e1 } = await supabase
      .from('daily_progress')
      .insert({
        citizen_id: cid,
        day_no    : day,
        watched_at: new Date(),
        notes     : note.trim() || null
      })

    if (e1) return res.status(500).json({ ok:false, error:e1.message })
  } else {
    // день уже был — обновляем только заметку
    const { error: e2 } = await supabase
      .from('daily_progress')
      .update({ notes: note.trim() || null })
      .eq('id', row.id)

    if (e2) return res.status(500).json({ ok:false, error:e2.message })
  }

  /* 5. финиш челленджа ----------------------------------------------- */
  if (day === 14) {
    await supabase
      .from('citizens')
      .update({
        challenge_finished_at: supabase.rpc ? supabase.rpc('now') : new Date(),
        challenge_status     : 'finished'
      })
      .eq('id', cid)
  }

  res.json({ ok:true })
}
