// pages/api/feedback.js
import { parse } from 'cookie'
import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { cid } = parse(req.headers.cookie||'')
  const { text } = req.body
  if (!cid || !text) return res.status(400).end()

  const { error } = await supabase
    .from('feedback')
    .insert({ citizen_id: cid, text })

  if (error) return res.status(500).end(error.message)
  res.json({ ok:true })
}
