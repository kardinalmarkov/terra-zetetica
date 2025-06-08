// pages/api/challenge/watch.js
import { supabase } from '../../../lib/supabase'
import { parse } from 'cookie'

export default async function handler (req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  const { tg, cid } = parse(req.headers.cookie || '')
  if (!tg || !cid) return res.status(401).send('Not auth')

  const { day } = req.body          // { day: 3 }
  if (!day) return res.status(400).send('No day')

  // пишем progress
  await supabase.from('daily_progress')
    .insert({ citizen_id: Number(cid), day_no: day })

  // последний день → finished
  if (day === 14) {
    await supabase.from('citizens')
      .update({ challenge_status:'finished' })
      .eq('id', cid)
  }

  res.json({ ok:true })
}
