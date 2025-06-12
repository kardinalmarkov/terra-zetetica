// pages/api/challenge/mark.js
// v1.2 • 18 Jun 2025
//
//  ▸ watched_at пишем ТОЛЬКО при первом сохранении
//  ▸ update меняет заметку, но не трогает дату
//  ▸ путь к supabase — два уровня вверх из /pages/api/*

import { supabase } from '../../../lib/supabase'

export default async function handler (req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ ok:false, error:'method-not-allowed' })

  const { cid, tg } = req.cookies
  if (!cid || !tg)
    return res.status(401).json({ ok:false, error:'not-auth' })

  const { day, note = '' } = req.body
  if (!day || day < 1 || day > 14)
    return res.status(400).json({ ok:false, error:'bad-day' })

  /* есть ли уже строка? */
  const { data: row, error } = await supabase
    .from('daily_progress')
    .select('id')
    .match({ citizen_id: cid, day_no: day })
    .maybeSingle()

  if (error)
    return res.status(500).json({ ok:false, error:error.message })

  if (!row) {
    // ⟶ первое нажатие «Материал изучен»
    const { error: e } = await supabase.from('daily_progress').insert({
      citizen_id : cid,
      day_no     : day,
      watched_at : new Date(),
      notes      : note.trim()
    })
    if (e) return res.status(500).json({ ok:false, error:e.message })
  } else {
    // ⟶ день уже есть — правим только заметку
    const { error: e } = await supabase
      .from('daily_progress')
      .update({ notes: note.trim() })
      .eq('id', row.id)
    if (e) return res.status(500).json({ ok:false, error:e.message })
  }

  res.json({ ok:true })
}
