// pages/api/challenge/start.js
import { parse } from 'cookie'
import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  const { cid } = parse(req.headers.cookie || '')
  if (!cid) return res.status(401).json({ ok:false, err:'unauth' })

  // активируем челлендж
  const { error } = await supabase
    .from('citizens')
    .update({ challenge_status: 'active' })
    .eq('id', cid)

  if (error) return res.status(500).json({ ok:false, err:error.message })
  res.json({ ok:true })
}
