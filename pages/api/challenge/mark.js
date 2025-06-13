// pages/api/challenge/mark.js  1.6
import { parse }    from 'cookie'
import { supabase } from '../../../lib/supabase.js'

export default async function handler (req, res) {
  /* 1. метод ----------------------------------------------------------- */
  if (req.method !== 'POST')
    return res.status(405).json({ ok:false, error:'method-not-allowed' })

  /* 2. авторизация ----------------------------------------------------- */
  const { cid, tg } = parse(req.headers.cookie ?? '')
  if (!cid || !tg)
    return res.status(401).json({ ok:false, error:'not-auth' })

  /* 3. входные данные -------------------------------------------------- */
  const { day, note = '', saveOnly = false } = req.body
  if (!Number.isInteger(day) || day < 1 || day > 14)
    return res.status(400).json({ ok:false, error:'bad-day' })

  /* 4. проверяем, есть ли уже запись ---------------------------------- */
  const { data:row, error:e0 } = await supabase
    .from('daily_progress')
    .select('id, watched_at')
    .match({ citizen_id:cid, day_no:day })
    .maybeSingle()

  if (e0)
    return res.status(500).json({ ok:false, error:e0.message })

  /* 5-А. записи нет  →  INSERT ---------------------------------------- */
  if (!row) {
    const { error:e1 } = await supabase
      .from('daily_progress')
      .insert({
        citizen_id : cid,
        day_no     : day,
        watched_at : saveOnly ? null : new Date(),
        notes      : note.trim() || null
      })
    if (e1) return res.status(500).json({ ok:false, error:e1.message })

  /* 5-Б. запись есть  →  UPDATE notes + (опционально) watched_at ------- */
  } else {
    /* обновляем заметку */
    if (note.trim()) {
      const { error:e2 } = await supabase
        .from('daily_progress')
        .update({ notes: note.trim() })
        .eq('id', row.id)
      if (e2) return res.status(500).json({ ok:false, error:e2.message })
    }

    /* если впервые нажали «Я изучил…» */
    if (!row.watched_at && !saveOnly) {
      const { error:e3 } = await supabase
        .from('daily_progress')
        .update({ watched_at: new Date() })
        .eq('id', row.id)
      if (e3) return res.status(500).json({ ok:false, error:e3.message })
    }
  }

  /* 6. завершаем челлендж на 14-м дне --------------------------------- */
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
