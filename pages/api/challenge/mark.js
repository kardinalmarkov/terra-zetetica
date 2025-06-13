// pages/api/challenge/mark.js           v1.3 • 19 Jun 2025
//
// •  POST { day:int (1-14), note?:string, saveOnly?:boolean }
// •  watched_at ставится ТОЛЬКО при первом вызове для дня
// •  challenge_finished_at заполняется автоматически после дня-14
//

import { supabase } from '../../../lib/supabase'   // <— относительный путь!

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ ok:false, error:'method-not-allowed' })

  /* 1. Авторизация из cookie ------------------------------------------------ */
  const { cid, tg } = req.cookies
  if (!cid || !tg)
    return res.status(401).json({ ok:false, error:'not-auth' })

  /* 2. Параметры запроса ---------------------------------------------------- */
  const { day, note = '' } = req.body
  if (!day || day < 1 || day > 14)
    return res.status(400).json({ ok:false, error:'bad-day' })

  /* 3. Ищем существующую строку -------------------------------------------- */
  const { data: row, error } = await supabase
    .from('daily_progress')
    .select('id, watched_at')
    .match({ citizen_id: cid, day_no: day })
    .maybeSingle()

  if (error)
    return res.status(500).json({ ok:false, error:error.message })

  /* 4. INSERT или UPDATE ---------------------------------------------------- */
  if (!row) {
    const { error: e } = await supabase.from('daily_progress').insert({
      citizen_id: cid,
      day_no    : day,
      watched_at: new Date(),          // фиксируем время ПЕРВОГО прохождения
      notes     : note.trim() || null
    })
    if (e) return res.status(500).json({ ok:false, error:e.message })

    /* если это был день-14 → отмечаем финиш в citizens */
    if (day === 14) {
      await supabase.from('citizens')
        .update({ challenge_finished_at: new Date(),
                  challenge_status     : 'finished' })
        .eq('id', cid)
    }
  } else {
    const { error: e } = await supabase
      .from('daily_progress')
      .update({ notes: note.trim() || null })
      .eq('id', row.id)
    if (e) return res.status(500).json({ ok:false, error:e.message })
  }

  res.json({ ok:true })
}
