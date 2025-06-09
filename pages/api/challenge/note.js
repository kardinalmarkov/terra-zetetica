// pages/api/challenge/note.js
import { parse } from 'cookie'
import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { cid } = parse(req.headers.cookie || '')
    const { day, note } = req.body
    if (!cid || !day) throw new Error('bad-request')

    const { error } = await supabase
      .from('daily_progress')
      .update({ notes: note })
      .match({ citizen_id: cid, day_no: day })

    if (error) throw error
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.json({ ok: false, err: e.message })
  }
}
