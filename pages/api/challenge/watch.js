// pages/api/challenge/watch.js
import { supabase } from '../../../lib/supabase'
import { parse } from 'cookie'

export default async function handler (req, res) {
  if (req.method!=='POST') return res.status(405).end()
  const { cid } = parse(req.headers.cookie||'')
  const { day } = req.body
  if (!cid || !day) return res.status(400).end()

  const { error } = await supabase
    .from('daily_progress')
    .upsert({ citizen_id:cid, day_no:day })

  if (error) return res.status(500).json({ error:error.message })
  res.json({ ok:true })
}
