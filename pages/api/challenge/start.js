// pages/api/challenge/start.js
import { parse }    from 'cookie'
import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { cid, sb_jwt } = parse(req.headers.cookie||'')
  if (!cid || !sb_jwt) return res.status(401).json({ err:'Not auth' })

  // активируем челлендж
  await supabase
    .from('citizens')
    .update({ challenge_status:'active' })
    .eq('id', cid)

  res.json({ ok:true })
}
