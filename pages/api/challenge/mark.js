// pages/api/challenge/mark.js
import { parse } from 'cookie'
import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { cid } = parse(req.headers.cookie || '')
  const { dayNo, notes = '' } = req.body

  if (!cid || !dayNo) return res.status(400).json({ ok:false, err:'bad-request' })

  // upsert прогресса
  const { error } = await supabase
    .from('daily_progress')
    .upsert({
      citizen_id:  cid,
      day_no:      dayNo,
      notes,
      watched_at:  new Date()
    }, { onConflict: 'citizen_id,day_no' })

  if (error) return res.status(500).json({ ok:false, err:error.message })
  res.json({ ok:true })
}
