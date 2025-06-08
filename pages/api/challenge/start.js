// pages/api/challenge/start.js
import { supabase } from '../../../lib/supabase'
import { parse } from 'cookie'

export default async function handler (req, res) {
  if (req.method!=='POST') return res.status(405).end()

  const { cid } = parse(req.headers.cookie||'')
  if (!cid) return res.status(401).json({error:'not-auth'})

  const { error } = await supabase
    .from('citizens')
    .update({ challenge_status:'active' })
    .eq('id', cid)

  if (error) return res.status(500).json({error:error.message})
  res.json({ ok:true })
}
